import React from 'react';
import { ChevronDown } from 'lucide-react';
import './style/HeaderClub.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <span className="logo-text">FieldZ</span>
                </div>
                <div className="header-right">
                    <div className="language-selector">
                        <span>Français</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;