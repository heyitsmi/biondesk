import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service — Biondesk",
  description: "Terms of Service for Biondesk. The rules and agreements for using our workspace.",
};

export default function Terms() {
  return <TermsClient />;
}
