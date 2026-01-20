import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage() {
    const user = await getCurrentUser();

    if (user) {
        redirect("/dashboard");
    }

    return <RegisterClient />;
}
