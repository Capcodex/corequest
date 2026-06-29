import { ProjectContent, ProjectFile } from "@/types/content";
import { EditedProjectFile } from "@/types/projectExecution";

const MAX_PROJECT_FILE_LENGTH = 20_000;
const MAX_PROJECT_TOTAL_BYTES = 80_000;

export function buildProjectWorkspace(project: ProjectContent, editedFiles: EditedProjectFile[]): ProjectFile[] {
  const editableFiles = new Set(project.projectConfig.editableFiles);
  const canonicalFiles = new Map(project.projectConfig.files.map((file) => [file.path, file]));
  const editedFileMap = new Map<string, string>();

  for (const file of editedFiles) {
    if (!editableFiles.has(file.path)) {
      throw new Error(`Le fichier ${file.path} ne peut pas être modifié.`);
    }

    if (file.content.length > MAX_PROJECT_FILE_LENGTH) {
      throw new Error(`Le fichier ${file.path} dépasse la taille autorisée.`);
    }

    editedFileMap.set(file.path, file.content);
  }

  const mergedFiles = project.projectConfig.files.map((file) => ({
    ...file,
    content: editedFileMap.get(file.path) ?? file.content,
  }));

  const totalBytes = mergedFiles.reduce((sum, file) => sum + Buffer.byteLength(file.content, "utf8"), 0);

  if (totalBytes > MAX_PROJECT_TOTAL_BYTES) {
    throw new Error("Le projet dépasse la taille totale autorisée pour la sandbox.");
  }

  for (const filePath of editedFileMap.keys()) {
    if (!canonicalFiles.has(filePath)) {
      throw new Error(`Le fichier ${filePath} est inconnu dans ce projet.`);
    }
  }

  return mergedFiles;
}