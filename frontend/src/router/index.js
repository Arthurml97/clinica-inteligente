import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { 
    path: '/dashboard', 
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin', 
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true, role: 'secretario' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } 
  else if (to.meta.role && to.meta.role !== userRole) {
    next('/dashboard');
  } 
  else if (token && ['/login', '/register'].includes(to.path)) {
    if (userRole === 'secretario') {
      next('/admin');
    } else {
      next('/dashboard');
    }
  } 
  else {
    next();
  }
});

export default router;