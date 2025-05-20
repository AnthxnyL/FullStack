"use client";

import { Project } from "@/types/project";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  // Récupération des projects
  const getProjects = async () => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      console.log(res);
      const data = await res.json();
      console.log(data);
      setProjects(data.member as Project[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <h1>Liste des projects</h1>
      {/* Affichage des project */}
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
               <p>
                <Link href={`/project/${project.id}`}>Afficher le projet</Link>
              </p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun project trouvé</p>
      )}
    </>
  );
}
