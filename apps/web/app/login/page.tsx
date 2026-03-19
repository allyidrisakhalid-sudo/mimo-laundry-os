import type { Metadata } from "next";
import { createPublicMetadata } from "@/lib/seo/metadata";
import { LoginScreen } from "@/components/LoginScreen";

export const metadata: Metadata = createPublicMetadata("login");

export default function LoginPage() {
  return <LoginScreen />;
}
