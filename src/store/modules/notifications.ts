// store/modules/notifications.ts
import {Module} from "vuex";
import axios from "axios";
import {useLocalTime} from "@/composables/useLocalTime";

export interface NotificationsState {
    counts: {
        orders: number;
        tasks: number;
        reviews: number;
        orders_new_since: number;
    };
    lastCheckOrders: string | null;
    lastCheckTasks: string | null;
    lastCheckReviews: string | null;
    hasUpdates: boolean;
    isFirstCheck: boolean; // Добавляем флаг для первой проверки
}

const storageKeys = {
    orders: "notifications.lastCheck.orders",
    tasks: "notifications.lastCheck.tasks",
    reviews: "notifications.lastCheck.reviews",
    counts: "notifications.counts",
    isFirstCheck: "notifications.isFirstCheck" // Ключ для отслеживания первой проверки
};

const { nowIso } = useLocalTime();

const parseCountsFromStorage = (): { orders: number; tasks: number; reviews: number; orders_new_since: number } => {
    try {
        const raw = localStorage.getItem(storageKeys.counts);
        if (!raw) return {orders: 0, tasks: 0, reviews: 0, orders_new_since: 0};
        const parsed = JSON.parse(raw);
        return {
            orders: parsed.orders || 0,
            tasks: parsed.tasks || 0,
            reviews: parsed.reviews || 0,
            orders_new_since: parsed.orders_new_since || 0,
        };
    } catch {
        return {orders: 0, tasks: 0, reviews: 0, orders_new_since: 0};
    }
};

// Утилита: вернуть timestamp из localStorage или записать текущий и вернуть его
const getOrInitTimestamp = (key: string) => {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const now = nowIso();
    localStorage.setItem(key, now);
    return now;
};

// Функция для запроса разрешения на уведомления
const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
        console.warn("Браузер не поддерживает уведомления");
        return "denied";
    }

    if (Notification.permission === "default") {
        return await Notification.requestPermission();
    }

    return Notification.permission;
};

// Функция для отправки уведомления
const sendBrowserNotification = (title: string, body: string, icon?: string) => {
    console.log(54564654)

    if (Notification.permission === "granted") {
        console.log(46456466466789879879)
        const notification = new Notification(title, {
            body,
            icon: icon || '/favicon.ico',
            badge: '/favicon.ico',
            requireInteraction: false,
            silent: false
        });

        // Автоматически закрыть уведомление через 5 секунд
        setTimeout(() => notification.close(), 5000);

        // Обработка клика по уведомлению
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
};

const notifications: Module<NotificationsState, any> = {
    namespaced: true,
    state: {
        counts: parseCountsFromStorage(),
        // Если в localStorage нет — инициализируем текущим временем и сохраняем туда.
        lastCheckOrders: getOrInitTimestamp(storageKeys.orders),
        lastCheckTasks: getOrInitTimestamp(storageKeys.tasks),
        lastCheckReviews: getOrInitTimestamp(storageKeys.reviews),
        hasUpdates: false,
        isFirstCheck: localStorage.getItem(storageKeys.isFirstCheck) !== "false", // true по умолчанию, false если уже был запуск
    },
    mutations: {
        SET_COUNTS(state, payload: { orders: number; tasks: number; reviews: number, orders_new_since: number }) {
            state.counts.orders = payload.orders;
            state.counts.tasks = payload.tasks;
            state.counts.reviews = payload.reviews;
            state.counts.orders_new_since = payload.orders_new_since;
            localStorage.setItem(storageKeys.counts, JSON.stringify(state.counts));
        },
        SET_LAST_CHECK_ORDERS(state, date: string | null) {
            state.lastCheckOrders = date;
            if (date === null) localStorage.removeItem(storageKeys.orders);
            else localStorage.setItem(storageKeys.orders, date);
        },
        SET_LAST_CHECK_TASKS(state, date: string | null) {
            state.lastCheckTasks = date;
            if (date === null) localStorage.removeItem(storageKeys.tasks);
            else localStorage.setItem(storageKeys.tasks, date);
        },
        SET_LAST_CHECK_REVIEWS(state, date: string | null) {
            state.lastCheckReviews = date;
            if (date === null) localStorage.removeItem(storageKeys.reviews);
            else localStorage.setItem(storageKeys.reviews, date);
        },
        SET_HAS_UPDATES(state, has: boolean) {
            state.hasUpdates = has;
        },
        SET_FIRST_CHECK(state, isFirst: boolean) {
            state.isFirstCheck = isFirst;
            localStorage.setItem(storageKeys.isFirstCheck, String(isFirst));
        },
        RESET(state) {
            // Полный сброс: обнуляем counts и удаляем lastCheck'и — после следующей инициализации они снова будут установлены в now
            state.counts = {orders: 0, tasks: 0, reviews: 0, orders_new_since: 0};
            state.lastCheckOrders = null;
            state.lastCheckTasks = null;
            state.lastCheckReviews = null;
            state.hasUpdates = false;
            state.isFirstCheck = true;
            localStorage.removeItem(storageKeys.counts);
            localStorage.removeItem(storageKeys.orders);
            localStorage.removeItem(storageKeys.tasks);
            localStorage.removeItem(storageKeys.reviews);
            localStorage.removeItem(storageKeys.isFirstCheck);
        },
    },
    actions: {
        async initNotifications({commit}) {
            // Запрашиваем разрешение на уведомления при инициализации
            await requestNotificationPermission();
        },

        async checkForUpdates({state, commit}) {
            try {
                // Сохраняем предыдущие значения для сравнения
                const prevCounts = { ...state.counts };

                // Отправляем все три параметра (они теперь инициализированы при старте)
                const res = await axios.get("/notifications/counter", {
                    params: {
                        last_updated_orders: state.lastCheckOrders,
                        last_updated_tasks: state.lastCheckTasks,
                        last_updated_reviews: state.lastCheckReviews,
                    },
                });

                if (res.data && res.data.status) {
                    const {orders = 0, tasks = 0, reviews = 0, orders_new_since = 0} = res.data.data || {};

                    // Обновляем counts
                    commit("SET_COUNTS", {orders, tasks, reviews, orders_new_since});
                    commit("SET_HAS_UPDATES", (orders + tasks + reviews + orders_new_since) > 0);

                    // Проверяем, нужно ли отправлять уведомления (только если это не первая проверка)
                    if (!state.isFirstCheck) {
                        // Проверяем увеличение заказов
                        if (orders > prevCounts.orders) {
                            const diff = orders - prevCounts.orders;
                            sendBrowserNotification(
                                "Новые заказы",
                                `У вас ${diff} ${diff === 1 ? 'новый заказ' : 'новых заказов'}`,
                                '/icons/order-icon.png'
                            );
                        }

                        // Проверяем увеличение задач
                        if (tasks > prevCounts.tasks) {
                            const diff = tasks - prevCounts.tasks;
                            sendBrowserNotification(
                                "Новые задачи",
                                `У вас ${diff} ${diff === 1 ? 'новая задача' : 'новых задач'}`,
                                '/icons/task-icon.png'
                            );
                        }

                        // Проверяем увеличение отзывов
                        if (reviews > prevCounts.reviews) {
                            const diff = reviews - prevCounts.reviews;
                            sendBrowserNotification(
                                "Новые отзывы",
                                `У вас ${diff} ${diff === 1 ? 'новый отзыв' : 'новых отзывов'}`,
                                '/icons/review-icon.png'
                            );
                        }

                        // Проверяем увеличение orders_new_since
                        if (orders_new_since > prevCounts.orders_new_since) {
                            const diff = orders_new_since - prevCounts.orders_new_since;
                            sendBrowserNotification(
                                "Обновления заказов",
                                `${diff} ${diff === 1 ? 'заказ обновился' : 'заказов обновились'}`,
                                '/icons/update-icon.png'
                            );
                        }
                    } else {
                        // Помечаем, что первая проверка завершена
                        commit("SET_FIRST_CHECK", false);
                    }
                }
            } catch (e) {
                console.error("Ошибка проверки уведомлений:", e);
            }
        },

        markOrdersChecked({commit, state}) {
            const now = nowIso();
            commit("SET_LAST_CHECK_ORDERS", now);

            const newOrders = 0;
            const newTasks = state.counts.tasks;
            const newReviews = state.counts.reviews;
            const orders_new_since = state.counts.orders_new_since;
            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews, orders_new_since: orders_new_since});
            commit("SET_HAS_UPDATES", (newTasks + newReviews) > 0);
        },

        markTasksChecked({commit, state}) {
            const now = nowIso();
            commit("SET_LAST_CHECK_TASKS", now);

            const newTasks = 0;
            const newOrders = state.counts.orders;
            const newReviews = state.counts.reviews;
            const orders_new_since = state.counts.orders_new_since;

            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews, orders_new_since: orders_new_since});
            commit("SET_HAS_UPDATES", (newOrders + newReviews) > 0);
        },

        markReviewsChecked({commit, state}) {
            const now = nowIso();
            commit("SET_LAST_CHECK_REVIEWS", now);

            const newReviews = 0;
            const newOrders = state.counts.orders;
            const newTasks = state.counts.tasks;
            const orders_new_since = state.counts.orders_new_since;
            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews, orders_new_since: orders_new_since});
            commit("SET_HAS_UPDATES", (newOrders + newTasks) > 0);
        },

        async requestNotificationPermission({}) {
            return await requestNotificationPermission();
        },

        sendTestNotification({}) {
            sendBrowserNotification(
                "Тестовое уведомление",
                "Уведомления настроены и работают корректно!",
                '/favicon.ico'
            );
        },

        reset({commit}) {
            commit("RESET");
        },
    },
};

export default notifications;