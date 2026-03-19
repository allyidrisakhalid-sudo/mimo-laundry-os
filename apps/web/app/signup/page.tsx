import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";
import { SignupScreen } from "@/components/SignupScreen";

export const metadata: Metadata = createPublicMetadata("signup");

export default function SignupPage() {
  return <SignupScreen />;
}
