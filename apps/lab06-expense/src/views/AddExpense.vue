<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-item>
        <ion-input label="ชื่อรายการ" v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="จำนวนเงิน"
          type="number"
          v-model="amount">
        </ion-input>
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

      <ion-item>
        <ion-textarea label="หมายเหตุ" v-model="note"></ion-textarea>
      </ion-item>

      <ion-button expand="block" @click="saveExpense">
        บันทึกข้อมูล
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonItem   
} from '@ionic/vue'

import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  console.log("กดแล้ว");

  alert("ปุ่มทำงาน");

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date()
    });

    alert("บันทึกสำเร็จ");
    router.push("/tabs/tab1");

  } catch (error) {
    console.error("ERROR:", error);
    alert("เกิด error ดู console");
  }
};

</script>
