"use client";
 
import { getSession, logout } from "@/utils/jwt";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
 
export default function Menu() {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navRef = useRef<HTMLUListElement>(null);

    const fetchSession = async () => {
        const session = await getSession();
        if (session) {
            setIsLogged(true);
            setIsAdmin(session.roles.includes("ROLE_ADMIN"));
        }
    };
 
    const handleLogout = async () => {
        await logout();
        setIsLogged(false);
        redirect("/")
    };
 
    useEffect(() => {
        fetchSession();
    }, []);

    // Fermer le menu mobile au clic sur un lien
    const handleLinkClick = () => {};
    
    return (
        <nav className="container mx-auto">
            <div className="flex items-center justify-between py-2">
                <ul
                ref={navRef}
                className="flex gap-4 items-center w-full justify-between rounded px-4 py-2"
                >
                    <li><Link href="/" className="font-bold text-lg">Accueil</Link></li>
                    {isLogged ? (
                        <div className="flex gap-4 items-center">
                            {isAdmin && (
                                <li><Link href="/admin/project/new" onClick={handleLinkClick}>Ajouter un projet</Link></li>
                            )}
                            <li>
                            <Link 
                                href="#" 
                                onClick={() => { handleLogout(); handleLinkClick(); }}
                                className="btn-danger"
                            >
                                Déconnexion
                            </Link>
                            </li>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <li><button className="btn-outline"><Link href="/register" onClick={handleLinkClick}>Inscription</Link></button></li>
                            <li><button><Link href="/login" onClick={handleLinkClick}>Connexion</Link></button></li>
                        </div>
                    )}
                </ul>
            </div>
        </nav>
    );
}