import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue';
import { useStore } from '../store';
import HomeView from '../views/HomeView.vue'
import Login from '../components/Auth/Login.vue'
import Register from '../components/Auth/Register.vue'
import Edit from '../components/Auth/Edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile/edit', name: 'edit', component: Edit, meta: {
        requiresAuth: true
      } 
    },
  ]
})

router.beforeEach((to, from, next) => {
  const store = useStore();

  // Function to evaluate the guard logic
  const evaluateGuard = () => {
    const isAuthenticated = !!store.user;

    // Check if authenticated user is trying to access login or register page
    if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      // Redirect to homepage
      next({ path: '/' });
      return; // Make sure to return here
    }

    // check if the route requires authentication and user is not logged in
    if (to.matched.some(record => record.meta.requiresAuth) && !store.user) {
      // redirect to login page
      next({ path: '/login' });
      return; // Make sure to return here
    }

    // If none of the above conditions are met, proceed normally
    next();
  };

  // Check if authentication state is still being fetched
  if (store.isCheckingAuth) {
    // Wait for authentication check to complete
    const unwatch = watch(
      () => store.isCheckingAuth,
      (newValue) => {
        if (!newValue) {
          unwatch();
          // Evaluate guard logic once auth check is complete
          evaluateGuard();
        }
      }
    );
  } else {
    // Authentication check is already complete, evaluate guard logic
    evaluateGuard();
  }
});

export default router
