import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/jwt";
 
export default async function middleware(request: NextRequest) {
    // Récupération de la session décryptée
    const session = await getSession();

    // Vérifie si l'utilisateur est admin
    const isAdmin = Array.isArray(session?.roles) && session.roles.includes("ROLE_ADMIN");
    
    // Si l'utilisateur n'est pas admin et qu'il tente d'accéder à la page admin, on le redirige vers la page d'accueil
    if (!isAdmin && request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // On laisse la page s'afficher
    return NextResponse.next();
}