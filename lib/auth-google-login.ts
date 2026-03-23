import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/components/firebase";
import { userService } from "@/services/userService";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

/**
 * Sign in (or sign up) with Google popup.
 * On success, ensures a Firestore user document exists.
 * Throws a Firebase auth error on failure so callers can display a message.
 */
export async function signInWithGoogle(): Promise<void> {
  const result = await signInWithPopup(auth, provider);
  const { user } = result;

  // Create profile doc if it doesn't exist yet (merge:true is safe for existing users)
  await userService.create(
    user.uid,
    user.displayName ?? user.email?.split("@")[0] ?? "User",
    user.email ?? ""
  );
}
