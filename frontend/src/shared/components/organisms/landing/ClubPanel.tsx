import React from 'react';
import ClubInfo from './ClubInfo.tsx';
import Calendar from './Calendar.tsx';
import Notifications from './Notifications.tsx';
import './style/ClubPanel.css';

const ClubPanel = () => {
    return (
        <aside className="club-panel">
            <ClubInfo />
            <Calendar />
            <Notifications />
        </aside>
    );
};

export default ClubPanel;