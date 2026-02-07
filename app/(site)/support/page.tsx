import type { Metadata } from "next";
import SupportClient from "./SupportClient";

export const metadata: Metadata = {
  title: "Contact Support — Biondesk",
  description: "Get help with Biondesk. Contact our support team for questions, feedback, or technical issues.",
};

export default function Support() {
  return <SupportClient />;
}
