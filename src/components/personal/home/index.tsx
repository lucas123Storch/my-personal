import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/firebaseConfig";
import { Exercise } from "@/models/exercise/exercise-type";
import { Student } from "@/models/student/student-type";

/* eslint-disable @next/next/no-img-element */
export default function HomePersonal() {
  const [alunos, setAlunos] = useState<Student[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userName, setUserName] = useState<string>("");

  const fetchAlunos = async () => {
    const alunosSnapshot = await getDocs(collection(db, "students"));
    const alunosList = alunosSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        address: data.adress as string,
        birthDate: data.birthDate as string,
        email: data.email as string,
        height: data.height as string,
        name: data.name as string,
        phone: data.phone as string,
        status: data.status as string,
        weight: data.weight as string,
      }
    })
    setAlunos(alunosList);
  };

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name);
      }
    }
  };

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

  useEffect(() => {
    fetchAlunos();
    fetchExercises();
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-orange-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold">Olá, {userName}!</h2>
          <p className="text-lg mt-2">Hoje é dia 07 de junho de 2024</p>
        </div>

        <div className="flex justify-between items-center mb-6 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Alunos</h2>
          <Link href="/personal/student" className="text-orange-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {alunos.slice(0, 3).map((data) => (
            <div key={data.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={"https://picsum.photos/500/300"}
                alt={data.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{data.email}</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{data.name}</h3>
                <a className="text-orange-600 hover:underline mt-2 inline-block">Acessar</a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 mb-6 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Exercícios</h2>
          <Link href="/personal/exercise" className="text-orange-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {exercises.slice(0, 3).map((data) => (
            <div key={data.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={data.mediaURL || "https://picsum.photos/500/300"}
                alt={data.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{data.description}</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{data.name}</h3>
                <a className="text-orange-600 hover:underline mt-2 inline-block">Acessar</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
