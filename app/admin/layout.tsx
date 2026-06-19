import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "thomas3christensen@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase() ?? "";

  if (!session || !ADMIN_EMAILS.includes(email)) {
    redirect("/");
  }

  return <>{children}</>;
}
