const { User, Clothes } = require("./models");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const function_extension = require('./function_extension')

describe("Check if account already exists in database", () => {
    test("account exists", async () => {
        const resultUsername = await function_extension.accountExist('velkiz')
        const resultEmail = await function_extension.accountExist('max@gmail.com')
     expect(resultUsername).toBe(true);
     expect(resultEmail).toBe(true);
    });
    test("account doesnt exist", async () => {
        const resultUsername = await function_extension.accountExist('natshara')
        const resultEmail = await function_extension.accountExist('natshara@outlook.com')
     expect(resultUsername).toBe(false);
     expect(resultEmail).toBe(false);
    })
})

//clothesbyme.test.js

//////////////rechercherProduits////////////////
describe("Check si les filtres de produits fonctionne correctement (pour les habits non-vendu)", () => {
    test('Retourne les bons produits avec le filtre appliqué (Taille : L)', async () => {
        const sizeFilter = 'L';
        const colorFilter = '';
        const genreFilter = '';
        const typeFilter = '';
        const etatFilter = '';
      
        const result = await function_extension.rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter);
        console.log(result);
        expect(result.length).toBe(2); // on s'attend à ce que la fonction retourne 2 produits
      });

      test('Retourne les bons produits avec le filtre appliqué  (Etat : Neuf)', async () => {
        const sizeFilter = '';
        const colorFilter = '';
        const genreFilter = '';
        const typeFilter = '';
        const etatFilter = 'Neuf';
      
        const result = await function_extension.rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter);
        expect(result.length).toBe(6); // on s'attend à ce que la fonction retourne 6 produits
      });

      test('Retourne le bon produit avec tout les filtres appliqués', async () => {
        const sizeFilter = '';
        const colorFilter = 'Jaune';
        const genreFilter = '';
        const typeFilter = '';
        const etatFilter = '';
      
        const result = await function_extension.rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter);
        console.log(result);
        expect(result.length).toBe(2); // on s'attend à ce que la fonction retourne 3 produits
      });
      
      test('Retour le bon produit', async () => {
        const sizeFilter = 'XXS';
        const colorFilter = 'Beige';
        const genreFilter = 'Enfant';
        const typeFilter = 'Pull';
        const etatFilter = 'Neuf';
      
        const result = await function_extension.rechercherProduits(sizeFilter, colorFilter, genreFilter, typeFilter, etatFilter);
        expect(result[0].taille).toBe(sizeFilter);
        expect(result[0].couleur).toBe(colorFilter);
        expect(result[0].genre).toBe(genreFilter);
        expect(result[0].type).toBe(typeFilter);
        expect(result[0].etat).toBe(etatFilter);
      });
      
      test("Retourne le bon nombre de produits lorsqu'aucun filtre est appliqué", async () => {
        const result = await function_extension.rechercherProduits();
        expect(result.length).toBe(6); // on s'attend à ce que la fonction retourne 5 produits
      });
      
})

//////////////displayClothes////////////////
describe("Check si les pré-filtres de produits fonctionne correctement (pour les habits vendu)", () => {
    test("Retourne le bon nombre de produits lorsque le filtre homme est appliqué", async () => {
        const filtre = 'Homme';
        const result = await function_extension.displayClothes(filtre);
        expect(result.length).toBe(3); // on s'attend à ce que la fonction retourne 3 produits
      });

      test("Retourne le bon nombre de produits lorsque le filtre homme est appliqué", async () => {
        const filtre = 'Femme';
        const result = await function_extension.displayClothes(filtre);
        expect(result.length).toBe(1); // on s'attend à ce que la fonction retourne 1 produits
      });

      test("Retourne le bon nombre de produits lorsque le filtre homme est appliqué", async () => {
        const filtre = 'Enfant';
        const result = await function_extension.displayClothes(filtre);
        expect(result.length).toBe(2); // on s'attend à ce que la fonction retourne 2 produits
      });

})

//////////////getLatestSells////////////////
describe("Check si on obtient bien les dernières vente faites par le user", () => {
    test('Retourne le nombre exact de produits vendu par gogo22', async () => {
        const username = 'gogo22';
        const result = await function_extension.getLatestSells(username);
        expect(result.length).toBe(3); // on s'attend à ce que la fonction retourne 3 produits
      });
      
      test('Regarder si la fct retourne bien une vente et si elle bien assigné au user', async () => {
        const username = 'velkiz';
        const result = await function_extension.getLatestSells(username);
        expect(result[0].sold).toBe(true);
        expect(result[0].user).toBe(username);
      });
      
      test("Retourne une liste vide (aucun affichage) si aucun utilisateur n'est renseigné", async () => {
        const result = await function_extension.getLatestSells();
        expect(result).toEqual([]); // on s'attend à ce que la fonction retourne un tableau vide
      });

      test("Retourne une liste vide (aucun affichage) si l'utilisateur n'a fait aucune vente", async () => {
        const result = await function_extension.getLatestSells();
        expect(result).toEqual([]); // on s'attend à ce que la fonction retourne un tableau vide
      });
      
})

describe("Check si localisation du user lui réfère bien", () => {
    test('Retourne la localisation correct pour patoche', async () => {
        const username = 'wxcvb';
        const result = await function_extension.getUserLocation(username);
        expect(result).toBe('wxcvb'); // on s'attend à ce que la fonction retourne 'wxcvb'
      });

      test('Retourne la localisation correct pour patoche', async () => {
        const username = 'patoche';
        const result = await function_extension.getUserLocation(username);
        expect(result).toBe('Mons'); // on s'attend à ce que la fonction retourne 'wxcvb'
      });
})

//////////////clothesByMe////////////////
describe("Check si les habits sont bien lier à l'utilisateur qui les a mis en vente", () => {
    test('Retourne le bon nombre de produit pour gogo22 ', async () => {
        const username = 'gogo22';
        const table = Clothes;
        const result = await function_extension.clothesByMe(table, username);
        expect(result.length).toBe(1); // on s'attend à ce que la fonction retourne 3 produits
      });

      test('Retourne le bon nombre de produit pour velkiz ', async () => {
        const username = 'velkiz';
        const table = Clothes;
        const result = await function_extension.clothesByMe(table, username);
        expect(result.length).toBe(3); // on s'attend à ce que la fonction retourne 3 produits
      });

      
    test('Retourne les bonnes données pour le dernier produit en vente de velkiz', async () => {
        const username = 'velkiz';
        const table = Clothes;
        const result = await function_extension.clothesByMe(table, username);
        expect(result[0].user).toBe(username);
        expect(result[0].sold).toBe(false);
      });

    test('Retourne les bonnes données pour le premier produit en vente de gogo22', async () => {
        const username = 'gogo22';
        const table = Clothes;
        const result = await function_extension.clothesByMe(table, username);
        const l = result.length;
        expect(result[l-1].user).toBe(username);
        expect(result[l-1].sold).toBe(false);
    });
      
    test('Retourne une liste vide si la personne ne vend aucun produits', async () => {
        const username = 'Fredo';
        const table = Clothes;
        const result = await function_extension.clothesByMe(table, username);
        expect(result).toEqual([]); // on s'attend à ce que la fonction retourne un tableau vide
      });
})


  