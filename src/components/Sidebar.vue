<template>
  <aside
    :class="[
      'h-screen bg-background border-r transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <transition name="fade">
        <div v-if="!isCollapsed" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag class="w-5 h-5 text-primary-foreground" />
          </div>
          <span class="text-l font-bold">POS System</span>
        </div>
      </transition>
      
      <Button
        variant="ghost"
        size="icon"
        @click="toggleSidebar"
        :class="{ 'mx-auto': isCollapsed }"
      >
        <Menu class="h-5 w-5" />
      </Button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <TooltipProvider>
        <Tooltip v-for="item in navigation" :key="item.name" :disabled="!isCollapsed">
          <TooltipTrigger as-child>
            <router-link
              :to="item.href"
              :class="[
                'flex items-center rounded-md text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isCollapsed ? 'justify-center p-2' : 'space-x-3 px-3 py-2',
                $route.path === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <transition name="fade">
                <span v-if="!isCollapsed">{{ item.name }}</span>
              </transition>
            </router-link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {{ item.name }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  LayoutDashboard, 
  Package, 
  CheckSquare, 
  ShoppingBag, 
  Menu,
  User2,
  IceCreamCone
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  { name: 'Kategori', href: '/kategori', icon: IceCreamCone },
  { name: 'User', href: '/user', icon: User2 },

]

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>