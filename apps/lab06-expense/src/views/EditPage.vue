<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขข้อมูล</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-item>
        <ion-input label="ชื่อรายการ" v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input label="จำนวนเงิน" type="number" v-model="amount"></ion-input>
      </ion-item>

      <ion-item>
        <ion-select label="ประเภท" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input label="หมวดหมู่" v-model="category"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="updateExpense">
        อัปเดตข้อมูล
      </ion-button>
      <ion-button 
  expand="block" 
  color="danger"
  @click="showAlert = true">
  ลบข้อมูล
</ion-button>

<ion-alert
  :is-open="showAlert"
  header="ยืนยันการลบ"
  message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?"
  :buttons="[
    {
      text: 'ยกเลิก',
      role: 'cancel',
      handler: () => showAlert = false
    },
    {
      text: 'ลบ',
      role: 'destructive',
      handler: () => deleteExpense()
    }
  ]"
  @didDismiss="showAlert = false">
</ion-alert>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonItem, IonInput,
  IonSelect, IonSelectOption, IonButton,
  IonAlert
} from '@ionic/vue'


import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const title = ref('')
const amount = ref(0)
const type = ref('expense')
const category = ref('')
const showAlert = ref(false)


const loadData = async () => {
  const snap = await getDoc(doc(db, 'expenses', id))
  if (snap.exists()) {
    const data = snap.data()
    title.value = data.title
    amount.value = data.amount
    type.value = data.type
    category.value = data.category
  }
}

const updateExpense = async () => {
  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value
  })

  // ✅ กลับหน้ารายการหลังอัปเดตเสร็จ
  router.push('/tabs/tab1')
}

const deleteExpense = async () => {
  await deleteDoc(doc(db, 'expenses', id))
  router.push('/tabs/tab1')
}


onMounted(() => {
  loadData()
})
</script>
