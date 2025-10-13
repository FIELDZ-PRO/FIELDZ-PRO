import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/forgot-password`,
        { email }, // 👈 body JSON (pas params)
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage(res.data?.message || "✅ Si l'email existe, un lien a été envoyé.");
    } catch (err: any) {
      console.error(err);
      const apiMsg = err?.response?.data?.message;
      setMessage(apiMsg ? `❌ ${apiMsg}` : "❌ Erreur : impossible d'envoyer la demande.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-green-100"
        style={{ minWidth: 340 }}
      >
        <div className="text-center mb-2">
          <div className="text-3xl mb-2 font-bold tracking-tight text-green-600">🎾 FIELDZ</div>
          <div className="text-xl font-semibold mb-2 text-gray-800">Mot de passe oublié</div>
          <p className="text-sm text-gray-500">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 mt-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-green-300"
          disabled={isLoading}
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
        </button>

        {message && (
          <p className={`mt-2 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
