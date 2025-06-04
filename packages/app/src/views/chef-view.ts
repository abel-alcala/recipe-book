import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css.ts";
import {Msg} from "../messages";
import {Model} from "../model";
import {ChefData} from "server/models";

export class ChefViewElement extends View<Model, Msg> {
    @property({attribute: "chef-id"})
    chefId?: string;

    @state()
    get chef(): ChefData | undefined {
        return this.model.chef;
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

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `
    ];

    render() {
        this.model.chef
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