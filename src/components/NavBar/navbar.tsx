import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdTokenResult();
        const claims = token.claims;

        if (claims.student) {
          setUserRole("student");
        } else if (claims.personal) {
          setUserRole("personal");
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow">
      <h1 className="text-2xl font-bold text-gray-800">{userRole === "student" ? 'Estudante' : 'Personal'}</h1>
      <ul className="flex space-x-6 text-gray-600">
        {userRole === "personal" ? (
          <>
            <li>
              <Link href="/personal/home" className="text-gray py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/personal/student" className="text-gray py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white">
                Alunos
              </Link>
            </li>
            <li>
              <Link href="/personal/exercise" className="text-gray py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white">
                Exercícios
              </Link>
            </li>
          </>
        ) : userRole === "student" ? (
          <>
            <li>
              <Link href="/student/profile" className="text-gray py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white">
                Perfil
              </Link>
            </li>
          </>
        ) : null}

        {/* Botão de Logout comum para ambos */}
        <li>
          <button
            onClick={handleLogout}
            className="px-4 rounded-md hover:bg-orange-600 hover:text-white rounded-md hover:bg-red-700 bg-red-600 text-white h-8"
          >
            Sair
          </button>
        </li>
      </ul>
    </nav>
  );
}
