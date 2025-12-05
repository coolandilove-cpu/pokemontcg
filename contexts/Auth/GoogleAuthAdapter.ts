import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { IAuth } from ".";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

class GoogleAuthAdapter implements IAuth {
  public onSignInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("Firebase is not configured. Cannot sign in.");
      return undefined;
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  public onSignOut = () => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("Firebase is not configured. Cannot sign out.");
      return;
    }
    signOut(auth);
  };
}

export const googleAuthAdapter = new GoogleAuthAdapter();
