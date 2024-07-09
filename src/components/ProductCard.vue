<script setup lang="ts">
import {Product} from "@/interfaces/product";

const product = defineProps<Product>()
</script>

<template>
  <v-card>
    <v-img :src="product.metadata['image'] ?? 'https://via.placeholder.com/200'" width="200px" height="200px"></v-img>
    <v-card-title>{{ product.title }}</v-card-title>
    <v-card-subtitle>{{ product.brand ?? '' }}</v-card-subtitle>
    <v-card-text>{{ product.price }}</v-card-text>
    <v-card-actions>
      <v-btn color="primary">Add to cart</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="sass">

</style>
