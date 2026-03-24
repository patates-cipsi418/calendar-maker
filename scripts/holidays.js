function getMonthEventsWithHolidays(events, month, year) {
  const monthEvents = events.filter(
    (event) =>
      event.eventDate.getFullYear() === year &&
      event.eventDate.getMonth() === month,
  );

  const easterDate = getEaster(year);
  const easterEvent = monthEvents.find(
    (event) =>
      event.eventDate.getDate() === easterDate.getDate() &&
      event.eventDate.getMonth() === easterDate.getMonth(),
  );
  if (!easterEvent && easterDate.getMonth() === month) {
    monthEvents.push({
      date: `${year}-${String(easterDate.getMonth() + 1).padStart(2, "0")}-${String(
        easterDate.getDate(),
      ).padStart(2, "0")}`,
      title: "Pâques",
      description: "",
      type: "fete",
      eventDate: easterDate,
    });
  }

  if (month == 0) {
    //janvier
    const newYearEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 1,
    );
    if (!newYearEvent) {
      monthEvents.push({
        date: `${year}-01-01`,
        title: "Nouvel An",
        description: "",
        type: "fete",
        eventDate: new Date(year, 0, 1),
      });
    }
  } else if (month == 1) {
    //fevrier
    const valEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 14,
    );
    if (!valEvent) {
      monthEvents.push({
        date: `${year}-02-14`,
        title: "Saint Valentin",
        description: "",
        type: "fete",
        eventDate: new Date(year, 1, 14),
      });
    }
  } else if (month == 2) {
    //mars
    const stPatEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 17,
    );
    if (!stPatEvent) {
      monthEvents.push({
        date: `${year}-03-17`,
        title: "Saint Patrick",
        description: "",
        type: "fete",
        eventDate: new Date(year, 2, 17),
      });
    }
  } else if (month == 4) {
    //mai
    const feteMere =
      8 - currentDate.getDay() + (currentDate.getDay() !== 0 ? 7 : 0); // Deuxième dimanche de mai
    const feteMereEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === feteMere,
    );
    if (!feteMereEvent) {
      monthEvents.push({
        date: `${year}-5-${feteMere}`,
        title: "Fête des Mères",
        description: "",
        type: "fete",
        eventDate: new Date(year, 4, feteMere),
      });
    }

    const patrioteDate = new Date(year, 4, 25);
    if (patrioteDate.getDay() == 1) {
      patrioteDate.setDate(25 - 7);
    } else {
      patrioteDate.setDate(25 - (patrioteDate.getDay() || 7) + 1);
    }
    const patrioteEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === patrioteDate.getDate(),
    );
    if (!patrioteEvent) {
      monthEvents.push({
        date: `${year}-5-${patrioteDate.getDate()}`,
        title: "Journée des Patriotes",
        description: "",
        type: "fete",
        eventDate: new Date(year, 4, patrioteDate.getDate()),
      });
    }
  } else if (month == 5) {
    //juin
    const fetePere =
      15 - currentDate.getDay() + (currentDate.getDay() !== 0 ? 7 : 0); // Troisième dimanche de juin
    const fetePereEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === fetePere,
    );
    if (!fetePereEvent) {
      monthEvents.push({
        date: `${year}-6-${fetePere}`,
        title: "Fête des Pères",
        description: "",
        type: "fete",
        eventDate: new Date(year, 5, fetePere),
      });
    }

    const quebecDayEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 24,
    );
    if (!quebecDayEvent) {
      monthEvents.push({
        date: `${year}-6-24`,
        title: "Fête du Québec",
        description: "",
        type: "fete",
        eventDate: new Date(year, 5, 24),
      });
    }
  } else if (month == 6) {
    //juillet
    const feteNatEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 24,
    );
    if (!feteNatEvent) {
      monthEvents.push({
        date: `${year}-7-1`,
        title: "Fête du Canada",
        description: "",
        type: "fete",
        eventDate: new Date(year, 6, 1),
      });
    }
  } else if (month == 8) {
    //septembre
    const labourDayDate = new Date(year, 8, 1);
    if (labourDayDate.getDay() == 0) {
      labourDayDate.setDate(1 + 1);
    } else {
      labourDayDate.setDate(1 + (7 - labourDayDate.getDay() + 1));
    }
    const labourDayEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === labourDayDate.getDate(),
    );
    if (!labourDayEvent) {
      monthEvents.push({
        date: `${year}-9-${labourDayDate.getDate()}`,
        title: "Fête du Travail",
        description: "",
        type: "fete",
        eventDate: new Date(year, 8, labourDayDate.getDate()),
      });
    }
  } else if (month == 9) {
    //octobre
    const halloweenEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 31,
    );
    if (!halloweenEvent) {
      monthEvents.push({
        date: `${year}-10-31`,
        title: "Halloween",
        description: "",
        type: "fete",
        eventDate: new Date(year, 9, 31),
      });
    }
  } else if (month == 10) {
    //novembre
    const souvenirEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 11,
    );
    if (!souvenirEvent) {
      monthEvents.push({
        date: `${year}-11-11`,
        title: "Jour du Souvenir",
        description: "",
        type: "fete",
        eventDate: new Date(year, 10, 11),
      });
    }
  } else if (month == 11) {
    //decembre
    const noelEvent = monthEvents.find(
      (event) => event.eventDate.getDate() === 25,
    );
    if (!noelEvent) {
      monthEvents.push({
        date: `${year}-12-25`,
        title: "Noël",
        description: "",
        type: "fete",
        eventDate: new Date(year, 11, 25),
      });
    }
  }
  return monthEvents;
}

function getEaster(year) {
  // Algorithme simplifié de Meeus/Jones/Butcher (adapté)
  let a = year % 19;
  let b = Math.floor(year / 100);
  let c = year % 100;
  let d = Math.floor(b / 4);
  let e = b % 4;
  let f = Math.floor((b + 8) / 25);
  let g = Math.floor((b - f + 1) / 3);
  let h = (19 * a + b - d - g + 15) % 30;
  let i = Math.floor(c / 4);
  let k = c % 4;
  let l = (32 + 2 * e + 2 * i - h - k) % 7;
  let m = Math.floor((a + 11 * h + 22 * l) / 451);
  let month = Math.floor((h + l - 7 * m + 114) / 31);
  let day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day); // month-1 car JavaScript commence à 0
}