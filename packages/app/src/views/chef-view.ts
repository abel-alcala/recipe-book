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
                flex-direction: column;
                padding: var(--spacing-xl) 0 0;
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


            .username {
                font-size: 1.5rem;
                font-weight: 400;
                color: var(--color-text);
                margin: 0;
            }

            .stats {
                display: flex;
                margin-top: var(--spacing-sm);
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
                border-top: 1px solid var(--color-border);
                padding-top: var(--spacing-lg);
                margin-top: var(--spacing-lg);
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

            /* Profile Main - Image + Info Wrapper */
            .profile-main {
                display: flex;
                gap: var(--spacing-lg);
                align-items: flex-start;
            }

            .profile-info-compact {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-content: space-evenly;
            }

            .profile-names{
                display: flex;
                flex-direction: row;
                gap: var(--spacing-xl);
                
            }

            .stats-desktop {
                display: flex;
                flex-direction: column;
            }

            /* Bio Section */
            .bio-section {
                display: flex;
                gap: var(--spacing-lg);
                margin-top: var(--spacing-md);
            }


            .edit-profile-button {
                width: auto;
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-sm);
                color: var(--color-text);
                font-weight: 600;
                font-size: 0.875rem;
                cursor: pointer;
                min-height: 44px;
            }
            
            

            .edit-profile-button:hover {
                background: var(--color-background-hover, var(--color-background-card));
                opacity: 0.9;
            }
            
            .settings-button {
                display: none;
            }


            @media (max-width: 768px) {
                /* Stack profile sections vertically */
                .profile-header {
                    flex-direction: column;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md) 0;
                }

                /* Profile main section (keep horizontal) */
                .profile-main {
                    gap: var(--spacing-md);
                    align-items: flex-start;
                }

                
                .profile-image img {
                    width: 110px;
                    height: 110px;
                }

                .profile-info-compact {
                    gap: 2px;
                }

                .username {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }

                .full-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin: 0;
                }

                /* Bio section */
                .bio-section {
                    margin-top: var(--spacing-sm);
                }

                .bio {
                    font-size: 0.875rem;
                    line-height: 1.4;
                }
                
                .action-buttons {
                    display: none;
                    margin-top: var(--spacing-sm);
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

                .highlights-title {
                    font-size: 0.875rem;
                    margin-bottom: var(--spacing-sm);
                }

                .highlight-circle {
                    width: 90px;
                    height: 90px;
                    font-size: 0.65rem;
                }

                .highlight-label {
                    font-size: 0.7rem;
                    max-width: 90px;
                    max-height: 60px;
                    text-wrap: auto;
                }

                /* Container padding */
                .container {
                    padding: var(--spacing-md);
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
                    <!-- Profile Main (Image + Info) -->
                    <div class="profile-main">
                        <div class="profile-image">
                            <img src="${this.chef.imageUrl}" alt="${this.chef.name}">
                        </div>
                        <div class="profile-info-compact">
                            <div class="profile-names">
                                <p class="full-name">${this.chef.name}</p>
                                <h1 class="username">@${this.chefId}</h1>
                                ${this.isOwnProfile ? html`
                        <div class="action-buttons">
                            <button
                                class="edit-profile-button"
                                @click=${() => History.dispatch(this, "history/navigate", {
                                    href: `/app/chef/${this.chefId}/edit`
                                })}
                                title="Edit Profile">
                                Edit profile
                            </button>
                        </div>
                    ` : ''}
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
                            <div class="stats stats-desktop">
                                <span class="stat"><strong>${this.chef.recipes.length}</strong> recipes</span>
                                <div class="bio-section">
                                    <p class="bio">${this.chef.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="highlights-section">
                    <h2 class="highlights-title">Favorite Dishes</h2>
                    <div class="highlights">
                        ${this.chef.favoriteDishes.map(dish => html`
                                <div class="highlight">
                                    <div class="highlight-circle">${dish}</div>
                                    <div class="highlight-label">${dish}</div>
                                </div>
                            `)}
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