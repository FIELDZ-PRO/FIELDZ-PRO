import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MatchesScreen } from './components/screens/MatchesScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { NewsDetailScreen } from './components/screens/NewsDetailScreen';
import { ClubDetailScreen } from './components/screens/ClubDetailScreen';
import { AboutClubScreen } from './components/screens/AboutClubScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { NotificationsSettingsScreen } from './components/screens/NotificationsSettingsScreen';
import { PasswordSettingsScreen } from './components/screens/PasswordSettingsScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { ReservationModal } from './components/ReservationModal';
import { Toast } from './components/Toast';

type Screen = 'splash' | 'onboarding' | 'welcome' | 'login' | 'register' | 'main' | 'editProfile' | 'settings' | 'notifications' | 'password' | 'privacy' | 'help' | 'newsDetail' | 'aboutClub';
type MainTab = 'home' | 'matches' | 'news' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentReservation, setCurrentReservation] = useState({
    clubName: 'Match Football Hydra',
    terrainName: 'Terrain A',
    date: 'Lundi 23 Décembre 2024',
    time: '18:00 - 19:00',
    price: '500 DA'
  });

  const handleSplashFinish = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('main');
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('welcome');
    setActiveTab('home');
    setSelectedClubId(null);
  };

  const handleViewClub = (clubId: number) => {
    setSelectedClubId(clubId);
  };

  const handleBackToHome = () => {
    setSelectedClubId(null);
  };

  const handleLogoClick = () => {
    setActiveTab('home');
    setSelectedClubId(null);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleReserve = (reservationData: any) => {
    setCurrentReservation(reservationData);
    setShowReservationModal(true);
  };

  const handleConfirmReservation = () => {
    setShowReservationModal(false);
    setShowToast(true);
    setSelectedClubId(null);
    setActiveTab('matches');
  };

  const handleNewsClick = (newsId: number) => {
    setSelectedNewsId(newsId);
    setCurrentScreen('newsDetail');
  };

  const handleBackToNews = () => {
    setSelectedNewsId(null);
    setCurrentScreen('main');
  };

  const handleAboutClub = () => {
    setCurrentScreen('aboutClub');
  };

  const handleBackFromAboutClub = () => {
    setCurrentScreen('main');
  };

  // Render splash screen
  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Render onboarding screen
  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Render welcome screen
  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen 
        onSignUp={() => setCurrentScreen('register')}
        onLogin={() => setCurrentScreen('login')}
      />
    );
  }

  // Render auth screens
  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentScreen('register')}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen 
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  // Render settings/help screens
  if (currentScreen === 'editProfile') {
    return (
      <EditProfileScreen
        onBack={() => setCurrentScreen('main')}
        onSave={(data) => {
          console.log('Profile updated:', data);
          setCurrentScreen('main');
        }}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <SettingsScreen 
        onBack={() => setCurrentScreen('main')}
        onNotifications={() => setCurrentScreen('notifications')}
        onLanguage={() => console.log('Language settings')}
        onPassword={() => setCurrentScreen('password')}
        onPrivacy={() => setCurrentScreen('privacy')}
      />
    );
  }

  if (currentScreen === 'notifications') {
    return <NotificationsSettingsScreen onBack={() => setCurrentScreen('settings')} />;
  }

  if (currentScreen === 'password') {
    return <PasswordSettingsScreen onBack={() => setCurrentScreen('settings')} />;
  }

  if (currentScreen === 'privacy') {
    return <PrivacyScreen onBack={() => setCurrentScreen('settings')} />;
  }

  if (currentScreen === 'help') {
    return <HelpScreen onBack={() => setCurrentScreen('main')} />;
  }

  if (currentScreen === 'newsDetail' && selectedNewsId) {
    return <NewsDetailScreen newsId={selectedNewsId} onBack={handleBackToNews} />;
  }

  if (currentScreen === 'aboutClub' && selectedClubId) {
    return <AboutClubScreen clubId={selectedClubId} onBack={handleBackFromAboutClub} />;
  }

  // Render main app with navigation
  if (currentScreen === 'main' && isAuthenticated) {
    return (
      <div className="relative">
        {/* Toast Notification */}
        <Toast 
          message="✅ Réservation confirmée!"
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
        
        {/* Main Content */}
        {selectedClubId ? (
          <ClubDetailScreen 
            clubId={selectedClubId}
            onBack={handleBackToHome}
            onReserve={handleReserve}
            onAboutClub={handleAboutClub}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen 
                onViewClub={handleViewClub} 
                onLogoClick={handleLogoClick}
                onProfileClick={handleProfileClick}
              />
            )}
            {activeTab === 'matches' && (
              <MatchesScreen />
            )}
            {activeTab === 'news' && (
              <NewsScreen onNewsClick={handleNewsClick} />
            )}
            {activeTab === 'profile' && (
              <ProfileScreen 
                onLogout={handleLogout}
                onEditProfile={() => setCurrentScreen('editProfile')}
                onSettings={() => setCurrentScreen('settings')}
                onHelp={() => setCurrentScreen('help')}
              />
            )}
          </>
        )}

        {/* Bottom Navigation - hidden when viewing club detail */}
        {!selectedClubId && (
          <BottomNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Reservation Modal */}
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          onConfirm={handleConfirmReservation}
          reservationData={currentReservation}
        />
      </div>
    );
  }

  return null;
}

export default App;