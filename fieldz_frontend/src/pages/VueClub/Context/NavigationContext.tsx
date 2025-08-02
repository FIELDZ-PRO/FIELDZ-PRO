import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationItem = 'accueil' | 'terrains' | 'reservations' | 'facturation' | 'club';

interface NavigationContextType {
    activeItem: NavigationItem;
    setActiveItem: (item: NavigationItem) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const [activeItem, setActiveItem] = useState<NavigationItem>('accueil');

    return (
        <NavigationContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </NavigationContext.Provider>
    );
};