export class CreateRecipeProduct {
    component_type: 'ProductVariant' | 'Product' | 'Material';
    component_id: number;
    unit_id: number;
    variant_id: number;
    is_default: number;
    qty: number;

    constructor(data: any) {
        this.component_type = this.extractComponentType(data.component_type);
        this.component_id = data.component_id;
        this.unit_id = data.unit_id;
        this.variant_id = data.variant_id ?? null;
        this.is_default = data.is_default ?? null;
        this.qty = data.qty ?? null;
    }

    static fromJSON(json: string): CreateRecipeProduct {
        const data = JSON.parse(json);
        return new CreateRecipeProduct(data);
    }

    toJSON(): Record<string, any> {
        return {
            component_type: this.component_type,
            component_id: this.component_id,
            qty: this.qty,
            is_default: this.is_default,
        };
    }


    private extractComponentType(type: string): 'ProductVariant' | 'Product' | 'Material' {
        const parts = type.split('\\');
        return parts[parts.length - 1] as 'ProductVariant' | 'Product' | 'Material';
    }

}