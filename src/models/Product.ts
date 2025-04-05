class Product {
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
    options: any[] | null = null
    variants: any[] | null = null
    imageFiles: File[] | null = []

    get discountPercentage(): number {
        if (!this.discount_price || this.discount_price <= 0 || !this.price || this.price <= 0) {
            return 0;
        }
        const discount = ((this.price - this.discount_price) / this.price) * 100;
        return Math.round(discount); // округлим до целого числа
    }

    set changeDiscount(value: number  ) {
        this.discount_price = value
    }

    constructor(init?: Partial<Product>) {
        Object.assign(this, init);
    }
}

export default Product;
