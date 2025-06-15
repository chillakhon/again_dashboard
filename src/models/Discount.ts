import {Product} from "@/models/Product";
import {ProductVariant} from "@/models/ProductVariant";

export class Discount {
    id: number;
    name: string;
    type: string;
    value: number;
    is_active: boolean;
    starts_at: string;
    ends_at: string | null;
    priority: number;
    conditions: Record<string, any> | null;
    discount_type: string;
    product_id: number | null;
    product_variant_id: number | null;
    created_at: string;
    updated_at: string;
    product: Product | null;
    products: Product[] | null;
    product_variant: ProductVariant | null;

    constructor(data: Partial<Discount> = {}) {
        this.id = this.validateNumber(data.id, 'id') ?? 0;
        this.name = this.validateString(data.name, 'name') ?? '';
        this.type = this.validateString(data.type, 'type') ?? '';
        this.value = this.validateNumber(data.value, 'value') ?? 0;
        this.is_active = data.is_active ?? false;
        this.starts_at = this.validateString(data.starts_at, 'starts_at') ?? new Date().toISOString();
        this.ends_at = this.validateNullableString(data.ends_at, 'ends_at') ?? new Date().toISOString();
        this.priority = this.validateNumber(data.priority, 'priority') ?? 0;
        this.conditions = this.validateConditions(data.conditions);
        this.discount_type = this.validateString(data.discount_type, 'discount_type') ?? '';
        this.product_id = this.validateNullableNumber(data.product_id, 'product_id');
        this.product_variant_id = this.validateNullableNumber(data.product_variant_id, 'product_variant_id');
        this.created_at = this.validateString(data.created_at, 'created_at') ?? '';
        this.updated_at = this.validateString(data.updated_at, 'updated_at') ?? '';
        this.product = data.product ? (data.product instanceof Product ? data.product : Product.fromJSON(data.product)) : null;
        this.products = null;
        this.product_variant = data.product_variant ? (data.product_variant instanceof ProductVariant ? data.product_variant : ProductVariant.fromJSON(data.product_variant)) : null;
    }

    private validateNumber(value: any, fieldName: string): number | undefined {
        if (value === undefined || value === null) return undefined;
        const num = Number(value);
        if (isNaN(num)) throw new Error(`Invalid number value for field ${fieldName}`);
        return num;
    }

    private validateNullableNumber(value: any, fieldName: string): number | null {
        if (value === undefined || value === null) return null;
        return this.validateNumber(value, fieldName) ?? null;
    }

    private validateString(value: any, fieldName: string): string | undefined {
        if (value === undefined || value === null) return undefined;
        if (typeof value !== 'string') throw new Error(`Invalid string value for field ${fieldName}`);
        return value;
    }

    private validateNullableString(value: any, fieldName: string): string | null {
        if (value === undefined || value === null) return null;
        return this.validateString(value, fieldName) ?? null;
    }

    private validateConditions(value: any): Record<string, any> | null {
        if (value === undefined || value === null) return null;

        try {
            if (typeof value === 'string') {
                return JSON.parse(value);
            }
            if (typeof value === 'object') {
                return value;
            }
            throw new Error('Invalid conditions format');
        } catch (error) {
            console.error('Failed to parse conditions:', error);
            return null;
        }
    }

    static fromJSON(json: any): Discount {
        try {
            return new Discount({
                id: json.id,
                name: json.name,
                type: json.type,
                value: json.value,
                is_active: json.is_active,
                starts_at: json.starts_at,
                ends_at: json.ends_at,
                priority: json.priority,
                conditions: json.conditions,
                discount_type: json.discount_type,
                product_id: json.product_id,
                product_variant_id: json.product_variant_id,
                created_at: json.created_at,
                updated_at: json.updated_at,
                product: json.product,
                product_variant: json.product_variant
            });
        } catch (error) {
            console.error('Failed to parse Discount from JSON:', error);
            throw new Error('Invalid Discount data');
        }
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            value: this.value,
            is_active: this.is_active,
            starts_at: this.starts_at,
            ends_at: this.ends_at,
            priority: this.priority,
            conditions: this.conditions,
            discount_type: this.discount_type,
            product_id: this.product_id,
            product_variant_id: this.product_variant_id,
            // created_at: this.created_at,
            // updated_at: this.updated_at,
            product: this.product?.toJSON?.() ?? null,
            products: this.products ? this.products.map((i: any) => i) : null,
            product_variant: this.product_variant?.toJSON?.() ?? null
        };
    }

    get isActive(): boolean {
        return this.is_active;
    }

    get isCurrentlyActive(): boolean {
        const now = new Date();
        const startDate = new Date(this.starts_at);
        const endDate = this.ends_at ? new Date(this.ends_at) : null;

        return this.is_active &&
            now >= startDate &&
            (endDate === null || now <= endDate);
    }

    get hasProduct(): boolean {
        return this.product_id !== null && this.product !== null;
    }

    get hasProductVariant(): boolean {
        return this.product_variant_id !== null && this.product_variant !== null;
    }

    get formattedValue(): string {
        if (this.type === 'percentage') {
            return `${this.value}%`;
        }
        return `${this.value.toFixed(2)}`;
    }
}