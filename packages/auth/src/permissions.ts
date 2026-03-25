export type Permission =
  | "workspace.read"
  | "workspace.write"
  | "connectors.manage"
  | "skills.manage"
  | "tools.run";

export function hasPermission(permissions: Permission[], target: Permission) {
  return permissions.includes(target);
}
