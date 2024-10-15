import { RecordData } from '@/models/exercise/table-exercise-type';
import { FC } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface ModalProps {
  onClose: () => void;
  recordData: RecordData[];
  refreshData: () => void;
}

const ModalRecord: FC<ModalProps> = ({ onClose, recordData, refreshData }) => {
  
  const handleDeleteRecord = async (record: RecordData) => {
    try {
      await deleteDoc(doc(db, 'tables-exercises', record.id));
      console.log(`Ficha ${record.id} deletada com sucesso.`);
      refreshData();
    } catch (error) {
      console.error('Erro ao deletar a ficha:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Fechar
        </button>

        <h2 className="text-orange-600 text-2xl font-bold mb-4">Ficha de Exercícios</h2>

        {recordData && recordData.length > 0 ? (
          recordData.map((record, index) => (
            <div key={index} className="mb-6">
              {record.days.map((day, dayIndex) => (
                <div key={dayIndex} className="mb-4">
                  <h3 className="text-orange-500 text-xl font-semibold">{day.day}</h3>
                  <ul className="list-disc list-inside">
                    {day.exercises.map((exercise, exIndex) => (
                      <li key={exIndex} className="text-gray-700">
                        {exercise.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={() => handleDeleteRecord(record)}
              >
                Excluir Ficha
              </button>
            </div>
          ))
        ) : (
          <p className='text-black'>Nenhuma ficha encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default ModalRecord;
