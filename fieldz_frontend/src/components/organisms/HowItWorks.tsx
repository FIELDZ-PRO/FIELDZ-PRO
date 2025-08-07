import React from 'react'
import { Search, MapPin, Calendar } from 'lucide-react'
import StepItem from '../atoms/StepItem'
import './style/HowItWorks.css'

const steps = [
  {
    icon: <Search size={24} />,
    number: '01',
    title: 'Choisis ton sport',
    description: 'Sélectionne le sport que tu veux pratiquer parmi notre large sélection.',
  },
  {
    icon: <MapPin size={24} />,
    number: '02',
    title: 'Indique ta ville',
    description: 'Trouve les terrains disponibles dans ta ville ou aux alentours.',
  },
  {
    icon: <Calendar size={24} />,
    number: '03',
    title: 'Réserve ton terrain',
    description: 'Choisis ton créneau et confirme ta réservation en un clic.',
  },
]

const HowItWorksSection: React.FC = () => (
  <section className="how-it-works">
    <h2 className="how-it-works__heading">Comment ça marche ?</h2>
    <p className="how-it-works__subheading">
      Réserver ton terrain n’a jamais été aussi simple. Suis ces 3 étapes faciles.
    </p>
    <div className="how-it-works__steps">
      {steps.map(s => (
        <StepItem
          key={s.number}
          icon={s.icon}
          number={s.number}
          title={s.title}
          description={s.description}
        />
      ))}
    </div>
  </section>
)

export default HowItWorksSection
