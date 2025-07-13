import axios from "axios";
import {toast} from "vue-sonner";
import {Client} from "@/models/Client";

interface ClientFormData {
    id?: number;
    user_id?: number | null;
    client_level_id?: number | null;
    bonus_balance?: string;

    [key: string]: any;
}

export function useClientFunctions() {
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

    const updateClient = async (client: Client): Promise<Client | null> => {
        try {
            if (!client.id) {
                toast.error("ID клиента не указан");
                return null;
            }

            console.log('data',prepareClientDataForValidation(client))
            // return null
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

    const getClient = async (clientId: number): Promise<Client | null> => {
        try {
            const response = await axios.get(`/clients/${clientId}`);
            return Client.fromJSON(response.data.data);
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

    const getClients = async (page: number = 1, perPage: number = 10): Promise<{
        clients: Client[],
        total: number
    } | null> => {
        try {
            const response = await axios.get(`/clients?page=${page}&per_page=${perPage}`);
            return {
                clients: response.data.data.map((item: any) => Client.fromJSON(item)),
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





    function prepareClientDataForValidation(client: Client) {
        return {
            first_name: client.profile?.first_name ?? null,
            last_name: client.profile?.last_name ?? null,
            email: client.email ?? null,
            phone: client.profile?.phone ?? null,
            address: client.profile?.address ?? null,
            user_id: client?.id ?? null
        };
    }


    return {
        addClient,
        updateClient,
        deleteClient,
        getClient,
        getClients
    };
}