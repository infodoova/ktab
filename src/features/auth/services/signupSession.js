/** Restores signup cookies first, with automatic login for older backends. */
export async function completeSignupSession({ profile, credentials, establishSession, login }) {
  if (await establishSession(profile)) return true;

  if (!credentials) return false;
  const response = await login(credentials);
  if (!response.ok || (response.messageStatus && response.messageStatus !== "SUCCESS")) {
    return false;
  }
  return establishSession(response.data);
}
