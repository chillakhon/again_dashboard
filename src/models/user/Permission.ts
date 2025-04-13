export class UserPermission {
    public id: number | null;
    public name: string | null;
    public slug: string | null;
    public description: string | null;

    constructor(data: Partial<UserPermission> = {}) {
        this.id = data.id ?? null;
        this.name = data.name ?? null;
        this.slug = data.slug ?? null;
        this.description = data.description ?? null;
    }
}