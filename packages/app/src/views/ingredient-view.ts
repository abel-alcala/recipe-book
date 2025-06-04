import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css.ts";

interface Ingredient {
    name: string;
    description: string;
    nutritionalInfo?: {
        calories?: number;
        protein?: string;
        carbs?: string;
        fat?: string;
    };
    storageInstructions?: string;
    recipesUsing?: { name: string; href: string }[];
}

export class IngredientViewElement extends LitElement {
    @property({ attribute: "ingredient-id" })
    ingredientId?: string;

    @state()
    ingredient?: Ingredient;

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
                this.loadIngredient();
            }
        });
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('ingredientId') && this._user?.authenticated) {
            this.loadIngredient();
        }
    }

    async loadIngredient() {
        if (!this.ingredientId) return;

        this.loading = true;
        try {
            const res = await fetch(`/api/ingredients/${this.ingredientId}`, {
                headers: this.authorization
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            this.ingredient = await res.json();
        } catch (err) {
            console.error('Failed to load ingredient:', err);
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
        `
    ];

    render() {
        if (!this._user?.authenticated) {
            return html`
                <div class="container">
                    <div class="loading">Please log in to view ingredient information</div>
                </div>
            `;
        }

        if (this.loading) {
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
                    <p class="description">${this.ingredient.description}</p>

                    ${this.ingredient.nutritionalInfo ? html`
                        <div class="section">
                            <h2>Nutritional Information (per serving)</h2>
                            <div class="nutrition-grid">
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.calories}</div>
                                    <div class="nutrition-label">Calories</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.protein}</div>
                                    <div class="nutrition-label">Protein</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.carbs}</div>
                                    <div class="nutrition-label">Carbs</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.fat}</div>
                                    <div class="nutrition-label">Fat</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    ${this.ingredient.storageInstructions ? html`
                        <div class="section">
                            <h2>Storage Instructions</h2>
                            <p>${this.ingredient.storageInstructions}</p>
                        </div>
                    ` : ''}

                    ${this.ingredient.recipesUsing && this.ingredient.recipesUsing.length > 0 ? html`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipesUsing.map(recipe => html`
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