import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Flova account",
};

export default async function LoginPage() {
    const user = await getCurrentUser();

    if (user) {
        redirect("/dashboard");
    }

    return <LoginClient />;
}
