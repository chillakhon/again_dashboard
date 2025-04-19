export class ReviewAttribute {
    id: number;
    review_id: number;
    name: string;
    rating: number;
    created_at: string;
    updated_at: string;

    constructor(data: any) {
        this.id = data.id;
        this.review_id = data.review_id;
        this.name = data.name;
        this.rating = data.rating;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}