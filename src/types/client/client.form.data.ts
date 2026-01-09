import {Client} from './index'

export interface ClientFormData {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
    birthday?: string;
    level_id?: number;
}

export function createClientFormData(): ClientFormData {
    return {
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        birthday: '',
        level_id: undefined,
    }
}

export function clientToFormData(client: Client): ClientFormData {
    return {
        email: client.email || '',
        first_name: client.profile?.first_name || '',
        last_name: client.profile?.last_name || '',
        phone: client.profile?.phone || '',
        address: client.profile?.address || '',
        birthday: client.profile?.birthday || '',
        level_id: undefined,
    }
}