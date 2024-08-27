"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Appbar } from "./ui/Appbar";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={handleSignOut}
        user={session.data?.user}
      />
    </div>
  );
}
