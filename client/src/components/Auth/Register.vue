<template>
  <div class="form-signup w-50 m-auto mt-5">
    <form @submit.prevent="register" class="needs-validation">

      <h1 class="h3 mb-3 fw-normal">Register</h1>

      <div class="form-floating">
        <input v-model="state.name" id="name" name="name" type="text" class="form-control" :class="{ 'is-invalid': v$.name.$error }" placeholder="Name" />
        <label for="name">Name</label>
        <div class="invalid-feedback" v-for="error in v$.name.$errors" :key="error.$uid">{{ error.$message }}</div>
      </div>
      <div class="form-floating mt-3">
        <input v-model="state.email" id="email-address" name="email" type="email" class="form-control" :class="{ 'is-invalid': v$.email.$error }" placeholder="Email address" />
        <label for="email-address" class="sr-only">Email address</label>
        <div class="invalid-feedback" v-for="error in v$.email.$errors" :key="error.$uid">{{ error.$message }}</div>
      </div>
      <div class="form-floating mt-3">
        <input v-model="state.password" id="password" name="password" type="password" class="form-control" :class="{ 'is-invalid': v$.password.$error }" placeholder="Password" />
        <label for="password" class="sr-only">Password</label>
        <div class="invalid-feedback" v-for="error in v$.password.$errors" :key="error.$uid">{{ error.$message }}</div>
      </div>
      <button type="submit" class="btn btn-primary w-100 mt-3 py-2">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../../store';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

export default {
  setup() {
    const state = reactive({
      name: '',
      email: '',
      password: ''
    });

    const rules = {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(8) }
    };

    const v$ = useVuelidate(rules, state);

    const router = useRouter();
    const store = useStore();

    const register = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        return;
      }

      try {
        const success = await store.register({
          name: state.name,
          email: state.email,
          password: state.password
        });
        if (success) {
          router.push("/");
        }
      } catch (error) {
        console.log('The error is: ', error)
      }
    };

    return { state, v$, register };
  }
}
</script>
