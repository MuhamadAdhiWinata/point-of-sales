<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Manajemen User</h1>
        <p class="text-sm text-muted-foreground">
          Kelola data pengguna sistem
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="w-4 h-4 mr-2" />
        Tambah User
      </Button>
    </div>

    <!-- Stats Cards -->
    <!-- <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total User</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ users.length }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">User Aktif</CardTitle>
          <UserCheck class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ users.filter(u => u.status === 'AKTIF').length }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Admin</CardTitle>
          <Shield class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ users.filter(u => u.role === 'ADMIN').length }}
          </div>
        </CardContent>
      </Card>
    </div> -->

    <!-- Table Card -->
    <Card>
      <CardHeader>
        <CardTitle>Daftar User</CardTitle>
        <CardDescription>
          Menampilkan {{ users.length }} pengguna terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
          <p class="mt-2 text-sm text-muted-foreground">Memuat data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <Users class="h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-semibold">Belum ada user</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Mulai dengan menambahkan user pertama
          </p>
          <Button @click="openCreateDialog" variant="outline">
            <Plus class="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-12">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No HP</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead class="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(user, index) in users" :key="user.id">
                <TableCell class="font-medium">{{ index + 1 }}</TableCell>
                <TableCell class="font-medium">{{ user.nama }}</TableCell>
                <TableCell>{{ user.email }}</TableCell>
                <TableCell>{{ user.no_hp || '-' }}</TableCell>
                <TableCell>
                  <Badge :variant="user.role === 'ADMIN' ? 'default' : 'secondary'">
                    {{ user.role }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="user.status === 'AKTIF' ? 'default' : 'destructive'">
                    {{ user.status }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(user.created_at) }}
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(user.updated_at) }}
                </TableCell>
                <TableCell class="text-center">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openEditDialog(user)"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openDeleteDialog(user)"
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
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {{ isEditMode ? 'Edit User' : 'Tambah User Baru' }}
          </DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Ubah data user yang dipilih' : 'Tambahkan user baru ke dalam sistem' }}
          </DialogDescription>
        </DialogHeader>
        
        <UserForm
          ref="userFormRef"
          :user="selectedUser"
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
            Apakah Anda yakin ingin menghapus user <strong>{{ selectedUser?.nama }}</strong>?
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
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  type IUser 
} from '@/services/userService'

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
import { Loader2, Plus, Pencil, Trash2, Users} from 'lucide-vue-next'
import UserForm from '@/components/UserForm.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue'
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue'
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue'
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue'
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue'
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue'
import { useToast } from '@/hooks/use-toast.ts'
import Toaster from '@/components/ui/Toaster.vue'

// Composables
const { toast } = useToast();

// State
const users = ref<IUser[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isEditMode = ref(false)
const selectedUser = ref<IUser | null>(null)
const userFormRef = ref<{ submit: () => void }>()

// Load users
async function loadUsers() {
  loading.value = true
  try {
    const response = await getUsers()
    users.value = response.data || []
  } catch (error: any) {
    console.error('Failed to load users:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Gagal memuat data user'
    })
  } finally {
    loading.value = false
  }
}

// Dialog handlers
function openCreateDialog() {
  isEditMode.value = false
  selectedUser.value = null
  isDialogOpen.value = true
}

function openEditDialog(user: IUser) {
  isEditMode.value = true
  selectedUser.value = { ...user }
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
  selectedUser.value = null
}

function openDeleteDialog(user: IUser) {
  selectedUser.value = user
  isDeleteDialogOpen.value = true
}

function closeDeleteDialog() {
  isDeleteDialogOpen.value = false
  selectedUser.value = null
}

// Form submission handler
async function handleFormSubmit(formData: IUser) {
  isSubmitting.value = true
  try {
    if (isEditMode.value && selectedUser.value?.id) {
      const updateData = { ...formData }
      if (!updateData.password) {
        const { password, ...dataWithoutPassword } = updateData
        await updateUser(selectedUser.value.id, dataWithoutPassword)
      } else {
        await updateUser(selectedUser.value.id, updateData)
      }
      toast({
        title: 'Berhasil',
        description: 'User berhasil diupdate'
      })
    } else {
      await createUser(formData)
      toast({
        title: 'Berhasil',
        description: 'User berhasil ditambahkan'
      })
    }
    
    closeDialog()
    await loadUsers()
  } catch (error: any) {
    console.error('Failed to save user:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.response?.data?.message || 'Gagal menyimpan user'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Trigger form submission from parent
function submitForm() {
  if (userFormRef.value) {
    userFormRef.value.submit()
  }
}

// Delete user
async function handleDelete() {
  if (!selectedUser.value?.id) return

  isSubmitting.value = true
  try {
    await deleteUser(selectedUser.value.id)
    toast({
      title: 'Berhasil',
      description: 'User berhasil dihapus'
    })
    closeDeleteDialog()
    await loadUsers()
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.response?.data?.message || 'Gagal menghapus user'
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
  loadUsers()
})
</script>