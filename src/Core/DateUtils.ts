import moment from 'moment'

export class DateUtils {

    public format(date: string, format: string): string {
        if (date) {
            const formatted = moment(date).format(format)
            return formatted
        } else {
            return ''
        }
    }

    public _format(date: string, format: string): string {
        if (date) {
            const formatted = moment(date, 'DD-MM-YYYY').format(format)
            return formatted
        } else {
            return ''
        }
    }

    public startOfDay(date: string) {
        const momentObj = moment(date).startOf('day')
        return momentObj.toDate()
    }

    public getTodaysDate() {
        return new Date()
    }

    public addDateByOne(date?: any) {
        const _date = date ? date : new Date()
        return moment(_date, 'dd/MM/yyyy').add(1, 'days')
    }

}
