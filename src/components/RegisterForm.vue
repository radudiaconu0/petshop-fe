<script setup lang="ts">

import {ref} from 'vue'
import {useAuthStore} from '@/stores/auth'
import axios from "axios";

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({
  first_name: [],
  last_name: [],
  email: [],
  password: [],
  password_confirmation: []
})
const auth = useAuthStore()

const showPassword = ref(false)
const loading = ref(false)
const handleSubmit = async () => {
  try {
    await axios.post('/api/v1/user/create', form)
    await auth.login(form.email, form.password)
  } catch (e) {
    errors.value = e.response.data.errors
  }
}

</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.first_name"
      label="First Name"
      prepend-icon="mdi-account"
      :error-messages="errors.first_name"
      required
    ></v-text-field>
    <v-text-field
      v-model="form.last_name"
      label="Last Name"
      prepend-icon="mdi-account"
      :error-messages="errors.last_name"
      required
    ></v-text-field>
    <v-text-field
      v-model="form.email"
      label="Email"
      prepend-icon="mdi-email"
      type="email"
      :error-messages="errors.email"
      required
    ></v-text-field>
    <v-text-field
      v-model="form.password"
      label="Password"
      prepend-icon="mdi-lock"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :error-messages="errors.password"
      required
    ></v-text-field>
    <v-text-field
      v-model="form.password_confirmation"
      label="Confirm Password"
      prepend-icon="mdi-lock"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :error-messages="errors.password_confirmation"
      required
    ></v-text-field>
    <v-btn
      type="submit"
      color="primary"
      block
      large
      class="mt-4"
      :loading="loading"
    >
      Register
    </v-btn>
  </v-form>
</template>

<style scoped lang="sass">

</style>
