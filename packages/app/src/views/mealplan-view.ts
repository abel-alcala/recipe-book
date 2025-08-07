import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {MealPlanData} from "../types/models.ts";

export class MealPlanViewElement extends View<Model, Msg> {
    @property({attribute: "mealplan-id"})
    mealplanId?: string;

    @state()
    loading = false;

    @state()
    error?: string;

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
            this.loading = true;
            this.error = undefined;

            this.dispatchMessage([
                "mealplan/load",
                {
                    mealplanId: newValue,
                    onSuccess: () => {
                        this.loading = false;
                        console.log("Meal plan loaded successfully");
                    },
                    onFailure: (err: Error) => {
                        this.loading = false;
                        this.error = err.message;
                        console.error("Failed to load meal plan:", err);
                    }
                }
            ]);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.mealplanId && !this.mealplan && !this.loading) {
            this.attributeChangedCallback("mealplan-id", null, this.mealplanId);
        }
    }

    static styles = [
        globalStyles,
        css`
            :host {
                min-height: 100vh;
                display: block;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-lg);
            }

            .mealplan-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .mealplan-header h1 {
                margin: 0 0 var(--spacing-md) 0;
                color: var(--color-primary);
                font-size: 2rem;
            }

            .meta-info {
                display: flex;
                gap: var(--spacing-lg);
                flex-wrap: wrap;
                margin-bottom: var(--spacing-md);
            }

            .meta-item {
                font-size: 0.95rem;
                color: var(--color-text-muted);
            }

            .meta-item strong {
                color: var(--color-text);
            }

            .purpose {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
                margin: var(--spacing-md) 0 0 0;
                padding: var(--spacing-md);
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                border-left: 4px solid var(--color-accent);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .recipes-section h2 {
                margin: 0 0 var(--spacing-lg) 0;
                color: var(--color-primary);
                font-size: 1.5rem;
            }

            .recipe-list {
                display: grid;
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-xl);
            }

            .recipe-item {
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease;
                border: 1px solid var(--color-border);
            }

            .recipe-item:hover {
                background-color: var(--color-background-hover);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .recipe-info {
                flex: 1;
                min-width: 0; /* Prevents flex item from overflowing */
            }

            .recipe-name {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
                word-wrap: break-word;
            }

            .recipe-schedule {
                font-size: 0.9rem;
                color: var(--color-text-muted);
                font-style: italic;
            }

            .recipe-link {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border: 1px solid var(--color-link);
                border-radius: var(--border-radius-sm);
                transition: all 0.2s ease;
                white-space: nowrap;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .recipe-link:hover {
                background-color: var(--color-link);
                color: white;
                text-decoration: none;
                transform: translateX(2px);
            }

            .recipe-link::after {
                content: "→";
                transition: transform 0.2s ease;
            }

            .recipe-link:hover::after {
                transform: translateX(2px);
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
                font-weight: 500;
                text-transform: capitalize;
            }

            .loading, .error, .not-found {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                margin: var(--spacing-xl) 0;
            }

            .error {
                color: var(--color-error, #dc3545);
                background: var(--color-error-background, #f8d7da);
                border: 1px solid var(--color-error-border, #f5c6cb);
            }

            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid var(--color-text-muted);
                border-radius: 50%;
                border-top-color: var(--color-primary);
                animation: spin 1s linear infinite;
                margin-right: var(--spacing-sm);
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .empty-recipes {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text-muted);
                font-style: italic;
            }

            .recipe-count {
                font-size: 0.9rem;
                color: var(--color-text-muted);
                margin-bottom: var(--spacing-md);
            }

            @media (max-width: 768px) {
                .container {
                    padding: var(--spacing-md);
                }

                .meta-info {
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .recipe-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                }

                .recipe-link {
                    align-self: flex-end;
                }

                .mealplan-header h1 {
                    font-size: 1.5rem;
                }
            }
        `
    ];

    private validateRecipeHref(href: string): string {
        if (!href) return '#';

        if (href.startsWith('/app/recipe/') || href.startsWith('http')) {
            return href;
        }

        return `/app/recipe/${href}`;
    }

    private formatScheduleInfo(day?: string, mealType?: string): string {
        if (!day && !mealType) return '';

        const parts = [];
        if (day) parts.push(day);
        if (mealType) parts.push(mealType);

        return parts.join(' - ');
    }

    render() {
        if (this.loading) {
            return html`
                <div class="container">
                    <div class="loading">
                        <span class="loading-spinner"></span>
                        Loading meal plan...
                    </div>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="container">
                    <div class="error">
                        <h3>Error Loading Meal Plan</h3>
                        <p>${this.error}</p>
                    </div>
                </div>
            `;
        }

        if (!this.mealplan && this.mealplanId) {
            return html`
                <div class="container">
                    <div class="not-found">
                        <h3>Meal Plan Not Found</h3>
                        <p>The requested meal plan could not be found.</p>
                    </div>
                </div>
            `;
        }

        if (!this.mealplan) {
            return html`
                <div class="container">
                    <div class="not-found">
                        <h3>No Meal Plan</h3>
                        <p>Please select a meal plan to view.</p>
                    </div>
                </div>
            `;
        }

        const { mealplan } = this;
        const recipeCount = mealplan.recipes?.length || 0;

        return html`
            <div class="container">
                <div class="mealplan-header">
                    <h1>${mealplan.name}</h1>
                    <div class="meta-info">
                        <span class="meta-item">
                            <strong>Duration:</strong> ${mealplan.duration}
                        </span>
                        <span class="meta-item">
                            <strong>Meal Types:</strong> ${mealplan.mealTypes?.join(", ") || "None specified"}
                        </span>
                        <span class="meta-item">
                            <strong>Recipes:</strong> ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    ${mealplan.purpose ? html`
                        <div class="purpose">
                            <strong>Purpose:</strong> ${mealplan.purpose}
                        </div>
                    ` : ''}
                </div>

                <div class="recipes-section">
                    <h2>Included Recipes</h2>

                    ${recipeCount > 0 ? html`
                        <div class="recipe-count">
                            ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''} in this meal plan
                        </div>
                        <div class="recipe-list">
                            ${mealplan.recipes.map(recipe => html`
                                <div class="recipe-item">
                                    <div class="recipe-info">
                                        <div class="recipe-name">${recipe.name}</div>
                                        ${this.formatScheduleInfo(recipe.day, recipe.mealType) ? html`
                                            <div class="recipe-schedule">
                                                ${this.formatScheduleInfo(recipe.day, recipe.mealType)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <a href="${this.validateRecipeHref(recipe.href)}" class="recipe-link">
                                        View Recipe
                                    </a>
                                </div>
                            `)}
                        </div>
                    ` : html`
                        <div class="empty-recipes">
                            No recipes have been added to this meal plan yet.
                        </div>
                    `}

                    ${mealplan.mealTypes && mealplan.mealTypes.length > 0 ? html`
                        <div class="meal-types">
                            ${mealplan.mealTypes.map(mealType => html`
                                <span class="meal-type-tag">${mealType}</span>
                            `)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}