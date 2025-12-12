export interface Client {
    id: number;
    name: string;
    email: string;
    full_name?: string;
    profile?: ClientProfile;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface ClientProfile {
    id: number;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    birthday?: string;
}

