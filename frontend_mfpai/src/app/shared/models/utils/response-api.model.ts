import { ApiPaginator } from './meta-data.model';

export class ResponseApi {
    status?: string;
    //Òsuccess?: string;
    payload?: any;
    data?: any;
    message?: string;
    errors?: string;
    metadata?: ApiPaginator;
    url?: string;
}
