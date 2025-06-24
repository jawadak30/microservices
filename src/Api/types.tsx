// src/types/index.ts
// (Other interfaces like User, LoginCredentials, AuthResponse, ApiResponse would also be in this file)

export interface ApiErrorResponse {
  /**
   * A general message describing the error. This is often present for all errors.
   * Example: "The given data was invalid." or "Unauthorized."
   */
  message: string;

  /**
   * Optional field for validation errors.
   * This is common in Laravel APIs, where 'errors' is an object
   * where keys are field names (e.g., 'email', 'password')
   * and values are arrays of error messages for that field.
   * Example:
   * {
   * "email": ["The email field is required.", "The email must be a valid email address."],
   * "password": ["The password must be at least 8 characters."]
   * }
   */
  errors?: {
    [key: string]: string[]; // Dictionary where keys are strings (field names) and values are arrays of strings (error messages)
  };

  /**
   * Optional HTTP status code, though AxiosError itself provides `error.response.status`.
   * Including it here can be redundant if you always rely on `error.response.status`
   * but useful if your backend explicitly returns it in the JSON body for some reason.
   */
  status?: number;

  /**
   * You might have other common error fields from your API.
   * For example, a 'code' for specific error types, or a 'trace' in debug mode.
   * code?: string;
   * trace?: string; // Only in debug environments
   */
}