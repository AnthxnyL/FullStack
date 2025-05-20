"use client";
 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/project";
 
export default function ArticlePage() {
    // Récupération de l'id de l'article via l'URL
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    
    const fetchProject = async () => {
        // Appel de l'API pour récupérer l'article
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);
        const data = await response.json();
 
        setProject(data as Project);
    };
 
    // Récupération de l'article lorsque l'id change
    useEffect(() => {
        fetchProject();
    }, [id]);   
 
    if (!project) {
        return <div>Chargement...</div>;
    }
 
    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <p>Auteur</p>
        </div>
    );
}