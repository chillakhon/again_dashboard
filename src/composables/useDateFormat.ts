
export function useDateFormat() {
    /**
     * Форматирует дату в российский формат
     * @param {string|Date} date - Дата в формате строки или объект Date
     * @param {boolean} [withTime=false] - Показывать время
     * @returns {string} Отформатированная дата в русском формате
     */
    const formatDateToRussian = (date: string | Date, withTime: boolean = false): string => {
        if (!date) return 'дата не указана'

        const dateObj = typeof date === 'string' ? new Date(date) : date

        if (isNaN(dateObj.getTime())) return 'неверная дата'

        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(withTime && {
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        let formatted = dateObj.toLocaleDateString('ru-RU', options)

        formatted = formatted.replace(/(\s)([А-Яа-я]+)(\s|$)/, (_, p1, p2, p3) => {
            return p1 + p2.toLowerCase() + p3
        })

        if (!withTime) {
            formatted = formatted.replace(/(\d{4})/, '$1 г.')
        }

        return formatted
    }

    return {
        formatDateToRussian
    }
}