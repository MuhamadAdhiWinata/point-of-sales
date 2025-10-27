<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-full object-cover"
      >
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900 line-clamp-1">{{ product.name }}</h3>
      </div>
      
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
      
      <!-- Category and Status -->
      <div class="flex items-center justify-between mb-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ product.category }}
        </span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
              :class="statusClasses">
          {{ product.status }}
        </span>
      </div>
      
      <!-- Stock and Price -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-500">{{ product.stock }} in stock</span>
        <span class="text-lg font-bold text-green-600">${{ product.price }}</span>
      </div>
      
      <!-- Actions -->
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex-1" @click="$emit('edit', product)">
          <Edit class="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" @click="$emit('delete', product.id)">
          <Trash2 class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next'
import { computed } from 'vue'
import Button from '@/components/ui/button/Button.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  status: 'active' | 'inactive'
  stock: number
  category: string // ✅ Added category
}

interface Props {
  product: Product
}

const props = defineProps<Props>()
defineEmits<{
  edit: [product: Product]
  delete: [id: number]
}>()

const statusClasses = computed(() => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  return {
    [base]: true,
    'bg-green-100 text-green-800': props.product.status === 'active',
    'bg-gray-100 text-gray-800': props.product.status === 'inactive'
  }
})
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>