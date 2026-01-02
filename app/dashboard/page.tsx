'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getScoreColor } from '@/lib/scoring';

function DashboardPage() {
  const { user, profile } = useAuth();
  const [todayMission, setTodayMission] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      loadDashboardData();
    }
  }, [user, profile]);

  const loadDashboardData = async () => {
    try {
      const startDate = new Date(profile!.start_date);
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const week = Math.min(Math.floor(daysSinceStart / 7) + 1, 12);
      const dayInWeek = (daysSinceStart % 7) + 1;

      setCurrentWeek(week);

      const { data: weekInfo } = await supabase
        .from('weeks')
        .select('*')
        .eq('id', week)
        .maybeSingle();

      setWeekData(weekInfo);

      const { data: mission } = await supabase
        .from('missions')
        .select('*')
        .eq('week_id', week)
        .eq('day_number', dayInWeek)
        .maybeSingle();

      setTodayMission(mission);

      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(7);

      setRecentSubmissions(submissions || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return null;
  }

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

  const avgScore = recentSubmissions.length > 0
    ? recentSubmissions.reduce((sum, s) => sum + (s.score_0_100 || 0), 0) / recentSubmissions.length
    : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Semaine {currentWeek} / 12 — {weekData?.theme}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="premium-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Streak</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-4xl font-bold text-[#0A1B3D]">
              {profile.streak}
            </p>
            <p className="text-sm text-gray-500 mt-1">jours consécutifs</p>
          </Card>

          <Card className="premium-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Score Moyen (7j)</span>
              <TrendingUp className="w-5 h-5 text-[#2F6BFF]" />
            </div>
            <p className={`text-4xl font-bold ${getScoreColor(avgScore)}`}>
              {avgScore.toFixed(0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">/ 100</p>
          </Card>

          <Card className="premium-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Progression</span>
              <Trophy className="w-5 h-5 text-[#2F6BFF]" />
            </div>
            <p className="text-4xl font-bold text-[#0A1B3D]">
              {currentWeek}
            </p>
            <p className="text-sm text-gray-500 mt-1">/ 12 semaines</p>
          </Card>
        </div>

        {todayMission && (
          <Card className="premium-card border-2 border-[#2F6BFF]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2">Mission du Jour</Badge>
                <h2 className="text-2xl font-bold text-[#0A1B3D]">
                  {todayMission.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  Durée: {todayMission.duration_min} minutes
                </p>
              </div>
              <Target className="w-8 h-8 text-[#2F6BFF]" />
            </div>

            {todayMission.notes && (
              <p className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                {todayMission.notes}
              </p>
            )}

            <Link href="/today">
              <Button className="w-full">
                Commencer la mission
              </Button>
            </Link>
          </Card>
        )}

        <Card className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0A1B3D]">
              Semaine {currentWeek}: {weekData?.theme}
            </h3>
            <Calendar className="w-5 h-5 text-[#2F6BFF]" />
          </div>

          {weekData?.objectives_text && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Objectifs:</p>
              <p className="text-sm text-gray-600">{weekData.objectives_text}</p>
            </div>
          )}

          {weekData?.major_test_flag && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-bold text-orange-800">
                ⚠️ TEST MAJEUR cette semaine
              </p>
            </div>
          )}

          <Link href={`/week/${currentWeek}`}>
            <Button variant="outline" className="w-full mt-4">
              Voir le détail de la semaine
            </Button>
          </Link>
        </Card>

        {recentSubmissions.length > 0 && (
          <Card className="premium-card">
            <h3 className="text-lg font-bold text-[#0A1B3D] mb-4">
              Dernières Séances
            </h3>
            <div className="space-y-3">
              {recentSubmissions.slice(0, 5).map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      S{submission.week_id} Jour {submission.day_number}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {submission.score_0_100 !== null && (
                      <p className={`text-lg font-bold ${getScoreColor(submission.score_0_100)}`}>
                        {submission.score_0_100.toFixed(0)}
                      </p>
                    )}
                    {submission.proof_url ? (
                      <Badge variant="outline" className="text-xs">✓ Validé</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">! Sans preuve</Badge>
                    )}
                  </div>
                </div>
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
      <DashboardPage />
    </AuthProvider>
  );
}
