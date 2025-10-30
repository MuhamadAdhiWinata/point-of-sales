<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-4">
      <!-- Nama Kategori Field -->
      <div class="space-y-2">
        <Label for="nama">
          Nama Kategori <span class="text-destructive">*</span>
        </Label>
        <Input
          id="nama"
          v-model="formData.nama"
          placeholder="Masukkan nama kategori"
          @blur="validateField('nama')"
        />
        <p v-if="errors.nama" class="text-sm text-destructive">
          {{ errors.nama }}
        </p>
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
import type { IKategori } from '@/services/kategoriService'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  kategori?: IKategori | null
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: IKategori): void
}

interface FormErrors {
  nama?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const formData = ref<IKategori>({
  nama: '',
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
        errors.nama = 'Nama kategori wajib diisi'
      } else if (formData.value.nama.trim().length < 2) {
        errors.nama = 'Nama kategori minimal 2 karakter'
      } else {
        errors.nama = undefined
      }
      break
  }
}

function validateForm(): boolean {
  Object.keys(errors).forEach(key => {
    errors[key as keyof FormErrors] = undefined
  })

  validateField('nama')

  return !hasErrors.value
}

watch(() => props.kategori, (newKategori) => {
  if (newKategori) {
    formData.value = { ...newKategori }
    Object.keys(errors).forEach(key => {
      errors[key as keyof FormErrors] = undefined
    })
  } else {
    formData.value = {
      nama: '',
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