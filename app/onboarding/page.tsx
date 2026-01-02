'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';

function OnboardingPage() {
  const { user, refreshProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    dominant_hand: 'Droite',
    mode_default: 'Maison' as 'Maison' | 'Gym',
    days_per_week: 6,
  });

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          age: parseInt(formData.age),
          dominant_hand: formData.dominant_hand,
          mode_default: formData.mode_default,
          days_per_week: formData.days_per_week,
          start_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Profil configuré',
        description: 'C\'est parti pour 12 semaines d\'excellence',
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2F6BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 premium-card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Configuration Initiale
          </h1>
          <p className="text-gray-600">
            Étape {step} / 2
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="15"
                required
                min="10"
                max="25"
              />
            </div>

            <div>
              <Label>Main dominante</Label>
              <RadioGroup
                value={formData.dominant_hand}
                onValueChange={(value) => setFormData({ ...formData, dominant_hand: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Droite" id="droite" />
                  <Label htmlFor="droite" className="font-normal cursor-pointer">
                    Droite
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Gauche" id="gauche" />
                  <Label htmlFor="gauche" className="font-normal cursor-pointer">
                    Gauche
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Suivant <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Mode d'entraînement principal</Label>
              <RadioGroup
                value={formData.mode_default}
                onValueChange={(value: 'Maison' | 'Gym') => setFormData({ ...formData, mode_default: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Maison" id="maison" />
                  <Label htmlFor="maison" className="font-normal cursor-pointer">
                    Maison (mur, élastiques)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Gym" id="gym" />
                  <Label htmlFor="gym" className="font-normal cursor-pointer">
                    Gym (accès terrain)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="days">Jours par semaine</Label>
              <Select
                value={formData.days_per_week.toString()}
                onValueChange={(value) => setFormData({ ...formData, days_per_week: parseInt(value) })}
              >
                <SelectTrigger id="days">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 jours</SelectItem>
                  <SelectItem value="6">6 jours</SelectItem>
                  <SelectItem value="7">7 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-[#0A1B3D] font-medium mb-1">
                Règle GOAT
              </p>
              <p className="text-sm text-gray-600">
                Discipline absolue. Preuve obligatoire. Score &lt;70 = séance corrective automatique. Aucune excuse.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? 'Configuration...' : 'Commencer le programme'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <OnboardingPage />
    </AuthProvider>
  );
}
