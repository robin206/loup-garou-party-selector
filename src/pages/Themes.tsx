
import React from 'react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Card from '@/components/Card';

const Themes: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto pt-24 pb-24 px-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Thèmes</h1>
          <Button variant="outline" onClick={handleBack} size="sm">
            Retour
          </Button>
        </div>
        
        <Card className="mb-4">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Thèmes disponibles</h2>
            <p className="text-gray-500">
              Les thèmes seront disponibles prochainement.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Themes;
