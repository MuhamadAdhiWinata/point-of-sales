<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Approvals</h1>
    <Card class="p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th class="p-2 text-left">Request</th>
            <th class="p-2 text-left">Status</th>
            <th class="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id" class="border-b">
            <td class="p-2">{{ r.name }}</td>
            <td class="p-2">{{ r.status }}</td>
            <td class="p-2">
              <Button size="sm" @click="approveRequest(r)" variant="destructive">Approve</Button>
              <Button size="sm" @click="rejectRequest(r)" variant="destructive">Reject</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Request {
  id: number
  name: string
  status: string
}

const requests = ref<Request[]>([
  { id: 1, name: 'Request 1', status: 'Pending' },
  { id: 2, name: 'Request 2', status: 'Pending' },
])

const approveRequest = (r: Request) => {
  r.status = 'Approved'
}

const rejectRequest = (r: Request) => {
  r.status = 'Rejected'
}
</script>
