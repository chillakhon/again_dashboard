class CreateRecipeProduct {
    product_id: number;
    variant_id: number | null;
    qty: number;
    is_default: boolean;

    constructor(data: any) {
        this.product_id = data?.product_id || data.component_id;
        this.variant_id = data.variant_id;
        this.qty = data.qty;
        this.is_default = !!data.is_default;
    }

    static fromJSON(json: string): CreateRecipeProduct {
        const data = JSON.parse(json);
        return new CreateRecipeProduct(data);
    }

    toJSON(): Record<string, any> {
        return {
            product_id: this.product_id,
            variant_id: this.variant_id,
            qty: this.qty,
            is_default: this.is_default,
        };
    }

}