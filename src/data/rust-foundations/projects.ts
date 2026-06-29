import { ProjectContent } from "@/types/content";

export const rustPilotProjects: ProjectContent[] = [
  {
    id: "project-level-1-core-console",
    type: "project",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-project-prep",
    chapterId: "level-1-project-pub",
    orderIndex: 15.55,
    title: "Projet pilote · Console de contrôle",
    summary:
      "Assembler un petit programme Rust structur? en plusieurs fichiers pour lire une entrée et produire un état console cohérent.",
    xpReward: 150,
    estimatedDurationMinutes: 35,
    difficulty: "intermediate",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-project-pub" }],
    overview:
      "Ce projet de synthèse vous fait passer d'exercices unitaires à un petit programme structur?. Vous devez complèter les fichiers modifiables pour lire un mode, lire un niveau d'énergie et afficher un état final clair.",
    goals: [
      "travailler avec plusieurs fichiers Rust dans une structure lisible ;",
      "réutiliser la lecture de `stdin` dans un petit flux applicatif ;",
      "séparer la logique métier de l'orchestration dans `main.rs` ;",
      "valider le projet avec des scénarios exécutés dans une sandbox Cargo encadrée.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/main.rs", "src/status.rs"],
      readonlyFiles: ["Cargo.toml", "src/messages.rs", "README.md"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le programme lit deux lignes d'entrée : le mode puis le niveau d'énergie.",
        "Le message final est construit via `build_status_line`.",
        "Le texte de sortie final suit le format attendu dans `README.md`.",
      ],
      validationScenarios: [
        {
          id: "scenario-normal-mode",
          title: "Mode normal",
          description: "Le préfixe doit rester `STATUT` quand le mode n'est pas `alerte`.",
          stdin: `normal
42
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "STATUT | mode=normal | énergie=42",
          },
        },
        {
          id: "scenario-alert-mode",
          title: "Mode alerte",
          description: "Le préfixe doit basculer vers `ALERTE` quand le mode vaut `alerte`.",
          stdin: `alerte
7
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "ALERTE | mode=alerte | énergie=7",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "core_console"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification produit du projet.",
          content: `# Console de contrôle

## Entrée
- ligne 1 : un mode (\`normal\`, \`maintenance\`, \`alerte\`)
- ligne 2 : un niveau d'énergie entier

## Sortie attendue
- si le mode vaut \`alerte\`, la sortie commence par \`ALERTE\`
- sinon la sortie commence par \`STATUT\`
- la ligne finale doit toujours contenir le mode et le niveau d'énergie

Exemple : \`STATUT | mode=normal | énergie=42\`
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Messages normalisés utilisés par le projet.",
          content: `pub const ALERT_PREFIX: &str = "ALERTE";
pub const STATUS_PREFIX: &str = "STATUT";
`,
        },
        {
          path: "src/status.rs",
          readonly: false,
          description: "Logique métier à corriger pour construire la ligne finale.",
          content: `pub fn build_status_line(mode: &str, energy: i32) -> String {
    format!("mode={} | énergie={}", mode, energy)
}
`,
        },
        {
          path: "src/main.rs",
          readonly: false,
          description: "Point d'entrée du programme à relier au module métier.",
          content: `mod messages;
mod status;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let mut lines = input.lines();
    let mode = lines.next().unwrap_or("normal").trim();
    let energy: i32 = lines
        .next()
        .unwrap_or("0")
        .trim()
        .parse()
        .unwrap_or(0);

    let output = status::build_status_line(mode, energy);
    println!("{}", output);
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le projet garde une structure multi-fichiers simple et lisible.",
      "`src/main.rs` orchestre la lecture d'entrée puis délègue la construction du message.",
      "`src/status.rs` reste la source de vérité pour le format final.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Les fichiers en lecture seule ne sont pas ?ditables dans l'interface.",
    ],
    statusNote:
      "Ce premier projet valide la transition entre exercices unitaires et construction multi-fichiers.",
  },
  {
    id: "project-level-2-signal-lab",
    type: "project",
    levelId: "curriculum-level-2",
    levelNumber: 2,
    themeId: "theme-level-2-functions",
    chapterId: "level-2-functions",
    orderIndex: 28,
    title: "Projet de synthèse · Analyseur de signaux",
    summary:
      "Construire un petit analyseur qui lit un seuil et une série de mesures, puis produit un rapport synthétique fiable.",
    xpReward: 220,
    estimatedDurationMinutes: 45,
    difficulty: "advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-2-functions" }],
    overview:
      "Ce projet de fin de Niveau 2 vous demande de parser une ligne de valeurs décimales, calculer une moyenne, compter les mesures au-dessus d'un seuil puis produire un rapport final stable.",
    goals: [
      "réutiliser les flottants, les tableaux dynamiques, le texte et les fonctions dans un même projet ;",
      "séparer parsing, calcul et orchestration dans plusieurs fichiers ;",
      "valider plusieurs scénarios d'entrée avant l'ouverture du Niveau 3 ;",
      "préparer la montée vers des problèmes algorithmiques plus denses.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/parser.rs", "src/analysis.rs"],
      readonlyFiles: ["Cargo.toml", "README.md", "src/main.rs", "src/messages.rs"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le projet lit un seuil sur la première ligne puis une liste de mesures séparées par des virgules.",
        "`parse_samples` retourne toutes les valeurs décimales valides dans l'ordre.",
        "`build_report` choisit `ALERTE` si au moins une mesure dépasse le seuil, sinon `STATUT`.",
      ],
      validationScenarios: [
        {
          id: "signal-status-normal",
          title: "Seuil non dépassé",
          description: "Le rapport doit rester en statut normal quand aucune mesure ne dépasse le seuil.",
          stdin: `15.0
8.0,12.0,13.5
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "STATUT | moyenne=11.17 | pics=0",
          },
        },
        {
          id: "signal-status-alert",
          title: "Seuil dépassé",
          description: "Le rapport doit basculer en alerte et compter les pics détectés.",
          stdin: `20.0
21.0,22.0,19.0
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "ALERTE | moyenne=20.67 | pics=2",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "signal_lab"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification fonctionnelle du projet.",
          content: `# Analyseur de signaux

## Entrée
- ligne 1 : un seuil flottant
- ligne 2 : des mesures flottantes séparées par des virgules

## Sortie attendue
- \`STATUT\` si aucune mesure ne dépasse le seuil
- \`ALERTE\` sinon
- toujours afficher la moyenne à deux décimales et le nombre de pics détectés

Exemple : \`ALERTE | moyenne=20.67 | pics=2\`
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Préfixes de statut utilisés dans le rapport.",
          content: `pub const ALERT_PREFIX: &str = "ALERTE";
pub const STATUS_PREFIX: &str = "STATUT";
`,
        },
        {
          path: "src/main.rs",
          readonly: true,
          description: "Point d'entrée principal du projet.",
          content: `mod analysis;
mod messages;
mod parser;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let mut lines = input.lines();
    let threshold = lines
        .next()
        .unwrap_or("0")
        .trim()
        .parse::<f64>()
        .unwrap_or(0.0);
    let samples_line = lines.next().unwrap_or("");
    let samples = parser::parse_samples(samples_line);

    let report = analysis::build_report(&samples, threshold);
    println!("{}", report);
}
`,
        },
        {
          path: "src/parser.rs",
          readonly: false,
          description: "Fonctions de parsing des mesures.",
          content: `pub fn parse_samples(input: &str) -> Vec<f64> {
    let _ = input;
    vec![]
}
`,
        },
        {
          path: "src/analysis.rs",
          readonly: false,
          description: "Calculs et génération du rapport final.",
          content: `use crate::messages::{ALERT_PREFIX, STATUS_PREFIX};

pub fn average(_samples: &[f64]) -> f64 {
    0.0
}

pub fn count_peaks(_samples: &[f64], _threshold: f64) -> usize {
    0
}

pub fn build_report(samples: &[f64], threshold: f64) -> String {
    let _ = (samples, threshold, ALERT_PREFIX, STATUS_PREFIX);
    format!("STATUT | moyenne=0.00 | pics=0")
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le parsing des mesures est isol? dans `src/parser.rs`.",
      "Les calculs métier sont regroupés dans `src/analysis.rs`.",
      "Le rapport final respecte toujours le format spécifié dans `README.md`.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Les fichiers d'orchestration et de configuration restent en lecture seule.",
    ],
    statusNote:
      "Ce projet sert de passerelle entre le Rust intermédiaire et les premiers automatismes algorithmiques du Niveau 3.",
  },
  {
    id: "project-level-4-map-explorer",
    type: "project",
    levelId: "curriculum-level-4",
    levelNumber: 4,
    themeId: "theme-level-4-graphs",
    chapterId: "level-4-graphs",
    orderIndex: 44,
    title: "Projet de synthèse · Explorateur de carte",
    summary:
      "Construire un explorateur de carte multi-fichiers capable de lire une grille, trouver un chemin simple et restituer un diagnostic clair.",
    xpReward: 320,
    estimatedDurationMinutes: 55,
    difficulty: "advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-4-graphs" }],
    overview:
      "Ce projet de fin de Niveau 4 vous fait assembler parsing, représentation de grille et parcours pour produire un résultat de navigation cohérent sur une petite carte ASCII.",
    goals: [
      "séparer le parsing, la logique de carte et le parcours dans plusieurs fichiers ;",
      "réutiliser les premiers réflexes de graphe dans une structure plus concrète ;",
      "garder une interface d'entrée/sortie stable malgrà un problème plus riche ;",
      "préparer la transition vers les niveaux où la méthode de résolution devient centrale.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/parser.rs", "src/search.rs", "src/grid.rs"],
      readonlyFiles: ["Cargo.toml", "README.md", "src/main.rs", "src/messages.rs"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le projet lit d'abord les dimensions de la carte puis les lignes de grille.",
        "Le parsing retrouve correctement `S`, `E` et les murs `#`.",
        "Le rapport final affiche `CHEMIN <distance>` quand une sortie est atteignable, sinon `BLOQUE`.",
      ],
      validationScenarios: [
        {
          id: "map-explorer-open-path",
          title: "Chemin atteignable",
          description: "La grille contient un chemin simple entre `S` et `E`.",
          stdin: `4 4
S...
.##.
...E
....
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "CHEMIN 5",
          },
        },
        {
          id: "map-explorer-blocked-path",
          title: "Sortie bloquée",
          description: "La sortie existe mais aucun chemin ne permet de l'atteindre.",
          stdin: `4 4
S#..
##.#
..#E
....
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "BLOQUE",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "map_explorer"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification fonctionnelle du projet.",
          content: `# Explorateur de carte

## Entrée
- ligne 1 : \`rows cols\`
- lignes suivantes : la carte ASCII

## Règles
- \`S\` = départ
- \`E\` = sortie
- \`#\` = mur
- \`.\` = case libre

## Sortie attendue
- \`CHEMIN <distance>\` si la sortie est atteignable
- \`BLOQUE\` sinon
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Messages normalisés utilisés dans le rapport final.",
          content: `pub const PATH_PREFIX: &str = "CHEMIN";
pub const BLOCKED_LABEL: &str = "BLOQUE";
`,
        },
        {
          path: "src/main.rs",
          readonly: true,
          description: "Point d'entrée du projet et orchestration générale.",
          content: `mod grid;
mod messages;
mod parser;
mod search;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let map = parser::parse_map(&input);
    let result = search::shortest_path(&map);
    println!("{}", grid::format_report(result));
}
`,
        },
        {
          path: "src/grid.rs",
          readonly: false,
          description: "Représentation de la carte et formatage du rapport final.",
          content: `use crate::messages::{BLOCKED_LABEL, PATH_PREFIX};

#[derive(Clone, Debug)]
pub struct MapGrid {
    pub rows: usize,
    pub cols: usize,
    pub cells: Vec<Vec<char>>,
    pub start: (usize, usize),
    pub end: (usize, usize),
}

pub fn format_report(distance: Option<usize>) -> String {
    match distance {
        Some(distance) => format!("{} {}", PATH_PREFIX, distance),
        None => BLOCKED_LABEL.to_string(),
    }
}
`,
        },
        {
          path: "src/parser.rs",
          readonly: false,
          description: "Parsing de la grille ASCII en structure exploitable.",
          content: `use crate::grid::MapGrid;

pub fn parse_map(input: &str) -> MapGrid {
    let _ = input;

    MapGrid {
        rows: 0,
        cols: 0,
        cells: vec![],
        start: (0, 0),
        end: (0, 0),
    }
}
`,
        },
        {
          path: "src/search.rs",
          readonly: false,
          description: "Recherche du plus court chemin sur la grille.",
          content: `use crate::grid::MapGrid;

pub fn shortest_path(_map: &MapGrid) -> Option<usize> {
    None
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le parsing de la carte est isol? dans `src/parser.rs`.",
      "La recherche de chemin est isolée dans `src/search.rs`.",
      "Le format final est produit par `grid::format_report`.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Le projet reste lisible avec une séparation claire entre données, parsing et recherche.",
    ],
    statusNote:
      "Ce projet fait basculer le parcours vers des problèmes structurés où la représentation et le parcours deviennent aussi importants que la syntaxe.",
  },  {
    id: "project-level-5-optimizer-engine",
    type: "project",
    levelId: "curriculum-level-5",
    levelNumber: 5,
    themeId: "theme-level-5-dynamic-programming",
    chapterId: "level-5-dynamic-programming",
    orderIndex: 58,
    title: "Projet de synthèse · Moteur d’optimisation",
    summary:
      "Construire un moteur multi-fichiers qui choisit la meilleure combinaison de missions sous contrainte de capacité.",
    xpReward: 420,
    estimatedDurationMinutes: 65,
    difficulty: "advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-5-dynamic-programming" }],
    overview:
      "Ce projet de fin de Niveau 5 vous fait relier parsing, modélisation d’objets et optimisation dynamique pour produire un plan optimal stable sur plusieurs scénarios.",
    goals: [
      "parser une petite entrée structurée sans perdre la robustesse du programme ;",
      "isoler la logique d’optimisation dans un module dédié ;",
      "rendre le résultat lisible et testable via des scénarios métier simples ;",
      "préparer la transition vers les problèmes avancés du Niveau 6.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/parser.rs", "src/optimizer.rs", "src/report.rs"],
      readonlyFiles: ["Cargo.toml", "README.md", "src/main.rs", "src/messages.rs"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le projet lit une capacité entière puis une ligne d’objets `poids:valeur` séparés par des virgules.",
        "`parse_items` retourne tous les objets valides dans l’ordre d’entrée.",
        "`best_value` calcule la meilleure valeur possible sans dépasser la capacité.",
        "`format_report` produit soit `OPTIMAL <score>`, soit `OPTIMAL 0` quand rien n’est transportable.",
      ],
      validationScenarios: [
        {
          id: "optimizer-balanced-load",
          title: "Charge équilibrée",
          description: "Le moteur doit choisir la combinaison la plus rentable sous capacité 7.",
          stdin: `7
2:6,3:10,4:12
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "OPTIMAL 22",
          },
        },
        {
          id: "optimizer-tight-capacity",
          title: "Capacité serrée",
          description: "Le moteur doit ignorer les objets trop lourds et garder la meilleure combinaison restante.",
          stdin: `5
1:3,3:8,4:9
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "OPTIMAL 12",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "optimizer_engine"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification fonctionnelle du projet.",
          content: `# Moteur d’optimisation

## Entrée
- ligne 1 : capacité maximale
- ligne 2 : objets au format \`poids:valeur\`, séparés par des virgules

## Sortie attendue
- afficher \`OPTIMAL <score>\`
- le score correspond à la meilleure valeur totale sans dépasser la capacité

Exemple : \`OPTIMAL 22\`
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Préfixes communs du rapport final.",
          content: `pub const OPTIMAL_PREFIX: &str = "OPTIMAL";
`,
        },
        {
          path: "src/main.rs",
          readonly: true,
          description: "Point d’entrée du projet et orchestration.",
          content: `mod messages;
mod optimizer;
mod parser;
mod report;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let mut lines = input.lines();
    let capacity = lines
        .next()
        .unwrap_or("0")
        .trim()
        .parse::<usize>()
        .unwrap_or(0);
    let items_line = lines.next().unwrap_or("");
    let items = parser::parse_items(items_line);
    let best = optimizer::best_value(capacity, &items);
    println!("{}", report::format_report(best));
}
`,
        },
        {
          path: "src/parser.rs",
          readonly: false,
          description: "Parsing des objets à optimiser.",
          content: `pub fn parse_items(input: &str) -> Vec<(usize, i32)> {
    let _ = input;
    vec![]
}
`,
        },
        {
          path: "src/optimizer.rs",
          readonly: false,
          description: "Logique d’optimisation dynamique.",
          content: `pub fn best_value(_capacity: usize, _items: &[(usize, i32)]) -> i32 {
    0
}
`,
        },
        {
          path: "src/report.rs",
          readonly: false,
          description: "Formatage du rapport final.",
          content: `use crate::messages::OPTIMAL_PREFIX;

pub fn format_report(score: i32) -> String {
    format!("{} {}", OPTIMAL_PREFIX, score)
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le parsing des objets est isolé dans `src/parser.rs`.",
      "La logique de calcul est regroupée dans `src/optimizer.rs`.",
      "Le rapport final reste produit par `src/report.rs`.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Le projet conserve une séparation nette entre parsing, optimisation et restitution.",
    ],
    statusNote:
      "Ce projet marque la fin du Niveau 5 et fait le lien entre familles algorithmiques classiques et problèmes plus avancés.",
  },
  {
    id: "project-level-6-advanced-solver",
    type: "project",
    levelId: "curriculum-level-6",
    levelNumber: 6,
    themeId: "theme-level-6-final-training",
    chapterId: "level-6-final-training",
    orderIndex: 72,
    title: "Projet final · Solveur avancé",
    summary:
      "Assembler un solveur multi-fichiers qui combine parsing, exploration de grille pondérée et restitution robuste du meilleur coût.",
    xpReward: 520,
    estimatedDurationMinutes: 80,
    difficulty: "advanced",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-6-final-training" }],
    overview:
      "Ce projet final clôt le parcours CoreQuest. Vous devez parser une grille pondérée, calculer un coût minimal fiable puis rendre un rapport lisible sur plusieurs scénarios d'entrée.",
    goals: [
      "organiser un projet plus dense sans perdre la clarté des responsabilités ;",
      "conserver un parsing robuste malgré une entrée plus riche ;",
      "implémenter une recherche de coût minimal dans un module dédié ;",
      "terminer le parcours sur un artefact qui ressemble à un vrai petit solveur.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/parser.rs", "src/pathfinder.rs", "src/report.rs", "src/grid.rs"],
      readonlyFiles: ["Cargo.toml", "README.md", "src/main.rs", "src/messages.rs"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le projet lit d'abord `rows cols`, puis les lignes de coût de la grille.",
        "`parse_grid` reconstruit une grille d'entiers cohérente.",
        "`lowest_cost` calcule un coût minimal du coin haut-gauche au coin bas-droit.",
        "`format_report` restitue `COUT <valeur>`.",
      ],
      validationScenarios: [
        {
          id: "advanced-solver-small-grid",
          title: "Grille compacte",
          description: "Le solveur doit produire le coût minimal sur une petite grille pondérée.",
          stdin: `3 3
1 3 1
1 5 1
2 1 1
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "COUT 7",
          },
        },
        {
          id: "advanced-solver-rectangular-grid",
          title: "Grille rectangulaire",
          description: "Le solveur doit garder le bon coût minimal sur une grille non carrée.",
          stdin: `2 4
1 4 1 9
2 1 1 1
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "COUT 6",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "advanced_solver"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification fonctionnelle du projet final.",
          content: `# Solveur avancé

## Entrée
- ligne 1 : \`rows cols\`
- lignes suivantes : une grille d'entiers positifs séparés par des espaces

## Sortie attendue
- afficher \`COUT <valeur>\`
- la valeur correspond au coût minimal du coin haut-gauche au coin bas-droit

Exemple : \`COUT 7\`
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Préfixes du rapport final.",
          content: `pub const COST_PREFIX: &str = "COUT";
`,
        },
        {
          path: "src/main.rs",
          readonly: true,
          description: "Point d'entrée du projet final.",
          content: `mod grid;
mod messages;
mod parser;
mod pathfinder;
mod report;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let grid = parser::parse_grid(&input);
    let cost = pathfinder::lowest_cost(&grid);
    println!("{}", report::format_report(cost));
}
`,
        },
        {
          path: "src/grid.rs",
          readonly: false,
          description: "Structure de grille utilisée par le solveur.",
          content: `#[derive(Clone, Debug)]
pub struct WeightedGrid {
    pub rows: usize,
    pub cols: usize,
    pub cells: Vec<Vec<i32>>,
}
`,
        },
        {
          path: "src/parser.rs",
          readonly: false,
          description: "Parsing de la grille pondérée.",
          content: `use crate::grid::WeightedGrid;

pub fn parse_grid(input: &str) -> WeightedGrid {
    let _ = input;

    WeightedGrid {
        rows: 0,
        cols: 0,
        cells: vec![],
    }
}
`,
        },
        {
          path: "src/pathfinder.rs",
          readonly: false,
          description: "Recherche du coût minimal.",
          content: `use crate::grid::WeightedGrid;

pub fn lowest_cost(_grid: &WeightedGrid) -> i32 {
    0
}
`,
        },
        {
          path: "src/report.rs",
          readonly: false,
          description: "Restitution finale du coût.",
          content: `use crate::messages::COST_PREFIX;

pub fn format_report(cost: i32) -> String {
    format!("{} {}", COST_PREFIX, cost)
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le parsing de la grille est isolé dans `src/parser.rs`.",
      "Le calcul du coût minimal est regroupé dans `src/pathfinder.rs`.",
      "Le rapport final reste produit par `src/report.rs`.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Le projet final garde une structure lisible malgré sa densité plus élevée.",
    ],
    statusNote:
      "Ce projet clôt le parcours et donne une vraie sensation d'aboutissement sur un problème plus structuré.",
  },

  {
    id: "project-level-1-watchtower-briefing",
    type: "project",
    levelId: "curriculum-level-1",
    levelNumber: 1,
    themeId: "theme-level-1-conditional-loops",
    chapterId: "level-1-conditional-loops",
    orderIndex: 15.9,
    title: "Projet pilote · Briefing de vigie",
    summary:
      "Construire un petit outil de briefing qui lit un mode, une liste de mesures et produit un état synthétique fiable.",
    xpReward: 190,
    estimatedDurationMinutes: 40,
    difficulty: "intermediate",
    unlockRules: [{ type: "complete_chapter", chapterId: "level-1-conditional-loops" }],
    overview:
      "Ce second projet pilote clôt le Niveau 1 étendu. Il vous fait réutiliser les tableaux, les opérateurs booléens et les boucles conditionnées dans un mini programme multi-fichiers.",
    goals: [
      "parser une petite liste de mesures sans introduire de complexité inutile ;",
      "compter les valeurs importantes avec une boucle simple ;",
      "assembler une règle booléenne un peu plus réaliste ;",
      "rendre un message final lisible et stable.",
    ],
    projectConfig: {
      layout: "split",
      entryFile: "src/main.rs",
      editableFiles: ["src/parser.rs", "src/analysis.rs", "src/report.rs"],
      readonlyFiles: ["Cargo.toml", "README.md", "src/main.rs", "src/messages.rs"],
      runCommand: "cargo run --quiet",
      testCommand: "cargo test --quiet",
      tests: [
        "Le projet lit un mode sur la première ligne puis des mesures entières séparées par des virgules sur la deuxième.",
        "`parse_measures` retourne toutes les mesures valides dans l’ordre.",
        "`count_high_measures` compte les valeurs supérieures ou égales à 15.",
        "`build_status` choisit `ALERTE` si le mode vaut `alerte` ou si au moins deux mesures sont élevées.",
      ],
      validationScenarios: [
        {
          id: "watchtower-normal-state",
          title: "État normal",
          description: "Sans mode alerte ni trop de mesures élevées, le système reste stable.",
          stdin: `normal
10,12,17
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "STATUT | pics=1",
          },
        },
        {
          id: "watchtower-alert-state",
          title: "État alerte",
          description: "Deux pics ou un mode alerte doivent faire basculer l’état final.",
          stdin: `normal
15,18,9
`,
          validation: {
            mode: "stdout_exact",
            expectedOutput: "ALERTE | pics=2",
          },
        },
      ],
      files: [
        {
          path: "Cargo.toml",
          readonly: true,
          description: "Configuration minimale du projet Cargo.",
          content: `[package]
name = "watchtower_briefing"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
        },
        {
          path: "README.md",
          readonly: true,
          description: "Spécification fonctionnelle du projet.",
          content: `# Briefing de vigie

## Entrée
- ligne 1 : un mode (\`normal\` ou \`alerte\`)
- ligne 2 : des mesures entières séparées par des virgules

## Sortie attendue
- afficher \`ALERTE | pics=<n>\` si le mode vaut \`alerte\` ou si au moins deux mesures sont supérieures ou égales à 15
- sinon afficher \`STATUT | pics=<n>\`

Exemple : \`ALERTE | pics=2\`
`,
        },
        {
          path: "src/messages.rs",
          readonly: true,
          description: "Préfixes utilisés dans le rapport final.",
          content: `pub const ALERT_PREFIX: &str = "ALERTE";
pub const STATUS_PREFIX: &str = "STATUT";
`,
        },
        {
          path: "src/main.rs",
          readonly: true,
          description: "Point d’entrée du projet et orchestration générale.",
          content: `mod analysis;
mod messages;
mod parser;
mod report;

use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    let mut lines = input.lines();
    let mode = lines.next().unwrap_or("normal").trim();
    let measures_line = lines.next().unwrap_or("");
    let measures = parser::parse_measures(measures_line);
    let high_count = analysis::count_high_measures(&measures, 15);
    let status = analysis::build_status(mode, high_count);

    println!("{}", report::format_report(&status, high_count));
}
`,
        },
        {
          path: "src/parser.rs",
          readonly: false,
          description: "Parsing des mesures séparées par des virgules.",
          content: `pub fn parse_measures(input: &str) -> Vec<i32> {
    let _ = input;
    vec![]
}
`,
        },
        {
          path: "src/analysis.rs",
          readonly: false,
          description: "Règles de comptage et de décision.",
          content: `pub fn count_high_measures(_measures: &[i32], _threshold: i32) -> i32 {
    0
}

pub fn build_status(_mode: &str, _high_count: i32) -> String {
    String::new()
}
`,
        },
        {
          path: "src/report.rs",
          readonly: false,
          description: "Formatage du rapport final.",
          content: `pub fn format_report(status: &str, high_count: i32) -> String {
    format!("{} | pics={}", status, high_count)
}
`,
        },
      ],
    },
    acceptanceCriteria: [
      "Le parsing des mesures est isolé dans `src/parser.rs`.",
      "Le comptage et la règle booléenne sont regroupés dans `src/analysis.rs`.",
      "Le rapport final reste produit par `src/report.rs`.",
      "Les deux scénarios de validation passent dans la sandbox Cargo.",
      "Le projet pilote réutilise clairement structures, conditions avancées et boucles.",
    ],
    statusNote:
      "Ce deuxième projet pilote sert de transition douce entre les fondamentaux du Niveau 1 et les outils plus structurés du Niveau 2.",
  },
];


