import { Paginator } from "./Paginator";

export class ResponseApi2 {
    status?: string;
    payload?: any;
    message?: string;
    errors?: string;
    metadata?: Paginator;
    url?: string;
    collectionSize ?: number = 0
    allData ?: any
}