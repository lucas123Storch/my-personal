import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { RecordData } from "@/models/exercise/table-exercise-type";

/* eslint-disable @next/next/no-img-element */
export default function HomeStudent() {
  const [treinos, setRecordData] = useState<RecordData[]>([]);
  const [userName, setUserName] = useState<string>("");

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

  const fetchTreinos = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(collection(db, 'tables-exercises'), where('studentId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as RecordData);
      setRecordData(fetchedData);
    }
  };

  useEffect(() => {
    fetchTreinos();
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-orange-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold">Bem-vindo, {userName}!</h2>
          <p className="text-lg mt-2">Aqui estão seus treinos:</p>
        </div>

        <div className="flex justify-between items-center mt-6 mb-6 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Treinos</h2>
          {/* <Link href="/personal/exercise" className="text-orange-600 hover:underline">
            Ver todos
          </Link> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {treinos.map((treino) => (
            <div key={treino.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {treino.days.map((day, index) => (
                <div key={index} className="p-4">
                  <h3 className="text-xl font-semibold text-orange-600">{day.day}</h3>
                  <ul className="list-disc list-inside mt-2">
                    {day.exercises.map((exercise, exIndex) => (
                      <li key={exIndex} className="text-gray-700">
                        {exercise.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
