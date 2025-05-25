"use client";

import { useState } from "react";
import { getToken } from "@/utils/jwt";

export default function CorsTestPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  
  const testCorsSimple = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cors-test.php`, {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors du test CORS: " + String(error));
    } finally {
      setLoading(false);
    }
  };
  
  const testCorsWithFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('test_field', 'valeur de test');
      
      if (file) {
        formData.append('test_file', file);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cors-test.php`, {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors du test CORS avec fichier: " + String(error));
    } finally {
      setLoading(false);
    }
  };
  
  const testProjectEndpoint = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('title', 'Projet test CORS');
      formData.append('description', 'Description du projet de test pour vérifier la configuration CORS');
      formData.append('date', new Date().toISOString().split('T')[0]);
      formData.append('is_active', 'true');
      formData.append('techno_used', JSON.stringify(['Test', 'CORS']));
      
      if (file) {
        formData.append('imageFile', file);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        mode: 'cors',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        // Cloner la réponse pour pouvoir la lire deux fois
        const clonedResponse = response.clone();
        
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            setResult(`Erreur ${response.status}: ${JSON.stringify(errorData, null, 2)}`);
          } else {
            const rawText = await clonedResponse.text();
            setResult(`Erreur ${response.status}: ${rawText.substring(0, 500)}...`);
          }
        } catch (error) {
          setResult(`Erreur ${response.status}: Impossible d'analyser la réponse`);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors du test du endpoint projet: " + String(error));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Test CORS amélioré</h1>
      
      <div className="mb-4">
        <input 
          type="file" 
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          className="border p-2 mb-2"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button 
          onClick={testCorsSimple} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Test CORS Simple
        </button>
        
        <button 
          onClick={testCorsWithFile} 
          disabled={loading || !file}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          Test CORS avec fichier
        </button>
        
        <button 
          onClick={testProjectEndpoint} 
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
        >
          Test Endpoint Projet
        </button>
      </div>
      
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          Chargement en cours...
        </div>
      )}
      
      {result && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Résultat:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">{result}</pre>
        </div>
      )}
    </div>
  );
}
