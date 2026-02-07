import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ — Biondesk",
  description: "Frequently asked questions about Biondesk. Pricing, features, and support.",
};

export default function Faq() {
  return <FaqClient />;
}
