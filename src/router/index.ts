import { createRouter, createWebHistory } from 'vue-router'
import Products from '@/pages/Product.vue'
import Approvals from '@/pages/Approvals.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Products},
  { path: '/products', name: 'Products', component: Products },
  { path: '/approvals', name: 'Approvals', component: Approvals },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
