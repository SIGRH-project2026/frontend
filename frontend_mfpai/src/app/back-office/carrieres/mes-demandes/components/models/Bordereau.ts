import { UserDTOs } from "src/app/models/UserDTOs";

export class Bordereau{
    id!: number;
    idActe!:number;
    agent!:UserDTOs;
    fileName!:string;
}