import './MailSent.css'
import { useNavigate } from 'react-router-dom'
export const MailSent = () => {

    const onNavigate = useNavigate();

    return (
        <div className="auth-container">
            <div id="success-toast" className="success-toast">
                ✓ Email renvoyé avec succès !
            </div>

            <div className="container">
                <div className="card-login">
                    <div className="icon-container">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                            <path d="M9 19l3-3 3 3" strokeWidth="2.5" />
                        </svg>
                    </div>

                    <h1 className="title">Email envoyé !</h1>
                    <p className="description">
                        Veuillez regarder votre boîte mail. Un lien de réinitialisation a été envoyé à :
                    </p>

                    <div className="email-display" id="user-email">
                        exemple@email.com
                    </div>

                    <div className="info-box">
                        <p><strong>💡 Conseil :</strong></p>
                        <p>• Vérifiez également votre dossier spam/courrier indésirable</p>
                        <p>• Le lien expirera dans 24 heures</p>
                        <p>• Si vous ne recevez rien, réessayez ci-dessous</p>
                    </div>

                    <div className="resend-text">
                        Vous n'avez pas reçu l'email ?
                    </div>
                    <button id="resend-btn" className="resend-btn">
                        Renvoyer le lien de réinitialisation
                    </button>
                    <div id="timer" className="timer"></div>

                    <div className="back-link" onClick={() => onNavigate("/LoginClub")}>
                        <a href="login.html">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Retour à la connexion
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}