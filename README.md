
# SAÉ 4.A.01.2 - Développement d'une application complexe

Objectif : Réaliser un jeu en ligne multi-joueur de type "shoot them up" par équipe de 3.



## Participants

- [Yliess El atifi](yliess.elatifi.etu@univ-lille.fr)
- [Fourmaintraux Camille](camille.fourmaintraux.etu@univ-lille.fr)
- [Atilla Tas](atilla.tas.etu@univ-lille.fr)



## Les Vues

L'accueil - Rejoindre une partie
![Rejoindre une partie](client/public/res/readme/images/ViewFormulaire1.png)

L'accueil - Créer une partie
![Créer une partie](client/public/res/readme/images/ViewFormulaire2.png)

Lorsque l'on est en jeu
![En jeu](client/public/res/readme/images/ViewInGame.png)

L'écran de Game Over
![Game Over](client/public/res/readme/images/ViewGameOver.png)

Le tableau des scores
![Tableau des scores](client/public/res/readme/images/ViewScoreBoard.png)

Les crédits
![Crédits](client/public/res/readme/images/ViewCredits.png)



## Diagrammes des échanges client/serveur

![Menu d'accueil](https://via.placeholder.com/468x300?text=Diagramme)

### Explications
texte



## Milestones

### Version basique (prototype)
![Jeu basique](client/public/res/readme/videos/versionBasique.gif)

#### Description
L'objectif de ce prototype était de comprendre tout ce qui était nécessaire pour faire la base du jeu. C'est à dire comment dessiner avec le canvas, comment faire une boucle de jeu, comment récupérer les inputs du joueur, comment déclencher un tir, comment faire des déplacements fluides, commment détecter des collisions, etc...

#### Difficultés techniques
Ici la plus grande difficulté à été de faire le système de collision. Au final nous avons créer une classe Entity qui gère les collisions et que tous les autres classes étendent, de cette manière n'importe quel chose dans notre jeu peut détecter n'importe quel autre, selon ce qu'on veut.

### Version intermédiaire
![Jeu basique](client/public/res/readme/videos/versionInter.gif)

#### Description
texte

#### Difficultés techniques
texte

### Version avancée
![Jeu basique](client/public/res/readme/videos/versionAvance.gif)

#### Description
texte

#### Difficultés techniques
texte

### Version achevé
![vidéo version achevé placeholder](https://via.placeholder.com/468x300?text=Insérer+la+vidéo+du+jeu+final)

#### Description
texte

#### Difficultés techniques
texte



## Points d'améliorations possible
Pour ce projet, ce qui serais le plus important à améliorer ce sont les performances. Le serveur à parfois du mal à suivre si il y a trop de client ou trop d'élements à l'écran.
Le deuxième plus important serait d'ajouter plus de fonctionnalités pour rendre le jeu plus riche, comme des niveaux, choix entre différents skin pour le joueur, plus de Boss, etc... 



## Ce dont on est le plus fier

//A Faire 

perso : les mouvements fluides. Les déplacements du joueur, ses tirs, l'inertie, l'accélération, tout ça s'emboitent bien et rendent le jeu agréable à jouer. L'effet de particules et l'effet sonore à la mort des ennemis aussi.


