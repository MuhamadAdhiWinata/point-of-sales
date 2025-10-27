<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Product Name</label>
        <Input v-model="form.name" placeholder="Enter product name" required />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Price</label>
        <Input v-model="form.price" type="number" placeholder="0.00" min="0" step="0.01" required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Description</label>
      <textarea 
        v-model="form.description"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter product description"
        rows="3"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Stock</label>
        <Input v-model="form.stock" type="number" placeholder="0" min="0" required />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Status</label>
        <select 
          v-model="form.status"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Category</label>
        <select 
          v-model="form.category"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Sports">Sports</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Home">Home</option>
          <option value="Accessories">Accessories</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Image URL</label>
        <Input v-model="form.image" placeholder="https://example.com/image.jpg" />
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit">
        {{ isEditing ? 'Update' : 'Create' }} Product
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  status: 'active' | 'inactive'
  stock: number
  category: string
}

interface Props {
  product?: Product | null
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [product: Omit<Product, 'id'>]
  cancel: []
}>()

const defaultForm: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  status: 'active',
  stock: 0,
  category: 'Electronics'
}

const form = ref<Omit<Product, 'id'>>({ ...defaultForm })

const isEditing = computed(() => !!props.product)

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    // Remove id property when copying to form
    const { id, ...productData } = newProduct
    form.value = { ...productData }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>