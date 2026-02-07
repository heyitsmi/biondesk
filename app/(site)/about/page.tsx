import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Biondesk — Beyond desk, by design.",
  description: "The story behind Biondesk. A calm workspace for running client work end-to-end.",
};

export default function About() {
  return <AboutClient />;
}
