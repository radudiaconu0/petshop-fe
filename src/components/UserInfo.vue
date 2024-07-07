<script lang="ts" setup>
import {ref} from 'vue';
import axios from "axios";
import {useAuthStore} from "@/stores/auth";

const dialog = ref(false);
const orders = ref([]);
const loading = ref(false);

const auth = useAuthStore();

const formData = ref({
  first_name: auth.user?.first_name,
  last_name: auth.user?.last_name,
  email: auth.user?.email,
  avatar: null,
  phone_number: auth.user?.phone_number,
  address: auth.user?.address,
  is_marketing: !!auth.user?.is_marketing,
  password: '',
  password_confirmation: ''
});

const errors = ref({
  first_name: [],
  last_name: [],
  email: [],
  phone_number: [],
  address: [],
  is_marketing: [],
  password: [],
});

const headers = [
  {text: 'Order UUID', value: 'uuid'},
  {text: 'Status', value: 'status'},
  {text: 'Download invoice', value: 'download'}
];
const fetchOrders = async () => {
  try {
    const response = await axios.get('/api/v1/user/orders', {
      withCredentials: true,
    });
    return response.data.data.data
  } catch (e) {
    console.error(e);
    return []
  }
};

onMounted(async () => {
  orders.value = await fetchOrders();
});

const logout = () => {
  auth.logout()
};

const saveUser = async () => {
  try {
    const response = await axios.put('/api/v1/user/edit', formData.value, {
      withCredentials: true,
    });
    auth.user = response.data.data;
  }
  catch (e) {
    errors.value = e.response.data.errors;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'blue';
    case 'Pending payment':
      return 'orange';
    case 'Paid':
      return 'green';
    case 'Shipped':
      return 'teal';
    case 'Cancelled':
      return 'grey';
    default:
      return 'grey';
  }
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="1200px">

    <template v-slot:activator="{ props: activatorProps }">
      <v-btn variant="outlined" class="ml-2" @click="logout"> Logout</v-btn>
      <v-btn variant="outlined" class="ml-2" v-bind="activatorProps"> {{ auth.user?.first_name }} {{ auth.user.last_name }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        User Settings
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form @submit.prevent="saveUser">
            <v-row>
              <v-col cols="12" sm="4" class="d-flex flex-column align-center">
                <v-avatar v-if="auth.user?.avatar" size="100">
                  <v-img :src="auth.user.avatar"></v-img>
                </v-avatar>
                <v-file-input v-model="formData.avatar" label="Avatar" accept="image/*"></v-file-input>
              </v-col>

              <v-col cols="12" sm="8">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="First Name"
                      :error-messages="errors.first_name"
                      v-model="formData.first_name"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Last Name"
                      :error-messages="errors.last_name"
                      v-model="formData.last_name"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  label="Phone Number"
                  :error-messages="errors.phone_number"
                  v-model="formData.phone_number"
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  label="Address"
                  :error-messages="errors.address"
                  v-model="formData.address"
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  label="Email"
                  :error-messages="errors.email"
                  v-model="formData.email"
                  outlined
                  dense
                ></v-text-field>

                <v-select
                  label="Marketing"
                  :error-messages="errors.is_marketing"
                  v-model="formData.is_marketing"
                  :items="[{title: 'Yes', value: true}, {title: 'No', value: false}]"
                  outlined
                  dense
                ></v-select>

                <v-text-field
                  label="Date Joined"
                  :model-value="auth.user?.created_at"
                  readonly
                  disabled
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  label="Password"
                  :error-messages="errors.password"
                  v-model="formData.password"
                  type="password"
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  label="Confirm Password"
                  v-model="formData.password_confirmation"
                  type="password"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="primary" type="submit">Save</v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-divider class="my-4"></v-divider>

          <v-data-table :headers="headers" :items="orders" class="elevation-1">
            <template v-slot:item.status="{ item }">
              <v-chip rounded :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.download="{ item }">
              <v-btn icon>
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
