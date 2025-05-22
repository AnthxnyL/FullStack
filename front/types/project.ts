import { User } from "./user";
 
export type Project = {
    id: number;
    title: string;
    description: string;
    techno_used: string[];
    image: string;
    is_active: boolean;
    date: string;
    student: User[];
};