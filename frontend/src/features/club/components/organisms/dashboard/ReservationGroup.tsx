
import ReservationCard from "../../../../../shared/components/molecules/ReservationCard";
import { Reservation } from "../../../../../shared/types";

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
          <ReservationCard key={res.id} reservation={res} role="club" />
        ))}
      </div>
    </section>
  );
};

export default ReservationGroup;
