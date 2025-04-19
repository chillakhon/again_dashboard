import Product from "@/models/Product";
import {ReviewAttribute} from "@/models/ReviewAttribute";
import {Client} from "@/models/Client";

export class Review {
    id: number;
    client_id: number;
    reviewable_type: string;
    reviewable_id: number;
    attributes: ReviewAttribute[];
    client: Client;
    client_email: string | null;
    client_name: string | null;
    content: string;
    created_at: string;
    deleted_at: string | null;
    images: any[]; // Could be more specific if image structure is known
    is_published: boolean;
    is_spam: number;
    is_verified: boolean;
    published_at: string | null;
    rating: number;
    responses: any[]; // Could be more specific if response structure is known
    reviewable: Product;
    status: string;
    updated_at: string;

    constructor(data: any) {
        this.id = data.id;
        this.client_id = data.client_id;
        this.reviewable_type = data.reviewable_type;
        this.reviewable_id = data.reviewable_id;
        this.attributes = data.attributes?.map((attr: any) => new ReviewAttribute(attr)) || [];
        this.client = new Client(data.client);
        this.client_email = data.client_email;
        this.client_name = data.client_name;
        this.content = data.content;
        this.created_at = data.created_at;
        this.deleted_at = data.deleted_at;
        this.images = data.images || [];
        this.is_published = data.is_published;
        this.is_spam = data.is_spam;
        this.is_verified = data.is_verified;
        this.published_at = data.published_at;
        this.rating = data.rating;
        this.responses = data.responses || [];
        this.reviewable = new Product(data.reviewable);
        this.status = data.status;
        this.updated_at = data.updated_at;
    }
}