import type { Metadata } from "next";
import CookieClient from "./CookieClient";

export const metadata: Metadata = {
  title: "Cookie Policy — Biondesk",
  description: "Cookie Policy for Biondesk. How we use cookies to improve your experience.",
};

export default function Cookie() {
  return <CookieClient />;
}
