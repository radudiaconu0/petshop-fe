<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from "@/stores/auth";

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const isActive = ref(false)

const errors = ref({
  email: [],
  password: []
})
const auth = useAuthStore()
const handleSubmit = async () => {
  loading.value = true;
  auth.clearErrors();
  let loggedIn = await auth.login(email.value, password.value);
  if (!loggedIn) {
    errors.value = auth.errors
  }
  loading.value = false;
}
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn variant="outlined" class="ml-2" v-bind="activatorProps">Login
      </v-btn>
    </template>
    <v-container class="m-2">
      <v-card>
        <v-card-title>
          <h2>Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field v-model="email" label="Email" prepend-icon="mdi-email" :error-messages="errors.email"
              required></v-text-field>
            <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword" :error-messages="errors.password"
              required></v-text-field>
            <v-btn class="my-2" type="submit" color="primary" :loading="loading" block>Login
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text">Forgot Password?</v-btn>
          <v-spacer></v-spacer>

          <v-dialog v-model="isActive" max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn variant="text" v-bind="activatorProps">Register</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <RegisterForm></RegisterForm>
            </template>
          </v-dialog>

        </v-card-actions>
      </v-card>
    </v-container>
  </v-dialog>
</template>
