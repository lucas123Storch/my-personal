import admin from '@/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { uid, role } = req.body;

    try {
      await admin.auth().setCustomUserClaims(uid, { [role]: true });
      res.status(200).json({ message: "Claims definidas com sucesso." });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro desconhecido" });
      }
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
