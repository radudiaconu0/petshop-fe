<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn id="menu-activator" color="primary">
          Products
        </v-btn>

        <v-menu activator="#menu-activator">
          <v-list>
            <v-list-item v-for="(category, index) in categories" :key="category.uid" :value="index">
              <v-list-item-title>{{ category.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-btn>Promotions</v-btn>
      <v-btn to="blog">Blog</v-btn>
      <v-spacer />
      <v-btn variant="outlined" rounded>
        <v-icon left>mdi-cart</v-icon>
      </v-btn>
      <LoginForm v-if="user"></LoginForm>
      <UserInfo v-else></UserInfo>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import UserInfo from "@/components/UserInfo.vue";
import LoginForm from "@/components/LoginForm.vue";
import { User } from "@/interfaces/user";

const auth = useAuthStore();
const categories = ref([]);
onMounted(async () => {
  try {
    const response = await axios.get('/api/v1/categories');
    categories.value = response.data;
  } catch (e) {
    console.error(e);
  }
});

</script>
