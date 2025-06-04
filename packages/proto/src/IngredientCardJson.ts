import {css, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';
import reset from './styles/styles.css.ts';
import {Auth, Observer} from '@calpoly/mustang';

interface NutritionItem {
    label: string;
    value: string;
}

interface RecipeItem {
    name: string;
    href: string;
}

interface IngredientData {
    name: string;
    imageUrl: string;
    category: string;
    allergens: string;
    substitutes: string;
    nutrition: NutritionItem[];
    recipes: RecipeItem[];
}

interface IngredientCollection {
    ingredients: IngredientData[];
}

export class IngredientCardJson extends LitElement {
    @property() src = '';
    @property() name = '';
    @state() ingredients: IngredientData[] = [];
    @state() currentIngredient: IngredientData | null = null;



    _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
    _user?: Auth.User;

    get authorization(): { Authorization?: string } {
        if (this._user && this._user.authenticated)
            return {
                Authorization:
                    `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
            };
        else return {};
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            this._user = auth.user;
            if (this._user?.authenticated) {
                this.loadData();
            }
        });
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('src') || changedProperties.has('name')) {
            this.loadData();
        }
    }

    async loadData() {
        if (!this.src) return;

        try {
            const res = await fetch(this.src, { headers: this.authorization });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const contentType = res.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new Error('Invalid content type - expected JSON');
            }

            const data: IngredientCollection = await res.json();
            this.ingredients = data.ingredients;
            this.currentIngredient = this.ingredients.find(
                i => i.name.toLowerCase() === this.name.toLowerCase()
            ) || null;

            if (!this.currentIngredient) {
                console.warn(`Ingredient "${this.name}" not found in data`);
            }
        } catch (err) {
            console.error('Failed to load ingredient data:', err);
            this.currentIngredient = null;
        }
    }

    static styles = [
        reset.styles,
        css`
            :host {
                display: block;
                background: var(--color-background-page);
                padding: var(--spacing-lg);
                margin: var(--spacing-md) 0;
            }

            .card-content {
                display: grid;
                grid-template-columns: 200px 1fr;
                align-items: start;
            }

            img {
                width: 100%;
                height: auto;
                border-radius: var(--border-radius-sm);
                padding-right: var(--spacing-lg);
            }


            h1 {
                font-family: "Lora", serif;;
                color: var(--color-accent);
                margin-left: 1rem;
                margin-bottom: var(--spacing-sm);
            }

            .meta-section {
                padding: var(--spacing-sm) 0;
            }

            .meta-section strong {
                font-size: 1.2rem;
                color: var(--color-accent);
                margin-right: var(--spacing-xs);
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .Nutrition {
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                margin-top: var(--spacing-xs);
            }

            .Nutrition li {
                display: flex;
                justify-content: space-between;
                padding: var(--spacing-xs) 0;
                border-bottom: 1px solid var(--color-grid);
                margin-bottom: 0.25rem;
            }

            .Nutrition li:last-child {
                border-bottom: none;
            }

            a {
                color: var(--color-link);
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }

            .recipes {
                font-family: "Lora", serif;;
                color: var(--color-accent);

                li {
                    margin-left: var(--spacing-md);
                }
            }
        `
    ];

    render() {
        if (!this._user?.authenticated) {
            return html`
                <div class="loading">Please log in to view ingredient information</div>`;
        }

        if (!this.currentIngredient) {
            return html`
                <div class="loading">${this.ingredients.length ? 'Ingredient not found' : 'Loading...'}</div>`;
        }

        return html`
            <h1>${this.currentIngredient.name}</h1>
            <div class="card-content">
                <img src="${this.currentIngredient.imageUrl}" alt="${this.currentIngredient.name}">
                <div class="details">
                    <div class="meta-section">
                        <strong>Category:</strong>
                        <span>${this.currentIngredient.category}</span>
                    </div>
                    <div class="meta-section">
                        <strong>Allergen Information:</strong>
                        <span>${this.currentIngredient.allergens}</span>
                    </div>
                    <div class="meta-section">
                        <strong>Possible Substitutes:</strong>
                        <span>${this.currentIngredient.substitutes}</span>
                    </div>
                    <div class="meta-section">
                        <strong>Nutritional Information:</strong>
                        <ul class="Nutrition">
                            ${this.currentIngredient.nutrition.map(item => html`
                                <li>${item.label}: ${item.value}</li>
                            `)}
                        </ul>
                    </div>
                </div>
                <div class="recipes">
                    <h2>Used In Recipes:</h2>
                    <ul>
                        ${this.currentIngredient.recipes.map(recipe => html`
                            <li><a href="${recipe.href}">${recipe.name}</a></li>`)}
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('ingredient-info', IngredientCardJson);