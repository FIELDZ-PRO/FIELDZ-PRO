import React from "react";
import { useNavigation } from "./Context/NavigationContext";
import Dashboard from "../../components/organisms/dashboard/Dashboard";
import TerrainsPage from "./ClubPages/TerrainsPage";
import ReservationsPage from "./ClubPages/ReservationsPage";
import FacturationPage from "./ClubPages/FacturationPage";
import ClubManagementPage from "./ClubPages/ClubManagement";
import { CreateReservationPage } from "./ClubPages/CreateReservation";
import { useAuth } from "../../../../shared/context/AuthContext";

const AccueilClub = () => {
  const { activeItem } = useNavigation();
  const { token } = useAuth(); // ⬅️ pour la key de remount

  const renderContent = () => {
    switch (activeItem) {
      case "accueil":
        return <Dashboard />;
      case "terrains":
        return <TerrainsPage />;
      case "reservations":
        return <ReservationsPage />;
      case "club":
        return <ClubManagementPage />;
      case "createReservation":
        // ⬅️ remonte le composant quand le token devient dispo pour éviter les appels avec Bearer null
        return <CreateReservationPage key={token ?? "no-token"} />;
      default:
        return <Dashboard />;
    }
  };

  return renderContent();
};

export default AccueilClub;
