import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error("useModal must be used inside a ModalProvider");
    return context;
};
