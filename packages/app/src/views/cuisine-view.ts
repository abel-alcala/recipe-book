import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {CuisineData} from "../types/models.ts";

export class CuisineViewElement extends View<Model, Msg> {
    @property({attribute: "cuisine-id"})
    cuisineId?: string;

    @state()
    get cuisine(): CuisineData | undefined {
        return this.model.cuisine;
    }

    constructor() {
        super("recipebook:model");
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (
            name === "cuisine-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading cuisine:", newValue);
            this.dispatchMessage([
                "cuisine/load",
                {cuisineId: newValue}
            ]);
        }
    }

    static styles = [
        globalStyles,
        css`
            :host {
                min-height: 100vh;
            }

            .cuisine-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .region {
                color: var(--color-text-muted);
                font-size: 1.1rem;
                margin-bottom: var(--spacing-md);
            }

            .description {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
            }

            .recipe-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: var(--spacing-lg);
                margin-top: var(--spacing-lg);
            }

            .recipe-card {
                background: var(--color-background);
                border-radius: var(--border-radius-md);
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                text-decoration: none;
                display: block;
            }

            .recipe-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .recipe-card img {
                width: 100%;
                height: 150px;
                object-fit: cover;
            }

            .recipe-card-content {
                padding: var(--spacing-md);
            }

            .recipe-card h3 {
                font-family: var(--font-display);
                font-size: 1.1rem;
                margin: 0;
                color: var(--color-primary);
            }

            .recipe-card:hover h3 {
                color: var(--color-link-hover);
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `
    ];

    render() {
        if (!this.cuisine && this.cuisineId) {
            return html`
                <div class="container">
                    <div class="loading">Loading cuisine...</div>
                </div>
            `;
        }

        if (!this.cuisine) {
            return html`
                <div class="container">
                    <div class="loading">Cuisine not found</div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="cuisine-header">
                    <h1>${this.cuisine.name}</h1>
                    <p class="region"><strong>Region/Country of Origin:</strong> ${this.cuisine.region}</p>
                    <p class="description">${this.cuisine.description}</p>
                </div>

                <div class="info-grid">
                    <div class="info-section">
                        <h2>Popular Ingredients</h2>
                        <ul class="tag-list">
                            ${this.cuisine.popularIngredients.map(ingredient => html`
                                <li class="tag">${ingredient}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="info-section">
                        <h2>Typical Dishes</h2>
                        <ul class="tag-list">
                            ${this.cuisine.typicalDishes.map(dish => html`
                                <li class="tag">${dish}</li>
                            `)}
                        </ul>
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes from ${this.cuisine.name}</h2>
                    <div class="recipe-grid">
                        ${this.cuisine.recipes.map(recipe => html`
                            <a href="${recipe.href}" class="recipe-card">
                                ${recipe.imageUrl ? html`
                                    <img src="${recipe.imageUrl}" alt="${recipe.name}">
                                ` : ''}
                                <div class="recipe-card-content">
                                    <h3>${recipe.name}</h3>
                                </div>
                            </a>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}