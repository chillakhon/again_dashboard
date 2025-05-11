export class CreateRecipeComponent {
    component_type: 'ProductVariant' | 'Product' | 'Material';
    component_id: number;
    quantity: number;
    unit_id: number;

    constructor(data: any) {
        this.component_type = 'Material';
        this.component_id = data.component_id;
        this.quantity = data.quantity;
        this.unit_id = data.unit_id;
    }

    static fromJSON(json: string): CreateRecipeComponent {
        const data = JSON.parse(json);
        return new CreateRecipeComponent(data);
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