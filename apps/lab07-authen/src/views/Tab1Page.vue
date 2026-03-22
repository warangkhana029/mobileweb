<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />

      <ion-list>
  <ion-item v-for="item in expenses" :key="item.id">
    <ion-label>
      <h2>{{ item.title }}</h2>
      <p>{{ item.category }} - {{ item.amount }}</p>
    </ion-label>
  </ion-item>
</ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const expenses = ref<any[]>([])

onMounted(() => {
  const auth = getAuth()
  const db = getFirestore()

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("ยังไม่ login")
      return
    }

    console.log("UID:", user.uid)

    const snapshot = await getDocs(
      collection(db, 'users', user.uid, 'expenses')
    )

    console.log("Project ID:", db.app.options.projectId)
    console.log("docs length:", snapshot.size)

    snapshot.forEach(doc => {
      console.log("doc id:", doc.id)
      console.log("data:", doc.data())
    })

    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log("โหลดแล้ว:", expenses.value)
  })
})
</script>