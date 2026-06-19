<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
    <div class="flex flex-col md:flex-row gap-8">
      
      <!-- Left Column: Profile & Settings -->
      <div class="w-full md:w-1/3 space-y-6">
        
        <!-- Profile Card -->
        <div class="bg-surface border border-border rounded-2xl p-6 shadow-soft text-center">
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl font-bold mx-auto">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </div>
            <button class="absolute bottom-0 right-0 p-1.5 bg-brand-500 text-white rounded-full shadow-md hover:bg-brand-600 transition-colors">
              <Camera class="w-4 h-4" />
            </button>
          </div>
          
          <h2 class="text-xl font-bold text-text-primary">{{ authStore.user?.name || 'User' }}</h2>
          <p class="text-sm text-text-muted mt-1">{{ authStore.user?.email || 'user@example.com' }}</p>
          <Badge variant="brand" class="mt-3">Free Plan</Badge>
          
          <div class="mt-6 pt-6 border-t border-border">
            <Button variant="danger" class="w-full justify-center" @click="handleLogout">
              <LogOut class="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="bg-surface border border-border rounded-2xl p-6 shadow-soft">
          <h3 class="font-semibold text-text-primary mb-4">Preferences</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-text-primary">Theme</p>
                <p class="text-xs text-text-muted">Light or dark mode</p>
              </div>
              <ThemeToggle />
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p class="text-sm font-medium text-text-primary">Email Notifications</p>
                <p class="text-xs text-text-muted">Weekly progress report</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" checked>
                <div class="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Edit Form & Stats -->
      <div class="w-full md:w-2/3 space-y-6">
        
        <!-- Edit Profile Form -->
        <div class="bg-surface border border-border rounded-2xl p-6 shadow-soft">
          <h3 class="font-semibold text-text-primary mb-6">Personal Information</h3>
          
          <form class="space-y-5" @submit.prevent="saveProfile">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                id="firstName" 
                label="First Name" 
                v-model="firstName" 
              />
              <Input 
                id="lastName" 
                label="Last Name" 
                v-model="lastName" 
              />
            </div>
            
            <Input 
              id="email" 
              type="email" 
              label="Email Address" 
              v-model="email" 
              disabled
            >
              <template #suffix>
                <Lock class="w-4 h-4" />
              </template>
            </Input>
            
            <div class="pt-2">
              <Button type="submit" variant="primary" :loading="isSaving">
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <!-- Career Goals -->
        <div class="bg-surface border border-border rounded-2xl p-6 shadow-soft">
          <h3 class="font-semibold text-text-primary mb-4">Exam Goals</h3>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <Badge variant="success" class="px-3 py-1 text-sm">SBI PO 2024</Badge>
            <Badge variant="default" class="px-3 py-1 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">IBPS PO</Badge>
            <Badge variant="default" class="px-3 py-1 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">RBI Grade B</Badge>
            <button class="inline-flex items-center px-3 py-1 border border-dashed border-text-muted rounded-md text-sm text-text-muted hover:text-text-primary hover:border-text-primary transition-colors">
              <Plus class="w-3 h-3 mr-1" /> Add Goal
            </button>
          </div>
          
          <p class="text-sm text-text-muted">Set your target exams to get personalized quiz recommendations.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { Camera, LogOut, Lock, Plus } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const isSaving = ref(false)

onMounted(() => {
  if (authStore.user) {
    const names = (authStore.user.name || '').split(' ')
    firstName.value = names[0] || ''
    lastName.value = names.slice(1).join(' ') || ''
    email.value = authStore.user.email || ''
  }
})

const saveProfile = async () => {
  isSaving.value = true
  // Mock save
  setTimeout(() => {
    isSaving.value = false
    // In a real app, update store
  }, 800)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
