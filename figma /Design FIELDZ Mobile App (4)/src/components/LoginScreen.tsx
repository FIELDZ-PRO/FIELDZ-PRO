interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen = ({ onLogin, onNavigateToRegister }: LoginScreenProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-12">
        <div className="w-16 h-16 bg-[#05602B] rounded-2xl flex items-center justify-center mb-8">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 5L25 15H35L27.5 22.5L30 35L20 27.5L10 35L12.5 22.5L5 15H15L20 5Z"
              fill="white"
            />
          </svg>
        </div>
        <h1 className="text-[#0E0E0E] mb-2">Bienvenue</h1>
        <p className="text-[#6B7280]">Connectez-vous pour réserver</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6">
        <div className="space-y-4">
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
          type="button"
          className="text-sm text-[#05602B] mt-4 hover:underline"
        >
          Mot de passe oublié ?
        </button>

        <button
          type="submit"
          className="w-full bg-[#05602B] text-white py-4 rounded-2xl mt-8 hover:bg-[#05602B]/90 transition-all active:scale-[0.98]"
        >
          Se connecter
        </button>

        <div className="flex items-center justify-center mt-6 space-x-1.5">
          <span className="text-[#6B7280] text-sm">Pas encore de compte ?</span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-sm text-[#05602B] hover:underline"
          >
            S'inscrire
          </button>
        </div>
      </form>

      {/* Footer Space */}
      <div className="h-12"></div>
    </div>
  );
};
