import {
  USER_PROFILE_FIELDS,
  createEmptyUserProfile,
  getUserProfileFieldError,
  isUserProfileComplete,
  normalizeUserProfile,
  toInvoiceUserDetails,
  validateUserProfile,
} from "../../src/utils/userProfile.js";

const ADDRESS = "0x66f820a414680B5bcda5eECA5dea238543F42054";

const completeProfile = {
  userFname: "Ada",
  userLname: "Lovelace",
  userEmail: "ada@example.com",
  userCountry: "India",
  userCity: "Pune",
  userPostalcode: "411001",
};

describe("createEmptyUserProfile", () => {
  it("returns an empty string for every declared field", () => {
    const empty = createEmptyUserProfile();

    expect(Object.keys(empty).sort()).toEqual(
      USER_PROFILE_FIELDS.map((f) => f.name).sort()
    );
    expect(Object.values(empty).every((v) => v === "")).toBe(true);
  });
});

describe("normalizeUserProfile", () => {
  it("trims values and fills missing fields with empty strings", () => {
    expect(normalizeUserProfile({ userFname: "  Ada  " })).toEqual({
      ...createEmptyUserProfile(),
      userFname: "Ada",
    });
  });

  it("coerces null and undefined records without throwing", () => {
    expect(normalizeUserProfile(null)).toEqual(createEmptyUserProfile());
    expect(normalizeUserProfile(undefined)).toEqual(createEmptyUserProfile());
  });

  it("never leaks non-string values into the profile", () => {
    const normalized = normalizeUserProfile({
      userFname: 42,
      userPostalcode: null,
    });

    expect(normalized.userFname).toBe("42");
    expect(normalized.userPostalcode).toBe("");
  });

  it("drops keys that are not part of the profile", () => {
    const normalized = normalizeUserProfile({ ...completeProfile, junk: "x" });

    expect(normalized).not.toHaveProperty("junk");
  });
});

describe("getUserProfileFieldError", () => {
  it("requires the first name", () => {
    expect(getUserProfileFieldError("userFname", "")).toBe(
      "First name is required"
    );
    expect(getUserProfileFieldError("userFname", "   ")).toBe(
      "First name is required"
    );
    expect(getUserProfileFieldError("userFname", "Ada")).toBe("");
  });

  it("requires a well-formed email", () => {
    expect(getUserProfileFieldError("userEmail", "")).toBe("Email is required");
    expect(getUserProfileFieldError("userEmail", "not-an-email")).toBe(
      "Invalid email address"
    );
    expect(getUserProfileFieldError("userEmail", "ada@example.com")).toBe("");
  });

  it("treats optional fields as always valid", () => {
    for (const name of ["userLname", "userCountry", "userCity", "userPostalcode"]) {
      expect(getUserProfileFieldError(name, "")).toBe("");
    }
  });

  it("returns no error for an unknown field", () => {
    expect(getUserProfileFieldError("nope", "")).toBe("");
  });
});

describe("validateUserProfile", () => {
  it("accepts a complete profile", () => {
    expect(validateUserProfile(completeProfile)).toEqual({
      isValid: true,
      fieldErrors: {},
    });
  });

  it("reports every missing required field at once", () => {
    const { isValid, fieldErrors } = validateUserProfile(
      createEmptyUserProfile()
    );

    expect(isValid).toBe(false);
    expect(fieldErrors).toEqual({
      userFname: "First name is required",
      userEmail: "Email is required",
    });
  });

  it("rejects a missing profile entirely", () => {
    expect(validateUserProfile(undefined).isValid).toBe(false);
  });
});

describe("isUserProfileComplete", () => {
  it("is true only when the required fields are present", () => {
    expect(isUserProfileComplete(completeProfile)).toBe(true);
    expect(
      isUserProfileComplete({ userFname: "Ada", userEmail: "ada@example.com" })
    ).toBe(true);
    expect(isUserProfileComplete({ userFname: "Ada" })).toBe(false);
    expect(isUserProfileComplete(createEmptyUserProfile())).toBe(false);
  });
});

describe("toInvoiceUserDetails", () => {
  it("maps the profile onto the invoice payload's user shape", () => {
    expect(toInvoiceUserDetails(completeProfile, ADDRESS)).toEqual({
      address: ADDRESS,
      fname: "Ada",
      lname: "Lovelace",
      email: "ada@example.com",
      country: "India",
      city: "Pune",
      postalcode: "411001",
    });
  });

  it("emits empty strings rather than undefined for a partial profile", () => {
    const details = toInvoiceUserDetails({ userFname: "Ada" }, ADDRESS);

    expect(details).toEqual({
      address: ADDRESS,
      fname: "Ada",
      lname: "",
      email: "",
      country: "",
      city: "",
      postalcode: "",
    });
    expect(Object.values(details).some((v) => v === undefined)).toBe(false);
  });

  it("falls back to an empty address when the wallet is disconnected", () => {
    expect(toInvoiceUserDetails(completeProfile, undefined).address).toBe("");
  });

  it("produces a stable key set regardless of input, so invoice hashes stay comparable", () => {
    const fromFull = Object.keys(toInvoiceUserDetails(completeProfile, ADDRESS));
    const fromEmpty = Object.keys(toInvoiceUserDetails({}, ""));

    expect(fromFull).toEqual(fromEmpty);
  });
});
