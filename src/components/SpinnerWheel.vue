<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNamesStore } from '@/stores/names';

// Use the names store
const namesStore = useNamesStore();

// List of fear-inspiring messages related to impending doom
const doomMessages = [
  "The wheel of fate is turning...",
  "Your destiny awaits at the end of this spin...",
  "There's no escaping what comes next...",
  "The decision is out of your hands now...",
  "What will be, will be...",
  "The inevitable approaches...",
  "Time slows as your fate is decided...",
  "The countdown to your selection has begun...",
  "No turning back now...",
  "The wheel knows all, decides all...",
  "Your future spins before your eyes...",
  "The wheel of doom turns relentlessly...",
  "Resistance is futile, the wheel decides...",
  "The moment of truth draws near...",
  "Brace yourself for the wheel's judgment...",
  "The spinning wheel seals your fate...",
  "Your destiny is spinning into view...",
  "The wheel's choice is final and binding...",
  "Fortune favors the brave, or does it?",
  "The wheel is indifferent to your hopes...",
  "Each rotation brings you closer to the truth...",
  "The wheel's verdict is moments away...",
  "No amount of wishing can change the wheel's mind...",
  "The wheel's decision is absolute...",
  "Your fate hangs in the balance...",
  "The wheel spins, and with it, your future...",
  "There's a certain poetry to letting chance decide...",
  "The wheel cares not for your preferences...",
  "The final judgment approaches with each rotation..."
];

// Current fear message
const currentFearMessage = ref("");

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
const hasSpun = ref(false);
const spinData = ref({
  totalSpins: 0,
  spinOffset: 0,
  rotationAdded: 0,
  finalRotation: 0
});

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

  // Select a random fear message
  const randomIndex = Math.floor(Math.random() * doomMessages.length);
  currentFearMessage.value = doomMessages[randomIndex];

  // Random spin: 2-8 full rotations + random angle
  const minSpins = 4;
  const maxSpins = 30;
  const spins = Math.random() * (maxSpins - minSpins) + minSpins;
  const spinInDegrees = (spins * 360)
  const spinOffset = Math.random() * 360;
  const finalRotation = rotation.value + spinInDegrees + spinOffset

  // Store spin data for display
  spinData.value = {
    totalSpins: spins,
    spinOffset: spinOffset,
    rotationAdded: spinInDegrees + spinOffset,
    finalRotation: finalRotation
  };
  hasSpun.value = true;

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
  <v-card id="wheel-o-popcorn" class="mx-auto my-4">

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


          <div v-if="isSpinning" class="fear-message">
            {{ currentFearMessage }}
          </div>

          <!-- Spin Data Panel - only shows after first spin -->
          <div v-if="hasSpun" class="spin-data-panel mt-4">
            <v-card variant="outlined" class="pa-3">
              <v-card-title class="text-subtitle-1 pb-2">Spin Data</v-card-title>
              <v-card-text class="py-0">
                <div class="spin-data-item">
                  <span class="spin-data-label">Total Spins:</span>
                  <span class="spin-data-value">{{ spinData.totalSpins.toFixed(2) }}</span>
                </div>
                <div class="spin-data-item">
                  <span class="spin-data-label">Random Degrees Offset (1-360):</span>
                  <span class="spin-data-value">{{ spinData.spinOffset.toFixed(2) }}</span>
                </div>
                <div class="spin-data-item">
                  <span class="spin-data-label">Total Degrees Rotation:</span>
                  <span class="spin-data-value">{{ spinData.rotationAdded.toFixed(2) }}</span>
                </div>
                <div class="spin-data-item">
                  <span class="spin-data-label">Total Rotation This Session:</span>
                  <span class="spin-data-value">{{ spinData.finalRotation.toFixed(2) }}</span>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
#wheel-o-popcorn {
  width: 55%;
}

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

.fear-message {
  font-weight: bold;
  color: #ff5722;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  animation: pulse 1.5s infinite;
  text-shadow: 0 0 5px rgba(255, 87, 34, 0.3);
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
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

/* Spin Data Panel Styles */
.spin-data-panel {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.spin-data-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.spin-data-label {
  font-size: 11px;
  font-weight: 500;
  color: #555;
}

.spin-data-value {
  font-family: monospace;
  font-weight: 600;
  color: #1976d2;
}
</style>
