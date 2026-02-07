import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Biondesk account",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <RegisterClient />;
}
