<script lang="ts" setup>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import UserInfo from "@/components/UserInfo.vue";
import LoginForm from "@/components/LoginForm.vue";
import ForgotPasswordForm from "@/components/ForgotPasswordForm.vue";

const auth = useAuthStore();
const categories = ref([]);
const currentForm = ref('login');
const dialog = ref(false);

onMounted(async () => {
  try {
    const response = await axios.get('/api/v1/categories');
    categories.value = response.data;
  } catch (e) {
    console.error(e);
  }
});

</script>
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
      <v-spacer/>
      <v-btn variant="outlined" rounded>
        <v-icon left>mdi-cart</v-icon>
      </v-btn>
      <div v-if="auth.user == null">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span v-if="currentForm === 'login'">Login</span>
              <span v-if="currentForm === 'register'">Register</span>
              <span v-if="currentForm === 'forgotPassword'">Forgot Password</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <div v-if="currentForm === 'login'">
                  <LoginForm></LoginForm>
                  <v-card-actions>
                    <v-btn variant="text" @click="currentForm='forgotPassword'">Forgot Password?</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="currentForm='register'">Register</v-btn>
                  </v-card-actions>
                </div>
                <div v-if="currentForm === 'register'">
                  <RegisterForm></RegisterForm>
                  <v-card-actions class="mt-4">
                    <v-btn variant="text" color="primary" @click="currentForm='forgotPassword'">Forgot Password?</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" @click="currentForm='login'">Back to login</v-btn>
                  </v-card-actions>
                </div>
                <div v-if="currentForm === 'forgotPassword'">
                  <ForgotPasswordForm></ForgotPasswordForm>
                  <v-card-actions class="mt-4">
                    <v-btn variant="text" color="primary" @click="currentForm='login'">Back to login</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" @click="currentForm='register'">Register</v-btn>
                  </v-card-actions>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-btn @click="dialog = true">Open Dialog</v-btn>

      </div>
      <UserInfo v-else></UserInfo>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>

    <AppFooter/>
  </v-app>
</template>


<style scoped>
/* Add your custom styles here */
</style>
