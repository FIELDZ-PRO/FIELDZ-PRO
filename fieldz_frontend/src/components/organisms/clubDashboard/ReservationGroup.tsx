
import ReservationCard from '../../molecules/ReservationCard';
import { Reservation } from '../../../types';

type Props = {
  titre: string;
  reservations: Reservation[];
};

const ReservationGroup: React.FC<Props> = ({ titre, reservations }) => {
  if (reservations.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{titre}</h2>
      <div className="space-y-2">
        {reservations.map(res => (
          <ReservationCard key={res.id} reservation={res} />
        ))}
      </div>
    </section>
  );
};

export default ReservationGroup;
