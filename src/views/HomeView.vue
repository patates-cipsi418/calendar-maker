<script lang="ts" setup>
import { computed, ref, useTemplateRef } from 'vue'
import type { CalendarEvent } from '../types/CalendarEvent'
import type { Color } from '../types/Color'
import type { CustomHoliday } from '../types/CustomHoliday'
import { ExcelReader } from '@/types/ExcelReader'
import Calendar from '../components/Calendar.vue'
import type { CalendarMonth } from '@/types/CalendarMonth'
import { fillHolidaysAll } from '@/types/HolidayEvent'
import html2canvas from 'html2canvas'
import { months } from '@/types/Calendar'

// todo add custom holidays
// todo add download option

const calendarsData = ref<CalendarMonth[]>([])
const colors = ref<Record<string, Color>>({})
const holidays = ref<boolean>(true)
const customHolidays = ref<CustomHoliday[]>([])

const calendars = computed(() =>
  !holidays.value
    ? calendarsData.value
    : fillHolidaysAll(calendarsData.value, customHolidays.value),
)

const backgroundImage = ref<string>('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const reader = new FileReader()
    // Read the file and set as base64 URL
    reader.onload = (e) => {
      backgroundImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleFile = async (event: Event) => {
  const input = event.target as HTMLInputElement

  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (file) {
    const reader = new ExcelReader(file)
    const eventsPromise = reader.read<CalendarEvent>('events')
    const colorsPromise = reader.read<Color>('colors')
    const holidaysPromise = reader.read<CustomHoliday>('custom-holidays')
    try {
      var [eventsData, colorsData, holidaysData] = await Promise.all([
        eventsPromise,
        colorsPromise,
        holidaysPromise,
      ])

      eventsData.forEach((event, index) => {
        const dateParts = event.date.split('-')
        const eventDate = new Date(
          parseInt(dateParts[0] || '1'), // année
          parseInt(dateParts[1] || '1') - 1, // mois (0-11)
          parseInt(dateParts[2] || '1'), // jour
        )
        event.eventDate = eventDate
      })

      eventsData = eventsData.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())

      const calendarMonths: CalendarMonth[] = []

      const evByYear = Object.entries(groupBy(eventsData, byYear))
      for (const evYear of evByYear) {
        if (evYear) {
          const evByMonth = Object.entries(groupBy(evYear[1] || [], byMonth))
          for (const evMonth of evByMonth) {
            const calendarMonth: CalendarMonth = {
              month: parseInt(evMonth[0]),
              year: parseInt(evYear[0]),
              events: evMonth[1] || [],
            }

            calendarMonths.push(calendarMonth)
          }
        }
      }

      calendarsData.value = calendarMonths
      customHolidays.value = holidaysData

      colors.value = colorsData
        .map((color) => ({ [color.type]: color }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier Excel:', error)
    }
  }

  function byYear(item: CalendarEvent) {
    return item.eventDate.getFullYear()
  }
  function byMonth(item: CalendarEvent) {
    return item.eventDate.getMonth()
  }

  function groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    return list.reduce(
      (previous, currentItem) => {
        const group = getKey(currentItem)
        if (!previous[group]) {
          previous[group] = []
        }
        previous[group].push(currentItem)
        return previous
      },
      {} as Record<K, T[]>,
    )
  }
}

function saveAll() {
  const calendarsE = document.querySelectorAll('.calendar-container')
  calendarsE.forEach(async (calendar, index) => {
    const canvas = await html2canvas(calendar as HTMLElement)
    if (canvas) {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `calendrier-${months[calendars.value[index]?.month || 0]}-${calendars.value[index]?.year}.png`
      link.click()
    }
  })
}
</script>

<template>
  <div>
    <a href="/public/background.png" download="background.png">background example</a>
    <br />
    <a href="/public/calendrier frat.xlsx" download="calendrier frat.xlsx">excel example</a>
  </div>
  <div>
    <input type="file" @change="handleFile" accept=".xlsx, .xls" />
    <input type="file" accept="image/*" @change="handleFileUpload" />
    <input type="checkbox" id="holidays" v-model="holidays" />
    <label for="holidays">include holidays</label>
    <button class="save-button" @click="saveAll">Save All Calendars</button>
  </div>
  <div>
    <Calendar
      v-for="value in calendars"
      :calendar-month="value"
      :colors="colors"
      :background-url="backgroundImage"
    ></Calendar>
  </div>
</template>
