import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {Auth, History, Observer, View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {ChefData} from "../types/models.ts";

export class ChefViewElement extends View<Model, Msg> {
    @property({attribute: "chef-id"})
    chefId?: string;

    @state()
    get chef(): ChefData | undefined {
        return this.model.chef;
    }

    @state()
    private currentUserId?: string;

    private _authObserver = new Observer<Auth.Model>(this, 'recipebook:auth');

    constructor() {
        super("recipebook:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((authModel: Auth.Model) => {
            const {user} = authModel;
            if (user && user.authenticated) {
                this.currentUserId = user.username;
            } else {
                this.currentUserId = undefined;
            }
            this.requestUpdate();
        });
    }

    get isOwnProfile(): boolean {
        return this.currentUserId === this.chefId;
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (
            name === "chef-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading chef:", newValue);
            this.dispatchMessage([
                "chef/load",
                {chefId: newValue}
            ]);
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
                max-width: 935px;
                margin: 0 auto;
                padding: var(--spacing-lg);
            }

            /* Profile Header - Instagram style */

            .profile-header {
                display: flex;
                gap: var(--spacing-xl);
                padding: var(--spacing-xl) 0;
                border-bottom: 1px solid var(--color-border);
            }

            .profile-image {
                flex-shrink: 0;
            }

            .profile-image img {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid var(--color-border);
            }

            .profile-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }

            .profile-info-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-lg);
            }

            .username {
                font-size: 1.5rem;
                font-weight: 400;
                color: var(--color-text);
                margin: 0;
            }

            .settings-button {
                background: none;
                border: none;
                cursor: pointer;
                padding: var(--spacing-xs);
                color: var(--color-text);
                font-size: 1.5rem;
                display: flex;
                align-items: center;
            }

            .settings-button:hover {
                opacity: 0.7;
            }

            .stats {
                display: flex;
                gap: var(--spacing-xl);
            }

            .stat {
                font-size: 1rem;
                color: var(--color-text);
            }

            .stat strong {
                font-weight: 600;
            }

            .full-name {
                font-weight: 800;
                font-size: 1.25rem;
                color: var(--color-text);
                margin: 0;
            }

            .bio {
                color: var(--color-text);
                margin: 0;
                line-height: 1.4;
                white-space: pre-wrap;
            }

            .highlights-title {
                font-size: var(--spacing-md);
                font-weight: 600;
                color: var(--color-text);
                margin: 0 0 var(--spacing-md) 0;
            }

            .highlights {
                display: flex;
                gap: var(--spacing-lg);
                overflow-x: auto;
                padding: var(--spacing-sm) 0;
            }

            .highlight {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-xs);
                flex-shrink: 0;
            }

            .highlight-circle {
                width: 77px;
                height: 77px;
                border-radius: 50%;
                border: 1px solid var(--color-border);
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--color-background-card);
                font-size: 0.7rem;
                color: var(--color-text);
                text-align: center;
                padding: var(--spacing-xs);
            }

            .highlight-label {
                font-size: 0.75rem;
                font-weight: 900;
                color: var(--color-text);
                max-width: 77px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .recipes-section {
                padding-top: var(--spacing-lg);
            }

            .recipes-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 3px;
            }

            .recipe-tile {
                aspect-ratio: 1;
                overflow: hidden;
                position: relative;
            }

            .recipe-tile img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .recipe-tile:hover .recipe-overlay {
                opacity: 1;
            }

            .recipe-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                color: white;
                font-weight: 600;
                text-align: center;
                padding: var(--spacing-sm);
            }

            .no-recipes {
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--spacing-xxl, 3rem);
                color: var(--color-text-secondary);
            }

            @media (max-width: 768px) {
                .profile-header {
                    gap: var(--spacing-lg);
                }

                .profile-image img {
                    width: 77px;
                    height: 77px;
                }

                .username {
                    font-size: 1.2rem;
                }

                .stats {
                    gap: var(--spacing-lg);
                }

                .stat {
                    font-size: 0.9rem;
                }

                .highlight-circle {
                    width: 62px;
                    height: 62px;
                }

                .highlight-label {
                    max-width: 62px;
                }
            }
        `
    ];

    render() {
        if (!this.chef && this.chefId) {
            return html`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `;
        }

        if (!this.chef) {
            return html`
                <div class="container">
                    <div class="loading">Chef not found</div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="profile-header">
                    <div class="profile-image">
                        <img src="${this.chef.imageUrl}" alt="${this.chef.name}">
                    </div>
                    <div class="profile-info">
                        <div class="profile-info-header">
                            <h1 class="username">@${this.chefId}</h1>
                            <div class="stats">
                                <span class="stat"><strong>${this.chef.recipes.length}</strong> recipes</span>
                            </div>
                            ${this.isOwnProfile ? html`
                                <button
                                    class="settings-button"
                                    @click=${() => History.dispatch(this, "history/navigate", {
                                        href: `/app/chef/${this.chefId}/edit`
                                    })}
                                    title="Edit Profile">
                                    ⚙️
                                </button>
                            ` : ''}
                        </div>
                        <p class="full-name">${this.chef.name}</p>
                        <p class="bio">${this.chef.bio}</p>
                    </div>
                    <div class="highlights-section">
                        <h2 class="highlights-title">Favorite Dishes</h2>
                        <div class="highlights">
                            ${this.chef.favoriteDishes.map(dish => html`
                            <div class="highlight">
                                <div class="highlight-circle">${dish}</div>
                            </div>
                        `)}
                        </div>
                    </div>
                </div>

               

                <div class="recipes-section">
                    <div class="recipes-grid">
                        ${this.chef.recipes.length > 0
                            ? this.chef.recipes.map(recipe => html`
                                <a href="${recipe.href}" class="recipe-tile">
                                    <img src="${recipe.imageUrl || `/images/${recipe.href.split('/').pop()}.png`}" alt="${recipe.name}">
                                    <div class="recipe-overlay">${recipe.name}</div>
                                </a>
                            `)
                            : html`<div class="no-recipes">No recipes yet</div>`
                        }
                    </div>
                </div>
            </div>
        `;
    }
}