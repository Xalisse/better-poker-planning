import User from "@/models/user.model";
import Card from "./Card";

interface Props {
  user: User;
  cardValue: string | number | undefined;
  isFlipped: boolean;
}

const BackCard = () => {
  return (
    <div className="flex items-center justify-center rounded-lg w-12 h-20 bg-tertiary">
      🦄
    </div>
  );
};

const EmptyCard = () => {
  return (
    <div className="flex items-center justify-center rounded-lg w-12 h-20 border-2 border-tertiary"></div>
  );
};

export default function UserCard({
  user,
  cardValue,
  isFlipped = false,
}: Props) {
  return (
    <div className="flex flex-col items-center w-fit">
      {isFlipped && <Card value={cardValue || ""} />}
      {!isFlipped && cardValue && <BackCard />}
      {!isFlipped && !cardValue && <EmptyCard />}
      <p>{user.name}</p>
    </div>
  );
}
