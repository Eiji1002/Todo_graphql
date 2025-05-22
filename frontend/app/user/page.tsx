'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/app/lib/graphql/mutation';
import { useRouter } from 'next/navigation';
export default function CreateUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ variables: { name, email } });
    setName('');
    setEmail('');
  };
  const router = useRouter();

  const handleClick = () => {
    router.push('/project');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded w-full max-w-md">
        <div className="mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button onClick={() => handleClick()} type="submit" className="w-full bg-black text-white p-2 rounded">
          Créer l'utilisateur
        </button>
      </form>
    </div>
  );
}
