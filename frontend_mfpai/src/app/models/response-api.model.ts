import {ApiPaginator} from "./meta-data.model";

export class ResponseApiData {
    status!: string;
    payload?: any;
    message?: string;
    errors?: string;
    metadata?: ApiPaginator;
}


export class AuthResponseApi {
    status!: string
    payload?: any
    errors?: string
    metadata: any
    message?: string
    url?: string
}
