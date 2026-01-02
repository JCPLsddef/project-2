export type QuizQuestion = {
  id: number;
  type: 'QCM' | 'VF' | 'SA';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

export const QUIZ_DATA: Record<number, QuizQuestion[]> = {
  1: [
    { id: 1, type: 'QCM', question: 'Quel est le rôle #1 du passeur?', options: ['Marquer des points', 'Organiser l\'attaque', 'Bloquer', 'Servir'], correctAnswer: 'Organiser l\'attaque', explanation: 'Le passeur gère l\'attaque et distribue les ballons.' },
    { id: 2, type: 'QCM', question: 'Avant le contact, tu dois lire:', options: ['Le ballon seulement', 'Réception + bloc + positions attaquants', 'L\'arbitre', 'Tes mains'], correctAnswer: 'Réception + bloc + positions attaquants', explanation: 'Vision complète du terrain pour décider.' },
    { id: 3, type: 'VF', question: 'Hittable signifie que l\'attaquant frappe sans s\'ajuster.', options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: 'Timing constant = hittable.' },
    { id: 4, type: 'QCM', question: 'Réception mauvaise, tu choisis:', options: ['Passe rapide', 'Haute sécurité', 'No-look', 'Dump'], correctAnswer: 'Haute sécurité', explanation: 'Sécurité avant tout sur mauvaise réception.' },
    { id: 5, type: 'QCM', question: 'Au mur, la priorité est:', options: ['Faire des tricks', 'Balle stable sans rotation', 'Très bas', 'Très loin'], correctAnswer: 'Balle stable sans rotation', explanation: 'Propreté technique d\'abord.' },
    { id: 6, type: 'QCM', question: 'Après une erreur de l\'attaquant, tu:', options: ['Le blâmes', 'Le rassures et donnes balle simple', 'L\'évites', 'Restes silencieux'], correctAnswer: 'Le rassures et donnes balle simple', explanation: 'Leadership positif construit confiance.' },
    { id: 7, type: 'QCM', question: 'Le leadership c\'est:', options: ['Crier fort', 'Rester calme + donner consignes claires', 'Se plaindre', 'Silence'], correctAnswer: 'Rester calme + donner consignes claires', explanation: 'Calme et direction, pas chaos.' },
    { id: 8, type: 'QCM', question: 'Réception moyenne, central en retard, tu passes:', options: ['Rapide au centre', 'Simple/hittable à qui est prêt', 'No-look', 'Ultra basse'], correctAnswer: 'Simple/hittable à qui est prêt', explanation: 'S\'adapter à la réalité du terrain.' },
    { id: 9, type: 'QCM', question: 'Tu arrives en retard sous la balle, tu:', options: ['Forces une passe rapide', 'Stop + haute sécurité', 'Tournes le dos', 'Dump'], correctAnswer: 'Stop + haute sécurité', explanation: 'Stabiliser d\'abord, ne pas forcer.' },
    { id: 10, type: 'SA', question: 'Écris 2 choses à voir avant de passer.', correctAnswer: 'réception bloc position', explanation: 'Réception, bloc adverse, positions attaquants.' }
  ],
  2: [
    { id: 1, type: 'QCM', question: 'L\'indicateur #1 de précision c\'est:', options: ['Le volume total', 'Le % de passes hittable', 'Les burpees', 'Les cris'], correctAnswer: 'Le % de passes hittable', explanation: 'Qualité > quantité toujours.' },
    { id: 2, type: 'VF', question: 'On ne compte que les passes parfaites.', options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: 'Standards élevés = progrès.' },
    { id: 3, type: 'QCM', question: 'Si la balle tourne, c\'est:', options: ['Normal', 'Mains/contact instable', 'Bon signe', 'Acceptable'], correctAnswer: 'Mains/contact instable', explanation: 'Rotation = technique à corriger.' },
    { id: 4, type: 'QCM', question: 'Passe trop courte? Tu corriges:', options: ['Arc plus long + sortie nette', 'Plus fort', 'Plus bas', 'Abandon'], correctAnswer: 'Arc plus long + sortie nette', explanation: 'Arc et sortie contrôlée.' },
    { id: 5, type: 'QCM', question: 'Annoncer la zone entraîne:', options: ['Rien', 'Cerveau + communication + timing', 'Confusion', 'Perte temps'], correctAnswer: 'Cerveau + communication + timing', explanation: 'Clarté mentale et communication.' },
    { id: 6, type: 'QCM', question: 'Si passes trop près filet:', options: ['Continue', 'Recule 30-60cm', 'Avance', 'Change rien'], correctAnswer: 'Recule 30-60cm', explanation: 'Espace sécuritaire pour attaquant.' },
    { id: 7, type: 'QCM', question: 'Une bonne passe rend l\'attaquant:', options: ['Nerveux', 'Dans son rythme naturel', 'Lent', 'Confus'], correctAnswer: 'Dans son rythme naturel', explanation: 'Le passeur sert l\'attaquant.' },
    { id: 8, type: 'VF', question: 'Technique stable garde précision même fatigué.', options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: 'Fondations solides résistent fatigue.' },
    { id: 9, type: 'SA', question: 'Règle #1 quand ta précision chute.', correctAnswer: 'ralentir corriger propreté', explanation: 'Ralentir, corriger, revenir à la propreté.' },
    { id: 10, type: 'SA', question: 'Définis "hittable".', correctAnswer: 'sans ajuster timing', explanation: 'Sans s\'ajuster, dans son timing.' }
  ],
  12: [
    { id: 1, type: 'QCM', question: 'Le passeur contrôle:', options: ['Rien', 'Rythme + décisions équipe', 'Seulement ballon', 'Score'], correctAnswer: 'Rythme + décisions équipe', explanation: 'Chef d\'orchestre terrain.' },
    { id: 2, type: 'VF', question: 'Constance sous pression > tricks spectaculaires.', options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: 'Fiabilité = GOAT.' },
    { id: 3, type: 'QCM', question: 'Fin de set serré, point gagnant, tu passes:', options: ['Ultra risqué', 'Simple + hittable', 'No-look', 'Dump'], correctAnswer: 'Simple + hittable', explanation: 'Exécution > risque fin set.' },
    { id: 4, type: 'QCM', question: 'Plan point important:', options: ['Improviser', 'Respiration + décision simple', 'Paniquer', 'Complexifier'], correctAnswer: 'Respiration + décision simple', explanation: 'Processus clair sous pression.' },
    { id: 5, type: 'QCM', question: 'Tu parles pour:', options: ['Remplir silence', 'Organiser + calmer + diriger', 'Blâmer', 'Impressionner'], correctAnswer: 'Organiser + calmer + diriger', explanation: 'Communication = leadership.' },
    { id: 6, type: 'QCM', question: 'Fatigue semaine 12:', options: ['Même volume', 'Moins volume + plus qualité', 'Arrêter', 'Doubler'], correctAnswer: 'Moins volume + plus qualité', explanation: 'Taper smart, pas taper fort.' },
    { id: 7, type: 'QCM', question: 'Signe progrès passeur:', options: ['Stats perso', 'Attaquants ont confiance + timing', 'Tricks', 'Vitesse'], correctAnswer: 'Attaquants ont confiance + timing', explanation: 'Succès = attaquants performent.' },
    { id: 8, type: 'VF', question: 'Après victoire: garder système + 1 amélioration ciblée.', options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: 'Évolution, pas révolution.' },
    { id: 9, type: 'SA', question: 'Règle GOAT en une phrase.', correctAnswer: 'calme décide tôt hittable', explanation: 'Calme, décide tôt, passes hittable.' },
    { id: 10, type: 'SA', question: 'Si tu rates set au point final, tu:', correctAnswer: 'ownership reset next', explanation: 'Prendre responsabilité, reset, prochain.' }
  ]
};

// Fill other weeks with template data
for (let week = 3; week <= 11; week++) {
  if (!QUIZ_DATA[week]) {
    QUIZ_DATA[week] = [
      { id: 1, type: 'QCM', question: `Question 1 semaine ${week}`, options: ['Option A', 'Option B correcte', 'Option C', 'Option D'], correctAnswer: 'Option B correcte', explanation: `Explication semaine ${week} Q1` },
      { id: 2, type: 'VF', question: `Affirmation semaine ${week}`, options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: `Explication V/F ${week}` },
      { id: 3, type: 'QCM', question: `Situation de jeu ${week}`, options: ['Choix A', 'Choix B correct', 'Choix C', 'Choix D'], correctAnswer: 'Choix B correct', explanation: `Explication situation ${week}` },
      { id: 4, type: 'QCM', question: `Technique semaine ${week}`, options: ['Mauvais', 'Correct', 'Moyen', 'Faux'], correctAnswer: 'Correct', explanation: `Technique ${week}` },
      { id: 5, type: 'SA', question: `Principe clé semaine ${week}?`, correctAnswer: 'mot clé', explanation: `Principe ${week}` },
      { id: 6, type: 'QCM', question: `Décision sous pression ${week}`, options: ['Mauvais', 'Bon choix', 'Risqué', 'Faux'], correctAnswer: 'Bon choix', explanation: `Décision ${week}` },
      { id: 7, type: 'VF', question: `Concept ${week} est vrai`, options: ['Vrai', 'Faux'], correctAnswer: 'Vrai', explanation: `Concept ${week}` },
      { id: 8, type: 'QCM', question: `Leadership ${week}`, options: ['Mauvais', 'Correct', 'Moyen', 'Faux'], correctAnswer: 'Correct', explanation: `Leadership ${week}` },
      { id: 9, type: 'SA', question: `Erreur fréquente ${week}?`, correctAnswer: 'erreur', explanation: `Erreur ${week}` },
      { id: 10, type: 'SA', question: `Correction ${week}?`, correctAnswer: 'correction', explanation: `Correction ${week}` }
    ];
  }
}
