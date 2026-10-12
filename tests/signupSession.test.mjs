import test from "node:test";
import assert from "node:assert/strict";
import { completeSignupSession } from "../src/features/auth/services/signupSession.js";

const profile = { id: 42, email: "reader@example.com", role: "READER" };
const credentials = { email: profile.email, password: "memory-only-password" };

test("signup uses the cookie session without submitting credentials again", async () => {
  const authenticated = await completeSignupSession({
    profile, credentials,
    establishSession: async (data) => {
      assert.equal(data, profile);
      return true;
    },
    login: async () => assert.fail("Login should not run when cookies restore the session"),
  });
  assert.equal(authenticated, true);
});

test("older backends sign in automatically and restore the returned session", async () => {
  const loggedInProfile = { ...profile, verified: true };
  const attempts = [];
  const authenticated = await completeSignupSession({
    profile, credentials,
    establishSession: async (data) => {
      attempts.push(data);
      return data === loggedInProfile;
    },
    login: async (data) => {
      assert.deepEqual(data, credentials);
      return { ok: true, messageStatus: "SUCCESS", data: loggedInProfile };
    },
  });
  assert.equal(authenticated, true);
  assert.deepEqual(attempts, [profile, loggedInProfile]);
});

test("a failed automatic login never establishes an authenticated session", async () => {
  let sessionAttempts = 0;
  const authenticated = await completeSignupSession({
    profile, credentials,
    establishSession: async () => { sessionAttempts++; return false; },
    login: async () => ({ ok: false, messageStatus: "ERROR", data: profile }),
  });
  assert.equal(authenticated, false);
  assert.equal(sessionAttempts, 1);
});

test("missing cookies and credentials leave signup unauthenticated", async () => {
  assert.equal(await completeSignupSession({
    profile,
    establishSession: async () => false,
    login: async () => assert.fail("Cannot login without credentials"),
  }), false);
});

test("successful login still requires a restored session", async () => {
  assert.equal(await completeSignupSession({
    profile, credentials,
    establishSession: async () => false,
    login: async () => ({ ok: true, messageStatus: "SUCCESS", data: profile }),
  }), false);
});
