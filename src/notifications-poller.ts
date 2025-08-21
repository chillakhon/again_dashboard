import store from './store';

export async function startNotificationsPolling() {

    await store.dispatch('notifications/requestNotificationPermission');

    // Сразу проверяем обновления (без уведомлений, если разрешение ещё не дано)
    store.dispatch('notifications/checkForUpdates');

    // Основной polling каждые 60 секунд
    const interval = setInterval(() => {
        store.dispatch('notifications/checkForUpdates');
    }, 30 * 1000);

    // Очистка интервала при закрытии вкладки
    window.addEventListener('beforeunload', () => clearInterval(interval));
}
