const monthsEnum = Object.freeze({
    JANUARY: 'Janvier',
    FEBRUARY: 'Février',
    MARCH: 'Mars',
    APRIL: 'Avril',
    MAY: 'Mai',
    JUNE: 'Juin',
    JULY: 'Juillet',
    AUGUST: 'Août',
    SEPTEMBER: 'Septembre',
    OCTOBER: 'Octobre', 
    NOVEMBER: 'Novembre',
    DECEMBER: 'Décembre',

    getMonths() {
        return Object.values(this)
    }
})

export { monthsEnum }
