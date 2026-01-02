'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, Target, AlertCircle } from 'lucide-react';
import { calculateScore } from '@/lib/scoring';

function TodayPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [mission, setMission] = useState<any>(null);
  const [weekData, setWeekData] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [submission, setSubmission] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    proof_url: '',
    quality_1_5: 3,
    rotation_enum: 'Parfois',
    max_clean_streak: 0,
    precision_1_5: 3,
    footwork_1_5: 3,
    decision_announced_bool: false,
    leadership_1_5: 3,
    attitude_1_10: 5,
    rpe_1_10: 5,
    sleep_hours: 7,
    error_text: '',
    correction_text: ''
  });

  useEffect(() => {
    if (profile) {
      loadTodayMission();
    }
  }, [profile]);

  const loadTodayMission = async () => {
    const startDate = new Date(profile!.start_date);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const week = Math.min(Math.floor(daysSinceStart / 7) + 1, 12);
    const day = Math.min((daysSinceStart % 7) + 1, 7);

    setCurrentWeek(week);
    setCurrentDay(day);

    const { data: weekInfo } = await supabase
      .from('weeks')
      .select('*')
      .eq('id', week)
      .maybeSingle();

    setWeekData(weekInfo);

    const { data: missionData } = await supabase
      .from('missions')
      .select('*')
      .eq('week_id', week)
      .eq('day_number', day)
      .maybeSingle();

    setMission(missionData);

    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user!.id)
      .eq('week_id', week)
      .eq('day_number', day)
      .maybeSingle();

    setSubmission(existingSubmission);

    if (missionData?.blocks_json) {
      const initialChecklist: Record<string, boolean> = {};
      missionData.blocks_json.forEach((block: any, blockIdx: number) => {
        block.drills?.forEach((drill: any, drillIdx: number) => {
          initialChecklist[`${blockIdx}-${drillIdx}`] = false;
        });
      });
      setChecklist(initialChecklist);
    }
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const checklistCompleted = Object.values(checklist).filter(Boolean).length / Object.keys(checklist).length >= 0.7;
      const wall300Done = Object.values(checklist).filter(Boolean).length > 0;

      const score = calculateScore({
        completed_bool: checklistCompleted,
        proof_url: formData.proof_url,
        wall300_done: wall300Done,
        quality_1_5: formData.quality_1_5,
        rotation_enum: formData.rotation_enum as any,
        precision_1_5: formData.precision_1_5,
        decision_announced_bool: formData.decision_announced_bool,
        leadership_1_5: formData.leadership_1_5
      });

      const { error } = await supabase
        .from('submissions')
        .upsert({
          user_id: user!.id,
          week_id: currentWeek,
          day_number: currentDay,
          completed_bool: checklistCompleted,
          mode: profile!.mode_default,
          proof_url: formData.proof_url || null,
          wall300_done: wall300Done,
          quality_1_5: formData.quality_1_5,
          rotation_enum: formData.rotation_enum,
          max_clean_streak: formData.max_clean_streak,
          precision_1_5: formData.precision_1_5,
          footwork_1_5: formData.footwork_1_5,
          decision_announced_bool: formData.decision_announced_bool,
          leadership_1_5: formData.leadership_1_5,
          attitude_1_10: formData.attitude_1_10,
          rpe_1_10: formData.rpe_1_10,
          sleep_hours: formData.sleep_hours,
          error_text: formData.error_text,
          correction_text: formData.correction_text,
          score_0_100: score
        }, {
          onConflict: 'user_id,week_id,day_number'
        });

      if (error) throw error;

      const newStreak = checklistCompleted ? profile!.streak + 1 : 0;
      await supabase
        .from('profiles')
        .update({ streak: newStreak })
        .eq('id', user!.id);

      await refreshProfile();

      toast({
        title: 'Séance soumise',
        description: `Score: ${score.toFixed(0)}/100 ${score < 70 ? '⚠️ Séance corrective requise' : '✓'}`,
      });

      setIsSubmitOpen(false);
      loadTodayMission();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;

  if (!mission) {
    return (
      <AppLayout>
        <Card className="premium-card">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0A1B3D] mb-2">
              {currentDay === 7 ? 'Dimanche Repos' : 'Mission en chargement...'}
            </h2>
            {currentDay === 7 ? (
              <div className="mt-4">
                <p className="text-gray-600 mb-4">Routine de récupération</p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li>• Respiration 4-6: 3 minutes</li>
                  <li>• Préhab épaules léger</li>
                  <li>• Mobilité: 10 minutes</li>
                  <li>• Marche légère: 20 minutes</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-600">Pas de mission trouvée pour S{currentWeek} J{currentDay}</p>
            )}
          </div>
        </Card>
      </AppLayout>
    );
  }

  const blocks = mission.blocks_json || [];
  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="flex items-start justify-between">
          <div>
            <Badge className="mb-2">Semaine {currentWeek} - Jour {currentDay}</Badge>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
              {mission.title}
            </h1>
            <p className="text-gray-600">Durée: {mission.duration_min} minutes</p>
          </div>
          <Target className="w-8 h-8 text-[#2F6BFF]" />
        </div>

        {mission.notes && (
          <Card className="premium-card bg-blue-50 border-blue-200">
            <p className="text-sm text-[#0A1B3D]">{mission.notes}</p>
          </Card>
        )}

        {submission && (
          <Card className="premium-card border-2 border-green-500">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-600">Séance complétée</p>
                <p className="text-sm text-gray-600">
                  Score: {submission.score_0_100?.toFixed(0)}/100
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="premium-card">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-600">{completedItems}/{totalItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2F6BFF] h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        {blocks.map((block: any, blockIdx: number) => (
          <Card key={blockIdx} className="premium-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2F6BFF] text-white flex items-center justify-center font-bold">
                {blockIdx + 1}
              </div>
              <div>
                <h3 className="font-bold text-[#0A1B3D]">{block.name}</h3>
                <p className="text-sm text-gray-600">{block.duration} min</p>
              </div>
            </div>

            <div className="space-y-3">
              {block.drills?.map((drill: any, drillIdx: number) => {
                const key = `${blockIdx}-${drillIdx}`;
                return (
                  <div
                    key={key}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Checkbox
                      checked={checklist[key] || false}
                      onCheckedChange={() => toggleChecklistItem(key)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{drill.id} - {drill.sets}×{drill.reps}</p>
                      <p className="text-sm text-gray-600">{drill.focus}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        {progress < 70 && (
          <Card className="premium-card bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Attention</p>
                <p className="text-sm text-orange-700">
                  Complete au moins 70% de la checklist avant de soumettre
                </p>
              </div>
            </div>
          </Card>
        )}

        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg" disabled={progress < 70}>
              Soumettre la séance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Soumettre la séance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Preuve (URL photo/vidéo)</Label>
                <Input
                  value={formData.proof_url}
                  onChange={(e) => setFormData({...formData, proof_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Qualité passes (1-5)</Label>
                  <Select value={formData.quality_1_5.toString()} onValueChange={(v) => setFormData({...formData, quality_1_5: parseInt(v)})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rotation ballon</Label>
                  <Select value={formData.rotation_enum} onValueChange={(v) => setFormData({...formData, rotation_enum: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jamais">Jamais</SelectItem>
                      <SelectItem value="Parfois">Parfois</SelectItem>
                      <SelectItem value="Souvent">Souvent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Précision (1-5)</Label>
                  <Select value={formData.precision_1_5.toString()} onValueChange={(v) => setFormData({...formData, precision_1_5: parseInt(v)})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Footwork (1-5)</Label>
                  <Select value={formData.footwork_1_5.toString()} onValueChange={(v) => setFormData({...formData, footwork_1_5: parseInt(v)})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Leadership (1-5)</Label>
                  <Select value={formData.leadership_1_5.toString()} onValueChange={(v) => setFormData({...formData, leadership_1_5: parseInt(v)})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Série propre max</Label>
                  <Input
                    type="number"
                    value={formData.max_clean_streak}
                    onChange={(e) => setFormData({...formData, max_clean_streak: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.decision_announced_bool}
                  onCheckedChange={(checked) => setFormData({...formData, decision_announced_bool: checked as boolean})}
                />
                <Label>Décision annoncée avant chaque passe</Label>
              </div>

              <div>
                <Label>Erreur #1 identifiée</Label>
                <Textarea
                  value={formData.error_text}
                  onChange={(e) => setFormData({...formData, error_text: e.target.value})}
                  placeholder="Quelle erreur as-tu identifiée?"
                />
              </div>

              <div>
                <Label>Correction pour demain</Label>
                <Textarea
                  value={formData.correction_text}
                  onChange={(e) => setFormData({...formData, correction_text: e.target.value})}
                  placeholder="Comment corriger demain?"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Soumission...' : 'Soumettre'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <TodayPage />
    </AuthProvider>
  );
}
