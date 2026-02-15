<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการทั้งหมด</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

    <ion-card>
      <ion-card-content>
       <p>รายรับรวม: {{ totalIncome }} บาท</p>
       <p>รายจ่ายรวม: {{ totalExpense }} บาท</p>
       <h2>คงเหลือ: {{ balance }} บาท</h2>
     </ion-card-content>
   </ion-card>


      <ion-list>
       <ion-item
  v-for="item in expenses"
  :key="item.id"
  button
  @click="$router.push('/tabs/edit/' + item.id)">

  <ion-label>
    <h2>{{ item.title }}</h2>
    <p>{{ item.category }}</p>
  </ion-label>

  <ion-badge
    :color="item.type === 'income' ? 'success' : 'danger'">
    {{ item.amount }} บาท
  </ion-badge>


</ion-item>

      </ion-list>

      <ion-button expand="block" @click="$router.push('/tabs/add')">
        เพิ่มรายการ
      </ion-button>

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
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonCard,          
  IonCardContent    
} from '@ionic/vue'


import { ref, onMounted, computed } from 'vue' 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

const expenses = ref<any[]>([])

const loadExpenses = async () => {
  const querySnapshot = await getDocs(collection(db, 'expenses'))
  expenses.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const totalIncome = computed(() =>
  expenses.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0)
)

const totalExpense = computed(() =>
  expenses.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0)
)

const balance = computed(() =>
  totalIncome.value - totalExpense.value
)

const deleteExpense = async (id: string) => {
  await deleteDoc(doc(db, 'expenses', id))
  await loadExpenses()   // โหลดข้อมูลใหม่หลังลบ
}


onMounted(() => {
  loadExpenses()
})
</script>
