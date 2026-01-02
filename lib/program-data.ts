export const WEEKS_DATA = [
  {
    id: 1,
    theme: 'Base & Discipline',
    objectives: 'Établir propreté technique et routine quotidienne. Zéro rotation au mur.',
    success_metrics: '300 wall sets propres, 80%+ précision, soumission quotidienne avec preuve',
    test_week: true
  },
  {
    id: 2,
    theme: 'Précision zones 2/3/4',
    objectives: 'Précision constante sur zones 2, 3, 4. Attaquant dans son timing.',
    success_metrics: '10 parfaites consécutives par zone, 85%+ hittable',
    test_week: false
  },
  {
    id: 3,
    theme: 'Footwork stable',
    objectives: 'Arriver stable sous la balle avant contact.',
    success_metrics: 'Stop propre avant 100% des passes, base équilibrée',
    test_week: false
  },
  {
    id: 4,
    theme: 'Intégration + TEST S4',
    objectives: 'Intégrer base + précision + footwork. Validation compétences.',
    success_metrics: 'Score 85%+ mission, 20/25 au test, consistance 6 jours',
    test_week: true
  },
  {
    id: 5,
    theme: 'Tempo haut vs rapide',
    objectives: 'Contrôler tempo: haut vs rapide, même propreté.',
    success_metrics: 'Changer tempo sans perte qualité, annoncer choix',
    test_week: false
  },
  {
    id: 6,
    theme: 'Back set stable',
    objectives: 'Back set aussi propre que devant, hittable.',
    success_metrics: 'Back set 85%+ hittable, zéro jeter',
    test_week: false
  },
  {
    id: 7,
    theme: 'Jump set progressif',
    objectives: 'Jump set contrôlé, précision stable.',
    success_metrics: 'Jump set 80%+ hittable, petit saut, contact haut',
    test_week: false
  },
  {
    id: 8,
    theme: 'Hors-système avancé + TEST S8',
    objectives: 'Adapter choix selon qualité réception. Système sous pression.',
    success_metrics: 'Décision correcte 90%+, haute sécurité sur mauvaise réception, 20/25 au test',
    test_week: true
  },
  {
    id: 9,
    theme: 'Pression + séries parfaites',
    objectives: 'Constance sous pression, reset mental rapide.',
    success_metrics: 'Série 20 propres réussie, attitude 8+/10, leadership visible',
    test_week: false
  },
  {
    id: 10,
    theme: 'Transition dig→set + lecture',
    objectives: 'Transition rapide défense→set. Lire bloc adverse.',
    success_metrics: 'Replacer <2s, set hittable après dig',
    test_week: false
  },
  {
    id: 11,
    theme: 'Distribution/stratégie matchups',
    objectives: 'Utiliser plusieurs attaquants, exploiter matchups.',
    success_metrics: 'Distribution équilibrée, varier options, leadership',
    test_week: false
  },
  {
    id: 12,
    theme: 'Match management + TEST FINAL',
    objectives: 'Gérer fin de match, pression, décisions simples. Validation finale.',
    success_metrics: 'Score 90%+ mission, 24/30 au test final, leadership 9+/10',
    test_week: true
  }
];

export function getCurrentWeekAndDay(startDate: string): { week: number; day: number } {
  const start = new Date(startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.min(Math.floor(daysSinceStart / 7) + 1, 12);
  const day = Math.min((daysSinceStart % 7) + 1, 7);
  return { week, day };
}
