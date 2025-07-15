export function useDateFormat() {
    /**
     * Форматирует дату в российский формат
     * @param {string|Date} date - Дата в формате строки или объект Date
     * @param {boolean} [withTime=false] - Показывать время
     * @returns {string} Отформатированная дата в русском формате
     */
    const formatDateToRussian = (date: string | Date, withTime: boolean = false): string => {
        if (!date) return 'дата не указана';

        let dateObj: Date;

        if (typeof date === 'string') {
            // Проверяем если формат DD.MM.YYYY HH:mm
            const regex = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/;
            const match = date.match(regex);
            if (match) {
                const [_, day, month, year, hour, minute] = match;
                dateObj = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                    parseInt(hour),
                    parseInt(minute)
                );
            } else {
                // Пробуем создать как ISO или обычную строку даты
                dateObj = new Date(date);
            }
        } else {
            dateObj = date;
        }

        if (isNaN(dateObj.getTime())) return 'неверная дата';

        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(withTime && {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        let formatted = dateObj.toLocaleDateString('ru-RU', options);

        formatted = formatted.replace(/(\s)([А-Яа-я]+)(\s|$)/, (_, p1, p2, p3) => {
            return p1 + p2.toLowerCase() + p3;
        });

        if (!withTime) {
            formatted = formatted.replace(/(\d{4})/, '$1 ');
        }

        return formatted;
    }

    return {
        formatDateToRussian
    }
}
