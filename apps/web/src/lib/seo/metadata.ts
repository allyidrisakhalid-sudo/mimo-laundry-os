import type { Metadata } from "next";
import { SEO_HOST, mimoSite } from "./site";

export type PublicRouteKey =
  | "home"
  | "track"
  | "partners"
  | "help"
  | "login"
  | "signup"
  | "terms"
  | "privacy"
  | "refund-policy";

type RouteSeo = {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  image: string;
};

const routeSeoMap: Record<PublicRouteKey, RouteSeo> = {
  home: {
    path: "/",
    title: "Mimo Laundry | Laundry pickup, tracking, and return",
    description:
      "Laundry pickup, care, tracking, and return with one calm next step for homes, families, and busy routines.",
    ogTitle: "Mimo Laundry",
    ogDescription:
      "Laundry pickup, care, tracking, and return in one premium flow.",
    image: "/og/home.svg",
  },
  track: {
    path: "/track",
    title: "Track your order | Mimo Laundry",
    description:
      "Check laundry progress clearly, follow each stage, and stay updated from pickup to return.",
    ogTitle: "Track your order | Mimo Laundry",
    ogDescription:
      "Follow laundry progress clearly from pickup to return.",
    image: "/og/track.svg",
  },
  partners: {
    path: "/partners",
    title: "Partner with Mimo Laundry",
    description:
      "Learn how affiliate and business partners work with Mimo Laundry and apply through one clear path.",
    ogTitle: "Partner with Mimo Laundry",
    ogDescription:
      "Affiliate and business partnership with one clear application path.",
    image: "/og/partners.svg",
  },
  help: {
    path: "/help",
    title: "Help and support | Mimo Laundry",
    description:
      "Get help, answers, and support guidance for orders, timelines, refunds, and customer care.",
    ogTitle: "Help and support | Mimo Laundry",
    ogDescription:
      "Get help, answers, and support guidance clearly.",
    image: "/og/help.svg",
  },
  login: {
    path: "/login",
    title: "Log in | Mimo Laundry",
    description:
      "Secure sign-in for existing Mimo Laundry users across customer and role-based portals.",
    ogTitle: "Log in | Mimo Laundry",
    ogDescription:
      "Secure sign-in for existing users.",
    image: "/og/login.svg",
  },
  signup: {
    path: "/signup",
    title: "Create your account | Mimo Laundry",
    description:
      "Create a new Mimo Laundry account and start with the correct entry path for your first order.",
    ogTitle: "Create your account | Mimo Laundry",
    ogDescription:
      "Create a new account through the correct entry path.",
    image: "/og/signup.svg",
  },
  terms: {
    path: "/terms",
    title: "Terms and conditions | Mimo Laundry",
    description:
      "Read the service terms and conditions for using Mimo Laundry.",
    ogTitle: "Terms and conditions | Mimo Laundry",
    ogDescription:
      "Read the service terms and conditions.",
    image: "/og/legal.svg",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy policy | Mimo Laundry",
    description:
      "Read how Mimo Laundry handles personal data, privacy, and customer information.",
    ogTitle: "Privacy policy | Mimo Laundry",
    ogDescription:
      "Read how Mimo Laundry handles privacy and personal data.",
    image: "/og/legal.svg",
  },
  "refund-policy": {
    path: "/refund-policy",
    title: "Refund policy | Mimo Laundry",
    description:
      "Read the Mimo Laundry refund policy, dispute handling, and support expectations.",
    ogTitle: "Refund policy | Mimo Laundry",
    ogDescription:
      "Read the refund policy and dispute handling rules.",
    image: "/og/legal.svg",
  },
};

export function canonicalUrl(path: string): string {
  if (path === "/") return `${SEO_HOST}/`;
  return `${SEO_HOST}${path}`;
}

export function createPublicMetadata(key: PublicRouteKey): Metadata {
  const route = routeSeoMap[key];
  const canonical = canonicalUrl(route.path);
  const imageUrl = `${SEO_HOST}${route.image}`;

  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: route.ogTitle,
      description: route.ogDescription,
      siteName: mimoSite.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: route.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: route.ogTitle,
      description: route.ogDescription,
      images: [imageUrl],
    },
  };
}
