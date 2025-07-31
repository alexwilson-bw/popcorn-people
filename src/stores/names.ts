import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { names as initialNames } from '@/assets/names.js'

export const useNamesStore = defineStore('names', () => {
  // Reactive state
  const activeNames = ref<string[]>([])
  const removedNames = ref<string[]>([])

  // Initialize names
  const initializeNames = () => {
    activeNames.value = [...initialNames]
  }

  // Call initialize on store creation
  initializeNames()

  // Function to remove a name from active list
  const removeName = (name: string) => {
    const index = activeNames.value.indexOf(name)
    if (index !== -1) {
      activeNames.value.splice(index, 1)
      removedNames.value.push(name)
    }
  }

  // Function to restore a name to active list
  const restoreName = (name: string) => {
    const index = removedNames.value.indexOf(name)
    if (index !== -1) {
      removedNames.value.splice(index, 1)
      activeNames.value.push(name)
    }
  }

  return {
    activeNames,
    removedNames,
    removeName,
    restoreName,
    initializeNames
  }
})
