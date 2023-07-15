<template>
  <div class="verification-page">
    <h1>Email Verification</h1>
    <p v-if="loading">Verifying your email...</p>
    <p v-else-if="message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '../../store';

export default {
  setup() {
    const loading = ref(true);
    const message = ref('');
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    onMounted(async () => {
      const token = route.query.token as string;
      try {
        await store.verifyEmail(token);
        router.push({ name: 'login' }); // Navigate to Login page
      } catch (error) {
        console.error('Email verification failed:', error.message);
        message.value = error.message;
      }
    });

    return { store, loading, message };

    //return { loading, message, verificationMessage: store.verificationMessage };
  },
};
</script>

<style scoped>
.verification-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
}
</style>
