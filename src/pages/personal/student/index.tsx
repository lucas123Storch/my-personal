/* eslint-disable @next/next/no-img-element */
import ModalRecord from '@/components/view-record-modal';
import { db } from '@/firebaseConfig';
import { RecordData } from '@/models/exercise/table-exercise-type';
import { Student } from '@/models/student/student-type';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentList() {
  const [alunos, setAlunos] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [recordData, setRecordData] = useState<RecordData[]>([]);

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
      };
    });
    setAlunos(alunosList);
  };

  const refreshData = () => {
    if (selectedStudentId) {
      fetchRecordData(selectedStudentId);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchRecordData = async (studentId: string) => {
    const q = query(collection(db, 'tables-exercises'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as RecordData);
    setRecordData(fetchedData);
  };

  const handleOpenModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    fetchRecordData(studentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRecordData([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='p-6'>
        <div className="bg-orange-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold">Meus Alunos</h2>
          <p className="text-lg mt-2">Aqui está a lista de alunos cadastrados:</p>
        </div>

        <div className="flex justify-between items-center mb-6 px-8">
          <h2 className="text-2xl font-semibold text-gray-800">Alunos</h2>
          <Link href="/personal/student/form" className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">
            Novo Aluno
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {alunos.map((data) => (
            <div key={data.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={"https://picsum.photos/500/300"}
                alt={data.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{data.email}</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{data.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${data.status === "Ativo" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
                >
                  {data.status}
                </span>
                <div className="mt-2 flex space-x-4">
                  <Link href={`/personal/student/${data.id}/record`} className="text-orange-600 hover:underline">
                    Adicionar Ficha
                  </Link>
                  <a onClick={() => handleOpenModal(data.id)} className="text-orange-600 hover:underline cursor-pointer">
                    Ver Ficha
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <ModalRecord onClose={handleCloseModal} recordData={recordData} refreshData={refreshData} />
        )}
      </div>
    </div>
  );
}
