import React from 'react';
import CreneauForm from '../../molecules/CreneauForm';

interface CreneauFormSectionProps {
  terrains: { id: number; nomTerrain: string }[];
  onSubmit: (data: any) => void;
}
const CreneauFormSection: React.FC<CreneauFormSectionProps> = ({ terrains, onSubmit }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-all hover:shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Proposer un créneau
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Remplissez le formulaire ci-dessous pour proposer un créneau disponible pour vos terrains.
      </p>
      <CreneauForm terrains={terrains} onSubmit={onSubmit} />
    </section>
  );
};

export default CreneauFormSection;
