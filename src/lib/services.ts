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
}

export const services: ServiceDefinition[] = [
  { key: "ci_cd", slug: "ci-cd", icon: GitBranch },
  { key: "kubernetes", slug: "kubernetes", icon: Container },
  { key: "cloud", slug: "cloud", icon: Cloud },
  { key: "monitoring", slug: "monitoring", icon: Activity },
  { key: "security", slug: "security", icon: ShieldCheck },
  { key: "networking", slug: "networking", icon: Network },
  { key: "linux", slug: "linux", icon: Server },
  { key: "consulting", slug: "consulting", icon: MessagesSquare },
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
