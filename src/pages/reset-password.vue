<script setup lang="ts">
import {ref} from 'vue'
import axios from "axios";

const formData = ref({
  email: '',
  password: '',
  password_confirmation: ''
})

const message = ref('')

const router = useRouter()

const token = router.currentRoute.value.query.token
const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/v1/user/reset-password-token', {...formData.value, token})
    message.value = response.data.message
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (e: any) {
    message.value = e.response.data.message
  }
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>
            Reset Password
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field label="Email" v-model="formData.email" required></v-text-field>
              <v-text-field label="New Password" type="password" v-model="formData.password" required></v-text-field>
              <v-text-field label="Confirm Password" type="password" v-model="formData.password_confirmation" required></v-text-field>
              <v-btn type="submit" color="primary" block>Reset Password</v-btn>
              <div v-if="message">
                <v-alert type="success" dismissible>
                  {{ message }}
                  <br>
                  'You will be redirected to the home page in 2 seconds'
                </v-alert>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">

</style>
