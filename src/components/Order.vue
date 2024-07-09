<script setup lang="ts">
import {Order} from "@/interfaces/order";

const order = defineProps<Order>()
</script>

<template>
  <v-card>
    <v-card-title>
      <span class="headline">Order</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Order ID</v-list-item-title>
                <v-list-item-subtitle>{{ order.uuid }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Products</v-list-item-title>
                <v-list-item-subtitle>{{ order.products }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Total</v-list-item-title>
                <v-list-item-subtitle>{{ order.total }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Created At</v-list-item-title>
                <v-list-item-subtitle>{{ order.created_at }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">

</style>
