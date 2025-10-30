import { createRouter, createWebHistory } from 'vue-router'
import Products from '@/pages/Product.vue'
import Approvals from '@/pages/Approvals.vue'
import User from '@/pages/User.vue'
import Kategori from '@/pages/Kategori.vue'

const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Products},
  { path: '/products', name: 'Products', component: Products },
  { path: '/approvals', name: 'Approvals', component: Approvals },
  { path: '/user', name: 'User', component: User },
  { path: '/kategori', name: 'Kategori', component: Kategori },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
