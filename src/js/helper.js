const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const oneDay = 1000 * 60 * 60  * 24;
const today = new Date();
const yesterday = new Date(today.getTime() - oneDay);
const tomorrow = new Date(today.getTime() + oneDay);

const pad = (n) => {
    return n<10 ? '0'+n : n;
}

export const dateFormatter = (dateObject, modifier='default') => {
    if (modifier === 'default') {
        if (dateObject.toLocaleDateString() === today.toLocaleDateString()) return 'Today'
        else if (dateObject.toLocaleDateString() === tomorrow.toLocaleDateString()) return 'Tomorrow'
        else if (dateObject.toLocaleDateString() === yesterday.toLocaleDateString()) return 'Yesterday'
        else return `${day[dateObject.getDay()]}, ${dateObject.getDate()} ${month[dateObject.getMonth()]}`
    }
    else if (modifier === 'dateId') {
        return `${dateObject.getFullYear()}${pad(dateObject.getMonth()+1)}${pad(dateObject.getDate())}`
    }
    else {
        let dateFrom, dateTo;
        if (modifier === 'matchesListAPI') {
            dateFrom = new Date(today.getTime() - 3*oneDay);
            dateTo = new Date(today.getTime() + 4*oneDay);
        }
        if (modifier === 'detailPageAPI') {
            dateFrom = new Date(today.getTime() - 21*oneDay);
            dateTo = new Date(today.getTime() + 14*oneDay);
        }

        const dateFromString = `${dateFrom.getFullYear()}-${pad(dateFrom.getMonth()+1)}-${pad(dateFrom.getDate())}`
        const dateToString = `${dateTo.getFullYear()}-${pad(dateTo.getMonth()+1)}-${pad(dateTo.getDate())}`
        return `dateFrom=${dateFromString}&dateTo=${dateToString}`
    }

}

export const timeFormatter = (dateObject) => {
    return dateObject.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    })
}