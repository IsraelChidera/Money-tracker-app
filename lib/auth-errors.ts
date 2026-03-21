const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Sign-in errors
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests":
    "Too many failed attempts. Try again later or reset your password.",

  // Sign-up errors
  "auth/email-already-in-use":
    "An account with this email already exists. Try signing in.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/operation-not-allowed": "Email/password sign-in is not enabled.",

  // Account management
  "auth/requires-recent-login":
    "For security, please re-enter your password to continue.",

  // Network / general
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/internal-error": "An unexpected error occurred. Please try again.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
};

export function getAuthErrorMessage(code: string): string {
  return (
    FIREBASE_ERROR_MESSAGES[code] ??
    "Something went wrong. Please try again."
  );
}
