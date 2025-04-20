export class ProductVariant {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price: string;
    stock: number;
    additional_cost: string;
    type: string;
    unit_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    pivot?: {
        recipe_id: number;
        product_variant_id: number;
        is_default: number;
        created_at: string;
        updated_at: string;
    };

    constructor(data: any) {
        this.id = data.id;
        this.product_id = data.product_id;
        this.name = data.name;
        this.sku = data.sku;
        this.price = data.price;
        this.stock = data.stock;
        this.additional_cost = data.additional_cost;
        this.type = data.type;
        this.unit_id = data.unit_id;
        this.is_active = data.is_active;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.deleted_at = data.deleted_at;
        this.pivot = data.pivot;
    }

    static fromJSON(json: string): ProductVariant {
        const data = JSON.parse(json);
        return new ProductVariant(data);
    }
}