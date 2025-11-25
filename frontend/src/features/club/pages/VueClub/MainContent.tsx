import React from 'react';
import { useNavigation } from './Context/NavigationContext';
import Dashboard from '../../components/organisms/dashboard/Dashboard';
import TerrainsPage from './ClubPages/TerrainsPage';
import ReservationsPage from './ClubPages/ReservationsPage';
import FacturationPage from './ClubPages/FacturationPage';
import ClubManagementPage from './ClubPages/ClubManagement';
import { CreateReservationPage } from './ClubPages/CreateReservation';

interface MainContentProps {
    setIsBlurred: (value: boolean) => void;
}

const MainContent = () => {
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
                return <CreateReservationPage />;
            default:
                return <Dashboard />;
        }
    };

    return renderContent();
};

export default MainContent;
