import {
  GitBranch,
  Container,
  Cloud,
  Activity,
  ShieldCheck,
  Network,
  Server,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export interface ServiceDefinition {
  key: string;
  slug: string;
  icon: LucideIcon;
  gradient: string;
  accentBg: string;
}

export const services: ServiceDefinition[] = [
  {
    key: "ci_cd",
    slug: "ci-cd",
    icon: GitBranch,
    gradient: "from-cyan-500 to-blue-500",
    accentBg: "bg-cyan-500/10",
  },
  {
    key: "kubernetes",
    slug: "kubernetes",
    icon: Container,
    gradient: "from-blue-500 to-violet-500",
    accentBg: "bg-blue-500/10",
  },
  {
    key: "cloud",
    slug: "cloud",
    icon: Cloud,
    gradient: "from-violet-500 to-purple-500",
    accentBg: "bg-violet-500/10",
  },
  {
    key: "monitoring",
    slug: "monitoring",
    icon: Activity,
    gradient: "from-emerald-500 to-cyan-500",
    accentBg: "bg-emerald-500/10",
  },
  {
    key: "security",
    slug: "security",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-orange-500",
    accentBg: "bg-rose-500/10",
  },
  {
    key: "networking",
    slug: "networking",
    icon: Network,
    gradient: "from-amber-500 to-yellow-500",
    accentBg: "bg-amber-500/10",
  },
  {
    key: "linux",
    slug: "linux",
    icon: Server,
    gradient: "from-teal-500 to-emerald-500",
    accentBg: "bg-teal-500/10",
  },
  {
    key: "consulting",
    slug: "consulting",
    icon: MessagesSquare,
    gradient: "from-indigo-500 to-blue-500",
    accentBg: "bg-indigo-500/10",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(
  slug: string,
  count = 3,
): ServiceDefinition[] {
  const maxCount = Math.min(count, services.length - 1);
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) return services.slice(0, maxCount);

  const related: ServiceDefinition[] = [];
  for (let i = 1; related.length < maxCount; i++) {
    related.push(services[(index + i) % services.length]);
  }
  return related;
}
