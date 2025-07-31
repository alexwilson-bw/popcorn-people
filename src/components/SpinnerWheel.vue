<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNamesStore } from '@/stores/names';

// Use the names store
const namesStore = useNamesStore();

// Function to generate a pie slice shape with curved edges
const generatePieSlice = (totalSegments: number) => {
  const segmentAngle = 360 / totalSegments;

  // Generate points along the arc to create a curved edge
  let clipPath = 'polygon(50% 50%';

  // Add points along the arc (more points = smoother curve)
  const numPoints = 15; // Number of points to create along the arc
  for (let i = 0; i <= numPoints; i++) {
    const pointAngle = (i / numPoints) * segmentAngle;
    const angleInRadians = (pointAngle * Math.PI) / 180;
    // In CSS coordinate system, 0 degrees is at the top, and angles increase clockwise
    const x = 50 + 50 * Math.sin(angleInRadians);
    const y = 50 - 50 * Math.cos(angleInRadians);
    clipPath += `, ${x.toFixed(2)}% ${y.toFixed(2)}%`;
  }

  clipPath += ')';
  return clipPath;
};

// Reactive state for the spinner
const isSpinning = ref(false);
const rotation = ref(0);
const selectedName = ref<string | null>(null);

// Computed property for wheel segments
const segments = computed(() => {
  if (!namesStore.activeNames || namesStore.activeNames.length === 0) return [];

  const segmentAngle = 360 / namesStore.activeNames.length;
  return namesStore.activeNames.map((name, index) => ({
    name,
    startAngle: index * segmentAngle,
    endAngle: (index + 1) * segmentAngle,
    color: `hsl(${(index * 360) / namesStore.activeNames.length}, 70%, 60%)`
  }));
});

// Function to spin the wheel
const spinWheel = () => {
  if (!namesStore.activeNames || namesStore.activeNames.length === 0 || isSpinning.value) return;

  isSpinning.value = true;
  selectedName.value = null;

  // Random spin: 2-8 full rotations + random angle
  const minSpins = 2;
  const maxSpins = 12;
  const spins = Math.random() * (maxSpins - minSpins) + minSpins;
  const finalRotation = rotation.value + (spins * 360) + Math.random() * 360;

  rotation.value = finalRotation;

  // Calculate which name was selected after spin completes
  setTimeout(() => {
    if (!namesStore.activeNames || namesStore.activeNames.length === 0) {
      isSpinning.value = false;
      return;
    }
    const normalizedAngle = (360 - (finalRotation % 360)) % 360;
    const segmentAngle = 360 / namesStore.activeNames.length;
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
    selectedName.value = namesStore.activeNames[selectedIndex];
    isSpinning.value = false;
  }, 5000); // Match the CSS animation duration
};
</script>

<template>
  <v-card class="mx-auto my-4" max-width="800">
<!--    <v-card-title class="text-h5 bg-primary text-white">-->
<!--      -->
<!--    </v-card-title>-->

    <v-card-text class="wheel-card-content">
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
                  clipPath: generatePieSlice(namesStore.activeNames?.length || 1)
                }"
              >
                <div
                  class="segment-text"
                  :style="{ transform: `rotate(${180 / (namesStore.activeNames?.length || 1)}deg)` }"
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
              :disabled="!namesStore.activeNames || namesStore.activeNames.length === 0 || isSpinning"
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

            <div v-if="!namesStore.activeNames || namesStore.activeNames.length === 0" class="no-names-alert mt-4">
              <v-alert color="warning" variant="tonal">
                No active names available for spinning!
              </v-alert>
            </div>
          </div>
        </div>
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
  transition: transform 5s cubic-bezier(0.23, 1, 0.32, 1);
}

.wheel.spinning {
  transition: transform 5s cubic-bezier(0.23, 1, 0.32, 1);
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

/* Responsive adjustments */
.wheel-card-content {
  padding: 16px;
}

@media (max-width: 1200px) {
  .wheel-wrapper {
    width: 280px;
    height: 280px;
  }

  .wheel {
    width: 280px;
    height: 280px;
  }

  .segment-text {
    top: 18px;
    transform-origin: 0 120px;
    font-size: 11px;
  }
}

@media (max-width: 992px) {
  .wheel-wrapper {
    width: 260px;
    height: 260px;
  }

  .wheel {
    width: 260px;
    height: 260px;
  }

  .segment-text {
    top: 16px;
    transform-origin: 0 115px;
    font-size: 10px;
  }
}

@media (max-width: 768px) {
  .wheel-container {
    gap: 1rem;
  }

  .wheel-wrapper {
    width: 240px;
    height: 240px;
  }

  .wheel {
    width: 240px;
    height: 240px;
  }

  .segment-text {
    top: 15px;
    transform-origin: 0 105px;
    font-size: 9px;
  }

  .spin-button {
    min-width: 100px;
    height: 40px;
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .wheel-wrapper {
    width: 220px;
    height: 220px;
  }

  .wheel {
    width: 220px;
    height: 220px;
  }

  .segment-text {
    top: 12px;
    transform-origin: 0 95px;
    font-size: 8px;
  }

  .pointer {
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 24px solid #ff5722;
  }
}
</style>
