export const SEO_HOST = "https://mimolaundry.org";

export const SEO_INDEXABLE_ROUTES = [
  "/",
  "/track",
  "/partners",
  "/help",
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/refund-policy",
] as const;

export const SEO_NON_INDEXABLE_PATTERNS = [
  "/app/",
  "/customer",
  "/driver",
  "/hub",
  "/affiliate",
  "/admin",
  "/dev",
] as const;

export const mimoSite = {
  name: "Mimo Laundry",
  url: SEO_HOST,
  phone: "+255788558975",
  defaultLocale: "en-TZ",
  description:
    "Laundry pickup, care, tracking, and return with a calm, premium experience built for Dar es Salaam.",
} as const;
