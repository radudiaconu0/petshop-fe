<script setup lang="ts">
import {ref} from 'vue'
import axios from "axios";

const email = ref('')
const link = ref('')

const errors = ref({
  email: []
})

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/v1/forgot-password', {email: email.value})
    const reset_token = response.data.data.reset_token
    link.value = `${window.location.origin}/reset-password?token=${reset_token}`
  } catch (e) {
    console.log(e)
    errors.value = e.response.data.errors
  }
}

</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field v-model="email" label="Email" prepend-icon="mdi-email" :error-messages="errors.email" required></v-text-field>
    <div class="token-link">
      <a v-if="link" :href="link" target="_blank">{{ link }}</a>
    </div>
    <v-btn class="my-2" type="submit" color="primary" block>Send Reset Link</v-btn>
  </v-form>
</template>

<style scoped lang="sass">

</style>
