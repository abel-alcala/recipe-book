import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {MealPlanData} from "server/models";

export class MealPlanViewElement extends View<Model, Msg> {
    @property({attribute: "mealplan-id"})
    mealplanId?: string;

    @state()
    get mealplan(): MealPlanData | undefined {
        return this.model.mealplan;
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
            name === "mealplan-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading meal plan:", newValue);
            this.dispatchMessage([
                "mealplan/load",
                {mealplanId: newValue}
            ]);
        }
    }

    static styles = [
        globalStyles,
        css`
            :host {
                min-height: 100vh;
            }

            .mealplan-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .purpose {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
                margin-top: var(--spacing-md);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
            }

            .recipe-list {
                display: grid;
                gap: var(--spacing-md);
            }

            .recipe-item {
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s;
            }

            .recipe-item:hover {
                background-color: var(--color-background-hover);
            }

            .recipe-info {
                flex: 1;
            }

            .recipe-name {
                font-size: 1.1rem;
                font-weight: 500;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
            }

            .recipe-schedule {
                font-size: 0.9rem;
                color: var(--color-text-muted);
            }

            .recipe-link {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border: 1px solid var(--color-link);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s, color 0.2s;
                white-space: nowrap;
            }

            .recipe-link:hover {
                background-color: var(--color-link);
                color: white;
                text-decoration: none;
            }

            .meal-types {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                margin-top: var(--spacing-md);
            }

            .meal-type-tag {
                background: var(--color-accent);
                color: var(--color-text-inverted);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.9rem;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `
    ];

    render() {
        if (!this.mealplan && this.mealplanId) {
            return html`
                <div class="container">
                    <div class="loading">Loading meal plan...</div>
                </div>
            `;
        }

        if (!this.mealplan) {
            return html`
                <div class="container">
                    <div class="loading">Meal plan not found</div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="mealplan-header">
                    <h1>${this.mealplan.name}</h1>
                    <div class="meta-info">
                        <span class="meta-item"><strong>Duration:</strong> ${this.mealplan.duration}</span>
                        <span class="meta-item"><strong>Meal Types:</strong> ${this.mealplan.mealTypes.join(", ")}</span>
                    </div>
                    <p class="purpose"><strong>Purpose:</strong> ${this.mealplan.purpose}</p>
                </div>

                <div class="recipes-section">
                    <h2>Included Recipes</h2>
                    <div class="recipe-list">
                        ${this.mealplan.recipes.map(recipe => html`
                            <div class="recipe-item">
                                <div class="recipe-info">
                                    <div class="recipe-name">${recipe.name}</div>
                                    ${recipe.day || recipe.mealType ? html`
                                        <div class="recipe-schedule">
                                            ${recipe.day ? recipe.day : ''}
                                            ${recipe.day && recipe.mealType ? ' - ' : ''}
                                            ${recipe.mealType ? recipe.mealType : ''}
                                        </div>
                                    ` : ''}
                                </div>
                                <a href="${recipe.href}" class="recipe-link">View Recipe →</a>
                            </div>
                        `)}
                    </div>

                    <div class="meal-types">
                        ${this.mealplan.mealTypes.map(mealType => html`
                            <span class="meal-type-tag">${mealType}</span>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}