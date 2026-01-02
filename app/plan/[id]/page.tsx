'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Trophy, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WEEKS_DATA } from '@/lib/program-data';

function WeekDetailPage() {
  const params = useParams();
  const weekId = parseInt(params.id as string);
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const weekData = WEEKS_DATA.find(w => w.id === weekId);

  useEffect(() => {
    if (user && profile) {
      loadWeekData();
    }
  }, [user, profile, weekId]);

  const loadWeekData = async () => {
    const { data: missionsData } = await supabase
      .from('missions')
      .select('*')
      .eq('week_id', weekId)
      .order('day_number');

    setMissions(missionsData || []);

    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user!.id)
      .eq('week_id', weekId);

    setSubmissions(submissionsData || []);
    setLoading(false);
  };

  if (!profile || !weekData) return null;

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link href="/plan">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour au plan
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2">Semaine {weekId} / 12</Badge>
              <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
                {weekData.theme}
              </h1>
              {weekData.test_week && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Trophy className="w-3 h-3 mr-1" />
                  Test majeur
                </Badge>
              )}
            </div>
            <Calendar className="w-8 h-8 text-[#2F6BFF]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="premium-card">
            <h3 className="font-bold text-[#0A1B3D] mb-2">Objectifs</h3>
            <p className="text-sm text-gray-700">{weekData.objectives}</p>
          </Card>

          <Card className="premium-card">
            <h3 className="font-bold text-[#0A1B3D] mb-2">Métriques de réussite</h3>
            <p className="text-sm text-gray-700">{weekData.success_metrics}</p>
          </Card>
        </div>

        <Card className="premium-card">
          <h3 className="font-bold text-[#0A1B3D] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Missions de la semaine
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-[#2F6BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {days.map(day => {
                const mission = missions.find(m => m.day_number === day);
                const submission = submissions.find(s => s.day_number === day);
                const isRest = day === 7;

                return (
                  <div
                    key={day}
                    className={`p-4 rounded-lg border-2 ${
                      submission ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    } ${isRest ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${
                          isRest ? 'bg-blue-500' : submission ? 'bg-green-500' : 'bg-gray-300'
                        } text-white flex items-center justify-center font-bold`}>
                          {day}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0A1B3D]">
                            {isRest ? 'Dimanche Repos' : mission?.title || `Jour ${day}`}
                          </h4>
                          {mission && !isRest && (
                            <p className="text-sm text-gray-600">
                              Durée: {mission.duration_min} min
                            </p>
                          )}
                          {isRest && (
                            <p className="text-sm text-gray-600">
                              Récupération active + mobilité
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {submission && (
                          <div className="text-right">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {submission.score_0_100?.toFixed(0)}/100
                            </Badge>
                          </div>
                        )}
                        {!isRest && mission && (
                          <Link href="/today">
                            <Button size="sm" variant="outline">
                              Voir mission
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {mission?.notes && !isRest && (
                      <p className="mt-2 text-sm text-gray-600 ml-14">
                        💡 {mission.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="premium-card bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-2">Quiz de la semaine</h3>
              <p className="text-sm text-purple-800 mb-4">
                Valide tes connaissances avec le quiz hebdomadaire (10 questions)
              </p>
              <Link href={`/theory/quiz/${weekId}`}>
                <Button variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-100">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Faire le quiz S{weekId}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <WeekDetailPage />
    </AuthProvider>
  );
}
