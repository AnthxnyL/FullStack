"use client";
 
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/project";
import Image from "next/image";
 
export default function ArticlePage() {
    // Récupération de l'id de l'article via l'URL
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    
    const fetchProject = useCallback(async () => {
        // Appel de l'API pour récupérer l'article
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);
        const data = await response.json();

        setProject(data as Project);
    }, [id]);

    // Récupération de l'article lorsque l'id change
    useEffect(() => {
        fetchProject();
    }, [id, fetchProject]);   
    console.log(project);
    if (!project) {
        return <div>Chargement...</div>;
    }
 
    return (
        <div>
            {/* Affichage de l'article */}
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <p>{project.date}</p>
            {project.student && project.student.length > 0 ? (
                project.student.map((student) => (
                    <div key={student.id}>
                        <h2>élève</h2>
                        <p>{student.first_name}</p>
                        <p>{student.last_name}</p>
                    </div>
                ))
            ) : (
                <p>Aucun élève trouvé</p>
            )}
            { project.image && (project.image.startsWith('/')) ? (
                <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                    <Image 
                        src={project.image} 
                        alt="Image du projet"
                        fill
                        style={{ objectFit: 'cover' }}
                    /> 
                </div>
            ) : project.image && (project.image.startsWith('http')) ? (
                <div>
                    <img
                        src={project.image}
                        alt="Image du projet"
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                </div>
            ) : project.image ? (
                <p>Image non valide: {project.image}</p>
            ) : null}   

            {project.techno_used && Array.isArray(project.techno_used) && project.techno_used.length > 0 ? (
                <div>
                    <h2>Technologies utilisées</h2>
                    <ul>
                        {project.techno_used.map((techno) => (
                            <li key={techno}>{techno}</li>
                        ))}
                    </ul>
                </div>
            ) : project.techno_used && !Array.isArray(project.techno_used) ? (
                <div>
                    <h2>Technologies utilisées</h2>
                    <p>{project.techno_used}</p>
                </div>
            ) : (
                <p>Aucune technologie trouvée</p>
            )}


        </div>
    );
}