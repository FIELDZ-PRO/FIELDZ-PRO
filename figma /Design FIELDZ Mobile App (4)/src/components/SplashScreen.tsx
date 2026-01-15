import { useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-6 animate-fadeIn">
        {/* Logo Icon */}
        <div className="w-20 h-20 bg-[#05602B] rounded-3xl flex items-center justify-center shadow-sm">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 5L25 15H35L27.5 22.5L30 35L20 27.5L10 35L12.5 22.5L5 15H15L20 5Z"
              fill="white"
            />
          </svg>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-[#0E0E0E] tracking-tight mb-2">FIELDZ</h1>
          <p className="text-[#6B7280] text-sm">Réservez vos terrains en un clic</p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-24 w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#05602B] rounded-full animate-loading"></div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-loading {
          animation: loading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
