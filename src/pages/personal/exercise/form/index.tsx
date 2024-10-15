import { useState } from 'react';
import { useRouter } from 'next/router';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ExerciseForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("Nenhum usuário logado.");
      return;
    }

    const personalId = currentUser.uid;

    try {
      let mediaURL = '';

      if (media) {
        setUploading(true);

        const mediaRef = ref(storage, `exercises/${personalId}/${media.name}`);

        await uploadBytes(mediaRef, media);

        mediaURL = await getDownloadURL(mediaRef);

        setUploading(false);
      }

      const newExercise = {
        name,
        description,
        personalId,
        mediaURL,
      };

      await addDoc(collection(db, 'exercises'), newExercise);

      console.log("Exercício salvo com sucesso:", newExercise);

      router.push('/personal/exercise');
    } catch (error) {
      console.error("Erro ao salvar o exercício:", error);
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMedia(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-orange-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold">Novo Exercício</h2>
          <p className="text-lg mt-2">Preencha os campos abaixo para adicionar um novo exercício.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Exercício
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700">
              Imagem ou Vídeo do Exercício
            </label>
            <input
              type="file"
              id="media"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
            {media && <p className="mt-2 text-sm text-gray-600">{media.name}</p>}
          </div>
          {uploading && <p className="text-orange-600">Fazendo upload...</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
              disabled={uploading}
            >
              Salvar Exercício
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
