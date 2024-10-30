import GameForm from "@/components/GameForm";

export default function AddGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Add New Game</h1>
      <div className="max-w-2xl mx-auto">
        <GameForm />
      </div>
    </div>
  );
} 