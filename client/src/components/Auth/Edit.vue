<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h4 class="fw-bold py-3 mb-4">
          <span class="text-muted fw-light">Account Settings /</span> Account
        </h4>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">

        <div class="card mb-4">
          <h5 class="card-header">Profile Details</h5>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="name" class="form-label">Name</label>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': v$.name.$invalid }"
                    type="text"
                    v-model="state.name"
                    name="name"
                    id="name"
                  >
                  <div class="invalid-feedback" v-for="error of v$.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="email" class="form-label">E-mail</label>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': v$.email.$invalid }"
                    type="text"
                    v-model="state.email"
                    name="email"
                    id="email"
                  >
                  <div class="invalid-feedback" v-for="error of v$.email.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" :class="{ 'is-invalid': v$.password.$errors.length }"
                    v-model="state.password" name="password" id="password">
                  <div class="invalid-feedback" v-for="error of v$.password.$errors" :key="error.$uid">{{ error.$message }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="passwordConfirmation" class="form-label">Password Confirmation</label>
                  <input type="password" class="form-control" :class="{ 'is-invalid': v$.passwordConfirmation.$errors.length }"
                    v-model="state.passwordConfirmation" name="passwordConfirmation" id="passwordConfirmation">
                  <div class="invalid-feedback" v-for="error of v$.passwordConfirmation.$errors" :key="error.$uid">{{ error.$message }}</div>
                </div>
              </div>
              <div class="mt-2">
                <p v-if="errors.successMessage" class="alert alert-success">{{ errors.successMessage }}</p>
                <p v-if="errors.updateProfile" class="alert alert-danger">{{ errors.updateProfile }}</p>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-primary me-2">Save changes</button>
              </div>
            </form>
          </div>
          <!-- /Account -->
        </div>
        <div class="card">
          <h5 class="card-header">Delete Account</h5>
          <div class="card-body">
            <div class="mb-3 col-12 mb-0">
              <div class="alert alert-warning">
                <h6 class="alert-heading fw-bold mb-1">Are you sure you want to delete your account?</h6>
                <p class="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
            </div>
            <form @submit.prevent="deleteAccount">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" v-model="confirmDeactivation" name="accountActivation"
                  id="accountActivation">
                <label class="form-check-label" for="accountActivation">I confirm my account deactivation</label>
              </div>
              <button type="submit" class="btn btn-danger deactivate-account">Deactivate Account</button>
            </form>
            <div class="mt-4">
              <p v-if="errors.deleteAccount" class="alert alert-danger">{{ errors.deleteAccount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from 'vue';
import { useStore } from '../../store';
import { useRouter } from 'vue-router';
import { getErrorMessage } from '../../helpers/errorHelpers';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    // Define the state and validation rules
    const state = reactive({
      name: store.user ? store.user.name : '',
      email: store.user ? store.user.email : '',
      password: '',
      passwordConfirmation: ''
    });

    const passwordIsSame = {
      $validator: (passwordConfirmation: string) => {
        return passwordConfirmation === state.password;
      },
      $message: 'Passwords do not match.'
    };

    const rules = () => ({
      name: { required },
      email: { required, email },
      password: { minLength: minLength(8) },
      passwordConfirmation: {
        sameAsPassword: passwordIsSame
      }
    });

    const v$ = useVuelidate(rules, state);

    // Error Object
    const errors = reactive({
      updateProfile: '',
      deleteAccount: '',
      successMessage: ''
    });

    const confirmDeactivation = ref(false);

    onMounted(() => {
      // Populate the form with the existing user data when the component mounts
      if (store.user) {
        state.name = store.user.name || '';
        state.email = store.user.email || '';
      }
    });

    watch(
      () => store.user,
      (newUser) => {
        //console.log('store.user changed:', newUser);

        // If user becomes null, it means the user has logged out
        if (newUser === null) {
          // Redirect to login page
          console.log('Redirecting to login');
          router.push('/login');
        } else if (newUser) {
          // Update the email ref
          //console.log('Updating email:', newUser.email);
          state.name = newUser.name || '';
          state.email = newUser.email || '';
        }
      },
      { immediate: true }
    );

    const updateProfile = async () => {

      // Trigger validation

      v$.value.$validate();

      // Check for any validation errors
      if (v$.value.$error) {
        return;
      }

      try {
        const result = await store.updateProfile(state.name, state.email, state.password);
        if (result && result.success) {
          errors.successMessage = 'Profile updated successfully!';
          errors.updateProfile = '';
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          // Handle validation errors from the backend
          const validationErrors = error.response.data.errors.map((err: { message: any; }) => err.message).join(', ');
          errors.updateProfile = 'Validation Error: ' + validationErrors;
        } else {
          errors.updateProfile = getErrorMessage(error);
          errors.successMessage = '';
        }
      }
    };

    const deleteAccount = async () => {
      if (!confirmDeactivation.value) {
        errors.deleteAccount = 'You must confirm account deactivation.';
        return;
      }

      try {
        const result = await store.deleteAccount();
        if (result.success) {
          router.push('/login');
        } else {
          errors.deleteAccount = result.errorMessage || 'An error occurred while deleting the account.';
        }
      } catch (error) {
        errors.deleteAccount = 'An unexpected error occurred.';
      }
    };

    return {
      v$,
      state,
      updateProfile,
      confirmDeactivation,
      deleteAccount,
      errors
    };
  }
});
</script>
