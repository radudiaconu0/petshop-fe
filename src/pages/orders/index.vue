<template>
  <v-container>
    <v-row>
      <v-col v-for="order in orders" :key="order.uuid" cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>Order ID: {{ order.uuid }}</v-card-title>
          <v-card-subtitle>
            Amount: {{ order.amount }} | Status: {{ getOrderStatus(order) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn @click="navigateToOrderDetails(order.uuid)">
              Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
  setup() {
    const orders = ref([]);
    const router = useRouter();

    onMounted(async () => {
      // Fetch the orders from your API
      const response = await axios.get('/api/v1/user/orders');
      orders.value = response.data.data;
    });

    const getOrderStatus = (order) => {
      if (order.order_status.length > 0) {
        return order.order_status[order.order_status.length - 1].title;
      }
      return 'Unknown';
    };

    const navigateToOrderDetails = (orderId) => {
      router.push(`/orders/${orderId}`);
    };

    return {
      orders,
      getOrderStatus,
      navigateToOrderDetails,
    };
  },
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
