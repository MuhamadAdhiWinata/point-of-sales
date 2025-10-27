<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar for desktop -->
    <div class="hidden md:block">
      <Sidebar />
    </div>
    
    <!-- Mobile sidebar overlay -->
    <div 
      v-if="showMobileSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="showMobileSidebar = false"
    ></div>
    
    <!-- Mobile sidebar -->
    <div 
      class="fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden"
      :class="showMobileSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <Sidebar />
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar @toggle-sidebar="showMobileSidebar = !showMobileSidebar" />
      
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const showMobileSidebar = ref(false)
</script>