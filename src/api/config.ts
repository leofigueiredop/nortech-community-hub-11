// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://theslnawxkmheczpiokc.supabase.co",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZXNsbmF3eGttaGVjenBpb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDY0ODEsImV4cCI6MjA2MTM4MjQ4MX0.s3zC4dJi9ZtRJMZ4vutJteXFP71FJoNR2NkFb-2V6nA",
  redirectTo: import.meta.env.VITE_EMAIL_REDIRECT_URL || window.location.origin + "/auth/callback",
  resetPasswordRedirectTo: import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL || window.location.origin + "/auth/reset-password",
  authCallbackUrl: window.location.origin + "/auth/callback",
  signUpRedirectTo: window.location.origin + "/auth/confirm-email",
  signInRedirectTo: window.location.origin + "/platform",
};
