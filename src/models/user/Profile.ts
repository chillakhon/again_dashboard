// UserProfile.ts
export class UserProfile {
    public id: number | null;
    public user_id: number | null;
    public first_name: string | null;
    public last_name: string | null;
    public phone: string | null;
    public address: string | null;

    constructor(data: Partial<UserProfile> = {}) {
        this.id = data.id ?? null;
        this.user_id = data.user_id ?? null;
        this.first_name = data.first_name ?? null;
        this.last_name = data.last_name ?? null;
        this.phone = data.phone ?? null;
        this.address = data.address ?? null;
    }
}




