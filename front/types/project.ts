import { User } from "./user";
 
export type Project = {
    id: number;
    title: string;
    description: string;
    technoUsed: string[];
    image: string;
    date: string;
    author: User;
};