<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn
          id="menu-activator"
          color="primary"
        >
          Products
        </v-btn>

        <v-menu activator="#menu-activator">
          <v-list>
            <v-list-item
              v-for="(category, index) in categories"
              :key="category.uid"
              :value="index"
            >
              <v-list-item-title>{{ category.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-btn>Promotions</v-btn>
      <v-btn to="blog">Blog</v-btn>
      <v-spacer/>
      <v-btn variant="outlined" rounded>
        <v-icon left>mdi-cart</v-icon>
      </v-btn>

      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            variant="outlined"
            class="ml-2"
            v-bind="activatorProps"
          >{{ auth.user ? auth.user.first_name : 'Login' }}
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }" v-if="user==null">
          <LoginForm></LoginForm>
        </template>
      </v-dialog>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>

    <AppFooter/>
  </v-app>
</template>

<script lang="ts" setup>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";

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
