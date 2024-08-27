import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}
