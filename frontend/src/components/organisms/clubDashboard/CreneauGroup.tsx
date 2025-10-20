// src/components/organisms/clubDashboard/CreneauGroup.tsx
import React, { useState } from 'react';
import { Creneau } from '../../../types';
import CreneauCard from '../../molecules/CreneauCard';
import './CreneauGroup.css'; // Import the CSS file

interface Props {
  titre: string;
  creneaux: Creneau[];
  UpdateCreneaux?: () => void;
}

const CreneauGroup: React.FC<Props> = ({ titre, creneaux, UpdateCreneaux }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="creneau-group">
      <button
        onClick={() => setVisible(!visible)}
        className={`dropdown-button ${visible ? 'open' : ''}`}
      >
        <span className="dropdown-icon">▶</span>
        <span>{titre}</span>
        <span className="creneau-count">{creneaux.length}</span>
      </button>

      {visible && (
        <div className="dropdown-content">
          <div className="creneau-list">
            {creneaux.map((c) => (
              <CreneauCard
                key={c.id}
                creneau={c}
                role="club"
                onUpdate={UpdateCreneaux}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreneauGroup;