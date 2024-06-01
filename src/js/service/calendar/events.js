const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const nextMonth = date.getMonth() + 1;
const day = date.getDate();

const events = [
    {
        date: new Date(year, month, day),
        startHours: '08:30',
        endHours: '12:00',
        title: 'Meeting with Vladimir',
        color: '#2196f3',
    },
    {
        date: new Date(year, month, day),
        startHours: '08:00',
        endHours: '18:00',
        title: 'Shopping',
        color: '#4caf50',
    },
    {
        date: new Date(year, month, day),
        startHours: "21:00",
        endHours: "22:00",
        title: 'Gym',
        color: '#e91e63',
    },
    {
        date: new Date(year, month, day + 2),
        startHours: '21:00',
        endHours: '22:00',
        title: 'Dev',
        color: '#ff9800',
    },
]

export { events }