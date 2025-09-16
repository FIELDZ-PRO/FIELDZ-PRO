import React from 'react';
import { useNavigation } from './Context/NavigationContext';
import Dashboard from '../../components/organisms/Dashboard/Dashboard';
import TerrainsPage from './ClubPages/TerrainsPage';
import ReservationsPage from './ClubPages/ReservationsPage';
import FacturationPage from './ClubPages/FacturationPage';
import ClubManagementPage from './ClubPages/ClubManagement';

const AccueilClub = () => {
    const { activeItem } = useNavigation();

    const renderContent = () => {
        switch (activeItem) {
            case 'accueil':
                return <Dashboard />;
            case 'terrains':
                return <TerrainsPage />;
            case 'reservations':
                return <ReservationsPage />;
            case 'facturation':
                return <FacturationPage />;
            case 'club':
                return <ClubManagementPage />;
            default:
                return <Dashboard />;
        }
    };

    return renderContent();
};

export default AccueilClub;