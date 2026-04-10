import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {MealPlanData, RecipeReference} from "../types/models.ts";

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

        if (name === "mealplan-id" && oldValue !== newValue && newValue) {
            this.loading = true;
            this.error = undefined;
            this.dispatchMessage([
                "mealplan/load",
                {
                    mealplanId: newValue,
                    onSuccess: () => { this.loading = false; },
                    onFailure: (err: Error) => {
                        this.loading = false;
                        this.error = err.message;
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

    private validateRecipeHref(href: string): string {
        if (!href) return '#';
        if (href.startsWith('/app/recipe/') || href.startsWith('http')) return href;
        return `/app/recipe/${href}`;
    }

    private groupRecipesByDay(): Map<string, RecipeReference[]> | null {
        const recipes = this.mealplan?.recipes;
        if (!recipes?.length || !recipes.some(r => r.day)) return null;

        const map = new Map<string, RecipeReference[]>();
        for (const recipe of recipes) {
            const key = recipe.day || 'Unscheduled';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(recipe);
        }
        return map;
    }

    private renderRecipeItem(recipe: RecipeReference) {
        return html`
            <a href="${this.validateRecipeHref(recipe.href)}" class="recipe-item">
                <div class="recipe-thumbnail">
                    ${recipe.imageUrl
                        ? html`<img src="${recipe.imageUrl}" alt="${recipe.name}" loading="lazy" />`
                        : html`
                            <div class="thumbnail-placeholder">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                                </svg>
                            </div>
                        `}
                </div>
                <div class="recipe-info">
                    <span class="recipe-name">${recipe.name}</span>
                    ${recipe.mealType ? html`<span class="recipe-type-chip">${recipe.mealType}</span>` : ''}
                </div>
                <span class="view-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                </span>
            </a>
        `;
    }

    private renderGrouped(groups: Map<string, RecipeReference[]>) {
        return html`
            <div class="recipe-groups">
                ${[...groups.entries()].map(([day, recipes]) => html`
                    <div class="day-group">
                        <div class="day-header">
                            <span class="day-label">${day}</span>
                            <span class="day-count">${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="recipe-list">
                            ${recipes.map(r => this.renderRecipeItem(r))}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    private renderRecipes() {
        const recipes = this.mealplan?.recipes;

        if (!recipes?.length) {
            return html`
                <div class="empty-recipes">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                    </svg>
                    <p>No recipes have been added to this plan yet.</p>
                </div>
            `;
        }

        const groups = this.groupRecipesByDay();
        if (groups) return this.renderGrouped(groups);

        return html`
            <div class="recipe-list">
                ${recipes.map(r => this.renderRecipeItem(r))}
            </div>
        `;
    }

    static styles = [
        globalStyles,
        css`
            :host {
                display: block;
                min-height: 100vh;
            }

            /* ── Breadcrumb ───────────────────────────── */
            .breadcrumb {
                display: inline-flex;
                align-items: center;
                gap: var(--spacing-xs);
                color: var(--color-text-muted);
                text-decoration: none;
                font-size: 0.875rem;
                margin-bottom: var(--spacing-xl);
                transition: color 0.2s ease;
            }

            .breadcrumb svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
                flex-shrink: 0;
            }

            .breadcrumb:hover {
                color: var(--color-text);
                text-decoration: none;
            }

            /* ── Plan header ──────────────────────────── */
            .plan-header {
                margin-bottom: var(--spacing-xxl);
            }

            .plan-header h1 {
                margin-bottom: var(--spacing-sm);
            }

            .plan-description {
                font-size: 1.05rem;
                color: var(--color-text);
                line-height: 1.7;
                max-width: 60ch;
                margin-bottom: var(--spacing-lg);
                opacity: 0.85;
            }

            .plan-meta {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                align-items: center;
            }

            .meta-chip {
                display: inline-flex;
                align-items: center;
                gap: var(--spacing-xs);
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
                font-size: 0.875rem;
                color: var(--color-text);
                white-space: nowrap;
            }

            .meta-chip svg {
                width: 14px;
                height: 14px;
                fill: var(--color-accent);
                flex-shrink: 0;
            }

            .meta-chip.type {
                background: var(--color-background-hover);
                border-color: transparent;
                color: var(--color-accent);
            }

            /* ── Recipes section ──────────────────────── */
            .recipes-section {
                margin-top: var(--spacing-lg);
            }

            .recipes-section h2 {
                margin-bottom: var(--spacing-lg);
            }

            /* ── Day groups ───────────────────────────── */
            .recipe-groups {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xl);
            }

            .day-header {
                display: flex;
                align-items: baseline;
                gap: var(--spacing-sm);
                margin-bottom: var(--spacing-sm);
                padding-bottom: var(--spacing-sm);
                border-bottom: 1px solid var(--color-border);
            }

            .day-label {
                font-family: var(--font-display);
                font-size: 1rem;
                font-weight: 600;
                color: var(--color-accent);
            }

            .day-count {
                font-size: 0.8rem;
                color: var(--color-text-muted);
            }

            /* ── Recipe list ──────────────────────────── */
            .recipe-list {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            /* ── Recipe item (full-row link) ──────────── */
            a.recipe-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--border-radius-md);
                text-decoration: none;
                color: var(--color-text);
                border: 1px solid transparent;
                transition: background-color 0.15s ease,
                            border-color 0.15s ease,
                            transform 0.15s ease;
            }

            a.recipe-item:hover {
                background: var(--color-background-card);
                border-color: var(--color-border);
                text-decoration: none;
                transform: translateX(4px);
                color: var(--color-text);
            }

            .recipe-thumbnail {
                width: 52px;
                height: 52px;
                border-radius: var(--border-radius-sm);
                overflow: hidden;
                flex-shrink: 0;
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
            }

            .recipe-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .thumbnail-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .thumbnail-placeholder svg {
                width: 22px;
                height: 22px;
                fill: var(--color-text-muted);
                opacity: 0.4;
            }

            .recipe-info {
                flex: 1;
                min-width: 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
            }

            .recipe-name {
                font-size: 1rem;
                font-weight: 600;
                color: var(--color-text);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .recipe-type-chip {
                font-size: 0.75rem;
                padding: 2px var(--spacing-xs);
                background: var(--color-background-hover);
                border-radius: var(--border-radius-sm);
                color: var(--color-accent);
                white-space: nowrap;
                flex-shrink: 0;
            }

            .view-arrow {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: var(--color-text-muted);
                opacity: 0;
                transition: opacity 0.15s ease, transform 0.15s ease;
            }

            .view-arrow svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }

            a.recipe-item:hover .view-arrow {
                opacity: 1;
                transform: translateX(2px);
            }

            /* ── Empty state ──────────────────────────── */
            .empty-recipes {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: var(--spacing-xxl) var(--spacing-xl);
                gap: var(--spacing-md);
                color: var(--color-text-muted);
                text-align: center;
            }

            .empty-recipes svg {
                width: 44px;
                height: 44px;
                fill: var(--color-border);
            }

            .empty-recipes p {
                margin: 0;
                color: var(--color-text-muted);
            }

            /* ── Loading ──────────────────────────────── */
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
                to { transform: rotate(360deg); }
            }

            .loading-text {
                color: var(--color-text-muted);
                font-size: 1.1rem;
            }

            /* ── Error / not-found states ─────────────── */
            .state-message {
                text-align: center;
                padding: var(--spacing-xxl);
            }

            .state-message h3 {
                color: var(--color-text);
                margin-bottom: var(--spacing-sm);
            }

            .state-message p {
                color: var(--color-text-muted);
                margin-bottom: var(--spacing-lg);
            }

            .error-state h3 {
                color: #ff6b6b;
            }

            .state-back-link {
                display: inline-flex;
                align-items: center;
                gap: var(--spacing-xs);
                color: var(--color-link);
                text-decoration: none;
                font-size: 0.9rem;
                transition: color 0.2s;
            }

            .state-back-link:hover {
                color: var(--color-link-hover);
                text-decoration: underline;
            }

            /* ── Mobile ───────────────────────────────── */
            @media (max-width: 768px) {
                .plan-header h1 {
                    font-size: 1.8rem;
                }

                a.recipe-item {
                    padding: var(--spacing-sm);
                }

                .view-arrow {
                    opacity: 1;
                }

                .recipe-name {
                    white-space: normal;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                a.recipe-item,
                .view-arrow,
                .breadcrumb {
                    transition: none;
                }

                .loading-spinner {
                    animation-duration: 2s;
                }
            }
        `
    ];

    render() {
        if (this.loading) {
            return html`
                <div class="container">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">Loading meal plan…</div>
                    </div>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="container">
                    <div class="state-message error-state">
                        <h3>Couldn't load this meal plan</h3>
                        <p>${this.error}</p>
                        <a href="/app" class="state-back-link">← Back to recipes</a>
                    </div>
                </div>
            `;
        }

        if (!this.mealplan) {
            return html`
                <div class="container">
                    <div class="state-message">
                        <h3>Meal plan not found</h3>
                        <p>The requested meal plan could not be found.</p>
                        <a href="/app" class="state-back-link">← Back to recipes</a>
                    </div>
                </div>
            `;
        }

        const {mealplan} = this;
        const recipeCount = mealplan.recipes?.length || 0;

        return html`
            <div class="container">
                <a href="/app" class="breadcrumb">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    All Recipes
                </a>

                <div class="plan-header">
                    <h1>${mealplan.name}</h1>
                    ${mealplan.purpose ? html`
                        <p class="plan-description">${mealplan.purpose}</p>
                    ` : ''}
                    <div class="plan-meta">
                        <span class="meta-chip">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                            </svg>
                            ${mealplan.duration}
                        </span>
                        <span class="meta-chip">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                            </svg>
                            ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}
                        </span>
                        ${mealplan.mealTypes?.map(type => html`
                            <span class="meta-chip type">${type}</span>
                        `)}
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes</h2>
                    ${this.renderRecipes()}
                </div>
            </div>
        `;
    }
}