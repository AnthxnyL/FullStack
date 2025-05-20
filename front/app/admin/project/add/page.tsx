"use client";
 
import { User } from "@/types/user";
import { getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
 
export default function AddArticle() {
    const [response, setResponse] = useState("");

    const [users, setUsers] = useState<User[]>([]);
 
    const fetchUsers = async () => {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setUsers(data.member as User[]);
    };
 
    useEffect(() => {  
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
 
        const token = await getToken();
 
        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title");
        const description = formData.get("description");
        const user = formData.get("user");
        const technoUsed = formData.get("technoUsed");
        const date = formData.get("date");
        const image = formData.get("image");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                user: user,
                techno_used: [technoUsed],
                date: date,
                image: image
            }),
        });

 
        const data = await response.json();
        if (response.ok) {
            setResponse("Projet ajouté avec succès");
        } else {
            console.error(data);
            if(data.description){
                setResponse(data.description);
            } else {
                setResponse("Echec lors de la création du projet");
            }
        }
    }
 
    return (
        <>
            <h1>Ajout d&apos;un article</h1>
            {response && <p>{response}</p>}

            {users.length > 0 && (
                <form method="POST" onSubmit={handleSubmit}>
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" />
                    <br />
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                    <br />
                    <label htmlFor="date">Date</label>
                    <input id="date" name="date"></input>
                    <br />
                    <label htmlFor="technoUsed">Techno utilisées</label>
                    <input id="technoUsed" name="technoUsed"></input>
                    <br />
                    <label htmlFor="image">Image</label>
                    <input id="image" name="image" type="text"></input>
                    <br />
                    <label htmlFor="user">User</label>
                    <select id="user" name="user">
                        {users.map((user: any) => (
                            <option value={user['@id']} key={user.id}>{user.first_name}</option>
                        ))}
                    </select>
                    <br />
                    <button type="submit">Ajouter</button>
                </form>
            )}
        </>
    )
}