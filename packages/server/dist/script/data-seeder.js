"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_mongo = require("../services/mongo");
var import_chef_service = __toESM(require("../services/chef-service"));
var import_cuisine_service = __toESM(require("../services/cuisine-service"));
var import_mealplan_service = __toESM(require("../services/mealplan-service"));
var import_recipe_service = __toESM(require("../services/recipe-service"));
var import_ingredient_svc = __toESM(require("../services/ingredient-svc"));
async function seedData() {
  await (0, import_mongo.connect)("recipes");
  try {
    const chefAbel = await import_chef_service.default.create({
      idName: "abel",
      name: "Chef Abel",
      bio: "Chef Abel has had a couple years of experience, and is constantly looking to find new recipes and methods. His passion for fresh ingredients and traditional recipes shines through in every dish.",
      imageUrl: "/images/chef-abel.jpeg",
      favoriteDishes: ["Spaghetti", "Tinga Tacos", "Burritos", "Chicken Alfredo", "Sushi Bake", "Enchiladas"],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    console.log("Created chef:", chefAbel.name);
    const italianCuisine = await import_cuisine_service.default.create({
      idName: "italian",
      name: "Italian Cuisine",
      region: "Italy",
      description: "Italian cuisine is celebrated for its regional diversity, rich flavors, and emphasis on fresh ingredients. Signature dishes include pasta, pizza, and risotto.",
      popularIngredients: ["Tomatoes", "Garlic", "Basil", "Olive Oil", "Pasta"],
      typicalDishes: ["Italian Spaghetti", "Pizza Margherita", "Lasagna"],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti", imageUrl: "/images/spaghetti.png" }
      ]
    });
    console.log("Created cuisine:", italianCuisine.name);
    await import_cuisine_service.default.create({
      idName: "mexican",
      name: "Mexican",
      region: "Mexico",
      description: "Mexican cuisine is known for its bold flavors, vibrant colors, and diverse regional variations.",
      popularIngredients: ["Corn", "Beans", "Chili Peppers", "Tomatoes", "Avocado"],
      typicalDishes: ["Tacos", "Enchiladas", "Burritos"],
      recipes: []
    });
    await import_cuisine_service.default.create({
      idName: "quick-meals",
      name: "Quick Meals",
      region: "Various",
      description: "Quick and easy meals that can be prepared in 30 minutes or less.",
      popularIngredients: ["Pasta", "Rice", "Vegetables", "Chicken", "Eggs"],
      typicalDishes: ["Stir Fry", "Pasta", "Sandwiches"],
      recipes: []
    });
    await import_cuisine_service.default.create({
      idName: "vegetarian",
      name: "Vegetarian",
      region: "Various",
      description: "Delicious meat-free dishes from around the world.",
      popularIngredients: ["Vegetables", "Legumes", "Grains", "Nuts", "Dairy"],
      typicalDishes: ["Salads", "Veggie Burgers", "Pasta"],
      recipes: []
    });
    const garlic = await import_ingredient_svc.default.create({
      idName: "garlic",
      name: "Garlic",
      imageUrl: "/images/garlic.jpg",
      category: "Vegetable",
      allergens: "None",
      substitutes: "Garlic powder, Shallots",
      nutrition: [
        { label: "Calories", value: "4" },
        { label: "Protein", value: "0.2g" },
        { label: "Carbs", value: "1g" },
        { label: "Fat", value: "0g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    console.log("Created ingredient:", garlic.name);
    const tomato = await import_ingredient_svc.default.create({
      idName: "tomato",
      name: "Tomato",
      imageUrl: "/images/tomato.jpg",
      category: "Vegetable",
      allergens: "None",
      substitutes: "Tomato paste, Canned tomatoes",
      nutrition: [
        { label: "Calories", value: "18" },
        { label: "Protein", value: "0.9g" },
        { label: "Carbs", value: "3.9g" },
        { label: "Fat", value: "0.2g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    console.log("Created ingredient:", tomato.name);
    await import_ingredient_svc.default.create({
      idName: "spaghetti-noodles",
      name: "Spaghetti Noodles",
      imageUrl: "/images/spaghetti-noodles.jpg",
      category: "Grain",
      allergens: "Gluten",
      substitutes: "Linguine, Fettuccine",
      nutrition: [
        { label: "Calories", value: "200" },
        { label: "Protein", value: "7g" },
        { label: "Carbs", value: "42g" },
        { label: "Fat", value: "1g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    await import_ingredient_svc.default.create({
      idName: "ground-beef",
      name: "Ground Beef",
      imageUrl: "/images/ground-beef.jpg",
      category: "Meat",
      allergens: "None",
      substitutes: "Ground Turkey, Plant-based meat",
      nutrition: [
        { label: "Calories", value: "250" },
        { label: "Protein", value: "20g" },
        { label: "Carbs", value: "0g" },
        { label: "Fat", value: "20g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    await import_ingredient_svc.default.create({
      idName: "onion",
      name: "Onions",
      imageUrl: "/images/onion.jpg",
      category: "Vegetable",
      allergens: "None",
      substitutes: "Shallots, Leeks",
      nutrition: [
        { label: "Calories", value: "40" },
        { label: "Protein", value: "1g" },
        { label: "Carbs", value: "9g" },
        { label: "Fat", value: "0g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    await import_ingredient_svc.default.create({
      idName: "olive-oil",
      name: "Olive Oil",
      imageUrl: "/images/olive-oil.jpg",
      category: "Oil",
      allergens: "None",
      substitutes: "Vegetable oil, Butter",
      nutrition: [
        { label: "Calories", value: "120" },
        { label: "Protein", value: "0g" },
        { label: "Carbs", value: "0g" },
        { label: "Fat", value: "14g" }
      ],
      recipes: [
        { name: "Classic Spaghetti", href: "/app/recipe/spaghetti" }
      ]
    });
    const weeklyMealPlan = await import_mealplan_service.default.create({
      idName: "abels-weekly",
      name: "Abel's Weekly Meal Plan",
      duration: "7 days",
      purpose: "To enjoy balanced meals featuring authentic Italian flavors while maintaining health goals.",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
      recipes: [
        {
          name: "Classic Spaghetti",
          href: "/app/recipe/spaghetti",
          day: "Monday",
          mealType: "Dinner"
        },
        {
          name: "Classic Spaghetti",
          href: "/app/recipe/spaghetti",
          day: "Thursday",
          mealType: "Lunch"
        }
      ]
    });
    console.log("Created meal plan:", weeklyMealPlan.name);
    const spaghettiRecipe = await import_recipe_service.default.create({
      idName: "spaghetti",
      name: "Classic Spaghetti",
      description: "A traditional Italian pasta dish featuring a rich meat sauce served over spaghetti noodles",
      imageUrl: "/images/spaghetti.png",
      cookingTime: "1 hour 30 minutes",
      servingSize: "Serves 6",
      difficulty: "Intermediate",
      chef: { name: "Chef Abel", href: "/app/chef/abel" },
      cuisine: { name: "Italian", href: "/app/cuisine/italian" },
      ingredients: [
        { name: "Spaghetti Noodles", href: "/app/ingredient/spaghetti-noodles" },
        { name: "Tomato", href: "/app/ingredient/tomato" },
        { name: "Garlic", href: "/app/ingredient/garlic" },
        { name: "Ground Beef", href: "/app/ingredient/ground-beef" },
        { name: "Onions", href: "/app/ingredient/onion" },
        { name: "Olive Oil", href: "/app/ingredient/olive-oil" }
      ],
      mealPlans: [
        { name: "Abel's Weekly Meal Plan", href: "/app/mealplan/abels-weekly" }
      ],
      steps: [
        "In a large skillet, heat 2 tablespoons of olive oil over medium heat. Add 1 finely chopped onion and 3 minced garlic cloves. Saut\xE9 for about 5 minutes, or until the onions are translucent and fragrant.",
        "Add 1 pound of ground beef to the skillet. Break it apart with a wooden spoon and cook until fully browned, about 8\u201310 minutes. Drain any excess fat if necessary.",
        "Stir in 2 cups of tomato sauce (or crushed tomatoes), along with salt, pepper, and Italian seasoning to taste. Reduce heat to low and let the sauce simmer uncovered for 45 minutes to allow flavors to develop, stirring occasionally.",
        "While the sauce is simmering, bring a large pot of salted water to a boil. Add 400g (14 oz) of spaghetti and cook until al dente, about 8\u201310 minutes. Drain the pasta and optionally toss with a drizzle of olive oil to prevent sticking.",
        "Plate the spaghetti and ladle the meat sauce generously over the top. Garnish with freshly grated Parmesan cheese and chopped basil if desired. Serve hot."
      ]
    });
    console.log("Created recipe:", spaghettiRecipe.name);
    console.log("Data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}
seedData();
