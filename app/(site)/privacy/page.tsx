import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy — Biondesk",
  description: "Privacy Policy for Biondesk. How we handle your data and protect your privacy.",
};

export default function Privacy() {
  return <PrivacyClient />;
}
