<template>
  <div class="space-y-6 m-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-600 mt-1">Manage your product inventory</p>
      </div>
      <Button @click="showCreateForm">
        <Plus class="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Package class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Products</p>
            <p class="text-2xl font-bold text-gray-900">{{ products.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg border p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Products</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeProductsCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg border p-4">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <TrendingUp class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Value</p>
            <p class="text-2xl font-bold text-gray-900">${{ totalInventoryValue }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg border p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Low Stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ lowStockCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <Input 
          v-model="searchQuery"
          placeholder="Search products by name or description..."
          class="w-full"
        >
          <template #prefix>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </Input>
      </div>
      <select 
        v-model="statusFilter"
        class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select 
        v-model="categoryFilter"
        class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="all">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @edit="showEditForm"
        @delete="confirmDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
      <Button @click="clearFilters">
        <RefreshCw class="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">
            {{ editingProduct ? 'Edit Product' : 'Create New Product' }}
          </h2>
          <ProductForm
            :product="editingProduct"
            :is-open="showModal"
            @submit="handleFormSubmit"
            @cancel="hideModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Package, CheckCircle, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductForm from '@/components/ProductForm.vue'

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

// Extensive Dummy Data
const products = ref<Product[]>([
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    status: 'active',
    stock: 25,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Advanced smartwatch with heart rate monitoring, GPS, and water resistance',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    status: 'active',
    stock: 18,
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    description: 'High-back ergonomic chair with lumbar support and adjustable armrests',
    price: 459.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    status: 'active',
    stock: 12,
    category: 'Furniture'
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with cherry MX switches and programmable keys',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    status: 'active',
    stock: 32,
    category: 'Electronics'
  },
  {
    id: 5,
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat with carrying strap and alignment lines',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    status: 'active',
    stock: 45,
    category: 'Sports'
  },
  {
    id: 6,
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop',
    status: 'active',
    stock: 3,
    category: 'Lifestyle'
  },
  {
    id: 7,
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop',
    status: 'inactive',
    stock: 0,
    category: 'Electronics'
  },
  {
    id: 8,
    name: 'Desk Lamp with Wireless Charger',
    description: 'LED desk lamp with adjustable brightness and built-in wireless charger',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    status: 'active',
    stock: 7,
    category: 'Home'
  },
  {
    id: 9,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound and 12-hour battery',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    status: 'active',
    stock: 22,
    category: 'Electronics'
  },
  {
    id: 10,
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting and weights',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    status: 'active',
    stock: 15,
    category: 'Electronics'
  },
  {
    id: 11,
    name: 'Laptop Sleeve',
    description: 'Water-resistant laptop sleeve with extra padding and multiple pockets',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    status: 'active',
    stock: 28,
    category: 'Accessories'
  },
  {
    id: 12,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and built-in grinder',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    status: 'inactive',
    stock: 0,
    category: 'Home'
  }
])

const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

// Computed properties
const categories = computed(() => {
  return [...new Set(products.value.map(product => product.category))]
})

const activeProductsCount = computed(() => {
  return products.value.filter(product => product.status === 'active').length
})

const totalInventoryValue = computed(() => {
  return products.value.reduce((total, product) => {
    return total + (product.price * product.stock)
  }, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })
})

const lowStockCount = computed(() => {
  return products.value.filter(product => product.stock < 5 && product.stock > 0).length
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || product.status === statusFilter.value
    const matchesCategory = categoryFilter.value === 'all' || product.category === categoryFilter.value
    return matchesSearch && matchesStatus && matchesCategory
  })
})

// Methods
const showCreateForm = () => {
  editingProduct.value = null
  showModal.value = true
}

const showEditForm = (product: Product) => {
  editingProduct.value = product
  showModal.value = true
}

const hideModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const handleFormSubmit = (productData: Omit<Product, 'id'>) => {
  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = { ...editingProduct.value, ...productData }
    }
  } else {
    // Create new product
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.value.map(p => p.id)) + 1
    }
    products.value.unshift(newProduct)
  }
  hideModal()
}

const confirmDelete = (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter(product => product.id !== id)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
}

onMounted(() => {
  console.log('Products loaded:', products.value.length)
})
</script>