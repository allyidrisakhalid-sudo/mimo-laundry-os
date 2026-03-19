import { mimoSite } from "./site";

export function getWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: mimoSite.name,
    url: mimoSite.url,
  };
}

export function getLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: mimoSite.name,
    url: mimoSite.url,
    telephone: mimoSite.phone,
    description:
      "Laundry pickup, care, tracking, and return with a calm, premium experience.",
  };
}

export function toStructuredDataScript(data: object): string {
  return JSON.stringify(data);
}
