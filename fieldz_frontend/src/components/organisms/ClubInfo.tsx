import React from 'react';
import './style/ClubInfo.css';

const ClubInfo = () => {
    return (
        <div className="club-info">
            <h3>Gestion du compte club</h3>

            <div className="club-field">
                <label>Nom du club</label>
                <input type="text" value="Club Sportif" readOnly />
            </div>

            <div className="club-field">
                <label>Adresse</label>
                <input type="text" value="12a Rue du Stade, Paris" readOnly />
            </div>

            <div className="club-field">
                <label>Contact</label>
                <input type="text" value="contact@clubsportif.fr" readOnly />
            </div>

            <div className="club-field">
                <label>Sports proposés</label>
                <input type="text" value="Padel, Foot" readOnly />
            </div>
        </div>
    );
};

export default ClubInfo;