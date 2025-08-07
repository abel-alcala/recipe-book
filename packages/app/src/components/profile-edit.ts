import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { View, Form, define, History } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css.ts";
import { Msg } from "../messages";
import { Model } from "../model";
import { ChefData } from "../types/models.ts";

export class ChefEditElement extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element,
    });

    @property({ attribute: "chef-id" })
    chefId?: string;

    @state()
    get chef(): ChefData | undefined {
        return this.model.chef;
    }

    @state()
    private errorMessage?: string;

    constructor() {
        super("recipebook:model");
    }

    // modifies all mu-form styling, .form display grid was causing issues
    private removeMuFormDefaultStyles() {
        this.updateComplete.then(() => {
            const muForm = this.shadowRoot?.querySelector('mu-form');
            if (muForm) {
                const shadowRoot = muForm.shadowRoot;
                if (shadowRoot) {
                    const styleElements = shadowRoot.querySelectorAll('style');
                    styleElements.forEach(style => style.remove());
                    const customStyle = document.createElement('style');
                    customStyle.textContent = `
                    button {
                        background: var(--color-primary);
                        color: white;
                        cursor: pointer;
                        transition: opacity 0.2s, background-color 0.2s, border-color 0.2s, color 0.2s;
                        padding: var(--spacing-md) var(--spacing-lg);
                        border-radius: 4px !important;
                        font-size: 1rem;
                        font-weight: 600;
                    }
                   
                    button:hover {
                        background-color: var(--color-primary-dark, #3b82f6);
                        border-color: var(--color-primary-dark, #3b82f6);
                        opacity: 0.9;
                    }
                `;

                    shadowRoot.appendChild(customStyle);
                }
            }
        });
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
            console.log("Loading chef for edit:", newValue);
            this.errorMessage = undefined;
            this.dispatchMessage([
                "chef/load",
                { chefId: newValue }
            ]);
        }
    }

    handleSubmit(event: Form.SubmitEvent<ChefData>) {
        if (!this.chefId) return;

        this.errorMessage = undefined;
        const chefData = event.detail;

        if (chefData.idName !== this.chefId) {
            this.errorMessage = "Mismatch in Chef ID. Cannot save.";
            return;
        }

        this.dispatchMessage([
            "chef/save",
            {
                chefId: this.chefId,
                chef: event.detail,
                onSuccess: () => {
                    History.dispatch(this, "history/navigate", {
                        href: `/app/chef/${this.chefId}`
                    });
                },
                onFailure: (error: Error) => {
                    this.errorMessage = error.message || "Failed to save chef profile";
                    console.error("Failed to save chef:", error);
                }
            }
        ]);
    }

    private addFavoriteDish() {
        if (!this.chef) return;

        const updatedChef = {
            ...this.chef,
            favoriteDishes: [...this.chef.favoriteDishes, ""]
        };

        this.dispatchMessage([
            "chef/save",
            {
                chefId: this.chefId!,
                chef: updatedChef,
                onSuccess: () => {},
                onFailure: (error) => console.error("Failed to add dish:", error)
            }
        ]);
    }

    private removeFavoriteDish(index: number) {
        if (!this.chef) return;

        const updatedDishes = this.chef.favoriteDishes.filter((_, i) => i !== index);
        const updatedChef = {
            ...this.chef,
            favoriteDishes: updatedDishes
        };

        this.dispatchMessage([
            "chef/save",
            {
                chefId: this.chefId!,
                chef: updatedChef,
                onSuccess: () => {},
                onFailure: (error) => console.error("Failed to remove dish:", error)
            }
        ]);
    }

    static styles = [
        globalStyles,
        css`
            :host {
                display: block;
                padding: var(--spacing-lg);
                background: var(--color-background-page);
                min-height: 100vh;
                font-family: var(--font-body);
                color: var(--color-text);
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                padding-bottom: var(--spacing-xl);
            }

            .page-header {
                margin-bottom: var(--spacing-xl);
                padding-bottom: var(--spacing-md);
                border-bottom: 1px solid var(--color-border);
            }

            .page-header h1 {
                margin: 0;
                font-size: 2rem;
                color: var(--color-text);
            }

            .info-sections {
                display: flex;
                gap: var(--spacing-xl);
                flex-wrap: wrap;
            }

            .info-sections .form-section {
                flex: 1;
                min-width: 300px;
            }

            .form-section {
                margin-bottom: var(--spacing-xl);
            }

            .basic-info {
                flex: 1.2;
            }

            .favorite-dishes {
                flex: 1;
            }

            .form-section h2 {
                margin-top: 0;
                font-size: 1.4rem;
                color: var(--color-primary);
                padding-bottom: var(--spacing-sm);
                border-bottom: 1px solid var(--color-border);
            }

            label {
                display: block;
                margin-bottom: var(--spacing-sm);
                font-weight: 600;
                font-size: 0.95rem;
                color: var(--color-text);
            }

            input[type="text"],
            input[type="url"],
            textarea {
                width: 100%;
                padding: var(--spacing-md);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-sm);
                background: var(--color-background-page);
                color: var(--color-text);
                font-family: var(--font-body);
                font-size: 1rem;
                margin-bottom: var(--spacing-lg);
            }

            input[type="text"]:focus,
            input[type="url"]:focus,
            textarea:focus {
                outline: none;
                border-color: var(--color-primary);
            }

            textarea {
                min-height: 120px;
                resize: vertical;
            }

            input[readonly] {
                background-color: var(--color-background-muted, #f0f0f0);
                color: var(--color-text-secondary);
                cursor: default;
                border-style: dashed;
            }

            .list-item {
                display: flex;
                gap: var(--spacing-md);
                align-items: center;
                margin-bottom: var(--spacing-md);
                padding: var(--spacing-sm);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-sm);
                background-color: rgba(0,0,0,0.02);
            }

            .list-item input {
                flex: 1;
                margin-bottom: 0;
            }

            .list-item button {
                padding: var(--spacing-xs) var(--spacing-sm);
                background: var(--color-error);
                color: white;
                border: none;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                font-size: 0.9rem;
            }

            .add-button {
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                margin-left: 4rem;
            }

            .form-actions {
                display: flex;
                gap: var(--spacing-md);
                justify-content: flex-end;
                margin-top: var(--spacing-xl);
                padding-top: var(--spacing-lg);
                border-top: 1px solid var(--color-border);
            }

            .cancel-button {
                padding: var(--spacing-md) var(--spacing-lg);
                border: 2px outset buttonborder;
                border-radius: 0;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                background: var(--color-background-page);
                color: var(--color-text-secondary);
                margin-right: var(--spacing-xs);
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                font-size: 1.2rem;
                color: var(--color-text-secondary);
            }

            .error-message {
                background-color: var(--color-error-light);
                color: var(--color-error);
                padding: var(--spacing-md);
                border-radius: var(--border-radius-sm);
                margin-bottom: var(--spacing-lg);
                border: 1px solid var(--color-error);
                text-align: center;
            }

            .helper-text {
                font-size: 0.9rem;
                color: var(--color-text-secondary);
                font-style: italic;
                margin-top: var(--spacing-xs);
                margin-bottom: var(--spacing-md);
            }

            @media (max-width: 768px) {
                .cancel-button {
                    width: 100%;
                }
                .page-header h1 {
                    font-size: 1.6rem;
                }
                .form-section h2 {
                    font-size: 1.2rem;
                }
            }
        `
    ];

    render() {
        this.removeMuFormDefaultStyles();

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
                    <div class="error-message">Chef profile not found</div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="page-header">
                    <h1>Edit Chef Profile</h1>
                </div>

                ${this.errorMessage ? html`
                    <div class="error-message">${this.errorMessage}</div>
                ` : ''}

                <mu-form
                    .init=${this.chef}
                    @mu-form:submit=${this.handleSubmit}>

                    <div class="info-sections">
                        <div class="form-section basic-info">
                            <h2>Basic Information</h2>
                            <label for="name">Name</label>
                            <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                            />

                            <label for="bio">Biography</label>
                            <textarea
                                    id="bio"
                                    name="bio"
                                    required
                            ></textarea>
                        </div>

                        <div class="form-section favorite-dishes">
                            <h2>Favorite Dishes
                                <button
                                        type="button"
                                        class="add-button"
                                        @click=${this.addFavoriteDish}>
                                    Add Favorite Dish
                                </button>
                            </h2>
                            <div id="favorite-dishes-container">
                                ${this.chef.favoriteDishes.map((dish, index) => html`
                                    <div class="list-item">
                                        <input
                                                type="text"
                                                name="favoriteDishes[${index}]"
                                                value="${dish}"
                                                placeholder="Dish name"
                                                required
                                        />
                                        <button
                                                type="button"
                                                @click=${() => this.removeFavoriteDish(index)}>
                                            Remove
                                        </button>
                                    </div>
                                `)}
                            </div>
                        </div>
                    </div>
                    <button
                            type="button"
                            class="cancel-button"
                            @click=${() => History.dispatch(this, "history/navigate", {
                                href: `/app/chef/${this.chefId}`
                            })}>
                        Cancel
                    </button>
                    <input type="hidden" name="idName" value="${this.chef.idName}" />
                </mu-form>
            </div>
        `;
    }
}