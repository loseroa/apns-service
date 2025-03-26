<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Device Tokens</h1>
        <div class="flex space-x-3">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Token
          </button>
          <button
            @click="refreshTokens"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!data?.tokens || data.tokens.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tokens found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by registering new device tokens.</p>
      </div>

      <!-- Tokens Table -->
      <div v-else class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div class="max-h-[70vh] overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App bundle</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(token, index) in data.tokens" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ token.userId || 'Not specified' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate hover:text-clip hover:overflow-visible">{{ token.token }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate hover:text-clip hover:overflow-visible">{{ token.appBundle }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ token.createdAt ? new Date(token.createdAt).toLocaleString() : 'Unknown' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex space-x-3 justify-end">
                    <!-- Edit button -->
                    <button @click="editToken(token.token)" class="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <!-- Send notification button -->
                    <button @click="sendNotification(token.token)" class="text-green-600 hover:text-green-900" title="Send Notification">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </button>
                    
                    <!-- Delete button -->
                    <button @click="deleteToken(token.token)" class="text-red-600 hover:text-red-900" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Token Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Register New Token</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="registerToken">
            <div class="space-y-4">
              <div>
                <label for="token" class="block text-sm font-medium text-gray-700">Device Token</label>
                <textarea 
                  id="token" 
                  v-model="newToken.token" 
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              
              <div>
                <label for="userId" class="block text-sm font-medium text-gray-700">User ID</label>
                <input 
                  type="text" 
                  id="userId" 
                  v-model="newToken.userId" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label for="appBundle" class="block text-sm font-medium text-gray-700">App Bundle</label>
                <input 
                  type="text" 
                  id="appBundle" 
                  v-model="newToken.appBundle" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div class="mt-5 sm:mt-6 flex space-x-3">
              <button 
                type="button" 
                @click="showCreateModal = false" 
                class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                :disabled="registering"
              >
                {{ registering ? 'Registering...' : 'Register Token' }}
              </button>
            </div>
            
            <div v-if="registerError" class="mt-3 text-sm text-red-600">
              {{ registerError }}
            </div>
          </form>
        </div>
      </div>
      
      <!-- Send Notification Modal -->
      <div v-if="showNotificationModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Send Push Notification</h3>
            <button @click="showNotificationModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <SendNotificationForm 
            :initial-data="{ pushToken: selectedToken }" 
            @success="handleNotificationSuccess" 
            @error="handleNotificationError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SendNotificationForm from '~/components/sendNotificationForm.vue';

interface Token {
    token: string;
    userId?: string;
    appBundle?: string;
    createdAt: string;
}

interface TokensResponse {
  success: boolean;
  tokens: Token[];
  error?: string;
  message?: string;
}

// Fetch tokens data with built-in loading and error handling
const { data, pending, error, refresh } = await useFetch<TokensResponse>('/api/get-tokens');

// Create token form state
const showCreateModal = ref(false);
const registering = ref(false);
const registerError = ref('');
const newToken = ref({
  token: '',
  userId: '',
  appBundle: ''
});

// Notification modal state
const showNotificationModal = ref(false);
const selectedToken = ref('');

// Function to open the create modal
const openCreateModal = () => {
  // Reset form
  newToken.value = {
    token: '',
    userId: '',
    appBundle: ''
  };
  registerError.value = '';
  showCreateModal.value = true;
};

// Function to register a new token
const registerToken = async () => {
  registering.value = true;
  registerError.value = '';
  
  try {
    const response = await $fetch('/api/register-token', {
      method: 'POST',
      body: {
        token: newToken.value.token,
        userId: newToken.value.userId,
        appBundle: newToken.value.appBundle
      }
    });
    
    // Close modal and refresh the list
    showCreateModal.value = false;
    refresh();
  } catch (err: any) {
    registerError.value = err.message || 'Failed to register token. Please try again.';
  } finally {
    registering.value = false;
  }
};

// Function to refresh the tokens list
const refreshTokens = () => {
  refresh();
};

// Function to delete a token
const deleteToken = (id: string) => {
    console.log(`Delete token with ID: ${id}`); 
    // Use $fetch with DELETE method
    $fetch(`/api/delete-token/${id}`, {
      method: 'DELETE'
    })
    .then(data => {
        console.log(data);
        refresh();
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

// Function to edit a token
const editToken = (id: string) => {
  console.log(`Edit token with ID: ${id}`);
  // Implement token editing functionality
};

// Function to send a notification
const sendNotification = (token: string) => {
  selectedToken.value = token;
  showNotificationModal.value = true;
};

// Handle notification success and errors
const handleNotificationSuccess = (response: any) => {
  showNotificationModal.value = false;
  // You could add a toast notification or other feedback here
};

const handleNotificationError = (error: any) => {
  // The error is handled in the component, but you could add additional handling here
  console.error('Notification error:', error);
};
</script>
