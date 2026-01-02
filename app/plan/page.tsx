'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { WEEKS_DATA, getCurrentWeekAndDay } from '@/lib/program-data';

function PlanPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const { week: currentWeek } = getCurrentWeekAndDay(profile.start_date);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Plan 12 Semaines
          </h1>
          <p className="text-gray-600">
            Programme complet de développement du passeur élite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEEKS_DATA.map((week) => {
            const isPast = week.id < currentWeek;
            const isCurrent = week.id === currentWeek;
            const isFuture = week.id > currentWeek;

            return (
              <Card
                key={week.id}
                className={`premium-card relative overflow-hidden ${
                  isCurrent ? 'border-2 border-[#2F6BFF]' : ''
                } ${isPast ? 'opacity-75' : ''}`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-[#2F6BFF] text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    EN COURS
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A1B3D] to-[#2F6BFF] text-white flex items-center justify-center font-bold text-lg">
                      S{week.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A1B3D]">{week.theme}</h3>
                      {isPast && (
                        <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Complétée
                        </Badge>
                      )}
                      {isFuture && (
                        <Badge variant="outline" className="mt-1 text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          À venir
                        </Badge>
                      )}
                    </div>
                  </div>
                  {week.test_week && (
                    <Trophy className="w-5 h-5 text-orange-500" />
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Objectifs</p>
                    <p className="text-sm text-gray-700">{week.objectives}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Métriques de réussite</p>
                    <p className="text-sm text-gray-700">{week.success_metrics}</p>
                  </div>
                </div>

                {week.test_week && (
                  <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs font-bold text-orange-800">
                      🏆 TEST MAJEUR cette semaine
                    </p>
                  </div>
                )}

                <Link href={`/plan/${week.id}`}>
                  <Button
                    variant={isCurrent ? 'default' : 'outline'}
                    className="w-full"
                    disabled={isFuture && week.id > currentWeek + 1}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Voir la semaine
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <Card className="premium-card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Trophy className="w-6 h-6 text-[#2F6BFF]" />
            <div>
              <h3 className="font-bold text-[#0A1B3D] mb-2">Règle GOAT</h3>
              <p className="text-sm text-gray-700">
                Discipline absolue. 6 jours par semaine. Preuve obligatoire. Score &lt;70 = séance corrective automatique.
                Aucune excuse. Tests majeurs S1, S4, S8, S12 pour valider ta progression.
              </p>
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
      <PlanPage />
    </AuthProvider>
  );
}
