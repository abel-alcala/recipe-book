import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css.ts";

interface MealPlan {
    name: string;
    duration: string;
    purpose: string;
    mealTypes: string[];
    recipes: {
        name: string;
        href: string;
        day?: string;
        mealType?: string
    }[];
}

export class MealPlanViewElement extends LitElement {
    @property({ attribute: "mealplan-id" })
    mealplanId?: string;

    @state()
    mealplan?: MealPlan;

    @state()
    loading = true;

    _authObserver = new Observer<Auth.Model>(this, "recipebook:auth");
    _user?: Auth.User;

    get authorization(): { Authorization?: string } {
        if (this._user && this._user.authenticated)
            return {
                Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
            };
        else return {};
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            this._user = auth.user;
            if (this._user?.authenticated) {
                this.loadMealPlan();
            }
        });
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('mealplanId') && this._user?.authenticated) {
            this.loadMealPlan();
        }
    }

    async loadMealPlan() {
        if (!this.mealplanId) return;

        this.loading = true;
        try {
            const res = await fetch(`/api/mealplans/${this.mealplanId}`, {
                headers: this.authorization
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            this.mealplan = await res.json();
        } catch (err) {
            console.error('Failed to load meal plan:', err);
        } finally {
            this.loading = false;
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
        `
    ];

    render() {
        if (!this._user?.authenticated) {
            return html`
                <div class="container">
                    <div class="loading">Please log in to view meal plans</div>
                </div>
            `;
        }

        if (this.loading) {
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