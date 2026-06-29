import { ProjectContent, ProjectFile } from "@/types/content";
import { EditedProjectFile } from "@/types/projectExecution";

export function getInitialProjectFiles(project: ProjectContent): Record<string, string> {
  return Object.fromEntries(
    project.projectConfig.files.map((file) => [
      file.path,
      isEditableProjectFile(project, file.path) ? "" : file.content,
    ]),
  );
}

export function getEditedProjectFiles(
  project: ProjectContent,
  filesByPath: Record<string, string>,
): EditedProjectFile[] {
  return project.projectConfig.editableFiles.map((path) => ({
    path,
    content: filesByPath[path] ?? "",
  }));
}

export function getProjectFilePlaceholder(project: ProjectContent, file: ProjectFile): string {
  if (!isEditableProjectFile(project, file.path)) {
    return "";
  }

  const placeholderLines = [
    `Fichier à compléter : ${file.path}`,
    file.description ? `Rôle attendu : ${file.description}` : null,
    ...getFileContractLines(project, file),
    ...getExpectedSignatureLines(file),
    ...getMainExampleLines(project, file),
    "Les fichiers REF restent disponibles pour comprendre les constantes, modules et formats attendus.",
  ].filter((line): line is string => Boolean(line));

  return toRustCommentBlock(placeholderLines);
}

export function isEditableProjectFile(project: ProjectContent, path: string) {
  return project.projectConfig.editableFiles.includes(path);
}

function getFileContractLines(project: ProjectContent, file: ProjectFile): string[] {
  const fileName = file.path.split("/").at(-1) ?? file.path;
  const relatedCriteria = project.acceptanceCriteria.filter(
    (criterion) => criterion.includes(file.path) || criterion.includes(fileName),
  );
  const relatedTests = project.projectConfig.tests.filter(
    (test) => test.includes(file.path) || test.includes(fileName),
  );
  const contractLines = [...relatedCriteria, ...relatedTests];

  if (contractLines.length === 0) {
    return [
      "À faire : respecter le README et les scénarios de validation du projet.",
      "À éviter : recopier un fichier REF ; ce fichier doit contenir votre propre implémentation.",
    ];
  }

  return [
    "Ce fichier doit :",
    ...contractLines.map((line) => `- ${line}`),
  ];
}

function getExpectedSignatureLines(file: ProjectFile): string[] {
  const signatures = extractPublicFunctionSignatures(file.content);

  if (signatures.length === 0) {
    return [];
  }

  return [
    "Fonction(s) attendue(s), à réécrire vous-même :",
    ...signatures.map((signature) => `- ${signature}`),
  ];
}

function getMainExampleLines(project: ProjectContent, file: ProjectFile): string[] {
  if (file.path !== project.projectConfig.entryFile) {
    return [];
  }

  const scenario = project.projectConfig.validationScenarios[0];
  const expectedOutput = scenario ? getScenarioExpectedOutput(scenario) : null;

  if (!scenario || !expectedOutput) {
    return [
      "Dans `main`, l’objectif est d’orchestrer le programme : lire l’entrée, appeler les modules métier, puis afficher la sortie finale.",
    ];
  }

  return [
    "Dans `main`, l’objectif est d’orchestrer le programme : lire l’entrée, appeler les modules métier, puis afficher la sortie finale.",
    "Exemple d’entrée :",
    indentMultiline(scenario.stdin ?? "(aucune entrée)"),
    "Sortie attendue pour cet exemple :",
    indentMultiline(expectedOutput),
  ];
}

function extractPublicFunctionSignatures(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("pub fn "))
    .map((line) => line.replace(/\s*\{\s*$/, ""));
}

function getScenarioExpectedOutput(
  scenario: ProjectContent["projectConfig"]["validationScenarios"][number],
): string | null {
  return "expectedOutput" in scenario.validation ? scenario.validation.expectedOutput : null;
}

function indentMultiline(value: string): string {
  return value
    .trimEnd()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function toRustCommentBlock(lines: string[]): string {
  return lines
    .flatMap((line) => line.split("\n"))
    .map((line) => `// ${line}`)
    .join("\n");
}
