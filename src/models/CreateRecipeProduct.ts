export class CreateRecipeProduct {
    id: number | null;
    parent_product_id?: number | null;
    component_type: 'ProductVariant' | 'Product' | 'Material';
    component_id: number | null;
    component?: any;
    unit_id: number | null;
    variant_id: number | null;
    is_default: number | null;
    qty: number | null;
    variants?: CreateRecipeProduct[]; // Для группировки вариантов

    constructor(data: Partial<CreateRecipeProduct> & { component_type: string }) {
        this.id = data.id ?? null;
        this.parent_product_id = data.parent_product_id ?? null;
        this.component_type = this.extractComponentType(data.component_type);
        this.component_id = data.component_id ?? null;
        this.component = data.component ?? null;
        this.unit_id = data.unit_id ?? null;
        this.variant_id = data.variant_id ?? null;
        this.is_default = data.is_default ?? null;
        this.qty = data.qty ?? null;
        this.variants = data.variants ?? [];
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

    /**
     * Группирует продукты и их варианты (ProductVariant) по родительскому продукту.
     */
    static groupByParent(items: CreateRecipeProduct[]): CreateRecipeProduct[] {
        const grouped: CreateRecipeProduct[] = [];

        items.forEach(item => {
            if (item.component_type === 'Product') {
                const product = new CreateRecipeProduct(item);
                product.variants = [];
                grouped.push(product);
            }
        });

        items.forEach(item => {
            if (item.component_type === 'ProductVariant') {
                const parent = grouped.find(
                    p => p.component_type === 'Product' && p.component_id === item.parent_product_id
                );

                if (parent) {
                    parent.variant_id = item.component_id
                    parent.variants?.push(new CreateRecipeProduct(item));
                } else {
                    // Если родитель не найден, создаем временного родителя
                    const placeholderParent = new CreateRecipeProduct({
                        id: null,
                        parent_product_id: null,
                        component_type: 'Product',
                        component_id: item.parent_product_id,
                        component: { name: item.component?.parent_product_name ?? 'Unknown' },
                        unit_id: null,
                        qty: null,
                        is_default: null,
                        variant_id: null,
                        variants: [new CreateRecipeProduct(item)]
                    });
                    grouped.push(placeholderParent);
                }
            }
        });

        return grouped;
    }
}
