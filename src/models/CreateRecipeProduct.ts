export class CreateRecipeProduct {
    component_type: 'ProductVariant' | 'Product' | 'Material';
    component_id: number;
    quantity: number;
    unit_id: number;
    variant_id: number;
    qty: number;

    constructor(data: any) {
        this.component_type = data.component_type;
        this.component_id = data.component_id;
        this.quantity = data.quantity;
        this.unit_id = data.unit_id;
        this.variant_id = data.variant_id ?? null;
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
            quantity: this.quantity,
            unit_id: this.unit_id,
        };
    }

}