<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Email -->
      <ion-item>
        <ion-input v-model="email" placeholder="Email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input v-model="password" type="password" placeholder="Password"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="loginEmail">
        Login Email/Password
      </ion-button>

      <ion-button expand="block" color="danger" @click="loginGoogle">
        Login Google
      </ion-button>

      <ion-button expand="block" color="success" @click="sendOTP">
        Login by Phone
      </ion-button>

      <!-- OTP -->
      <ion-item v-if="verificationId">
        <ion-input v-model="otp" placeholder="Enter OTP"></ion-input>
      </ion-item>

      <ion-button v-if="verificationId" expand="block" @click="confirmOTP">
        Confirm OTP
      </ion-button>

      <!-- reCAPTCHA -->
      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/auth/auth-service'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const phone = ref('+66809681473') // ใส่เบอร์จริงตอนทดสอบ
const otp = ref('')
const verificationId = ref('')

// 🔹 Email Login
const loginEmail = async () => {
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value
    })
    router.push('/tabs/tab1')
  } catch (err: any) {
  console.log("ERROR:", err)
  alert(err.message)
}
}

// 🔹 Google Login
const loginGoogle = async () => {
  try {
    await authService.loginWithGoogle()
    router.push('/tabs/tab1')
  } catch (err: any) {
  console.log("ERROR:", err)
  alert(err.message)
}
}

// 🔹 ส่ง OTP
const sendOTP = async () => {
  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phone.value
    })
    verificationId.value = result.verificationId
  } catch (err: any) {
    console.log("ERROR:", err)
    alert(err.message)
}
}

// 🔹 ยืนยัน OTP
const confirmOTP = async () => {
  try {
    const result = await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otp.value
    })

    console.log("RESULT:", result)

    const user = await authService.getCurrentUser()
    console.log("USER:", user)

    if (!user) {
      alert("❌ ไม่มี user")
      return
    }

    if (!user.phoneNumber) {
      alert("❌ login ไม่สำเร็จ (ยังเป็น email)")
      return
    }

    router.replace('/tabs/tab1')

  } catch (err: any) {
    console.log("ERROR:", err)
    alert("❌ OTP ผิด หรือ Firebase ไม่ยอม")
  }
}
</script>