<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-800">Registered Tokens</h1>
          <button 
            @click="addToken" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Token
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="token in tokens" :key="token.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ token.value }}</td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button 
                    @click="editToken(token)" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteToken(token.id)" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
        </div>
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form @submit.prevent="saveToken" class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div class="mb-4">
              <label for="token" class="block text-sm font-medium text-gray-700">Token Value</label>
              <input
                id="token"
                v-model="tokenForm.value"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter token value"
              />
            </div>
            <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ isEditing ? 'Update' : 'Save' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tokens: [
        // Example tokens, replace with actual data
        { id: 1, value: 'token1' },
        { id: 2, value: 'token2' },
        { id: 3, value: 'token3' },
      ],
      showModal: false,
      isEditing: false,
      tokenForm: {
        id: null,
        value: ''
      }
    };
  },
  methods: {
    addToken() {
      this.isEditing = false;
      this.tokenForm = { id: null, value: '' };
      this.showModal = true;
    },
    editToken(token) {
      this.isEditing = true;
      this.tokenForm = { ...token };
      this.showModal = true;
    },
    closeModal() {
      // Add a small delay to allow animations to complete
      this.showModal = false;
      setTimeout(() => {
        this.tokenForm = { id: null, value: '' };
      }, 200);
    },
    saveToken() {
      if (this.isEditing) {
        const index = this.tokens.findIndex(t => t.id === this.tokenForm.id);
        if (index !== -1) {
          this.tokens[index] = { ...this.tokenForm };
        }
      } else {
        const newToken = {
          id: Date.now(), // temporary ID generation
          value: this.tokenForm.value
        };
        this.tokens.push(newToken);
      }
      this.closeModal();
    },
    deleteToken(tokenId) {
      // Implement delete token logic
      console.log('Delete token with ID:', tokenId);
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
