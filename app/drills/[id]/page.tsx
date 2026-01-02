'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function DrillDetailPage() {
  const params = useParams();
  const drillId = params.id as string;
  const [drill, setDrill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrill();
  }, [drillId]);

  const loadDrill = async () => {
    const { data } = await supabase
      .from('drills')
      .select('*')
      .eq('id', drillId)
      .maybeSingle();

    setDrill(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#2F6BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </AppLayout>
    );
  }

  if (!drill) {
    return (
      <AppLayout>
        <Card className="premium-card">
          <p className="text-center text-gray-600">Exercice non trouvé</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link href="/drills">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour exercices
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2">{drill.id}</Badge>
              <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
                {drill.name}
              </h1>
              <Badge variant="outline">{drill.category}</Badge>
            </div>
            <Target className="w-8 h-8 text-[#2F6BFF]" />
          </div>
        </div>

        <Card className="premium-card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-[#2F6BFF]" />
            <div>
              <h3 className="font-bold text-[#0A1B3D] mb-2">Objectif</h3>
              <p className="text-gray-700">{drill.goal}</p>
            </div>
          </div>
        </Card>

        {drill.equipment && (
          <Card className="premium-card">
            <h3 className="font-bold text-[#0A1B3D] mb-2">Équipement requis</h3>
            <p className="text-gray-700">{drill.equipment}</p>
          </Card>
        )}

        <Card className="premium-card">
          <h3 className="font-bold text-[#0A1B3D] mb-3">Comment faire</h3>
          <p className="text-gray-700 whitespace-pre-line">{drill.how_to}</p>
        </Card>

        {drill.reps && (
          <Card className="premium-card border-2 border-[#2F6BFF]">
            <h3 className="font-bold text-[#0A1B3D] mb-2">Répétitions</h3>
            <p className="text-lg font-medium text-[#2F6BFF]">{drill.reps}</p>
          </Card>
        )}

        {drill.focus && (
          <Card className="premium-card bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">Points de focus</h3>
                <p className="text-green-800">{drill.focus}</p>
              </div>
            </div>
          </Card>
        )}

        {drill.common_mistakes && (
          <Card className="premium-card bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">Erreurs fréquentes à éviter</h3>
                <p className="text-orange-800">{drill.common_mistakes}</p>
              </div>
            </div>
          </Card>
        )}

        {drill.level && (
          <Card className="premium-card">
            <h3 className="font-bold text-[#0A1B3D] mb-2">Niveau & Progression</h3>
            <p className="text-gray-700">{drill.level}</p>
          </Card>
        )}

        {drill.mode_tags && drill.mode_tags.length > 0 && (
          <Card className="premium-card">
            <h3 className="font-bold text-[#0A1B3D] mb-3">Modes d\'entraînement</h3>
            <div className="flex gap-2 flex-wrap">
              {drill.mode_tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <DrillDetailPage />
    </AuthProvider>
  );
}
