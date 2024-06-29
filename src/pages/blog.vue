<script setup lang="ts">
import InfiniteLoading from "v3-infinite-loading";

interface Post {
  id: String,
  uuid: String,
  title: String,
  slug: String,
  content: String,
  metadata: String,
  created_at: String,
  updated_at: String
}

import axios from "axios";

let page = 1;

const posts = ref<Post[]>([])
const loadPosts = async $state => {

  try {
    const response = await axios.get('/api/v1/main/blog?page=' + page);
    console.log(response.data.data.length)
    if (response.data.data.length < 10) {
      $state.complete()
    }
    else {
      posts.value.push(...response.data.data)
      $state.loaded();
    }
    page++
  } catch (e) {
    $state.error();
  }
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
          <div class="text-body-1 mb-2">{{ post.content }}</div>
          <v-chip v-if="post.metadata" small color="primary" class="mr-2">
            {{ post.metadata }}
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
