import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
  User,
} from "firebase/auth";

import {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNxJJ7DKGHyhPvZVN3Ee66sTku4zsWM4w",
  authDomain: "supermin-c2650.firebaseapp.com",
  projectId: "supermin-c2650",
  storageBucket: "supermin-c2650.firebasestorage.app",
  messagingSenderId: "830889173528",
  appId: "1:830889173528:web:e7859fd2f5ec14b490196d",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

function mapUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

// reCAPTCHA
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
const RECAPTCHA_ID = "recaptcha-container";

function getRecaptcha() {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      RECAPTCHA_ID,
      { size: "invisible" }
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
      creds.email.trim(),
      creds.password
    );
    return mapUser(r.user);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async startPhoneLogin(creds: PhoneCredentials) {
    const v = getRecaptcha();
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      v
    );
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }) {
    if (!confirmationResult) {
      throw new Error("OTP not started");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async logout() {
    await firebaseAuth.signOut();
  }
}