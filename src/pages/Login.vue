<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag class="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle class="text-2xl text-center">Selamat Datang</CardTitle>
        <CardDescription class="text-center">
          Masuk ke akun Anda untuk melanjutkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="nama@example.com"
              :disabled="isLoading"
              @blur="validateField('email')"
            />
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                :disabled="isLoading"
                @blur="validateField('password')"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
              >
                <Eye v-if="!showPassword" class="h-4 w-4 text-muted-foreground" />
                <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <p v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </p>
          </div>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            {{ isLoading ? 'Sedang Login...' : 'Login' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-4">
        <div class="text-sm text-center text-muted-foreground">
          Belum punya akun?
          <router-link to="/register" class="text-primary hover:underline font-medium">
            Daftar sekarang
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/authService'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShoppingBag, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()

const formData = ref({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

function validateField(field: 'email' | 'password') {
  switch (field) {
    case 'email':
      if (!formData.value.email) {
        errors.email = 'Email wajib diisi'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.email = 'Format email tidak valid'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      if (!formData.value.password) {
        errors.password = 'Password wajib diisi'
      } else if (formData.value.password.length < 6) {
        errors.password = 'Password minimal 6 karakter'
      } else {
        errors.password = ''
      }
      break
  }
}

function validateForm(): boolean {
  validateField('email')
  validateField('password')
  return !errors.email && !errors.password
}

async function handleLogin() {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const response = await login(formData.value)
    
    if (response.success) {
      // Redirect ke dashboard
      router.push('/dashboard')
    } else {
      errorMessage.value = response.message || 'Login gagal'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat login'
  } finally {
    isLoading.value = false
  }
}
</script>