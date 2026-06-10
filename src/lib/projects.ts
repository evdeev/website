import type { Project } from './domain';

export function sortProjectsByDate(projects: Project[]): Project[] {
  return projects.sort((a, b) => b.created.valueOf() - a.created.valueOf());
}
