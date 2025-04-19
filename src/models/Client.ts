export class Client {
    id: number;
    user_id: number | null;
    client_level_id: number | null;
    bonus_balance: string;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    user: null; // Could be more specific if user structure is known

    constructor(data: any) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.client_level_id = data.client_level_id;
        this.bonus_balance = data.bonus_balance;
        this.created_at = data.created_at;
        this.deleted_at = data.deleted_at;
        this.updated_at = data.updated_at;
        this.user = data.user;
    }
}