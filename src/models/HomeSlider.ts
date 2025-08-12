type ImagePaths = Record<'md' | 'lg' | 'original' | 'sm', string | undefined>;

export default class HomeSlider {
    id: number | undefined;
    title: string | null | undefined;
    subtitle: string | null | undefined;
    text: string | null | undefined;
    image_paths: ImagePaths | null | undefined;
    image_url: string | null | undefined;  // публичный URL
    image: File | string | null | undefined;        // файл для загрузки
    order: number | null | undefined;
    is_active: boolean | undefined;
    created_at: string | undefined;
    updated_at: string | undefined;

    constructor() {
        this.id = undefined;
        this.title = null;
        this.subtitle = null;
        this.text = null;
        this.image_paths = null;
        this.image_url = null;
        this.image = null;
        this.order = null;
        this.is_active = true;
        this.created_at = undefined;
        this.updated_at = undefined;
    }

    static fromJSON(json: any): HomeSlider {
        const slide = new HomeSlider();
        slide.id = json.id;
        slide.title = json.title ?? null;
        slide.subtitle = json.subtitle ?? null;
        slide.text = json.text ?? null;
        slide.image_paths = json.image_paths ?? null;

        // slide.image_url = json.image_paths ? this.getImageUrl(json.image_paths, 'original') : null;
        slide.image = null;
        // slide.image = null;
        slide.order = json.order ?? null;
        slide.is_active = json.is_active ?? true;
        slide.created_at = json.created_at;
        slide.updated_at = json.updated_at;
        return slide;
    }

    toFormDataForSave(): FormData {
        const formData = new FormData();

        // Добавляем текстовые поля
        if (this.title !== null) formData.append('title', String(this.title));
        if (this.subtitle !== null) formData.append('subtitle', String(this.subtitle));
        if (this.text !== null) formData.append('text', String(this.text));
        if (this.order !== null) formData.append('order', String(this.order));
        if (this.is_active !== undefined) formData.append('is_active', this.is_active ? '1' : '0');

        // Особый случай для файла
        if (this.image instanceof File) {
            formData.append('image', this.image, this.image.name);
        } else if (this.image) {
            // Если это не File объект, но что-то есть (например, строка с путем)
            formData.append('image', new Blob(), 'image.jpg'); // или другой обработчик
        }

        return formData;
    }


    imageURL(imageSize: 'md' | 'lg' | 'original' | 'sm'): string | undefined {
        if (this.image_paths && this.image_paths[imageSize]) {
            const path = encodeURIComponent(this.image_paths[imageSize]);
            return `${process.env.VUE_APP_BASE_URL}/slides/getImage?path=${path}`;
        }
        return undefined;
    }

    static getImageUrl(
        image_paths: ImagePaths | undefined,
        imageSize: 'md' | 'lg' | 'original' | 'sm'
    ): string | undefined {
        if (image_paths && imageSize) {
            const path = encodeURIComponent(image_paths[imageSize] as string);
            return `${process.env.VUE_APP_BASE_URL}/slides/getImage?path=${path}`;
        }
        return undefined;
    }


}
