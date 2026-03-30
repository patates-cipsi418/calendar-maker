import type { CalendarMonth } from './CalendarMonth'
import type { CustomHoliday } from './CustomHoliday'

export function fillHolidaysAll(cs: CalendarMonth[], customHolidays: CustomHoliday[]) {
  return cs.map((c) => fillHolidays(c, customHolidays))
}

export function fillHolidays(c: CalendarMonth, customHolidays: CustomHoliday[]) {
  const nc = { ...c, events: [...c.events] }

  const firstDay = new Date(nc.year, nc.month, 1)
  const easterDate = getEaster(nc.year)
  const easterEvent = nc.events.find(
    (event) =>
      event.eventDate.getDate() === easterDate.getDate() &&
      event.eventDate.getMonth() === easterDate.getMonth(),
  )
  if (!easterEvent && easterDate.getMonth() === nc.month) {
    nc.events.push({
      date: `${nc.year}-${String(easterDate.getMonth() + 1).padStart(2, '0')}-${String(
        easterDate.getDate(),
      ).padStart(2, '0')}`,
      title: 'Pâques',
      description: '',
      type: 'holiday',
      eventDate: easterDate,
    })
  }

  customHolidays.forEach((holiday) => {
    const existingEvent = nc.events.find(
      (event) =>
        event.eventDate.getDate() === holiday.day && event.eventDate.getMonth() === holiday.month,
    )
    if (!existingEvent) {
      nc.events.push({
        date: `${nc.year}-${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(
          2,
          '0',
        )}`,
        title: holiday.name,
        description: holiday.description,
        type: 'holiday',
        eventDate: new Date(nc.year, holiday.month, holiday.day),
      })
    }
  })

  if (nc.month == 0) {
    //janvier
    const newYearEvent = nc.events.find((event) => event.eventDate.getDate() === 1)
    if (!newYearEvent) {
      nc.events.push({
        date: `${nc.year}-01-01`,
        title: 'Nouvel An',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 0, 1),
      })
    }
  } else if (nc.month == 1) {
    //fevrier
    const valEvent = nc.events.find((event) => event.eventDate.getDate() === 14)
    if (!valEvent) {
      nc.events.push({
        date: `${nc.year}-02-14`,
        title: 'Saint Valentin',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 1, 14),
      })
    }
  } else if (nc.month == 2) {
    //mars
    const stPatEvent = nc.events.find((event) => event.eventDate.getDate() === 17)
    if (!stPatEvent) {
      nc.events.push({
        date: `${nc.year}-03-17`,
        title: 'Saint Patrick',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 2, 17),
      })
    }
  } else if (nc.month == 4) {
    //mai
    const feteMere = 8 - firstDay.getDay() + (firstDay.getDay() !== 0 ? 7 : 0) // Deuxième dimanche de mai
    const feteMereEvent = nc.events.find((event) => event.eventDate.getDate() === feteMere)
    if (!feteMereEvent) {
      nc.events.push({
        date: `${nc.year}-5-${feteMere}`,
        title: 'Fête des Mères',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 4, feteMere),
      })
    }

    const patrioteDate = new Date(nc.year, 4, 25)
    if (patrioteDate.getDay() == 1) {
      patrioteDate.setDate(25 - 7)
    } else {
      patrioteDate.setDate(25 - (patrioteDate.getDay() || 7) + 1)
    }
    const patrioteEvent = nc.events.find(
      (event) => event.eventDate.getDate() === patrioteDate.getDate(),
    )
    if (!patrioteEvent) {
      nc.events.push({
        date: `${nc.year}-5-${patrioteDate.getDate()}`,
        title: 'Journée des Patriotes',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 4, patrioteDate.getDate()),
      })
    }
  } else if (nc.month == 5) {
    //juin
    const fetePere = 15 - firstDay.getDay() + (firstDay.getDay() !== 0 ? 7 : 0) // Troisième dimanche de juin
    const fetePereEvent = nc.events.find((event) => event.eventDate.getDate() === fetePere)
    if (!fetePereEvent) {
      nc.events.push({
        date: `${nc.year}-6-${fetePere}`,
        title: 'Fête des Pères',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 5, fetePere),
      })
    }

    const quebecDayEvent = nc.events.find((event) => event.eventDate.getDate() === 24)
    if (!quebecDayEvent) {
      nc.events.push({
        date: `${nc.year}-6-24`,
        title: 'Fête du Québec',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 5, 24),
      })
    }
  } else if (nc.month == 6) {
    //juillet
    const feteNatEvent = nc.events.find((event) => event.eventDate.getDate() === 24)
    if (!feteNatEvent) {
      nc.events.push({
        date: `${nc.year}-7-1`,
        title: 'Fête du Canada',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 6, 1),
      })
    }
  } else if (nc.month == 8) {
    //septembre
    const labourDayDate = new Date(nc.year, 8, 1)
    if (labourDayDate.getDay() == 0) {
      labourDayDate.setDate(1 + 1)
    } else {
      labourDayDate.setDate(1 + (7 - labourDayDate.getDay() + 1))
    }
    const labourDayEvent = nc.events.find(
      (event) => event.eventDate.getDate() === labourDayDate.getDate(),
    )
    if (!labourDayEvent) {
      nc.events.push({
        date: `${nc.year}-9-${labourDayDate.getDate()}`,
        title: 'Fête du Travail',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 8, labourDayDate.getDate()),
      })
    }
  } else if (nc.month == 9) {
    //octobre
    const halloweenEvent = nc.events.find((event) => event.eventDate.getDate() === 31)
    if (!halloweenEvent) {
      nc.events.push({
        date: `${nc.year}-10-31`,
        title: 'Halloween',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 9, 31),
      })
    }
  } else if (nc.month == 10) {
    //novembre
    const souvenirEvent = nc.events.find((event) => event.eventDate.getDate() === 11)
    if (!souvenirEvent) {
      nc.events.push({
        date: `${nc.year}-11-11`,
        title: 'Jour du Souvenir',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 10, 11),
      })
    }
  } else if (nc.month == 11) {
    //decembre
    const noelEvent = nc.events.find((event) => event.eventDate.getDate() === 25)
    if (!noelEvent) {
      nc.events.push({
        date: `${nc.year}-12-25`,
        title: 'Noël',
        description: '',
        type: 'holiday',
        eventDate: new Date(nc.year, 11, 25),
      })
    }
  }
  return nc
}

function getEaster(year: number) {
  // Algorithme simplifié de Meeus/Jones/Butcher (adapté)
  let a = year % 19
  let b = Math.floor(year / 100)
  let c = year % 100
  let d = Math.floor(b / 4)
  let e = b % 4
  let f = Math.floor((b + 8) / 25)
  let g = Math.floor((b - f + 1) / 3)
  let h = (19 * a + b - d - g + 15) % 30
  let i = Math.floor(c / 4)
  let k = c % 4
  let l = (32 + 2 * e + 2 * i - h - k) % 7
  let m = Math.floor((a + 11 * h + 22 * l) / 451)
  let month = Math.floor((h + l - 7 * m + 114) / 31)
  let day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day) // month-1 car JavaScript commence à 0
}
