import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Image from 'next/image';
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/firebaseConfig";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("student");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role === "teacher" ? "personal" : "student",
      });

      const userRole = role === "teacher" ? "personal" : "student";
      await fetch("/api/setCustomClaims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid, role: userRole }),
      });

      router.push("/auth/login");
    } catch (err: any) {
      setError("Erro ao criar conta: " + err.message);
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

        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Cadastro</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite seu nome"
              required
            />
          </div>

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

          <div className="mb-4">
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
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Você é:</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-orange-500"
                />
                <span className="text-black ml-2">Professor</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-orange-500"
                />
                <span className="text-black ml-2">Aluno</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Criar Conta
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-orange-500 hover:underline">Faça login</Link>
        </div>
      </div>
    </div>
  );
}
