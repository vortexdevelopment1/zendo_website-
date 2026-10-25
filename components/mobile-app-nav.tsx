"use client";

import { CircleUserRound, Compass, CreditCard, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { api } from "@/lib/sdk";
import type { PublicUser } from "@/lib/types";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/app", signInHref: "/signin?next=%2Fapp", label: "Wallet", icon: CreditCard },
  { href: "/explorer", label: "Explore", icon: Compass },
  { href: "/app/settings", signInHref: "/signin?next=%2Fapp%2Fsettings", label: "Profile", icon: CircleUserRound },
];

const androidItems = [
  { href: "/mobile", label: "Home", icon: Home },
  // Android serves page documents from the local bundle. Server-protected
  // /app documents would be snapshotted as a guest redirect, so app-mode uses
  // local client-authenticated shells for the same existing views.
  { href: "/mobile/wallet", signInHref: "/signin?next=%2Fmobile%2Fwallet", label: "Wallet", icon: CreditCard },
  { href: "/mobile/explore", label: "Explore", icon: Compass },
  { href: "/mobile/profile", signInHref: "/signin?next=%2Fmobile%2Fprofile", label: "Profile", icon: CircleUserRound },
];

export function MobileAppNav({ authenticated }: { authenticated: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Keep the server-rendered website markup stable, then switch to the
  // local Android destinations after hydration. This makes the actual anchor
  // URLs app routes as well as retaining the pre-hydration click guard.
  const androidMode = useSyncExternalStore(
    () => () => {},
    () => document.documentElement.dataset.zendoApp === "android",
    () => false,
  );
  const [androidAuthenticated, setAndroidAuthenticated] = useState(authenticated);
  useEffect(() => {
    if (!androidMode) return;
    let active = true;
    api<{ user: PublicUser | null }>("/api/auth/me").then((result) => {
      if (active) setAndroidAuthenticated(Boolean(result.user));
    }).catch(() => {
      if (active) setAndroidAuthenticated(false);
    });
    return () => { active = false; };
  }, [androidMode, pathname]);
  const signInDestination = pathname === "/signin" ? searchParams.get("next") : null;
  const navigationItems = androidMode ? androidItems : items;
  return (
    <nav className="zendo-mobile-app-nav" aria-label="App navigation">
      {navigationItems.map(({ href, signInHref, label, icon: Icon }) => {
        const active = (href === "/" || href === "/mobile" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)) || signInDestination === href;
        return (
          <Link key={href} href={(androidMode ? androidAuthenticated : authenticated) ? href : signInHref || href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
