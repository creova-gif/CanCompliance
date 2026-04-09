export const DEMO_SESSION_KEY = "cancompliance_demo_role";

export const DEMO_USERS: Record<string, { displayName: string; email: string; initials: string }> = {
  "Compliance Officer": {
    displayName: "Alex Chen",
    email: "demo-compliance@cancompliance.ca",
    initials: "A",
  },
  "Auditor": {
    displayName: "Jordan Lee",
    email: "demo-auditor@cancompliance.ca",
    initials: "J",
  },
  "Business Owner": {
    displayName: "Sam Rivera",
    email: "demo-owner@cancompliance.ca",
    initials: "S",
  },
};

export function getDemoRole(): string | null {
  try {
    return sessionStorage.getItem(DEMO_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setDemoRole(role: string) {
  try {
    sessionStorage.setItem(DEMO_SESSION_KEY, role);
  } catch {}
}

export function clearDemoRole() {
  try {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  } catch {}
}

export function getDemoUser() {
  const role = getDemoRole();
  if (!role || !DEMO_USERS[role]) return null;
  return { role, ...DEMO_USERS[role] };
}
