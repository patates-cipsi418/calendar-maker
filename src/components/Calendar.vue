<script lang="ts" setup>
import { computed } from 'vue'
import type { CalendarMonth } from '@/types/CalendarMonth'
import type { Color } from '@/types/Color'
import Day from './Day.vue'
import { days, months } from '@/types/Calendar'

interface Props {
  calendarMonth: CalendarMonth
  colors: Record<string, Color>
  backgroundUrl: string
}

const props = defineProps<Props>()

function range(start: number, end: number, step: number = 1) {
  return Array.from({ length: (end - start) / step }, (_, i) => start + i * step)
}

const year = computed(() => {
  const s = '' + props.calendarMonth.year
  return s.slice(0, 2) + '\n' + s.slice(2)
})
const month = computed(() => months[props.calendarMonth.month])
const firstDate = computed(() => new Date(props.calendarMonth.year, props.calendarMonth.month, 1))
const daysInMonth = computed(() =>
  new Date(props.calendarMonth.year, props.calendarMonth.month + 1, 0).getDate(),
)
const emptyCells = computed(() => firstDate.value.getDay())

const getColor = (eventType: string, transparent: boolean): string => {
  const color = props.colors[eventType]
  const defaultColor = props.colors['default']
  if (color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${transparent ? color.a : 1})`
  }
  return `rgba(${defaultColor?.r}, ${defaultColor?.g}, ${defaultColor?.b}, ${transparent ? defaultColor?.a : 1})` // Default color
}

const borderColor = computed(() => getColor('default', false))
const backgroundColor = computed(() => getColor('default', true))
const textColor = computed(() => getColor('text', false))
</script>

<template>
  <div class="calendar-container" :style="{ backgroundImage: `url(${props.backgroundUrl})` }">
    <h2 class="year-title">{{ year }}</h2>
    <h2 class="month-title">{{ month }}</h2>
    <table class="calendar-table" :style="{ '--border-color': getColor('default', false) }">
      <tr>
        <th v-for="day in days" class="calendar-header">
          {{ day }}
        </th>
      </tr>
      <tr>
        <td v-for="(item, index) in emptyCells" :key="index" class="calendar-cell empty-cell"></td>
        <Day
          v-for="(day, index) in 7 - emptyCells"
          :day="day"
          :calendar-month="calendarMonth"
          :colors="colors"
          :get-color="getColor"
        />
      </tr>
      <tr v-for="(weak, index) in Math.ceil(daysInMonth / 7) - 1">
        <Day
          v-for="(day, index) in range(
            weak * 7 - emptyCells + 1,
            Math.min((weak + 1) * 7 - emptyCells + 1, daysInMonth + 1),
          )"
          :day="day"
          :calendar-month="calendarMonth"
          :colors="colors"
          :get-color="getColor"
        />
      </tr>
    </table>
  </div>
</template>

<style scoped>
.calendar-container {
  width: 1920px;
  height: 1080px;
  background-size: cover;
  padding: 0;
}
.calendar-table {
  margin: 0 0 0 150px;
  border-spacing: 6px;
}
.calendar-header,
.calendar-cell {
  border: 2px solid;
  border-color: v-bind('borderColor');
  height: 90px;
  width: 170px;
  vertical-align: top;
  padding: 10px 10px 10px 16px;
}
.calendar-header {
  background-color: v-bind('backgroundColor');
}

.year-title,
.month-title,
.calendar-header {
  font-family: hussar;
  color: v-bind('textColor');
  text-transform: uppercase;
}
.year-title {
  margin: 0 20px 10px 150px;
  display: inline-block;
  white-space: pre;
  font-size: 4em;
}
.month-title {
  margin: 60px 20px 10px 0;
  display: inline-block;
  font-size: 10em;
}
.year-title,
.month-title {
  height: 160px;
}
.calendar-header {
  font-size: 2.3em;
  line-height: 90px;
}
.calendar-image {
  width: 960px;
  height: 540px;
}
.save-button {
  font-family: hussar;
  display: block;
}
</style>
