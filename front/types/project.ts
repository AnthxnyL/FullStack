import { User } from "./user";
 
export type Project = {
    id: number;
    title: string;
    description: string;
    techno_used: string[];
    image: string;
    date: string;
    student: User[];
};