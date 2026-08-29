import { getEmailError, getRequiredTextError } from "./invoiceValidation";

/**
 * Single source of truth for the sender ("From") profile.
 *
 * These details used to be retyped into every invoice form. They now live in
 * Settings and are collected once during onboarding, so both the Settings form
 * and the onboarding dialog render from this one descriptor list.
 */
export const USER_PROFILE_FIELDS = [
  {
    name: "userFname",
    label: "First Name",
    // Sentence-cased separately so the message matches the one the invoice
    // validators raise for the same field.
    errorLabel: "First name",
    placeholder: "Your First Name",
    type: "text",
    required: true,
  },
  {
    name: "userLname",
    label: "Last Name",
    placeholder: "Your Last Name",
    type: "text",
  },
  {
    name: "userEmail",
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    required: true,
  },
  {
    name: "userCountry",
    label: "Country",
    placeholder: "Select country",
    control: "country",
  },
  {
    name: "userCity",
    label: "City",
    placeholder: "City",
    type: "text",
  },
  {
    name: "userPostalcode",
    label: "Postal Code",
    placeholder: "Postal Code",
    type: "text",
  },
];

const PROFILE_FIELD_NAMES = USER_PROFILE_FIELDS.map((field) => field.name);

/** Maps a profile field to the key used inside the invoice payload's `user` object. */
const INVOICE_USER_KEY_BY_FIELD = {
  userFname: "fname",
  userLname: "lname",
  userEmail: "email",
  userCountry: "country",
  userCity: "city",
  userPostalcode: "postalcode",
};

export const createEmptyUserProfile = () =>
  Object.fromEntries(PROFILE_FIELD_NAMES.map((name) => [name, ""]));

/**
 * Coerces anything read back from storage into a complete, string-valued
 * profile, so a partial record written by an older build cannot leak
 * `undefined` into the invoice payload that gets hashed on-chain.
 */
export const normalizeUserProfile = (raw) =>
  Object.fromEntries(
    PROFILE_FIELD_NAMES.map((name) => [name, String(raw?.[name] ?? "").trim()])
  );

/**
 * Validates one profile field. Returns "" when the field is acceptable.
 * Shares its primitives with the invoice validators so a profile saved in
 * Settings can never be rejected later at invoice submit time.
 */
export const getUserProfileFieldError = (name, value) => {
  if (name === "userEmail") return getEmailError(value);

  const field = USER_PROFILE_FIELDS.find((entry) => entry.name === name);
  if (!field?.required) return "";

  return getRequiredTextError(value, field.errorLabel ?? field.label);
};

export const validateUserProfile = (profile) => {
  const fieldErrors = {};

  for (const { name } of USER_PROFILE_FIELDS) {
    const error = getUserProfileFieldError(name, profile?.[name]);
    if (error) fieldErrors[name] = error;
  }

  return { isValid: Object.keys(fieldErrors).length === 0, fieldErrors };
};

/** True when the profile carries everything an invoice requires. */
export const isUserProfileComplete = (profile) =>
  validateUserProfile(profile).isValid;

/**
 * Shapes the saved profile into the `user` object of an invoice payload.
 * The wallet address is passed in rather than stored, since it comes from the
 * connected wallet and can change between invoices.
 */
export const toInvoiceUserDetails = (profile, address) => {
  const normalized = normalizeUserProfile(profile);

  return {
    address: address ? String(address) : "",
    ...Object.fromEntries(
      Object.entries(INVOICE_USER_KEY_BY_FIELD).map(([field, key]) => [
        key,
        normalized[field],
      ])
    ),
  };
};
