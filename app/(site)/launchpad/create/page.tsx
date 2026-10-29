import type { Metadata } from "next";
import { PageIntro } from "@/components/chrome";
import { CreateCoinForm } from "@/components/launchpad";

export const metadata: Metadata = { title: "Create a meme coin" };

export default function Page() {
  return (
    <div className="zendo-mx-auto zendo-max-w-3xl zendo-px-4 zendo-py-10">
      <PageIntro mark="coin" kicker="Launchpad" title="Create a meme coin" body="Launch a real curve-backed coin. Your wallet signs the 0.2 ZCoin creation transaction; no supply is reserved for the creator." />
      <CreateCoinForm />
    </div>
  );
}
