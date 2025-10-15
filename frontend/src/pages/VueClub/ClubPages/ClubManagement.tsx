import React, { useEffect, useState } from 'react';
import { Settings, User, MapPin, Mail, Phone, CreditCard, Bell, FileText } from 'lucide-react';
import './style/ClubManagement.css';
import { getClubMe } from '../../../services/ClubService'
import { ClubDto } from '../../../services/ClubService';
const ClubManagementPage = () => {
    const [clubInfo, setClubInfo] = useState<Omit<ClubDto, 'id'>>({
        nom: '',
        ville: '',
        adresse: '',
        telephone: '',
        sports: [],
    });
    const token = localStorage.getItem("token")
    const [notifications, setNotifications] = useState({
        emailReservations: true,
        smsReminders: false,
        weeklyReports: true,
        paymentAlerts: true
    });

    const fetchClubInfo = async () => {
        try {
            const data = await getClubMe();
            console.log(data);
            setClubInfo(data);
        } catch (error) {
            alert("The Recup process for the club's information didn't work")
        }
    }

    useEffect(() => {
        fetchClubInfo();
    }, [token])

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to a backend
        console.log('Saving club info:', clubInfo);
    };

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="club-management-page">
            <div className="page-header">
                <h1>Gestion du club</h1>
                <button
                    className="btn-add btn-primary"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    <Settings size={16} />
                    {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
            </div>

            <div className="management-content">
                <div className="club-info-section2">

                    <div className="info-form">
                        <div className="form-group">
                            <label>
                                <User size={16} />
                                Nom du club
                            </label>
                            <input
                                type="text"
                                value={clubInfo.nom}
                                onChange={(e) => setClubInfo({ ...clubInfo, nom: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <MapPin size={16} />
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={clubInfo.adresse}
                                onChange={(e) => setClubInfo({ ...clubInfo, adresse: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Mail size={16} />
                                Ville
                            </label>
                            <input
                                type="email"
                                value={clubInfo.ville}
                                onChange={(e) => setClubInfo({ ...clubInfo, ville: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Phone size={16} />
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={clubInfo.telephone}
                                onChange={(e) => setClubInfo({ ...clubInfo, telephone: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
};

export default ClubManagementPage;