import { css, html, TemplateResult } from "lit";
import { state, property } from "lit/decorators.js";
import { View, Form, define, History, Auth, Observer } from "@calpoly/mustang";
import { globalStyles } from "../styles/globalStyles.css";
import { Msg } from "../messages";
import { Model } from "../model";
import { ChefData, CuisineData, IngredientData, MealPlanData, RecipeData } from "../types/models.ts";

export class RecipeCreateElement extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element,
    });

    @property({ attribute: "user-id" })
    userId?: string;

    _authObserver = new Observer<Auth.Model>(this, 'recipebook:auth');

    @state()
    private formData = {
        name: "",
        description: "",
        cookingTime: "",
        servingSize: "",
        difficulty: "Easy",
        cuisineId: "",
        ingredientIds: [] as string[],
        mealPlanIds: [] as string[],
        steps: [""]
    };

    @state()
    private errors: string[] = [];

    @state()
    private isSubmitting = false;

    @state()
    get chef(): ChefData | undefined {
        return this.model.chef;
    }

    constructor() {
        super("recipebook:model");
    }

    get cuisines(): CuisineData[] {
        return this.model.cuisines || [];
    }

    get ingredients(): IngredientData[] {
        return this.model.ingredients || [];
    }

    get mealplans(): MealPlanData[] {
        return this.model.mealplans || [];
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (
            name === "user-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading chef for recipe creation:", newValue);
            this.dispatchMessage([
                "chef/load",
                { chefId: newValue }
            ]);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up auth observer to automatically get userId
        this._authObserver.observe((authModel: Auth.Model) => {
            const { user } = authModel;
            if (user && user.authenticated) {
                // Automatically set userId from authenticated user
                if (this.userId !== user.username) {
                    this.userId = user.username;
                    console.log("Auto-loaded userId from auth:", this.userId);
                    // Load chef data when userId is set
                    this.dispatchMessage([
                        "chef/load",
                        { chefId: this.userId }
                    ]);
                }
            } else {
                this.userId = undefined;
            }
            this.requestUpdate();
        });

        this.dispatchMessage(["cuisines/load", {}]);
        this.dispatchMessage(["ingredients/load", {}]);
        this.dispatchMessage(["mealplans/load", {}]);

        // Load chef if userId is already set (fallback)
        if (this.userId) {
            this.dispatchMessage([
                "chef/load",
                { chefId: this.userId }
            ]);
        }
    }

    private generateIdName(name: string): string {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    private handleInputChange(field: string, value: string) {
        this.formData = { ...this.formData, [field]: value };
    }

    private handleMultiSelectChange(field: 'ingredientIds' | 'mealPlanIds', value: string, checked: boolean) {
        const currentValues = [...this.formData[field]];
        if (checked && !currentValues.includes(value)) {
            currentValues.push(value);
        } else if (!checked) {
            const index = currentValues.indexOf(value);
            if (index > -1) currentValues.splice(index, 1);
        }
        this.formData = { ...this.formData, [field]: currentValues };
    }

    private addStep() {
        this.formData = {
            ...this.formData,
            steps: [...this.formData.steps, ""]
        };
    }

    private removeStep(index: number) {
        if (this.formData.steps.length > 1) {
            const steps = [...this.formData.steps];
            steps.splice(index, 1);
            this.formData = { ...this.formData, steps };
        }
    }

    private handleStepChange(index: number, value: string) {
        const steps = [...this.formData.steps];
        steps[index] = value;
        this.formData = { ...this.formData, steps };
    }

    private validateForm(): boolean {
        const errors: string[] = [];

        if (!this.formData.name.trim()) errors.push("Recipe name is required");
        if (!this.formData.description.trim()) errors.push("Description is required");
        if (!this.formData.cookingTime.trim()) errors.push("Cooking time is required");
        if (!this.formData.servingSize.trim()) errors.push("Serving size is required");
        if (!this.userId) errors.push("User ID is required - please ensure you're logged in");
        if (!this.chef) errors.push("Chef profile not found - please ensure you're logged in");
        if (!this.formData.cuisineId) errors.push("Cuisine selection is required");
        if (this.formData.ingredientIds.length === 0) errors.push("At least one ingredient is required");
        if (this.formData.steps.some(step => !step.trim())) errors.push("All steps must be filled out");

        this.errors = errors;
        return errors.length === 0;
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        if (!this.validateForm() || this.isSubmitting) return;

        this.isSubmitting = true;
        this.errors = [];

        const idName = this.generateIdName(this.formData.name);
        const selectedCuisine = this.cuisines.find(cuisine => cuisine.idName === this.formData.cuisineId);
        const selectedIngredients = this.ingredients.filter(ingredient =>
            this.formData.ingredientIds.includes(ingredient.idName)
        );
        const selectedMealPlans = this.mealplans.filter(mealplan =>
            this.formData.mealPlanIds.includes(mealplan.idName)
        );

        const recipe: RecipeData = {
            idName,
            name: this.formData.name,
            description: this.formData.description,
            imageUrl: `images/${idName}.png`,
            cookingTime: this.formData.cookingTime,
            servingSize: this.formData.servingSize,
            difficulty: this.formData.difficulty,
            chef: {
                name: this.chef?.name || "",
                href: `/app/chef/${this.userId}`
            },
            cuisine: {
                name: selectedCuisine?.name || "",
                href: `/app/cuisine/${this.formData.cuisineId}`
            },
            ingredients: selectedIngredients.map(ingredient => ({
                name: ingredient.name,
                href: `/app/ingredient/${ingredient.idName}`
            })),
            mealPlans: selectedMealPlans.map(mealplan => ({
                name: mealplan.name,
                href: `/app/mealplan/${mealplan.idName}`
            })),
            steps: this.formData.steps.filter(step => step.trim())
        };

        this.dispatchMessage([
            "recipe/create",
            {
                recipe,
                onSuccess: () => {
                    this.isSubmitting = false;
                    History.dispatch(this, "history/navigate", {
                        href: `/app/recipe/${idName}`
                    });
                },
                onFailure: (error: Error) => {
                    this.isSubmitting = false;
                    this.errors = [error.message];
                }
            }
        ]);
    }

    // Remove default mu-form styles
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
                            border: none;
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
                max-width: 900px;
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

            .chef-info {
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-lg);
                margin-bottom: var(--spacing-xl);
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
            }

            .chef-info img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
            }

            .chef-info h3 {
                margin: 0;
                color: var(--color-primary);
                font-size: 1.2rem;
            }

            .chef-info p {
                margin: var(--spacing-xs) 0 0 0;
                color: var(--color-text-secondary);
                font-size: 0.9rem;
            }

            .form-section {
                margin-bottom: var(--spacing-xl);
                padding: var(--spacing-lg);
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                border: 1px solid var(--color-border);
            }

            .form-section h2 {
                margin-top: 0;
                font-size: 1.4rem;
                color: var(--color-primary);
                padding-bottom: var(--spacing-sm);
                border-bottom: 1px solid var(--color-border);
            }

            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--spacing-lg);
            }

            label {
                display: block;
                margin-bottom: var(--spacing-sm);
                font-weight: 600;
                font-size: 0.95rem;
                color: var(--color-text);
            }

            input, textarea, select {
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

            input:focus, textarea:focus, select:focus {
                outline: none;
                border-color: var(--color-primary);
            }

            textarea {
                min-height: 120px;
                resize: vertical;
            }

            .checkbox-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: var(--spacing-sm);
                margin-top: var(--spacing-md);
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                margin-bottom: var(--spacing-xs);
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);
                cursor: pointer;
            }

            .checkbox-label:hover {
                background-color: var(--color-background-hover);
            }

            .checkbox-label input[type="checkbox"] {
                width: auto;
                margin: 0;
                cursor: pointer;
            }

            .step-container {
                position: relative;
                margin-bottom: var(--spacing-md);
                padding: var(--spacing-md);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-sm);
                background: var(--color-background-page);
            }

            .step-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-sm);
            }

            .step-header h3 {
                margin: 0;
                color: var(--color-primary);
                font-size: 1.1rem;
            }

            .remove-step {
                background: #dc3545;
                color: white;
                border: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.8rem;
                cursor: pointer;
            }

            .add-step {
                background: var(--color-primary);
                margin-bottom: var(--spacing-lg);
                width: fit-content;
            }

            .form-actions {
                display: flex;
                gap: var(--spacing-md);
                justify-content: flex-end;
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
            }

            .error-message {
                background-color: var(--color-error-light, #f8d7da);
                color: var(--color-error, #721c24);
                padding: var(--spacing-md);
                border-radius: var(--border-radius-sm);
                margin-bottom: var(--spacing-lg);
                border: 1px solid var(--color-error, #721c24);
            }

            .error-message p {
                margin: var(--spacing-xs) 0;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                font-size: 1.2rem;
                color: var(--color-text-secondary);
            }

            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr;
                }

                .checkbox-grid {
                    grid-template-columns: 1fr;
                }

                .chef-info {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `
    ];

    render(): TemplateResult {
        this.removeMuFormDefaultStyles();

        // Show loading if we're waiting for chef data
        if (!this.chef && this.userId) {
            return html`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `;
        }

        // Show error if no chef found
        if (!this.chef) {
            return html`
                <div class="container">
                    <div class="error-message">
                        <p>Chef profile not found. Please ensure you're logged in.</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="page-header">
                    <h1>Create New Recipe</h1>
                </div>

                <div class="chef-info">
                    <img src="${this.chef.imageUrl}" alt="${this.chef.name}" />
                    <div>
                        <h3>Creating as: ${this.chef.name}</h3>
                        <p>This recipe will be attributed to your chef profile</p>
                    </div>
                </div>

                ${this.errors.length > 0 ? html`
                    <div class="error-message">
                        ${this.errors.map(error => html`<p>${error}</p>`)}
                    </div>
                ` : ''}

                <div class="recipe-form">
                    <div class="form-section">
                        <h2>Basic Information</h2>

                        <label>
                            Recipe Name *
                            <input
                                    type="text"
                                    .value=${this.formData.name}
                                    @input=${(e: Event) => this.handleInputChange('name', (e.target as HTMLInputElement).value)}
                                    placeholder="Enter recipe name"
                                    required
                            />
                        </label>

                        <label>
                            Description *
                            <textarea
                                    .value=${this.formData.description}
                                    @input=${(e: Event) => this.handleInputChange('description', (e.target as HTMLTextAreaElement).value)}
                                    placeholder="Describe your recipe..."
                                    rows="4"
                                    required
                            ></textarea>
                        </label>

                        <div class="form-row">
                            <label>
                                Cooking Time *
                                <input
                                        type="text"
                                        placeholder="e.g., 30 minutes"
                                        .value=${this.formData.cookingTime}
                                        @input=${(e: Event) => this.handleInputChange('cookingTime', (e.target as HTMLInputElement).value)}
                                        required
                                />
                            </label>

                            <label>
                                Serving Size *
                                <input
                                        type="text"
                                        placeholder="e.g., 4 servings"
                                        .value=${this.formData.servingSize}
                                        @input=${(e: Event) => this.handleInputChange('servingSize', (e.target as HTMLInputElement).value)}
                                        required
                                />
                            </label>

                            <label>
                                Difficulty *
                                <select
                                        .value=${this.formData.difficulty}
                                        @change=${(e: Event) => this.handleInputChange('difficulty', (e.target as HTMLSelectElement).value)}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Category</h2>

                        <label>
                            Cuisine *
                            <select
                                    .value=${this.formData.cuisineId}
                                    @change=${(e: Event) => this.handleInputChange('cuisineId', (e.target as HTMLSelectElement).value)}
                                    required
                            >
                                <option value="">Select a cuisine</option>
                                ${this.cuisines.map(cuisine => html`
                                    <option value=${cuisine.idName}>${cuisine.name}</option>
                                `)}
                            </select>
                        </label>
                    </div>

                    <div class="form-section">
                        <h2>Ingredients *</h2>
                        <div class="checkbox-grid">
                            ${this.ingredients.map(ingredient => html`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.ingredientIds.includes(ingredient.idName)}
                                            @change=${(e: Event) => this.handleMultiSelectChange('ingredientIds', ingredient.idName, (e.target as HTMLInputElement).checked)}
                                    />
                                    <span>${ingredient.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Meal Plans</h2>
                        <div class="checkbox-grid">
                            ${this.mealplans.map(mealplan => html`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.mealPlanIds.includes(mealplan.idName)}
                                            @change=${(e: Event) => this.handleMultiSelectChange('mealPlanIds', mealplan.idName, (e.target as HTMLInputElement).checked)}
                                    />
                                    <span>${mealplan.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Cooking Steps *</h2>
                        ${this.formData.steps.map((step, index) => html`
                            <div class="step-container">
                                <div class="step-header">
                                    <h3>Step ${index + 1}</h3>
                                    ${this.formData.steps.length > 1 ? html`
                                        <button type="button" class="remove-step" @click=${() => this.removeStep(index)}>
                                            Remove Step
                                        </button>
                                    ` : ''}
                                </div>
                                <textarea
                                        .value=${step}
                                        @input=${(e: Event) => this.handleStepChange(index, (e.target as HTMLTextAreaElement).value)}
                                        placeholder="Describe this cooking step..."
                                        rows="3"
                                        required
                                ></textarea>
                            </div>
                        `)}
                        <button type="button" class="add-step" @click=${this.addStep}>
                            Add Another Step
                        </button>
                    </div>

                    <div class="form-actions">
                        <button
                                type="button"
                                class="cancel-button"
                                @click=${() => History.dispatch(this, "history/navigate", { href: "/app" })}
                        >
                            Cancel
                        </button>
                        <button
                                type="button"
                                @click=${this.handleSubmit}
                                .disabled=${this.isSubmitting}
                        >
                            ${this.isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}