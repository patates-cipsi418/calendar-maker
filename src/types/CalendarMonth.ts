import type { CalendarEvent } from './CalendarEvent'

export type CalendarMonth = {
  month: number
  year: number
  events: CalendarEvent[]
}
