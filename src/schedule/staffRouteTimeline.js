/** Mock workday route for expanded staff card (scheduling demo). */
export function getRouteTimeline(staff) {
  const first = staff.fullName.split(' ')[0]
  return {
    startLabel: `${first}'s residence — Bethesda, MD`,
    endLabel: `${first}'s residence — Bethesda, MD`,
    stops: [
      {
        time: '08:00',
        location: 'Home — start route',
        driveMins: 0,
        miles: 0,
        durationHrs: 0.25,
      },
      {
        time: '09:15',
        location: 'Vera Jameson — North zone visit',
        driveMins: staff.driveMins,
        miles: staff.miles,
        durationHrs: 2,
      },
      {
        time: '13:30',
        location: 'Supply & charting — NE DC',
        driveMins: 18,
        miles: 4.2,
        durationHrs: 0.75,
      },
      {
        time: '16:45',
        location: 'Home — end route',
        driveMins: 22,
        miles: 5.1,
        durationHrs: 0,
      },
    ],
  }
}

export function formatExperienceShort(experienceLabel) {
  return String(experienceLabel || '')
    .replace(/\s*[–]\s*/g, '-')
    .replace(/\s*years?/gi, ' yrs')
    .trim()
}
