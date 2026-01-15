import { Creneau } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  ClubDetail: { clubId: number };
  AboutClub: { clubId: number };
  CreneauDetails: { creneau: Creneau };
  NewsDetail: { newsId: number };
  EditProfile: undefined;
  Settings: undefined;
  NotificationsSettings: undefined;
  PasswordSettings: undefined;
  Privacy: undefined;
  Help: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Matchs: undefined;
  News: undefined;
  Profile: undefined;
};

// For useNavigation hooks
declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
