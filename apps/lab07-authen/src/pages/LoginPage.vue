<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <h2>Login</h2>

      <!-- Email -->
      <ion-input
        label="Email"
        type="email"
        v-model="email"
      />

      <!-- Password -->
      <ion-input
        label="Password"
        type="password"
        v-model="password"
      />

      <ion-button expand="block" @click="loginEmail">
        LOGIN WITH EMAIL
      </ion-button>

      <hr style="margin: 16px 0" />

      <!-- Google -->
      <ion-button expand="block" color="danger" @click="loginGoogle">
        LOGIN WITH GOOGLE
      </ion-button>

      <hr style="margin: 16px 0" />

      <!-- Phone -->
      <ion-input
        label="Phone (+66...)"
        placeholder="+669xxxxxxxx"
        v-model="phone"
      />

      <ion-button expand="block" @click="sendOtp">
        SEND OTP
      </ion-button>

      <ion-input
        label="OTP Code"
        v-model="otp"
      />

      <ion-button expand="block" @click="confirmOtp">
        CONFIRM OTP
      </ion-button>

      <!-- จำเป็นสำหรับ Firebase Phone (Web) -->
      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  alertController
} from '@ionic/vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';

const router = useRouter();

const email = ref('');
const password = ref('');
const phone = ref('');
const otp = ref('');
let verificationId = '';

/* ---------- helper ---------- */
async function showAlert(message: string) {
  const alert = await alertController.create({
    header: 'แจ้งเตือน',
    message,
    buttons: ['OK'],
  });
  await alert.present();
}

/* ---------- Email / Password ---------- */
async function loginEmail() {
  if (!email.value || !email.value.includes('@')) {
    return showAlert('กรุณากรอก Email ให้ถูกต้อง');
  }

  if (!password.value) {
    return showAlert('กรุณากรอกรหัสผ่าน');
  }

  try {
    await authService.loginWithEmailPassword({
      email: email.value.trim(),
      password: password.value,
    });
    router.push('/tabs/tab1');
  } catch (err: any) {
    showAlert(err.message);
  }
}

/* ---------- Google ---------- */
async function loginGoogle() {
  try {
    await authService.loginWithGoogle();
    router.push('/tabs/tab1');
  } catch (err: any) {
    showAlert(err.message);
  }
}

/* ---------- Phone OTP ---------- */
async function sendOtp() {
  if (!phone.value.startsWith('+')) {
    return showAlert('กรุณาใส่เบอร์โทรในรูปแบบ +66...');
  }

  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });
    verificationId = result.verificationId;
    showAlert('ส่ง OTP เรียบร้อยแล้ว');
  } catch (err: any) {
    showAlert(err.message);
  }
}

async function confirmOtp() {
  if (!otp.value) {
    return showAlert('กรุณากรอก OTP');
  }

  try {
    await authService.confirmPhoneCode({
      verificationId,
      verificationCode: otp.value,
    });
    router.push('/tabs/tab1');
  } catch (err: any) {
    showAlert(err.message);
  }
}
</script>