import React from 'react';
import CreneauForm from '../../molecules/CreneauForm';

interface CreneauFormSectionProps {
  terrains: { id: number; nomTerrain: string }[];
  onSubmit: (data: any) => void;
}

const CreneauFormSection: React.FC<CreneauFormSectionProps> = ({ terrains, onSubmit }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">🕓 Proposer un créneau</h2>
      <CreneauForm terrains={terrains} onSubmit={onSubmit} />
    </section>
  );
};

export default CreneauFormSection;
