import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {IngredientData} from "../types/models.ts";

export class IngredientViewElement extends View<Model, Msg> {
    @property({attribute: "ingredient-id"})
    ingredientId?: string;

    @state()
    get ingredient(): IngredientData | undefined {
        return this.model.ingredient;
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
            name === "ingredient-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading ingredient:", newValue);
            this.dispatchMessage([
                "ingredient/load",
                {ingredientId: newValue}
            ]);
        }
    }

    static styles = [
        globalStyles,
        css`
            :host {
                min-height: 100vh;
            }

            .ingredient-card {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
            }

            .description {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: var(--spacing-xl);
                color: var(--color-text);
            }

            .section {
                margin-top: var(--spacing-lg);
                padding: var(--spacing-md);
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
            }

            .top-section {
                display: flex;
            }

            .details {
                padding-left: var(--spacing-lg);
            }

            .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: var(--spacing-md);
                margin-top: var(--spacing-md);
            }

            .nutrition-item {
                text-align: center;
                padding: var(--spacing-md);
                background: var(--color-background-card);
                border-radius: var(--border-radius-sm);
            }

            .nutrition-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
            }

            .nutrition-label {
                font-size: 0.9rem;
                color: var(--color-text-muted);
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            li {
                margin-bottom: var(--spacing-sm);
            }

            .section a {
                display: block;
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s;
            }

            .section a:hover {
                background-color: var(--color-background-hover);
                text-decoration: none;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `
    ];

    render() {
        if (!this.ingredient && this.ingredientId) {
            return html`
                <div class="container">
                    <div class="loading">Loading ingredient...</div>
                </div>
            `;
        }

        if (!this.ingredient) {
            return html`
                <div class="container">
                    <div class="loading">Ingredient not found</div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="ingredient-card">
                    <h1>${this.ingredient.name}</h1>
                    <div class="top-section">
                        ${this.ingredient.imageUrl ? html`
                            <img src="${this.ingredient.imageUrl}" alt="${this.ingredient.name}"
                                 style="max-width: 250px;">
                        ` : ''}
                        <div class="details">
                            <p><strong>Category:</strong> ${this.ingredient.category}</p>
                            ${this.ingredient.allergens ? html`
                                <p><strong>Allergens:</strong> ${this.ingredient.allergens}</p>
                            ` : ''}
                            ${this.ingredient.substitutes ? html`
                                <p><strong>Substitutes:</strong> ${this.ingredient.substitutes}</p>
                            ` : ''}
                        </div>
                    </div>

                    ${this.ingredient.nutrition && this.ingredient.nutrition.length > 0 ? html`
                        <div class="section">
                            <h2>Nutritional Information</h2>
                            <div class="nutrition-grid">
                                ${this.ingredient.nutrition.map(item => html`
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${item.value}</div>
                                        <div class="nutrition-label">${item.label}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}

                    ${this.ingredient.recipes && this.ingredient.recipes.length > 0 ? html`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipes.map(recipe => html`
                                    <li><a href="${recipe.href}">${recipe.name}</a></li>
                                `)}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}