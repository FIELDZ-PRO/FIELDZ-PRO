import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../../shared/context/AuthContext';
import CustomAlert, { AlertType } from '../../../shared/components/atoms/CustomAlert';
import '../pages/style/EmailVerification.css';

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

type JwtPayload = { role?: "JOUEUR" | "CLUB" | "ADMIN" | string };

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({ show: false, type: 'info', message: '' });
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    setAlertState({ show: true, type, message });
  };

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);

    // Focus last filled input or first empty
    const nextEmptyIndex = newCode.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = code.join('');

    if (otpCode.length !== 6) {
      showAlert('warning', 'Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Verify OTP code
      const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: otpCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.verified === 'true') {
        showAlert('success', 'Email vérifié ! Création de votre compte...');

        // Step 2: Register the user (now that email is verified)
        try {
          const registerResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nom: location.state?.nom,
              prenom: location.state?.prenom,
              email: location.state?.email,
              motDePasse: location.state?.password,
              telephone: location.state?.telephone,
              role: location.state?.role || 'JOUEUR',
              adresse: location.state?.adresse || '',
              nomClub: location.state?.nomClub || ''
            }),
          });

          if (!registerResponse.ok) {
            const registerError = await registerResponse.json();
            throw new Error(registerError.message || 'Erreur lors de l\'inscription');
          }

          // Step 3: Login the user
          setTimeout(async () => {
            try {
              const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({
                  email: location.state?.email,
                  motDePasse: location.state?.password,
                }),
              });

              if (loginResponse.ok) {
                const loginData = await loginResponse.json();

                // Use AuthContext login function
                const token = loginData.token ?? loginData.accessToken;
                if (token) {
                  login(token, { remember: false });

                  // Decode role from JWT
                  const role = jwtDecode<JwtPayload>(token)?.role;

                  // Redirect based on role
                  if (role === 'CLUB') {
                    navigate('/AccueilClub');
                  } else if (role === 'JOUEUR') {
                    navigate('/joueur');
                  } else if (role === 'ADMIN') {
                    navigate('/admin');
                  } else {
                    navigate('/');
                  }
                } else {
                  throw new Error('Token manquant dans la réponse');
                }
              } else {
                // If auto-login fails, redirect to login
                showAlert('success', 'Compte créé ! Veuillez vous connecter');
                setTimeout(() => navigate('/login'), 2000);
              }
            } catch (error) {
              console.error('Auto-login error:', error);
              showAlert('success', 'Compte créé ! Veuillez vous connecter');
              setTimeout(() => navigate('/login'), 2000);
            }
          }, 1500);
        } catch (registerError: any) {
          console.error('Registration error:', registerError);
          showAlert('error', registerError.message || 'Erreur lors de l\'inscription');
          setIsLoading(false);
        }
      } else {
        showAlert('error', verifyData.message || 'Code invalide ou expiré');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      showAlert('error', 'Erreur lors de la vérification');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/otp/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', data.message || 'Code renvoyé avec succès');
        setCode(['', '', '', '', '', '']);
        setCountdown(60);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        showAlert('error', data.message || 'Erreur lors du renvoi du code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showAlert('error', 'Erreur lors du renvoi du code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="email-verification">
      <div className="email-verification__container">
        <button
          className="email-verification__back"
          onClick={() => navigate('/register')}
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="email-verification__icon">
          <Mail size={48} />
        </div>

        <h1 className="email-verification__title">Vérifiez votre email</h1>
        <p className="email-verification__subtitle">
          Nous avons envoyé un code de vérification à
          <br />
          <strong>{email}</strong>
        </p>

        <div className="email-verification__code-inputs" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="email-verification__code-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          className="email-verification__verify-btn"
          onClick={handleVerify}
          disabled={isLoading || code.some(d => !d)}
        >
          {isLoading ? 'Vérification...' : 'Vérifier'}
        </button>

        <div className="email-verification__resend">
          {!canResend ? (
            <p>
              Renvoyer le code dans <strong>{countdown}s</strong>
            </p>
          ) : (
            <button
              className="email-verification__resend-btn"
              onClick={handleResend}
              disabled={isResending}
            >
              <RefreshCw size={16} />
              {isResending ? 'Envoi...' : 'Renvoyer le code'}
            </button>
          )}
        </div>
      </div>

      {alertState.show && (
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          onClose={() => setAlertState({ ...alertState, show: false })}
          duration={5000}
        />
      )}
    </div>
  );
};

export default EmailVerification;
