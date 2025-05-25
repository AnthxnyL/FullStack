"use client";
 
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";

export default function Register() {
    const [response, setResponse] = useState<string>("");
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const plainPassword = formData.get("plainPassword") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const studyYear = Number(formData.get("study_year"));
        
        const register = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                plainPassword: plainPassword,
                first_name: firstName,
                last_name: lastName,
                study_year: studyYear
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

    useEffect(() => {
        if (response.includes('réussie')) {
            const timer = setTimeout(() => setResponse(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [response]);
 
    return (
        <div>
            <h1>Inscription</h1>
            {response.includes('réussie') ? (
                <SuccessMessage message={response} />
            ) : (
                <ErrorMessage message={response} />
            )}
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" required />
                <label htmlFor="plainPassword">Password</label>
                <input type="password" name="plainPassword" placeholder="Mot de passe" required />
                <label htmlFor="firstName">First name</label>
                <input type="text" name="firstName" placeholder="Jhon" required />
                <label htmlFor="lastName">Last name</label>
                <input type="text" name="lastName" placeholder="Doe" required />
                <label htmlFor="study_year">Année d&apos;étude</label>
                <select name="study_year" required defaultValue={1}>
                  <option value={1}>1ère année</option>
                  <option value={2}>2ème année</option>
                  <option value={3}>3ème année</option>
                  <option value={4}>4ème année</option>
                  <option value={5}>5ème année</option>
                </select>
                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}