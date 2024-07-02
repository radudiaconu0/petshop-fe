<script lang="ts" setup>
import {ref} from 'vue';
import axios from "axios";
import {useAuthStore} from "@/stores/auth";

const dialog = ref(false);
const orders = ref([]);

const auth = useAuthStore();

const headers = [
  {text: 'Order UUID', value: 'uuid'},
  {text: 'Status', value: 'status'},
  {text: 'Download invoice', value: 'download'}
];
const fetchOrders = async () => {
  try {
    const response = await axios.get('/api/v1/user/orders', {
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + useAuthStore().token
      }
    });
    return response.data.data.data
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  orders.value = await fetchOrders();
});

const logout = () => {
  auth.logout()
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
      <v-btn variant="outlined" class="ml-2" v-bind="activatorProps"> {{ auth.user.first_name }} {{ auth.user.last_name }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">User settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <v-avatar size="100">
                <v-img src="https://via.placeholder.com/100"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="2" sm="8">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Name: " :model-value="auth.user.first_name + ' ' + auth.user.last_name" readonly
                                disabled></v-text-field>
                  <v-text-field label="Phone number" :model-value="auth.user.phone_number" readonly disabled></v-text-field>
                  <v-text-field label="Address" :model-value="auth.user.address" readonly disabled></v-text-field>

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Email" :model-value="auth.user.email" readonly disabled></v-text-field>
                  <v-text-field label="Marketing preferences" :model-value="!auth.user.is_marketing ? 'No' : 'Yes'"
                                readonly disabled></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider></v-divider>
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
