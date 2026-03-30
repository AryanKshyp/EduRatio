"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  className?: string;
  children: ReactNode;
};

export function GetStartedLink({ className, children }: Props) {
  return (
    <Link
      href="/dashboard#map"
      className={className}
      scroll={false}
      onClick={(e) => {
        e.preventDefault();
        const map = document.getElementById("map");
        if (map) {
          map.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", "#map");
        } else {
          window.location.href = "/dashboard#map";
        }
      }}
    >
      {children}
    </Link>
  );
}
