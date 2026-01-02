'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { WEEKS_DATA } from '@/lib/program-data';

function TheoryPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAttempts();
    }
  }, [user]);

  const loadAttempts = async () => {
    const { data } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    setAttempts(data || []);
    setLoading(false);
  };

  const getLatestAttempt = (weekId: number) => {
    return attempts.find(a => a.quiz_id === weekId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Théorie & Quiz
          </h1>
          <p className="text-gray-600">
            12 quiz hebdomadaires pour valider tes connaissances de passeur élite
          </p>
        </div>

        <Card className="premium-card bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-bold text-purple-900 mb-2">Format Quiz</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 10 questions par quiz (QCM + Vrai/Faux + Situations)</li>
                <li>• Réponses avec explications détaillées</li>
                <li>• Score minimal 60% pour valider</li>
                <li>• Concepts pro: lecture de jeu, décisions, leadership</li>
              </ul>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#2F6BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEEKS_DATA.map(week => {
              const attempt = getLatestAttempt(week.id);
              const hasPassed = attempt && attempt.score_percent >= 60;

              return (
                <Card key={week.id} className="premium-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="mb-2">Semaine {week.id}</Badge>
                      <h3 className="font-bold text-[#0A1B3D]">{week.theme}</h3>
                    </div>
                    {week.test_week ? (
                      <Trophy className="w-5 h-5 text-orange-500" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-[#2F6BFF]" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    10 questions - Concepts clés et situations de jeu
                  </p>

                  {attempt && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      hasPassed ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {hasPassed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        <p className="text-sm font-medium">
                          Dernier score: {attempt.score_percent.toFixed(0)}%
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(attempt.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}

                  <Link href={`/theory/quiz/${week.id}`}>
                    <Button variant={attempt ? 'outline' : 'default'} className="w-full">
                      {attempt ? 'Refaire le quiz' : 'Faire le quiz'}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <TheoryPage />
    </AuthProvider>
  );
}
