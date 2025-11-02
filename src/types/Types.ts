export interface Color {
    id: string;
    name: string;
}

export interface Pagination {
    page: number;
    per_page: number;
    total: number;
}

export interface ShowTotalType {
    title: string;
    total: number;
    original_total: number;
}