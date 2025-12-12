import axios from "axios";
import {toast} from "vue-sonner";
import {Client as ClientModel} from "@/models/client/Client";
import {Client as ClientType} from "@/types/client"; // Импортируем тип


import {ref} from "vue";
import {PaginationMeta} from "@/types/Types";

interface ClientFormData {
    id?: number;
    user_id?: number | null;
    client_level_id?: number | null;
    bonus_balance?: string;

    [key: string]: any;
}


interface ClientFilterParams {
    page: number;
    per_page: number;
    search?: string;
}


interface ClientResponse {
    clients: ClientType[];
    meta: PaginationMeta;
}

export function useClientFunctions() {

    const sending = ref(false)


    const getClients = async (page: number = 1, perPage: number = 10): Promise<{
        clients: ClientModel[],
        total: number
    } | null> => {
        try {
            const response = await axios.get(`/clients?page=${page}&per_page=${perPage}`);
            return {
                clients: response.data.data.map((item: any) => ClientModel.fromJSON(item)),
                total: response.data.total
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при загрузке списка");
            } else {
                toast.error("Ошибка сети");
                console.error("Error fetching clients:", error);
            }
            return null;
        }
    };

    const getClientsByParams = async (params: ClientFilterParams): Promise<ClientResponse> => {
        sending.value = true;
        return await axios.get(`/clients`, {
            params: params,
        })
            .then((res) => {
                return {
                    clients: res.data.clients?.data ?? [],
                    meta: {
                        total: res.data.clients?.total ?? 0,
                    },
                }
            })
            .catch(e => {
                throw e
            })
            .finally(() => sending.value = false)
    };


    const addClient = async (client: ClientFormData): Promise<void> => {
        try {
            const response = await axios.post('/clients', client);
            if (response.data.status) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Что-то пошло не так");
            } else {
                toast.error("Неизвестная ошибка");
                console.error("Error adding client:", error);
            }
        }
    };

    const updateClient = async (client: ClientModel): Promise<ClientModel | null> => {
        try {
            if (!client.id) {
                toast.error("ID клиента не указан");
                return null;
            }

            const response = await axios.put(`/clients/${client.id}`, prepareClientDataForValidation(client));

            toast.success(response.data.message || "Данные клиента обновлены");

            return response.data?.data || null; // Предполагаем, что данные в response.data.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при обновлении");
            } else {
                toast.error("Ошибка сети");
                console.error("Error updating client:", error);
            }
            return null;
        }
    };

    const deleteClient = async (clientId: number): Promise<void> => {
        try {
            const response = await axios.delete(`/clients/${clientId}`);
            toast.success(response.data.message || "Клиент успешно удален");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при удалении");
            } else {
                toast.error("Ошибка сети");
                console.error("Error deleting client:", error);
            }
        }
    };

    const getClient = async (clientId: number): Promise<ClientModel | null> => {
        try {
            const response = await axios.get(`/clients/${clientId}`);
            return ClientModel.fromJSON(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при загрузке");
            } else {
                toast.error("Ошибка сети");
                console.error("Error fetching client:", error);
            }
            return null;
        }
    };


    function prepareClientDataForValidation(client: ClientModel) {
        return {
            first_name: client.profile?.first_name ?? null,
            last_name: client.profile?.last_name ?? null,
            email: client.email ?? null,
            phone: client.profile?.phone ?? null,
            address: client.profile?.address ?? null,
            user_id: client?.id ?? null,
            birthday: client.profile?.birthday ?? null,
        };
    }


    return {
        addClient,
        updateClient,
        deleteClient,
        getClient,
        getClients,
        getClientsByParams,
        sending
    };
}