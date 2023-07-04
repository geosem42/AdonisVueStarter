<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { defineAsyncComponent, computed } from 'vue';
import { useStore } from './store';

const store = useStore();

const isAuthenticated = computed(() => !!store.user);

const getName = computed(() => store.user.name);

const logout = async () => {
  await store.logout();
};

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white">
    <div class="container">
      <a class="navbar-brand" href="#">Starter Kit</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="text-primary">Home</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <div v-if="isAuthenticated" class="authenticated">
            <div class="dropdown text-end">
              <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle user bg-primary text-white rounded-circle" data-bs-toggle="dropdown" aria-expanded="false">
                <span>{{ getName.charAt(0) }}</span>
              </a>
              <ul class="dropdown-menu user text-small" style="">
                <li><a class="dropdown-item" href="#">{{ getName }}</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/profile/edit" class="dropdown-item" active-class="bg-primary text-white">Settings</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a href="#" class="dropdown-item" @click="logout">Logout</a></li>
              </ul>
            </div>
          </div>
          <div v-else class="unauthenticated">
            <router-link to="/login" class="btn btn-outline-primary me-2" active-class="btn btn-primary text-white">Login</router-link>
            <router-link to="/register" class="btn btn-outline-primary" active-class="btn btn-primary text-white">Register</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </main>
</template>