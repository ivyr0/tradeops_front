export function normalizeRole(role) {
  if (!role) return null;
  if (role.startsWith("ROLE_")) return role;
  return `ROLE_${role}`;
}

export function hasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles?.length) return true;
  const role = normalizeRole(user?.role);
  return allowedRoles.some((r) => normalizeRole(r) === role);
}

