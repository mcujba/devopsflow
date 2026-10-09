import { Link } from "@/i18n/navigation";

export function Socket({ className = "" }: { className?: string }) {
  return <span className={`socket ${className}`.trim()} aria-hidden="true" />;
}

export function PortLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group block min-h-11 text-center">
      <Socket />
      <span className="engraved mt-1.5 block tracking-[0.1em] group-hover:text-ink">{label}</span>
    </Link>
  );
}
