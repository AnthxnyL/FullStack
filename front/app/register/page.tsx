"use client";
 
import { useState } from "react";
 
export default function Register() {
    const [response, setResponse] = useState<string>("");
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const plainPassword = formData.get("plainPassword") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        
        const register = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                plainPassword: plainPassword,
                first_name: firstName,
                last_name: lastName
            }),
        });

        const data = await register.json();
        if (register.ok) {
            setResponse("Inscription réussie");
        } else {
            console.error(data);
            if (data.description) {
                setResponse(data.description);
            } else {
                setResponse("Echec lors de l'inscription");
            }
        }
    }
 
    return (
        <div>
            <h1>Inscription</h1>
            {response && <p>{response}</p>}
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" required />
                <label htmlFor="plainPassword">Password</label>
                <input type="password" name="plainPassword" placeholder="Mot de passe" required />
                <label htmlFor="firstName">First name</label>
                <input type="text" name="firstName" placeholder="Jhon" required />
                <label htmlFor="lastName">Last name</label>
                <input type="text" name="lastName" placeholder="Doe" required />
                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}