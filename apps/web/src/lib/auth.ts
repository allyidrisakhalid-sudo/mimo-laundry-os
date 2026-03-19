export const ROLE_PORTAL_ROUTE = {
  CUSTOMER: "/app/customer",
  DRIVER: "/app/driver",
  HUB_STAFF: "/app/hub",
  AFFILIATE_STAFF: "/app/affiliate",
  AFFILIATE_ADMIN: "/app/affiliate",
  ADMIN: "/app/admin",
  DEV_ADMIN: "/app/dev",
} as const;

export type AppRole = keyof typeof ROLE_PORTAL_ROUTE;

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (!role) return null;
  const upper = role.toUpperCase();

  if (upper in ROLE_PORTAL_ROUTE) {
    return upper as AppRole;
  }

  return null;
}

export function getPortalRouteForRole(role: string | null | undefined) {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_PORTAL_ROUTE[normalized] : "/login";
}

export function isRoleAllowedForExpected(
  actualRole: string | null | undefined,
  expectedRole: string | null | undefined,
) {
  if (!expectedRole) return true;
  return normalizeRole(actualRole) === normalizeRole(expectedRole);
}
