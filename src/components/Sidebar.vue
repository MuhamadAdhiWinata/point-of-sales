<template>
  <div class="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <ShoppingBag class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900">POS System</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        :class="[
          $route.path === item.href
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User class="w-4 h-4 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">Admin User</p>
          <p class="text-xs text-gray-500 truncate">admin@pos.com</p>
        </div>
        <Button variant="ghost" size="icon" @click="logout">
          <LogOut class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Package, 
  CheckSquare, 
  ShoppingBag, 
  User, 
  LogOut,
  BarChart3,
  Settings
} from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  { name: 'Sales', href: '/sales', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const logout = () => {
  // Logout logic here
  console.log('Logging out...')
}
</script>