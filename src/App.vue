<script setup lang="ts">
import NameAdder from "@/components/NameAdder.vue";
import SpinnerWheel from "@/components/SpinnerWheel.vue";
import { ref, onMounted, computed } from 'vue';

// Array of app titles related to popcorn
const appTitles = [
  "Popcorn People",
  "Kernel Crew",
  "Pop Stars",
  "Butter Buddies",
  "Popcorn Pals",
  "Kernel Kings and Queens",
  "Pop Squad",
  "Butter Brigade",
  "Popcorn Party",
  "Kernel Crew",
  "Pop Parade",
  "Butter Bunch",
  "Popcorn Posse",
  "Kernel Connection",
  "Pop Pioneers",
  "Butter Buds",
  "Popcorn Pickers",
  "Kernel Carnival",
  "Pop Professionals",
  "Butter Believers",
  "Popcorn Pundits",
  "Kernel Comrades",
  "Pop Personalities",
  "Butter Besties",
  "Popcorn Peeps",
  "Pop Prodigies",
  "Butter Buddies",
  "Popcorn Participants",
  "Kernel Collective"
];

// Randomly select a title
const randomTitle = ref(appTitles[0]); // Default to first title

// Get today's date in a readable format
const todayDate = computed(() => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Check if today is Friday
const isFriday = computed(() => {
  return new Date().getDay() === 5; // 5 represents Friday (0 is Sunday, 1 is Monday, etc.)
});

// Select a random title on page load
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * appTitles.length);
  randomTitle.value = appTitles[randomIndex];
});
</script>

<template>
  <v-app id="app">
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>{{ randomTitle }}</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <div class="components-container">
        <NameAdder/>
        <SpinnerWheel/>
      </div>
    </v-main>

    <v-footer app color="primary" dark>
      <v-col class="text-center" cols="12">
        {{ todayDate }} — <strong>{{ isFriday ? 'it is Friday! 🎉' : 'it is NOT friday' }}</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<style scoped>

#app {
  width: 75vw;
  margin-left: 12.5vw;
}

.components-container {
  display: flex;
  flex-direction: row;
}


</style>
