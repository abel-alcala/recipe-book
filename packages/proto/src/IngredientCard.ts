import {css, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import reset from './styles/styles.css.ts';

export class IngredientCard extends LitElement {
    @property() name = '';
    @property({attribute: 'image-url'}) imageUrl = '';

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
            }

            .details {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
                margin-left: var(--spacing-xl);
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
                color: var(--color-accent);
                margin-right: var(--spacing-xs);
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .Nutrition li {
                margin-bottom: 0.25rem;
            }

            a {
                color: var(--color-link);
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        `
    ];

    render() {
        return html`
            <h1>${this.name}</h1>
            <div class="card-content">
                <img src="${this.imageUrl}" alt="${this.name}">
                <div class="details">
                    <div class="meta-section">
                        <strong>Category:</strong>
                        <slot name="category"></slot>
                    </div>

                    <div class="meta-section">
                        <strong>Allergen Information:</strong>
                        <slot name="allergens"></slot>
                    </div>

                    <div class="meta-section">
                        <strong>Possible Substitutes:</strong>
                        <slot name="substitutes"></slot>
                    </div>

                    <div class="meta-section">
                        <strong>Nutritional Information:</strong>
                        <ul class="Nutrition">
                            <slot name="nutrition"></slot>
                        </ul>
                    </div>
                </div>
                <div>
                    <h2>Used In Recipes:</h2>
                    <ul>
                        <slot name="recipes"></slot>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('ingredient-card', IngredientCard);
