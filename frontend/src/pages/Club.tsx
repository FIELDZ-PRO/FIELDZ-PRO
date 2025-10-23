import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/HeaderClub';
import Sidebar from '../components/organisms/SideBar';
import MainContent from './VueClub/MainContent';
import { NavigationProvider } from './VueClub/Context/NavigationContext';
import { ModalProvider, useModal } from '../context/ModalContext';
import './Club.css';
import { isTokenValid } from '../services/ClubService';

function ClubLayout() {
    const { isModalOpen } = useModal();

    return (
        <div className="app">
            {/* Wrap header for blur */}
            <div className={`header-wrapper ${isModalOpen ? 'blurred' : ''}`}>
                <Header />
            </div>

            <div className="app-content">
                <Sidebar />
                <MainContent />
            </div>
        </div>
    );
}

function Club() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isTokenValid(token)) navigate('/LoginClub');
    }, [token]);

    return (
        <NavigationProvider>
            <ModalProvider>
                <ClubLayout />
            </ModalProvider>
        </NavigationProvider>
    );
}

export default Club;
