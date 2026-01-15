interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen = ({ onRegister, onNavigateToLogin }: RegisterScreenProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-12">
        <button
          onClick={onNavigateToLogin}
          className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center mb-8 hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 16L6 10L12 4"
              stroke="#0E0E0E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-[#0E0E0E] mb-2">Créer un compte</h1>
        <p className="text-[#6B7280]">Rejoignez FIELDZ aujourd'hui</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Nom complet</label>
            <input
              type="text"
              placeholder="Jean Dupont"
              className="w-full px-4 py-3.5 bg-[#F9FAFB] border-0 rounded-2xl text-[#0E0E0E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#05602B]/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-3.5 bg-[#F9FAFB] border-0 rounded-2xl text-[#0E0E0E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#05602B]/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Téléphone</label>
            <input
              type="tel"
              placeholder="+213 XXX XX XX XX"
              className="w-full px-4 py-3.5 bg-[#F9FAFB] border-0 rounded-2xl text-[#0E0E0E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#05602B]/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-[#F9FAFB] border-0 rounded-2xl text-[#0E0E0E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#05602B]/20 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#05602B] text-white py-4 rounded-2xl mt-8 hover:bg-[#05602B]/90 transition-all active:scale-[0.98]"
        >
          Créer mon compte
        </button>

        <p className="text-xs text-[#6B7280] text-center mt-6 leading-relaxed">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
        </p>
      </form>

      {/* Footer Space */}
      <div className="h-12"></div>
    </div>
  );
};
