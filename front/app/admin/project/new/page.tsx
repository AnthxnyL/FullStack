"use client";

import { Project } from "@/types/project";
import { User } from "@/types/user";
import { getToken } from "@/utils/jwt";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [project, setProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    techno_used: [],
    date: new Date().toISOString().split('T')[0],
    is_active: true,
    student: []
  });
  const [technoInput, setTechnoInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "is_active") {
      const selectElement = e.target as HTMLSelectElement;
      setProject({
        ...project,
        [name]: selectElement.value === 'true'
      });
    } else {
      setProject({
        ...project,
        [name]: value
      });
    }
  };

  const handleTechnoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTechnoInput(e.target.value);
  };

  const addTechno = () => {
    if (technoInput.trim() !== "") {
      setProject({
        ...project,
        techno_used: [...(project.techno_used || []), technoInput.trim()]
      });
      setTechnoInput("");
    }
  };

  const removeTechno = (index: number) => {
    const techno_used = [...(project.techno_used || [])];
    techno_used.splice(index, 1);
    setProject({ ...project, techno_used });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Fonction pour récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.member || []);
      } else {
        console.error("Erreur lors de la récupération des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  
  // Charger les utilisateurs au chargement de la page
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Gérer la sélection des utilisateurs
  const handleUserSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setSelectedUsers(selectedOptions);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();
      
      // Création d'un FormData pour envoyer des fichiers
      const formData = new FormData();
      
      // Ajouter les données du projet au FormData
      formData.append('title', project.title || '');
      formData.append('description', project.description || '');
      if (project.techno_used) {
        formData.append('techno_used', JSON.stringify(project.techno_used));
      }      formData.append('date', project.date || new Date().toISOString().split('T')[0]);
      formData.append('is_active', String(project.is_active));
      
      // Ajouter les utilisateurs sélectionnés
      if (selectedUsers.length > 0) {
        formData.append('student', JSON.stringify(selectedUsers));
      }// Ajouter l'image si elle existe
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      console.log("Envoi de la requête à", `${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`);
      
      // Afficher le contenu du FormData pour le débogage
      console.log("FormData contenu:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}, size: ${value.size}, type: ${value.type}` : value}`);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Ne pas ajouter 'Content-Type' car le navigateur le configurerait automatiquement avec le bon boundary pour FormData
        },
        mode: 'cors', // Explicitement indiquer que c'est une requête CORS
        credentials: 'include', // Pour envoyer les cookies si nécessaire
        body: formData
      });

      console.log("Statut de la réponse:", response.status);
      console.log("En-têtes de la réponse:", [...response.headers.entries()]);

      if (response.ok) {
        setMessage("Projet créé avec succès !");
        router.push("/");
      } else {
        // Cloner la réponse pour pouvoir la lire deux fois
        const clonedResponse = response.clone();
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            console.error("Erreur JSON:", errorData);
            setMessage(`Erreur : ${JSON.stringify(errorData)}`);
          } catch {
            // En cas d'échec de parsing JSON, essayer de récupérer le texte brut
            try {
              const rawText = await clonedResponse.text();
              console.error("Erreur texte brut:", rawText);
              setMessage(`Erreur ${response.status}: ${rawText.substring(0, 200)}...`);
            } catch {
              setMessage(`Erreur ${response.status}: Impossible d'analyser la réponse du serveur.`);
            }
          }
        } else {
          try {
            const rawText = await response.text();
            console.error("Erreur texte brut non-JSON:", rawText);
            setMessage(`Erreur ${response.status}: ${rawText.substring(0, 200)}...`);
          } catch (error) {
            console.error("Impossible de lire la réponse:", error);
            setMessage(`Erreur ${response.status}: Erreur serveur. Veuillez contacter l'administrateur.`);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      setMessage("Une erreur est survenue lors de la création du projet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.includes("succès")) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      <h1>Ajouter un nouveau projet</h1>
      {message && (
        message.includes("succès") ? (
          <SuccessMessage message={message} />
        ) : (
          <ErrorMessage message={message} />
        )
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Titre:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
            <label htmlFor="description" className="block mb-1">Description:</label>
            <textarea
                id="description"
                name="description"
                value={project.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-2 border rounded"
            ></textarea>
        </div>
        
        <div>
          <label htmlFor="date" className="block mb-1">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={project.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="is_active" className="block mb-1">Statut:</label>
          <select
            id="is_active"
            name="is_active"
            value={project.is_active?.toString()}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="true">Actif</option>
            <option value="false">Caché</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Technologies utilisées:</label>
          <div className="flex">
            <input
              type="text"
              value={technoInput}
              onChange={handleTechnoInputChange}
              className="flex-1 p-2 border rounded-l"
              placeholder="Ajouter une technologie..."
            />
            <button
              type="button"
              onClick={addTechno}
             
            >
              +
            </button>
          </div>
          
          {project.techno_used && project.techno_used.length > 0 && (
            <ul className="mt-2 space-y-1">
              {project.techno_used.map((techno, index) => (
                <li key={index} className="flex items-center">
                  <span className="flex-1">{techno}</span>
                  <button
                    type="button"
                    onClick={() => removeTechno(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
            <label htmlFor="students" className="block mb-1">Étudiants:</label>
            <select
                id="students"
                multiple
                onChange={handleUserSelection}
                className="w-full p-2 border rounded"
                size={5}
            >
                {users.map((user) => (
                <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                </option>
                ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
                Maintenez la touche Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs étudiants.
            </p>
        </div>
        
        <div>
          <label htmlFor="imageFile" className="block mb-1">Image:</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="w-full p-2 border rounded"
          />
          
          {imagePreview && (
            <div className="mt-4">
              <p>Prévisualisation:</p>
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Prévisualisation"
                  width={300}
                  height={200}
                  style={{ objectFit: 'contain', maxHeight: "200px" }}
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Créer le projet"}
          </button>
        </div>
      </form>
    </div>
  );
}
