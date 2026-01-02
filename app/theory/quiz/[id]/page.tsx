'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, CheckCircle2, XCircle, ChevronLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { QUIZ_DATA, type QuizQuestion } from '@/lib/quiz-data';
import { WEEKS_DATA } from '@/lib/program-data';

function QuizPage() {
  const params = useParams();
  const weekId = parseInt(params.id as string);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = QUIZ_DATA[weekId] || [];
  const weekData = WEEKS_DATA.find(w => w.id === weekId);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let correctCount = 0;
      questions.forEach((q: QuizQuestion) => {
        const userAnswer = answers[q.id]?.toLowerCase().trim();
        const correctAnswer = q.correctAnswer.toLowerCase().trim();

        if (q.type === 'SA') {
          const keywords = correctAnswer.split(' ');
          const hasKeywords = keywords.some(keyword =>
            userAnswer.includes(keyword.toLowerCase())
          );
          if (hasKeywords) correctCount++;
        } else {
          if (userAnswer === correctAnswer) correctCount++;
        }
      });

      const finalScore = (correctCount / questions.length) * 100;
      setScore(finalScore);
      setSubmitted(true);

      await supabase.from('quiz_attempts').insert({
        user_id: user!.id,
        quiz_id: weekId,
        score_percent: finalScore,
        answers_json: answers
      });

      toast({
        title: 'Quiz soumis',
        description: `Score: ${finalScore.toFixed(0)}% (${correctCount}/${questions.length})`,
      });
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

  const isAnswerCorrect = (q: QuizQuestion) => {
    if (!submitted) return null;
    const userAnswer = answers[q.id]?.toLowerCase().trim();
    const correctAnswer = q.correctAnswer.toLowerCase().trim();

    if (q.type === 'SA') {
      const keywords = correctAnswer.split(' ');
      return keywords.some(keyword => userAnswer?.includes(keyword.toLowerCase()));
    }
    return userAnswer === correctAnswer;
  };

  if (!profile) return null;

  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === questions.length && !submitted;

  return (
    <AppLayout>
      <div className="space-y-6 pb-20 lg:pb-6">
        <div>
          <Link href="/theory">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour théorie
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2">Quiz Semaine {weekId}</Badge>
              <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
                {weekData?.theme}
              </h1>
              <p className="text-gray-600">10 questions - Valide tes connaissances</p>
            </div>
            <BookOpen className="w-8 h-8 text-[#2F6BFF]" />
          </div>
        </div>

        {!submitted && (
          <Card className="premium-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-600">{answeredCount}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-[#2F6BFF] h-2 rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </Card>
        )}

        {submitted && (
          <Card className={`premium-card border-2 ${
            score >= 80 ? 'border-green-500 bg-green-50' : score >= 60 ? 'border-yellow-500 bg-yellow-50' : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center gap-4">
              {score >= 80 ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <CheckCircle2 className="w-12 h-12 text-yellow-600" />
              )}
              <div>
                <h3 className="text-2xl font-bold text-[#0A1B3D]">
                  Score: {score.toFixed(0)}%
                </h3>
                <p className="text-sm text-gray-700">
                  {score >= 80 ? 'Excellent! Tu maîtrises les concepts.' : score >= 60 ? 'Bien! Revois quelques points.' : 'Continue d\'étudier, tu vas y arriver.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {questions.map((q: QuizQuestion, idx: number) => {
            const isCorrect = isAnswerCorrect(q);
            const showCorrection = submitted;

            return (
              <Card
                key={q.id}
                className={`premium-card ${
                  showCorrection
                    ? isCorrect
                      ? 'border-2 border-green-500'
                      : 'border-2 border-red-500'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full ${
                    showCorrection
                      ? isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-[#2F6BFF]'
                  } text-white flex items-center justify-center font-bold flex-shrink-0`}>
                    {showCorrection ? (
                      isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">{q.type}</Badge>
                    <h3 className="font-bold text-[#0A1B3D]">{q.question}</h3>
                  </div>
                </div>

                {q.type === 'SA' ? (
                  <div>
                    <Label htmlFor={`q${q.id}`}>Ta réponse (quelques mots clés)</Label>
                    <Input
                      id={`q${q.id}`}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      disabled={submitted}
                      placeholder="Entre ta réponse..."
                      className="mt-2"
                    />
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onValueChange={(value) => handleAnswer(q.id, value)}
                    disabled={submitted}
                  >
                    <div className="space-y-2">
                      {q.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                          <Label
                            htmlFor={`${q.id}-${option}`}
                            className="font-normal cursor-pointer flex-1"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {showCorrection && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className="text-sm font-medium mb-1">
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Réponse attendue:</span> {q.correctAnswer}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Explication:</span> {q.explanation}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre le quiz'}
          </Button>
        )}

        {submitted && (
          <div className="flex gap-4">
            <Link href="/theory" className="flex-1">
              <Button variant="outline" className="w-full">
                Retour aux quiz
              </Button>
            </Link>
            <Link href={`/plan/${weekId}`} className="flex-1">
              <Button className="w-full">
                Voir semaine {weekId}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <QuizPage />
    </AuthProvider>
  );
}
