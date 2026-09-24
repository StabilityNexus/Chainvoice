import {
  TERMS_STORAGE_KEY,
  hasAcceptedTermsToday,
  recordTermsAcceptance,
  utcDayKey,
} from "../../src/utils/termsOfUse.js";

function createStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    data,
  };
}

const throwingStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

describe("utcDayKey", () => {
  test("uses the UTC date, not the local one", () => {
    // 23:30 on the 24th in UTC is already the 25th in India (UTC+5:30).
    expect(utcDayKey(new Date("2026-09-24T23:30:00Z"))).toBe("2026-09-24");
    expect(utcDayKey(new Date("2026-09-24T23:30:00-05:30"))).toBe("2026-09-25");
  });
});

describe("hasAcceptedTermsToday", () => {
  test("is false when nothing has been stored", () => {
    expect(hasAcceptedTermsToday(createStorage())).toBe(false);
  });

  test("is true for an acceptance recorded earlier the same UTC day", () => {
    const storage = createStorage();
    recordTermsAcceptance(storage, new Date("2026-09-24T00:00:00Z"));

    expect(
      hasAcceptedTermsToday(storage, new Date("2026-09-24T23:59:59.999Z"))
    ).toBe(true);
  });

  test("expires at 00:00 UTC of the next day", () => {
    const storage = createStorage();
    recordTermsAcceptance(storage, new Date("2026-09-24T23:59:59Z"));

    expect(
      hasAcceptedTermsToday(storage, new Date("2026-09-25T00:00:00Z"))
    ).toBe(false);
  });

  test("does not treat a future or malformed value as accepted", () => {
    const now = new Date("2026-09-24T12:00:00Z");

    expect(
      hasAcceptedTermsToday(
        createStorage({ [TERMS_STORAGE_KEY]: "2026-09-25" }),
        now
      )
    ).toBe(false);
    expect(
      hasAcceptedTermsToday(createStorage({ [TERMS_STORAGE_KEY]: "true" }), now)
    ).toBe(false);
  });

  test("asks again when storage is missing or throws", () => {
    expect(hasAcceptedTermsToday(null)).toBe(false);
    expect(hasAcceptedTermsToday(throwingStorage)).toBe(false);
  });
});

describe("recordTermsAcceptance", () => {
  test("stores the UTC day under the terms key", () => {
    const storage = createStorage();

    expect(
      recordTermsAcceptance(storage, new Date("2026-09-24T18:45:00Z"))
    ).toBe(true);
    expect(storage.data.get(TERMS_STORAGE_KEY)).toBe("2026-09-24");
  });

  test("reports failure instead of throwing when storage is unusable", () => {
    expect(recordTermsAcceptance(null)).toBe(false);
    expect(recordTermsAcceptance(throwingStorage)).toBe(false);
  });
});
