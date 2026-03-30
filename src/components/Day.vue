<script lang="ts" setup>
import type { CalendarMonth } from '@/types/CalendarMonth'
import type { Color } from '@/types/Color'
import { computed } from 'vue'

interface Props {
  calendarMonth: CalendarMonth
  colors: Record<string, Color>
  day: number
  getColor: (eventType: string, transparent: boolean) => string
}
const props = defineProps<Props>()
const events = computed(() =>
  props.calendarMonth.events.filter((e) => e.eventDate.getDate() == props.day),
)

const styleText = computed(() => {
  if (events.value[0]) {
    return `border-color: ${props.getColor(events.value[0].type, false)};background-color: ${props.getColor(events.value[0].type, true)};`
  }
  return `border-color: ${props.getColor('default', false)};`
})
const dayColor = computed(() => props.getColor('day', false))
const textColor = computed(() => props.getColor('text', false))
</script>

<template>
  <td class="calendar-cell" :style="styleText">
    <div class="day-number">{{ props.day }}</div>
    <div v-for="event in events" class="event">
      <p class="event-title">{{ event.title }}</p>
      <p class="event-desc">{{ event.description }}</p>
    </div>
  </td>
</template>

<style lang="css" scoped>
.day-number {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 2em;
  font-family: lucidity-condensed;
  position: absolute;
  color: v-bind('dayColor');
}
.event-title,
.event-desc {
  font-family: telegraf;
  font-size: 0.9em;
  color: v-bind('textColor');
  text-transform: uppercase;
  text-align: left;
}
.event-title {
  font-weight: bold;
  margin: 10px 0 0 40px;
}
.event-desc {
  margin: 4px 0 0 40px;
}
</style>
