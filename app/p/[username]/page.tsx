import { getWorkspaceByUsername } from "@/lib/db";
import { notFound } from "next/navigation";
import PublicFormClient from "./PublicFormClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const workspace = await getWorkspaceByUsername(username);

  if (!workspace) {
    return {
      title: "Not Found - Biondesk",
    };
  }

  return {
    title: `Work with ${workspace.name} | Inquiry Form`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const workspace = await getWorkspaceByUsername(username);

  if (!workspace) {
    notFound();
  }

  return <PublicFormClient workspace={workspace} />;
}
