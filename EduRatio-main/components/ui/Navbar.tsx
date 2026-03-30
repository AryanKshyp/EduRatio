import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full bg-[#2F4156] text-white shadow-[0_2px_12px_rgba(47,65,86,0.25)]">
      <div className="flex h-14 w-full items-center justify-between px-5 md:h-16 md:px-10 lg:px-14">
        <Link
          href="/dashboard"
          className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-[clamp(1.75rem,2.8vw,2.75rem)]"
        >
          Edu<span className="text-[#7ecfdd]">Ratio</span>
        </Link>
        <p className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-[clamp(1.75rem,2.8vw,2.75rem)]">
          Grade 8
        </p>
      </div>
    </header>
  );
}
