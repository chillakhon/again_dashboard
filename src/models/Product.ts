export default class Product {
    name: string | null = null;
    description: string | null = null;
    type: string | null = "simple";
    default_unit_id: string | null = "1";
    is_active: boolean | null = false;
    has_variants: boolean | null = false;
    allow_preorder: boolean | null = false;
    after_purchase_processing_time: string | null = "0";
    sku: string | null = null;
    price: number | null = 0;
    cost_price: number | null = 0;
    stock_quantity: number | null = 0;
    barcode: string | null = null;
    min_order_quantity: number | null = 1;
    max_order_quantity: number | null = 1;
    is_featured: boolean | null = false;
    is_new: boolean | null = true;
    discount_price: number | null = null;
    weight: string | null = '0';
    length: string | null = '0';
    width: string | null = '0';
    height: string | null = '0';
    images: any[] | null = [];
    categories: number[] | null = [1];
    options: any[] | null = null;
    variants: any[] | null = null;
    imageFiles: File[] | null = [];


    get discountPercentage(): number {
        if (!this.discount_price || this.discount_price <= 0 || !this.price || this.price <= 0) {
            return 0;
        }
        const discount = ((this.price - this.discount_price) / this.price) * 100;
        return Math.round(discount);
    }

    set changeDiscount(value: number) {
        this.discount_price = value;
    }

    constructor(init?: Partial<Product>) {
        Object.assign(this, init);
    }

    static fromJSON(json: any): Product {
        return new Product({
            ...json,
            images: json.images ?? [],
            categories: json.categories ?? [1],
            options: json.options ?? null,
            variants: json.variants ?? null,
            imageFiles: json.imageFiles ?? []
        });
    }


    toJSON(): Record<string, any> {
        return {
            name: this.name,
            description: this.description,
            type: this.type,
            default_unit_id: this.default_unit_id,
            is_active: this.is_active,
            has_variants: this.has_variants,
            allow_preorder: this.allow_preorder,
            after_purchase_processing_time: this.after_purchase_processing_time,
            sku: this.sku,
            price: this.price,
            cost_price: this.cost_price,
            stock_quantity: this.stock_quantity,
            barcode: this.barcode,
            min_order_quantity: this.min_order_quantity,
            max_order_quantity: this.max_order_quantity,
            is_featured: this.is_featured,
            is_new: this.is_new,
            discount_price: this.discount_price,
            weight: this.weight,
            length: this.length,
            width: this.width,
            height: this.height,
            images: this.images,
            categories: this.categories,
            options: this.options,
            variants: this.variants,
            // Note: File objects are not included as they can't be serialized to JSON
        };
    }

}

