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

    /**
     * Создает экземпляр UserProfile из JSON-данных
     * @param json - Входные данные в формате JSON
     * @returns Новый экземпляр UserProfile
     */
    public static fromJSON(json: any): UserProfile {
        return new UserProfile({
            id: json.id ?? null,
            user_id: json.user_id ?? null,
            first_name: json.first_name ?? null,
            last_name: json.last_name ?? null,
            phone: json.phone ?? null,
            address: json.address ?? null
        });
    }

    /**
     * Преобразует экземпляр UserProfile в JSON-объект
     * @returns Объект с данными профиля
     */
    public toJSON(): any {
        return {
            id: this.id,
            user_id: this.user_id,
            first_name: this.first_name,
            last_name: this.last_name,
            phone: this.phone,
            address: this.address
        };
    }

    /**
     * Полное имя пользователя (first_name + last_name)
     */
    get fullName(): string | null {
        if (this.first_name && this.last_name) {
            return `${this.first_name} ${this.last_name}`;
        }
        return this.first_name ?? this.last_name ?? null;
    }

    /**
     * Проверяет, есть ли основные данные профиля
     */
    get hasProfileData(): boolean {
        return !!this.first_name || !!this.last_name || !!this.phone || !!this.address;
    }
}