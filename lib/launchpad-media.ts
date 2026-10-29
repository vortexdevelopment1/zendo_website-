import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ZendoError } from "./errors";

export const TOKEN_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const TYPES = {
  "image/png": { ext: "png", magic: (bytes: Uint8Array) => bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index]) },
  "image/jpeg": { ext: "jpg", magic: (bytes: Uint8Array) => bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 },
  "image/gif": { ext: "gif", magic: (bytes: Uint8Array) => new TextDecoder().decode(bytes.slice(0, 6)) === "GIF87a" || new TextDecoder().decode(bytes.slice(0, 6)) === "GIF89a" },
  "image/webp": { ext: "webp", magic: (bytes: Uint8Array) => new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP" },
} as const;

type ImageType = (typeof TYPES)[keyof typeof TYPES];
const OBJECT_PREFIX = "token-images/";

function imageDir() {
  return process.env.ZENDO_LAUNCHPAD_IMAGE_DIR?.trim() || path.join(process.cwd(), "data", "launchpad-images");
}

function safeId(id: string) {
  if (!/^[a-f0-9-]+\.(png|jpg|gif|webp)$/.test(id)) throw new ZendoError("That token image is unavailable.", 404);
  return id;
}

function objectKey(id: string) {
  return `${OBJECT_PREFIX}${safeId(id)}`;
}

function s3Client(): { client: S3Client; bucket: string } | null {
  const endpoint = process.env.ZENDO_MEDIA_S3_ENDPOINT?.trim();
  const region = process.env.ZENDO_MEDIA_S3_REGION?.trim();
  const bucket = process.env.ZENDO_MEDIA_S3_BUCKET?.trim();
  const accessKeyId = process.env.ZENDO_MEDIA_S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.ZENDO_MEDIA_S3_SECRET_ACCESS_KEY?.trim();
  const configured = [endpoint, region, bucket, accessKeyId, secretAccessKey].filter(Boolean).length;
  if (configured === 0 && process.env.NODE_ENV !== "production") return null;
  if (configured !== 5) throw new Error("Token image object storage is not configured.");
  const required = { endpoint: endpoint!, region: region!, bucket: bucket!, accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! };
  return {
    client: new S3Client({ endpoint: required.endpoint, region: required.region, credentials: { accessKeyId: required.accessKeyId, secretAccessKey: required.secretAccessKey } }),
    bucket: required.bucket,
  };
}

function localStorageAllowed() {
  return process.env.NODE_ENV !== "production" && !s3Client();
}

function imageType(fileType: string): ImageType {
  const type = TYPES[fileType as keyof typeof TYPES];
  if (!type) throw new ZendoError("Use a PNG, JPEG, GIF, or WebP image.");
  return type;
}

function validateImage(file: File): ImageType {
  const type = imageType(file.type);
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > TOKEN_IMAGE_MAX_BYTES) {
    throw new ZendoError("Token images must be smaller than 2 MB.");
  }
  return type;
}

async function putLocal(id: string, bytes: Uint8Array) {
  await mkdir(imageDir(), { recursive: true, mode: 0o700 });
  await writeFile(path.join(imageDir(), safeId(id)), bytes, { flag: "wx", mode: 0o600 });
}

export async function storeTokenImage(file: File): Promise<string> {
  const type = validateImage(file);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!type.magic(bytes)) throw new ZendoError("The uploaded file is not a valid image.");
  const id = `${randomUUID()}.${type.ext}`;
  const storage = s3Client();
  if (storage) {
    await storage.client.send(new PutObjectCommand({
      Bucket: storage.bucket,
      Key: objectKey(id),
      Body: bytes,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }));
  } else if (localStorageAllowed()) {
    await putLocal(id, bytes);
  } else {
    throw new Error("Token image object storage is not configured.");
  }
  return `/api/coins/media/${id}`;
}

export async function readTokenImage(id: string) {
  const storage = s3Client();
  if (storage) {
    const result = await storage.client.send(new GetObjectCommand({ Bucket: storage.bucket, Key: objectKey(id) }));
    if (!result.Body) throw new ZendoError("That token image is unavailable.", 404);
    return Buffer.from(await result.Body.transformToByteArray());
  }
  if (!localStorageAllowed()) throw new Error("Token image object storage is not configured.");
  return readFile(path.join(imageDir(), safeId(id)));
}

export function tokenImageType(id: string) {
  const ext = safeId(id).split(".").pop();
  return ext === "jpg" ? "image/jpeg" : `image/${ext}`;
}
