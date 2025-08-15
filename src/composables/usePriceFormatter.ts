export function usePriceFormatter() {
    const formatPrice = (
        price: string | number,
        currency: string = '₽'
    ): string => {
        if (price === null || price === undefined || price === '') {
            return `0${currency}`;
        }

        // Убираем пробелы
        const clean = String(price).replace(/\s+/g, '');

        // Берём только цифры и игнорируем всё остальное
        const numberPart = clean.replace(/[^\d]/g, '');

        // Если число пустое
        if (!numberPart) {
            return `0${currency}`;
        }

        // Форматируем с пробелами между тысячами
        const formattedNumber = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return `${formattedNumber}${currency}`;
    };

    return { formatPrice };
}
