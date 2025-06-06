"use client";

import { Project } from "@/types/project";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSession, getToken } from "@/utils/jwt";


export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);


  const getRole = async () => {
      const session = await getSession();
      const admin = session?.roles?.includes("ROLE_ADMIN");
      setIsAdmin(!!admin);
  }

    // Récupération des projects
  const getProjects = async () => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data.member as Project[]);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Fonction pour supprimer un projet
  const deleteProject = async (id: number) => {
      const token = await getToken();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          // Rafraîchir la liste des projets après la suppression
          getProjects();
        } else {
          console.error("Erreur lors de la suppression du projet");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
  };

  const toggleProjectVisibility = async (id: number, is_active: boolean) => {
    const token = await getToken();
    // Si le projet est actif, on le cache
    // Sinon, on le réactive
    const newStatus = is_active ? false : true;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/merge-patch+json",
        },
        body: JSON.stringify({ is_active: newStatus }),
      });
      
      if (res.ok) {
          getProjects();
          console.log("Projet caché avec succès");
        } else {
          console.error(`Erreur lors de la désactivation du projet: ${res.status} ${res.statusText}`);
          // Pour déboguer la réponse
          const errorData = await res.text();
          console.error("Détails:", errorData);
        }
      } catch (error) {
        console.error("Erreur lors de la désactivation:", error);
      }
  };




  useEffect(() => {
    getProjects();
    getRole();
  }, []);

  return (
    <>
      <h1>Liste des projects</h1>
      {/* Affichage des project */}
      {projects.length > 0 ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            project.is_active ? (
              <li key={project.id} style={{ marginBottom: '30px' }}>
                <h2>{project.title}</h2>
                {project.image && (
                  <div>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/projects/${project.image}`}
                      alt={project.title}
                      className="pb-4 aspect-[16/9] object-cover w-full"
                    >
                    </img>
                  </div>
                )}
                <p>{project.description.length > 40 ? project.description.slice(0, 40) + "..." : project.description}</p>
                <div className="flex gap-2">
                  <button>
                    <Link href={`/project/${project.id}`}>Open</Link>
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => deleteProject(project.id)} 
                        className="btn-danger"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleProjectVisibility(project.id, project.is_active)}
                      >
                        Hide
                      </button>
                    </>
                  )}
                </div>

                <hr />
              </li>

            ) : isAdmin && (
              <li key={project.id} style={{ opacity: 0.5 }}>
                <h2>{project.title} (caché)</h2>
                {project.image && (
                  <div>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/projects/${project.image}`}
                      alt={project.title}
                      className="pb-4 aspect-[16/9] object-cover w-full"
                    >
                    </img>
                  </div>
                )}
                <p>{project.description.length > 40 ? project.description.slice(0, 40) + "..." : project.description}</p>
                <div className="flex gap-2">
                  <button>
                    <Link href={`/project/${project.id}`}>Open</Link>
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => deleteProject(project.id)} 
                        className="btn-danger"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => toggleProjectVisibility(project.id, project.is_active)}
                      >
                        Show
                      </button>
                    </>
                  )}
                  </div>
                <hr />
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>Aucun project trouvé</p>
      )}
    </>
  );
}
