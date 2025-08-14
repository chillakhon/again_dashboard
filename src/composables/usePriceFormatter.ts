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

        // Отделяем цифры и всё остальное
        const match = clean.match(/^(\d+)(.*)$/);
        if (!match) return `0${currency}`;

        let numberPart = match[1];
        let detectedCurrency = match[2]?.trim() || currency;

        // Если число пустое (например, передали только валюту)
        if (!numberPart) {
            return `0${detectedCurrency}`;
        }

        // Форматируем с пробелами между тысячами
        const formattedNumber = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return `${formattedNumber}${detectedCurrency}`;
    };

    return { formatPrice };
}
