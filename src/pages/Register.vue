<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag class="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle class="text-2xl text-center">Buat Akun Baru</CardTitle>
        <CardDescription class="text-center">
          Daftar untuk mulai menggunakan sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Nama Field -->
          <div class="space-y-2">
            <Label for="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              v-model="formData.nama"
              placeholder="Masukkan nama lengkap"
              :disabled="isLoading"
              @blur="validateField('nama')"
            />
            <p v-if="errors.nama" class="text-sm text-destructive">
              {{ errors.nama }}
            </p>
          </div>

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

          <!-- No HP Field -->
          <div class="space-y-2">
            <Label for="no_hp">No HP (Opsional)</Label>
            <Input
              id="no_hp"
              v-model="formData.no_hp"
              placeholder="08123456789"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
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

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <Label for="confirmPassword">Konfirmasi Password</Label>
            <div class="relative">
              <Input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ulangi password"
                :disabled="isLoading"
                @blur="validateField('confirmPassword')"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="isLoading"
              >
                <Eye v-if="!showConfirmPassword" class="h-4 w-4 text-muted-foreground" />
                <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <p v-if="errors.confirmPassword" class="text-sm text-destructive">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Success Alert -->
          <Alert v-if="successMessage" variant="default">
            <CheckCircle class="h-4 w-4" />
            <AlertTitle>Berhasil</AlertTitle>
            <AlertDescription>{{ successMessage }}</AlertDescription>
          </Alert>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            {{ isLoading ? 'Mendaftar...' : 'Daftar' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-4">
        <div class="text-sm text-center text-muted-foreground">
          Sudah punya akun?
          <router-link to="/login" class="text-primary hover:underline font-medium">
            Login di sini
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShoppingBag, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'

const router = useRouter()

const formData = ref({
  nama: '',
  email: '',
  no_hp: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  nama: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function validateField(field: keyof typeof errors) {
  switch (field) {
    case 'nama':
      if (!formData.value.nama) {
        errors.nama = 'Nama wajib diisi'
      } else if (formData.value.nama.length < 2) {
        errors.nama = 'Nama minimal 2 karakter'
      } else {
        errors.nama = ''
      }
      break
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
    case 'confirmPassword':
      if (!formData.value.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi'
      } else if (formData.value.confirmPassword !== formData.value.password) {
        errors.confirmPassword = 'Password tidak cocok'
      } else {
        errors.confirmPassword = ''
      }
      break
  }
}

function validateForm(): boolean {
  validateField('nama')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  
  return !errors.nama && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const { confirmPassword, ...registerData } = formData.value
    const response = await register(registerData)
    
    if (response.success) {
      successMessage.value = 'Pendaftaran berhasil! Redirecting...'
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = response.message || 'Pendaftaran gagal'
    }
  } catch (error: any) {
    console.error('Register error:', error)
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat mendaftar'
  } finally {
    isLoading.value = false
  }
}
</script>