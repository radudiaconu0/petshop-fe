<script setup lang="ts">
import InfiniteLoading from "v3-infinite-loading";

import axios from "axios";
import {PaginatedResponse} from "@/interfaces/response";
import {Post} from "@/interfaces/blog";

const page = ref(1);

const posts = ref<Post[]>([])
const loadPosts = async($state: any)=> {
  try {
    const response = await axios.get<PaginatedResponse<Post>>('/api/v1/main/blog?page=' + page.value);
    if (response.data.data.length < 10) {
      $state.complete()
    }
    else {
      posts.value.push(...response.data.data)
      $state.loaded();
    }
    page.value++;
  } catch (e) {
    $state.error();
  }
}

const getImageUrl = (image: string) => {
  return 'https://pet-shop.buckhill.com.hr/api/v1/file/' + image
}
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const share = () => {
  console.log('Share')
}

</script>

<template>
    <template v-for="post in posts" :key="post.uuid">
      <v-card class="mx-auto my-4" max-width="900" elevation="3">
        <v-card-title class="text-h5 font-weight-bold">
          {{ post.title }}
        </v-card-title>

        <v-card-subtitle class="pb-0">
          {{ formatDate(post.created_at) }}
        </v-card-subtitle>

        <v-card-text>
          <v-img :src="getImageUrl(post.metadata.image)" aspect-ratio="16/9"></v-img>
          <div class="text-body-1 mb-2">{{ post.content }}</div>
          <v-chip v-if="post.metadata.author" class="mr-2" color="primary" label>
            {{ post.metadata.author }}
          </v-chip>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" variant="text">
            Read More
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="share">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
   <InfiniteLoading @infinite="loadPosts">
    <template v-slot:loading>
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </template>
  </InfiniteLoading>
</template>

<style scoped lang="sass">

</style>
