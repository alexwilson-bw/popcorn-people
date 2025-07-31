I'll create a spinner wheel component that uses the active names from the NameAdder component. This will be a fun way to randomly select someone from the active names list.

```vue template
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { names as initialNames } from '@/assets/names.js';

// Reactive state
const activeNames = ref<string[]>([]);
const removedNames = ref<string[]>([]);
const isSpinning = ref(false);
const rotation = ref(0);
const selectedName = ref<string | null>(null);

// Initialize names on component mount
onMounted(() => {
  activeNames.value = [...initialNames];
});

// Computed property for wheel segments
const segments = computed(() => {
  if (activeNames.value.length === 0) return [];

  const segmentAngle = 360 / activeNames.value.length;
  return activeNames.value.map((name, index) => ({
    name,
    startAngle: index * segmentAngle,
    endAngle: (index + 1) * segmentAngle,
    color: `hsl(${(index * 360) / activeNames.value.length}, 70%, 60%)`
  }));
});

// Function to remove a name from active list
const removeName = (name: string) => {
  const index = activeNames.value.indexOf(name);
  if (index !== -1) {
    activeNames.value.splice(index, 1);
    removedNames.value.push(name);
    selectedName.value = null;
  }
};

// Function to restore a name to active list
const restoreName = (name: string) => {
  const index = removedNames.value.indexOf(name);
  if (index !== -1) {
    removedNames.value.splice(index, 1);
    activeNames.value.push(name);
  }
};

// Function to spin the wheel
const spinWheel = () => {
  if (activeNames.value.length === 0 || isSpinning.value) return;

  isSpinning.value = true;
  selectedName.value = null;

  // Random spin: 3-6 full rotations + random angle
  const minSpins = 3;
  const maxSpins = 6;
  const spins = Math.random() * (maxSpins - minSpins) + minSpins;
  const finalRotation = rotation.value + (spins * 360) + Math.random() * 360;

  rotation.value = finalRotation;

  // Calculate which name was selected after spin completes
  setTimeout(() => {
    const normalizedAngle = (360 - (finalRotation % 360)) % 360;
    const segmentAngle = 360 / activeNames.value.length;
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
    selectedName.value = activeNames.value[selectedIndex];
    isSpinning.value = false;
  }, 3000); // Match the CSS animation duration
};
</script>

<template>
  <v-card class="mx-auto my-4" max-width="800">
    <v-card-title class="text-h5 bg-primary text-white">
      Popcorn Spinner Wheel
    </v-card-title>

    <v-card-text>
      <!-- Spinner Wheel Section -->
      <div class="wheel-section mb-6">
        <div class="wheel-container">
          <div class="wheel-wrapper">
            <!-- Pointer -->
            <div class="pointer"></div>

            <!-- Wheel -->
            <div 
              class="wheel" 
              :class="{ spinning: isSpinning }"
              :style="{ transform: `rotate(${rotation}deg)` }"
            >
              <div
                v-for="(segment, index) in segments"
                :key="segment.name"
                class="wheel-segment"
                :style="{
                  transform: `rotate(${segment.startAngle}deg)`,
                  backgroundColor: segment.color,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((360 / activeNames.length) * Math.PI / 180)}% ${50 - 50 * Math.sin((360 / activeNames.length) * Math.PI / 180)}%)`
                }"
              >
                <div 
                  class="segment-text"
                  :style="{ transform: `rotate(${180 / activeNames.length}deg)` }"
                >
                  {{ segment.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Spin Button -->
          <div class="spin-controls">
            <v-btn
              @click="spinWheel"
              :disabled="activeNames.length === 0 || isSpinning"
              color="primary"
              size="large"
              class="spin-button"
            >
              {{ isSpinning ? 'Spinning...' : 'Spin!' }}
            </v-btn>

            <div v-if="selectedName" class="selected-result mt-4">
              <v-alert color="success" variant="tonal">
                <strong>Selected: {{ selectedName }}</strong>
              </v-alert>
            </div>

            <div v-if="activeNames.length === 0" class="no-names-alert mt-4">
              <v-alert color="warning" variant="tonal">
                No active names available for spinning!
              </v-alert>
            </div>
          </div>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Active Names Section -->
      <div class="active-names-section">
        <h3 class="text-h6 mb-2">In Danger ({{ activeNames.length }})</h3>
        <v-list v-if="activeNames.length > 0">
          <v-list-item v-for="name in activeNames" :key="name">
            <v-list-item-title>{{ name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn
                variant="flat" 
                icon 
                @click="removeName(name)" 
                color="secondary"
                :disabled="isSpinning"
              >
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-alert v-else color="info" variant="tonal">
          All names are in the safe zone!
        </v-alert>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Removed Names Section -->
      <div class="removed-names-section" v-if="removedNames.length > 0">
        <h3 class="text-h6 mb-2">Safe Zone ({{ removedNames.length }})</h3>
        <v-list>
          <v-list-item v-for="name in removedNames" :key="name">
            <v-list-item-title>{{ name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn 
                color="success" 
                variant="outlined" 
                icon 
                @click="restoreName(name)"
                :disabled="isSpinning"
              >
                <v-icon>mdi-food-popcorn</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.wheel-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.wheel-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
}

.pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ff5722;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  border: 4px solid #333;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
}

.wheel.spinning {
  transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
}

.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.segment-text {
  position: absolute;
  top: 20px;
  left: 50%;
  transform-origin: 0 130px;
  font-weight: bold;
  font-size: 12px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  white-space: nowrap;
}

.spin-controls {
  text-align: center;
}

.spin-button {
  min-width: 120px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
}

.selected-result {
  max-width: 300px;
}

.no-names-alert {
  max-width: 300px;
}

.active-names-section, .removed-names-section {
  margin-bottom: 16px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .wheel-wrapper {
    width: 250px;
    height: 250px;
  }

  .wheel {
    width: 250px;
    height: 250px;
  }

  .segment-text {
    top: 15px;
    transform-origin: 0 110px;
    font-size: 10px;
  }
}
</style>
```


This spinner wheel component includes:

1. **Visual Wheel**: A circular wheel divided into colored segments, one for each active name
2. **Pointer**: A triangular pointer at the top to indicate the selected segment
3. **Spinning Animation**: Smooth CSS transition with realistic easing for 3 seconds
4. **Random Selection**: Spins 3-6 full rotations plus a random angle for unpredictability
5. **Name Management**: Same functionality as the original NameAdder - remove names to safe zone and restore them
6. **Responsive Design**: Adapts to smaller screens
7. **Result Display**: Shows the selected name after spinning completes
8. **Disabled States**: Prevents interactions during spinning

The wheel automatically adjusts the segment sizes based on how many active names there are, and each segment gets a different color using HSL color space for good visual distinction. The spinning uses a realistic cubic-bezier easing function to make it feel natural, starting fast and gradually slowing down.
