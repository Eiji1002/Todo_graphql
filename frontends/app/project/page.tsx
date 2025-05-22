'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '@/app/lib/graphql/mutation';
import { GET_USERS_ID } from '@/app/lib/graphql/queries';
import { useRouter } from 'next/navigation';
export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  const { data, loading, error } = useQuery(GET_USERS_ID);
  const [createProject] = useMutation(CREATE_PROJECT);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createProject({ variables: { name, userId: parseInt(userId) } });
    const projectId = response.data.createProject.id;
    setName('');
    setUserId('');
    router.push(`/kanban?projectId=${projectId}`);
  };
  

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p>Erreur lors du chargement des utilisateurs</p>;

  
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un Projet</h2>

        <div className="mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du projet"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un utilisateur</option>
            {data.users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Créer le projet
        </button>
      </form>
    </div>
  );
}
