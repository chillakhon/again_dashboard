// store/modules/notifications.ts
import {Module} from "vuex";
import axios from "axios";

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
}

const storageKeys = {
    orders: "notifications.lastCheck.orders",
    tasks: "notifications.lastCheck.tasks",
    reviews: "notifications.lastCheck.reviews",
    counts: "notifications.counts"
};

const nowIso = () => new Date().toISOString();

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

const notifications: Module<NotificationsState, any> = {
    namespaced: true,
    state: {
        counts: parseCountsFromStorage(),
        // Если в localStorage нет — инициализируем текущим временем и сохраняем туда.
        lastCheckOrders: getOrInitTimestamp(storageKeys.orders),
        lastCheckTasks: getOrInitTimestamp(storageKeys.tasks),
        lastCheckReviews: getOrInitTimestamp(storageKeys.reviews),
        hasUpdates: false,
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
        RESET(state) {
            // Полный сброс: обнуляем counts и удаляем lastCheck'и — после следующей инициализации они снова будут установлены в now
            state.counts = {orders: 0, tasks: 0, reviews: 0, orders_new_since: 0};
            state.lastCheckOrders = null;
            state.lastCheckTasks = null;
            state.lastCheckReviews = null;
            state.hasUpdates = false;
            localStorage.removeItem(storageKeys.counts);
            localStorage.removeItem(storageKeys.orders);
            localStorage.removeItem(storageKeys.tasks);
            localStorage.removeItem(storageKeys.reviews);
        },
    },
    actions: {
        async checkForUpdates({state, commit}) {
            try {
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
                    commit("SET_COUNTS", {orders, tasks, reviews, orders_new_since});
                    commit("SET_HAS_UPDATES", (orders + tasks + reviews + orders_new_since) > 0);
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
            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews});
            commit("SET_HAS_UPDATES", (newTasks + newReviews) > 0);
        },

        markTasksChecked({commit, state}) {
            const now = nowIso();
            commit("SET_LAST_CHECK_TASKS", now);

            const newTasks = 0;
            const newOrders = state.counts.orders;
            const newReviews = state.counts.reviews;
            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews});
            commit("SET_HAS_UPDATES", (newOrders + newReviews) > 0);
        },

        markReviewsChecked({commit, state}) {
            const now = nowIso();
            commit("SET_LAST_CHECK_REVIEWS", now);

            const newReviews = 0;
            const newOrders = state.counts.orders;
            const newTasks = state.counts.tasks;
            commit("SET_COUNTS", {orders: newOrders, tasks: newTasks, reviews: newReviews});
            commit("SET_HAS_UPDATES", (newOrders + newTasks) > 0);
        },

        reset({commit}) {
            commit("RESET");
        },
    },
};

export default notifications;
