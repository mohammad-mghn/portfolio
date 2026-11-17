import type { ProjectSummary } from "./types";

/** Position (1-based) of a project in the list and the one after it (wrapping). */
export function projectNeighbours(projects: ProjectSummary[], slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { position: 0, next: null };
  return { position: i + 1, next: projects.length > 1 ? projects[(i + 1) % projects.length] : null };
}
