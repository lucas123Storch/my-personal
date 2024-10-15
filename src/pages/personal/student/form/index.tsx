/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { User } from '@/models/users/user-type';

export default function NovoAluno() {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [status, setStatus] = useState('Ativo');
  const router = useRouter();

  const fetchStudents = async () => {
    const studentsSnapshot = await getDocs(collection(db, 'users'));
    const studentsList: User[] = studentsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string,
          email: data.email as string,
          role: data.role as string,
          uid: doc.id,
        } as User;
      })
      .filter((user) => user.role === 'student');

    setStudents(studentsList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedStudentId(selectedId);

    const selectedStudent = students.find((student) => student.id === selectedId);
    if (selectedStudent) {
      setName(selectedStudent.name);
      setEmail(selectedStudent.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAluno = {
      name,
      email,
      phone,
      address,
      birthDate,
      weight,
      height,
      status
    };

    const data = {
      id: selectedStudentId,
      ...newAluno
    };

    try {
      await setDoc(doc(db, 'students', selectedStudentId), data);
      console.log('Aluno salvo com sucesso:', newAluno);
  
      router.push('/personal/student');
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='p-6'>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto space-y-4">
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700">
              Selecionar Aluno
            </label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={handleStudentChange}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Selecione um aluno</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              readOnly
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              readOnly
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Altura (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
            >
              Criar Aluno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
