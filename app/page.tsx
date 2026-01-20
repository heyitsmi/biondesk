import HomeClient from "./HomeClient";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  return <HomeClient isLoggedIn={!!user} />;
}
