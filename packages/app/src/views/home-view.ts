import {css, html} from "lit";
import {state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {MealPlanData, RecipeData} from "server/models";

export class HomeViewElement extends View<Model, Msg> {
    @state()
    private viewMode: 'recipes' | 'mealplans' = 'recipes';

    @state()
    get recipes(): RecipeData[] {
        return this.model.recipes || [];
    }

    @state()
    get mealPlans(): MealPlanData[] {
        return this.model.mealplans || [];
    }

    constructor() {
        super("recipebook:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage(["recipes/load", {}]);
        this.dispatchMessage(["mealplans/load", {}]);
    }

    static styles = [
        globalStyles,
        css`
            :host {
                display: block;
                background: linear-gradient(135deg,
                var(--color-background-page) 0%,
                var(--color-background) 100%);
                min-height: 100vh;
                font-family: var(--font-body);
            }

            .hero-section {
                text-align: center;
                padding-top: var(--spacing-xxl) 0;
                padding-bottom: var(--spacing-md);
                border-radius: var(--border-radius-lg);
                position: relative;
                overflow: hidden;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
            }

            .hero-section h1 {
                font-size: 3rem;
                margin-bottom: var(--spacing-md);
                background: linear-gradient(135deg,
                var(--color-primary) 0%,
                var(--color-accent-alt) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: relative;
                z-index: 1;
            }

            .hero-section p {
                font-size: 1.2rem;
                color: var(--color-text);
                max-width: 600px;
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }

            /* View Toggle */

            .view-toggle {
                display: flex;
                justify-content: center;
                margin-bottom: var(--spacing-xl);
                position: relative;
                background: var(--color-background-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xs);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }

            .toggle-button {
                flex: 1;
                padding: var(--spacing-md) var(--spacing-lg);
                border: none;
                background: transparent;
                color: var(--color-text);
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                z-index: 2;
                transition: color 0.3s ease;
                border-radius: var(--border-radius-md);
            }

            .toggle-button.active {
                color: var(--color-text-inverted);

            }

            .toggle-indicator {
                position: absolute;
                top: var(--spacing-xs);
                height: calc(100% - var(--spacing-sm));
                width: calc(50% - var(--spacing-xs));
                background: linear-gradient(135deg,
                var(--color-accent) 0%,
                var(--color-accent-alt) 100%);
                border-radius: var(--border-radius-md);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(158, 206, 106, 0.3);
            }

            .toggle-indicator.recipes {
                transform: translateX(-50%);
            }

            .toggle-indicator.mealplans {
                transform: translateX(50%);
            }

            .content-section {
                animation: fadeIn 0.5s ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .content-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .item-card {
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-lg);
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                text-decoration: none;
                color: inherit;
                display: block;
            }

            .item-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg,
                transparent 0%,
                rgba(158, 206, 106, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .item-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                border-color: var(--color-accent);
            }

            .item-card:hover::before {
                opacity: 1;
            }

            .item-image {
                width: 100%;
                padding: var(--spacing-lg);
                height: 220px;
                object-fit: contain;
                transition: transform 0.3s ease;
            }

            .item-card:hover .item-image {
                transform: scale(1.05);
            }

            .item-content {
                padding: var(--spacing-lg);
                position: relative;
            }

            .item-content h3 {
                font-size: 1.3rem;
                margin-bottom: var(--spacing-sm);
                color: var(--color-primary);
                transition: color 0.3s ease;
            }

            .item-card:hover .item-content h3 {
                color: var(--color-accent-alt);
            }

            .item-content p {
                color: var(--color-text);
                line-height: 1.6;
                margin-bottom: var(--spacing-md);
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .item-meta {
                display: flex;
                gap: var(--spacing-lg);
                font-size: 0.9rem;
                color: var(--color-text-muted);
                flex-wrap: wrap;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .meta-icon {
                width: 16px;
                height: 16px;
                fill: var(--color-accent);
            }

            .difficulty-badge {
                background: var(--color-accent);
                color: var(--color-text-inverted);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: capitalize;
            }

            .difficulty-easy { background: #10b981; }
            .difficulty-medium { background: #f59e0b; } 
            .difficulty-hard { background: #ef4444; }
            
            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                gap: var(--spacing-lg);
            }

            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid var(--color-border);
                border-top-color: var(--color-accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .loading-text {
                color: var(--color-text-muted);
                font-size: 1.1rem;
            }

            /* Empty State */
            .empty-state {
                text-align: center;
                padding: var(--spacing-xxl);
                color: var(--color-text-muted);
            }

            .empty-state svg {
                width: 120px;
                height: 120px;
                margin-bottom: var(--spacing-lg);
                fill: var(--color-border);
            }
            
            @media (max-width: 768px) {
                .hero-section h1 {
                    font-size: 2rem;
                }

                .content-grid {
                    grid-template-columns: 1fr;
                }

                .view-toggle {
                    max-width: 100%;
                }

                .item-meta {
                    gap: var(--spacing-md);
                }
            }
        `
    ];

    private handleViewToggle(mode: 'recipes' | 'mealplans') {
        this.viewMode = mode;
    }

    private renderContent() {
        const items = this.viewMode === 'recipes' ? this.recipes : this.mealPlans;
        const isLoading = items.length === 0 &&
            (this.viewMode === 'recipes' ? !this.model.recipes : !this.model.mealplans);

        if (isLoading) {
            return html`
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading delicious content...</div>
                </div>
            `;
        }

        if (items.length === 0) {
            return html`
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>No ${this.viewMode === 'recipes' ? 'recipes' : 'meal plans'} found</h3>
                    <p>Check back later for new content!</p>
                </div>
            `;
        }

        return html`
            <div class="content-grid">
                ${items.map(item => this.renderCard(item))}
            </div>
        `;
    }

    private renderCard(item: RecipeData | MealPlanData) {
        const isRecipe = 'cookingTime' in item;
        const href = isRecipe
            ? `/app/recipe/${(item as RecipeData).idName}`
            : `/app/mealplan/${(item as MealPlanData).idName}`;

        if (isRecipe) {
            const recipe = item as RecipeData;
            return html`
                <a href=${href} class="item-card">
                    <img
                            class="item-image"
                            src=${recipe.imageUrl || '/images/placeholder.jpg'}
                            alt=${recipe.name}
                            loading="lazy"
                    >
                    <div class="item-content">
                        <h3>${recipe.name}</h3>
                        <p>${recipe.description}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                </svg>
                                ${recipe.cookingTime}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                </svg>
                                ${recipe.cuisine.name}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                                </svg>
                                ${recipe.servingSize}
                            </span>
                            <span class="difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}">
                                ${recipe.difficulty}
                            </span>
                        </div>
                    </div>
                </a>
            `;
        } else {
            const mealPlan = item as MealPlanData;
            return html`
                <a href=${href} class="item-card">
                    <div class="item-content">
                        <h3>${mealPlan.name}</h3>
                        <p>${mealPlan.purpose}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                ${mealPlan.duration}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                                </svg>
                                ${mealPlan.recipes.length} recipes
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${mealPlan.mealTypes.join(', ')}
                            </span>
                        </div>
                    </div>
                </a>
            `;
        }
    }

    render() {
        return html`
            <div class="container">
                <div class="hero-section">
                    <h1>Welcome to RecipeBook</h1>
                    <p>Discover amazing recipes and create perfect meal plans for your culinary journey!</p>
                </div>

                <div class="view-toggle">
                    <div class="toggle-indicator ${this.viewMode}"></div>
                    <button
                            class="toggle-button ${this.viewMode === 'recipes' ? 'active' : ''}"
                            @click=${() => this.handleViewToggle('recipes')}
                    >
                        Recipes
                    </button>
                    <button
                            class="toggle-button ${this.viewMode === 'mealplans' ? 'active' : ''}"
                            @click=${() => this.handleViewToggle('mealplans')}
                    >
                        Meal Plans
                    </button>
                </div>

                <div class="content-section">
                    ${this.renderContent()}
                </div>
            </div>
        `;
    }
}