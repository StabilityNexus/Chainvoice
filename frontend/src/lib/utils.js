import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Validates the size of invoice payload before encryption
 * @param {Object} payload - The invoice payload object
 * @param {number} maxSizeKB - Maximum size in KB (default: 10KB for single, 8KB per invoice for batch)
 * @returns {{ isValid: boolean, sizeKB: number, error?: string }}
 */
export function validatePayloadSize(payload, maxSizeKB = 10) {
  try {
    const jsonString = JSON.stringify(payload);
    const sizeBytes = new Blob([jsonString]).size;
    const sizeKB = sizeBytes / 1024;
    
    if (sizeKB > maxSizeKB) {
      return {
        isValid: false,
        sizeKB: parseFloat(sizeKB.toFixed(2)),
        error: `Payload size (${sizeKB.toFixed(2)} KB) exceeds maximum allowed size (${maxSizeKB} KB). Please reduce the amount of data in your invoice fields.`
      };
    }
    
    return {
      isValid: true,
      sizeKB: parseFloat(sizeKB.toFixed(2))
    };
  } catch (error) {
    return {
      isValid: false,
      sizeKB: 0,
      error: "Failed to validate payload size"
    };
  }
}
