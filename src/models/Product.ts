export class Product {
    id: number | null;
    uuid: string | null;
    name: string | null;
    description: string | null;
    type: string | null;
    default_unit_id: string | null;
    unit_id: string | null;
    is_active: boolean | null;
    has_variants: boolean | null;
    allow_preorder: boolean | null;
    after_purchase_processing_time: string | null;
    sku: string | null;
    price: number | null;
    cost_price: number | null;
    stock_quantity: number | null;
    barcode: string | null;
    min_order_quantity: number | null;
    max_order_quantity: number | null;
    is_featured: boolean | null;
    is_new: boolean | null;
    discount_price: number | null;
    old_price: number | string;
    weight: string | null;
    length: string | null;
    width: string | null;
    height: string | null;
    images: any[] | null;
    categories: number[] | null;
    options: any[] | null;
    variants: Product[] | null;
    imageFiles: File[] | null;
    colors: any[] | null;

    constructor() {
        this.id = null;
        this.uuid = null;
        this.name = null;
        this.description = null;
        this.type = "simple";
        this.default_unit_id = "1";
        this.unit_id = "1";
        this.is_active = false;
        this.has_variants = false;
        this.allow_preorder = false;
        this.after_purchase_processing_time = "0";
        this.sku = null;
        this.price = 0;
        this.cost_price = 0;
        this.stock_quantity = 0;
        this.barcode = null;
        this.min_order_quantity = 1;
        this.max_order_quantity = 1;
        this.is_featured = false;
        this.is_new = true;
        this.discount_price = null;
        this.old_price = '';
        this.weight = "0";
        this.length = "0";
        this.width = "0";
        this.height = "0";
        this.images = [];
        this.categories = [1];
        this.options = null;
        this.variants = null;
        this.imageFiles = [];
        this.colors = [];
    }

    static fromJSON(json: any): Product {
        const product = new Product();
        product.id = json.id ?? null;
        product.name = json.name ?? null;
        product.description = json.description ?? null;
        product.type = json.type ?? "simple";
        product.default_unit_id = json.default_unit_id ?? "1";
        product.is_active = json.is_active ?? false;
        product.has_variants = json.has_variants ?? false;
        product.allow_preorder = json.allow_preorder ?? false;
        product.after_purchase_processing_time = json.after_purchase_processing_time ?? "0";
        product.sku = json.sku ?? null;
        product.price = json.price ?? 0;
        product.cost_price = json.cost_price ?? 0;
        product.stock_quantity = json.stock_quantity ?? 0;
        product.barcode = json.barcode ?? null;
        product.min_order_quantity = json.min_order_quantity ?? 1;
        product.max_order_quantity = json.max_order_quantity ?? 1;
        product.is_featured = json.is_featured ?? false;
        product.is_new = json.is_new ?? true;
        product.discount_price = json.discount_price ?? null;
        product.old_price = json.old_price ?? '';
        product.weight = json.weight ?? "";
        product.length = json.length ?? "";
        product.width = json.width ?? "";
        product.height = json.height ?? "";
        product.images = json.images ?? [];
        product.categories = json.categories ?? [1];
        product.options = json.options ?? null;
        product.variants = json.variants ?? [];
        // product.imageFiles = json.imageFiles ?? [];

        return product;
    }

    static fromJSONForVariantCreate(json: any): Product {
        const product = new Product();
        product.id = json.id ?? null;
        product.name = json.name ?? null;
        product.uuid = json.uuid ?? `variant_generated_${Math.round(Math.random() * 1000)}`;
        product.barcode = json.barcode ?? null;
        product.cost_price = json.cost_price ?? 0;
        product.price = json.price ?? 0;
        product.type = json.type ?? "simple";
        product.unit_id = json.unit_id ?? '1';
        product.is_active = json.is_active ?? false;
        product.colors = json.colors ?? [];

        // product.description = json.description ?? null;
        // product.default_unit_id = json.default_unit_id ?? "1";
        // product.has_variants = json.has_variants ?? false;
        // product.allow_preorder = json.allow_preorder ?? false;
        // product.after_purchase_processing_time = json.after_purchase_processing_time ?? "0";
        // product.sku = json.sku ?? null;
        // product.stock_quantity = json.stock_quantity ?? 0;
        // product.min_order_quantity = json.min_order_quantity ?? 1;
        // product.max_order_quantity = json.max_order_quantity ?? 1;
        // product.is_featured = json.is_featured ?? false;
        // product.is_new = json.is_new ?? true;
        // product.discount_price = json.discount_price ?? null;
        // product.old_price = json.old_price ?? '';
        // product.weight = json.weight ?? "";
        // product.length = json.length ?? "";
        // product.width = json.width ?? "";
        // product.height = json.height ?? "";
        // product.images = json.images ?? [];
        // product.categories = json.categories ?? [1];
        // product.options = json.options ?? null;
        // product.variants = json.variants ?? [];
        // product.imageFiles = json.imageFiles ?? [];

        return product;
    }


    deleteProductByUuidToVariants(uuid: string): void {
        if (!this.variants) return;
        this.variants = this.variants.filter(variant => variant.uuid !== uuid);
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
        };
    }

    toJSONForCreate(): Record<string, any> {
        return {
            name: this.name,
            price: this.price,
            description: this.description,
            is_active: this.is_active,
            barcode: this.barcode,
            is_new: this.is_new,
            discount_price: this.discount_price,
            weight: this.weight,
            length: this.length,
            width: this.width,
            height: this.height,

            variants: this.variants,
            has_variants: this.has_variants,
            default_unit_id: this.default_unit_id,

            // type: this.type,
            // allow_preorder: this.allow_preorder,
            // after_purchase_processing_time: this.after_purchase_processing_time,
            // sku: this.sku,
            // cost_price: this.cost_price,
            // stock_quantity: this.stock_quantity,
            // min_order_quantity: this.min_order_quantity,
            // images: this.images,
            // max_order_quantity: this.max_order_quantity,
            // categories: this.categories,
            // options: this.options,
            // is_featured: this.is_featured,
        };
    }


}
