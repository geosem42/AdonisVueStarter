<template>
  <div class="form-signin w-50 m-auto mt-5">
    <form @submit.prevent="login">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="verificationMessage" class="alert alert-success" role="alert">
        {{ verificationMessage }}
      </div>

      <h1 class="h3 mb-3 fw-normal">Login</h1>

      <div class="form-floating">
        <input class="form-control" :class="{ 'is-invalid': v$.email.$error }" placeholder="name@example.com" v-model="state.email" id="email-address" name="email" type="email">
        <label for="email-address">Email address</label>
        <div v-for="error in v$.email.$errors" :key="error.$uid" class="invalid-feedback">{{ error.$message }}</div>
      </div>
      <div class="form-floating mt-3">
        <input class="form-control" :class="{ 'is-invalid': v$.password.$error }" placeholder="Password" v-model="state.password" id="password" name="password" type="password">
        <label for="password">Password</label>
        <div v-for="error in v$.password.$errors" :key="error.$uid" class="invalid-feedback">{{ error.$message }}</div>
      </div>
      <button class="btn btn-primary w-100 mt-3 py-2" type="submit">Login</button>
    </form>
  </div>
</template>


<script lang="ts">
import { reactive, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../../store';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

export default {
  setup() {

    onUnmounted(() => {
      store.verificationMessage = null;
    });

    const state = reactive({
      email: '',
      password: ''
    });

    const rules = {
      email: { required, email },
      password: { required }
    };

    const v$ = useVuelidate(rules, state);
    const store = useStore();
    const router = useRouter();
    const errorMessage = ref(null);
    const verificationMessage = ref(null);

    // If there's a verification message in the store, display it
    if (store.verificationMessage) {
      verificationMessage.value = store.verificationMessage;
    }

    const login = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        return;
      }

      try {
        const success = await store.login({ email: state.email, password: state.password });
        if (success) {
          router.push("/");
        }
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return { state, v$, login, errorMessage, verificationMessage };
  }
}
</script>