"use client";

import { useState } from "react";
import { createCookie } from "@/utils/jwt";
import { redirect } from "next/navigation";
 
export default function Login() {
    const [response, setResponse] = useState<string>("");
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
 
        const register = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
 
        const data = await register.json();
        if (register.ok) {
            // Récupération du token
            const token = data.token;
            createCookie(token); // Crée le cookie avec le token
            redirect("/"); // Redirige vers la page d'accueil
        } else {
            console.error(data);
            if(data.message){
                setResponse(data.message);
            } else {
                setResponse("Echec lors de la connexion");
            }
        }
    }
 
    return (
        <div>
            <h1>Connexion</h1>
            {response && <p>{response}</p>}
            <form method="POST" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Mot de passe" />
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
}