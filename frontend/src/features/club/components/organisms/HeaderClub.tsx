import React from 'react';
import { ChevronDown } from 'lucide-react';
import './style/HeaderClub.css';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    const deconnectClub = () => {
        localStorage.removeItem('token')
        navigate("/LoginClub")
    }

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <div className="logo">
                        <span className="logo-text">FieldZ</span>
                    </div>

                </div>

                <div className="header-right">
                    <button className="logout-button" onClick={deconnectClub}>Déconnexion</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
