import { verifySessionToken, SessionPayload } from "./auth";

export function getSessionFromRequest(request: Request): SessionPayload | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/ss_session=([^;]+)/);
  if (!match) return null;
  return verifySessionToken(match[1]);
}
