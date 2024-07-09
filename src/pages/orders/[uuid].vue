<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from 'axios';
import {Order} from "@/interfaces/order";
import {Response} from "@/interfaces/response";
import {useCurrencyConverter} from "@/composables/useCurrencyConverter";
import {definePage} from "unplugin-vue-router/runtime";

definePage({
  alias: '/orders/:uuid',
  meta: {
    requiresAuth: true,
  },
})
const loading = ref(false);
const order = ref<Order | null>(null);
const error = ref<string | null>(null);
const currencyConverter = useCurrencyConverter();
const currentCurrency = ref('CNY');

const convertToCurrency = (amount: number, target_currency: string) => {
  return currencyConverter.convertCurrency(amount, target_currency);
};

const fetchOrder = async () => {
  const route = useRoute();
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get<Response<Order>>('/api/v1/order/' + route.params.uuid);
    order.value = response.data.data;
  } catch (e) {
    console.error(e);
    error.value = 'Failed to fetch order details.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
});

const router = useRouter();

const changeCurrency = (currency: string) => {
  currentCurrency.value = currency;
};
const goBack = () => {
  router.back();
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-select
          :items="['CNY', 'USD', 'EUR']" v-model="currentCurrency" @change="changeCurrency">Currency
        </v-select>
        <v-card v-if="order">
          <v-card-title>
            Order Details
          </v-card-title>
          <v-card-subtitle>
            Order ID: {{ order.uuid }}
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title><strong>Amount:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ convertToCurrency(order.amount, currentCurrency) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Delivery Fee:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{
                      convertToCurrency(order.delivery_fee, currentCurrency)
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Billing Address:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ order.address?.billing }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Shipping Address:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ order.address?.shipping }}</v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-title><strong>Products:</strong></v-list-item-title>
                  <v-list-item-subtitle>
                    <v-list dense>
                      <v-list-item v-for="product in order.products" :key="product.uuid">
                        <v-list-item-title>{{ product.product }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ product.quantity }} x {{ convertToCurrency(product.price, currentCurrency) }} =
                          {{ convertToCurrency(product.quantity * product.price, currentCurrency) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Payment Type:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ order.payment?.type }}</v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="goBack" color="primary">Back</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
        <v-progress-circular v-else-if="loading" indeterminate></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card-title {
  font-size: 1.5em;
  font-weight: bold;
}

.v-card-subtitle {
  font-size: 1.2em;
  color: grey;
}
</style>
