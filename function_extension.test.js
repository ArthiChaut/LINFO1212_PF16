
const function_extension = require('./function_extension');
const { User, Clothes } = require('./models');

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
        expect(result.length).toBe(5); // on s'attend à ce que la fonction retourne 6 produits
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
        expect(result.length).toBe(5); // on s'attend à ce que la fonction retourne 5 produits
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
        expect(result.length).toBe(1); // on s'attend à ce que la fonction retourne 2 produits
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

//////////////changePP////////////////
describe("Check si le changement de photo de profil de l'utilisateur se fait bien", () => {
    test("Check si l'image se change bien chez pat", async () => {
        const newPP = 'map.png';
        const username = 'pat';
        const result = await function_extension.changePP(newPP, username);
        expect(result).toBe('static/IMAGES/map.png');
      });
      
      test("Check si la fonction lance une erreur lorsque l'utilisateur n'existe pas ", async () => {
        const newPP = 'map.png';
        const username = 'InvalidUser';
        await expect(function_extension.changePP(newPP, username)).rejects.toThrow();
      });
      
})
describe("Sum the products prices of the basket", () => {
    test("three products who respectively cost 10,15 and 45 credits should result 70", () => {
    result = [
            {
            Image: 'static/IMAGES/1671652403467.jpg',
            Marque: "levi's",
            Prix: 10,
            Etat: 'Neuf',
            Couleur: 'Bleu',
            User: 'patoche'
            },
            {
                Image: 'static/IMAGES/1671652403445.jpg',
                Marque: "new balance",
                Prix: 15,
                Etat: 'Neuf',
                Couleur: 'Noir',
                User: 'patoche'
            },
            {
                Image: 'static/IMAGES/1671652403624.jpg',
                Marque: "nike",
                Prix: 45,
                Etat: 'Neuf',
                Couleur: 'Rouge',
                User: 'patoche'
            }  
      ]
     expect(function_extension.getPanierTotal(result)).toBe(70);
    });
})

describe("Modify an article", () => {
    test("Modification of the image of the article",async () => {
        id = 3;
        let article = await Clothes.findOne({where:{id:id}})
        change = [
        'static/IMAGES/1671114477979.jpg',
        'No change',
        '',
        '',
        'No change',
        'No change',
        'No change',
        'No change'
      ];
     await function_extension.changeVetement(change,id);
     expect(article.image).toBe(change[0]);
    });


    test("Modification of the image of the article",async () => {
        id = 3;
        let article = await Clothes.findOne({where:{id:id}})
        let initial = [article.image,article.type,article.marque,article.prix,article.couleur,article.taille,article.genre,article.etat]
        let change = [
        'static/IMAGES/1671114477979.jpg',
        'No change',
        '',
        '',
        'No change',
        'No change',
        'No change',
        'No change'
      ];
     await function_extension.changeVetement(change,id);
     let article2 = await Clothes.findOne({where:{id:id}})
     let final = [article2.image,article2.type,article2.marque,article2.prix,article2.couleur,article2.taille,article2.genre,article2.etat]
     expect(final[0]).toBe(change[0]) // image has been modified
     for(let i = 1; i < final.length;i++){
        expect(final[i]).toBe(initial[i]); // ONLY the image has been modified
     }
     
     
    });

    test("Modification of the image of the article + brand + price at the same time",async () => {
        id = 5;
        let article = await Clothes.findOne({where:{id:id}})
        let initial = [article.image,article.type,article.marque,article.prix,article.couleur,article.taille,article.genre,article.etat]
        let change = [
        'static/IMAGES/1671638368208.jpg',
        'No change',
        'Adidas',
         30,
        'No change',
        'No change',
        'No change',
        'No change'
      ];

     await function_extension.changeVetement(change,id);
     let article2 = await Clothes.findOne({where:{id:id}})
     let final = [article2.image,article2.type,article2.marque,article2.prix,article2.couleur,article2.taille,article2.genre,article2.etat]
     expect(final[0]).toBe(change[0]) // image has been modified
     expect(final[2]).toBe(change[2]) // brand has been modified
     expect(final[3]).toBe(change[3]) // price has been modified
    });
})

describe("Remove a list of articles from the store", () => {
    test('remove three articles from the store',async () =>{
        result = [
            {
            Image: 'static/IMAGES/1671590408293.jpg',
            Marque: "faith",
            Prix: 20,
            Etat: 'Neuf',
            Couleur: 'Noir',
            User: 'gogo22'
            },
            {
                Image: 'static/IMAGES/1671581655078.jpg',
                Marque: "Levi's",
                Prix: 50,
                Etat: 'Très bon état',
                Couleur: 'Bleu',
                User: 'velkiz'
            },
            {
                Image: 'static/IMAGES/1671660890853.jpg',
                Marque: "jedi",
                Prix: 40,
                Etat: 'Neuf',
                Couleur: 'Beige',
                User: 'Dubois'
            }    
      ]

      await function_extension.removeArticles(result);
      for(let i = 0; i < result.length; i ++){
        let article = await Clothes.findOne({where:{image:result[i].Image}})
        expect(article.sold).toBe(true);
      }
      


    })
})

describe("update multiple accounts balance ", () => {
    test('update balance of two accounts', async () =>{
        result = [
            {
            Image: 'static/IMAGES/1671590408293.jpg',
            Marque: "faith",
            Prix: 20,
            Etat: 'Neuf',
            Couleur: 'Noir',
            User: 'gogo22'
            },
            {
                Image: 'static/IMAGES/1671638368208.jpg',
                Marque: "martaman",
                Prix: 33,
                Etat: 'Neuf',
                Couleur: 'Jaune',
                User: 'velkiz'
                }      
      ]
      let first = await User.findOne({where:{username:result[0].User}})
      let second = await User.findOne({where:{username:result[1].User}})
      console.log(first)
      expected1 = first.credits + 20;
      expected2 = second.credits + 33;
      function_extension.updateAllCredits(result);
      let firstAfter = await User.findOne({where:{username:result[0].User}})
      console.log(firstAfter)
      console.log(firstAfter.credits)
      let secondAfter = await User.findOne({where:{username:result[1].User}})
      expect(expected1).toBe(firstAfter.credits);
      expect(expected2).toBe(secondAfter.credits);
    })
})

describe("Check if password is correct for a username", () => {

    test("Password is correct with email or username", async () => {
        const result1 = await function_extension.passwordCorrect('Dubois', 'azerty')
        const result2 = await function_extension.passwordCorrect('arnaudubois16@gmail.com', 'azerty')
        expect(result1.username).toBe('Dubois')
        expect(result2.email).toBe('arnaudubois16@gmail.com')
    })

    test("Password isn't correct with email or username", async () => {
        const result1 = await function_extension.passwordCorrect('Dubois', 'vivivo')
        const result2 = await function_extension.passwordCorrect('arnaudubois16@gmail.com', '§§§54hhh')
        expect(result1).toBe(false)
        expect(result2).toBe(false)
    })

    test("Password décryptage", async () => {
        let name = await User.findOne({where: {username: 'Dubois'}});
        const result1 = function_extension.splitSearchPassword(name, 'azerty');
        const result2 = function_extension.splitSearchPassword(name, '55fffggggg');
        const result3 = function_extension.splitSearchPassword(null, 'azerty');
        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(result3).toBe(null)
    })
})

describe("Check if username or email already take", () => {

  test("Username or email already take", async () => {
    const result1 = await function_extension.accountExistForCreate('Dubois', 'arnaudubois16@gmail.com');
    const result2 = await function_extension.accountExistForCreate('Dubois', 'nono@gmail.com');
    const result3 = await function_extension.accountExistForCreate('Tira20', 'arnaudubois16@gmail.com');
    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(true)
})

test("Username or email available", async () => {
    const result1 = await function_extension.accountExistForCreate('Tira20', 'nono@gmail.com');
    expect(result1).toBe(false)
    })
    
})

describe("Check price is a number", () => {

    test("Price is a number", () => {
        expect(function_extension.checkPrice('6')).toBe(true);
        expect(function_extension.checkPrice('0')).toBe(true);
        expect(function_extension.checkPrice('1513535322')).toBe(true);
    })

    test("Price isn't a number", () => {
        expect(function_extension.checkPrice('oui')).toBe(false);
        expect(function_extension.checkPrice(User)).toBe(false);
    })
})

describe("Check if email has correct form", () => {

    test("email is in correct form", () => {
        expect(function_extension.checkEmail("arnaudubois16@gmail.com")).toBe(true);
        expect(function_extension.checkEmail("a@a.com")).toBe(true);
        expect(function_extension.checkEmail("jim@hotmail.be")).toBe(true);
    })

    test("email is in correct form", () => {
        expect(function_extension.checkEmail(56)).toBe(false);
        expect(function_extension.checkEmail("a@a")).toBe(false);
        expect(function_extension.checkEmail("jimhotmail.be")).toBe(false);
    })
    
})

describe("Check if two password are same", () => {

    test("two password are same", () => {
        expect(function_extension.passwordConfirm("azerty", "azerty")).toBe(true);
        expect(function_extension.passwordConfirm("AZerty", "AZerty")).toBe(true);
        expect(function_extension.passwordConfirm("bou12()", "bou12()")).toBe(true);
    })

    test("two password aren't same", () => {
        expect(function_extension.passwordConfirm("azerty", "boulanger")).toBe(false);
        expect(function_extension.passwordConfirm("AZerty", "azerty")).toBe(false);
        expect(function_extension.passwordConfirm("Maxbil.", "Maxbil")).toBe(false);
    })
    
})

describe("Find the last five clothes put on the site", () => {
  
    test("For any database", async () => {
      let array = await Clothes.findAll({where: {sold: false}});
      if(array.length === 0){
        let articles = await function_extension.fiveLastInstances(Clothes)
        expect(article).toBe([])
      }
      
      let articles = await function_extension.fiveLastInstances(Clothes)
      for(let i = 0; i < articles.length; i++){
          expect(articles[i].id).toBe(array[array.length-1-i].id);
      }
    })
})

describe("Change the profil picture of a user", () => {

  test("the picture chosen is correct", async () => {
    const val = 'Photo_de_profil.jpg'
    expect(await function_extension.changePP(val, 'Dubois')).toBe("static/IMAGES/" + val);
  })

})
