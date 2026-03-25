export interface SessionUser {
  id: string;
  email: string;
  workspaceIds: string[];
}

export async function getSessionUser(): Promise<SessionUser | null> {
  return null;
}
