<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="user">
        <p><b>UID:</b> {{ user.uid }}</p>
        <p><b>Email:</b> {{ user.email }}</p>
        <p><b>Phone:</b> {{ user.phoneNumber }}</p>
        <p><b>Name:</b> {{ user.displayName }}</p>
      </div>

      <ion-button expand="block" color="medium" @click="logout">
        Logout
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '@/auth/auth-service'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)

onMounted(async () => {
  user.value = await authService.getCurrentUser()
})

// 🔹 logout
const logout = async () => {
  await authService.logout()
  router.push('/login')
}
</script>