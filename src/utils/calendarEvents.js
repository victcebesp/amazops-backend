const moment = require('moment')

const updateEvents = (events, newEvent) => {
  const date = moment(newEvent.eventDate)
  const year = date.year()
  const month = date.month() + 1
  const day = date.date()
  console.log('update dates', year, month, day)

  const eventsOnYear = events[year] ?? {}
  const eventsOnMonth = eventsOnYear[month] ?? {}
  const eventsOnDay = eventsOnMonth[day] ?? []

  eventsOnDay.push(newEvent)
  eventsOnMonth[day] = eventsOnDay
  eventsOnYear[month] = eventsOnMonth
  events[year] = eventsOnYear

  return events
}

module.exports = {
  updateEvents
}
