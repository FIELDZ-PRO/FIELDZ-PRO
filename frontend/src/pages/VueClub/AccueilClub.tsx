import React from 'react';
import { useNavigation } from './Context/NavigationContext';
import Dashboard from '../../components/organisms/Dashboard/Dashboard';
import TerrainsPage from './ClubPages/TerrainsPage';
import ReservationsPage from './ClubPages/ReservationsPage';
import FacturationPage from './ClubPages/FacturationPage';
import ClubManagementPage from './ClubPages/ClubManagement';
import { CreateReservationPage } from './ClubPages/CreateReservation';

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
            case 'club':
                return <ClubManagementPage />;
            case 'createReservation':
                return <CreateReservationPage />
            default:
                return <Dashboard />;
        }
    };

    return renderContent();
};

export default AccueilClub;