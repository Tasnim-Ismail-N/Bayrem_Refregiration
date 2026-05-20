// src/data/categories.js
export const CATEGORIES = [
  {
    id: 99,
    nom: 'Par Métier',
    icone: 'Menu',
    slug: 'par-metier',
    isDropdown: true,
    sousCategories: [
      {
        id: 991, nom: 'Restauration Hôtellerie', icone: 'Building', slug: 'restauration-hotellerie',
        groups: []
      },
      {
        id: 992, nom: 'Superette et Magasin', icone: 'Store', slug: 'superette-magasin',
        groups: [
          {
            titre: 'VITRINE RÉFRIGÉRÉES', icone: 'Smartphone',
            liens: ['Vitrine Standard', 'Vitrine Royal', 'Vitrine Super Royal', 'Vitrine Ventilé', 'Armoire Réfrigérées Porte Vitrées']
          },
          {
            titre: 'VITRINE MURAL', icone: 'Columns',
            liens: ['Vitrine Mural Normal', 'Vitrine Mural Grande', 'Vitrine Mural Géante']
          }
        ]
      },
      {
        id: 993, nom: 'Pâtisserie', icone: 'Cake', slug: 'patisserie',
        groups: [
          {
            titre: 'FROIDS ET FERMENTATIONS', icone: 'Snowflake',
            liens: ['Armoires et vitrines', 'Cellules de refroidissements', 'Etuves', 'Tours réfrigérées', 'Vitrines pâtisseries']
          }
        ]
      },
      {
        id: 994, nom: 'Pizzeria & Restaurant', icone: 'Pizza', slug: 'pizzeria',
        groups: []
      },
      {
        id: 995, nom: 'Boulangerie', icone: 'Croissant', slug: 'boulangerie',
        groups: [
          {
            titre: 'FROID BOULANGERIE', icone: 'Snowflake',
            liens: ['Armoire Réfrigérée', 'Cellule de refroidissement rapide']
          }
        ]
      },
      {
        id: 996, nom: 'Festive Et Forain', icone: 'PartyPopper', slug: 'festive',
        groups: []
      },
      {
        id: 997, nom: 'Boucherie', icone: 'Beef', slug: 'boucherie',
        groups: [
          {
            titre: 'VITRINE RÉFRIGÉRÉES', icone: 'Snowflake',
            liens: ['Vitrine Volaille et Boucherie', 'Vitrine Poissonnerie']
          },
          {
            titre: 'ARMOIRE RÉFRIGÉRÉES INOX', icone: 'Columns',
            liens: ['Armoire Réfrigérées 700 litre', 'Armoire Réfrigérées 1400 litre', 'Armoire Réfrigérées 2000 litre', 'Armoire de Maturation']
          }
        ]
      }
    ]
  },
  { 
    id: 4, nom: 'Snack', icone: 'Pizza', slug: 'snack', isDropdown: true, 
    sousCategories: [
      {
        id: 41, nom: 'Équipement Froid Snack', icone: 'Snowflake', slug: 'snack-froid',
        groups: [
          {
            titre: 'RÉFRIGÉRATION', icone: 'Snowflake',
            liens: ['Vitrine à boisson', 'Arrière bar réfrigéré', 'Saladette', 'Congélateur coffre']
          }
        ]
      }
    ] 
  },
  { 
    id: 1, nom: 'Équipement Froid', icone: 'Snowflake', slug: 'equipement-froid', isDropdown: true, 
    sousCategories: [
      {
        id: 11, nom: 'Vitrines Réfrigérées', icone: 'Columns', slug: 'vitrines-refrigerees',
        groups: [
          {
            titre: 'PRÉSENTATION', icone: 'Store',
            liens: ['Vitrine murale', 'Vitrine de comptoir', 'Vitrine à glace', 'Vitrine pâtissière']
          }
        ]
      },
      {
        id: 12, nom: 'Armoires & Chambres', icone: 'Building', slug: 'armoires-chambres',
        groups: [
          {
            titre: 'STOCKAGE', icone: 'Building',
            liens: ['Armoire positive', 'Armoire négative', 'Chambre froide', 'Cellule de refroidissement']
          }
        ]
      }
    ] 
  },
  { 
    id: 2, nom: 'Superette', icone: 'Store', slug: 'superette-top', isDropdown: true, 
    sousCategories: [
      {
        id: 21, nom: 'Rayon Froid', icone: 'Snowflake', slug: 'superette-froid',
        groups: [
          {
            titre: 'VITRINE MURAL & COMPTOIR', icone: 'Columns',
            liens: ['Vitrine Mural Normal', 'Vitrine Mural Grande', 'Vitrine Ventilé', 'Armoire Réfrigérées Porte Vitrées']
          }
        ]
      }
    ] 
  },
  { 
    id: 3, nom: 'Café', icone: 'Coffee', slug: 'cafe', isDropdown: true, 
    sousCategories: [
      {
        id: 31, nom: 'Froid Café', icone: 'Snowflake', slug: 'cafe-froid',
        groups: [
          {
            titre: 'FROID & GLAÇONS', icone: 'Snowflake',
            liens: ['Arrière bar réfrigéré', 'Machine à glaçons']
          }
        ]
      }
    ] 
  },
  { 
    id: 6, nom: 'Pizzeria', icone: 'Pizza', slug: 'pizzeria-top', isDropdown: true, 
    sousCategories: [
      {
        id: 61, nom: 'Froid Pizzeria', icone: 'Snowflake', slug: 'pizzeria-froid',
        groups: [
          {
            titre: 'FROID PIZZERIA', icone: 'Snowflake',
            liens: ['Tour à pizza', 'Vitrine à ingrédients']
          }
        ]
      }
    ] 
  }
];
