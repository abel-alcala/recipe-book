import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css.ts";
import { Msg } from "../messages";
import { Model } from "../model";
import { RecipeData } from "../types/models.ts";

export class RecipeViewElement extends View<Model, Msg> {
    @property({ attribute: "recipe-id" })
    recipeId?: string;

    @state()
    get recipe(): RecipeData | undefined {
        return this.model.recipe;
    }

    @state()
    private servingCount: number = 1;

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
            name === "recipe-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading recipe:", newValue);
            this.dispatchMessage([
                "recipe/load",
                { recipeId: newValue }
            ]);
        }
    }

    updated(changedProperties: Map<string, unknown>) {
        super.updated(changedProperties);
        if (this.recipe && this.servingCount === 1) {
            const baseServings = this.parseServingSize(this.recipe.servingSize);
            if (baseServings > 0) {
                this.servingCount = baseServings;
            }
        }
    }

    private parseServingSize(servingSize: string): number {
        const match = servingSize.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
    }

    private calculateQuantity(originalQuantity: string, baseServings: number): string {
        const num = parseFloat(originalQuantity);
        if (isNaN(num)) return originalQuantity;
        const scaled = (num / baseServings) * this.servingCount;
        if (scaled === Math.floor(scaled)) {
            return scaled.toString();
        }
        return scaled.toFixed(1).replace(/\.0$/, '');
    }

    private handleServingChange(delta: number) {
        const newCount = this.servingCount + delta;
        if (newCount >= 1 && newCount <= 20) {
            this.servingCount = newCount;
        }
    }

    static styles = [
        globalStyles,
        css`
            :host {
                display: block;
                background: var(--color-background-page);
                min-height: 100vh;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-lg);
            }

            /* Hero Section */
            .recipe-hero {
                position: relative;
                margin-bottom: var(--spacing-xl);
            }

            .recipe-hero img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 12px;
            }

            .recipe-hero-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: var(--spacing-xl);
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                border-radius: 0 0 12px 12px;
            }

            .recipe-hero h1 {
                color: white;
                margin: 0 0 var(--spacing-sm) 0;
                font-size: 2.5rem;
                font-weight: 700;
            }

            .recipe-hero .description {
                color: rgba(255,255,255,0.9);
                margin: 0;
                font-size: 1.1rem;
                line-height: 1.5;
            }

            /* Meta Bar */
            .meta-bar {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: var(--spacing-lg);
                padding: var(--spacing-lg) 0;
                border-bottom: 1px solid var(--color-border);
                margin-bottom: var(--spacing-xl);
            }

            .meta-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .meta-item .label {
                font-size: 0.75rem;
                color: var(--color-text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .meta-item .value {
                font-size: 1rem;
                font-weight: 600;
                color: var(--color-text);
            }

            .meta-item a {
                color: var(--color-link);
                text-decoration: none;
            }

            .meta-item a:hover {
                text-decoration: underline;
            }

            /* Content Grid */
            .content-grid {
                display: grid;
                grid-template-columns: 350px 1fr;
                gap: var(--spacing-xxl, 3rem);
                align-items: start;
            }

            /* Ingredients */
            .ingredients-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-lg);
            }

            .ingredients h2 {
                font-size: 1.25rem;
                margin: 0;
                color: var(--color-text);
            }

            .serving-selector {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .serving-selector span {
                font-size: 0.85rem;
                color: var(--color-text-secondary);
            }

            .serving-controls {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .serving-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--color-border);
                background: var(--color-background-page);
                color: var(--color-text);
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .serving-btn:hover {
                background: var(--color-background-hover);
            }

            .serving-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            .serving-count {
                font-size: 1.1rem;
                font-weight: 600;
                min-width: 24px;
                text-align: center;
            }

            .ingredient-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .ingredient-list li {
                padding: var(--spacing-sm) 0;
                border-bottom: 1px solid var(--color-border);
                display: flex;
                justify-content: space-between;
                color: var(--color-text);
            }

            .ingredient-list li:last-child {
                border-bottom: none;
            }

            .ingredient-name {
                font-weight: 500;
            }

            .ingredient-amount {
                color: var(--color-text-secondary);
                white-space: nowrap;
            }

            /* Steps */
            .steps h2 {
                font-size: 1.25rem;
                margin: 0 0 var(--spacing-lg) 0;
                color: var(--color-text);
            }

            .step-list {
                list-style: none;
                padding: 0;
                margin: 0;
                counter-reset: step;
            }

            .step-list li {
                position: relative;
                padding: var(--spacing-md) 0 var(--spacing-md) 48px;
                border-bottom: 1px solid var(--color-border);
                color: var(--color-text);
                line-height: 1.6;
            }

            .step-list li:last-child {
                border-bottom: none;
            }

            .step-list li::before {
                counter-increment: step;
                content: counter(step);
                position: absolute;
                left: 0;
                top: var(--spacing-md);
                width: 32px;
                height: 32px;
                background: var(--color-primary);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.9rem;
            }

            /* Meal Plans */
            .meal-plans {
                margin-top: var(--spacing-xl);
                padding-top: var(--spacing-lg);
                border-top: 1px solid var(--color-border);
            }

            .meal-plans h3 {
                font-size: 1rem;
                margin: 0 0 var(--spacing-md) 0;
                color: var(--color-text-secondary);
            }

            .meal-plan-tags {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-sm);
            }

            .meal-plan-tag {
                padding: var(--spacing-xs) var(--spacing-md);
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: 20px;
                font-size: 0.85rem;
                color: var(--color-link);
                text-decoration: none;
            }

            .meal-plan-tag:hover {
                background: var(--color-background-hover);
            }

            @media (max-width: 900px) {
                .content-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 768px) {
                .recipe-hero img {
                    height: 250px;
                }

                .recipe-hero h1 {
                    font-size: 1.75rem;
                }

                .meta-bar {
                    justify-content: center;
                }

                .ingredients-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                }
            }
        `
    ];

    render() {
        if (!this.recipe && this.recipeId) {
            return html`
                <div class="container">
                    <div class="loading">Loading recipe...</div>
                </div>
            `;
        }

        if (!this.recipe) {
            return html`
                <div class="container">
                    <div class="loading">Recipe not found</div>
                </div>
            `;
        }

        const baseServings = this.parseServingSize(this.recipe.servingSize);

        return html`
            <div class="container">
                <div class="recipe-hero">
                    <img src="${this.recipe.imageUrl}" alt="${this.recipe.name}">
                    <div class="recipe-hero-overlay">
                        <h1>${this.recipe.name}</h1>
                        <p class="description">${this.recipe.description}</p>
                    </div>
                </div>

                <div class="meta-bar">
                    <div class="meta-item">
                        <span class="label">Time</span>
                        <span class="value">${this.recipe.cookingTime}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">Difficulty</span>
                        <span class="value">${this.recipe.difficulty}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">Chef</span>
                        <span class="value"><a href="${this.recipe.chef.href}">${this.recipe.chef.name}</a></span>
                    </div>
                    <div class="meta-item">
                        <span class="label">Cuisine</span>
                        <span class="value"><a href="${this.recipe.cuisine.href}">${this.recipe.cuisine.name}</a></span>
                    </div>
                </div>

                <div class="content-grid">
                    <div class="ingredients">
                        <div class="ingredients-header">
                            <h2>Ingredients</h2>
                            <div class="serving-selector">
                                <span>Servings</span>
                                <div class="serving-controls">
                                    <button
                                        class="serving-btn"
                                        @click=${() => this.handleServingChange(-1)}
                                        ?disabled=${this.servingCount <= 1}>
                                        -
                                    </button>
                                    <span class="serving-count">${this.servingCount}</span>
                                    <button
                                        class="serving-btn"
                                        @click=${() => this.handleServingChange(1)}
                                        ?disabled=${this.servingCount >= 20}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ul class="ingredient-list">
                            ${this.recipe.ingredients.map(ingredient => html`
                                <li>
                                    <span class="ingredient-name">${ingredient.name}</span>
                                    <span class="ingredient-amount">
                                        ${ingredient.quantity
                                            ? `${this.calculateQuantity(ingredient.quantity, baseServings)} ${ingredient.unit || ''}`
                                            : ''}
                                    </span>
                                </li>
                            `)}
                        </ul>
                    </div>

                    <div class="steps">
                        <h2>Instructions</h2>
                        <ol class="step-list">
                            ${this.recipe.steps.map(step => html`
                                <li>${step}</li>
                            `)}
                        </ol>
                    </div>
                </div>

                ${this.recipe.mealPlans.length > 0 ? html`
                    <div class="meal-plans">
                        <h3>Included in Meal Plans</h3>
                        <div class="meal-plan-tags">
                            ${this.recipe.mealPlans.map(plan => html`
                                <a href="${plan.href}" class="meal-plan-tag">${plan.name}</a>
                            `)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}