import GameForm from "@/components/GameForm";

export default function AddGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <a href="/" className="text-sm hover:text-accent">&#8592; Back to Home</a>
      
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center mb-8">Add New Game</h1>
        
        <div className="bg-primary p-6 rounded-xl border border-accent-secondary">
          <GameForm />
        </div>
      </div>
    </div>
  );
} 