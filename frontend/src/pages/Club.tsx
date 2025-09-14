import React from 'react';
import Header from '../components/organisms/HeaderClub';
import Sidebar from '../components/organisms/SideBar';
import MainContent from './VueClub/MainContent';
import ClubPanel from '../components/organisms/ClubPanel';
import { NavigationProvider } from './VueClub/Context/NavigationContext';
import './Club.css';

function Club() {
    return (
        <NavigationProvider>
            <div className="app">
                <Header />
                <div className="app-content">
                    <Sidebar />
                    <MainContent />
                    <ClubPanel />
                </div>
            </div>
        </NavigationProvider>
    );
}

export default Club;