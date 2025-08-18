import store from './store'

export function startNotificationsPolling() {
    // Проверка сразу при старте
    store.dispatch('notifications/checkForUpdates')

    // Запуск интервала каждые 60 секунд
    const interval = setInterval(() => {
        store.dispatch('notifications/checkForUpdates')
    }, 60 * 1000)

    // Очистка при закрытии вкладки
    window.addEventListener('beforeunload', () => clearInterval(interval))
}
