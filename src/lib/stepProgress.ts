// Suivi des étapes cochées par le maître du jeu pendant une phase.

/** Ajoute ou retire une étape de la liste des étapes faites. */
export const toggleStep = (completed: string[], stepId: string): string[] =>
  completed.includes(stepId)
    ? completed.filter(id => id !== stepId)
    : [...completed, stepId];

/** Index de l'étape en cours (la première non cochée), ou -1 si tout est fait. */
export const getCurrentStepIndex = (stepIds: string[], completed: string[]): number =>
  stepIds.findIndex(id => !completed.includes(id));

/** Nombre d'étapes de la liste qui ne sont pas encore cochées. */
export const countRemainingSteps = (stepIds: string[], completed: string[]): number =>
  stepIds.filter(id => !completed.includes(id)).length;
