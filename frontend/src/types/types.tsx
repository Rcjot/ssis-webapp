export interface QueryParams {
    search: string;
    sortBy: string;
    direction: "ASC" | "DESC";
    pageNumber: number;
    limit: number;
}
