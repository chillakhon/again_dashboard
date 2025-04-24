import { CreateRecipeComponent } from "./CreateRecipeComponent";
import { CreateRecipeCostRate } from "./CreateRecipeCostRate";

export class EditRecipe {
    id: number;
    name: string;
    description: string | null;
    instructions: string | null;
    is_active: boolean;
    output_unit_id: number;
    output_quantity: number | null;
    production_time: number;
    items: CreateRecipeComponent[];
    products: CreateRecipeProduct[];
    cost_rates: CreateRecipeCostRate[];
    created_at: string;
    updated_at: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.instructions = data.instructions;
        this.is_active = data.is_active;
        this.output_unit_id = data.output_unit_id;
        this.output_quantity = data.output_quantity !== undefined
            ? parseFloat(data.output_quantity)
            : null;
        this.production_time = data.production_time;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        // Components
        this.items = (data.items || []).map((i: any) => {
            const type = typeof i.component_type === 'string'
                ? i.component_type.split('\\').pop()!
                : undefined;
            return new CreateRecipeComponent({
                component_type: type,
                component_id: i.component_id,
                quantity: parseFloat(i.quantity),
                unit_id: i.unit_id,
                waste_percentage: i.waste_percentage,
                notes: i.notes,
            });
        });

        // Output products
        const rawProducts = data.products ?? data.output_products ?? [];
        this.products = rawProducts.map((p: any) => {
            const type = typeof p.component_type === 'string'
                ? p.component_type.split('\\').pop()!
                : undefined;
            const variantId = p.product_variant_id ??
                (type === 'ProductVariant' ? p.component_id : null);
            const productId = p.product_id ??
                (type === 'Product' ? p.component_id : null);
            return new CreateRecipeProduct({
                product_id: productId,
                variant_id: variantId,
                qty: parseFloat(p.qty),
                is_default: !!p.is_default,
            });
        });

        // Cost rates
        this.cost_rates = (data.cost_rates || []).map((r: any) =>
            new CreateRecipeCostRate(r)
        );
    }

    static fromJSON(json: string): EditRecipe {
        const data = JSON.parse(json);
        return new EditRecipe(data);
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            instructions: this.instructions,
            is_active: this.is_active,
            output_unit_id: this.output_unit_id,
            output_quantity: this.output_quantity,
            production_time: this.production_time,
            items: this.items.map(i => i.toJSON()),
            products: this.products.map(p => p.toJSON()),
            cost_rates: this.cost_rates.map(r => r.toJSON()),
        };
    }
}
