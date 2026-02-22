const firebaseConfig = {
  apiKey: "AIzaSyCNxJJ7DKGHyhPvZVN3Ee66sTku4zsWM4w",
  authDomain: "supermin-c2650.firebaseapp.com",
  projectId: "supermin-c2650",
  storageBucket: "supermin-c2650.firebasestorage.app",
  messagingSenderId: "830889173528",
  appId: "1:830889173528:web:db28ec1f635cceff90196d",
  measurementId: "G-6RNF4SYPXG"
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials,PhoneCredentials } from "./auth-interface";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";


export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}


import { RecaptchaVerifier } from "firebase/auth";
import { code } from "ionicons/icons";


let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;


// ควรมี div สำหรับ reCAPTCHA ในหน้า login สำหรับโทรศัพท์ ด้วย id="recaptcha-container"
const recaptchaContainerId: string = "recaptcha-container";


export function getRecaptchaVerifier(
  containerId: string
): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      containerId,
      {
        size: "invisible", // หรือ "normal"
      }
    );
  }
  return verifier;
}


export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser() {
    return firebaseAuth.currentUser
      ? mapUser(firebaseAuth.currentUser)
      : null;
  }


  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }


  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }


  async logout() {
    await firebaseAuth.signOut();
  }


  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    return { verificationId: confirmationResult.verificationId };
  }


  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }


}
