
import { CharacterType } from '../types';

// Base game characters
export const baseGameCharacters: CharacterType[] = [
  {
    id: 'werewolf',
    name: 'Loup Garou',
    nameEn: 'Werewolf',
    icon: '/img/perso_loup.svg',
    description: 'Chaque nuit, les loups-garous dévorent un villageois.',
    team: 'werewolf',
    minPlayers: 8,
    recommended: true,
    expansion: 'base',
    actionPhase: 'night',
    actionOrder: 50,
    actionDescription: 'Les loups-garous choisissent une victime à dévorer.'
  },
  {
    id: 'villager',
    name: 'Villageois',
    nameEn: 'Villager',
    icon: '/img/perso_villageois.svg',
    description: 'Les villageois n\'ont pas de pouvoir particulier. Ils doivent débusquer les loups-garous et les éliminer.',
    team: 'village',
    minPlayers: 8,
    recommended: true,
    expansion: 'base'
  },
  {
    id: 'cupid',
    name: 'Cupidon',
    nameEn: 'Cupid',
    icon: '/img/perso_cupidon.svg',
    description: 'La première nuit, Cupidon désigne deux joueurs qui seront amoureux pour le reste de la partie.',
    team: 'village',
    minPlayers: 8,
    recommended: true,
    expansion: 'base',
    actionPhase: 'night',
    actionOrder: 10,
    actionDescription: 'Cupidon désigne deux joueurs qui tomberont amoureux.'
  },
  {
    id: 'little-girl',
    name: 'Petite Fille',
    nameEn: 'Little Girl',
    icon: '/img/perso_fille.svg',
    description: 'La petite fille peut espionner les loups-garous pendant leur tour, mais si elle est repérée, elle meurt immédiatement.',
    team: 'village',
    minPlayers: 9,
    recommended: true,
    expansion: 'base'
  },
  {
    id: 'witch',
    name: 'Sorcière',
    nameEn: 'Witch',
    icon: '/img/perso_sorciere.svg',
    description: 'La sorcière dispose d\'une potion de guérison et d\'une potion d\'empoisonnement, utilisables une fois chacune.',
    team: 'village',
    minPlayers: 8,
    recommended: true,
    expansion: 'base',
    actionPhase: 'night',
    actionOrder: 70,
    actionDescription: 'La sorcière peut utiliser ses potions pour sauver ou tuer.'
  },
  {
    id: 'seer',
    name: 'Voyante',
    nameEn: 'Seer',
    icon: '/img/perso_voyante.svg',
    description: 'Chaque nuit, la voyante peut découvrir l\'identité d\'un joueur de son choix.',
    team: 'village',
    minPlayers: 8,
    recommended: true,
    expansion: 'base',
    actionPhase: 'night',
    actionOrder: 30,
    actionDescription: 'La voyante découvre l\'identité d\'un joueur.'
  },
  {
    id: 'hunter',
    name: 'Chasseur',
    nameEn: 'Hunter',
    icon: '/img/perso_chasseur.svg',
    description: 'Quand le chasseur meurt, il doit immédiatement tuer un autre joueur de son choix.',
    team: 'village',
    minPlayers: 8,
    recommended: true,
    expansion: 'base',
    actionPhase: 'day',
    actionOrder: 90,
    actionDescription: 'Le chasseur élimine un joueur en mourant.'
  },
  {
    id: 'thief',
    name: 'Voleur',
    nameEn: 'Thief',
    icon: '/img/perso_voleur.svg',
    description: 'Au début de la partie, le voleur peut échanger sa carte avec une des cartes non utilisées.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'base',
    actionPhase: 'night',
    actionOrder: 5,
    actionDescription: 'Le voleur peut échanger sa carte.'
  }
];

// New Moon expansion characters
export const newMoonCharacters: CharacterType[] = [
  {
    id: 'salvator',
    name: 'Salvateur',
    nameEn: 'Salvator',
    icon: '/img/perso_salvateur.svg',
    description: 'Chaque nuit, le Salvateur peut protéger un joueur de l\'attaque des loups-garous.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'new-moon',
    actionPhase: 'night',
    actionOrder: 40,
    actionDescription: 'Le Salvateur protège un joueur.'
  },
  {
    id: 'idiot',
    name: 'Idiot du village',
    nameEn: 'Village Idiot',
    icon: '/img/perso_idiot.svg',
    description: 'Si les villageois votent contre l\'Idiot, celui-ci ne meurt pas mais perd son droit de vote pour le reste de la partie.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'new-moon'
  },
  {
    id: 'scapegoat',
    name: 'Bouc émissaire',
    nameEn: 'Scapegoat',
    icon: '/img/perso_bouc.svg',
    description: 'En cas d\'égalité lors du vote, le Bouc émissaire est automatiquement éliminé.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'new-moon'
  },
  {
    id: 'ancient',
    name: 'Ancien',
    nameEn: 'Ancient',
    icon: '/img/perso_ancien.svg',
    description: 'L\'Ancien peut résister à la première attaque des loups-garous. Si les villageois le tuent, ils perdent tous leurs pouvoirs.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'new-moon'
  },
  {
    id: 'pied-piper',
    name: 'Joueur de flûte',
    nameEn: 'Pied Piper',
    icon: '/img/perso_flute.svg',
    description: 'Chaque nuit, le Joueur de flûte peut enchanter deux joueurs. Son but est d\'enchanter tous les joueurs survivants.',
    team: 'solo',
    minPlayers: 8,
    recommended: false,
    expansion: 'new-moon',
    actionPhase: 'night',
    actionOrder: 80,
    actionDescription: 'Le Joueur de flûte enchante deux joueurs.'
  }
];

// Village expansion characters
export const villageCharacters: CharacterType[] = [
  {
    id: 'white-wolf',
    name: 'Loup blanc',
    nameEn: 'White Wolf',
    icon: '/img/perso_loupblanc.svg',
    description: 'Le Loup blanc est un loup-garou solitaire qui gagne s\'il est le dernier joueur en vie.',
    team: 'solo',
    minPlayers: 10,
    recommended: false,
    expansion: 'village',
    actionPhase: 'night',
    actionOrder: 60,
    actionDescription: 'Le Loup blanc peut éliminer un autre loup-garou.'
  },
  {
    id: 'raven',
    name: 'Corbeau',
    nameEn: 'Raven',
    icon: '/img/perso_corbeau.svg',
    description: 'Chaque nuit, le Corbeau peut désigner un joueur qui aura deux votes contre lui lors du vote du jour suivant.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'village',
    actionPhase: 'night',
    actionOrder: 20,
    actionDescription: 'Le Corbeau désigne un joueur qui aura deux votes contre lui.'
  }
];

// Characters Pack expansion characters
export const charactersPackCharacters: CharacterType[] = [
  {
    id: 'wolf-father',
    name: 'Infect Père des loups',
    nameEn: 'Infect Wolf Father',
    icon: '/img/perso_infectloup.svg',
    description: 'Si les loups-garous attaquent un personnage protégé par le Salvateur, le Père des loups peut transformer ce joueur en loup-garou.',
    team: 'werewolf',
    minPlayers: 9,
    recommended: false,
    expansion: 'characters-pack',
    actionPhase: 'night',
    actionOrder: 55,
    actionDescription: 'Le Père des loups peut infecter un villageois.'
  },
  {
    id: 'wolf-hound',
    name: 'Chien loup',
    nameEn: 'Wolf Hound',
    icon: '/img/perso_chienloup.svg',
    description: 'Au début de la partie, le Chien loup choisit de jouer avec les loups-garous ou les villageois.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack',
    actionPhase: 'night',
    actionOrder: 15,
    actionDescription: 'Le Chien loup choisit son camp.'
  },
  {
    id: 'big-wolf',
    name: 'Grand Loup',
    nameEn: 'Big Wolf',
    icon: '/img/perso_grandloup.svg',
    description: 'Une fois par partie, le Grand Loup peut dévorer seul une victime lors d\'une nuit.',
    team: 'werewolf',
    minPlayers: 10,
    recommended: false,
    expansion: 'characters-pack',
    actionPhase: 'night',
    actionOrder: 65,
    actionDescription: 'Le Grand Loup peut dévorer seul une victime.'
  },
  {
    id: 'wild-child',
    name: 'Enfant sauvage',
    nameEn: 'Wild Child',
    icon: '/img/perso_enfant.svg',
    description: 'L\'Enfant sauvage choisit un modèle au début du jeu. Si ce modèle meurt, l\'Enfant sauvage devient loup-garou.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack',
    actionPhase: 'night',
    actionOrder: 25,
    actionDescription: 'L\'Enfant sauvage choisit son modèle.'
  },
  {
    id: 'fox',
    name: 'Renard',
    nameEn: 'Fox',
    icon: '/img/perso_renard.svg',
    description: 'Chaque nuit, le Renard peut flairer un groupe de trois joueurs. S\'il y a au moins un loup-garou parmi eux, il le saura.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack',
    actionPhase: 'night',
    actionOrder: 35,
    actionDescription: 'Le Renard flaire un groupe de trois joueurs.'
  },
  {
    id: 'devoted-servant',
    name: 'Servante dévouée',
    nameEn: 'Devoted Servant',
    icon: '/img/perso_servante.svg',
    description: 'La Servante dévouée peut prendre la place d\'un villageois que les loups-garous ont décidé de dévorer.',
    team: 'village',
    minPlayers: 9,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'three-brothers',
    name: '3 frères',
    nameEn: 'Three Brothers',
    icon: '/img/perso_freres.svg',
    description: 'Les Trois Frères se connaissent entre eux et doivent coopérer pour sauver le village.',
    team: 'village',
    minPlayers: 9,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'two-sisters',
    name: '2 sœurs',
    nameEn: 'Two Sisters',
    icon: '/img/perso_soeurs.svg',
    description: 'Les Deux Sœurs se connaissent entre elles et doivent coopérer pour sauver le village.',
    team: 'village',
    minPlayers: 9,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'bear-tamer',
    name: 'Montreur d\'ours',
    nameEn: 'Bear Tamer',
    icon: '/img/perso_montreur.svg',
    description: 'Si un loup-garou est assis à côté du Montreur d\'ours, l\'ours grogne au début de la journée.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'actor',
    name: 'Comédien',
    nameEn: 'Actor',
    icon: '/img/perso_comedien.svg',
    description: 'Le Comédien peut choisir un pouvoir parmi ceux qui ne sont pas utilisés dans la partie.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'rusty-knight',
    name: 'Chevalier à l\'épée rouillée',
    nameEn: 'Rusty Knight',
    icon: '/img/perso_chevalier.svg',
    description: 'Le loup-garou qui dévore le Chevalier sera infecté par le tétanos et mourra la nuit suivante.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'stuttering-judge',
    name: 'Juge bègue',
    nameEn: 'Stuttering Judge',
    icon: '/img/perso_juge.svg',
    description: 'Une fois par partie, le Juge bègue peut faire voter les joueurs une seconde fois.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'villager-villager',
    name: 'Villageois-villageoise',
    nameEn: 'Villager-Village Girl',
    icon: '/img/perso_villageoises.svg',
    description: 'Les Villageois-villageoise n\'ont pas de pouvoir particulier mais savent qui sont les autres Villageois-villageoise.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'gypsy',
    name: 'Gitane',
    nameEn: 'Gypsy',
    icon: '/img/perso_gitane.svg',
    description: 'La Gitane peut voir l\'avenir dans sa boule de cristal et découvrir l\'identité d\'un joueur.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'rural-policeman',
    name: 'Garde champêtre',
    nameEn: 'Rural Policeman',
    icon: '/img/perso_gardechampetre.svg',
    description: 'Le Garde champêtre annonce le début et la fin de chaque phase du jeu en frappant sur son tambour.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'shepherd',
    name: 'Berger',
    nameEn: 'Shepherd',
    icon: '/img/perso_berger.svg',
    description: 'Le Berger protège son troupeau de moutons. Pour chaque joueur éliminé, il gagne un mouton, renforçant son influence.',
    team: 'village',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'fallen-angel',
    name: 'Ange déchu',
    nameEn: 'Fallen Angel',
    icon: '/img/perso_ange.svg',
    description: 'L\'Ange déchu gagne s\'il est le premier joueur à être éliminé par les villageois.',
    team: 'solo',
    minPlayers: 9,
    recommended: false,
    expansion: 'characters-pack'
  },
  {
    id: 'abominable-sectarian',
    name: 'Abominable sectaire',
    nameEn: 'Abominable Sectarian',
    icon: '/img/perso_sectaire.svg',
    description: 'L\'Abominable sectaire désigne secrètement un camp au début du jeu. Si ce camp gagne, il gagne aussi.',
    team: 'solo',
    minPlayers: 8,
    recommended: false,
    expansion: 'characters-pack'
  }
];

// All characters combined
export const allCharacters: CharacterType[] = [
  ...baseGameCharacters,
  ...newMoonCharacters,
  ...villageCharacters,
  ...charactersPackCharacters
];

// Get characters by expansion
export function getCharactersByExpansion(expansion: string): CharacterType[] {
  return allCharacters.filter(character => character.expansion === expansion);
}

// Get characters by team
export function getCharactersByTeam(team: 'village' | 'werewolf' | 'solo'): CharacterType[] {
  return allCharacters.filter(character => character.team === team);
}

// Get character by ID
export function getCharacterById(id: string): CharacterType | undefined {
  return allCharacters.find(character => character.id === id);
}

// Get characters by multiple IDs
export function getCharactersByIds(ids: string[]): CharacterType[] {
  return allCharacters.filter(character => ids.includes(character.id));
}

// Get expansions
export function getExpansions() {
  return [
    { id: 'base', name: 'Jeu de base' },
    { id: 'new-moon', name: 'Nouvelle Lune' },
    { id: 'village', name: 'Village' },
    { id: 'characters-pack', name: 'Personnages' },
    { id: 'bonus', name: 'Bonus' }
  ];
}
