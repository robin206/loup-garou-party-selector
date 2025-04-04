
export interface CharacterRule {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const characterRules: CharacterRule[] = [
  {
    id: "loups-garous",
    name: "Loups-Garous",
    image: "/img/perso_loup.svg",
    description: "Ils se réveillent chaque nuit pour éliminer un villageois. Le jour, ils participent aux débats en essayant de ne pas faire découvrir leur activité nocturne. Ils ont le droit de voter comme tous les autres joueurs (car personne ne sait qui ils sont), et éventuellement contre un des leurs par nécessité. Leur but est de tuer tous les autres villageois."
  },
  {
    id: "simples-villageois",
    name: "Simples villageois",
    image: "/img/perso_villageois.svg",
    description: "Ils sont armés de leur force de persuasion et de leur perspicacité. Ils ont la possibilité de voter pour éliminer un joueur et d'être le Capitaine du village qui a deux voix. C'est un rôle qui peut rebuter les enfants ou les personnes qui ne connaissent pas le jeu, mais le simple villageois peut bluffer ou prendre des risques pour tuer un loup en relative quiétude pour son village."
  },
  {
    id: "voyante",
    name: "Voyante",
    image: "/img/perso_voyante.svg",
    description: "Au début de chaque nuit, elle est appelée par le meneur et peut désigner une personne dont elle découvrira secrètement l'identité."
  },
  {
    id: "sorciere",
    name: "Sorcière",
    image: "/img/perso_sorciere.svg",
    description: "Elle possède deux potions : une de guérison et une d'empoisonnement. Elle ne peut utiliser chacune de ses potions qu'une seule fois au cours de la partie. Durant la nuit, lorsque les loups-garous se sont rendormis, le meneur de jeu va appeler la sorcière et va lui montrer la personne tuée par les loups-garous. La sorcière a trois possibilités : <ul><li>ne rien faire</li><li>ressusciter la personne tuée — et donc perdre sa seule potion de guérison</li><li>tuer une autre personne en plus de la victime — et donc perdre sa seule potion d'empoisonnement</li></ul> La sorcière peut utiliser ses deux potions durant la même nuit si elle le souhaite. La sorcière peut se ressusciter elle-même, si elle a été la victime des loups-garous."
  },
  {
    id: "cupidon",
    name: "Cupidon",
    image: "/img/perso_cupidon.svg",
    description: "Durant la nuit du premier tour de la partie (tour préliminaire), il va désigner deux personnes qui seront amoureuses jusqu'à la fin du jeu. Il peut choisir n'importe quels joueurs, y compris se désigner lui-même. Si l'une des deux personnes vient à mourir, l'autre meurt immédiatement de désespoir. Si l'un des amoureux est villageois et l'autre loup-garou, leur seul moyen de gagner est d'éliminer tous les autres (loups-garous et villageois)."
  },
  {
    id: "chasseur",
    name: "Chasseur",
    image: "/img/perso_chasseur.svg",
    description: "Le chasseur n'a aucun rôle particulier à jouer tant qu'il est vivant. Mais dès qu'il meurt – qu'il soit tué dans la nuit (Loups-garous, sorcière), à la suite d'une décision des villageois ou par la mort de son amoureux — il doit désigner une personne qui mourra également, sur-le-champ, d'une balle de son fusil."
  },
  {
    id: "petite-fille",
    name: "Petite fille",
    image: "/img/perso_fille.svg",
    description: "Pendant la nuit, lorsque les loups-garous se réveillent, la petite fille peut discrètement entrouvrir les yeux afin d'essayer de démasquer les loups-garous. Si la petite fille est démasquée à ce moment par les loups-garous, elle pourra être égorgée (en silence) à la place de la victime des loups-garous."
  },
  {
    id: "voleur",
    name: "Voleur",
    image: "/img/perso_voleur.svg",
    description: "Si on décide de jouer avec le voleur, on doit ajouter deux cartes de plus au paquet de cartes qui seront distribuées en début de partie. Au début de la première nuit, le meneur de jeu appelle le voleur. Il lui présente les deux cartes qui n'ont pas été distribuées. Le Voleur a le droit de choisir une de ces deux cartes ou de rester Voleur."
  },
  {
    id: "maire",
    name: "Maire (capitaine)",
    image: "/img/perso_maire.svg",
    description: "À l'aube du premier jour, les villageois élisent le capitaine (ou maire) du village. Le capitaine peut être n'importe quel joueur (incluant les loups-garous), et sa voix lors du vote de la journée compte double en cas d'égalité. Si le capitaine meurt, dans son dernier souffle, il désigne un successeur."
  },
  {
    id: "salvateur",
    name: "Le salvateur",
    image: "/img/perso_salvateur.svg",
    description: "Le salvateur se réveille chaque nuit avant les loups-garous, et désigne au meneur de jeu un joueur qu'il protégera. Si ce joueur est la victime désignée par les loups-garous cette nuit, il survit à leur assaut. Le salvateur peut éventuellement se protéger lui-même, mais il ne peut pas protéger la même personne deux tours de suite."
  },
  {
    id: "idiot",
    name: "Idiot du village",
    image: "/img/perso_idiot.svg",
    description: "Il n'a pas de pouvoir étant vivant. S'il est lynché par les villageois, ceux-ci le gracient immédiatement. Par la suite, l'idiot du village reste en vie, mais ne peut plus voter ni être élu capitaine du village. S'il assumait ce rôle, le capitaine est supprimé jusqu'à la fin de la partie."
  },
  {
    id: "bouc",
    name: "Le bouc émissaire",
    image: "/img/perso_bouc.svg",
    description: "En cas d'égalité dans le vote du village, c'est le bouc émissaire qui meurt d'office (le capitaine n'a alors pas à trancher). Bien sûr, le bouc émissaire doit se prononcer. Il ne peut tenter d'éviter l'égalité des votes en s'abstenant."
  },
  {
    id: "ancien",
    name: "L'ancien",
    image: "/img/perso_ancien.svg",
    description: "La première fois que les loups-garous le dévorent, sa carte n'est alors pas retournée par le meneur, mais par la seconde fois. Attention ! Le tir du chasseur, le vote du village et la potion de la sorcière le tuent instantanément. Si l'ancien est éliminé autrement que par les loups-garous, tous les villageois perdent leurs pouvoirs."
  },
  {
    id: "joueur-flute",
    name: "Le joueur de flûte",
    image: "/img/perso_flute.svg",
    description: "Ennemi à la fois des villageois et des loups-garous, le joueur de flûte se réveille à la fin de chaque nuit et choisit chaque fois deux nouveaux joueurs qu'il va charmer. Les joueurs charmés continuent à jouer normalement, mais si le joueur de flûte est en vie et tous les autres joueurs vivants sont charmés, le joueur de flûte gagne immédiatement."
  },
  {
    id: "loup-blanc",
    name: "Le Loup blanc",
    image: "/img/perso_loupblanc.svg",
    description: "Il est différent des autres loups-garous, qui eux sont persuadés qu'il est dans leur camp. Son but est d'être le dernier survivant. Il se réveille en même temps que les autres loups-garous et désigne la victime avec eux, mais une nuit sur deux il se réveille une deuxième fois seul et peut choisir d'éliminer ou non un loup-garou."
  },
  {
    id: "corbeau",
    name: "Le corbeau",
    image: "/img/perso_corbeau.svg",
    description: "Il se réveille en dernier toutes les nuits et peut désigner au maître du jeu un joueur qu'il pense être le loup-garou. Ce joueur aura automatiquement deux voix contre lui pour le prochain vote."
  },
  {
    id: "enfant-sauvage",
    name: "Enfant sauvage",
    image: "/img/perso_enfant.svg",
    description: "L'enfant sauvage choisit un joueur au début de la partie qui devient son modèle. Si le modèle meurt, l'enfant sauvage devient un loup-garou."
  },
  {
    id: "renard",
    name: "Renard",
    image: "/img/perso_renard.svg",
    description: "La nuit, à l'appel du meneur, il désigne trois joueurs voisins. Si au moins un de ces joueurs est loup-garou, le renard peut recommencer plus tard. Par contre, si ce sont trois non loups-garous, il perd son pouvoir définitivement en innocentant trois personnes."
  },
  {
    id: "servante",
    name: "Servante dévouée",
    image: "/img/perso_servante.svg",
    description: "La servante dévouée \"se sacrifie\" à la place d'un autre joueur choisi durant le vote. Le joueur qui joue la servante échange la carte de la servante avec la carte du personnage qui vient d'être désigné comme mise à mort par le village. Le joueur qui joue la servante joue maintenant cette carte, tandis que le joueur désigné à l'origine est éliminé avec la carte de la servante."
  },
  {
    id: "freres-soeurs",
    name: "Trois frères / deux sœurs",
    image: "/img/perso_freres.svg",
    description: "Les 3 frères / 2 sœurs durant toutes les nuits, après les loups garous, se réveillent ensemble et décident ce qu'ils vont faire pendant le jour, donc pour qui ils vont voter. Ce sont, sinon, de simples villageois."
  },
  {
    id: "montreur",
    name: "Montreur d'ours",
    image: "/img/perso_montreur.svg",
    description: "Le matin, si le montreur d'ours se trouve à côté d'un loup garou, l'ours (le meneur de jeu) grogne indiquant au montreur d'ours qu'à sa droite ou sa gauche se trouve un loup garou."
  },
  {
    id: "comedien",
    name: "Comédien",
    image: "/img/perso_comedien.svg",
    description: "Lorsque le comédien est présent dans la partie, le meneur de jeu choisit trois cartes supplémentaires qu'il place face révélée. Chaque nuit, le comédien choisit parmi ces trois cartes le rôle qu'il veut jouer jusqu'à la prochaine nuit."
  },
  {
    id: "chevalier",
    name: "Chevalier à l'épée rouillée",
    image: "/img/perso_chevalier.svg",
    description: "Le chevalier à l'épée rouillée donne le tétanos au premier loup à sa gauche s'il est mangé par les loups durant la nuit. Ce loup-garou mourra la nuit d'après, sans manger, innocentant au passage toutes les personnes entre lui et le chevalier."
  },
  {
    id: "juge",
    name: "Juge bègue",
    image: "/img/perso_juge.svg",
    description: "Le juge bègue montre, la nuit, au meneur, un signe particulier. Si, lors d'un vote de village, il fait ce signe au meneur, le meneur lancera alors un deuxième vote après la mort du premier voté."
  },
  {
    id: "ange",
    name: "Ange déchu",
    image: "/img/perso_ange.svg",
    description: "Le but de l'ange est de se faire éliminer dès le premier vote. S'il réussit, la partie se termine et il a gagné. Dans le cas contraire, le jeu continue mais l'ange devient un simple villageois sans pouvoir."
  },
  {
    id: "sectaire",
    name: "Abominable sectaire",
    image: "/img/perso_sectaire.svg",
    description: "La première nuit, le meneur divise le village en deux parties. L'abominable sectaire est forcément dans un de ces camps, et pour gagner, il doit éliminer tous les joueurs de l'autre camp. C'est un personnage solitaire."
  },
  {
    id: "infect",
    name: "Infect père des loups",
    image: "/img/perso_infectloup.svg",
    description: "C'est un loup-garou qui se réunit avec ses amis loups-garous et une fois dans la partie, il peut choisir d'infecter la victime des loups-garous et la transformer en loup mais l'infecté garde les pouvoirs de sa carte initiale et conserve son rôle initial."
  },
  {
    id: "chien-loup",
    name: "Chien-loup",
    image: "/img/perso_chienloup.svg", 
    description: "Personnage qui à l'appel du meneur de jeu choisit entre loup-garou et villageois. S'il choisit la première, il devient loup-garou. Sinon, il reste villageois. On ne sait pas son choix lors de sa mort."
  },
  {
    id: "villageois-villageoise",
    name: "Villageois-villageoise",
    image: "/img/perso_villageoises.svg",
    description: "Personnage dont la carte présente deux faces identiques, est connu de tous comme un simple villageois, c'est donc un personnage de \"confiance\" que l'on choisira pour être capitaine ou garde champêtre."
  },
  {
    id: "grand-mechant-loup",
    name: "Grand méchant loup",
    image: "/img/perso_grandloup.svg",
    description: "Le grand méchant loup mange dans un premier temps avec les loups-garous, puis il mange une deuxième fois seul un villageois mais il ne peut manger une deuxième victime que si aucun loup-garou n'est mort avant cette nuit."
  },
  {
    id: "berger",
    name: "Berger",
    image: "/img/perso_berger.svg",
    description: "Comme les autres villageois, le berger a pour but d'éradiquer tous les loup du village. Chaque nuit il peut envoyer son troupeau entier composé de trois moutons chez trois villageois différents. Chaque mouton placé devant un loup sera mangé."
  }
];
