import { escape } from 'html-escaper';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove any HTML tags
  const withoutHtml = input.replace(/<[^>]*>/g, '');
  
  // Escape HTML special characters
  const escaped = escape(withoutHtml);
  
  // Remove any remaining potentially dangerous characters
  return escaped
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

/**
 * Validates and sanitizes search query
 * @param query The search query to validate
 * @returns Sanitized query or null if invalid
 */
export function validateSearchQuery(query: string): string | null {
  if (!query) return null;
  
  const sanitized = sanitizeInput(query);
  
  // Additional search-specific validation
  if (sanitized.length < 1 || sanitized.length > 100) {
    return null;
  }
  
  // Check for SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i;
  if (sqlInjectionPattern.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

/**
 * Validates API key format
 * @param key The API key to validate
 * @returns boolean indicating if the key is valid
 */
export function validateApiKey(key: string): boolean {
  if (!key) return false;
  
  // Basic format validation (adjust pattern based on your API key format)
  const keyPattern = /^[A-Za-z0-9-_]{32,}$/;
  return keyPattern.test(key);
}

/**
 * Creates a secure hash of sensitive data
 * @param data The data to hash
 * @returns Hashed data
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
} 