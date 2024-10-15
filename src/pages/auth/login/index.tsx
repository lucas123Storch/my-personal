import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from "next/link";
import { auth } from "@/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdTokenResult();
      const claims = token.claims;
      if (claims.personal) {
        router.push("/personal/home");
      } else if (claims.student) {
        router.push("/student/home");
      } else {
        setError("Permissões insuficientes.");
      }
    } catch (err: any) {
      setError("Erro ao fazer login: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/gym.png"
            alt="Gym Icon"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="text-orange-500 hover:underline">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
