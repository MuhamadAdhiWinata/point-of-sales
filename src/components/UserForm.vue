<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Nama Field -->
      <div class="space-y-2">
        <Label for="nama">
          Nama <span class="text-destructive">*</span>
        </Label>
        <Input
          id="nama"
          v-model="formData.nama"
          placeholder="Masukkan nama"
          @blur="validateField('nama')"
        />
        <p v-if="errors.nama" class="text-sm text-destructive">
          {{ errors.nama }}
        </p>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <Label for="email">
          Email <span class="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="Masukkan email"
          @blur="validateField('email')"
        />
        <p v-if="errors.email" class="text-sm text-destructive">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <Label for="password">
          Password
          <span v-if="!isEdit" class="text-destructive">*</span>
        </Label>
        <Input
          id="password"
          v-model="formData.password"
          type="password"
          :placeholder="isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'"
          @blur="validateField('password')"
        />
        <p v-if="errors.password" class="text-sm text-destructive">
          {{ errors.password }}
        </p>
        <p v-else-if="isEdit" class="text-xs text-muted-foreground">
          Kosongkan jika tidak ingin mengubah password
        </p>
      </div>

      <!-- No HP Field -->
      <div class="space-y-2">
        <Label for="no_hp">No HP</Label>
        <Input
          id="no_hp"
          v-model="formData.no_hp"
          placeholder="Masukkan nomor HP"
        />
      </div>

      <!-- Alamat Field -->
      <div class="space-y-2 md:col-span-2">
        <Label for="alamat">Alamat</Label>
        <Textarea
          id="alamat"
          v-model="formData.alamat"
          placeholder="Masukkan alamat lengkap"
          class="min-h-[80px] resize-none"
        />
      </div>

      <!-- Role Field -->
      <div class="space-y-2">
        <Label for="role">Role <span class="text-destructive">*</span></Label>
        <Select v-model="formData.role">
          <SelectTrigger id="role">
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Status Field -->
      <div class="space-y-2">
        <Label for="status">Status <span class="text-destructive">*</span></Label>
        <Select v-model="formData.status">
          <SelectTrigger id="status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AKTIF">Aktif</SelectItem>
            <SelectItem value="NONAKTIF">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Error Summary -->
    <Alert v-if="hasErrors" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Terdapat kesalahan pada form</AlertTitle>
      <AlertDescription>
        <ul class="list-disc list-inside mt-2">
          <li v-for="(error, key) in errors" :key="key">{{ error }}</li>
        </ul>
      </AlertDescription>
    </Alert>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue'
import type { IUser } from '@/services/userService'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  user?: IUser | null
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: IUser): void
}

interface FormErrors {
  nama?: string
  email?: string
  password?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const formData = ref<IUser>({
  nama: '',
  email: '',
  password: '',
  no_hp: '',
  alamat: '',
  role: 'ADMIN',
  status: 'AKTIF'
})

const errors = reactive<FormErrors>({})

const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== undefined && error !== '')
})

function validateField(field: keyof FormErrors) {
  switch (field) {
    case 'nama':
      if (!formData.value.nama.trim()) {
        errors.nama = 'Nama wajib diisi'
      } else if (formData.value.nama.trim().length < 2) {
        errors.nama = 'Nama minimal 2 karakter'
      } else {
        errors.nama = undefined
      }
      break

    case 'email':
      if (!formData.value.email.trim()) {
        errors.email = 'Email wajib diisi'
      } else if (!isValidEmail(formData.value.email)) {
        errors.email = 'Format email tidak valid'
      } else {
        errors.email = undefined
      }
      break

    case 'password':
      if (!props.isEdit && !formData.value.password.trim()) {
        errors.password = 'Password wajib diisi'
      } else if (formData.value.password && formData.value.password.length < 6) {
        errors.password = 'Password minimal 6 karakter'
      } else {
        errors.password = undefined
      }
      break
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateForm(): boolean {
  Object.keys(errors).forEach(key => {
    errors[key as keyof FormErrors] = undefined
  })

  validateField('nama')
  validateField('email')
  validateField('password')

  return !hasErrors.value
}

watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = { ...newUser }
    if (props.isEdit) {
      formData.value.password = ''
    }
    Object.keys(errors).forEach(key => {
      errors[key as keyof FormErrors] = undefined
    })
  } else {
    formData.value = {
      nama: '',
      email: '',
      password: '',
      no_hp: '',
      alamat: '',
      role: 'ADMIN',
      status: 'AKTIF'
    }
    Object.keys(errors).forEach(key => {
      errors[key as keyof FormErrors] = undefined
    })
  }
}, { immediate: true })

function handleSubmit() {
  if (!validateForm()) {
    return
  }
  
  emit('submit', { ...formData.value })
}

defineExpose({
  submit: handleSubmit,
  validateForm
})
</script>