/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { Exercise } from '@/models/exercise/exercise-type';
import { Day } from '@/models/exercise/table-exercise-type';

export default function Record() {
  const router = useRouter();
  const { id: studentId } = router.query;
  const [personalId, setPersonalId] = useState('');
  const [dias, setDias] = useState<Day[]>([{ day: '', exercises: [] }]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setPersonalId(currentUser.uid);
    } else {
      router.push('/auth/login');
    }
  }, []);

  const fetchExercises = async () => {
    const exercisesSnapshot = await getDocs(collection(db, 'exercises'));
    const exercisesList = exercisesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[];
    setExercises(exercisesList);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddExercise = (dayIndex: number, exercise: Exercise) => {
    const updatedDays = [...dias];
    updatedDays[dayIndex].exercises.push(exercise);
    setDias(updatedDays);
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...dias];
    updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDias(updatedDays);
  };

  const handleAddDay = () => {
    setDias([...dias, { day: '', exercises: [] }]);
  };

  const handleRemoveDay = (index: number) => {
    const updatedDays = [...dias];
    updatedDays.splice(index, 1);
    setDias(updatedDays);
  };

  const handleSubmit = async () => {
    const recordData = {
      personalId,
      studentId,
      days: dias,
    };

    try {
      await addDoc(collection(db, 'tables-exercises'), recordData);
      console.log('Ficha salva com sucesso!', recordData);

      router.push('/personal/student');
    } catch (error) {
      console.error('Erro ao salvar a ficha:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Ficha de Exercícios para Aluno(a) #{studentId}</h1>

        <button
          onClick={handleAddDay}
          className="mb-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Adicionar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dias.map((dia, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Nome do treino"
                  value={dia.day}
                  onChange={(e) => {
                    const updatedDays = [...dias];
                    updatedDays[index].day = e.target.value;
                    setDias(updatedDays);
                  }}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
                />
                {dias.length > 1 && (
                  <button
                    className="text-red-500 hover:underline ml-4"
                    onClick={() => handleRemoveDay(index)}
                  >
                    Remover
                  </button>
                )}
              </div>

              <ul className="mb-4">
                {dia.exercises.length > 0 ? (
                  dia.exercises.map((exercise, exIndex) => (
                    <li key={exIndex} className="text-gray-700 flex justify-between items-center">
                      {exercise.name}
                      <button
                        className="text-red-500 hover:underline ml-4"
                        onClick={() => handleRemoveExercise(index, exIndex)}
                      >
                        Remover
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum exercício adicionado.</p>
                )}
              </ul>

              <select
                onChange={(e) =>
                  handleAddExercise(
                    index,
                    exercises.find((ex) => ex.id === e.target.value)!
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">Selecione um exercício</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          Salvar Ficha
        </button>
      </div>
    </div>
  );
}
