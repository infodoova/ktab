import test from "node:test";
import assert from "node:assert/strict";
import {
  isIOSDevice,
  getGoogleRedirectUri,
  getCachedGoogleNonce,
  resetGoogleNonceCache,
  parseUrlFragment,
  cleanGoogleRedirectUrl,
} from "../src/features/auth/utils/googleAuth.js";

test("isIOSDevice correctly identifies iPhone, iPad, iPod, and iPadOS desktop mode", () => {
  // 1. iPhone Safari
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
    }),
    true
  );

  // 2. iPhone Chrome (CriOS)
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
    }),
    true
  );

  // 3. iPad (legacy user agent)
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      platform: "iPad",
      maxTouchPoints: 5,
    }),
    true
  );

  // 4. iPadOS desktop mode (reports platform MacIntel + maxTouchPoints > 1)
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 5,
    }),
    true
  );

  // 5. Real macOS desktop (platform MacIntel + maxTouchPoints 0) -> FALSE
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      platform: "MacIntel",
      maxTouchPoints: 0,
    }),
    false
  );

  // 6. Android Phone -> FALSE
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
      platform: "Linux armv8l",
      maxTouchPoints: 5,
    }),
    false
  );

  // 7. Windows Desktop -> FALSE
  assert.equal(
    isIOSDevice({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      platform: "Win32",
      maxTouchPoints: 0,
    }),
    false
  );

  // 8. Null / undefined navigator -> FALSE
  assert.equal(isIOSDevice(null), false);
  assert.equal(isIOSDevice(undefined), false);
});

test("getGoogleRedirectUri constructs absolute URI correctly", () => {
  // Production absolute URL
  assert.equal(
    getGoogleRedirectUri("https://api.ktab.app/api/v1"),
    "https://api.ktab.app/api/v1/auth/google/redirect"
  );

  // Local development URL
  assert.equal(
    getGoogleRedirectUri("http://localhost:8080/api/v1"),
    "http://localhost:8080/api/v1/auth/google/redirect"
  );

  // Trailing slash handling
  assert.equal(
    getGoogleRedirectUri("https://api.ktab.app/api/v1/"),
    "https://api.ktab.app/api/v1/auth/google/redirect"
  );

  // Relative base with custom origin
  assert.equal(
    getGoogleRedirectUri("/api/v1", "https://ktab.app"),
    "https://ktab.app/api/v1/auth/google/redirect"
  );
});

test("getCachedGoogleNonce reuses promise and caches nonce across multiple invocations (StrictMode safe)", async () => {
  resetGoogleNonceCache();

  let callCount = 0;
  const mockFetcher = async () => {
    callCount += 1;
    return { ok: true, success: true, nonce: "test-nonce-12345" };
  };

  const [nonce1, nonce2, nonce3] = await Promise.all([
    getCachedGoogleNonce(mockFetcher),
    getCachedGoogleNonce(mockFetcher),
    getCachedGoogleNonce(mockFetcher),
  ]);

  assert.equal(callCount, 1, "fetcher should only be called once");
  assert.equal(nonce1, "test-nonce-12345");
  assert.equal(nonce2, "test-nonce-12345");
  assert.equal(nonce3, "test-nonce-12345");

  // Subsequent call also reuses cached promise
  const nonce4 = await getCachedGoogleNonce(mockFetcher);
  assert.equal(callCount, 1);
  assert.equal(nonce4, "test-nonce-12345");

  // Reset cache allows refetching
  resetGoogleNonceCache();
  const nonce5 = await getCachedGoogleNonce(mockFetcher);
  assert.equal(callCount, 2, "after reset, fetcher can be called again");
  assert.equal(nonce5, "test-nonce-12345");
});

test("parseUrlFragment extracts pending token and parameters from hash", () => {
  assert.deepEqual(parseUrlFragment("#pending=token_abc_123"), {
    pending: "token_abc_123",
  });

  assert.deepEqual(
    parseUrlFragment("#pending=token_xyz&redirect=/reader/library"),
    {
      pending: "token_xyz",
      redirect: "/reader/library",
    }
  );

  assert.deepEqual(parseUrlFragment(""), {});
  assert.deepEqual(parseUrlFragment("#"), {});
  assert.deepEqual(parseUrlFragment(null), {});
});

test("cleanGoogleRedirectUrl strips google parameter and hash fragment via replaceState", () => {
  let replacedUrl = null;
  globalThis.window = {
    location: {
      href: "https://ktab.app/login?google=success#pending=123",
      pathname: "/login",
      search: "?google=success",
      hash: "#pending=123",
    },
    history: {
      replaceState: (state, title, url) => {
        replacedUrl = url;
      },
    },
  };

  cleanGoogleRedirectUrl("https://ktab.app/login?google=success&redirect=/shelf#pending=123");
  assert.equal(replacedUrl, "/login?redirect=%2Fshelf");

  cleanGoogleRedirectUrl("https://ktab.app/login?google=pending#pending=secret_token");
  assert.equal(replacedUrl, "/login");
});
