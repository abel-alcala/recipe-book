import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import { AppHeader } from "./components/app-header";
import { HomeViewElement } from "./views/home-view";
import { RecipeViewElement } from "./views/recipe-view";
import { ChefViewElement } from "./views/chef-view";
import { IngredientViewElement } from "./views/ingredient-view";
import { CuisineViewElement } from "./views/cuisine-view";
import { MealPlanViewElement } from "./views/mealplan-view";
import { LoginFormElement } from "./components/login-form";
import tokenStyles from "./styles/tokens.css";

const style = document.createElement('style');
style.textContent = tokenStyles.cssText;
document.head.append(style);

const routes = [
  {
    path: "/app/recipe/:id",
    view: (params: Switch.Params) => html`
      <recipe-view recipe-id=${params.id}></recipe-view>
    `
  },
  {
    path: "/app/chef/:id",
    view: (params: Switch.Params) => html`
      <chef-view chef-id=${params.id}></chef-view>
    `
  },
  {
    path: "/app/ingredient/:id",
    view: (params: Switch.Params) => html`
      <ingredient-view ingredient-id=${params.id}></ingredient-view>
    `
  },
  {
    path: "/app/cuisine/:id",
    view: (params: Switch.Params) => html`
      <cuisine-view cuisine-id=${params.id}></cuisine-view>
    `
  },
  {
    path: "/app/mealplan/:id",
    view: (params: Switch.Params) => html`
      <mealplan-view mealplan-id=${params.id}></mealplan-view>
    `
  },
  {
    path: "/app/mealplan",
    view: () => html`
      <mealplan-list-view></mealplan-list-view>
    `
  },
  {
    path: "/app/recipes",
    view: () => html`
      <recipes-list-view></recipes-list-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "app-header": AppHeader,
  "home-view": HomeViewElement,
  "recipe-view": RecipeViewElement,
  "chef-view": ChefViewElement,
  "ingredient-view": IngredientViewElement,
  "cuisine-view": CuisineViewElement,
  "mealplan-view": MealPlanViewElement,
  "login-form": LoginFormElement,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "recipebook:history", "recipebook:auth");
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedDarkMode = localStorage.getItem('darkMode');
  const isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';

  if (!isDarkMode) {
    document.body.classList.add('light-mode');
  }

  document.body.addEventListener('darkmode:toggle', (event) => {
    const customEvent = event as CustomEvent<{ isDarkMode: boolean }>;
    const isDark = customEvent.detail.isDarkMode;

    if (isDark) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }

    localStorage.setItem('darkMode', isDark.toString());
  });
});