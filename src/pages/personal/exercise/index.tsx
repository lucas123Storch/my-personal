/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import { Exercise } from '@/models/exercise/exercise-type';

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchExercises = async () => {
    const exercisesSnapshot = await getDocs(collection(db, 'exercises'));
    const exercisesList = exercisesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name as string,
        description: data.description as string,
        mediaURL: data.mediaURL as string,
        personalId: data.personalId as string,
      } as Exercise;
    });
    setExercises(exercisesList);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "exercises", id));
      const updatedExercises = exercises.filter((exercise) => exercise.id !== id);
      setExercises(updatedExercises);
    } catch (error) {
      console.error("Erro ao apagar o exercício: ", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-orange-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold">Exercícios</h2>
          <p className="text-lg mt-2">Aqui está a lista de exercícios cadastrados.</p>
        </div>

        <div className="flex justify-between items-center mb-6 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Exercícios</h2>
          <Link href="/personal/exercise/form" className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">
            Novo Exercício
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={exercise.mediaURL || "https://picsum.photos/500/300"}
                alt={exercise.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{exercise.name}</h3>
                <p className="text-sm text-gray-500">{exercise.description}</p>
                <div className="mt-4 flex space-x-4">
                  <Link href={`/personal/exercise/${exercise.id}/edit`} className="text-blue-600 hover:underline">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="text-red-600 hover:underline"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
