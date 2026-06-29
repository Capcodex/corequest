import levels from "@/data/rust-foundations/levels.json";
import {
  Chapter,
  ContentDifficulty,
  Curriculum,
  CurriculumLevel,
  ExerciseContent,
  ExerciseValidationMode,
  GateContent,
  LessonSection,
  Theme,
  UnlockRule,
} from "@/types/content";

type LegacyExerciseRecord = {
  id: string;
  pathId: string;
  orderIndex: number;
  title: string;
  concept: string;
  summary: string;
  missionText: string;
  lessonSections: LessonSection[];
  exampleCode: string;
  instructions: string[];
  expectedOutput: string;
  hint: string;
  xpReward: number;
};

type ExerciseSeed = {
  id: string;
  orderIndex: number;
  title: string;
  concept: string;
  summary: string;
  missionText: string;
  lessonSections: LessonSection[];
  exampleCode: string;
  instructions: string[];
  expectedOutput: string;
  hint: string;
  xpReward: number;
  estimatedDurationMinutes: number;
  difficulty: ContentDifficulty;
  stdin?: string | null;
  validationMode?: ExerciseValidationMode;
};

type ExerciseMeta = {
  levelId: string;
  levelNumber: number;
  themeId: string;
  chapterId: string;
  unlockRules: UnlockRule[];
};

type GateMeta = {
  id: string;
  levelId: string;
  levelNumber: number;
  themeId: string;
  chapterId: string;
  orderIndex: number;
  title: string;
  summary: string;
  message: string;
  unlockRules: UnlockRule[];
  requiredContentIds: string[];
};

const PATH_ID = "rust-foundations";
const legacyExercises = levels as LegacyExerciseRecord[];
const legacyExerciseMap = new Map(legacyExercises.map((exercise) => [exercise.id, exercise]));

function createExercise(seed: ExerciseSeed, meta: ExerciseMeta): ExerciseContent {
  const validationMode = seed.validationMode ?? "stdout_exact";

  return {
    id: seed.id,
    type: "exercise",
    pathId: PATH_ID,
    levelId: meta.levelId,
    levelNumber: meta.levelNumber,
    themeId: meta.themeId,
    chapterId: meta.chapterId,
    orderIndex: seed.orderIndex,
    title: seed.title,
    summary: seed.summary,
    xpReward: seed.xpReward,
    estimatedDurationMinutes: seed.estimatedDurationMinutes,
    difficulty: seed.difficulty,
    unlockRules: meta.unlockRules,
    concept: seed.concept,
    missionText: seed.missionText,
    lessonSections: seed.lessonSections,
    exampleCode: seed.exampleCode,
    instructions: seed.instructions,
    expectedOutput: seed.expectedOutput,
    stdin: seed.stdin ?? null,
    hint: seed.hint,
    starterMode: "empty",
    validation:
      validationMode === "exit_success"
        ? { mode: "exit_success", stdin: seed.stdin ?? null }
        : {
            mode: validationMode,
            expectedOutput: seed.expectedOutput,
            stdin: seed.stdin ?? null,
          },
  };
}

function createLegacyExercise(
  legacyId: string,
  meta: ExerciseMeta & {
    difficulty: ContentDifficulty;
    estimatedDurationMinutes: number;
  },
): ExerciseContent {
  const record = legacyExerciseMap.get(legacyId);

  if (!record) {
    throw new Error(`Missing legacy exercise: ${legacyId}`);
  }

  return createExercise(
    {
      id: record.id,
      orderIndex: record.orderIndex,
      title: record.title,
      concept: record.concept,
      summary: record.summary,
      missionText: record.missionText,
      lessonSections: record.lessonSections,
      exampleCode: record.exampleCode,
      instructions: record.instructions,
      expectedOutput: record.expectedOutput,
      hint: record.hint,
      xpReward: record.xpReward,
      estimatedDurationMinutes: meta.estimatedDurationMinutes,
      difficulty: meta.difficulty,
      stdin: null,
      validationMode: "stdout_exact",
    },
    meta,
  );
}

function createGate(meta: GateMeta): GateContent {
  return {
    id: meta.id,
    type: "gate",
    levelId: meta.levelId,
    levelNumber: meta.levelNumber,
    themeId: meta.themeId,
    chapterId: meta.chapterId,
    orderIndex: meta.orderIndex,
    title: meta.title,
    summary: meta.summary,
    xpReward: 0,
    estimatedDurationMinutes: 0,
    difficulty: "intro",
    unlockRules: meta.unlockRules,
    gateType: "theme_unlock",
    targetLevelId: null,
    message: meta.message,
    requiredContentIds: meta.requiredContentIds,
    requiredProjectIds: [],
  };
}

const outputChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-1",
    orderIndex: 1,
    title: "Réveiller le noyau",
    concept: "Affichage de texte",
    summary: "Premier contact : afficher une ligne exactement comme attendu.",
    missionText: "Écrivez un programme qui affiche exactement Noyau réveillé.",
    lessonSections: [
      {
        heading: "Afficher une ligne",
        content: "`println!` écrit une ligne dans la console et ajoute un retour à la ligne.",
      },
      {
        heading: "Respecter la sortie attendue",
        content: "Dans CoreQuest, la ponctuation, les accents et l’ordre du texte comptent.",
      },
    ],
    exampleCode: 'fn main() {\n    println!("Bonjour Rust");\n}',
    instructions: [
      "Créez une fonction `main` valide.",
      "Affichez exactement `Noyau réveillé`.",
      "Ne produisez aucune autre sortie.",
    ],
    expectedOutput: "Noyau réveillé",
    hint: "Commencez par `fn main() { ... }` puis placez un `println!` avec le texte exact.",
    xpReward: 20,
    estimatedDurationMinutes: 4,
    difficulty: "intro",
  },
  {
    id: "rust-level-2",
    orderIndex: 2,
    title: "Ouvrir le journal de bord",
    concept: "Suite d’instructions",
    summary: "Produire plusieurs lignes dans le bon ordre.",
    missionText: "Affichez deux lignes : `Initialisation` puis `Module chargé`.",
    lessonSections: [
      {
        heading: "Enchaîner des instructions",
        content: "Un programme peut appeler plusieurs `println!` de suite dans le même `main`.",
      },
      {
        heading: "L’ordre compte",
        content: "La validation compare la sortie finale, ligne par ligne, dans l’ordre exact.",
      },
    ],
    exampleCode: 'fn main() {\n    println!("Étape 1");\n    println!("Étape 2");\n}',
    instructions: [
      "Affichez `Initialisation` sur la première ligne.",
      "Affichez `Module chargé` sur la deuxième ligne.",
      "Gardez cet ordre exact.",
    ],
    expectedOutput: "Initialisation\nModule chargé",
    hint: "Utilisez deux appels distincts à `println!`.",
    xpReward: 25,
    estimatedDurationMinutes: 5,
    difficulty: "intro",
  },
  {
    id: "rust-level-3",
    orderIndex: 3,
    title: "Lancer la séquence",
    concept: "Affichage multi-lignes",
    summary: "Construire une petite séquence console complète.",
    missionText: "Affichez la séquence `3`, `2`, `1`, puis `Décollage`, chaque élément sur sa propre ligne.",
    lessonSections: [
      {
        heading: "Construire une sortie complète",
        content: "Un exercice peut demander plusieurs lignes, pas seulement un texte isolé.",
      },
      {
        heading: "Lire la consigne jusqu’au bout",
        content: "Quand la sortie contient plusieurs lignes, le dernier mot compte autant que le premier.",
      },
    ],
    exampleCode: 'fn main() {\n    println!("3");\n    println!("2");\n    println!("1");\n    println!("Go");\n}',
    instructions: [
      "Affichez `3`, puis `2`, puis `1`.",
      "Terminez par `Décollage` sur une nouvelle ligne.",
      "Ne rajoutez aucun autre texte.",
    ],
    expectedOutput: "3\n2\n1\nDécollage",
    hint: "Quatre appels à `println!` suffisent.",
    xpReward: 30,
    estimatedDurationMinutes: 6,
    difficulty: "beginner",
  },
];

const repetitionChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-4",
    orderIndex: 4,
    title: "Envoyer trois pings",
    concept: "Boucle `for` simple",
    summary: "Première répétition contrôlée avec une boucle.",
    missionText: "Affichez le mot `Ping` exactement trois fois, chacun sur sa propre ligne, à l’aide d’une boucle.",
    lessonSections: [
      {
        heading: "Répéter sans copier-coller",
        content: "Une boucle évite d’écrire la même instruction plusieurs fois.",
      },
      {
        heading: "Ignorer la variable de boucle",
        content: "Quand la valeur parcourue ne sert pas, vous pouvez utiliser `_`.",
      },
    ],
    exampleCode: 'fn main() {\n    for _ in 0..3 {\n        println!("Ping");\n    }\n}',
    instructions: [
      "Utilisez une boucle pour répéter l’instruction.",
      "Affichez `Ping` sur trois lignes.",
      "N’écrivez pas trois `println!` séparés.",
    ],
    expectedOutput: "Ping\nPing\nPing",
    hint: "La forme `for _ in 0..3 { ... }` convient très bien ici.",
    xpReward: 35,
    estimatedDurationMinutes: 6,
    difficulty: "beginner",
  },
  {
    id: "rust-level-5",
    orderIndex: 5,
    title: "Compter les cycles",
    concept: "Boucle `for` avec variable",
    summary: "Parcourir une plage et afficher la valeur courante.",
    missionText: "Affichez les nombres `1`, `2`, `3`, `4`, chacun sur sa propre ligne, avec une boucle `for`.",
    lessonSections: [
      {
        heading: "Parcourir une plage",
        content: "`1..=4` produit successivement les valeurs 1, 2, 3 et 4.",
      },
      {
        heading: "Réutiliser la valeur courante",
        content: "La variable de boucle peut être affichée directement avec `println!`.",
      },
    ],
    exampleCode: 'fn main() {\n    for value in 1..=3 {\n        println!("{}", value);\n    }\n}',
    instructions: [
      "Utilisez `for` et une plage inclusive.",
      "Affichez les valeurs de 1 à 4.",
      "Placez chaque valeur sur sa propre ligne.",
    ],
    expectedOutput: "1\n2\n3\n4",
    hint: "La plage `1..=4` inclut bien la valeur 4.",
    xpReward: 40,
    estimatedDurationMinutes: 7,
    difficulty: "beginner",
  },
  {
    id: "rust-level-6",
    orderIndex: 6,
    title: "Amorcer la descente",
    concept: "Boucle `while`",
    summary: "Répéter tant qu’une condition reste vraie.",
    missionText: "Affichez `3`, `2`, `1`, puis `Sol` en utilisant une boucle `while` et un compteur mutable.",
    lessonSections: [
      {
        heading: "Contrôler la sortie de boucle",
        content: "Une boucle `while` continue tant que sa condition reste vraie.",
      },
      {
        heading: "Faire évoluer un compteur",
        content: "Il faut modifier la variable de contrôle à chaque tour pour éviter une boucle infinie.",
      },
    ],
    exampleCode: 'fn main() {\n    let mut count = 3;\n\n    while count > 0 {\n        println!("{}", count);\n        count -= 1;\n    }\n\n    println!("Sol");\n}',
    instructions: [
      "Créez un compteur mutable initialisé à 3.",
      "Affichez sa valeur tant qu’elle est strictement positive.",
      "Affichez `Sol` après la boucle.",
    ],
    expectedOutput: "3\n2\n1\nSol",
    hint: "Décrémentez le compteur à chaque tour avec `count -= 1;`.",
    xpReward: 45,
    estimatedDurationMinutes: 8,
    difficulty: "beginner",
  },
];

const variablesChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-7",
    orderIndex: 7,
    title: "Stocker une mesure",
    concept: "Variables",
    summary: "Déclarer une valeur puis la réutiliser dans la sortie.",
    missionText: "Déclarez une variable `energy` contenant `42`, puis affichez cette valeur.",
    lessonSections: [
      {
        heading: "Nommer une valeur",
        content: "Une variable rend le code plus lisible et évite de répéter une donnée brute.",
      },
      {
        heading: "Réutiliser une variable",
        content: "Une fois déclarée, une variable peut être injectée dans `println!` avec `{}`.",
      },
    ],
    exampleCode: 'fn main() {\n    let energy = 42;\n    println!("{}", energy);\n}',
    instructions: [
      "Déclarez `energy` avec la valeur `42`.",
      "Affichez uniquement la valeur stockée.",
      "Gardez une sortie sur une seule ligne.",
    ],
    expectedOutput: "42",
    hint: "La variable peut être lue avec `println!(\"{}\", energy);`.",
    xpReward: 50,
    estimatedDurationMinutes: 6,
    difficulty: "beginner",
  },
  {
    id: "rust-level-8",
    orderIndex: 8,
    title: "Additionner deux modules",
    concept: "Calculs simples",
    summary: "Produire un résultat à partir de deux variables.",
    missionText: "Déclarez `left = 7` et `right = 5`, additionnez-les puis affichez le résultat final.",
    lessonSections: [
      {
        heading: "Composer un calcul",
        content: "Les opérateurs arithmétiques fonctionnent directement sur les entiers en Rust.",
      },
      {
        heading: "Calculer puis afficher",
        content: "Vous pouvez afficher une expression directement ou la stocker dans une troisième variable.",
      },
    ],
    exampleCode: 'fn main() {\n    let left = 7;\n    let right = 5;\n    println!("{}", left + right);\n}',
    instructions: [
      "Déclarez deux variables `left` et `right`.",
      "Calculez leur somme.",
      "Affichez le résultat obtenu.",
    ],
    expectedOutput: "12",
    hint: "L’expression `left + right` peut être placée directement dans `println!`.",
    xpReward: 55,
    estimatedDurationMinutes: 7,
    difficulty: "beginner",
  },
  {
    id: "rust-level-9",
    orderIndex: 9,
    title: "Recalculer une réserve",
    concept: "Variables mutables",
    summary: "Modifier une variable avant d’afficher son nouvel état.",
    missionText: "Créez une variable mutable `reserve` initialisée à `10`, ajoutez `5`, puis affichez le total final.",
    lessonSections: [
      {
        heading: "Autoriser la modification",
        content: "Le mot-clé `mut` permet de changer la valeur d’une variable après sa déclaration.",
      },
      {
        heading: "Mettre à jour un total",
        content: "Les exercices de calcul réutilisent souvent une même variable qui évolue étape après étape.",
      },
    ],
    exampleCode: 'fn main() {\n    let mut reserve = 10;\n    reserve = reserve + 5;\n    println!("{}", reserve);\n}',
    instructions: [
      "Déclarez `reserve` comme variable mutable.",
      "Ajoutez `5` à sa valeur initiale.",
      "Affichez la nouvelle valeur.",
    ],
    expectedOutput: "15",
    hint: "Sans `mut`, Rust refusera la réaffectation.",
    xpReward: 60,
    estimatedDurationMinutes: 8,
    difficulty: "beginner",
  },
];

const inputImportsChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-9a",
    orderIndex: 9.05,
    title: "Activer le canal d’entrée",
    concept: "Importer un module standard",
    summary: "Ajouter `use std::io;` puis utiliser `io::stdin()` dans un programme très simple.",
    missionText: "Préparez l’accès à l’entrée standard puis affichez `Canal prêt`.",
    lessonSections: [
      {
        heading: "Pourquoi `use` ?",
        content: "Rust demande d’importer explicitement les outils qui ne font pas partie du cœur du langage. Ici, `use std::io;` donne accès aux fonctions d’entrée standard.",
      },
      {
        heading: "À quoi sert `io::stdin()` ?",
        content: "`io::stdin()` représente le canal par lequel votre programme pourra lire ce que l’utilisateur tape au clavier.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    io::stdin();\n    println!("Canal prêt");\n}',
    instructions: [
      "Ajoutez l’import `use std::io;`.",
      "Appelez `io::stdin();` dans `main`.",
      "Affichez ensuite `Canal prêt`.",
    ],
    expectedOutput: "Canal prêt",
    hint: "L’objectif ici est surtout de vous habituer à `use std::io;` puis à l’appel `io::stdin()`.",
    xpReward: 60,
    estimatedDurationMinutes: 6,
    difficulty: "beginner",
  },
];

const inputBufferChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-9b",
    orderIndex: 9.15,
    title: "Créer un tampon texte",
    concept: "Première `String`",
    summary: "Créer une `String` vide qui servira de zone de lecture pour l’entrée standard.",
    missionText: "Créez une `String` vide nommée `input`, puis affichez `Tampon prêt`.",
    lessonSections: [
      {
        heading: "Que fait `String::new()` ?",
        content: "`String::new()` crée un texte vide. On s’en sert ici comme d’un récipient dans lequel on placera plus tard la saisie utilisateur.",
      },
      {
        heading: "Pourquoi préparer ce tampon avant de lire ?",
        content: "La lecture a besoin d’un endroit où ranger le texte reçu. La `String` joue précisément ce rôle.",
      },
    ],
    exampleCode: 'fn main() {\n    let input = String::new();\n    println!("Tampon prêt");\n}',
    instructions: [
      "Créez une variable `input` avec `String::new()`.",
      "Gardez cette variable dans `main`.",
      "Affichez `Tampon prêt`.",
    ],
    expectedOutput: "Tampon prêt",
    hint: "La ligne clé est `let input = String::new();`.",
    xpReward: 62,
    estimatedDurationMinutes: 6,
    difficulty: "beginner",
  },
];

const inputReadLineChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-9c",
    orderIndex: 9.25,
    title: "Lire une ligne brute",
    concept: "Lecture dans un tampon",
    summary: "Lire une ligne dans une `String` puis l’afficher telle quelle.",
    missionText: "L’entrée standard contient un prénom. Lisez cette ligne puis affichez-la.",
    lessonSections: [
      {
        heading: "Pourquoi `mut` ?",
        content: "La lecture va écrire du texte dans `input`. La variable doit donc être modifiable, d’où `let mut input = ...`.",
      },
      {
        heading: "Que signifie `&mut input` ?",
        content: "`read_line()` a besoin d’une référence vers la variable à remplir. `&mut input` signifie : “tu peux écrire dans cette variable”.",
      },
      {
        heading: "Pourquoi `unwrap()` ici ?",
        content: "La lecture peut réussir ou échouer. Pour ce premier contact, `unwrap()` nous laisse continuer tant que tout se passe bien, sans ouvrir tout de suite le chapitre complet de la gestion d’erreur.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    println!("{}", input);\n}',
    instructions: [
      "Ajoutez l’import `use std::io;`.",
      "Créez `let mut input = String::new();`.",
      "Lisez une ligne avec `read_line(&mut input)` puis affichez `input`.",
    ],
    expectedOutput: "Ada",
    hint: "Le schéma à retenir est : `let mut input = String::new();` puis `io::stdin().read_line(&mut input).unwrap();`.",
    xpReward: 64,
    estimatedDurationMinutes: 8,
    difficulty: "beginner",
    stdin: "Ada\n",
  },
];

const inputTrimChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-9d",
    orderIndex: 9.35,
    title: "Nettoyer la ligne lue",
    concept: "Premiers pas avec `trim()`",
    summary: "Retirer le retour à la ligne final avant d’afficher le texte proprement.",
    missionText: "L’entrée standard contient un prénom. Lisez la ligne, nettoyez-la puis affichez seulement le prénom.",
    lessonSections: [
      {
        heading: "Pourquoi le texte paraît “plus grand” ?",
        content: "Quand l’utilisateur valide sa saisie, un retour à la ligne est lui aussi stocké dans la `String`. Il faut souvent l’enlever avant d’afficher ou de convertir.",
      },
      {
        heading: "Que fait `trim()` ?",
        content: "`trim()` enlève les espaces et retours à la ligne placés au début ou à la fin du texte. C’est l’outil de nettoyage le plus fréquent à ce stade.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n\n    let clean_name = input.trim();\n    println!("{}", clean_name);\n}',
    instructions: [
      "Lisez une ligne dans `input` avec `read_line(&mut input)`.",
      "Créez une variable comme `let clean_name = input.trim();`.",
      "Affichez ensuite cette version nettoyée.",
    ],
    expectedOutput: "Ada",
    hint: "L’étape clé ici est `let clean_name = input.trim();`.",
    xpReward: 66,
    estimatedDurationMinutes: 8,
    difficulty: "beginner",
    stdin: "Ada\n",
  },
];

const inputParseChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-10",
    orderIndex: 10,
    title: "Convertir un entier reçu",
    concept: "Lecture et conversion",
    summary: "Lire une valeur texte, la nettoyer puis la convertir en entier.",
    missionText: "L’entrée standard contient un entier. Lisez-le puis affichez exactement cette valeur.",
    lessonSections: [
      {
        heading: "De texte à nombre",
        content: "`read_line()` remplit une `String`, donc la valeur lue reste du texte. Pour calculer, il faut ensuite convertir ce texte en nombre.",
      },
      {
        heading: "Que veut dire `i32` ?",
        content: "`i32` est un type entier simple en Rust. On peut le lire comme : “je veux stocker un nombre entier ici”.",
      },
      {
        heading: "Pourquoi `trim()` avant `parse()` ?",
        content: "Le retour à la ligne final gêne la conversion. `trim()` nettoie le texte avant `parse()`.",
      },
      {
        heading: "Que fait `parse()` ?",
        content: "`parse()` essaie d’interpréter le texte comme une autre forme de donnée. Ici, on précise `i32` pour obtenir un entier signé simple.",
      },
      {
        heading: "Et `unwrap()` dans tout ça ?",
        content: "Comme pour `read_line()`, `parse()` peut réussir ou échouer. Pour l’instant, `unwrap()` nous permet d’avancer tant que l’entrée fournie correspond bien à ce qui est attendu.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n\n    let value: i32 = input.trim().parse().unwrap();\n    println!("{}", value);\n}',
    instructions: [
      "Lisez une ligne dans `input`.",
      "Créez une variable `value` de type `i32`.",
      "Appliquez `trim()` puis `parse()` pour remplir cette variable.",
      "Affichez exactement cette valeur.",
    ],
    expectedOutput: "42",
    hint: "La forme la plus claire ici est `let value: i32 = input.trim().parse().unwrap();`.",
    xpReward: 68,
    estimatedDurationMinutes: 9,
    difficulty: "beginner",
    stdin: "42\n",
  },
];

const inputTwoLinesChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-11",
    orderIndex: 11,
    title: "Additionner deux lignes d’entrée",
    concept: "Entrée standard multi-lignes",
    summary: "Lire deux lignes, les convertir séparément puis calculer une somme simple.",
    missionText: "L’entrée standard contient deux entiers sur deux lignes. Lisez-les, additionnez-les et affichez la somme.",
    lessonSections: [
      {
        heading: "Lire deux lignes simplement",
        content: "On peut appeler `read_line()` une première fois dans une variable, puis une seconde fois dans une autre. C’est plus long qu’une solution compacte, mais beaucoup plus clair au début.",
      },
      {
        heading: "Deux tampons séparés",
        content: "Utiliser `first_line` et `second_line` évite de mélanger les étapes : lecture, nettoyage, conversion, puis calcul.",
      },
      {
        heading: "Répéter un schéma connu",
        content: "Cet exercice ne présente pas une nouvelle conversion : il vous fait surtout répéter deux fois le même enchaînement `trim()` puis `parse()` pour l’ancrer.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut first_line = String::new();\n    let mut second_line = String::new();\n\n    io::stdin().read_line(&mut first_line).unwrap();\n    io::stdin().read_line(&mut second_line).unwrap();\n\n    let first: i32 = first_line.trim().parse().unwrap();\n    let second: i32 = second_line.trim().parse().unwrap();\n\n    println!("{}", first + second);\n}',
    instructions: [
      "Créez deux `String` : `first_line` puis `second_line`.",
      "Lisez la première ligne dans l’une, puis la seconde dans l’autre.",
      "Convertissez-les chacune en entier, puis affichez leur somme.",
    ],
    expectedOutput: "12",
    hint: "Traitez les deux lignes de la même façon : lecture, `trim()`, `parse()`, puis addition.",
    xpReward: 72,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
    stdin: "7\n5\n",
  },
];

const inputTextReuseChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-12",
    orderIndex: 12,
    title: "Saluer un nom reçu",
    concept: "Réutiliser du texte sans conversion",
    summary: "Lire une chaîne puis la réinjecter dans un message formaté, sans passer par `parse()`.",
    missionText: "L’entrée standard contient un prénom. Lisez-le puis affichez `Bonjour, <prénom>`.",
    lessonSections: [
      {
        heading: "Conserver le texte tel quel",
        content: "Quand on n’a pas besoin de calculer, la valeur peut rester une chaîne lue dans `stdin`.",
      },
      {
        heading: "Ne pas convertir pour rien",
        content: "Tous les exercices d’entrée ne demandent pas un nombre. Ici, `parse()` ne sert à rien : on garde le prénom comme texte.",
      },
      {
        heading: "Réutiliser une donnée lue",
        content: "`println!` peut mélanger du texte fixe et une valeur récupérée à l’exécution.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n\n    let name = input.trim();\n    println!("Bonjour, {}", name);\n}',
    instructions: [
      "Lisez le prénom fourni dans l’entrée standard.",
      "Nettoyez le retour à la ligne final avec `trim()`.",
      "Affichez `Bonjour, <prénom>` sans convertir cette valeur en nombre.",
    ],
    expectedOutput: "Bonjour, Ada",
    hint: "Ici, `trim()` suffit : inutile d’utiliser `parse()`.",
    xpReward: 75,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
    stdin: "Ada\n",
  },
];

const conditionsIntroChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-13",
    orderIndex: 13,
    title: "Choisir entre deux messages",
    concept: "Premier `if / else`",
    summary: "Découvrir une condition sans ajouter la complexité de l’entrée au même moment.",
    missionText:
      "Déclarez `let energy = 12;`. Affichez `Niveau suffisant` si `energy` est supérieur ou égal à `10`, sinon `Niveau faible`.",
    lessonSections: [
      {
        heading: "Une condition produit un booléen",
        content: "Une expression comme `energy >= 10` vaut soit `true`, soit `false`.",
      },
      {
        heading: "Deux chemins possibles",
        content: "`if` exécute le bloc du haut si la condition est vraie, sinon Rust passe dans `else`.",
      },
    ],
    exampleCode: 'fn main() {\n    let energy = 12;\n\n    if energy >= 10 {\n        println!("Niveau suffisant");\n    } else {\n        println!("Niveau faible");\n    }\n}',
    instructions: [
      "Déclarez la variable `energy`.",
      "Écrivez une condition `energy >= 10`.",
      "Affichez le bon message selon le résultat.",
    ],
    expectedOutput: "Niveau suffisant",
    hint: "Commencez par écrire les deux blocs `if { ... } else { ... }` avant d’ajouter la condition.",
    xpReward: 78,
    estimatedDurationMinutes: 9,
    difficulty: "beginner",
  },
];

const conditionsInputChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-14",
    orderIndex: 14,
    title: "Contrôler un accès lu dans l’entrée",
    concept: "Condition sur une valeur lue",
    summary: "Réutiliser une valeur lue dans `stdin` pour prendre une décision simple.",
    missionText:
      "L’entrée standard contient un âge. Affichez `Accès autorisé` si l’âge est supérieur ou égal à `18`, sinon `Accès refusé`.",
    lessonSections: [
      {
        heading: "Reprendre le schéma `stdin` déjà connu",
        content: "On relit exactement le schéma déjà travaillé : `String::new()`, `read_line()`, `trim()`, `parse()`. La nouveauté n’est plus la lecture, mais la décision conditionnelle basée sur la valeur lue.",
      },
      {
        heading: "Traduire la règle mot à mot",
        content: "Ici, la règle métier est simple : autoriser si l’âge est supérieur ou égal à 18.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    let age: i32 = input.trim().parse().unwrap();\n\n    if age >= 18 {\n        println!("Accès autorisé");\n    } else {\n        println!("Accès refusé");\n    }\n}',
    instructions: [
      "Lisez l’âge depuis l’entrée standard.",
      "Convertissez-le en `i32`.",
      "Affichez le message correspondant à la règle `>= 18`.",
    ],
    expectedOutput: "Accès autorisé",
    hint: "Reprenez le schéma déjà vu : `read_line()` puis `trim().parse()` avant d’écrire le `if / else`.",
    xpReward: 84,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
    stdin: "19\n",
  },
];

const conditionsCalculationChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15",
    orderIndex: 15,
    title: "Détecter pair ou impair",
    concept: "Condition avec calcul",
    summary: "Combiner un petit calcul et une condition pour classer une valeur.",
    missionText: "L’entrée standard contient un entier. Affichez `pair` si le nombre est divisible par `2`, sinon `impair`.",
    lessonSections: [
      {
        heading: "Le reste d’une division",
        content: "L’opérateur `%` renvoie le reste. Un nombre pair laisse un reste de `0` quand on le divise par `2`.",
      },
      {
        heading: "Réutiliser sans repartir de zéro",
        content: "La lecture et la conversion doivent maintenant devenir naturelles. L’attention peut se porter sur le nouveau calcul `value % 2 == 0` et sur la décision qui en découle.",
      },
    ],
    exampleCode: 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    let value: i32 = input.trim().parse().unwrap();\n\n    if value % 2 == 0 {\n        println!("pair");\n    } else {\n        println!("impair");\n    }\n}',
    instructions: [
      "Lisez l’entier fourni.",
      "Testez `value % 2 == 0`.",
      "Affichez `pair` ou `impair` selon le résultat.",
    ],
    expectedOutput: "pair",
    hint: "Un nombre pair donne `0` quand on calcule son reste modulo `2`.",
    xpReward: 90,
    estimatedDurationMinutes: 11,
    difficulty: "beginner",
    stdin: "8\n",
  },
];

const projectPreparationCargoChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15-project-cargo",
    orderIndex: 15.11,
    title: "Repérer le manifeste Cargo",
    concept: "Structure d’un projet Rust",
    summary: "Identifier `Cargo.toml` et les fichiers clés que vous retrouverez dans le premier projet.",
    missionText:
      "Déclarez `let manifest = \"Cargo.toml\";` puis affichez `Cargo.toml`, puis `src/main.rs`, chacun sur sa propre ligne.",
    lessonSections: [
      {
        heading: "Le rôle de `Cargo.toml`",
        content: "`Cargo.toml` n’est pas du code Rust : c’est le manifeste du projet. Il décrit le paquet et aide Cargo à savoir quoi compiler.",
      },
      {
        heading: "Mémoriser la structure de base",
        content: "Avant un vrai projet multi-fichiers, il est utile de reconnaître les noms de fichiers que vous allez croiser : `Cargo.toml`, `src/main.rs`, puis des modules comme `src/status.rs`.",
      },
    ],
    exampleCode: 'fn main() {\n    let manifest = "Cargo.toml";\n    println!("{}", manifest);\n    println!("src/main.rs");\n}',
    instructions: [
      "Créez la variable `manifest`.",
      "Affichez `Cargo.toml` sur la première ligne.",
      "Affichez `src/main.rs` sur la deuxième ligne.",
    ],
    expectedOutput: "Cargo.toml\nsrc/main.rs",
    hint: "L’objectif ici est surtout de retenir les deux premiers fichiers du projet.",
    xpReward: 94,
    estimatedDurationMinutes: 8,
    difficulty: "beginner",
  },
];

const projectPreparationModuleChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15-project-mod",
    orderIndex: 15.12,
    title: "Créer un premier module avec `mod`",
    concept: "Modules",
    summary: "Placer une petite fonction dans un module nommé pour commencer à séparer les responsabilités.",
    missionText:
      "Créez un module `messages` qui contient une fonction `pub fn ready()`. Cette fonction affiche `Canal prêt`. Depuis `main`, appelez `messages::ready()`.",
    lessonSections: [
      {
        heading: "À quoi sert `mod`",
        content: "`mod` permet de regrouper du code sous un nom. Dans un projet réel, cela correspond souvent à un fichier séparé comme `messages.rs` ou `status.rs`.",
      },
      {
        heading: "Séparer sans encore complexifier",
        content: "Ici, le module reste dans le même fichier pour apprendre le geste. Plus tard, vous retrouverez la même idée répartie sur plusieurs fichiers.",
      },
      {
        heading: "Une fonction qui agit directement",
        content: "Pour rester concentré sur `mod`, la fonction du module affiche directement le message. Elle ne renvoie rien : pas besoin d’ajouter un type de retour pour ce premier pas.",
      },
    ],
    exampleCode:
      'mod messages {\n    pub fn ready() {\n        println!("Canal prêt");\n    }\n}\n\nfn main() {\n    messages::ready();\n}',
    instructions: [
      "Créez le module `messages` avec `mod messages { ... }`.",
      "Ajoutez une fonction `pub fn ready()` qui affiche `Canal prêt`.",
      "Appelez cette fonction depuis `main` avec `messages::ready()`.",
    ],
    expectedOutput: "Canal prêt",
    hint: "Le chemin `messages::ready()` permet d’appeler une fonction rangée dans le module.",
    xpReward: 98,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
  },
];

const projectPreparationVisibilityChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15-project-pub",
    orderIndex: 15.13,
    title: "Ouvrir l’accès avec `pub`",
    concept: "Visibilité",
    summary: "Comprendre qu’une fonction doit être rendue visible pour être appelée depuis l’extérieur du module.",
    missionText:
      "Créez un module `status` avec une fonction `pub fn afficher()`. Cette fonction affiche `STATUT prêt`. Depuis `main`, appelez `status::afficher()`.",
    lessonSections: [
      {
        heading: "Privé par défaut",
        content: "Dans Rust, ce qui est écrit dans un module reste privé par défaut. Si `main` est à l’extérieur du module `status`, il ne peut pas appeler librement toutes les fonctions internes du module.",
      },
      {
        heading: "Sans `pub`",
        content: "Si vous écrivez `fn afficher()` dans `mod status`, la fonction existe bien, mais elle reste interne au module. Un appel depuis `main` avec `status::afficher()` est refusé par le compilateur, car la fonction est privée.",
      },
      {
        heading: "Avec `pub`",
        content: "`pub fn afficher()` signifie : cette fonction fait partie de l’interface visible du module. Le module garde son organisation interne, mais il expose volontairement ce que le reste du programme peut utiliser.",
      },
      {
        heading: "Pourquoi c’est utile",
        content: "`pub` évite de tout rendre accessible par accident. Dans un projet multi-fichiers, vous pouvez garder des détails cachés dans un module et n’ouvrir que quelques fonctions stables, comme des points d’entrée propres.",
      },
    ],
    exampleCode:
      'mod status {\n    pub fn afficher() {\n        println!("STATUT prêt");\n    }\n}\n\nfn main() {\n    status::afficher();\n}',
    instructions: [
      "Créez le module `status`.",
      "Déclarez `pub fn afficher()` dans ce module.",
      "Affichez `STATUT prêt` dans la fonction `afficher`.",
      "Depuis `main`, appelez `status::afficher()`.",
    ],
    expectedOutput: "STATUT prêt",
    hint: "Sans `pub`, la fonction ne fait pas encore partie de l’interface visible du module.",
    xpReward: 104,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
  },
];

const advancedStructuresChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15a",
    orderIndex: 15.61,
    title: "Décomposer un tuple",
    concept: "Tuples",
    summary: "Regrouper plusieurs valeurs dans une même structure puis les relire proprement.",
    missionText:
      "Créez le tuple `position` valant `(3, 7)`. Récupérez ses deux valeurs dans `x` et `y`, puis affichez `3 7`.",
    lessonSections: [
      {
        heading: "Regrouper des données liées",
        content: "Un tuple permet de stocker plusieurs valeurs dans un seul objet, sans encore créer une structure nommée plus complexe.",
      },
      {
        heading: "Déstructurer",
        content: "La syntaxe `let (x, y) = position;` permet de retrouver chaque partie du tuple proprement.",
      },
    ],
    exampleCode: 'fn main() {\n    let position = (3, 7);\n    let (x, y) = position;\n    println!("{} {}", x, y);\n}',
    instructions: [
      "Créez le tuple `position`.",
      "Déstructurez-le dans deux variables.",
      "Affichez `x` puis `y` sur une seule ligne.",
    ],
    expectedOutput: "3 7",
    hint: "Rust accepte `let (x, y) = position;`.",
    xpReward: 92,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
  },
  {
    id: "rust-level-15b",
    orderIndex: 15.62,
    title: "Lire dans un tableau fixe",
    concept: "Tableaux",
    summary: "Stocker plusieurs valeurs puis accéder à une case précise.",
    missionText:
      "Créez le tableau `measures` valant `[12, 15, 11]`. Affichez la deuxième mesure, puis la troisième, sur deux lignes.",
    lessonSections: [
      {
        heading: "Un tableau garde un ordre fixe",
        content: "Dans un tableau, chaque valeur a une position appelée indice.",
      },
      {
        heading: "Compter à partir de 0",
        content: "En Rust, le premier élément a l’indice `0`, le deuxième l’indice `1`, etc.",
      },
    ],
    exampleCode: 'fn main() {\n    let measures = [12, 15, 11];\n    println!("{}", measures[1]);\n    println!("{}", measures[2]);\n}',
    instructions: [
      "Créez le tableau demandé.",
      "Accédez à `measures[1]` puis `measures[2]`.",
      "Affichez les deux valeurs dans cet ordre.",
    ],
    expectedOutput: "15\n11",
    hint: "Le deuxième élément est à l’indice `1`.",
    xpReward: 96,
    estimatedDurationMinutes: 10,
    difficulty: "beginner",
  },
];

const advancedConditionsChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15c-read-all-input",
    orderIndex: 15.705,
    title: "Lire toute l’entrée puis séparer les lignes",
    concept: "`read_to_string` et `lines()`",
    summary: "Passer de `read_line` à une lecture complète quand un exercice fournit plusieurs lignes.",
    missionText:
      "L’entrée standard contient un secteur puis un code, sur deux lignes. Lisez toute l’entrée avec `read_to_string`, récupérez les deux lignes avec `lines().next()`, puis affichez `Secteur: Nord` et `Code: A7`.",
    lessonSections: [
      {
        heading: "Pourquoi ne plus utiliser seulement `read_line`",
        content: "`read_line()` lit une ligne à la fois. Quand un exercice fournit plusieurs lignes, on peut soit appeler `read_line()` plusieurs fois, soit lire toute l’entrée d’un coup avec `read_to_string()`.",
      },
      {
        heading: "Importer `Read`",
        content: "`read_to_string()` vient du trait `Read`. C’est pour cela qu’on écrit `use std::io::{self, Read};` : `io` donne accès à `stdin()`, et `Read` rend la méthode `read_to_string()` disponible.",
      },
      {
        heading: "Découper avec `lines()`",
        content: "`input.lines()` ne renvoie pas directement une ligne : il prépare un parcours ligne par ligne. On le stocke souvent dans `let mut lines = input.lines();` pour demander ensuite la prochaine ligne.",
      },
      {
        heading: "`next()` et `unwrap_or()`",
        content: "`lines.next()` donne la prochaine ligne si elle existe. Comme elle peut manquer, `unwrap_or(\"...\")` fournit une valeur de secours au lieu d’arrêter le programme. C’est plus prudent que `unwrap()` pour une entrée incomplète.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n\n    let mut lines = input.lines();\n    let sector = lines.next().unwrap_or(\"inconnu\").trim();\n    let code = lines.next().unwrap_or(\"aucun\").trim();\n\n    println!(\"Secteur: {}\", sector);\n    println!(\"Code: {}\", code);\n}',
    instructions: [
      "Importez `Read` avec `use std::io::{self, Read};`.",
      "Lisez toute l’entrée dans une `String` avec `read_to_string`.",
      "Créez `let mut lines = input.lines();`.",
      "Récupérez les deux lignes avec `lines.next().unwrap_or(...)`.",
      "Affichez le secteur puis le code au format demandé.",
    ],
    expectedOutput: "Secteur: Nord\nCode: A7",
    hint: "`lines.next()` avance d’une ligne à chaque appel. Le premier appel lit `Nord`, le second lit `A7`.",
    xpReward: 98,
    estimatedDurationMinutes: 11,
    difficulty: "beginner",
    stdin: "Nord\nA7\n",
  },
  {
    id: "rust-level-15c",
    orderIndex: 15.71,
    title: "Valider deux conditions à la fois",
    concept: "Opérateur booléen `&&`",
    summary: "N’autoriser une action que si deux règles sont vraies en même temps.",
    missionText:
      "L’entrée standard contient un âge puis une taille, sur deux lignes. Affichez `Accès ok` si l’âge est supérieur ou égal à `12` ET si la taille est supérieure ou égale à `140`, sinon `Accès refusé`.",
    lessonSections: [
      {
        heading: "Le mot “et” en Rust",
        content: "L’opérateur `&&` signifie que les deux conditions doivent être vraies en même temps.",
      },
      {
        heading: "Lire deux valeurs puis tester une règle composée",
        content: "On peut réutiliser le même schéma de lecture ligne par ligne puis assembler une règle plus riche.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n\n    let mut lines = input.lines();\n    let age: i32 = lines.next().unwrap_or("0").trim().parse().unwrap();\n    let height: i32 = lines.next().unwrap_or("0").trim().parse().unwrap();\n\n    if age >= 12 && height >= 140 {\n        println!("Accès ok");\n    } else {\n        println!("Accès refusé");\n    }\n}',
    instructions: [
      "Lisez l’âge et la taille depuis les deux lignes d’entrée.",
      "Utilisez l’opérateur `&&`.",
      "Affichez le bon message selon la règle complète.",
    ],
    expectedOutput: "Accès ok",
    hint: "La validation utilise ici `13` puis `145`.",
    xpReward: 102,
    estimatedDurationMinutes: 12,
    difficulty: "beginner",
    stdin: "13\n145\n",
  },
  {
    id: "rust-level-15d",
    orderIndex: 15.72,
    title: "Déclencher une alerte composée",
    concept: "Opérateur booléen `||`",
    summary: "Déclencher une alerte si au moins une des deux conditions est vraie.",
    missionText:
      "L’entrée standard contient une température puis une pression, sur deux lignes. Affichez `Alerte` si la température est supérieure à `90` OU si la pression est supérieure à `70`, sinon `Stable`.",
    lessonSections: [
      {
        heading: "Le mot “ou” en Rust",
        content: "L’opérateur `||` signifie qu’une seule des deux conditions suffit pour entrer dans le bloc `if`.",
      },
      {
        heading: "Lire une règle métier plus réaliste",
        content: "Certaines alertes se déclenchent dès qu’un des signaux devient critique.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n\n    let mut lines = input.lines();\n    let temperature: i32 = lines.next().unwrap_or("0").trim().parse().unwrap();\n    let pressure: i32 = lines.next().unwrap_or("0").trim().parse().unwrap();\n\n    if temperature > 90 || pressure > 70 {\n        println!("Alerte");\n    } else {\n        println!("Stable");\n    }\n}',
    instructions: [
      "Lisez les deux mesures.",
      "Utilisez l’opérateur `||`.",
      "Affichez `Alerte` ou `Stable` selon la règle.",
    ],
    expectedOutput: "Alerte",
    hint: "Une seule mesure au-dessus de son seuil suffit.",
    xpReward: 106,
    estimatedDurationMinutes: 12,
    difficulty: "beginner",
    stdin: "88\n74\n",
  },
];

const conditionalLoopsChapterSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-15e",
    orderIndex: 15.81,
    title: "Monter jusqu’au seuil",
    concept: "Boucle `while` conditionnée",
    summary: "Répéter une mise à jour tant qu’une condition reste vraie.",
    missionText:
      "Créez `let mut energy = 3;`. Tant que `energy` est strictement inférieure à `6`, ajoutez `1`. Affichez ensuite la valeur finale.",
    lessonSections: [
      {
        heading: "Répéter tant qu’une règle est vraie",
        content: "Une boucle `while` continue tant que sa condition reste vraie.",
      },
      {
        heading: "Faire évoluer l’état",
        content: "Si la variable ne change pas dans la boucle, la condition restera vraie indéfiniment.",
      },
    ],
    exampleCode: 'fn main() {\n    let mut energy = 3;\n\n    while energy < 6 {\n        energy += 1;\n    }\n\n    println!("{}", energy);\n}',
    instructions: [
      "Déclarez `energy` comme variable mutable.",
      "Écrivez une boucle `while energy < 6`.",
      "Affichez la valeur finale.",
    ],
    expectedOutput: "6",
    hint: "La boucle s’arrête dès que `energy` atteint `6`.",
    xpReward: 108,
    estimatedDurationMinutes: 11,
    difficulty: "beginner",
  },
  {
    id: "rust-level-15f",
    orderIndex: 15.82,
    title: "Compter les mesures élevées",
    concept: "Boucle avec test interne",
    summary: "Parcourir plusieurs valeurs et ne compter que celles qui valident une condition.",
    missionText:
      "Le tableau `measures` vaut `[12, 18, 9, 21]`. Comptez combien de valeurs sont supérieures ou égales à `15`, puis affichez ce total.",
    lessonSections: [
      {
        heading: "Boucle + condition",
        content: "Une boucle peut parcourir toutes les valeurs pendant qu’un `if` décide lesquelles comptent vraiment.",
      },
      {
        heading: "Accumuler un résultat",
        content: "On garde souvent un compteur que l’on augmente seulement quand la condition est vraie.",
      },
    ],
    exampleCode: 'fn main() {\n    let measures = [12, 18, 9, 21];\n    let mut count = 0;\n\n    for measure in measures {\n        if measure >= 15 {\n            count += 1;\n        }\n    }\n\n    println!("{}", count);\n}',
    instructions: [
      "Créez un compteur initialisé à `0`.",
      "Parcourez le tableau avec `for`.",
      "Augmentez le compteur seulement pour les valeurs `>= 15`.",
    ],
    expectedOutput: "2",
    hint: "Seules `18` et `21` passent le seuil.",
    xpReward: 112,
    estimatedDurationMinutes: 12,
    difficulty: "beginner",
  },
];

function buildLevelOneChapter(
  chapter: Omit<Chapter, "contents">,
  exerciseSeeds: ExerciseSeed[],
  gate: GateMeta,
): Chapter {
  const exercises = exerciseSeeds.map((seed) =>
    createExercise(seed, {
      levelId: chapter.levelId,
      levelNumber: chapter.levelNumber,
      themeId: chapter.themeId,
      chapterId: chapter.id,
      unlockRules: chapter.unlockRules,
    }),
  );

  return {
    ...chapter,
    contents: [...exercises, createGate(gate)],
  };
}

const levelOneOutputChapter = buildLevelOneChapter(
  {
    id: "level-1-output-and-sequences",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-output",
    orderIndex: 1,
    title: "Affichage et séquences",
    summary: "Apprendre à produire une sortie exacte, ligne par ligne.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "always" }],
    requiredForLevelCompletion: true,
  },
  outputChapterSeeds,
  {
    id: "gate-level-1-output",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-output",
    chapterId: "level-1-output-and-sequences",
    orderIndex: 3.5,
    title: "Palier validé — Affichage",
    summary: "La sortie console et l’ordre des instructions sont acquis.",
    message: "Vous maîtrisez la sortie exacte et les séquences d’instructions de base.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-output-and-sequences" }],
    requiredContentIds: outputChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneRepetitionChapter = buildLevelOneChapter(
  {
    id: "level-1-basic-repetition",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-repetition",
    orderIndex: 2,
    title: "Répétitions d’instructions",
    summary: "Introduire les premières boucles pour éviter la répétition manuelle.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-output-and-sequences" }],
    requiredForLevelCompletion: true,
  },
  repetitionChapterSeeds,
  {
    id: "gate-level-1-repetition",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-repetition",
    chapterId: "level-1-basic-repetition",
    orderIndex: 6.5,
    title: "Palier validé — Répétitions",
    summary: "Les premières boucles sont en place.",
    message: "Vous savez répéter une instruction avec `for` et `while` sur des cas courts.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-basic-repetition" }],
    requiredContentIds: repetitionChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneVariablesChapter = buildLevelOneChapter(
  {
    id: "level-1-variables-and-calculations",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-variables",
    orderIndex: 3,
    title: "Variables et calculs",
    summary: "Stocker, transformer et réutiliser des valeurs numériques.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-basic-repetition" }],
    requiredForLevelCompletion: true,
  },
  variablesChapterSeeds,
  {
    id: "gate-level-1-variables",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-variables",
    chapterId: "level-1-variables-and-calculations",
    orderIndex: 9.5,
    title: "Palier validé — Variables",
    summary: "Les bases du calcul impératif sont acquises.",
    message: "Vous savez déclarer, modifier et exploiter des variables simples dans vos programmes.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-variables-and-calculations" }],
    requiredContentIds: variablesChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputImportsChapter = buildLevelOneChapter(
  {
    id: "level-1-input-imports",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4,
    title: "Importer `std::io`",
    summary: "Ouvrir le thème `stdin` en important explicitement le module d’entrée standard.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-variables-and-calculations" }],
    requiredForLevelCompletion: true,
  },
  inputImportsChapterSeeds,
  {
    id: "gate-level-1-input-imports",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-imports",
    orderIndex: 9.08,
    title: "Palier validé — Import d’entrée",
    summary: "Le module `std::io` est identifié et utilisable.",
    message: "Vous savez maintenant importer `std::io` et préparer l’accès au canal d’entrée standard.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-imports" }],
    requiredContentIds: inputImportsChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputBufferChapter = buildLevelOneChapter(
  {
    id: "level-1-input-buffer",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.1,
    title: "Créer un tampon texte",
    summary: "Installer la `String` vide qui servira de réceptacle à la saisie utilisateur.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-imports" }],
    requiredForLevelCompletion: true,
  },
  inputBufferChapterSeeds,
  {
    id: "gate-level-1-input-buffer",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-buffer",
    orderIndex: 9.18,
    title: "Palier validé — Tampon texte",
    summary: "Le rôle de `String::new()` est identifié.",
    message: "Vous savez maintenant préparer une `String` vide pour y ranger une future saisie.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-buffer" }],
    requiredContentIds: inputBufferChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputReadLineChapter = buildLevelOneChapter(
  {
    id: "level-1-input-read-line",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.2,
    title: "Lire une ligne",
    summary: "Remplir le tampon avec `read_line()` et comprendre le tandem `mut` / `&mut`.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-buffer" }],
    requiredForLevelCompletion: true,
  },
  inputReadLineChapterSeeds,
  {
    id: "gate-level-1-input-read-line",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-read-line",
    orderIndex: 9.28,
    title: "Palier validé — Lecture brute",
    summary: "La lecture d’une ligne dans un tampon texte est acquise.",
    message: "Vous savez maintenant lire une ligne dans `stdin` et la stocker dans une `String` modifiable.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-read-line" }],
    requiredContentIds: inputReadLineChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputTrimChapter = buildLevelOneChapter(
  {
    id: "level-1-input-trim",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.3,
    title: "Nettoyer l’entrée",
    summary: "Utiliser `trim()` pour retirer proprement les retours à la ligne et espaces parasites.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-read-line" }],
    requiredForLevelCompletion: true,
  },
  inputTrimChapterSeeds,
  {
    id: "gate-level-1-input-trim",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-trim",
    orderIndex: 9.38,
    title: "Palier validé — Nettoyage",
    summary: "Le nettoyage d’une ligne lue est compris.",
    message: "Vous savez maintenant retirer le retour à la ligne final avant d’afficher ou de convertir une valeur.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-trim" }],
    requiredContentIds: inputTrimChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputParseChapter = buildLevelOneChapter(
  {
    id: "level-1-input-parse",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.4,
    title: "Convertir une valeur",
    summary: "Passer du texte à un entier simple avec `trim()` puis `parse()`.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-trim" }],
    requiredForLevelCompletion: true,
  },
  inputParseChapterSeeds,
  {
    id: "gate-level-1-input-parse",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-parse",
    orderIndex: 10.5,
    title: "Palier validé — Conversion simple",
    summary: "Le passage d’une chaîne à un entier simple est en place.",
    message: "Vous savez maintenant reconnaître quand un texte doit être converti en entier pour être calculé.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-parse" }],
    requiredContentIds: inputParseChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputTwoLinesChapter = buildLevelOneChapter(
  {
    id: "level-1-input-two-lines",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.5,
    title: "Lire deux lignes",
    summary: "Répéter le schéma lecture → nettoyage → conversion sur deux valeurs distinctes.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-parse" }],
    requiredForLevelCompletion: true,
  },
  inputTwoLinesChapterSeeds,
  {
    id: "gate-level-1-input-two-lines",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-two-lines",
    orderIndex: 11.5,
    title: "Palier validé — Deux lignes",
    summary: "La répétition du schéma sur plusieurs lignes est acquise.",
    message: "Vous savez maintenant lire deux lignes séparées et appliquer le même traitement à chacune.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-two-lines" }],
    requiredContentIds: inputTwoLinesChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneInputTextReuseChapter = buildLevelOneChapter(
  {
    id: "level-1-input-text-reuse",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    orderIndex: 4.6,
    title: "Réutiliser du texte",
    summary: "Reconnaître qu’une valeur lue peut parfois rester une chaîne, sans conversion.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-two-lines" }],
    requiredForLevelCompletion: true,
  },
  inputTextReuseChapterSeeds,
  {
    id: "gate-level-1-input-text-reuse",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-input",
    chapterId: "level-1-input-text-reuse",
    orderIndex: 12.5,
    title: "Palier validé — Entrée standard",
    summary: "La lecture, le nettoyage, la conversion simple et la réutilisation texte sont en place.",
    message: "Vous savez maintenant importer `std::io`, préparer un tampon, lire une ou deux lignes, nettoyer le texte reçu, convertir un entier simple et reconnaître quand une valeur peut rester une chaîne.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-text-reuse" }],
    requiredContentIds: inputTextReuseChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneConditionsChapter = buildLevelOneChapter(
  {
    id: "level-1-conditions",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    orderIndex: 5,
    title: "Tests et conditions",
    summary: "Découvrir `if / else` sur des cas simples puis le relier à des valeurs lues.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-text-reuse" }],
    requiredForLevelCompletion: true,
  },
  conditionsIntroChapterSeeds,
  {
    id: "gate-level-1-conditions",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    chapterId: "level-1-conditions",
    orderIndex: 15.5,
    title: "Palier validé — Conditions",
    summary: "Les premières décisions conditionnelles sont en place.",
    message: "Vous savez déjà écrire un `if / else`, comparer des valeurs et réutiliser ce résultat dans un programme court.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions" }],
    requiredContentIds: conditionsIntroChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneConditionsInputChapter = buildLevelOneChapter(
  {
    id: "level-1-conditions-input",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    orderIndex: 5.1,
    title: "Conditions sur une valeur lue",
    summary: "Réutiliser le schéma `stdin` déjà appris pour prendre une première décision sur une valeur entrée.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions" }],
    requiredForLevelCompletion: true,
  },
  conditionsInputChapterSeeds,
  {
    id: "gate-level-1-conditions-input",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    chapterId: "level-1-conditions-input",
    orderIndex: 14.5,
    title: "Palier validé — Condition sur entrée",
    summary: "La décision conditionnelle sur une valeur lue est en place.",
    message: "Vous savez maintenant relire une valeur dans `stdin`, la convertir puis la comparer dans un `if / else`.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions-input" }],
    requiredContentIds: conditionsInputChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneConditionsCalculationChapter = buildLevelOneChapter(
  {
    id: "level-1-conditions-calculation",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    orderIndex: 5.2,
    title: "Conditions avec petit calcul",
    summary: "Faire devenir la lecture d’entrée une routine, puis ajouter un calcul court dans la condition.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions-input" }],
    requiredForLevelCompletion: true,
  },
  conditionsCalculationChapterSeeds,
  {
    id: "gate-level-1-conditions-calculation",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditions",
    chapterId: "level-1-conditions-calculation",
    orderIndex: 15.5,
    title: "Palier validé — Conditions",
    summary: "Les premières décisions conditionnelles sont en place, avec réutilisation de l’entrée standard.",
    message: "Vous savez déjà écrire un `if / else`, relire une valeur dans `stdin`, la convertir puis réutiliser ce résultat dans un petit calcul conditionnel.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions-calculation" }],
    requiredContentIds: conditionsCalculationChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneProjectCargoChapter = buildLevelOneChapter(
  {
    id: "level-1-project-cargo",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    orderIndex: 5.3,
    title: "Comprendre `Cargo.toml`",
    summary: "Reconnaître les fichiers de base d’un projet Rust avant d’ouvrir le premier workspace multi-fichiers.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions-calculation" }],
    requiredForLevelCompletion: true,
  },
  projectPreparationCargoChapterSeeds,
  {
    id: "gate-level-1-project-cargo",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    chapterId: "level-1-project-cargo",
    orderIndex: 15.14,
    title: "Palier validé — Structure projet",
    summary: "Les premiers repères d’un projet Rust sont mémorisés.",
    message: "Vous savez maintenant reconnaître `Cargo.toml` et `src/main.rs`, les deux premiers repères du projet Rust à venir.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-cargo" }],
    requiredContentIds: projectPreparationCargoChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneProjectModuleChapter = buildLevelOneChapter(
  {
    id: "level-1-project-mod",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    orderIndex: 5.31,
    title: "Créer un module avec `mod`",
    summary: "Apprendre à ranger une petite fonction dans un module nommé avant le vrai multi-fichiers.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-cargo" }],
    requiredForLevelCompletion: true,
  },
  projectPreparationModuleChapterSeeds,
  {
    id: "gate-level-1-project-mod",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    chapterId: "level-1-project-mod",
    orderIndex: 15.24,
    title: "Palier validé — Modules",
    summary: "Le mot-clé `mod` et la logique de séparation sont en place.",
    message: "Vous savez maintenant ranger une fonction dans un module et l’appeler avec une notation du type `messages::ready()`.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-mod" }],
    requiredContentIds: projectPreparationModuleChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneProjectVisibilityChapter = buildLevelOneChapter(
  {
    id: "level-1-project-pub",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    orderIndex: 5.32,
    title: "Rendre une fonction visible avec `pub`",
    summary: "Comprendre comment ouvrir une fonction de module avant le premier vrai projet.",
    estimatedProblemCount: 1,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-mod" }],
    requiredForLevelCompletion: true,
  },
  projectPreparationVisibilityChapterSeeds,
  {
    id: "gate-level-1-project-pub",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    chapterId: "level-1-project-pub",
    orderIndex: 15.34,
    title: "Palier validé — Visibilité",
    summary: "Les bases de `pub` sont prêtes pour le premier projet multi-fichiers.",
    message: "Vous savez maintenant qu’une fonction peut rester privée par défaut et qu’il faut `pub` pour en faire une interface visible.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-pub" }],
    requiredContentIds: projectPreparationVisibilityChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneAdvancedStructuresChapter = buildLevelOneChapter(
  {
    id: "level-1-advanced-structures",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-advanced-structures",
    orderIndex: 5.5,
    title: "Structures avancées",
    summary: "Découvrir tuples et tableaux fixes pour organiser plusieurs valeurs simplement.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_content", contentId: "project-level-1-core-console" }],
    requiredForLevelCompletion: true,
  },
  advancedStructuresChapterSeeds,
  {
    id: "gate-level-1-advanced-structures",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-advanced-structures",
    chapterId: "level-1-advanced-structures",
    orderIndex: 15.65,
    title: "Palier validé — Structures avancées",
    summary: "Les premières structures groupées sont disponibles.",
    message: "Vous savez maintenant regrouper des valeurs avec un tuple ou un tableau fixe et les relire proprement.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-structures" }],
    requiredContentIds: advancedStructuresChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneAdvancedConditionsChapter = buildLevelOneChapter(
  {
    id: "level-1-advanced-conditions",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-advanced-conditions",
    orderIndex: 6,
    title: "Conditions avancées, opérateurs booléens",
    summary: "Assembler plusieurs règles avec `&&` et `||`.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-structures" }],
    requiredForLevelCompletion: true,
  },
  advancedConditionsChapterSeeds,
  {
    id: "gate-level-1-advanced-conditions",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-advanced-conditions",
    chapterId: "level-1-advanced-conditions",
    orderIndex: 15.75,
    title: "Palier validé — Conditions avancées",
    summary: "Les opérateurs booléens permettent maintenant d’écrire des règles composées.",
    message: "Vous savez combiner plusieurs tests avec `&&` et `||` pour traduire une règle plus réaliste.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-conditions" }],
    requiredContentIds: advancedConditionsChapterSeeds.map((seed) => seed.id),
  },
);

const levelOneConditionalLoopsChapter = buildLevelOneChapter(
  {
    id: "level-1-conditional-loops",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditional-loops",
    orderIndex: 6.5,
    title: "Répétitions conditionnées",
    summary: "Répéter tant qu’une règle reste vraie puis combiner boucle et test interne.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-conditions" }],
    requiredForLevelCompletion: true,
  },
  conditionalLoopsChapterSeeds,
  {
    id: "gate-level-1-conditional-loops",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditional-loops",
    chapterId: "level-1-conditional-loops",
    orderIndex: 15.85,
    title: "Palier validé — Répétitions conditionnées",
    summary: "Les boucles pilotées par une condition sont utilisables sur des cas simples.",
    message: "Vous savez maintenant faire évoluer un état dans une boucle et compter seulement les valeurs qui passent un test.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditional-loops" }],
    requiredContentIds: conditionalLoopsChapterSeeds.map((seed) => seed.id),
  },
);

function buildStructuredChapter(
  chapter: Omit<Chapter, "contents">,
  exercises: ExerciseContent[],
  gateMeta: GateMeta | null,
): Chapter {
  return {
    ...chapter,
    contents: gateMeta ? [...exercises, createGate(gateMeta)] : exercises,
  };
}

const levelTwoFloatsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-16",
    orderIndex: 16,
    title: "Stabiliser une mesure",
    concept: "Nombres à virgule",
    summary: "Déclarer un `f64` et afficher une mesure décimale proprement.",
    missionText: "Déclarez une variable `temperature` valant `12.5` puis affichez-la exactement.",
    lessonSections: [
      {
        heading: "Utiliser un flottant",
        content: "En Rust, `f64` sert à manipuler des nombres à virgule avec une bonne précision par défaut.",
      },
      {
        heading: "Garder une sortie stable",
        content: "Sur un exercice court, la sortie attendue reste exacte même quand la valeur est décimale.",
      },
    ],
    exampleCode: 'fn main() {\n    let value = 3.5_f64;\n    println!("{}", value);\n}',
    instructions: [
      "Déclarez `temperature` avec la valeur `12.5`.",
      "Affichez uniquement cette valeur.",
      "Ne rajoutez aucun autre texte.",
    ],
    expectedOutput: "12.5",
    hint: "Le suffixe `_f64` est facultatif ici, mais peut rendre l’intention plus claire.",
    xpReward: 60,
    estimatedDurationMinutes: 7,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-17",
    orderIndex: 17,
    title: "Moyenne de deux relevés",
    concept: "Calculs sur `f64`",
    summary: "Lire deux valeurs décimales puis calculer leur moyenne.",
    missionText: "Lisez deux nombres à virgule depuis `stdin`, calculez leur moyenne et affichez-la avec deux décimales.",
    lessonSections: [
      {
        heading: "Convertir en `f64`",
        content: "La conversion avec `.parse::<f64>()` permet de réutiliser le schéma de lecture déjà vu sur les entiers.",
      },
      {
        heading: "Formater une décimale",
        content: "Le format `{:.2}` force l’affichage à deux chiffres après la virgule.",
      },
    ],
    exampleCode: 'fn main() {\n    let left = 12.0_f64;\n    let right = 18.5_f64;\n    println!("{:.2}", (left + right) / 2.0);\n}',
    instructions: [
      "Lisez deux lignes dans `stdin`.",
      "Convertissez-les en `f64`.",
      "Affichez la moyenne avec exactement deux décimales.",
    ],
    expectedOutput: "18.75",
    stdin: "12.5\n25.0\n",
    hint: "La formule est `(a + b) / 2.0` puis `println!(\"{:.2}\", moyenne);`.",
    xpReward: 65,
    estimatedDurationMinutes: 9,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-18",
    orderIndex: 18,
    title: "Arrondir un relevé",
    concept: "Méthodes sur les flottants",
    summary: "Utiliser une méthode standard pour arrondir une valeur décimale.",
    missionText: "Déclarez `reading = 18.6` puis affichez la valeur arrondie.",
    lessonSections: [
      {
        heading: "Méthodes numériques",
        content: "Les flottants disposent de méthodes utiles comme `.round()`, `.floor()` et `.ceil()`.",
      },
      {
        heading: "Observer le type retourné",
        content: "`.round()` retourne encore un flottant ; l’affichage peut néanmoins donner une valeur entière lisible.",
      },
    ],
    exampleCode: 'fn main() {\n    let value = 18.6_f64;\n    println!("{}", value.round());\n}',
    instructions: [
      "Déclarez `reading` avec `18.6`.",
      "Utilisez `.round()`.",
      "Affichez le résultat.",
    ],
    expectedOutput: "19",
    hint: "La méthode `.round()` s’appelle directement sur la variable flottante.",
    xpReward: 70,
    estimatedDurationMinutes: 8,
    difficulty: "intermediate",
  },
];

const levelTwoFloatsExercises = levelTwoFloatsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-floats",
    chapterId: "level-2-floats-and-tools",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-1" }],
  }),
);

const levelTwoFloatsChapter = buildStructuredChapter(
  {
    id: "level-2-floats-and-tools",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-floats",
    orderIndex: 1,
    title: "Nombres à virgule et outils",
    summary: "Manipuler des `f64`, calculer et contrôler le format de sortie.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-1" }],
    requiredForLevelCompletion: true,
  },
  levelTwoFloatsExercises,
  {
    id: "gate-level-2-floats",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-floats",
    chapterId: "level-2-floats-and-tools",
    orderIndex: 18.5,
    title: "Palier validé — Décimales",
    summary: "Les flottants et leur format sont maîtrisés sur des cas courts.",
    message: "Vous savez maintenant lire, calculer et afficher des valeurs décimales de manière stable.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-floats-and-tools" }],
    requiredContentIds: levelTwoFloatsExercises.map((exercise) => exercise.id),
  },
);

const levelTwoArraysSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-19",
    orderIndex: 19,
    title: "Lire un élément du tableau",
    concept: "Tableaux",
    summary: "Créer un tableau fixe puis accéder à un élément par index.",
    missionText: "Créez un tableau `[4, 8, 15]` puis affichez son deuxième élément.",
    lessonSections: [
      {
        heading: "Tableau de taille fixe",
        content: "Un tableau Rust connaît sa taille à la compilation, ce qui le rend très stable pour des données courtes.",
      },
      {
        heading: "Accéder par index",
        content: "L’indexation commence à `0`, donc le deuxième élément se lit avec `[1]`.",
      },
    ],
    exampleCode: 'fn main() {\n    let values = [10, 20, 30];\n    println!("{}", values[1]);\n}',
    instructions: [
      "Déclarez le tableau exact `[4, 8, 15]`.",
      "Accédez au deuxième élément.",
      "Affichez uniquement cette valeur.",
    ],
    expectedOutput: "8",
    hint: "Le deuxième élément d’un tableau se lit avec l’index `1`.",
    xpReward: 70,
    estimatedDurationMinutes: 7,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-20",
    orderIndex: 20,
    title: "Additionner trois mesures",
    concept: "Boucle sur tableau",
    summary: "Parcourir un tableau et agréger ses valeurs.",
    missionText: "Créez le tableau `[5, 6, 7]`, calculez la somme de ses éléments avec une boucle puis affichez le total.",
    lessonSections: [
      {
        heading: "Parcourir un tableau",
        content: "Vous pouvez itérer sur un tableau avec `for value in values { ... }`.",
      },
      {
        heading: "Accumuler un résultat",
        content: "Une variable mutable sert souvent d’accumulateur lors d’un parcours.",
      },
    ],
    exampleCode: 'fn main() {\n    let values = [1, 2, 3];\n    let mut total = 0;\n\n    for value in values {\n        total += value;\n    }\n\n    println!("{}", total);\n}',
    instructions: [
      "Créez le tableau `[5, 6, 7]`.",
      "Utilisez une boucle pour additionner les éléments.",
      "Affichez la somme finale.",
    ],
    expectedOutput: "18",
    hint: "Commencez avec `let mut total = 0;` puis ajoutez chaque valeur dans la boucle.",
    xpReward: 75,
    estimatedDurationMinutes: 8,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-21",
    orderIndex: 21,
    title: "Trouver la valeur maximale",
    concept: "Comparaison dans un tableau",
    summary: "Scanner un tableau et conserver la meilleure valeur rencontrée.",
    missionText: "Créez le tableau `[3, 12, 9, 7]`, trouvez la valeur maximale et affichez-la.",
    lessonSections: [
      {
        heading: "Balayage simple",
        content: "Un premier problème algorithmique consiste souvent à parcourir une séquence une seule fois.",
      },
      {
        heading: "Conserver le meilleur candidat",
        content: "On initialise souvent une variable avec la première valeur puis on la met à jour si mieux apparaît.",
      },
    ],
    exampleCode: 'fn main() {\n    let values = [3, 12, 9, 7];\n    let mut best = values[0];\n\n    for value in values {\n        if value > best {\n            best = value;\n        }\n    }\n\n    println!("{}", best);\n}',
    instructions: [
      "Parcourez le tableau une seule fois.",
      "Conservez la plus grande valeur vue jusqu’ici.",
      "Affichez-la à la fin.",
    ],
    expectedOutput: "12",
    hint: "Initialisez `best` avec `values[0]` avant la boucle.",
    xpReward: 80,
    estimatedDurationMinutes: 10,
    difficulty: "intermediate",
  },
];

const levelTwoArraysExercises = levelTwoArraysSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-arrays",
    chapterId: "level-2-arrays",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-floats-and-tools" }],
  }),
);

const levelTwoArraysChapter = buildStructuredChapter(
  {
    id: "level-2-arrays",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-arrays",
    orderIndex: 2,
    title: "Découverte des tableaux",
    summary: "Stocker plusieurs valeurs fixes puis les parcourir proprement.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-floats-and-tools" }],
    requiredForLevelCompletion: true,
  },
  levelTwoArraysExercises,
  {
    id: "gate-level-2-arrays",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-arrays",
    chapterId: "level-2-arrays",
    orderIndex: 21.5,
    title: "Palier validé — Tableaux",
    summary: "Les premiers parcours de séquences sont en place.",
    message: "Vous savez indexer, parcourir et agréger des tableaux simples.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-arrays" }],
    requiredContentIds: levelTwoArraysExercises.map((exercise) => exercise.id),
  },
);

const levelTwoStringsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-22",
    orderIndex: 22,
    title: "Compter après nettoyage",
    concept: "Chaînes de caractères",
    summary: "Lire du texte, le nettoyer puis mesurer sa longueur.",
    missionText: "Lisez une ligne dans `stdin`, appliquez `trim()` puis affichez la longueur du texte nettoyé.",
    lessonSections: [
      {
        heading: "Nettoyer une entrée texte",
        content: "`trim()` retire les espaces et retours à la ligne en début et fin de chaîne.",
      },
      {
        heading: "Mesurer une chaîne simple",
        content: "Sur des entrées ASCII simples, `len()` donne une mesure pratique pour débuter.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    println!("{}", input.trim().len());\n}',
    instructions: [
      "Lisez le texte depuis `stdin`.",
      "Nettoyez-le avec `trim()`.",
      "Affichez sa longueur.",
    ],
    expectedOutput: "4",
    stdin: " rust \n",
    hint: "Le plus simple est `println!(\"{}\", input.trim().len());`.",
    xpReward: 80,
    estimatedDurationMinutes: 9,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-23",
    orderIndex: 23,
    title: "Assembler un identifiant",
    concept: "Formatage de chaînes",
    summary: "Composer une chaîne claire à partir de deux valeurs.",
    missionText: "Créez `name = \"node-alpha\"` et `status = \"online\"`, puis affichez `node-alpha:online`.",
    lessonSections: [
      {
        heading: "Réutiliser `format!`",
        content: "`format!` construit une chaîne sans l’afficher immédiatement.",
      },
      {
        heading: "Séparer les responsabilités",
        content: "Construire d’abord le texte, puis l’afficher, rend souvent le code plus lisible.",
      },
    ],
    exampleCode: 'fn main() {\n    let label = format!("{}:{}", "node", "ready");\n    println!("{}", label);\n}',
    instructions: [
      "Déclarez `name` et `status`.",
      "Assemblez-les avec `:` entre les deux.",
      "Affichez la chaîne finale.",
    ],
    expectedOutput: "node-alpha:online",
    hint: "La macro `format!(\"{}:{}\", name, status)` fait exactement cela.",
    xpReward: 85,
    estimatedDurationMinutes: 8,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-24",
    orderIndex: 24,
    title: "Compter les mots",
    concept: "Découpage de texte",
    summary: "Découper une ligne de texte en éléments exploitables.",
    missionText: "Lisez une ligne puis affichez combien de mots elle contient en utilisant `split_whitespace()`.",
    lessonSections: [
      {
        heading: "Découper proprement",
        content: "`split_whitespace()` gère naturellement plusieurs espaces entre les mots.",
      },
      {
        heading: "Compter un itérateur",
        content: "Un itérateur peut être directement compté avec `.count()`.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    println!("{}", input.split_whitespace().count());\n}',
    instructions: [
      "Lisez la ligne depuis `stdin`.",
      "Découpez-la en mots.",
      "Affichez le nombre obtenu.",
    ],
    expectedOutput: "3",
    stdin: "core quest rust\n",
    hint: "La chaîne complète peut être comptée avec `input.split_whitespace().count()`.",
    xpReward: 90,
    estimatedDurationMinutes: 10,
    difficulty: "intermediate",
  },
];

const levelTwoStringsExercises = levelTwoStringsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-strings",
    chapterId: "level-2-strings",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-arrays" }],
  }),
);

const levelTwoStringsChapter = buildStructuredChapter(
  {
    id: "level-2-strings",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-strings",
    orderIndex: 3,
    title: "Chaînes de caractères",
    summary: "Nettoyer, formater et découper du texte dans des cas courts et fiables.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-arrays" }],
    requiredForLevelCompletion: true,
  },
  levelTwoStringsExercises,
  {
    id: "gate-level-2-strings",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-strings",
    chapterId: "level-2-strings",
    orderIndex: 24.5,
    title: "Palier validé — Chaînes",
    summary: "Le texte peut maintenant être transformé de plusieurs façons.",
    message: "Vous savez nettoyer une ligne, assembler une chaîne et découper un texte simple en plusieurs morceaux.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-strings" }],
    requiredContentIds: levelTwoStringsExercises.map((exercise) => exercise.id),
  },
);

const levelTwoFunctionsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-25",
    orderIndex: 25,
    title: "Extraire un calcul dans une fonction",
    concept: "Fonctions",
    summary: "Déplacer un calcul simple dans une fonction réutilisable.",
    missionText: "Créez une fonction `square` qui retourne le carré d’un entier, puis affichez `square(6)`.",
    lessonSections: [
      {
        heading: "Déclarer une fonction",
        content: "Une fonction Rust décrit ses paramètres et son type de retour explicitement.",
      },
      {
        heading: "Retour implicite",
        content: "La dernière expression d’une fonction peut être retournée sans écrire `return`.",
      },
    ],
    exampleCode: 'fn square(value: i32) -> i32 {\n    value * value\n}\n\nfn main() {\n    println!("{}", square(6));\n}',
    instructions: [
      "Déclarez `fn square(value: i32) -> i32`.",
      "Retournez le carré de `value`.",
      "Affichez le résultat de `square(6)`.",
    ],
    expectedOutput: "36",
    hint: "La fonction peut simplement se terminer par `value * value`.",
    xpReward: 90,
    estimatedDurationMinutes: 9,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-26",
    orderIndex: 26,
    title: "Isoler une décision",
    concept: "Fonctions et conditions",
    summary: "Encapsuler une règle simple dans une fonction dédiée.",
    missionText: "Lisez un entier dans `stdin`, créez une fonction `parity_label` et affichez `pair` ou `impair`.",
    lessonSections: [
      {
        heading: "Nommer une règle",
        content: "Une fonction rend une décision réutilisable et plus facile à relire qu’un `if` laissé dans `main`.",
      },
      {
        heading: "Retourner du texte",
        content: "Une fonction peut retourner une chaîne statique avec `&'static str` sur des cas simples.",
      },
    ],
    exampleCode: 'fn parity_label(value: i32) -> &\'static str {\n    if value % 2 == 0 { "pair" } else { "impair" }\n}\n\nfn main() {\n    println!("{}", parity_label(7));\n}',
    instructions: [
      "Lisez un entier dans `stdin`.",
      "Créez `parity_label` qui retourne `pair` ou `impair`.",
      "Affichez le résultat produit par la fonction.",
    ],
    expectedOutput: "impair",
    stdin: "7\n",
    hint: "Le type de retour peut être `&'static str` si vous retournez seulement des littéraux.",
    xpReward: 95,
    estimatedDurationMinutes: 11,
    difficulty: "intermediate",
  },
  {
    id: "rust-level-27",
    orderIndex: 27,
    title: "Calculer une moyenne avec aide dédiée",
    concept: "Fonctions réutilisables",
    summary: "Faire collaborer `main` et une fonction de calcul sur un petit tableau.",
    missionText: "Créez une fonction `average` qui reçoit le tableau `[10.0, 12.0, 14.0]` et affichez son résultat avec une décimale.",
    lessonSections: [
      {
        heading: "Passer une collection à une fonction",
        content: "Une fonction peut recevoir une tranche `&[f64]` pour travailler sur une séquence sans la recopier.",
      },
      {
        heading: "Composer les briques",
        content: "Le but du chapitre est de faire émerger une petite architecture avant le premier vrai projet du niveau.",
      },
    ],
    exampleCode: 'fn average(values: &[f64]) -> f64 {\n    let mut total = 0.0;\n\n    for value in values {\n        total += value;\n    }\n\n    total / values.len() as f64\n}\n\nfn main() {\n    let values = [10.0, 12.0, 14.0];\n    println!("{:.1}", average(&values));\n}',
    instructions: [
      "Déclarez la fonction `average(values: &[f64]) -> f64`.",
      "Calculez la moyenne du tableau `[10.0, 12.0, 14.0]`.",
      "Affichez le résultat avec une décimale.",
    ],
    expectedOutput: "12.0",
    hint: "Pensez à diviser par `values.len() as f64` pour rester en flottant.",
    xpReward: 100,
    estimatedDurationMinutes: 12,
    difficulty: "intermediate",
  },
];

const levelTwoFunctionsExercises = levelTwoFunctionsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-functions",
    chapterId: "level-2-functions",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-strings" }],
  }),
);

const levelTwoFunctionsChapter = buildStructuredChapter(
  {
    id: "level-2-functions",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-functions",
    orderIndex: 4,
    title: "Fonctions",
    summary: "Isoler des règles, calculs et transformations dans des briques réutilisables.",
    estimatedProblemCount: 3,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-strings" }],
    requiredForLevelCompletion: true,
  },
  levelTwoFunctionsExercises,
  {
    id: "gate-level-2-functions",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-functions",
    chapterId: "level-2-functions",
    orderIndex: 27.5,
    title: "Déblocage préparé — Niveau 3",
    summary: "Le Niveau 2 peut maintenant ouvrir l’entrée dans les premiers problèmes algorithmiques.",
    message: "Le socle intermédiaire est en place : décimales, tableaux, chaînes et fonctions peuvent maintenant servir sur des problèmes plus structurés.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-functions" }],
    requiredContentIds: levelTwoFunctionsExercises.map((exercise) => exercise.id),
  },
);

const levelThreeFoundationsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-28",
    orderIndex: 28,
    title: "Balayer une ligne d’entiers",
    concept: "Balayage simple",
    summary: "Lire une ligne de nombres et conserver le maximum rencontré.",
    missionText: "Lisez une ligne d’entiers séparés par des espaces puis affichez la plus grande valeur.",
    lessonSections: [
      {
        heading: "Premier vrai balayage",
        content: "Beaucoup de problèmes algorithmiques commencent par un parcours linéaire d’une séquence.",
      },
      {
        heading: "Découper puis convertir",
        content: "Le schéma `split_whitespace()` puis `parse::<i32>()` reste central pour de nombreuses entrées.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let mut best = i32::MIN;\n\n    for token in input.split_whitespace() {\n        let value = token.parse::<i32>().unwrap();\n        if value > best {\n            best = value;\n        }\n    }\n\n    println!("{}", best);\n}',
    instructions: [
      "Lisez toute la ligne depuis `stdin`.",
      "Parcourez tous les entiers une seule fois.",
      "Affichez la valeur maximale.",
    ],
    expectedOutput: "9",
    stdin: "3 9 4 1\n",
    hint: "Initialisez `best` avec une valeur très basse ou avec le premier entier lu.",
    xpReward: 105,
    estimatedDurationMinutes: 12,
    difficulty: "advanced",
  },
  {
    id: "rust-level-29",
    orderIndex: 29,
    title: "Compter une valeur cible",
    concept: "Comptage linéaire",
    summary: "Scanner une séquence pour compter le nombre d’occurrences d’une valeur donnée.",
    missionText: "Lisez une cible sur la première ligne, puis une ligne d’entiers séparés par des espaces. Affichez combien de fois la cible apparaît.",
    lessonSections: [
      {
        heading: "Séparer la donnée de contrôle",
        content: "Certaines entrées donnent d’abord un paramètre, puis la séquence à analyser.",
      },
      {
        heading: "Compteur dédié",
        content: "Un entier mutable suffit pour suivre le nombre d’occurrences pendant le balayage.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let mut lines = input.lines();\n    let target = lines.next().unwrap().trim().parse::<i32>().unwrap();\n    let values = lines.next().unwrap_or(\"\");\n    let mut count = 0;\n\n    for token in values.split_whitespace() {\n        if token.parse::<i32>().unwrap() == target {\n            count += 1;\n        }\n    }\n\n    println!(\"{}\", count);\n}',
    instructions: [
      "Lisez la cible sur la première ligne.",
      "Lisez ensuite la ligne d’entiers.",
      "Comptez les occurrences exactes de la cible et affichez le total.",
    ],
    expectedOutput: "2",
    stdin: "4\n1 4 7 4 9\n",
    hint: "Deux parcours séparés ne sont pas nécessaires : une seule boucle sur la ligne d’entiers suffit.",
    xpReward: 110,
    estimatedDurationMinutes: 13,
    difficulty: "advanced",
  },
];

const levelThreeFoundationsExercises = levelThreeFoundationsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-scans",
    chapterId: "level-3-scans-and-complexity",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-2" }],
  }),
);

const levelThreeFoundationsChapter = buildStructuredChapter(
  {
    id: "level-3-scans-and-complexity",
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-scans",
    orderIndex: 1,
    title: "Syntaxes utiles, balayages et coût",
    summary: "Entrer dans l’algorithmique avec des parcours linéaires clairs et une première intuition de complexité.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-2" }],
    requiredForLevelCompletion: true,
  },
  levelThreeFoundationsExercises,
  {
    id: "gate-level-3-scans",
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-scans",
    chapterId: "level-3-scans-and-complexity",
    orderIndex: 29.5,
    title: "Palier validé — Balayages",
    summary: "Le premier outillage algorithmique est en place.",
    message: "Vous savez déjà résoudre des problèmes par parcours linéaire et comptage ciblé.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-3-scans-and-complexity" }],
    requiredContentIds: levelThreeFoundationsExercises.map((exercise) => exercise.id),
  },
);

const levelThreeStringsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-30",
    orderIndex: 30,
    title: "Compter les voyelles",
    concept: "Gestion de caractères",
    summary: "Parcourir une chaîne caractère par caractère pour calculer une propriété simple.",
    missionText: "Lisez un mot puis affichez le nombre de voyelles (`a`, `e`, `i`, `o`, `u`, `y`) qu’il contient.",
    lessonSections: [
      {
        heading: "Parcourir les caractères",
        content: "La méthode `.chars()` permet d’itérer sur les caractères d’une chaîne.",
      },
      {
        heading: "Tester une appartenance",
        content: "Une petite collection de référence suffit pour vérifier si un caractère est une voyelle.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let word = input.trim().to_lowercase();\n    let mut count = 0;\n\n    for character in word.chars() {\n        if \"aeiouy\".contains(character) {\n            count += 1;\n        }\n    }\n\n    println!(\"{}\", count);\n}',
    instructions: [
      "Lisez le mot depuis `stdin`.",
      "Parcourez ses caractères.",
      "Affichez le nombre de voyelles rencontrées.",
    ],
    expectedOutput: "3",
    stdin: "rustacean\n",
    hint: "Convertir en minuscules d’abord simplifie le test sur les voyelles.",
    xpReward: 115,
    estimatedDurationMinutes: 12,
    difficulty: "advanced",
  },
  {
    id: "rust-level-31",
    orderIndex: 31,
    title: "Renverser une chaîne",
    concept: "Chaînes avancées",
    summary: "Construire une nouvelle chaîne à partir d’un parcours inverse.",
    missionText: "Lisez un mot puis affichez-le à l’envers.",
    lessonSections: [
      {
        heading: "Itérer à l’envers",
        content: "Un itérateur peut être inversé avec `.rev()` avant d’être collecté.",
      },
      {
        heading: "Reconstruire du texte",
        content: "Le couple `.chars().rev().collect::<String>()` constitue une brique classique.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let reversed: String = input.trim().chars().rev().collect();\n    println!(\"{}\", reversed);\n}',
    instructions: [
      "Lisez le mot depuis `stdin`.",
      "Inversez l’ordre de ses caractères.",
      "Affichez la chaîne reconstruite.",
    ],
    expectedOutput: "tcurts",
    stdin: "struct\n",
    hint: "Le type de sortie attendu après `collect()` est `String`.",
    xpReward: 120,
    estimatedDurationMinutes: 13,
    difficulty: "advanced",
  },
];

const levelThreeStringsExercises = levelThreeStringsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-strings",
    chapterId: "level-3-characters-and-strings",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-3-scans-and-complexity" }],
  }),
);

const levelThreeStringsChapter = buildStructuredChapter(
  {
    id: "level-3-characters-and-strings",
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-strings",
    orderIndex: 2,
    title: "Caractères et chaînes",
    summary: "Entrer dans les manipulations de texte plus proches des premiers exercices d’algorithmique.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-3-scans-and-complexity" }],
    requiredForLevelCompletion: true,
  },
  levelThreeStringsExercises,
  {
    id: "gate-level-3-strings",
    levelId: "curriculum-level-3",
    levelNumber: 3,
    themeId: "theme-level-3-strings",
    chapterId: "level-3-characters-and-strings",
    orderIndex: 31.5,
    title: "Palier validé — Chaînes avancées",
    summary: "Le Niveau 3 démarre avec un premier socle de texte algorithmique.",
    message: "Vous pouvez maintenant balayer des séquences, raisonner sur des caractères et transformer du texte étape par étape.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-3-characters-and-strings" }],
    requiredContentIds: levelThreeStringsExercises.map((exercise) => exercise.id),
  },
);

const levelFourMethodsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-32",
    orderIndex: 32,
    title: "Isoler une règle métier",
    concept: "Méthodes de résolution",
    summary: "Extraire une règle claire dans une fonction dédiée avant de l'utiliser dans `main`.",
    missionText: "L'entrée standard contient une température entière. Créez une fonction `is_safe_temperature` qui retourne `true` si la valeur est entre `12` et `24` inclus, puis affichez `stable` ou `alerte`.",
    lessonSections: [
      {
        heading: "Nommer la règle",
        content: "Quand une condition devient importante, l'extraire dans une fonction clarifie le code et prépare sa réutilisation.",
      },
      {
        heading: "Séparer décision et affichage",
        content: "`main` peut se contenter de lire l'entrée, appeler la fonction métier puis convertir le résultat en sortie texte.",
      },
    ],
    exampleCode: 'fn is_safe_temperature(value: i32) -> bool {\n    value >= 12 && value <= 24\n}\n\nfn main() {\n    let status = if is_safe_temperature(18) { "stable" } else { "alerte" };\n    println!("{}", status);\n}',
    instructions: [
      "Lisez la température fournie dans `stdin`.",
      "Créez la fonction `is_safe_temperature(value: i32) -> bool`.",
      "Affichez `stable` si la fonction retourne `true`, sinon `alerte`.",
    ],
    expectedOutput: "stable",
    stdin: "18\n",
    hint: "Écrivez la règle une seule fois dans la fonction, puis réutilisez son résultat dans un `if`.",
    xpReward: 125,
    estimatedDurationMinutes: 12,
    difficulty: "advanced",
  },
  {
    id: "rust-level-33",
    orderIndex: 33,
    title: "Séparer parsing et calcul",
    concept: "Code propre et découpage",
    summary: "Lire une ligne d'entiers puis déléguer le calcul à une fonction métier lisible.",
    missionText: "Lisez une ligne d'entiers séparés par des espaces, calculez la somme des valeurs strictement positives avec une fonction `sum_positive` et affichez le résultat.",
    lessonSections: [
      {
        heading: "Réduire le bruit dans `main`",
        content: "Le parsing peut rester dans `main`, pendant qu'une fonction dédiée porte la logique métier utile au problème.",
      },
      {
        heading: "Passer une tranche",
        content: "Une fonction qui reçoit `&[i32]` reste flexible et ?vite de recopier les données.",
      },
    ],
    exampleCode: 'fn sum_positive(values: &[i32]) -> i32 {\n    let mut total = 0;\n\n    for value in values {\n        if *value > 0 {\n            total += *value;\n        }\n    }\n\n    total\n}\n\nfn main() {\n    let values = [4, -2, 9, -1];\n    println!("{}", sum_positive(&values));\n}',
    instructions: [
      "Lisez tous les entiers depuis `stdin`.",
      "Créez `sum_positive(values: &[i32]) -> i32`.",
      "Affichez la somme des valeurs strictement positives.",
    ],
    expectedOutput: "13",
    stdin: "4 -2 9 -1\n",
    hint: "Le parsing peut produire un `Vec<i32>`, puis la fonction travaille sur `&values`.",
    xpReward: 130,
    estimatedDurationMinutes: 14,
    difficulty: "advanced",
  },
];

const levelFourMethodsExercises = levelFourMethodsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-methods",
    chapterId: "level-4-methods-and-clean-code",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-3" }],
  }),
);

const levelFourMethodsChapter = buildStructuredChapter(
  {
    id: "level-4-methods-and-clean-code",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-methods",
    orderIndex: 1,
    title: "Méthodes : coder proprement et efficacement",
    summary: "Mieux découper une solution avant de s'attaquer aux structures plus lourdes.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-3" }],
    requiredForLevelCompletion: true,
  },
  levelFourMethodsExercises,
  {
    id: "gate-level-4-methods",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-methods",
    chapterId: "level-4-methods-and-clean-code",
    orderIndex: 33.5,
    title: "Palier validé — Méthodes",
    summary: "Le découpage de la solution en briques lisibles est en place.",
    message: "Vous savez maintenant isoler une règle et répartir les responsabilités entre parsing, calcul et affichage.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-methods-and-clean-code" }],
    requiredContentIds: levelFourMethodsExercises.map((exercise) => exercise.id),
  },
);

const levelFourTreesSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-34",
    orderIndex: 34,
    title: "Compter les noeuds d'un arbre",
    concept: "Arbres binaires",
    summary: "Définir un petit arbre récursif et calculer sa taille totale.",
    missionText: "Définissez l'enum `Tree`, construisez un petit arbre binaire en dur puis affichez le nombre total de noeuds avec une fonction récursive `count_nodes`.",
    lessonSections: [
      {
        heading: "Structure récursive",
        content: "Un arbre s'exprime naturellement avec un type récursif comme un `enum` qui contient d'autres sous-arbres.",
      },
      {
        heading: "Cas vide et cas non vide",
        content: "Une fonction récursive sur un arbre repose toujours sur un cas de base puis une combinaison des sous-résultats.",
      },
    ],
    exampleCode: 'enum Tree {\n    Empty,\n    Node(i32, Box<Tree>, Box<Tree>),\n}\n\nfn count_nodes(tree: &Tree) -> i32 {\n    match tree {\n        Tree::Empty => 0,\n        Tree::Node(_, left, right) => 1 + count_nodes(left) + count_nodes(right),\n    }\n}\n\nfn main() {\n    let tree = Tree::Node(8, Box::new(Tree::Node(3, Box::new(Tree::Empty), Box::new(Tree::Empty))), Box::new(Tree::Node(10, Box::new(Tree::Node(9, Box::new(Tree::Empty), Box::new(Tree::Empty))), Box::new(Tree::Empty))));\n    println!("{}", count_nodes(&tree));\n}',
    instructions: [
      "Déclarez l'enum `Tree` avec un cas vide et un cas noeud.",
      "Construisez un arbre qui contient 5 noeuds.",
      "Affichez le résultat de `count_nodes(&tree)`.",
    ],
    expectedOutput: "5",
    hint: "Le résultat vaut `1 + gauche + droite` quand le noeud existe.",
    xpReward: 135,
    estimatedDurationMinutes: 16,
    difficulty: "advanced",
  },
  {
    id: "rust-level-35",
    orderIndex: 35,
    title: "Mesurer la hauteur d'un arbre",
    concept: "Récursion sur arbre",
    summary: "Réutiliser la structure d'arbre pour calculer une hauteur récursive.",
    missionText: "Définissez un arbre binaire en dur puis affichez sa hauteur avec une fonction `height`.",
    lessonSections: [
      {
        heading: "Comparer deux sous-arbres",
        content: "La hauteur d'un noeud dépend de la plus grande hauteur entre ses enfants.",
      },
      {
        heading: "Conserver la même structure",
        content: "Une bonne pratique consiste à réutiliser exactement la même représentation que l'exercice précédent.",
      },
    ],
    exampleCode: 'enum Tree {\n    Empty,\n    Node(i32, Box<Tree>, Box<Tree>),\n}\n\nfn height(tree: &Tree) -> i32 {\n    match tree {\n        Tree::Empty => 0,\n        Tree::Node(_, left, right) => 1 + height(left).max(height(right)),\n    }\n}\n\nfn main() {\n    let tree = Tree::Node(8, Box::new(Tree::Node(3, Box::new(Tree::Node(1, Box::new(Tree::Empty), Box::new(Tree::Empty))), Box::new(Tree::Empty))), Box::new(Tree::Node(10, Box::new(Tree::Empty), Box::new(Tree::Empty))));\n    println!("{}", height(&tree));\n}',
    instructions: [
      "Créez un arbre dont la hauteur vaut `3`.",
      "Écrivez la fonction `height(tree: &Tree) -> i32`.",
      "Affichez la hauteur calculée.",
    ],
    expectedOutput: "3",
    hint: "La hauteur d'un arbre vide vaut `0` dans ce parcours.",
    xpReward: 140,
    estimatedDurationMinutes: 16,
    difficulty: "advanced",
  },
];

const levelFourTreesExercises = levelFourTreesSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-trees",
    chapterId: "level-4-trees",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-methods-and-clean-code" }],
  }),
);

const levelFourTreesChapter = buildStructuredChapter(
  {
    id: "level-4-trees",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-trees",
    orderIndex: 2,
    title: "Arbres",
    summary: "Poser les premiers réflexes de représentation et de parcours récursif sur arbre binaire.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-methods-and-clean-code" }],
    requiredForLevelCompletion: true,
  },
  levelFourTreesExercises,
  {
    id: "gate-level-4-trees",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-trees",
    chapterId: "level-4-trees",
    orderIndex: 35.5,
    title: "Palier validé — Arbres",
    summary: "Les premiers parcours récursifs sur arbre sont compris.",
    message: "Vous savez représenter un arbre simple et en extraire une mesure par récursion.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-trees" }],
    requiredContentIds: levelFourTreesExercises.map((exercise) => exercise.id),
  },
);

const levelFourScansSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-36",
    orderIndex: 36,
    title: "Construire des préfixes cumulés",
    concept: "Structures de données et balayages",
    summary: "Parcourir une séquence et reconstruire un résultat pas à pas.",
    missionText: "L'entrée standard contient des entiers séparés par des espaces. Affichez les sommes cumulées successives, séparées par des espaces.",
    lessonSections: [
      {
        heading: "Accumuler une information",
        content: "Un balayage peut produire autre chose qu'un seul total final : il peut reconstruire une nouvelle séquence utile.",
      },
      {
        heading: "Préfixes",
        content: "Les sommes cumulées sont une première structure auxiliaire classique pour accélérer des raisonnements ultérieurs.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let values: Vec<i32> = input.split_whitespace().map(|token| token.parse().unwrap()).collect();\n    let mut total = 0;\n    let mut outputs = Vec::new();\n\n    for value in values {\n        total += value;\n        outputs.push(total.to_string());\n    }\n\n    println!("{}", outputs.join(" "));\n}',
    instructions: [
      "Lisez toute la ligne d'entiers.",
      "Construisez les sommes cumulées dans l'ordre.",
      "Affichez-les sur une seule ligne séparée par des espaces.",
    ],
    expectedOutput: "3 7 12 14",
    stdin: "3 4 5 2\n",
    hint: "Un `Vec<String>` puis `join(\" \")` permet d'assembler la sortie proprement.",
    xpReward: 145,
    estimatedDurationMinutes: 15,
    difficulty: "advanced",
  },
  {
    id: "rust-level-37",
    orderIndex: 37,
    title: "Compter les ruptures locales",
    concept: "Balayage avec état local",
    summary: "Parcourir une séquence pour repérer les changements de tendance immédiats.",
    missionText: "L'entrée standard contient des entiers séparés par des espaces. Comptez combien de fois une valeur est strictement inférieure à la précédente.",
    lessonSections: [
      {
        heading: "Mémoire minimale",
        content: "Certains problèmes ne demandent pas une structure complète : conserver la dernière valeur suffit.",
      },
      {
        heading: "Comparer localement",
        content: "Le coeur du problème est ici de comparer chaque élément au précédent pendant un seul parcours.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let values: Vec<i32> = input.split_whitespace().map(|token| token.parse().unwrap()).collect();\n    let mut breaks = 0;\n\n    for window in values.windows(2) {\n        if window[1] < window[0] {\n            breaks += 1;\n        }\n    }\n\n    println!("{}", breaks);\n}',
    instructions: [
      "Lisez tous les entiers de la ligne.",
      "Repérez chaque baisse stricte entre deux positions consécutives.",
      "Affichez le nombre total de ruptures locales.",
    ],
    expectedOutput: "2",
    stdin: "4 7 5 5 3 8\n",
    hint: "La méthode `windows(2)` peut simplifier le parcours par paires consécutives.",
    xpReward: 150,
    estimatedDurationMinutes: 15,
    difficulty: "advanced",
  },
];

const levelFourScansExercises = levelFourScansSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-scans",
    chapterId: "level-4-structures-and-scans",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-trees" }],
  }),
);

const levelFourScansChapter = buildStructuredChapter(
  {
    id: "level-4-structures-and-scans",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-scans",
    orderIndex: 3,
    title: "Structures de données et balayages",
    summary: "Produire des informations dérivées en un seul parcours et avec une mémoire bien choisie.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-trees" }],
    requiredForLevelCompletion: true,
  },
  levelFourScansExercises,
  {
    id: "gate-level-4-scans",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-scans",
    chapterId: "level-4-structures-and-scans",
    orderIndex: 37.5,
    title: "Palier validé — Balayages avancés",
    summary: "Le parcours linéaire sert maintenant à produire des structures intermédiaires utiles.",
    message: "Vous savez dériver une nouvelle information à partir d'un parcours unique et d'un état bien choisi.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-structures-and-scans" }],
    requiredContentIds: levelFourScansExercises.map((exercise) => exercise.id),
  },
);

const levelFourRecursionSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-38",
    orderIndex: 38,
    title: "Factorielle récursive",
    concept: "Récursivité avancée",
    summary: "Retrouver un classique pour travailler le cas de base et l'appel récursif.",
    missionText: "L'entrée standard contient un entier positif. Écrivez une fonction récursive `factorial` et affichez son résultat.",
    lessonSections: [
      {
        heading: "Cas de base explicite",
        content: "Sans cas de base clair, une fonction récursive ne s'arrête jamais correctement.",
      },
      {
        heading: "Réduire le problème",
        content: "La récursion fonctionne quand chaque appel traite un cas strictement plus petit que le précédent.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn factorial(value: u64) -> u64 {\n    if value <= 1 {\n        1\n    } else {\n        value * factorial(value - 1)\n    }\n}\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let value: u64 = input.trim().parse().unwrap();\n    println!("{}", factorial(value));\n}',
    instructions: [
      "Lisez l'entier fourni dans `stdin`.",
      "Écrivez `factorial` récursivement.",
      "Affichez la valeur calculée.",
    ],
    expectedOutput: "120",
    stdin: "5\n",
    hint: "Le cas de base le plus simple ici est `value <= 1`.",
    xpReward: 155,
    estimatedDurationMinutes: 14,
    difficulty: "advanced",
  },
  {
    id: "rust-level-39",
    orderIndex: 39,
    title: "Somme récursive des chiffres",
    concept: "Récursion numérique",
    summary: "Réduire progressivement un entier jusqu'? épuiser ses chiffres.",
    missionText: "L'entrée standard contient un entier positif. Écrivez une fonction récursive `digit_sum` qui retourne la somme de ses chiffres, puis affichez le résultat.",
    lessonSections: [
      {
        heading: "Découper un nombre",
        content: "Les opérations `% 10` et `/ 10` permettent de récupérer le dernier chiffre puis le reste du nombre.",
      },
      {
        heading: "Faire décroître la taille",
        content: "Chaque appel récursif travaille sur `value / 10`, donc sur un entier plus petit.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn digit_sum(value: u64) -> u64 {\n    if value < 10 {\n        value\n    } else {\n        value % 10 + digit_sum(value / 10)\n    }\n}\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let value: u64 = input.trim().parse().unwrap();\n    println!("{}", digit_sum(value));\n}',
    instructions: [
      "Lisez l'entier fourni dans `stdin`.",
      "Écrivez `digit_sum` récursivement.",
      "Affichez la somme des chiffres.",
    ],
    expectedOutput: "12",
    stdin: "5043\n",
    hint: "Le dernier chiffre se récupère avec `% 10`.",
    xpReward: 160,
    estimatedDurationMinutes: 14,
    difficulty: "advanced",
  },
];

const levelFourRecursionExercises = levelFourRecursionSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-recursion",
    chapterId: "level-4-recursion-advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-structures-and-scans" }],
  }),
);

const levelFourRecursionChapter = buildStructuredChapter(
  {
    id: "level-4-recursion-advanced",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-recursion",
    orderIndex: 4,
    title: "Récursivité avancée",
    summary: "Passer de la récursion simple à une décomposition plus systématique du problème.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-structures-and-scans" }],
    requiredForLevelCompletion: true,
  },
  levelFourRecursionExercises,
  {
    id: "gate-level-4-recursion",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-recursion",
    chapterId: "level-4-recursion-advanced",
    orderIndex: 39.5,
    title: "Palier validé — Récursivité",
    summary: "Les cas de base et les appels réduits sont en place.",
    message: "Vous savez maintenant dérouler une résolution récursive sur des données numériques et arborescentes simples.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-recursion-advanced" }],
    requiredContentIds: levelFourRecursionExercises.map((exercise) => exercise.id),
  },
);

const levelFourGeometrySeeds: ExerciseSeed[] = [
  {
    id: "rust-level-40",
    orderIndex: 40,
    title: "Calculer l'aire d'un rectangle",
    concept: "Calculs géométriques (1)",
    summary: "Exploiter des coordonnées simples pour produire une mesure géométrique fiable.",
    missionText: "L'entrée standard contient `x1 y1 x2 y2`. Calculez l'aire du rectangle axis-aligné formé par ces deux coins opposés et affichez-la.",
    lessonSections: [
      {
        heading: "Écart horizontal et vertical",
        content: "La largeur et la hauteur se déduisent des différences absolues entre coordonnées correspondantes.",
      },
      {
        heading: "Transformer des coordonnées en mesure",
        content: "Le passage d'un problème de points à une formule simple est un premier réflexe géométrique utile.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let values: Vec<i32> = input.split_whitespace().map(|token| token.parse().unwrap()).collect();\n    let width = (values[2] - values[0]).abs();\n    let height = (values[3] - values[1]).abs();\n    println!("{}", width * height);\n}',
    instructions: [
      "Lisez les quatre coordonnées depuis `stdin`.",
      "Calculez largeur et hauteur avec une différence absolue.",
      "Affichez l'aire du rectangle.",
    ],
    expectedOutput: "12",
    stdin: "1 2 5 5\n",
    hint: "Pensez à `abs()` pour Éviter les problèmes d'ordre des coins.",
    xpReward: 165,
    estimatedDurationMinutes: 13,
    difficulty: "advanced",
  },
  {
    id: "rust-level-41",
    orderIndex: 41,
    title: "Périmètre de la boîte englobante",
    concept: "Mesures géométriques",
    summary: "Réutiliser des coordonnées pour produire une seconde mesure simple et cohérente.",
    missionText: "L'entrée standard contient `x1 y1 x2 y2`. Calculez le périmètre du rectangle axis-aligné formé par ces deux coins opposés et affichez-le.",
    lessonSections: [
      {
        heading: "Réutiliser une représentation",
        content: "Quand le modèle de données est clair, plusieurs calculs différents peuvent réutiliser exactement la même entrée.",
      },
      {
        heading: "Éviter les formules magiques",
        content: "Exprimez d'abord largeur et hauteur, puis dérivez le périmètre avec une formule lisible.",
      },
    ],
    exampleCode: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let values: Vec<i32> = input.split_whitespace().map(|token| token.parse().unwrap()).collect();\n    let width = (values[2] - values[0]).abs();\n    let height = (values[3] - values[1]).abs();\n    println!("{}", 2 * (width + height));\n}',
    instructions: [
      "Lisez les quatre coordonnées depuis `stdin`.",
      "Calculez largeur et hauteur du rectangle.",
      "Affichez le périmètre total.",
    ],
    expectedOutput: "14",
    stdin: "1 2 5 4\n",
    hint: "Le périmètre vaut `2 * (largeur + hauteur)`.",
    xpReward: 170,
    estimatedDurationMinutes: 13,
    difficulty: "advanced",
  },
];

const levelFourGeometryExercises = levelFourGeometrySeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-geometry",
    chapterId: "level-4-geometry-1",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-recursion-advanced" }],
  }),
);

const levelFourGeometryChapter = buildStructuredChapter(
  {
    id: "level-4-geometry-1",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-geometry",
    orderIndex: 5,
    title: "Calculs géométriques (1)",
    summary: "Transformer des coordonnées en mesures géométriques simples mais robustes.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-recursion-advanced" }],
    requiredForLevelCompletion: true,
  },
  levelFourGeometryExercises,
  {
    id: "gate-level-4-geometry",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-geometry",
    chapterId: "level-4-geometry-1",
    orderIndex: 41.5,
    title: "Palier validé — Géométrie",
    summary: "Les premières traductions géométriques en calculs Rust sont en place.",
    message: "Vous savez maintenant transformer quelques coordonnées en largeurs, hauteurs, aires et périmètres sans perdre la lisibilité du code.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-geometry-1" }],
    requiredContentIds: levelFourGeometryExercises.map((exercise) => exercise.id),
  },
);

const levelFourGraphsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-42",
    orderIndex: 42,
    title: "Compter les sommets atteignables",
    concept: "Graphes",
    summary: "Utiliser un parcours de graphe simple pour compter les sommets visités.",
    missionText: "Construisez un petit graphe en dur, lancez un parcours depuis le sommet `0` et affichez combien de sommets sont atteignables.",
    lessonSections: [
      {
        heading: "Représenter un graphe",
        content: "Une liste d'adjacence `Vec<Vec<usize>>` suffit pour de nombreux exercices de départ sur les graphes.",
      },
      {
        heading: "Parcours en profondeur ou en largeur",
        content: "L'important ici n'est pas la variante précise du parcours, mais le suivi des sommets déjà visités.",
      },
    ],
    exampleCode: 'fn dfs(node: usize, graph: &[Vec<usize>], visited: &mut [bool]) {\n    if visited[node] {\n        return;\n    }\n\n    visited[node] = true;\n\n    for &next in &graph[node] {\n        dfs(next, graph, visited);\n    }\n}\n\nfn main() {\n    let graph = vec![vec![1, 2], vec![3], vec![4], vec![], vec![]];\n    let mut visited = vec![false; graph.len()];\n    dfs(0, &graph, &mut visited);\n    let count = visited.into_iter().filter(|flag| *flag).count();\n    println!("{}", count);\n}',
    instructions: [
      "Représentez le graphe en liste d'adjacence.",
      "Parcourez-le depuis le sommet `0`.",
      "Affichez le nombre de sommets visités.",
    ],
    expectedOutput: "5",
    hint: "Un tableau `visited` ?vite de recompter plusieurs fois le même sommet.",
    xpReward: 175,
    estimatedDurationMinutes: 16,
    difficulty: "advanced",
  },
  {
    id: "rust-level-43",
    orderIndex: 43,
    title: "Mesurer un plus court chemin",
    concept: "Graphes implicites (1)",
    summary: "Calculer une distance minimale sur un petit graphe non pondéré.",
    missionText: "Construisez un graphe en dur, calculez la distance minimale entre `0` et `5` avec un parcours en largeur, puis affichez-la.",
    lessonSections: [
      {
        heading: "Pourquoi la largeur",
        content: "Dans un graphe non pondéré, un parcours en largeur découvre naturellement les plus courtes distances en nombre d'arêtes.",
      },
      {
        heading: "Suivre les distances",
        content: "Un vecteur de distances ou de niveaux permet de conserver la profondeur à laquelle chaque sommet est atteint.",
      },
    ],
    exampleCode: 'use std::collections::VecDeque;\n\nfn main() {\n    let graph = vec![vec![1, 2], vec![3], vec![3, 4], vec![5], vec![5], vec![]];\n    let mut distances = vec![-1; graph.len()];\n    let mut queue = VecDeque::new();\n\n    distances[0] = 0;\n    queue.push_back(0);\n\n    while let Some(node) = queue.pop_front() {\n        for &next in &graph[node] {\n            if distances[next] == -1 {\n                distances[next] = distances[node] + 1;\n                queue.push_back(next);\n            }\n        }\n    }\n\n    println!("{}", distances[5]);\n}',
    instructions: [
      "Construisez le graphe donné dans l'exemple ou un graphe équivalent où la distance cherchée vaut `3`.",
      "Utilisez un parcours en largeur avec une file.",
      "Affichez la distance minimale entre `0` et `5`.",
    ],
    expectedOutput: "3",
    hint: "Une `VecDeque` convient bien pour gérer la file du BFS.",
    xpReward: 180,
    estimatedDurationMinutes: 18,
    difficulty: "advanced",
  },
];

const levelFourGraphsExercises = levelFourGraphsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-graphs",
    chapterId: "level-4-graphs",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-geometry-1" }],
  }),
);

const levelFourGraphsChapter = buildStructuredChapter(
  {
    id: "level-4-graphs",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-graphs",
    orderIndex: 6,
    title: "Graphes et graphes implicites (1)",
    summary: "Entrer dans les représentations de graphe, les parcours et une première notion de distance minimale.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-geometry-1" }],
    requiredForLevelCompletion: true,
  },
  levelFourGraphsExercises,
  {
    id: "gate-level-4-graphs",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-graphs",
    chapterId: "level-4-graphs",
    orderIndex: 43.5,
    title: "Palier validé — Graphes",
    summary: "Le Niveau 4 est prêt à se conclure sur un projet de synthèse orient? exploration.",
    message: "Vous savez maintenant manipuler un premier graphe, parcourir ses sommets et raisonner sur une distance minimale simple.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-graphs" }],
    requiredContentIds: levelFourGraphsExercises.map((exercise) => exercise.id),
  },
);

const levelFiveGreedySeeds: ExerciseSeed[] = [
  {
    id: "rust-level-44",
    orderIndex: 44,
    title: "Rendre la monnaie efficacement",
    concept: "Algorithmes gloutons",
    summary: "Appliquer un choix local simple tant que le système de pièces s'y prête.",
    missionText:
      "L'entrée standard contient un montant entier. Utilisez les pièces 10, 5, 2 et 1 pour afficher le nombre minimal de pièces nécessaires.",
    lessonSections: [
      {
        heading: "Choix local",
        content: "Un algorithme glouton choisit immédiatement l'option qui paraît la meilleure à l'instant courant.",
      },
      {
        heading: "Quand cela fonctionne",
        content: "Ici, le système de pièces est suffisamment simple pour que prendre la plus grande pièce disponible reste optimal.",
      },
    ],
    exampleCode: `fn greedy_coin_count(mut amount: i32) -> i32 {
    let coins = [10, 5, 2, 1];
    let mut count = 0;

    for coin in coins {
        count += amount / coin;
        amount %= coin;
    }

    count
}

fn main() {
    println!("{}", greedy_coin_count(27));
}`,
    instructions: [
      "Lisez un entier depuis `stdin`.",
      "Parcourez les pièces dans l'ordre décroissant.",
      "Affichez uniquement le nombre minimal de pièces.",
    ],
    expectedOutput: "4",
    stdin: "27\n",
    hint: "Après chaque pièce, gardez le reste avec l'opérateur `%`.",
    xpReward: 140,
    estimatedDurationMinutes: 16,
    difficulty: "advanced",
  },
  {
    id: "rust-level-45",
    orderIndex: 45,
    title: "Choisir des créneaux compatibles",
    concept: "Sélection d'intervalles",
    summary: "Trier des intervalles par heure de fin pour garder le plus grand ensemble compatible.",
    missionText:
      "Le tableau `slots` est fourni dans le code. Triez les créneaux par heure de fin, sélectionnez-en un maximum sans chevauchement et affichez combien de créneaux sont retenus.",
    lessonSections: [
      {
        heading: "Trier par la bonne clé",
        content: "Sur les intervalles, une stratégie classique consiste à retenir d'abord le créneau qui se termine le plus tôt.",
      },
      {
        heading: "Garder un état minimal",
        content: "Il suffit de mémoriser la fin du dernier créneau retenu pour décider du suivant.",
      },
    ],
    exampleCode: `fn max_non_overlapping(mut slots: Vec<(i32, i32)>) -> i32 {
    slots.sort_by_key(|slot| slot.1);

    let mut count = 0;
    let mut current_end = i32::MIN;

    for (start, end) in slots {
        if start >= current_end {
            count += 1;
            current_end = end;
        }
    }

    count
}

fn main() {
    let slots = vec![(0, 3), (1, 2), (3, 5), (4, 7), (6, 8)];
    println!("{}", max_non_overlapping(slots));
}`,
    instructions: [
      "Triez les créneaux fournis.",
      "Retenez un créneau seulement si son début est compatible avec la fin actuelle.",
      "Affichez le nombre final de créneaux retenus.",
    ],
    expectedOutput: "3",
    hint: "Commencez par `slots.sort_by_key(|slot| slot.1);`.",
    xpReward: 145,
    estimatedDurationMinutes: 17,
    difficulty: "advanced",
  },
];

const levelFiveGreedyExercises = levelFiveGreedySeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-greedy",
    chapterId: "level-5-greedy-strategies",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-4" }],
  }),
);

const levelFiveGreedyChapter = buildStructuredChapter(
  {
    id: "level-5-greedy-strategies",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-greedy",
    orderIndex: 1,
    title: "Algorithmes gloutons",
    summary: "Faire un choix local simple quand la structure du problème le permet.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-4" }],
    requiredForLevelCompletion: true,
  },
  levelFiveGreedyExercises,
  {
    id: "gate-level-5-greedy",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-greedy",
    chapterId: "level-5-greedy-strategies",
    orderIndex: 45.5,
    title: "Palier validé · Gloutons",
    summary: "Vous savez reconnaître un premier problème où un choix local suffit.",
    message: "Les premières stratégies gloutonnes sont en place. Vous pouvez maintenant comparer avec des approches plus structurées.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-greedy-strategies" }],
    requiredContentIds: levelFiveGreedyExercises.map((exercise) => exercise.id),
  },
);

const levelFiveDivideSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-46",
    orderIndex: 46,
    title: "Sommer par découpage",
    concept: "Diviser pour régner",
    summary: "Découper une séquence en deux sous-problèmes puis recombiner le résultat.",
    missionText:
      "Le tableau `values` est fourni dans le code. Écrivez une fonction récursive `sum_range` qui additionne les valeurs d'un intervalle `[left, right)` en le divisant en deux, puis affichez la somme totale.",
    lessonSections: [
      {
        heading: "Découper le problème",
        content: "Diviser pour régner consiste à résoudre deux sous-problèmes plus petits avant de recombiner les réponses.",
      },
      {
        heading: "Cas de base",
        content: "Un intervalle vide vaut 0, et un intervalle d'un seul élément se traite directement.",
      },
    ],
    exampleCode: `fn sum_range(values: &[i32], left: usize, right: usize) -> i32 {
    if right <= left {
        return 0;
    }

    if right - left == 1 {
        return values[left];
    }

    let middle = (left + right) / 2;
    sum_range(values, left, middle) + sum_range(values, middle, right)
}

fn main() {
    let values = [5, 8, 1, 4, 9];
    println!("{}", sum_range(&values, 0, values.len()));
}`,
    instructions: [
      "Traitez le cas vide et le cas d'un seul élément.",
      "Découpez l'intervalle en deux parties.",
      "Additionnez récursivement les deux sous-résultats.",
    ],
    expectedOutput: "27",
    hint: "Un milieu se calcule avec `(left + right) / 2`.",
    xpReward: 150,
    estimatedDurationMinutes: 18,
    difficulty: "advanced",
  },
  {
    id: "rust-level-47",
    orderIndex: 47,
    title: "Trouver un maximum récursif",
    concept: "Découpage récursif",
    summary: "Retrouver un extrême en comparant les réponses de deux sous-parties.",
    missionText:
      "L'entrée standard contient plusieurs entiers séparés par des espaces. Créez une fonction récursive qui renvoie le maximum d'une tranche, puis affichez-le.",
    lessonSections: [
      {
        heading: "Comparer des sous-résultats",
        content: "Si chaque moitié sait déjà calculer son maximum, il ne reste plus qu'à comparer les deux réponses.",
      },
      {
        heading: "Réutiliser les tranches",
        content: "Les slices `&values[..middle]` et `&values[middle..]` permettent de découper sans recopier.",
      },
    ],
    exampleCode: `fn max_slice(values: &[i32]) -> i32 {
    if values.len() == 1 {
        return values[0];
    }

    let middle = values.len() / 2;
    let left = max_slice(&values[..middle]);
    let right = max_slice(&values[middle..]);
    left.max(right)
}

fn main() {
    let values = vec![7, 2, 9, 4, 11, 3];
    println!("{}", max_slice(&values));
}`,
    instructions: [
      "Parsez les entiers depuis `stdin`.",
      "Créez une fonction récursive sur `&[i32]`.",
      "Affichez uniquement la plus grande valeur.",
    ],
    expectedOutput: "11",
    stdin: "7 2 9 4 11 3\n",
    hint: "Le cas de base est la tranche de longueur 1.",
    xpReward: 155,
    estimatedDurationMinutes: 18,
    difficulty: "advanced",
  },
];

const levelFiveDivideExercises = levelFiveDivideSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-divide-conquer",
    chapterId: "level-5-divide-and-conquer",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-greedy-strategies" }],
  }),
);

const levelFiveDivideChapter = buildStructuredChapter(
  {
    id: "level-5-divide-and-conquer",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-divide-conquer",
    orderIndex: 2,
    title: "Diviser pour régner",
    summary: "Découper, résoudre, recombiner : un autre réflexe fondamental.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-greedy-strategies" }],
    requiredForLevelCompletion: true,
  },
  levelFiveDivideExercises,
  {
    id: "gate-level-5-divide-conquer",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-divide-conquer",
    chapterId: "level-5-divide-and-conquer",
    orderIndex: 47.5,
    title: "Palier validé · Diviser pour régner",
    summary: "Le découpage récursif et la recombinaison sont compris.",
    message: "Vous savez maintenant traiter un problème en sous-parties cohérentes puis assembler la réponse finale.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-divide-and-conquer" }],
    requiredContentIds: levelFiveDivideExercises.map((exercise) => exercise.id),
  },
);

const levelFiveBinaryTreesSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-48",
    orderIndex: 48,
    title: "Mesurer la hauteur d'un arbre",
    concept: "Arbres binaires",
    summary: "Réutiliser la récursivité pour mesurer la profondeur d'une structure arborescente.",
    missionText:
      "Le type `Tree` est à compléter. Construisez l'arbre donné dans l'exemple, écrivez `height` puis affichez la hauteur de l'arbre.",
    lessonSections: [
      {
        heading: "Hauteur",
        content: "La hauteur d'un arbre vide vaut 0, et celle d'un noeud vaut 1 plus le maximum des hauteurs de ses sous-arbres.",
      },
      {
        heading: "Répéter un schéma",
        content: "Le schéma de récursion sur arbre revient souvent : cas vide, puis combinaison des sous-appels.",
      },
    ],
    exampleCode: `enum Tree {
    Empty,
    Node(i32, Box<Tree>, Box<Tree>),
}

fn height(tree: &Tree) -> i32 {
    match tree {
        Tree::Empty => 0,
        Tree::Node(_, left, right) => 1 + height(left).max(height(right)),
    }
}

fn main() {
    let tree = Tree::Node(
        5,
        Box::new(Tree::Node(3, Box::new(Tree::Node(1, Box::new(Tree::Empty), Box::new(Tree::Empty))), Box::new(Tree::Empty))),
        Box::new(Tree::Node(8, Box::new(Tree::Empty), Box::new(Tree::Empty))),
    );
    println!("{}", height(&tree));
}`,
    instructions: [
      "Complétez le type récursif.",
      "Calculez la hauteur avec une fonction récursive.",
      "Affichez uniquement la hauteur trouvée.",
    ],
    expectedOutput: "3",
    hint: "Utilisez `height(left).max(height(right))`.",
    xpReward: 155,
    estimatedDurationMinutes: 18,
    difficulty: "advanced",
  },
  {
    id: "rust-level-49",
    orderIndex: 49,
    title: "Parcourir un arbre en ordre infixe",
    concept: "Parcours d'arbre",
    summary: "Produire une sortie ordonnée en visitant gauche, racine puis droite.",
    missionText:
      "Le type `Tree` est fourni. Écrivez une fonction `inorder` qui remplit un `Vec<i32>` avec un parcours infixe, puis affichez les valeurs séparées par des espaces.",
    lessonSections: [
      {
        heading: "Ordre de visite",
        content: "Le parcours infixe visite d'abord le sous-arbre gauche, puis la valeur du noeud, puis le sous-arbre droit.",
      },
      {
        heading: "Accumuler dans un vecteur",
        content: "Un `Vec<i32>` mutable partagé entre les appels permet d'enregistrer les valeurs sans les afficher immédiatement.",
      },
    ],
    exampleCode: `enum Tree {
    Empty,
    Node(i32, Box<Tree>, Box<Tree>),
}

fn inorder(tree: &Tree, values: &mut Vec<i32>) {
    match tree {
        Tree::Empty => {}
        Tree::Node(value, left, right) => {
            inorder(left, values);
            values.push(*value);
            inorder(right, values);
        }
    }
}

fn main() {
    let tree = Tree::Node(
        6,
        Box::new(Tree::Node(3, Box::new(Tree::Node(1, Box::new(Tree::Empty), Box::new(Tree::Empty))), Box::new(Tree::Node(4, Box::new(Tree::Empty), Box::new(Tree::Empty))))),
        Box::new(Tree::Node(8, Box::new(Tree::Empty), Box::new(Tree::Empty))),
    );

    let mut values = Vec::new();
    inorder(&tree, &mut values);
    let output = values.iter().map(|value| value.to_string()).collect::<Vec<_>>().join(" ");
    println!("{}", output);
}`,
    instructions: [
      "Respectez l'ordre gauche, racine, droite.",
      "Stockez les valeurs dans un vecteur mutable.",
      "Affichez la ligne finale au format `1 3 4 6 8`.",
    ],
    expectedOutput: "1 3 4 6 8",
    hint: "Ne mélangez pas l'ordre du parcours : la racine vient entre les deux sous-arbres.",
    xpReward: 160,
    estimatedDurationMinutes: 19,
    difficulty: "advanced",
  },
];

const levelFiveBinaryTreesExercises = levelFiveBinaryTreesSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-binary-trees",
    chapterId: "level-5-binary-trees",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-divide-and-conquer" }],
  }),
);

const levelFiveBinaryTreesChapter = buildStructuredChapter(
  {
    id: "level-5-binary-trees",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-binary-trees",
    orderIndex: 3,
    title: "Arbres binaires",
    summary: "Approfondir les structures arborescentes et leurs parcours classiques.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-divide-and-conquer" }],
    requiredForLevelCompletion: true,
  },
  levelFiveBinaryTreesExercises,
  {
    id: "gate-level-5-binary-trees",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-binary-trees",
    chapterId: "level-5-binary-trees",
    orderIndex: 49.5,
    title: "Palier validé · Arbres binaires",
    summary: "Les parcours et mesures de base sur arbre sont stables.",
    message: "Vous savez maintenant manipuler un arbre binaire sans perdre de vue la structure du parcours.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-binary-trees" }],
    requiredContentIds: levelFiveBinaryTreesExercises.map((exercise) => exercise.id),
  },
);

const levelFiveSortsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-50",
    orderIndex: 50,
    title: "Fusionner deux listes triées",
    concept: "Tris efficaces",
    summary: "Réaliser l'étape de fusion sans perdre l'ordre global.",
    missionText:
      "Les deux tableaux triés `left` et `right` sont fournis. Fusionnez-les dans un nouveau vecteur puis affichez le résultat sur une ligne, séparé par des espaces.",
    lessonSections: [
      {
        heading: "Deux pointeurs",
        content: "La fusion compare les têtes des deux listes et avance un pointeur à chaque étape.",
      },
      {
        heading: "Reste de liste",
        content: "Quand l'une des deux listes est terminée, il suffit d'ajouter le reste de l'autre.",
      },
    ],
    exampleCode: `fn merge(left: &[i32], right: &[i32]) -> Vec<i32> {
    let mut merged = Vec::new();
    let mut left_index = 0;
    let mut right_index = 0;

    while left_index < left.len() && right_index < right.len() {
        if left[left_index] <= right[right_index] {
            merged.push(left[left_index]);
            left_index += 1;
        } else {
            merged.push(right[right_index]);
            right_index += 1;
        }
    }

    merged.extend_from_slice(&left[left_index..]);
    merged.extend_from_slice(&right[right_index..]);
    merged
}

fn main() {
    let left = [1, 4, 7];
    let right = [2, 3, 6, 9];
    let merged = merge(&left, &right);
    let output = merged.iter().map(|value| value.to_string()).collect::<Vec<_>>().join(" ");
    println!("{}", output);
}`,
    instructions: [
      "Utilisez deux indices pour parcourir les deux tableaux.",
      "Ajoutez toujours la plus petite tête disponible.",
      "Affichez le résultat final trié.",
    ],
    expectedOutput: "1 2 3 4 6 7 9",
    hint: "Pensez à `extend_from_slice` pour le reste du tableau.",
    xpReward: 165,
    estimatedDurationMinutes: 18,
    difficulty: "advanced",
  },
  {
    id: "rust-level-51",
    orderIndex: 51,
    title: "Trier par fusion",
    concept: "Merge sort",
    summary: "Assembler un tri complet à partir du découpage récursif et de la fusion.",
    missionText:
      "L'entrée standard contient des entiers séparés par des espaces. Implémentez `merge_sort` et affichez la séquence triée sur une seule ligne.",
    lessonSections: [
      {
        heading: "Réutiliser les briques",
        content: "Le tri fusion combine une stratégie de division récursive et une phase de fusion stable.",
      },
      {
        heading: "Base de récursion",
        content: "Une liste de longueur 0 ou 1 est déjà triée.",
      },
    ],
    exampleCode: `fn merge(left: &[i32], right: &[i32]) -> Vec<i32> {
    let mut merged = Vec::new();
    let mut i = 0;
    let mut j = 0;

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            merged.push(left[i]);
            i += 1;
        } else {
            merged.push(right[j]);
            j += 1;
        }
    }

    merged.extend_from_slice(&left[i..]);
    merged.extend_from_slice(&right[j..]);
    merged
}

fn merge_sort(values: &[i32]) -> Vec<i32> {
    if values.len() <= 1 {
        return values.to_vec();
    }

    let middle = values.len() / 2;
    let left = merge_sort(&values[..middle]);
    let right = merge_sort(&values[middle..]);
    merge(&left, &right)
}

fn main() {
    let values = vec![9, 4, 1, 7, 3];
    let sorted = merge_sort(&values);
    let output = sorted.iter().map(|value| value.to_string()).collect::<Vec<_>>().join(" ");
    println!("{}", output);
}`,
    instructions: [
      "Parsez les entiers depuis `stdin`.",
      "Implémentez un `merge_sort` récursif.",
      "Affichez la ligne triée finale.",
    ],
    expectedOutput: "1 3 4 7 9",
    stdin: "9 4 1 7 3\n",
    hint: "Le résultat d'un appel récursif peut rester un `Vec<i32>` indépendant.",
    xpReward: 170,
    estimatedDurationMinutes: 20,
    difficulty: "advanced",
  },
];

const levelFiveSortsExercises = levelFiveSortsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-efficient-sorts",
    chapterId: "level-5-efficient-sorts",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-binary-trees" }],
  }),
);

const levelFiveSortsChapter = buildStructuredChapter(
  {
    id: "level-5-efficient-sorts",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-efficient-sorts",
    orderIndex: 4,
    title: "Tris efficaces",
    summary: "Passer d'un tri quadratique à des stratégies de tri plus structurées.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-binary-trees" }],
    requiredForLevelCompletion: true,
  },
  levelFiveSortsExercises,
  {
    id: "gate-level-5-efficient-sorts",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-efficient-sorts",
    chapterId: "level-5-efficient-sorts",
    orderIndex: 51.5,
    title: "Palier validé · Tris efficaces",
    summary: "Les bases du tri fusion sont en place.",
    message: "Vous savez maintenant découper, fusionner et raisonner sur un tri plus rapide que les approches naïves.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-efficient-sorts" }],
    requiredContentIds: levelFiveSortsExercises.map((exercise) => exercise.id),
  },
);

const levelFiveShortestPathsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-52",
    orderIndex: 52,
    title: "Trouver une distance minimale",
    concept: "Plus courts chemins",
    summary: "Utiliser un BFS simple sur un graphe non pondéré pour obtenir une distance minimale.",
    missionText:
      "Le graphe est fourni comme liste d'adjacence dans le code. Écrivez une fonction `shortest_steps` qui calcule la distance minimale entre `0` et `5`, puis affichez-la.",
    lessonSections: [
      {
        heading: "Niveau par niveau",
        content: "Sur un graphe non pondéré, un BFS découvre les sommets par distance croissante.",
      },
      {
        heading: "File et tableau de distances",
        content: "Une file d'attente et un tableau de distances suffisent pour un premier plus court chemin.",
      },
    ],
    exampleCode: `use std::collections::VecDeque;

fn shortest_steps(graph: &[Vec<usize>], start: usize, target: usize) -> i32 {
    let mut distances = vec![-1; graph.len()];
    let mut queue = VecDeque::new();
    distances[start] = 0;
    queue.push_back(start);

    while let Some(node) = queue.pop_front() {
        if node == target {
            return distances[node];
        }

        for &next in &graph[node] {
            if distances[next] == -1 {
                distances[next] = distances[node] + 1;
                queue.push_back(next);
            }
        }
    }

    -1
}

fn main() {
    let graph = vec![vec![1, 2], vec![3], vec![3, 4], vec![5], vec![5], vec![]];
    println!("{}", shortest_steps(&graph, 0, 5));
}`,
    instructions: [
      "Initialisez la distance de départ à 0.",
      "Parcourez le graphe avec une file `VecDeque`.",
      "Affichez la distance minimale jusqu'au sommet cible.",
    ],
    expectedOutput: "3",
    hint: "Pensez à marquer un sommet dès qu'il entre dans la file.",
    xpReward: 170,
    estimatedDurationMinutes: 20,
    difficulty: "advanced",
  },
  {
    id: "rust-level-53",
    orderIndex: 53,
    title: "Dijkstra miniature",
    concept: "Graphes pondérés",
    summary: "Mettre à jour des distances sur un petit graphe pondéré sans encore optimiser la structure de données.",
    missionText:
      "Le graphe pondéré est fourni dans le code. Calculez la distance minimale entre `0` et `4` avec une version simple de Dijkstra, puis affichez-la.",
    lessonSections: [
      {
        heading: "Détendre une arête",
        content: "Détendre une arête revient à tester si passer par un sommet améliore une distance connue.",
      },
      {
        heading: "Version simple",
        content: "Sur de petits graphes, on peut choisir le prochain sommet par une recherche linéaire au lieu d'un tas binaire.",
      },
    ],
    exampleCode: `fn dijkstra(graph: &[Vec<(usize, i32)>], start: usize, target: usize) -> i32 {
    let mut distances = vec![i32::MAX; graph.len()];
    let mut used = vec![false; graph.len()];
    distances[start] = 0;

    for _ in 0..graph.len() {
        let mut current = None;

        for node in 0..graph.len() {
            if !used[node] && (current.is_none() || distances[node] < distances[current.unwrap()]) {
                current = Some(node);
            }
        }

        let Some(node) = current else {
            break;
        };

        used[node] = true;

        for &(next, weight) in &graph[node] {
            let candidate = distances[node] + weight;
            if candidate < distances[next] {
                distances[next] = candidate;
            }
        }
    }

    distances[target]
}

fn main() {
    let graph = vec![
        vec![(1, 2), (2, 5)],
        vec![(2, 1), (3, 2)],
        vec![(3, 3), (4, 6)],
        vec![(4, 2)],
        vec![],
    ];
    println!("{}", dijkstra(&graph, 0, 4));
}`,
    instructions: [
      "Initialisez toutes les distances à `i32::MAX` sauf le départ.",
      "Choisissez à chaque tour le sommet non utilisé le plus proche.",
      "Affichez la distance finale jusqu'à `4`.",
    ],
    expectedOutput: "6",
    hint: "Le meilleur chemin est `0 -> 1 -> 3 -> 4`.",
    xpReward: 175,
    estimatedDurationMinutes: 22,
    difficulty: "advanced",
  },
];

const levelFiveShortestPathsExercises = levelFiveShortestPathsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-shortest-paths",
    chapterId: "level-5-shortest-paths",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-efficient-sorts" }],
  }),
);

const levelFiveShortestPathsChapter = buildStructuredChapter(
  {
    id: "level-5-shortest-paths",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-shortest-paths",
    orderIndex: 5,
    title: "Plus courts chemins",
    summary: "Passer des parcours simples aux premières distances minimales.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-efficient-sorts" }],
    requiredForLevelCompletion: true,
  },
  levelFiveShortestPathsExercises,
  {
    id: "gate-level-5-shortest-paths",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-shortest-paths",
    chapterId: "level-5-shortest-paths",
    orderIndex: 53.5,
    title: "Palier validé · Plus courts chemins",
    summary: "Les premières distances minimales sur graphe sont posées.",
    message: "Vous savez maintenant faire la différence entre simple parcours et recherche d'une distance minimale.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-shortest-paths" }],
    requiredContentIds: levelFiveShortestPathsExercises.map((exercise) => exercise.id),
  },
);

const levelFiveUnionFindSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-54",
    orderIndex: 54,
    title: "Fusionner des composantes",
    concept: "Union-Find",
    summary: "Maintenir des groupes d'éléments à mesure que des unions arrivent.",
    missionText:
      "Initialisez une structure `parent` pour 6 éléments, appliquez les unions fournies dans le code et affichez le nombre final de composantes.",
    lessonSections: [
      {
        heading: "Parent représentant",
        content: "Chaque ensemble est représenté par une racine, et l'opération `find` permet de la retrouver.",
      },
      {
        heading: "Compter les composantes",
        content: "Après toutes les unions, compter les racines distinctes donne le nombre de composantes.",
      },
    ],
    exampleCode: `fn find(parent: &mut [usize], node: usize) -> usize {
    if parent[node] != node {
        let root = find(parent, parent[node]);
        parent[node] = root;
    }
    parent[node]
}

fn union(parent: &mut [usize], a: usize, b: usize) {
    let root_a = find(parent, a);
    let root_b = find(parent, b);

    if root_a != root_b {
        parent[root_b] = root_a;
    }
}

fn main() {
    let mut parent: Vec<usize> = (0..6).collect();
    let links = [(0, 1), (1, 2), (3, 4)];

    for (a, b) in links {
        union(&mut parent, a, b);
    }

    let mut roots = Vec::new();
    for node in 0..6 {
        let root = find(&mut parent, node);
        if !roots.contains(&root) {
            roots.push(root);
        }
    }

    println!("{}", roots.len());
}`,
    instructions: [
      "Implémentez `find` avec compression de chemin.",
      "Écrivez l'opération `union`.",
      "Affichez le nombre de composantes restantes.",
    ],
    expectedOutput: "3",
    hint: "Les composantes finales sont `{0,1,2}`, `{3,4}` et `{5}`.",
    xpReward: 175,
    estimatedDurationMinutes: 21,
    difficulty: "advanced",
  },
  {
    id: "rust-level-55",
    orderIndex: 55,
    title: "Répondre à des requêtes de connectivité",
    concept: "Union-Find",
    summary: "Réutiliser les mêmes représentants pour répondre vite à des questions de connectivité.",
    missionText: "Après avoir appliqué les unions fournies, affichez `true false` pour les requêtes `(0, 2)` et `(0, 5)`.",
    lessonSections: [
      {
        heading: "Même racine, même composante",
        content: "Deux éléments sont connectés s'ils partagent le même représentant après compression.",
      },
      {
        heading: "Éviter les recomputations",
        content: "Le but d'union-find est précisément de répondre à ce type de requête plus vite qu'un nouveau parcours complet.",
      },
    ],
    exampleCode: `fn find(parent: &mut [usize], node: usize) -> usize {
    if parent[node] != node {
        let root = find(parent, parent[node]);
        parent[node] = root;
    }
    parent[node]
}

fn union(parent: &mut [usize], a: usize, b: usize) {
    let root_a = find(parent, a);
    let root_b = find(parent, b);

    if root_a != root_b {
        parent[root_b] = root_a;
    }
}

fn main() {
    let mut parent: Vec<usize> = (0..6).collect();
    let links = [(0, 1), (1, 2), (3, 4)];

    for (a, b) in links {
        union(&mut parent, a, b);
    }

    let first = find(&mut parent, 0) == find(&mut parent, 2);
    let second = find(&mut parent, 0) == find(&mut parent, 5);
    println!("{} {}", first, second);
}`,
    instructions: [
      "Réutilisez `find` et `union`.",
      "Comparez les représentants des paires demandées.",
      "Affichez exactement `true false`.",
    ],
    expectedOutput: "true false",
    hint: "Les unions restent les mêmes que dans l'exercice précédent.",
    xpReward: 180,
    estimatedDurationMinutes: 20,
    difficulty: "advanced",
  },
];

const levelFiveUnionFindExercises = levelFiveUnionFindSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-union-find",
    chapterId: "level-5-union-find",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-shortest-paths" }],
  }),
);

const levelFiveUnionFindChapter = buildStructuredChapter(
  {
    id: "level-5-union-find",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-union-find",
    orderIndex: 6,
    title: "Union-Find",
    summary: "Maintenir des composantes et répondre à des requêtes de connectivité.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-shortest-paths" }],
    requiredForLevelCompletion: true,
  },
  levelFiveUnionFindExercises,
  {
    id: "gate-level-5-union-find",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-union-find",
    chapterId: "level-5-union-find",
    orderIndex: 55.5,
    title: "Palier validé · Union-Find",
    summary: "Les composantes dynamiques et la connectivité sont comprises.",
    message: "Vous savez maintenant regrouper des éléments et répondre à des requêtes de connectivité sans relancer un parcours complet.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-union-find" }],
    requiredContentIds: levelFiveUnionFindExercises.map((exercise) => exercise.id),
  },
);

const levelFiveDynamicSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-56",
    orderIndex: 56,
    title: "Compter des marches possibles",
    concept: "Programmation dynamique",
    summary: "Construire une réponse globale à partir de petites sous-réponses mémorisées.",
    missionText:
      "L'entrée standard contient un entier `n`. En montant 1 ou 2 marches à la fois, calculez combien de façons différentes permettent d'atteindre la marche `n`, puis affichez le résultat.",
    lessonSections: [
      {
        heading: "Sous-problèmes",
        content: "Le nombre de façons d'atteindre `n` dépend de `n-1` et `n-2`, ce qui en fait un bon premier problème de programmation dynamique.",
      },
      {
        heading: "Tableau de DP",
        content: "Un petit vecteur permet de mémoriser les réponses déjà calculées au lieu de les recalculer récursivement.",
      },
    ],
    exampleCode: `fn climb_count(n: usize) -> i32 {
    if n <= 1 {
        return 1;
    }

    let mut dp = vec![0; n + 1];
    dp[0] = 1;
    dp[1] = 1;

    for step in 2..=n {
        dp[step] = dp[step - 1] + dp[step - 2];
    }

    dp[n]
}

fn main() {
    println!("{}", climb_count(5));
}`,
    instructions: [
      "Lisez `n` depuis `stdin`.",
      "Construisez un tableau `dp` jusqu'à `n`.",
      "Affichez le nombre final de façons.",
    ],
    expectedOutput: "8",
    stdin: "5\n",
    hint: "Commencez avec `dp[0] = 1` et `dp[1] = 1`.",
    xpReward: 180,
    estimatedDurationMinutes: 20,
    difficulty: "advanced",
  },
  {
    id: "rust-level-57",
    orderIndex: 57,
    title: "Sac à dos miniature",
    concept: "Optimisation dynamique",
    summary: "Choisir une meilleure combinaison globale plutôt que le meilleur élément local.",
    missionText:
      "Les objets `(poids, valeur)` sont fournis dans le code. Écrivez une DP simple pour trouver la valeur maximale transportable avec une capacité 7, puis affichez-la.",
    lessonSections: [
      {
        heading: "Meilleure valeur pour chaque capacité",
        content: "On calcule la meilleure valeur atteignable pour chaque capacité intermédiaire, puis on réutilise ces résultats.",
      },
      {
        heading: "Pourquoi ce n'est pas glouton",
        content: "Le meilleur objet local n'est pas toujours compatible avec la meilleure combinaison globale.",
      },
    ],
    exampleCode: `fn knapsack(capacity: usize, items: &[(usize, i32)]) -> i32 {
    let mut dp = vec![0; capacity + 1];

    for &(weight, value) in items {
        for current in (weight..=capacity).rev() {
            dp[current] = dp[current].max(dp[current - weight] + value);
        }
    }

    dp[capacity]
}

fn main() {
    let items = [(2, 6), (3, 10), (4, 12)];
    println!("{}", knapsack(7, &items));
}`,
    instructions: [
      "Créez un tableau `dp` de taille `capacity + 1`.",
      "Parcourez les capacités en sens inverse pour chaque objet.",
      "Affichez la meilleure valeur finale.",
    ],
    expectedOutput: "22",
    hint: "Les objets de poids 3 et 4 donnent ici la meilleure combinaison.",
    xpReward: 185,
    estimatedDurationMinutes: 22,
    difficulty: "advanced",
  },
];

const levelFiveDynamicExercises = levelFiveDynamicSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-dynamic-programming",
    chapterId: "level-5-dynamic-programming",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-union-find" }],
  }),
);

const levelFiveDynamicChapter = buildStructuredChapter(
  {
    id: "level-5-dynamic-programming",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-dynamic-programming",
    orderIndex: 7,
    title: "Programmation dynamique",
    summary: "Construire une réponse optimale globale à partir d'états intermédiaires réutilisés.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-union-find" }],
    requiredForLevelCompletion: true,
  },
  levelFiveDynamicExercises,
  {
    id: "gate-level-5-dynamic-programming",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-dynamic-programming",
    chapterId: "level-5-dynamic-programming",
    orderIndex: 57.5,
    title: "Palier validé · Programmation dynamique",
    summary: "Le Niveau 5 peut maintenant se conclure sur un projet d'optimisation plus riche.",
    message: "Vous savez maintenant comparer une stratégie gloutonne à une stratégie par états mémorisés et choisir la bonne approche.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-dynamic-programming" }],
    requiredContentIds: levelFiveDynamicExercises.map((exercise) => exercise.id),
  },
);

const levelSixImplicitSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-58",
    orderIndex: 58,
    title: "Sortir d'une grille implicite",
    concept: "Graphes implicites",
    summary: "Traiter une grille comme un graphe sans construire explicitement toutes les arêtes.",
    missionText:
      "La grille est fournie dans le code. Écrivez une fonction `shortest_exit` qui calcule la distance minimale entre `S` et `E`, puis affichez-la.",
    lessonSections: [
      {
        heading: "Voisins implicites",
        content: "Dans une grille, les voisins d'une case se déduisent de ses coordonnées au lieu d'être stockés dans une liste d'adjacence.",
      },
      {
        heading: "BFS sur états",
        content: "Un parcours en largeur reste adapté pour obtenir la plus petite distance sur un graphe non pondéré implicite.",
      },
    ],
    exampleCode: `use std::collections::VecDeque;

fn shortest_exit(grid: &[Vec<char>]) -> i32 {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut start = (0usize, 0usize);
    let mut end = (0usize, 0usize);

    for row in 0..rows {
        for col in 0..cols {
            if grid[row][col] == 'S' {
                start = (row, col);
            }
            if grid[row][col] == 'E' {
                end = (row, col);
            }
        }
    }

    let mut distances = vec![vec![-1; cols]; rows];
    let mut queue = VecDeque::new();
    distances[start.0][start.1] = 0;
    queue.push_back(start);

    let directions = [(-1isize, 0isize), (1, 0), (0, -1), (0, 1)];

    while let Some((row, col)) = queue.pop_front() {
        if (row, col) == end {
            return distances[row][col];
        }

        for (delta_row, delta_col) in directions {
            let next_row = row as isize + delta_row;
            let next_col = col as isize + delta_col;

            if next_row < 0 || next_col < 0 {
                continue;
            }

            let next_row = next_row as usize;
            let next_col = next_col as usize;

            if next_row >= rows || next_col >= cols {
                continue;
            }

            if grid[next_row][next_col] == '#' || distances[next_row][next_col] != -1 {
                continue;
            }

            distances[next_row][next_col] = distances[row][col] + 1;
            queue.push_back((next_row, next_col));
        }
    }

    -1
}

fn main() {
    let grid = vec![
        vec!['S', '.', '.', '#'],
        vec!['#', '.', '.', '.'],
        vec!['.', '.', '#', 'E'],
    ];
    println!("{}", shortest_exit(&grid));
}`,
    instructions: [
      "Repérez `S` et `E` dans la grille.",
      "Parcourez les voisins via les quatre directions.",
      "Affichez la distance minimale trouvée.",
    ],
    expectedOutput: "5",
    hint: "La grille n'est qu'un graphe caché : utilisez les coordonnées comme état de parcours.",
    xpReward: 190,
    estimatedDurationMinutes: 22,
    difficulty: "advanced",
  },
  {
    id: "rust-level-59",
    orderIndex: 59,
    title: "Téléporteurs implicites",
    concept: "États enrichis",
    summary: "Ajouter un nouveau type de transition sans changer le principe du parcours.",
    missionText:
      "Le tableau `teleports` décrit des transitions directes entre salles. Calculez le nombre minimal d'étapes pour aller de `0` à `7`, puis affichez-le.",
    lessonSections: [
      {
        heading: "Étendre les voisins",
        content: "Un graphe implicite peut combiner plusieurs règles de transition : ici les salles adjacentes et les téléporteurs.",
      },
      {
        heading: "Même mécanique",
        content: "Même si les transitions changent, le BFS reste valable tant que chaque déplacement coûte 1.",
      },
    ],
    exampleCode: `use std::collections::VecDeque;

fn min_steps(teleports: &[Vec<usize>], target: usize) -> i32 {
    let mut distances = vec![-1; teleports.len()];
    let mut queue = VecDeque::new();
    distances[0] = 0;
    queue.push_back(0usize);

    while let Some(room) = queue.pop_front() {
        if room == target {
            return distances[room];
        }

        let mut next_rooms = teleports[room].clone();
        if room + 1 < teleports.len() {
            next_rooms.push(room + 1);
        }
        if room > 0 {
            next_rooms.push(room - 1);
        }

        for next in next_rooms {
            if distances[next] == -1 {
                distances[next] = distances[room] + 1;
                queue.push_back(next);
            }
        }
    }

    -1
}

fn main() {
    let teleports = vec![
        vec![3],
        vec![],
        vec![6],
        vec![5],
        vec![],
        vec![7],
        vec![],
        vec![],
    ];
    println!("{}", min_steps(&teleports, 7));
}`,
    instructions: [
      "Conservez les transitions normales `room - 1` et `room + 1` quand elles existent.",
      "Ajoutez aussi les téléporteurs.",
      "Affichez le nombre minimal d'étapes jusqu'à `7`.",
    ],
    expectedOutput: "3",
    hint: "Depuis `0`, le téléporteur vers `3` accélère fortement la recherche.",
    xpReward: 195,
    estimatedDurationMinutes: 23,
    difficulty: "advanced",
  },
];

const levelSixImplicitExercises = levelSixImplicitSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-implicit-graphs",
    chapterId: "level-6-implicit-graphs",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-5" }],
  }),
);

const levelSixImplicitChapter = buildStructuredChapter(
  {
    id: "level-6-implicit-graphs",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-implicit-graphs",
    orderIndex: 1,
    title: "Graphes implicites (2)",
    summary: "Naviguer dans des états où les voisins se déduisent à la volée.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-5" }],
    requiredForLevelCompletion: true,
  },
  levelSixImplicitExercises,
  {
    id: "gate-level-6-implicit-graphs",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-implicit-graphs",
    chapterId: "level-6-implicit-graphs",
    orderIndex: 59.5,
    title: "Palier validé · Graphes implicites",
    summary: "Les états implicites et leurs transitions sont bien maîtrisés.",
    message: "Vous savez maintenant raisonner sur des transitions générées à la volée sans perdre la lisibilité du parcours.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-implicit-graphs" }],
    requiredContentIds: levelSixImplicitExercises.map((exercise) => exercise.id),
  },
);

const levelSixDynamicAdvancedSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-60",
    orderIndex: 60,
    title: "Plus longue sous-suite croissante",
    concept: "Dynamique avancée",
    summary: "Comparer plusieurs sous-réponses pour construire une meilleure suite globale.",
    missionText:
      "L'entrée standard contient des entiers séparés par des espaces. Calculez la longueur de la plus longue sous-suite strictement croissante, puis affichez-la.",
    lessonSections: [
      {
        heading: "État par position",
        content: "La meilleure suite se terminant à une position dépend des meilleures suites terminant avant elle.",
      },
      {
        heading: "Double boucle lisible",
        content: "Avant d'optimiser davantage, une solution en `O(n²)` reste parfaite pour comprendre l'idée centrale.",
      },
    ],
    exampleCode: `fn lis_length(values: &[i32]) -> i32 {
    let mut dp = vec![1; values.len()];
    let mut best = 1;

    for index in 0..values.len() {
        for previous in 0..index {
            if values[previous] < values[index] {
                dp[index] = dp[index].max(dp[previous] + 1);
            }
        }
        best = best.max(dp[index]);
    }

    best
}

fn main() {
    let values = vec![3, 1, 4, 2, 8, 5, 6];
    println!("{}", lis_length(&values));
}`,
    instructions: [
      "Parsez les entiers depuis `stdin`.",
      "Construisez un tableau `dp` de longueur `n`.",
      "Affichez la meilleure longueur trouvée.",
    ],
    expectedOutput: "4",
    stdin: "3 1 4 2 8 5 6\n",
    hint: "La suite `1 2 5 6` est déjà une bonne piste.",
    xpReward: 200,
    estimatedDurationMinutes: 24,
    difficulty: "advanced",
  },
  {
    id: "rust-level-61",
    orderIndex: 61,
    title: "Découpage pondéré d'intervalles",
    concept: "Dynamique sur intervalles triés",
    summary: "Choisir une meilleure combinaison compatible plutôt que le meilleur intervalle isolé.",
    missionText:
      "Les intervalles `(début, fin, gain)` sont fournis dans le code. Triez-les par fin, calculez le meilleur gain compatible puis affichez-le.",
    lessonSections: [
      {
        heading: "Trier avant la DP",
        content: "Une DP sur intervalles commence souvent par un tri qui rend la compatibilité plus facile à exploiter.",
      },
      {
        heading: "Choix ou non-choix",
        content: "Pour chaque intervalle, on compare le gain obtenu en le prenant avec celui obtenu en l'ignorant.",
      },
    ],
    exampleCode: `fn best_gain(mut intervals: Vec<(i32, i32, i32)>) -> i32 {
    intervals.sort_by_key(|interval| interval.1);
    let mut dp = vec![0; intervals.len() + 1];

    for index in 0..intervals.len() {
        let (start, _end, gain) = intervals[index];
        let mut compatible = 0;

        for previous in (0..index).rev() {
            if intervals[previous].1 <= start {
                compatible = previous + 1;
                break;
            }
        }

        dp[index + 1] = dp[index].max(dp[compatible] + gain);
    }

    dp[intervals.len()]
}

fn main() {
    let intervals = vec![(0, 3, 5), (2, 5, 6), (4, 6, 5), (6, 8, 7)];
    println!("{}", best_gain(intervals));
}`,
    instructions: [
      "Triez les intervalles par fin croissante.",
      "Cherchez pour chaque intervalle le dernier compatible.",
      "Affichez le meilleur gain final.",
    ],
    expectedOutput: "17",
    hint: "Les intervalles `(0,3,5)`, `(4,6,5)` et `(6,8,7)` sont compatibles entre eux.",
    xpReward: 205,
    estimatedDurationMinutes: 24,
    difficulty: "advanced",
  },
];

const levelSixDynamicAdvancedExercises = levelSixDynamicAdvancedSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-dynamic-advanced",
    chapterId: "level-6-dynamic-advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-implicit-graphs" }],
  }),
);

const levelSixDynamicAdvancedChapter = buildStructuredChapter(
  {
    id: "level-6-dynamic-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-dynamic-advanced",
    orderIndex: 2,
    title: "Algorithmes dynamiques avancés",
    summary: "Passer à des états plus riches et à des arbitrages plus fins.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-implicit-graphs" }],
    requiredForLevelCompletion: true,
  },
  levelSixDynamicAdvancedExercises,
  {
    id: "gate-level-6-dynamic-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-dynamic-advanced",
    chapterId: "level-6-dynamic-advanced",
    orderIndex: 61.5,
    title: "Palier validé · Dynamique avancée",
    summary: "Les états plus complexes et les arbitrages de DP sont en place.",
    message: "Vous savez maintenant structurer une dynamique quand plusieurs sous-choix concurrents doivent être comparés proprement.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-dynamic-advanced" }],
    requiredContentIds: levelSixDynamicAdvancedExercises.map((exercise) => exercise.id),
  },
);

const levelSixScansAdvancedSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-62",
    orderIndex: 62,
    title: "Fenêtre glissante maximale",
    concept: "Balayages avancés",
    summary: "Faire avancer deux pointeurs pour maintenir une fenêtre valide.",
    missionText:
      "L'entrée standard contient une suite d'entiers positifs puis une borne `target`. Calculez la longueur maximale d'un sous-tableau dont la somme reste inférieure ou égale à `target`, puis affichez-la.",
    lessonSections: [
      {
        heading: "Étendre et rétrécir",
        content: "Une fenêtre glissante s'agrandit tant que la contrainte tient, puis se rétrécit quand elle est violée.",
      },
      {
        heading: "Pointeurs synchronisés",
        content: "Le pointeur gauche n'avance jamais en arrière, ce qui permet un parcours linéaire très efficace.",
      },
    ],
    exampleCode: `fn max_window(values: &[i32], target: i32) -> i32 {
    let mut left = 0usize;
    let mut total = 0;
    let mut best = 0;

    for right in 0..values.len() {
        total += values[right];

        while total > target {
            total -= values[left];
            left += 1;
        }

        best = best.max((right - left + 1) as i32);
    }

    best
}

fn main() {
    let values = vec![2, 1, 3, 2, 1, 1];
    println!("{}", max_window(&values, 6));
}`,
    instructions: [
      "Parsez la suite et la borne depuis `stdin`.",
      "Maintenez une somme courante de la fenêtre.",
      "Affichez la meilleure longueur obtenue.",
    ],
    expectedOutput: "3",
    stdin: "2 1 3 2 1 1\n6\n",
    hint: "Dès que la somme dépasse `target`, avancez le pointeur gauche.",
    xpReward: 200,
    estimatedDurationMinutes: 23,
    difficulty: "advanced",
  },
  {
    id: "rust-level-63",
    orderIndex: 63,
    title: "Différence maximale à droite",
    concept: "Préfixes et suffixes",
    summary: "Préparer une information à droite pour répondre vite à chaque position à gauche.",
    missionText:
      "L'entrée standard contient des entiers séparés par des espaces. Calculez la plus grande différence `values[j] - values[i]` avec `j > i`, puis affichez-la.",
    lessonSections: [
      {
        heading: "Information suffixe",
        content: "Conserver le meilleur élément à droite permet de répondre en une passe aux différentes positions de gauche.",
      },
      {
        heading: "Deux parcours complémentaires",
        content: "Un premier parcours depuis la droite prépare l'information, un second peut alors comparer rapidement.",
      },
    ],
    exampleCode: `fn max_difference(values: &[i32]) -> i32 {
    let mut best_right = values[values.len() - 1];
    let mut best = i32::MIN;

    for index in (0..values.len() - 1).rev() {
        best = best.max(best_right - values[index]);
        best_right = best_right.max(values[index]);
    }

    best
}

fn main() {
    let values = vec![9, 2, 6, 3, 11];
    println!("{}", max_difference(&values));
}`,
    instructions: [
      "Parsez les entiers depuis `stdin`.",
      "Parcourez le tableau depuis la droite.",
      "Affichez la meilleure différence trouvée.",
    ],
    expectedOutput: "9",
    stdin: "9 2 6 3 11\n",
    hint: "Le meilleur couple ici est `2` puis `11`.",
    xpReward: 205,
    estimatedDurationMinutes: 22,
    difficulty: "advanced",
  },
];

const levelSixScansAdvancedExercises = levelSixScansAdvancedSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scans-advanced",
    chapterId: "level-6-scans-advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-dynamic-advanced" }],
  }),
);

const levelSixScansAdvancedChapter = buildStructuredChapter(
  {
    id: "level-6-scans-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scans-advanced",
    orderIndex: 3,
    title: "Structures et balayages avancés",
    summary: "Maintenir un état plus riche pendant un parcours linéaire.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-dynamic-advanced" }],
    requiredForLevelCompletion: true,
  },
  levelSixScansAdvancedExercises,
  {
    id: "gate-level-6-scans-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scans-advanced",
    chapterId: "level-6-scans-advanced",
    orderIndex: 63.5,
    title: "Palier validé · Balayages avancés",
    summary: "Les structures auxiliaires et fenêtres sont bien en main.",
    message: "Vous savez maintenant choisir un état de balayage plus ambitieux pour éviter les recomputations inutiles.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scans-advanced" }],
    requiredContentIds: levelSixScansAdvancedExercises.map((exercise) => exercise.id),
  },
);

const levelSixSccSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-64",
    orderIndex: 64,
    title: "Compter les composantes fortement connexes",
    concept: "SCC",
    summary: "Introduire une première décomposition forte sur un petit graphe orienté.",
    missionText:
      "Le graphe orienté est fourni dans le code. Implémentez une version simple de Kosaraju pour compter les composantes fortement connexes, puis affichez leur nombre.",
    lessonSections: [
      {
        heading: "Ordre de fin",
        content: "Le premier parcours sert à empiler les sommets selon leur ordre de fin.",
      },
      {
        heading: "Graphe transposé",
        content: "Le second parcours se fait sur le graphe inversé pour reconstruire chaque composante fortement connexe.",
      },
    ],
    exampleCode: `fn dfs(graph: &[Vec<usize>], node: usize, seen: &mut [bool], order: &mut Vec<usize>) {
    seen[node] = true;
    for &next in &graph[node] {
        if !seen[next] {
            dfs(graph, next, seen, order);
        }
    }
    order.push(node);
}

fn dfs_reverse(graph: &[Vec<usize>], node: usize, seen: &mut [bool]) {
    seen[node] = true;
    for &next in &graph[node] {
        if !seen[next] {
            dfs_reverse(graph, next, seen);
        }
    }
}

fn count_scc(graph: &[Vec<usize>], reverse: &[Vec<usize>]) -> i32 {
    let mut seen = vec![false; graph.len()];
    let mut order = Vec::new();

    for node in 0..graph.len() {
        if !seen[node] {
            dfs(graph, node, &mut seen, &mut order);
        }
    }

    seen.fill(false);
    let mut count = 0;

    while let Some(node) = order.pop() {
        if !seen[node] {
            count += 1;
            dfs_reverse(reverse, node, &mut seen);
        }
    }

    count
}

fn main() {
    let graph = vec![vec![1], vec![2], vec![0, 3], vec![4], vec![3]];
    let reverse = vec![vec![2], vec![0], vec![1], vec![2, 4], vec![3]];
    println!("{}", count_scc(&graph, &reverse));
}`,
    instructions: [
      "Faites un premier DFS pour produire l'ordre de fin.",
      "Parcourez ensuite le graphe inversé dans l'ordre inverse.",
      "Affichez le nombre de composantes fortement connexes.",
    ],
    expectedOutput: "2",
    hint: "Les sommets `{0,1,2}` forment une SCC, `{3,4}` une autre.",
    xpReward: 210,
    estimatedDurationMinutes: 25,
    difficulty: "advanced",
  },
  {
    id: "rust-level-65",
    orderIndex: 65,
    title: "Identifier les composantes source",
    concept: "Condensation de graphe",
    summary: "Réutiliser la décomposition en SCC pour raisonner sur le graphe condensé.",
    missionText:
      "On vous donne les composantes de chaque sommet sous forme de tableau `component_of`, ainsi que les arêtes du graphe original. Comptez combien de composantes n'ont aucune arête entrante venant d'une autre composante, puis affichez ce nombre.",
    lessonSections: [
      {
        heading: "Passer au graphe condensé",
        content: "Chaque SCC devient un noeud, et seules les arêtes entre composantes distinctes comptent encore.",
      },
      {
        heading: "Composantes source",
        content: "Une composante source n'a pas d'arête entrante depuis une autre composante.",
      },
    ],
    exampleCode: `fn source_components(component_of: &[usize], edges: &[(usize, usize)], component_count: usize) -> i32 {
    let mut incoming = vec![false; component_count];

    for &(from, to) in edges {
        let left = component_of[from];
        let right = component_of[to];
        if left != right {
            incoming[right] = true;
        }
    }

    incoming.iter().filter(|has_incoming| !**has_incoming).count() as i32
}

fn main() {
    let component_of = vec![0, 0, 0, 1, 1, 2];
    let edges = vec![(0, 1), (1, 2), (2, 0), (2, 3), (3, 4), (4, 3), (4, 5)];
    println!("{}", source_components(&component_of, &edges, 3));
}`,
    instructions: [
      "Ignorez les arêtes internes à une même composante.",
      "Marquez les composantes qui reçoivent au moins une arête externe.",
      "Affichez le nombre de composantes source.",
    ],
    expectedOutput: "1",
    hint: "Ici seule la composante `{0,1,2}` n'a pas d'entrée externe.",
    xpReward: 210,
    estimatedDurationMinutes: 23,
    difficulty: "advanced",
  },
];

const levelSixSccExercises = levelSixSccSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scc",
    chapterId: "level-6-scc",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scans-advanced" }],
  }),
);

const levelSixSccChapter = buildStructuredChapter(
  {
    id: "level-6-scc",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scc",
    orderIndex: 4,
    title: "Composantes fortement connexes",
    summary: "Décomposer un graphe orienté en blocs fortement connectés.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scans-advanced" }],
    requiredForLevelCompletion: true,
  },
  levelSixSccExercises,
  {
    id: "gate-level-6-scc",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-scc",
    chapterId: "level-6-scc",
    orderIndex: 65.5,
    title: "Palier validé · SCC",
    summary: "La décomposition forte et le raisonnement sur le graphe condensé sont compris.",
    message: "Vous savez maintenant isoler les blocs fortement connexes d'un graphe orienté et raisonner à un niveau plus structurel.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scc" }],
    requiredContentIds: levelSixSccExercises.map((exercise) => exercise.id),
  },
);

const levelSixGeometrySeeds: ExerciseSeed[] = [
  {
    id: "rust-level-66",
    orderIndex: 66,
    title: "Tester une orientation",
    concept: "Géométrie algorithmique",
    summary: "Utiliser un produit vectoriel pour savoir de quel côté un point se situe.",
    missionText:
      "Les trois points `A`, `B` et `C` sont fournis dans le code. Calculez le signe du produit vectoriel et affichez `gauche` si `C` est à gauche du segment `AB`, sinon `droite`.",
    lessonSections: [
      {
        heading: "Produit vectoriel 2D",
        content: "Le signe du produit vectoriel en 2D permet de savoir si un virage est à gauche, à droite, ou aligné.",
      },
      {
        heading: "Passage au code",
        content: "Une simple expression arithmétique sur les coordonnées suffit pour obtenir le signe recherché.",
      },
    ],
    exampleCode: `fn orientation(ax: i32, ay: i32, bx: i32, by: i32, cx: i32, cy: i32) -> i32 {
    (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
}

fn main() {
    let cross = orientation(0, 0, 3, 0, 2, 2);
    if cross > 0 {
        println!("gauche");
    } else {
        println!("droite");
    }
}`,
    instructions: [
      "Écrivez une fonction `orientation`.",
      "Testez le signe du produit vectoriel.",
      "Affichez `gauche` ou `droite`.",
    ],
    expectedOutput: "gauche",
    hint: "Le point `C` est ici au-dessus du segment horizontal `AB`.",
    xpReward: 205,
    estimatedDurationMinutes: 22,
    difficulty: "advanced",
  },
  {
    id: "rust-level-67",
    orderIndex: 67,
    title: "Calculer l'aire d'un polygone",
    concept: "Formule du lacet",
    summary: "Passer d'une liste de sommets à une aire via une somme structurée.",
    missionText:
      "Les points d'un polygone simple sont fournis dans le code. Calculez son aire avec la formule du lacet, puis affichez le résultat entier attendu.",
    lessonSections: [
      {
        heading: "Somme croisée",
        content: "La formule du lacet additionne les produits croisés entre sommets consécutifs.",
      },
      {
        heading: "Boucler sur le premier sommet",
        content: "Le dernier segment relie toujours le dernier point au premier.",
      },
    ],
    exampleCode: `fn polygon_area(points: &[(i32, i32)]) -> i32 {
    let mut total = 0;

    for index in 0..points.len() {
        let next = (index + 1) % points.len();
        total += points[index].0 * points[next].1;
        total -= points[index].1 * points[next].0;
    }

    total.abs() / 2
}

fn main() {
    let points = vec![(0, 0), (4, 0), (4, 3), (0, 3)];
    println!("{}", polygon_area(&points));
}`,
    instructions: [
      "Parcourez tous les sommets et leur successeur.",
      "N'oubliez pas le retour au premier point.",
      "Affichez l'aire finale.",
    ],
    expectedOutput: "12",
    hint: "Le rectangle de l'exemple a une largeur 4 et une hauteur 3.",
    xpReward: 210,
    estimatedDurationMinutes: 23,
    difficulty: "advanced",
  },
];

const levelSixGeometryExercises = levelSixGeometrySeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-geometry-advanced",
    chapterId: "level-6-geometry-advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scc" }],
  }),
);

const levelSixGeometryChapter = buildStructuredChapter(
  {
    id: "level-6-geometry-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-geometry-advanced",
    orderIndex: 5,
    title: "Calculs géométriques (2)",
    summary: "Passer des coordonnées à des raisonnements géométriques plus structurés.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scc" }],
    requiredForLevelCompletion: true,
  },
  levelSixGeometryExercises,
  {
    id: "gate-level-6-geometry-advanced",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-geometry-advanced",
    chapterId: "level-6-geometry-advanced",
    orderIndex: 67.5,
    title: "Palier validé · Géométrie",
    summary: "Les premières traductions géométriques avancées sont en place.",
    message: "Vous savez maintenant passer des coordonnées à des invariants géométriques simples mais puissants.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-geometry-advanced" }],
    requiredContentIds: levelSixGeometryExercises.map((exercise) => exercise.id),
  },
);

const levelSixFlowsSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-68",
    orderIndex: 68,
    title: "Flot maximal miniature",
    concept: "Flots",
    summary: "Comprendre un premier réseau de capacités sur un cas très réduit.",
    missionText:
      "Le graphe résiduel est fourni dans le code. Implémentez un BFS d'augmenting path et affichez la valeur du flot maximal obtenu entre `source` et `sink`.",
    lessonSections: [
      {
        heading: "Chemin augmentant",
        content: "Un flot se construit en trouvant successivement des chemins sur le graphe résiduel.",
      },
      {
        heading: "Cas réduit, idée claire",
        content: "Sur un petit réseau, l'objectif est surtout de comprendre la logique du résiduel et de la mise à jour.",
      },
    ],
    exampleCode: `use std::collections::VecDeque;

fn bfs(capacity: &[Vec<i32>], flow: &[Vec<i32>], source: usize, sink: usize, parent: &mut [i32]) -> bool {
    parent.fill(-1);
    parent[source] = source as i32;
    let mut queue = VecDeque::new();
    queue.push_back(source);

    while let Some(node) = queue.pop_front() {
        for next in 0..capacity.len() {
            if parent[next] == -1 && capacity[node][next] - flow[node][next] > 0 {
                parent[next] = node as i32;
                if next == sink {
                    return true;
                }
                queue.push_back(next);
            }
        }
    }

    false
}

fn max_flow(capacity: &[Vec<i32>], source: usize, sink: usize) -> i32 {
    let mut flow = vec![vec![0; capacity.len()]; capacity.len()];
    let mut parent = vec![-1; capacity.len()];
    let mut total = 0;

    while bfs(capacity, &flow, source, sink, &mut parent) {
        let mut add = i32::MAX;
        let mut node = sink;

        while node != source {
            let previous = parent[node] as usize;
            add = add.min(capacity[previous][node] - flow[previous][node]);
            node = previous;
        }

        node = sink;
        while node != source {
            let previous = parent[node] as usize;
            flow[previous][node] += add;
            flow[node][previous] -= add;
            node = previous;
        }

        total += add;
    }

    total
}

fn main() {
    let capacity = vec![
        vec![0, 3, 2, 0],
        vec![0, 0, 1, 2],
        vec![0, 0, 0, 2],
        vec![0, 0, 0, 0],
    ];
    println!("{}", max_flow(&capacity, 0, 3));
}`,
    instructions: [
      "Cherchez un chemin augmentant en BFS.",
      "Calculez la capacité résiduelle minimale sur ce chemin.",
      "Mettez à jour le flot puis affichez le total final.",
    ],
    expectedOutput: "4",
    hint: "Deux chemins augmentants suffisent ici pour atteindre le flot maximal.",
    xpReward: 220,
    estimatedDurationMinutes: 27,
    difficulty: "advanced",
  },
  {
    id: "rust-level-69",
    orderIndex: 69,
    title: "Couplage biparti simple",
    concept: "Couplages",
    summary: "Réutiliser une recherche de chemin augmentant sur une structure bipartie plus simple.",
    missionText:
      "Les préférences entre agents de gauche et tâches de droite sont fournies dans le code. Calculez la taille du couplage maximum, puis affichez-la.",
    lessonSections: [
      {
        heading: "Affecter sans conflit",
        content: "Un couplage associe des éléments deux à deux sans réutiliser le même sommet à droite.",
      },
      {
        heading: "Chemin augmentant local",
        content: "Une DFS qui tente de rerouter une affectation existante suffit sur les petits cas de départ.",
      },
    ],
    exampleCode: `fn try_match(
    left: usize,
    graph: &[Vec<usize>],
    seen: &mut [bool],
    matched_right: &mut [Option<usize>],
) -> bool {
    for &right in &graph[left] {
        if seen[right] {
            continue;
        }
        seen[right] = true;

        if matched_right[right].is_none() || try_match(matched_right[right].unwrap(), graph, seen, matched_right) {
            matched_right[right] = Some(left);
            return true;
        }
    }

    false
}

fn max_matching(graph: &[Vec<usize>], right_count: usize) -> i32 {
    let mut matched_right = vec![None; right_count];
    let mut count = 0;

    for left in 0..graph.len() {
        let mut seen = vec![false; right_count];
        if try_match(left, graph, &mut seen, &mut matched_right) {
            count += 1;
        }
    }

    count
}

fn main() {
    let graph = vec![vec![0, 1], vec![1], vec![1, 2]];
    println!("{}", max_matching(&graph, 3));
}`,
    instructions: [
      "Tentez d'affecter chaque sommet de gauche.",
      "Autorisez la réaffectation d'un sommet de droite déjà pris.",
      "Affichez la taille du couplage final.",
    ],
    expectedOutput: "3",
    hint: "Le troisième sommet de gauche peut forcer une réaffectation utile.",
    xpReward: 220,
    estimatedDurationMinutes: 26,
    difficulty: "advanced",
  },
];

const levelSixFlowsExercises = levelSixFlowsSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-flows-matchings",
    chapterId: "level-6-flows-matchings",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-geometry-advanced" }],
  }),
);

const levelSixFlowsChapter = buildStructuredChapter(
  {
    id: "level-6-flows-matchings",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-flows-matchings",
    orderIndex: 6,
    title: "Flots et couplages",
    summary: "Entrer dans les réseaux de capacité et les affectations sans conflit.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-geometry-advanced" }],
    requiredForLevelCompletion: true,
  },
  levelSixFlowsExercises,
  {
    id: "gate-level-6-flows-matchings",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-flows-matchings",
    chapterId: "level-6-flows-matchings",
    orderIndex: 69.5,
    title: "Palier validé · Flots et couplages",
    summary: "Les premiers réseaux de capacité et chemins augmentants sont assimilés.",
    message: "Vous savez maintenant passer d'un simple parcours à une logique d'augmentation itérative sur un réseau.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-flows-matchings" }],
    requiredContentIds: levelSixFlowsExercises.map((exercise) => exercise.id),
  },
);

const levelSixTrainingSeeds: ExerciseSeed[] = [
  {
    id: "rust-level-70",
    orderIndex: 70,
    title: "Entraînement final · Traversée optimisée",
    concept: "Synthèse de parcours",
    summary: "Mélanger état implicite, coût et structure auxiliaire dans un même exercice.",
    missionText:
      "Une petite carte avec coûts est fournie dans le code. Utilisez une version simple de Dijkstra sur la grille pour afficher le coût minimal jusqu'à la sortie.",
    lessonSections: [
      {
        heading: "Combiner les briques",
        content: "Cet exercice mélange représentation implicite, parcours et gestion d'un coût accumulé.",
      },
      {
        heading: "Faire simple d'abord",
        content: "Même sans tas binaire, une version claire et correcte reste pertinente pour consolider l'approche.",
      },
    ],
    exampleCode: `fn min_cost(grid: &[Vec<i32>]) -> i32 {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut dist = vec![vec![i32::MAX; cols]; rows];
    let mut used = vec![vec![false; cols]; rows];
    dist[0][0] = grid[0][0];

    for _ in 0..rows * cols {
        let mut current = None;

        for row in 0..rows {
            for col in 0..cols {
                if !used[row][col]
                    && (current.is_none()
                        || dist[row][col] < dist[current.unwrap().0][current.unwrap().1])
                {
                    current = Some((row, col));
                }
            }
        }

        let Some((row, col)) = current else {
            break;
        };
        used[row][col] = true;

        let directions = [(-1isize, 0isize), (1, 0), (0, -1), (0, 1)];
        for (delta_row, delta_col) in directions {
            let next_row = row as isize + delta_row;
            let next_col = col as isize + delta_col;
            if next_row < 0 || next_col < 0 {
                continue;
            }
            let next_row = next_row as usize;
            let next_col = next_col as usize;
            if next_row >= rows || next_col >= cols {
                continue;
            }

            let candidate = dist[row][col] + grid[next_row][next_col];
            if candidate < dist[next_row][next_col] {
                dist[next_row][next_col] = candidate;
            }
        }
    }

    dist[rows - 1][cols - 1]
}

fn main() {
    let grid = vec![vec![1, 3, 1], vec![1, 5, 1], vec![2, 1, 1]];
    println!("{}", min_cost(&grid));
}`,
    instructions: [
      "Initialisez les distances avec `i32::MAX`.",
      "Choisissez à chaque tour la case non utilisée la moins coûteuse.",
      "Affichez le coût minimal final.",
    ],
    expectedOutput: "7",
    hint: "Le meilleur chemin évite la case centrale de coût 5.",
    xpReward: 225,
    estimatedDurationMinutes: 27,
    difficulty: "advanced",
  },
  {
    id: "rust-level-71",
    orderIndex: 71,
    title: "Entraînement final · Chaîne de décisions",
    concept: "Synthèse dynamique",
    summary: "Consolider plusieurs réflexes de DP sur un exercice de fin de parcours.",
    missionText:
      "L'entrée standard contient des gains entiers sur une ligne. Vous pouvez prendre un gain et sauter le suivant, ou ignorer le gain courant. Calculez le score maximal possible puis affichez-le.",
    lessonSections: [
      {
        heading: "Choix exclusifs",
        content: "À chaque position, on compare l'option de prendre le gain courant avec celle de passer au suivant.",
      },
      {
        heading: "Clôturer le parcours",
        content: "Cet exercice sert de synthèse : état, transition, comparaison et restitution propre de la réponse.",
      },
    ],
    exampleCode: `fn best_score(values: &[i32]) -> i32 {
    if values.is_empty() {
        return 0;
    }
    if values.len() == 1 {
        return values[0];
    }

    let mut dp = vec![0; values.len()];
    dp[0] = values[0];
    dp[1] = values[0].max(values[1]);

    for index in 2..values.len() {
        dp[index] = dp[index - 1].max(dp[index - 2] + values[index]);
    }

    dp[values.len() - 1]
}

fn main() {
    let values = vec![4, 2, 7, 3, 8];
    println!("{}", best_score(&values));
}`,
    instructions: [
      "Parsez les entiers depuis `stdin`.",
      "Construisez une DP où chaque position compare prise et non-prise.",
      "Affichez le score maximal final.",
    ],
    expectedOutput: "19",
    stdin: "4 2 7 3 8\n",
    hint: "La meilleure combinaison ici prend `4`, `7` et `8`.",
    xpReward: 230,
    estimatedDurationMinutes: 26,
    difficulty: "advanced",
  },
];

const levelSixTrainingExercises = levelSixTrainingSeeds.map((seed) =>
  createExercise(seed, {
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-final-training",
    chapterId: "level-6-final-training",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-flows-matchings" }],
  }),
);

const levelSixTrainingChapter = buildStructuredChapter(
  {
    id: "level-6-final-training",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-final-training",
    orderIndex: 7,
    title: "Exercices d'entraînement du niveau 6",
    summary: "Consolider les briques avancées sur deux problèmes de synthèse.",
    estimatedProblemCount: 2,
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-flows-matchings" }],
    requiredForLevelCompletion: true,
  },
  levelSixTrainingExercises,
  {
    id: "gate-level-6-final-training",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-final-training",
    chapterId: "level-6-final-training",
    orderIndex: 71.5,
    title: "Palier validé · Entraînement final",
    summary: "Le parcours avancé peut maintenant se conclure sur un vrai projet final.",
    message: "Toutes les briques du parcours sont en place. Vous êtes prêt à assembler un solveur complet dans un environnement projet.",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-final-training" }],
    requiredContentIds: levelSixTrainingExercises.map((exercise) => exercise.id),
  },
);

const curriculumLevels: CurriculumLevel[] = [
  {
    id: "curriculum-level-1",
    levelNumber: 1,
    orderIndex: 1,
    title: "Niveau 1 — Fondamentaux impératifs",
    summary: "Affichage, répétitions, variables, entrée standard et conditions simples.",
    unlockRules: [{ type: "always" }],
    themes: [
      {
        id: "theme-level-1-output",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 1,
        title: "Affichage et séquences",
        summary: "Produire une sortie console juste, stable et ordonnée.",
        unlockRules: [{ type: "always" }],
        chapters: [levelOneOutputChapter],
      },
      {
        id: "theme-level-1-repetition",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 2,
        title: "Répétitions d’instructions",
        summary: "Découvrir les premières boucles sur des cas courts et lisibles.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-output-and-sequences" }],
        chapters: [levelOneRepetitionChapter],
      },
      {
        id: "theme-level-1-variables",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 3,
        title: "Variables et calculs",
        summary: "Stocker des valeurs, les transformer puis les afficher proprement.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-basic-repetition" }],
        chapters: [levelOneVariablesChapter],
      },
      {
        id: "theme-level-1-input",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 4,
        title: "Lecture de l’entrée",
        summary: "Découvrir `stdin` par petites marches : import, tampon, lecture, nettoyage, conversion puis réutilisation.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-variables-and-calculations" }],
        chapters: [
          levelOneInputImportsChapter,
          levelOneInputBufferChapter,
          levelOneInputReadLineChapter,
          levelOneInputTrimChapter,
          levelOneInputParseChapter,
          levelOneInputTwoLinesChapter,
          levelOneInputTextReuseChapter,
        ],
      },
      {
        id: "theme-level-1-conditions",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 5,
        title: "Tests et conditions",
        summary: "Découvrir `if / else`, puis réutiliser progressivement l'entrée standard déjà maîtrisée.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-input-text-reuse" }],
        chapters: [levelOneConditionsChapter, levelOneConditionsInputChapter, levelOneConditionsCalculationChapter],
      },
      {
        id: "theme-level-1-project-prep",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 5.3,
        title: "Préparer le premier projet Rust",
        summary: "Introduire `Cargo.toml`, `mod` et `pub` avant d'ouvrir le premier workspace multi-fichiers.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditions-calculation" }],
        chapters: [levelOneProjectCargoChapter, levelOneProjectModuleChapter, levelOneProjectVisibilityChapter],
        milestoneProjectId: "project-level-1-core-console",
      },
      {
        id: "theme-level-1-advanced-structures",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 6,
        title: "Structures avancées",
        summary: "Premiers tuples et tableaux fixes après le premier projet pilote.",
        unlockRules: [{ type: "complete_content", contentId: "project-level-1-core-console" }],
        chapters: [levelOneAdvancedStructuresChapter],
      },
      {
        id: "theme-level-1-advanced-conditions",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 7,
        title: "Conditions avancées, opérateurs booléens",
        summary: "Écrire des règles composées avec `&&` et `||`.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-structures" }],
        chapters: [levelOneAdvancedConditionsChapter],
      },
      {
        id: "theme-level-1-conditional-loops",
        levelId: "curriculum-level-1",
        levelNumber: 1,
        orderIndex: 8,
        title: "Répétitions conditionnées",
        summary: "Boucles pilotées par une condition et compteurs simples.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-1-advanced-conditions" }],
        chapters: [levelOneConditionalLoopsChapter],
        milestoneProjectId: "project-level-1-watchtower-briefing",
      },
    ],
  },
  {
    id: "curriculum-level-2",
    levelNumber: 2,
    orderIndex: 2,
    title: "Niveau 2 — Outils Rust intermédiaires",
    summary: "Décimales, tableaux, chaînes et fonctions pour préparer des problèmes plus structurés.",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-1" }],
    themes: [
      {
        id: "theme-level-2-floats",
        levelId: "curriculum-level-2",
        levelNumber: 2,
        orderIndex: 1,
        title: "Nombres à virgule",
        summary: "Manipuler des décimales et contrôler le format des sorties.",
        unlockRules: [{ type: "complete_level", levelId: "curriculum-level-1" }],
        chapters: [levelTwoFloatsChapter],
      },
      {
        id: "theme-level-2-arrays",
        levelId: "curriculum-level-2",
        levelNumber: 2,
        orderIndex: 2,
        title: "Tableaux",
        summary: "Stocker plusieurs valeurs puis les balayer proprement.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-2-floats-and-tools" }],
        chapters: [levelTwoArraysChapter],
      },
      {
        id: "theme-level-2-strings",
        levelId: "curriculum-level-2",
        levelNumber: 2,
        orderIndex: 3,
        title: "Chaînes de caractères",
        summary: "Nettoyer, assembler et découper du texte de manière fiable.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-2-arrays" }],
        chapters: [levelTwoStringsChapter],
      },
      {
        id: "theme-level-2-functions",
        levelId: "curriculum-level-2",
        levelNumber: 2,
        orderIndex: 4,
        title: "Fonctions",
        summary: "Modulariser calculs et règles avant le premier projet de synthèse du niveau.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-2-strings" }],
        chapters: [levelTwoFunctionsChapter],
        milestoneProjectId: "project-level-2-signal-lab",
      },
    ],
  },
  {
    id: "curriculum-level-3",
    levelNumber: 3,
    orderIndex: 3,
    title: "Niveau 3 — Premiers réflexes algorithmiques",
    summary: "Entrer dans les balayages, le comptage et les manipulations de chaînes orientées résolution de problèmes.",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-2" }],
    themes: [
      {
        id: "theme-level-3-scans",
        levelId: "curriculum-level-3",
        levelNumber: 3,
        orderIndex: 1,
        title: "Balayages et coût",
        summary: "Parcourir une séquence une seule fois et comprendre ce que cela apporte.",
        unlockRules: [{ type: "complete_level", levelId: "curriculum-level-2" }],
        chapters: [levelThreeFoundationsChapter],
      },
      {
        id: "theme-level-3-strings",
        levelId: "curriculum-level-3",
        levelNumber: 3,
        orderIndex: 2,
        title: "Caractères et chaînes",
        summary: "Décomposer un texte, raisonner sur ses caractères et produire une nouvelle chaîne.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-3-scans-and-complexity" }],
        chapters: [levelThreeStringsChapter],
      },
    ],
  },
  {
    id: "curriculum-level-4",
    levelNumber: 4,
    orderIndex: 4,
    title: "Niveau 4 à Structures et méthodes",
    summary: "Arbres, méthodes de résolution et premières familles de graphes.",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-3" }],
    themes: [
      {
        id: "theme-level-4-methods",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 1,
        title: "Méthodes et code propre",
        summary: "Structurer une solution avant de s'attaquer à des problèmes plus riches.",
        unlockRules: [{ type: "complete_level", levelId: "curriculum-level-3" }],
        chapters: [levelFourMethodsChapter],
      },
      {
        id: "theme-level-4-trees",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 2,
        title: "Arbres",
        summary: "Premières structures récursives et parcours sur arbre binaire.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-4-methods-and-clean-code" }],
        chapters: [levelFourTreesChapter],
      },
      {
        id: "theme-level-4-scans",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 3,
        title: "Structures et balayages",
        summary: "Déduire une information utile au fil d'un parcours linéaire.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-4-trees" }],
        chapters: [levelFourScansChapter],
      },
      {
        id: "theme-level-4-recursion",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 4,
        title: "Récursivité avancée",
        summary: "Renforcer les cas de base et la décomposition récursive.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-4-structures-and-scans" }],
        chapters: [levelFourRecursionChapter],
      },
      {
        id: "theme-level-4-geometry",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 5,
        title: "Calculs géométriques (1)",
        summary: "Transformer des coordonnées en mesures fiables et lisibles.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-4-recursion-advanced" }],
        chapters: [levelFourGeometryChapter],
      },
      {
        id: "theme-level-4-graphs",
        levelId: "curriculum-level-4",
        levelNumber: 4,
        orderIndex: 6,
        title: "Graphes et exploration",
        summary: "Entrer dans les représentations de graphe, les parcours et la distance minimale.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-4-geometry-1" }],
        chapters: [levelFourGraphsChapter],
        milestoneProjectId: "project-level-4-map-explorer",
      },
    ],
  },
  {
    id: "curriculum-level-5",
    levelNumber: 5,
    orderIndex: 5,
    title: "Niveau 5 — Algorithmes classiques avancés",
    summary: "Gloutons, diviser pour régner, arbres binaires, tris efficaces, plus courts chemins, union-find et dynamique.",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-4" }],
    themes: [
      {
        id: "theme-level-5-greedy",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 1,
        title: "Gloutons",
        summary: "Prendre un bon choix local quand la structure du problème le permet.",
        unlockRules: [{ type: "complete_level", levelId: "curriculum-level-4" }],
        chapters: [levelFiveGreedyChapter],
      },
      {
        id: "theme-level-5-divide-conquer",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 2,
        title: "Diviser pour régner",
        summary: "Découper un problème puis recombiner les sous-réponses.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-greedy-strategies" }],
        chapters: [levelFiveDivideChapter],
      },
      {
        id: "theme-level-5-binary-trees",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 3,
        title: "Arbres binaires",
        summary: "Approfondir les structures arborescentes et leurs parcours classiques.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-divide-and-conquer" }],
        chapters: [levelFiveBinaryTreesChapter],
      },
      {
        id: "theme-level-5-efficient-sorts",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 4,
        title: "Tris efficaces",
        summary: "Construire des tris plus performants que les approches élémentaires.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-binary-trees" }],
        chapters: [levelFiveSortsChapter],
      },
      {
        id: "theme-level-5-shortest-paths",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 5,
        title: "Plus courts chemins",
        summary: "Passer des parcours aux premières distances minimales sur graphe.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-efficient-sorts" }],
        chapters: [levelFiveShortestPathsChapter],
      },
      {
        id: "theme-level-5-union-find",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 6,
        title: "Union-Find",
        summary: "Maintenir des composantes et répondre à des requêtes de connectivité.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-shortest-paths" }],
        chapters: [levelFiveUnionFindChapter],
      },
      {
        id: "theme-level-5-dynamic-programming",
        levelId: "curriculum-level-5",
        levelNumber: 5,
        orderIndex: 7,
        title: "Programmation dynamique",
        summary: "Optimiser une réponse globale en mémorisant des états intermédiaires.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-5-union-find" }],
        chapters: [levelFiveDynamicChapter],
        milestoneProjectId: "project-level-5-optimizer-engine",
      },
    ],
  },
  {
    id: "curriculum-level-6",
    levelNumber: 6,
    orderIndex: 6,
    title: "Niveau 6 — Avancé et entraînement final",
    summary: "Graphes implicites, dynamiques avancées, balayages avancés, SCC, géométrie, flots, couplages et consolidation finale.",
    unlockRules: [{ type: "complete_level", levelId: "curriculum-level-5" }],
    themes: [
      {
        id: "theme-level-6-implicit-graphs",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 1,
        title: "Graphes implicites (2)",
        summary: "Naviguer dans des états et transitions générés à la volée.",
        unlockRules: [{ type: "complete_level", levelId: "curriculum-level-5" }],
        chapters: [levelSixImplicitChapter],
      },
      {
        id: "theme-level-6-dynamic-advanced",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 2,
        title: "Algorithmes dynamiques avancés",
        summary: "Étendre les états et les arbitrages de DP à des cas plus denses.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-implicit-graphs" }],
        chapters: [levelSixDynamicAdvancedChapter],
      },
      {
        id: "theme-level-6-scans-advanced",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 3,
        title: "Structures et balayages avancés",
        summary: "Maintenir des fenêtres, suffixes et états auxiliaires plus riches.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-dynamic-advanced" }],
        chapters: [levelSixScansAdvancedChapter],
      },
      {
        id: "theme-level-6-scc",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 4,
        title: "Composantes fortement connexes",
        summary: "Décomposer les graphes orientés en blocs fortement connectés.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scans-advanced" }],
        chapters: [levelSixSccChapter],
      },
      {
        id: "theme-level-6-geometry-advanced",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 5,
        title: "Calculs géométriques (2)",
        summary: "Passer de coordonnées à des invariants géométriques plus structurés.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-scc" }],
        chapters: [levelSixGeometryChapter],
      },
      {
        id: "theme-level-6-flows-matchings",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 6,
        title: "Flots et couplages",
        summary: "Introduire chemins augmentants, réseaux de capacité et affectations sans conflit.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-geometry-advanced" }],
        chapters: [levelSixFlowsChapter],
      },
      {
        id: "theme-level-6-final-training",
        levelId: "curriculum-level-6",
        levelNumber: 6,
        orderIndex: 7,
        title: "Entraînement final",
        summary: "Clore le parcours avec deux exercices de synthèse avant le projet final.",
        unlockRules: [{ type: "complete_chapter", chapterId: "level-6-flows-matchings" }],
        chapters: [levelSixTrainingChapter],
        milestoneProjectId: "project-level-6-advanced-solver",
      },
    ],
  },
];

export const rustFoundationsCurriculum: Curriculum = {
  id: "rust-foundations-curriculum",
  title: "CoreQuest Rust",
  levels: curriculumLevels,
};

