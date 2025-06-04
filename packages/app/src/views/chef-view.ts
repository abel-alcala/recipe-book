import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css.ts";

interface Chef {
    name: string;
    bio: string;
    imageUrl: string;
    favoriteDishes: string[];
    recipes: { name: string; href: string }[];
}

export class ChefViewElement extends LitElement {
    @property({ attribute: "chef-id" })
    chefId?: string;

    @state()
    chef?: Chef;

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
                this.loadChef();
            }
        });
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('chefId') && this._user?.authenticated) {
            this.loadChef();
        }
    }

    async loadChef() {
        if (!this.chefId) return;

        this.loading = true;
        try {
            const res = await fetch(`/api/chefs/${this.chefId}`, {
                headers: this.authorization
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            this.chef = await res.json();
        } catch (err) {
            console.error('Failed to load chef:', err);
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

            .chef-image {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                margin: 0 auto var(--spacing-lg);
                overflow: hidden;
            }

            .chef-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .bio {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: var(--spacing-xl);
                color: var(--color-text);
            }

            .section {
                margin-top: var(--spacing-xl);
                text-align: left;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            li {
                margin-bottom: var(--spacing-sm);
                padding: var(--spacing-xs);
                color: var(--color-text);
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
                    <div class="loading">Please log in to view chef profiles</div>
                </div>
            `;
        }

        if (this.loading) {
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
                <div class="chef-profile">
                    <div class="chef-image">
                        <img src="${this.chef.imageUrl}" alt="${this.chef.name}">
                    </div>
                    <h1>${this.chef.name}</h1>
                    <p class="bio">${this.chef.bio}</p>

                    <div class="section">
                        <h2>Favorite Dishes</h2>
                        <ul>
                            ${this.chef.favoriteDishes.map(dish => html`
                                <li>${dish}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Recipes by ${this.chef.name}</h2>
                        <ul>
                            ${this.chef.recipes.map(recipe => html`
                                <li><a href="${recipe.href}">${recipe.name}</a></li>
                            `)}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}