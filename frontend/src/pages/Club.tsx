import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/HeaderClub';
import Sidebar from '../components/organisms/SideBar';
import MainContent from './VueClub/MainContent';
import ClubPanel from '../components/organisms/ClubPanel';
import { NavigationProvider } from './VueClub/Context/NavigationContext';
import './Club.css';
import { isTokenValid } from '../services/ClubService';
function Club() {
    const token = localStorage.getItem("token")
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Checkin the token for the club")
        if (!isTokenValid(token)) {
            console.log("Navigatin")

            navigate('/')
        }
    }, [token])


    return (
        <NavigationProvider>
            <div className="app">
                <Header />
                <div className="app-content">
                    <Sidebar />
                    <MainContent />
                </div>
            </div>
        </NavigationProvider>
    );
}

export default Club;