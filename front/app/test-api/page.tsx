"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { getToken } from "@/utils/jwt";

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const testSimpleGet = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/test`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors de l'appel GET: " + String(error));
    }
  };

  const testSimplePost = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/test`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ test: "data" })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors de l'appel POST: " + String(error));
    }
  };

  const testMultipartPost = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('test', 'data');
      if (file) {
        formData.append('testFile', file);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/test`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erreur:", error);
      setResult("Erreur lors de l'envoi multipart: " + String(error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Page de test API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Test GET</h2>
          <button 
            onClick={testSimpleGet} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Requête GET
          </button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Test POST JSON</h2>
          <button 
            onClick={testSimplePost} 
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Requête POST JSON
          </button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl mb-2">Test POST Multipart</h2>
          <form onSubmit={testMultipartPost}>
            <div className="mb-3">
              <label className="block mb-1">Fichier (optionnel):</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="w-full p-2 border rounded"
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Envoyer Multipart
            </button>
          </form>
        </div>
      </div>
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">Résultat:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
