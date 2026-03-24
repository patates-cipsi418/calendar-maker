main();

async function main() {
  const importedEvents = await importEvents();
  await renderCallendar(importedEvents);
}

async function importEvents() {
  const eventsResponse = await fetch(eventsUrl);
  var events = [];
  events = await eventsResponse.json();
  events.forEach((event, index) => {
    const dateParts = event.date.split("-");
    const eventDate = new Date(
      parseInt(dateParts[0]), // année
      parseInt(dateParts[1]) - 1, // mois (0-11)
      parseInt(dateParts[2]), // jour
    );
    event.eventDate = eventDate;
  });

  events = events.sort((a, b) => a.eventDate - b.eventDate);
  return events;
}

async function renderCallendar(events) {
  const lastDate = events[events.length - 1].eventDate;
  const firstDate = events[0].eventDate;

  let currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  while (currentDate <= lastDate) {
    const monthEvents = getMonthEventsWithHolidays(
      events,
      currentDate.getMonth(),
      currentDate.getFullYear(),
    );

    const monthContainer = renderMonth(currentDate, monthEvents);
    document.body.appendChild(monthContainer);
    const canvas = await html2canvas(monthContainer); // Attendre que le rendu soit terminé
    const url = canvas.toDataURL("image/png");
    document.body.removeChild(monthContainer);

    const fileName = `calendrier-${mois[currentDate.getMonth()]}-${currentDate.getFullYear()}.png`;

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-button";
    saveBtn.textContent = "Sauvegarder l'image";
    saveBtn.onclick = function () {
      downloadURI(url, fileName);
    };
    document.body.appendChild(saveBtn);

    const img = document.createElement("img");
    img.src = url;
    img.className = "calendar-image";

    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;

    a.appendChild(img);
    document.body.appendChild(a);

    document.body.appendChild(document.createElement("hr"));

    document.body.appendChild(document.createElement("br"));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
}
function renderMonth(date, monthEvents) {
  const monthContainer = document.createElement("div");
  monthContainer.className = "container";

  const yearTitle = document.createElement("h2");
  yearTitle.className = "year-title";
  const txt = "" + date.getFullYear();
  yearTitle.textContent = txt.slice(0, 2) + "\n" + txt.slice(2);
  monthContainer.appendChild(yearTitle);
  const monthTitle = document.createElement("h2");
  monthTitle.className = "month-title";
  monthTitle.textContent = mois[date.getMonth()];
  monthContainer.appendChild(monthTitle);

  const table = document.createElement("table");
  table.className = "calendar-table";

  const tableHeader = document.createElement("tr");
  jours.forEach((jour) => {
    const th = document.createElement("th");
    th.className = "calendar-header";
    th.textContent = jour;
    tableHeader.appendChild(th);
  });
  table.appendChild(tableHeader);
  var row = document.createElement("tr");

  if (date.getDay() !== 0) {
    for (let i = 0; i < date.getDay(); i++) {
      const emptyCell = document.createElement("td");
      emptyCell.className = "calendar-cell empty-cell";
      row.appendChild(emptyCell);
    }
  }
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    if ((date.getDay() + day - 1) % 7 === 0) {
      table.appendChild(row);
      row = document.createElement("tr");
    }
    const cell = document.createElement("td");
    cell.className = "calendar-cell";

    addEventsToCell(cell, day, monthEvents);

    row.appendChild(cell);
  }
  for (let i = row.children.length; i < 7; i++) {
    const emptyCell = document.createElement("td");
    emptyCell.className = "calendar-cell empty-cell";
    row.appendChild(emptyCell);
  }

  table.appendChild(row);

  monthContainer.appendChild(table);

  return monthContainer;
}

function addEventsToCell(cell, day, monthEvents) {
  const dayNumber = document.createElement("div");
  dayNumber.className = "day-number";
  dayNumber.textContent = day;
  cell.appendChild(dayNumber);

  const eventsForDay = monthEvents.filter(
    (event) => event.eventDate.getDate() === day,
  );
  if (eventsForDay.length === 0) {
    return;
  }

  if (eventsForDay[0].type === "5@7") {
    cell.className += " event-5a7";
  } else if (eventsForDay[0].type === "important") {
    cell.className += " event-important";
  } else if (eventsForDay[0].type === "externe") {
    cell.className += " event-externe";
  } else {
    cell.className += " event-fete";
  }
  eventsForDay.forEach((event) => {
    const eventDiv = document.createElement("div");
    eventDiv.className = "event";
    const eventTitle = document.createElement("p");
    eventTitle.className = "event-title";
    eventTitle.textContent = event.title;
    eventDiv.appendChild(eventTitle);
    const eventDesc = document.createElement("p");
    eventDesc.className = "event-desc";
    eventDesc.textContent = event.description;
    eventDiv.appendChild(eventDesc);
    cell.appendChild(eventDiv);
  });
}

function downloadURI(uri, name) {
  var link = document.createElement("a");

  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  //after creating link you should delete dynamic link
  //clearDynamicLink(link);
}
