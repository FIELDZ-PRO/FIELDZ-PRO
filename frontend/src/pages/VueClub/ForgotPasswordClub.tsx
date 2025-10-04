import "./ForgotPasswordClub.css"
import { useNavigate } from "react-router-dom"
export const ForgotPasswordPageCLub = () => {

    const onNavigate = useNavigate()
    return (
        <div className="container">
            <div className="card-login">
                <div className="icon-container">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>

                <h1 className="title">Mot de passe oublié ?</h1>
                <p className="description">
                    Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <div id="success-message" className="success-message">
                    <strong>Email envoyé !</strong><br />
                    Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et vos spams.
                </div>

                <form id="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">Adresse email</label>
                        <input type="email" id="email" placeholder="vous@exemple.com" required />
                    </div>
                    <button type="submit" className="btn">Envoyer le lien de réinitialisation</button>
                </form>

                <div className="back-link" onClick={() => onNavigate("/LoginCLub")}>
                    <a href="#">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Retour à la connexion
                    </a>
                </div>
            </div>
        </div>
    )
}