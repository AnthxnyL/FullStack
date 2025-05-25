"use client";
 
import { getSession, logout } from "@/utils/jwt";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
 
export default function Menu() {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
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
    const handleLinkClick = () => setOpen(false);
    
    return (
        <nav className="mb-6">
            <div className="flex items-center justify-between py-2">
                <Link href="/" className="font-bold text-lg">Accueil</Link>
                <button
                    className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Ouvrir le menu"
                    onClick={() => setOpen(!open)}
                >
                    <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                </button>
            </div>
            <ul
                ref={navRef}
                className={`flex-col gap-4 items-center bg-white text-black rounded shadow px-4 py-2 transition-all duration-200 z-20 ${open ? 'flex' : 'hidden'} fixed top-0 right-0 w-3/4 max-w-xs h-full sm:max-w-xs md:max-w-xs lg:max-w-xs xl:max-w-xs 2xl:max-w-xs sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-3/4`}
                style={{boxShadow: open ? '2px 0 16px #0002' : undefined}}
            >
                <li className="w-full flex justify-end mb-4">
                  <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="text-2xl font-bold">&times;</button>
                </li>
                {isLogged ? (
                    <>
                        {isAdmin && (
                            <li><Link href="/admin/project/new" onClick={handleLinkClick}>Ajouter un projet</Link></li>
                        )}
                        <li><Link href="#" onClick={() => { handleLogout(); handleLinkClick(); }}>Déconnexion</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link href="/login" onClick={handleLinkClick}>Connexion</Link></li>
                        <li><Link href="/register" onClick={handleLinkClick}>Inscription</Link></li>
                    </>
                )}
            </ul>
            {/* Overlay mobile/desktop */}
            {open && (
                <div className="fixed inset-0 bg-black/30 z-10" onClick={() => setOpen(false)}></div>
            )}
        </nav>
    );
}