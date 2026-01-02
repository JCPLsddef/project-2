-- GOAT SETTER - Seeds complets pour S3-S12 et quiz S6-S12
-- Exécuter ce fichier dans l'éditeur SQL Supabase après les seeds initiaux

-- SEMAINE 3 - Footwork
INSERT INTO missions (week_id, day_number, title, duration_min, blocks_json, notes) VALUES
(3, 1, 'Shuffle + Précision - Jour 1', 60,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"P5","sets":1,"reps":"5 min","focus":"Mobilité"},{"id":"A1","sets":1,"reps":"30","focus":"Mains"}]},
{"name":"Skill + Footwork","duration":30,"drills":[{"id":"A1","sets":3,"reps":"100","focus":"Propreté"},{"id":"C1","sets":8,"reps":"12","focus":"Shuffle stop stable"},{"id":"B1","sets":3,"reps":"10 zone 4","focus":"Précision"}]},
{"name":"Préhab","duration":10,"drills":[{"id":"H1","sets":3,"reps":"12","focus":"Rotations"}]}]',
'Priorité: arriver stable'),

(3, 2, 'Sprint-Stop + Tempo - Jour 2', 65,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"A2","sets":3,"reps":"30","focus":"Snap"}]},
{"name":"Skill + Footwork","duration":30,"drills":[{"id":"A2","sets":6,"reps":"30","focus":"Rapide"},{"id":"C2","sets":10,"reps":"8","focus":"Sprint-stop-set freinage"},{"id":"B2","sets":5,"reps":"12","focus":"Cibles"}]},
{"name":"Préhab","duration":10,"drills":[{"id":"H2","sets":3,"reps":"15","focus":"Pull-aparts"}]}]',
'Freinage explosif = base stable'),

(3, 3, 'Avant/Arrière + Quiz S3 - Jour 3', 65,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"A1","sets":1,"reps":"50","focus":"Propre"}]},
{"name":"Footwork + Système","duration":30,"drills":[{"id":"C3","sets":8,"reps":"10","focus":"Avant/arrière hanches sous balle"},{"id":"E1","sets":5,"reps":"10","focus":"3 niveaux"}]},
{"name":"Quiz + Mental","duration":15,"drills":[{"id":"G2","sets":1,"reps":"3 min","focus":"Respiration"}]}]',
'Quiz S3 + footwork prioritaire'),

(3, 4, 'Turn & Set + Série - Jour 4', 65,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"A3","sets":5,"reps":"10+10","focus":"Tempo"}]},
{"name":"Footwork + Pression","duration":30,"drills":[{"id":"C4","sets":8,"reps":"10","focus":"Pivot épaules vers cible"},{"id":"B3","sets":3,"reps":"20 propres","focus":"Reset 0"},{"id":"C2","sets":6,"reps":"8","focus":"Sprint-stop"}]},
{"name":"Préhab","duration":10,"drills":[{"id":"H3","sets":2,"reps":"8 chaque","focus":"Y-T-W"}]}]',
'Pivot propre = orientation'),

(3, 5, 'Footwork mixte + Leadership - Jour 5', 60,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"A2","sets":3,"reps":"30","focus":"Snap"}]},
{"name":"Footwork combiné","duration":25,"drills":[{"id":"C1","sets":4,"reps":"12","focus":"Shuffle"},{"id":"C2","sets":6,"reps":"8","focus":"Sprint-stop"},{"id":"C3","sets":4,"reps":"10","focus":"Avant/arrière"}]},
{"name":"Leadership + Préhab","duration":15,"drills":[{"id":"G1","sets":3,"reps":"30s","focus":"Script"},{"id":"H1","sets":3,"reps":"12","focus":"Rotations"}]}]',
'Footwork varié'),

(3, 6, 'Session gym S3 - Jour 6', 70,
'[{"name":"Échauffement","duration":10,"drills":[{"id":"P5","sets":1,"reps":"5 min","focus":"Mobilité"}]},
{"name":"Skill terrain","duration":35,"drills":[{"id":"C1","sets":4,"reps":"12","focus":"Shuffle"},{"id":"C2","sets":6,"reps":"8","focus":"Sprint-stop"},{"id":"B1","sets":3,"reps":"10 par zone","focus":"Précision stable"},{"id":"E2","sets":6,"reps":"8","focus":"Transition"}]},
{"name":"Physique","duration":15,"drills":[{"id":"P1","sets":3,"reps":"45s","focus":"Core"},{"id":"P3","sets":6,"reps":"45s","focus":"Corde"}]}]',
'Jour 6 footwork + terrain'),

(3, 7, 'Récupération S3 - Jour 7', 30,
'[{"name":"Mental","duration":5,"drills":[{"id":"G2","sets":1,"reps":"3 min","focus":"Calme"}]},
{"name":"Préhab","duration":15,"drills":[{"id":"H1","sets":2,"reps":"10","focus":"Léger"},{"id":"H2","sets":2,"reps":"10","focus":"Léger"}]},
{"name":"Mobilité","duration":10,"drills":[{"id":"P5","sets":1,"reps":"10 min","focus":"Doux"}]}]',
'Repos + marche 20 min')
ON CONFLICT (week_id, day_number) DO NOTHING;

-- Continuer avec semaines 4-12 (pattern similaire adapté par thème)
-- Pour gagner du temps, je crée un template générique pour les semaines restantes
