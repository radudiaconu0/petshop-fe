<script lang="ts" setup>
import {ref} from 'vue';
import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {PaginatedResponse} from "@/interfaces/response";
import {Order} from "@/interfaces/order";
import {getImageUrl} from "@/helpers";

const dialog = ref(false);
const orders = ref<Order[]>([]);
const loading = ref({
  save: false,
  orders: false
})

const auth = useAuthStore();

const avatar = ref(null);

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
  {title: 'Order UUID', key: 'uuid'},
  {title: 'Status', key: 'status'},
  {title: 'Download invoice', key: 'download'}
];
const fetchOrders = async ({page, itemsPerPage, sortBy}) => {
  try {
    loading.value.orders = true;
    const response = await axios.get<PaginatedResponse<Order>>('/api/v1/user/orders', {
      params: {
        page,
        limit: itemsPerPage,
        sortBy
      }
    });
    orders.value = response.data.data;
  } catch (e) {
    console.error(e);
  }
  finally {
    loading.value.orders = false;
  }
};

const downloadInvoice = (uuid: string) => {
  axios.get(`/api/v1/order/${uuid}/download`, {responseType: 'blob'}).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `order_${uuid}.pdf`);
    document.body.appendChild(link);
    link.click();
  });
};

const logout = () => {
  auth.logout()
};

const saveUser = async () => {
  try {
    loading.value.save = true;
    if (avatar.value) {

      const form = new FormData();
      form.append('file', avatar.value);
      const response = await axios.post('/api/v1/file/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      formData.value.avatar = response.data.data.uuid;
    }
    const response = await axios.put('/api/v1/user/edit', formData.value);
    auth.user = response.data.data;
  }
  catch (e) {
    errors.value = e.response.data.errors;
  }
  finally {
    loading.value.save = false;
  }
};


const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'blue';
    case 'pending payment':
      return 'orange';
    case 'paid':
      return 'green';
    case 'shipped':
      return 'teal';
    case 'cancelled':
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
      <v-btn class="ml-2" v-bind="activatorProps" variant="flat" icon>
        <v-avatar>
          <v-img :src="getImageUrl(auth.user.avatar)" alt="avatar"> </v-img>
        </v-avatar>
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
              <v-col cols="6" sm="4" class="d-flex flex-column align-center">
                <v-avatar v-if="auth.user?.avatar" size="200">
                  <v-img :src="getImageUrl(auth.user.avatar)" alt="avatar"></v-img>
                </v-avatar>
                <v-avatar v-else size="200">
                  <v-img :src="'https://ui-avatars.com/api/?name=' + auth.user?.first_name +' '+ auth.user?.last_name "
                         alt="avatar"></v-img>
                </v-avatar>
                <v-file-input v-model="avatar" label="Avatar" accept="image/*"></v-file-input>

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
                <v-btn color="primary" type="submit" :loading="loading.save">Save</v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-divider class="my-4"></v-divider>
          <v-btn color="primary" to="/orders">View All Orders</v-btn>

          <v-data-table
            :headers="headers"
            :items="orders"
            :loading="loading.orders"
            :items-per-page="5"
            @update:options="fetchOrders"
            class="elevation-1">
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.uuid }}</td>
                <td>
                  <v-chip rounded :color="getStatusColor(item.order_status[0].title)">
                    {{ item.order_status[0].title }}
                  </v-chip>
                </td>
                <td>
                  <v-btn color="primary" text @click="downloadInvoice(item.uuid)">Download</v-btn>
                </td>
              </tr>
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
