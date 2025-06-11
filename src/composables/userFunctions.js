import axios from "axios";
import {toast} from "vue-sonner";

export function useUserFunctions() {

    const addUser = async (user) => {
        await axios
            .post(`/users`, user)
            .then((res) => {
                if (res.data.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((e) => {
                if (e.response) {
                    toast.error("Что то пошло не так");
                }
            });
    };


    const updateUser = async (user) => {
        if (!user) return
        try {
            const userData = {
                first_name: user.profile?.first_name || '',
                last_name: user.profile?.last_name || '',
                phone: user.profile?.phone?.trim() || null,
                address: user.profile?.address || null,
                email: user.email,
                roles: user.roles?.map(role => role.id) || [],
                permissions: user.permissions?.map(perm => perm.id) || [],
            };

            const res = await axios.put(`/users/${user.id}`, userData);

            if (res.data.user) {
                toast.success(res.data.message || "Пользователь успешно обновлён");
                return res.data.user
            } else {
                toast.error(res.data.message || "Не удалось обновить пользователя");
            }
        } catch (e) {
            if (e.response) {
                toast.error(e.response.data.error || e.response.data.message || "Произошла ошибка при обновлении");
            } else {
                toast.error("Ошибка сети");
            }
            console.error("Error updating user:", e);
        }
    };



    const changeUser = async (user, loader) => {

        try {
            loader = true;
            if (user.changePass) {
                // Обработка смены пароля
                if (user.password !== user.confirm_password) {
                    toast.error("Пароли не совпадают!");
                    return;
                }

                await axios.put(`/users/${user.id}/update-password`, {
                    old_password: user.old_password,
                    password: user.password,
                    password_confirmation: user.confirm_password,
                });
                toast.success("Пароль успешно изменен");
            } else {
                // Подготовка данных для обновления пользователя
                const userData = {
                    first_name: user.profile?.first_name || '',
                    last_name: user.profile?.last_name || '',
                    phone: user.profile?.phone || null,
                    email: user.email,
                    roles: user.roles?.map((role) => role.id) || [],
                    permissions: user.permissions?.map((perm) => perm.id) || [],
                };


                await axios.put(`/users/${user.id}`, userData);
                toast.success("Данные пользователя обновлены");
            }
        } catch (e) {
            if (e.response) {
                toast.error(e.response.data.error || e.response.data.message || "Произошла ошибка");
            } else {
                toast.error("Ошибка сети");
            }
            console.error("Error updating user:", e);
        } finally {
            loader = false;
        }
    };

    const deleteUser = async (user_id) => {
        console.log(user_id);
        axios
            .delete(`/users/${user_id}`)
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(err => {
                toast.error(err.data.message);
            })
    };
    const forceDestroy = async (user_id) => {
        console.log(user_id);
        axios
            .delete(`/users/${user_id}/forceDestroy`)
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(err => {
                toast.error(err.data.message);
            })
    };

    const restoreUser = async (user_id) => {
        axios
            .get(`users/${user_id}/restore`)
            .then(res => {
                toast.success(res.data.message);
                // if (res.data.status) {
                //     toast.success(res.data.message);
                // } else {
                //     toast.error(res.data.message);
                // }
            })
            .catch(err => {
                toast.error(err.data.response.data.message);
            })
    };

    return {
        addUser,
        changeUser,
        deleteUser,
        restoreUser,
        forceDestroy,
        updateUser
    };
}
