import {Order} from "@/types/order";
import {Tag} from "@/types/tag";
import {Segment} from "@/features/segment/types";

export interface Profile {
    id: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    telegram_user_id?: string;
    telegram_chat_id?: string;
    image?: string;
}


export interface Client {
    id: number;
    name: string;
    email: string;
    full_name?: string;
    profile?: Profile;
    last_order?: Order
    tags?: Tag[];
    segments?: Segment[];
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}

