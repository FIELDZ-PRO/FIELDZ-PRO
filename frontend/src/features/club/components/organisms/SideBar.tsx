import { NavigationItem, useNavigation } from '../../pages/VueClub/Context/NavigationContext'
import { Home, MapPin, Calendar, FileText, Settings, Clock } from 'lucide-react';
import './style/SideBar.css';

const Sidebar = () => {
    const { activeItem, setActiveItem } = useNavigation();

    const menuItems: { id: NavigationItem; label: string; icon: any }[] = [
        { id: 'accueil' as NavigationItem, label: 'Accueil', icon: Home },
        { id: 'terrains' as NavigationItem, label: 'Gestion des terrains', icon: MapPin },
        { id: 'createReservation' as NavigationItem, label: 'Gestion des créneaux', icon: Clock },
        { id: 'reservations' as NavigationItem, label: 'Gestion des réservations', icon: Calendar },
        { id: 'club' as NavigationItem, label: 'Paramètres des clubs', icon: Settings },

    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => setActiveItem(item.id)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;