import { z } from "zod";
import { ethers } from "ethers";

// Custom Ethereum address validation
const ethereumAddressSchema = z
  .string()
  .min(1, "Ethereum address is required")
  .refine(
    (address) => ethers.isAddress(address),
    {
      message: "Invalid Ethereum address. Must be a valid 0x-prefixed address with 42 characters.",
    }
  )
  .transform((address) => address.toLowerCase());

// Email validation schema
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase();

// Optional email validation
const optionalEmailSchema = z
  .string()
  .optional()
  .refine(
    (email) => !email || z.string().email().safeParse(email).success,
    {
      message: "Please enter a valid email address",
    }
  );

// Invoice item schema
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      {
        message: "Quantity must be a positive number",
      }
    ),
  unitPrice: z
    .string()
    .min(1, "Unit price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      {
        message: "Unit price must be a valid number",
      }
    ),
  discount: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Discount must be a valid number",
      }
    ),
  tax: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Tax must be a valid number",
      }
    ),
  amount: z.string().optional(),
});

// Create Invoice Form Schema
export const createInvoiceSchema = z.object({
  userAddress: ethereumAddressSchema,
  userFname: z.string().min(1, "First name is required").max(50, "First name is too long"),
  userLname: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  userEmail: emailSchema,
  userCountry: z.string().min(1, "Country is required"),
  userCity: z.string().min(1, "City is required").max(100, "City name is too long"),
  userPostalcode: z.string().min(1, "Postal code is required").max(20, "Postal code is too long"),
  clientAddress: ethereumAddressSchema,
  clientFname: z.string().min(1, "Client first name is required").max(50, "First name is too long"),
  clientLname: z.string().min(1, "Client last name is required").max(50, "Last name is too long"),
  clientEmail: optionalEmailSchema,
  clientCountry: z.string().optional(),
  clientCity: z.string().max(100, "City name is too long").optional(),
  clientPostalcode: z.string().max(20, "Postal code is too long").optional(),
  itemData: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required")
    .refine(
      (items) => {
        const total = items.reduce((sum, item) => {
          const qty = parseFloat(item.qty || "0");
          const unitPrice = parseFloat(item.unitPrice || "0");
          const discount = parseFloat(item.discount || "0");
          const tax = parseFloat(item.tax || "0");
          return sum + (qty * unitPrice - discount + tax);
        }, 0);
        return total > 0;
      },
      {
        message: "Total invoice amount must be greater than 0",
      }
    ),
});

// Batch Invoice Item Schema (for batch invoices)
const batchInvoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      {
        message: "Quantity must be a positive number",
      }
    ),
  unitPrice: z
    .string()
    .min(1, "Unit price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      {
        message: "Unit price must be a valid number",
      }
    ),
  discount: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Discount must be a valid number",
      }
    ),
  tax: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Tax must be a valid number",
      }
    ),
  amount: z.string().optional(),
});

// Batch Invoice Row Schema
const batchInvoiceRowSchema = z.object({
  clientAddress: ethereumAddressSchema,
  clientFname: z.string().max(50, "First name is too long").optional(),
  clientLname: z.string().max(50, "Last name is too long").optional(),
  clientEmail: optionalEmailSchema,
  clientCountry: z.string().optional(),
  clientCity: z.string().max(100, "City name is too long").optional(),
  clientPostalcode: z.string().max(20, "Postal code is too long").optional(),
  itemData: z
    .array(batchInvoiceItemSchema)
    .min(1, "At least one invoice item is required")
    .refine(
      (items) => {
        const total = items.reduce((sum, item) => {
          const qty = parseFloat(item.qty || "0");
          const unitPrice = parseFloat(item.unitPrice || "0");
          const discount = parseFloat(item.discount || "0");
          const tax = parseFloat(item.tax || "0");
          return sum + (qty * unitPrice - discount + tax);
        }, 0);
        return total > 0;
      },
      {
        message: "Total invoice amount must be greater than 0",
      }
    ),
  totalAmountDue: z.number().optional(),
});

// Create Batch Invoices Form Schema
export const createBatchInvoicesSchema = z.object({
  userFname: z.string().min(1, "First name is required").max(50, "First name is too long"),
  userLname: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  userEmail: emailSchema,
  userCountry: z.string().optional(),
  userCity: z.string().max(100, "City name is too long").optional(),
  userPostalcode: z.string().max(20, "Postal code is too long").optional(),
  invoiceRows: z
    .array(batchInvoiceRowSchema)
    .min(1, "At least one invoice is required")
    .refine(
      (rows) => rows.length > 0 && rows.every((row) => row.clientAddress && parseFloat(row.totalAmountDue || 0) > 0),
      {
        message: "All invoices must have a valid client address and amount greater than 0",
      }
    ),
});

