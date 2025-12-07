import { z } from "zod"

/**
 * Validation schema for signup form
 * Validates email format and password confirmation
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Phone number validation regex
 * Validates Indian phone numbers: +91 followed by 10 digits, first digit must be 6-9
 */
export const phoneRegex = /^\+91[6-9]\d{9}$/;

/**
 * Validates phone number format
 * @param phone - Phone number to validate (can be empty string)
 * @returns Error message if invalid, null if valid
 */
export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return null; // Empty phone is allowed (optional field)
  }
  if (!phoneRegex.test(phone)) {
    return "Phone number must be in format +91 followed by 10 digits (e.g., +91XXXXXXXXXX)";
  }
  return null;
};

/**
 * Formats and validates phone number input
 * Auto-formats to +91XXXXXXXXXX format
 * @param value - Raw input value
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
  let cleaned = value.replace(/[^+\d]/g, ""); // Keep only + and digits
  const digitsOnly = cleaned.replace("+", "");
  
  // If user starts typing without +91, auto-prepend 91
  let processedValue = digitsOnly;
  if (digitsOnly.length > 0 && !digitsOnly.startsWith("91")) {
    // If starts with 0, remove it
    if (digitsOnly.startsWith("0")) {
      processedValue = "91" + digitsOnly.substring(1);
    } else if (digitsOnly.length <= 10) {
      processedValue = "91" + digitsOnly;
    }
  }
  
  // Limit to 12 digits (91 + 10 digits)
  processedValue = processedValue.substring(0, 12);
  
  // Format as +91XXXXXXXXXX
  return processedValue.length > 0 ? "+" + processedValue : "";
};
