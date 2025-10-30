<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          class="md:hidden"
          @click="$emit('toggleSidebar')"
        >
          <Menu class="w-5 h-5" />
        </Button>
        
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm">
          <router-link 
            to="/" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
          </router-link>
          <ChevronRight class="w-4 h-4 text-gray-400" />
          <span class="text-gray-900 font-medium">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <Button variant="ghost" size="icon" class="relative">
          <Bell class="w-5 h-5" />
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <!-- Search -->
        <Button variant="ghost" size="icon">
          <Search class="w-5 h-5" />
        </Button>

        <!-- Theme Toggle -->
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <component :is="themeIcon" class="w-5 h-5" />
        </Button>

        <!-- User Menu -->
        <div class="relative" ref="userMenuRef">
          <Button variant="ghost" class="flex items-center space-x-2" @click="toggleUserMenu">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-blue-600" />
            </div>
            <span class="hidden sm:block text-sm font-medium">Admin</span>
            <ChevronDown class="w-4 h-4" />
          </Button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isUserMenuOpen"
            class="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <div class="px-3 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">Admin User</p>
              <p class="text-xs text-gray-500">admin@pos.com</p>
            </div>
            <button 
              v-for="item in userMenu"
              :key="item.name"
              @click="handleUserMenuClick(item.action)"
              class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Menu, 
  ChevronRight,
  Sun,
  Moon,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'

const route = useRoute()
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement>()
const darkMode = ref(false)

defineEmits<{
  toggleSidebar: []
}>()

const userMenu = [
  { name: 'Profile', icon: UserIcon, action: 'profile' },
  { name: 'Settings', icon: Settings, action: 'settings' },
  { name: 'Logout', icon: LogOut, action: 'logout' },
]

const currentPage = computed(() => {
  const routeName = route.name?.toString()
  if (!routeName) return 'Dashboard'
  
  return routeName.charAt(0).toUpperCase() + routeName.slice(1)
})

const themeIcon = computed(() => darkMode.value ? Sun : Moon)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  // Implement theme switching logic here
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const handleUserMenuClick = (action: string) => {
  isUserMenuOpen.value = false
  switch (action) {
    case 'profile':
      console.log('Navigate to profile')
      break
    case 'settings':
      console.log('Navigate to settings')
      break
    case 'logout':
      console.log('Logout')
      break
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>