<script setup lang="ts">
import {ref} from 'vue'
import {Promotion} from "@/interfaces/promotion";
import {Post} from "@/interfaces/blog";
import axios from "axios";
import {PaginatedResponse} from "@/interfaces/response";
import {Category} from "@/interfaces/category";

const promotions = ref<Promotion[]>([])
const categories = ref<Category[]>([])
const posts = ref<Post[]>([])

const fetchPromotions = async () => {
  try {
    const response = await axios.get<PaginatedResponse<Promotion>>('/api/v1/main/promotions?limit=3&page=1')
    promotions.value = response.data.data
  } catch (e) {
    console.error(e)
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get<PaginatedResponse<Category>>('/api/v1/categories?limit=2&page=1')
    categories.value = response.data.data
  } catch (e) {
    console.error(e)
  }
}

const fetchPosts = async () => {
  try {
    const response = await axios.get<PaginatedResponse<Post>>('/api/v1/main/blog?limit=3&page=1')
    posts.value = response.data.data
  } catch (e) {
    console.error(e)
  }
}

onMounted( async () => {
  await fetchPromotions()
  await fetchCategories()
  await fetchPosts()
});


</script>
<template>
<v-container>
  <v-row>
    <v-col cols="12" md="4" v-for="promotion in promotions" :key="promotion.uuid">
      <v-card>
        <v-img :src="promotion.metadata.image" aspect-ratio="16/9"></v-img>
        <v-card-title>{{ promotion.title }}</v-card-title>
        <v-card-text>{{ promotion.content }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="4" v-for="post in posts" :key="post.uuid">
      <v-card>
        <v-img :src="post.metadata.image" aspect-ratio="16/9"></v-img>
        <v-card-title>{{ post.title }}</v-card-title>
        <v-card-text>{{ post.content }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>
