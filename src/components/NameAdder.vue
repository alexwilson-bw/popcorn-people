<script setup lang="ts">
import { useNamesStore } from '@/stores/names';

// Use the names store
const namesStore = useNamesStore();
</script>

<template>
  <v-card id="main" class="mx-auto my-4" max-width="600">
    <v-card-title class="text-h5 bg-primary text-white">
      Popcorn Pool
    </v-card-title>

    <v-card-text>
      <div class="active-names-section">
        <v-list>
          <v-list-item v-for="name in namesStore.activeNames" :key="name">
            <v-list-item-title>{{ name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn
                variant="flat" icon @click="namesStore.removeName(name)" color="secondary">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <v-divider class="my-4"></v-divider>

      <div class="removed-names-section" v-if="namesStore.removedNames.length > 0">
        <h3 class="text-h6 mb-2" style="color: green;">🛡️ Safe Zone ✅</h3>
        <v-list>
          <v-list-item v-for="name in namesStore.removedNames" :key="name">
            <v-list-item-title>{{ name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn color="success" variant="outlined" icon @click="namesStore.restoreName(name)">
                <v-icon>mdi-popcorn</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.active-names-section, .removed-names-section {
  margin-bottom: 16px;
}

#main {
  width: 100%;
  max-width: 600px;
}

@media (max-width: 768px) {
  #main {
    max-width: 100%;
  }

  .v-list-item {
    padding: 8px;
  }

  .v-list-item-title {
    font-size: 0.9rem;
  }
}

</style>
