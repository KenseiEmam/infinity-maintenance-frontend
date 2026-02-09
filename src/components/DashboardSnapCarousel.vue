<template>
  <div class="mx-auto px-6 pb-6 overflow-hidden relative max-w-[85vw] mx-auto">
    <!-- Left Fade -->
    <div
      class="absolute md:w-64 h-full bg-gradient-to-r dark:from-infin-darksecbg from-infin-secbg to-transparent left-0 z-20 pointer-events-none"
    ></div>

    <!-- Right Fade -->
    <div
      class="absolute md:w-64 h-full bg-gradient-to-l dark:from-infin-darksecbg from-infin-secbg to-transparent right-0 z-20 pointer-events-none"
    ></div>

    <!-- Track -->
    <div
      ref="track"
      class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel.passive="onWheel"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const track = ref<HTMLElement | null>(null)

let dragging = false
let startX = 0
let startScrollLeft = 0

const onPointerDown = (e: PointerEvent) => {
  if (!track.value) return
  dragging = true
  startX = e.clientX
  startScrollLeft = track.value.scrollLeft
  track.value.setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging || !track.value) return
  const dx = e.clientX - startX
  track.value.scrollLeft = startScrollLeft - dx
}

const snapToNearest = () => {
  if (!track.value) return

  const container = track.value
  const children = Array.from(container.children) as HTMLElement[]
  if (!children.length) return

  const center = container.scrollLeft + container.clientWidth / 2

  let bestEl: HTMLElement | null = null
  let bestDist = Infinity

  for (const el of children) {
    const elCenter = el.offsetLeft + el.clientWidth / 2
    const dist = Math.abs(center - elCenter)
    if (dist < bestDist) {
      bestDist = dist
      bestEl = el
    }
  }

  bestEl?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
}

const onPointerUp = () => {
  dragging = false
  snapToNearest()
}

/* wheel -> snap after user stops scrolling */
let wheelTimeout: number | null = null
const onWheel = () => {
  if (wheelTimeout) window.clearTimeout(wheelTimeout)
  wheelTimeout = window.setTimeout(() => {
    snapToNearest()
  }, 120)
}
</script>

<style scoped>
/* Prevent vertical hijacking while allowing horizontal dragging */
:deep(*) {
  touch-action: pan-y;
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
