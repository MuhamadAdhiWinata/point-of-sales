<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Manajemen Kategori</h1>
        <p class="text-sm text-muted-foreground">
          Kelola data kategori produk
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="w-4 h-4 mr-2" />
        Tambah Kategori
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Kategori</CardTitle>
          <FolderTree class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kategoris.length }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Kategori Aktif</CardTitle>
          <CheckCircle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ kategoris.filter(k => k.status === 'AKTIF').length }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Kategori Nonaktif</CardTitle>
          <XCircle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ kategoris.filter(k => k.status === 'NONAKTIF').length }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Table Card -->
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kategori</CardTitle>
        <CardDescription>
          Menampilkan {{ kategoris.length }} kategori terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
          <p class="mt-2 text-sm text-muted-foreground">Memuat data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="kategoris.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <FolderTree class="h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-semibold">Belum ada kategori</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Mulai dengan menambahkan kategori pertama
          </p>
          <Button @click="openCreateDialog" variant="outline">
            <Plus class="w-4 h-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12">No</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead class="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(kategori, index) in kategoris" :key="kategori.id">
                <TableCell class="font-medium">{{ index + 1 }}</TableCell>
                <TableCell class="font-medium">{{ kategori.nama }}</TableCell>
                <TableCell>
                  <Badge :variant="kategori.status === 'AKTIF' ? 'default' : 'destructive'">
                    {{ kategori.status }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(kategori.created_at) }}
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(kategori.updated_at) }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openEditDialog(kategori)"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openDeleteDialog(kategori)"
                    >
                      <Trash2 class="h-4 w-4 text-red-700" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {{ isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
          </DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Ubah data kategori yang dipilih' : 'Tambahkan kategori baru ke dalam sistem' }}
          </DialogDescription>
        </DialogHeader>
        
        <KategoriForm
          ref="kategoriFormRef"
          :kategori="selectedKategori"
          :is-edit="isEditMode"
          @submit="handleFormSubmit"
        />

        <DialogFooter>
          <Button variant="outline" @click="closeDialog" :disabled="isSubmitting">
            Batal
          </Button>
          <Button 
            @click="submitForm"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            {{ isEditMode ? 'Update' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kategori <strong>{{ selectedKategori?.nama }}</strong>?
            <br />
            <span class="text-destructive font-medium mt-2 block">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isSubmitting">Batal</AlertDialogCancel>
          <AlertDialogAction 
            @click="handleDelete" 
            :disabled="isSubmitting"
            class="bg-destructive text-white hover:bg-destructive/90"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Toast -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  getKategoris, 
  createKategori, 
  updateKategori, 
  deleteKategori, 
  type IKategori 
} from '@/services/kategoriService'


// Shadcn Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog/'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/'
import { Badge } from '@/components/ui/badge/'
import { Loader2, Plus, Pencil, Trash2, FolderTree, CheckCircle, XCircle } from 'lucide-vue-next'
import { useToast } from '@/hooks/use-toast.ts'
import Toaster from '@/components/ui/Toaster.vue'
import KategoriForm from '../components/KategoriForm.vue'

// Composables
const { toast } = useToast()

// State
const kategoris = ref<IKategori[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isEditMode = ref(false)
const selectedKategori = ref<IKategori | null>(null)
const kategoriFormRef = ref<{ submit: () => void }>()

// Load kategori
async function loadKategoris() {
  loading.value = true
  try {
    const response = await getKategoris()
    kategoris.value = response.data || []
  } catch (error: any) {
    console.error('Failed to load kategoris:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Gagal memuat data kategori'
    })
  } finally {
    loading.value = false
  }
}

// Dialog handlers
function openCreateDialog() {
  isEditMode.value = false
  selectedKategori.value = null
  isDialogOpen.value = true
}

function openEditDialog(kategori: IKategori) {
  isEditMode.value = true
  selectedKategori.value = { ...kategori }
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
  selectedKategori.value = null
}

function openDeleteDialog(kategori: IKategori) {
  selectedKategori.value = kategori
  isDeleteDialogOpen.value = true
}

function closeDeleteDialog() {
  isDeleteDialogOpen.value = false
  selectedKategori.value = null
}

// Form submission handler
async function handleFormSubmit(formData: IKategori) {
  isSubmitting.value = true
  try {
    if (isEditMode.value && selectedKategori.value?.id) {
      await updateKategori(selectedKategori.value.id, formData)
      toast({
        title: 'Berhasil',
        description: 'Kategori berhasil diupdate'
      })
    } else {
      await createKategori(formData)
      toast({
        title: 'Berhasil',
        description: 'Kategori berhasil ditambahkan'
      })
    }
    
    closeDialog()
    await loadKategoris()
  } catch (error: any) {
    console.error('Failed to save kategori:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.response?.data?.message || 'Gagal menyimpan kategori'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Trigger form submission from parent
function submitForm() {
  if (kategoriFormRef.value) {
    kategoriFormRef.value.submit()
  }
}

// Delete kategori
async function handleDelete() {
  if (!selectedKategori.value?.id) return

  isSubmitting.value = true
  try {
    await deleteKategori(selectedKategori.value.id)
    toast({
      title: 'Berhasil',
      description: 'Kategori berhasil dihapus'
    })
    closeDeleteDialog()
    await loadKategoris()
  } catch (error: any) {
    console.error('Failed to delete kategori:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.response?.data?.message || 'Gagal menghapus kategori'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Utility function
function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadKategoris()
})
</script>