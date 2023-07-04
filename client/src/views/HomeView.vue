<template>
  <div class="home">
    <div v-if="isCheckingAuth">Loading...</div>
    <div v-else>
      <h1 v-if="isAuthenticated">Welcome, {{ user.name || user.email }}</h1>
      <h1 v-else>AdonisVue Starter Kit</h1>
      <p>The appliation starter kit features an authentication system; login, register, profile settings.</p>
      <p>It is built using <code>AdonisJS</code> on the backend and <code>Vue.js</code> on the frontend with an <code>api</code> approach. It is designed using <code>Bootstrap 5</code>.</p>
      <p>The starter kit provides the perfect starting point for your next project.</p>
    </div>
    <!-- <div class="mt-3 d-block">
      <button class="btn btn-primary me-2">Primary</button>
      <button class="btn btn-secondary me-2">Secondary</button>
      <button class="btn btn-success me-2">Success</button>
      <button class="btn btn-danger me-2">Danger</button>
      <button class="btn btn-warning me-2">Warning</button>
      <button class="btn btn-info me-2">Info</button>
      <button class="btn btn-dark">Dark</button>
    </div>
    <div class="mt-3 d-block">
      <button class="btn btn-outline-primary me-2">Primary</button>
      <button class="btn btn-outline-secondary me-2">Secondary</button>
      <button class="btn btn-outline-success me-2">Success</button>
      <button class="btn btn-outline-danger me-2">Danger</button>
      <button class="btn btn-outline-warning me-2">Warning</button>
      <button class="btn btn-outline-info me-2">Info</button>
      <button class="btn btn-outline-dark">Dark</button>
    </div>
    <div class="mt-3 d-block">
      <button class="btn btn-label-primary me-2">Primary</button>
      <button class="btn btn-label-secondary me-2">Secondary</button>
      <button class="btn btn-label-success me-2">Success</button>
      <button class="btn btn-label-danger me-2">Danger</button>
      <button class="btn btn-label-warning me-2">Warning</button>
      <button class="btn btn-label-info me-2">Info</button>
      <button class="btn btn-label-dark">Dark</button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';

export default {
  setup() {
    const store = useStore();

    const user = computed(() => store.user);
    const isAuthenticated = computed(() => !!user.value);
    const isCheckingAuth = computed(() => store.isCheckingAuth);

    return { user, isAuthenticated, isCheckingAuth };
  },
};
</script>