<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left Column -->
    <div class="space-y-6">
      <!-- Authentication Certificate -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Authentication Key (.p8)*</label>
        <input type="file" 
          accept=".p8"
          @change="handleFileUpload"
          :class="['w-full px-3 py-2 border rounded-md', errors.p8File ? 'border-red-500' : 'border-gray-300']"/>
        <p v-if="errors.p8File" class="mt-1 text-xs text-red-500">{{ errors.p8File }}</p>
      </div>

      <!-- Team ID -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Team ID*</label>
        <input type="text" 
          v-model="form.teamId" 
          @input="validateField('teamId')"
          placeholder="ABCDE12345"
          :class="['w-full px-3 py-2 border rounded-md', errors.teamId ? 'border-red-500' : 'border-gray-300']"/>
        <p v-if="errors.teamId" class="mt-1 text-xs text-red-500">{{ errors.teamId }}</p>
      </div>

      <!-- Key ID -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Key ID*</label>
        <input type="text" 
          v-model="form.keyId" 
          @input="validateField('keyId')"
          placeholder="ABC1234567"
          :class="['w-full px-3 py-2 border rounded-md', errors.keyId ? 'border-red-500' : 'border-gray-300']"/>
        <p v-if="errors.keyId" class="mt-1 text-xs text-red-500">{{ errors.keyId }}</p>
      </div>

      <!-- Bundle ID -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Bundle ID*</label>
        <input type="text" 
          v-model="form.bundleId" 
          @input="validateField('bundleId')"
          placeholder="com.example.app"
          :class="['w-full px-3 py-2 border rounded-md', errors.bundleId ? 'border-red-500' : 'border-gray-300']"/>
        <p v-if="errors.bundleId" class="mt-1 text-xs text-red-500">{{ errors.bundleId }}</p>
      </div>
    </div>

    <!-- Right Column -->
    <div class="space-y-6">
      <!-- Push Token -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Push Token*</label>
        <div class="relative">
          <input type="text" 
            v-model="form.pushToken"
            @input="validateField('pushToken'); filterTokens()"
            @focus="showTokenDropdown = true"
            @blur="setTimeout(() => { showTokenDropdown = false }, 200)"
            placeholder="Device push token"
            :class="['w-full px-3 py-2 border rounded-md', errors.pushToken ? 'border-red-500' : 'border-gray-300']"/>
          <div v-if="showTokenDropdown && filteredTokens.length > 0" 
            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            <div v-for="token in filteredTokens" :key="token.id" 
                @mousedown="selectToken(token.token)"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100">
              <span class="block truncate text-sm">{{ token.token }}</span>
              <span class="block truncate text-xs text-gray-500" v-if="token.device_name">{{ token.device_name }}</span>
            </div>
          </div>
        </div>
        <p v-if="errors.pushToken" class="mt-1 text-xs text-red-500">{{ errors.pushToken }}</p>
      </div>

      <!-- Priority -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Priority*</label>
        <select v-model="form.priority" 
          @change="validateField('priority')"
          :class="['w-full px-3 py-2 border rounded-md', errors.priority ? 'border-red-500' : 'border-gray-300']">
          <option value="5">Medium (5)</option>
          <option value="10">High (10)</option>
        </select>
        <p v-if="errors.priority" class="mt-1 text-xs text-red-500">{{ errors.priority }}</p>
      </div>

      <!-- Action Type -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Action Type*</label>
        <select v-model="form.actionType" 
          @change="validateField('actionType')"
          :class="['w-full px-3 py-2 border rounded-md', errors.actionType ? 'border-red-500' : 'border-gray-300']">
          <option value="start">Start Activity</option>
          <option value="update">Update Activity</option>
          <option value="end">End Activity</option>
        </select>
        <p v-if="errors.actionType" class="mt-1 text-xs text-red-500">{{ errors.actionType }}</p>
      </div>
    </div>

    <!-- Content State - Full Width -->
    <div class="md:col-span-2 space-y-2">
      <label class="text-sm font-medium text-gray-700">Content State (JSON)*</label>
      <textarea v-model="form.contentState" 
        @input="validateField('contentState')"
        rows="10"
        placeholder="{&#10;  &quot;status&quot;: &quot;in_progress&quot;,&#10;  &quot;data&quot;: {}&#10;}"
        :class="['w-full px-3 py-2 border rounded-md font-mono text-sm', errors.contentState ? 'border-red-500' : 'border-gray-300']">
      </textarea>
      <p v-if="errors.contentState" class="mt-1 text-xs text-red-500">{{ errors.contentState }}</p>
    </div>

    <!-- Submit Button - Full Width -->
    <div class="md:col-span-2">
      <div v-if="status.message" :class="['mt-4 p-4 rounded-md mb-2', 
        status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
        {{ status.message }}
      </div>
      <button type="submit"
        :class="['w-full px-4 py-2 rounded-md transition-colors', 
        'bg-blue-500 hover:bg-blue-600 text-white']">
        Send Notification
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Define props to customize the component
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  storageKey: {
    type: String,
    default: 'apns-form-data'
  }
})

// Define emits to communicate with parent
const emit = defineEmits(['success', 'error'])

const form = ref({
  p8File: null,
  teamId: '',
  keyId: '',
  bundleId: '',
  pushToken: '',
  priority: '5',
  actionType: 'start',
  contentState: ''
})

const errors = ref({
  p8File: '',
  teamId: '',
  keyId: '',
  bundleId: '',
  pushToken: '',
  priority: '',
  actionType: '',
  contentState: ''
})

const status = ref({ message: '', type: 'success' })

const hasErrors = computed(() => 
  Object.values(errors.value).some(error => error !== '') ||
  !form.value.p8File ||
  !form.value.teamId ||
  !form.value.keyId ||
  !form.value.bundleId ||
  !form.value.pushToken ||
  !form.value.contentState
)

const validateField = (field) => {
  errors.value[field] = ''
  
  switch (field) {
    case 'teamId':
      if (!form.value.teamId) {
        errors.value.teamId = 'Team ID is required'
      } else if (!/^[A-Z0-9]{10}$/.test(form.value.teamId)) {
        errors.value.teamId = 'Team ID must be 10 characters (letters and numbers)'
      }
      break
    
    case 'keyId':
      if (!form.value.keyId) {
        errors.value.keyId = 'Key ID is required'
      } else if (!/^[A-Z0-9]{10}$/.test(form.value.keyId)) {
        errors.value.keyId = 'Key ID must be 10 characters (letters and numbers)'
      }
      break
    
    case 'bundleId':
      if (!form.value.bundleId) {
        errors.value.bundleId = 'Bundle ID is required'
      } else if (!/^[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z0-9.-]+$/.test(form.value.bundleId)) {
        errors.value.bundleId = 'Invalid bundle ID format'
      }
      break
    
    case 'pushToken':
      if (!form.value.pushToken) {
        errors.value.pushToken = 'Push token is required'
      } else if (form.value.pushToken.length < 10) {
        errors.value.pushToken = 'Invalid push token'
      }
      break
    
    case 'contentState':
      if (!form.value.contentState) {
        errors.value.contentState = 'Content state is required'
      } else {
        try {
          JSON.parse(form.value.contentState)
        } catch (e) {
          errors.value.contentState = 'Invalid JSON format'
        }
      }
      break
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  errors.value.p8File = ''
  
  if (!file) {
    errors.value.p8File = 'Authentication key is required'
  } else if (!file.name.endsWith('.p8')) {
    errors.value.p8File = 'File must be a .p8 certificate'
  } else {
    form.value.p8File = file
  }
}

const validateAll = () => {
  validateField('teamId')
  validateField('keyId')
  validateField('bundleId')
  validateField('pushToken')
  validateField('contentState')
  if (!form.value.p8File) {
    errors.value.p8File = 'Authentication key is required'
  }
}

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(props.storageKey)
    if (saved) {
      const data = JSON.parse(saved)
      // Merge saved data with default form values, excluding p8File
      form.value = {
        ...form.value,
        ...data,
        p8File: null // Always reset file input for security
      }
    }
    
    // Apply any initial data from props
    if (props.initialData) {
      form.value = {
        ...form.value,
        ...props.initialData,
        p8File: null // Always reset file input for security
      }
    }
  } catch (e) {
    console.error('Error loading saved data:', e)
  }
}

// Save data to localStorage
const saveToStorage = () => {
  try {
    const dataToSave = { ...form.value }
    delete dataToSave.p8File // Don't save file data
    localStorage.setItem(props.storageKey, JSON.stringify(dataToSave))
  } catch (e) {
    console.error('Error saving data:', e)
  }
}

// Watch for form changes
watch(form, () => {
  saveToStorage()
}, { deep: true })

const availableTokens = ref([])
const filteredTokens = ref([])
const showTokenDropdown = ref(false)

// Function to fetch tokens from the API
const fetchTokens = async () => {
  try {
    const { data } = await useFetch('/api/get-tokens')
    if (data.value?.success && data.value?.tokens) {
      availableTokens.value = data.value.tokens
      filteredTokens.value = [...availableTokens.value]
    }
  } catch (error) {
    console.error('Error fetching tokens:', error)
  }
}

// Filter tokens based on user input
const filterTokens = () => {
  if (!form.value.pushToken) {
    filteredTokens.value = [...availableTokens.value]
  } else {
    filteredTokens.value = availableTokens.value.filter(
      token => token.token.toLowerCase().includes(form.value.pushToken.toLowerCase())
    )
  }
}

// Select a token from the dropdown
const selectToken = (token) => {
  form.value.pushToken = token
  validateField('pushToken')
  showTokenDropdown.value = false
}

// Load saved data and fetch tokens when component mounts
onMounted(() => {
  loadFromStorage()
  fetchTokens()
})

const handleSubmit = async () => {
  validateAll()
  
  if (hasErrors.value) {
    return
  }

  status.value = { message: '', type: 'success' }

  try {
    const p8Content = await readFileAsText(form.value.p8File)
    
    // Single API call with all required data
    const { data: response } = await useFetch('/api/send-push', {
      method: 'POST',
      body: {
        teamId: form.value.teamId,
        keyId: form.value.keyId,
        p8Content,
        pushToken: form.value.pushToken,
        bundleId: form.value.bundleId,
        payload: {
          aps: {
            "timestamp": Date.now(),
            "event": form.value.actionType,
            "content-state": JSON.parse(form.value.contentState)
          }
        },
        priority: parseInt(form.value.priority)
      }
    })

    if (response.value?.error) {
      throw new Error(response.value.error)
    }

    status.value = {
      message: 'Push notification sent successfully!',
      type: 'success'
    }
    
    // Only clear the file input after successful submission
    form.value.p8File = null
    saveToStorage()
    
    // Emit success event to parent
    emit('success', response.value)
    
  } catch (error) {
    console.error('Error:', error)
    status.value = {
      message: error.message || 'Failed to send push notification',
      type: 'error'
    }
    
    // Emit error event to parent
    emit('error', error)
  }
}
</script>
