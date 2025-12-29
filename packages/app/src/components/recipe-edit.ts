import {css, html, TemplateResult} from "lit";
import {property, state} from "lit/decorators.js";
import {Auth, define, Form, History, Observer, View} from "@calpoly/mustang";
import {globalStyles} from "../styles/globalStyles.css";
import {Msg} from "../messages";
import {Model} from "../model";
import {CuisineData, MealPlanData, RecipeData} from "../types/models.ts";

export class RecipeEditElement extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element,
    });

    @property({attribute: "recipe-id"})
    recipeId?: string;

    _authObserver = new Observer<Auth.Model>(this, 'recipebook:auth');

    @state()
    private currentUserId?: string;

    @state()
    private isFormPopulated = false;

    @state()
    private formData = {
        name: "",
        description: "",
        cookingTime: "",
        servingSize: "",
        difficulty: "Easy",
        cuisineId: "",
        ingredients: [{name: "", quantity: "", unit: "cups"}] as Array<{
            name: string;
            quantity: string;
            unit: string
        }>,
        mealPlanIds: [] as string[],
        steps: [""]
    };

    @state()
    private errors: string[] = [];

    @state()
    private isSubmitting = false;

    @state()
    get recipe(): RecipeData | undefined {
        return this.model.recipe;
    }

    constructor() {
        super("recipebook:model");
    }

    get cuisines(): CuisineData[] {
        return this.model.cuisines || [];
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
            name === "recipe-id" &&
            oldValue !== newValue &&
            newValue
        ) {
            console.log("Loading recipe for editing:", newValue);
            this.isFormPopulated = false;
            this.dispatchMessage([
                "recipe/load",
                {recipeId: newValue}
            ]);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up auth observer to get current user
        this._authObserver.observe((authModel: Auth.Model) => {
            const {user} = authModel;
            if (user && user.authenticated) {
                this.currentUserId = user.username;
            } else {
                this.currentUserId = undefined;
            }
            this.requestUpdate();
        });

        this.dispatchMessage(["cuisines/load", {}]);
        this.dispatchMessage(["mealplans/load", {}]);

        // Load recipe if recipeId is already set (fallback)
        if (this.recipeId) {
            this.dispatchMessage([
                "recipe/load",
                {recipeId: this.recipeId}
            ]);
        }
    }

    updated(changedProperties: Map<string, unknown>) {
        super.updated(changedProperties);

        // When recipe loads, check ownership and populate form
        if (this.recipe && !this.isFormPopulated) {
            // Silent authorization check - redirect without error if not owner
            // Extract username from chef href (e.g., "/app/chef/abel" -> "abel")
            const chefUsername = this.recipe.chef.href.split('/').pop();
            if (chefUsername !== this.currentUserId) {
                History.dispatch(this, "history/navigate", {
                    href: `/app/recipe/${this.recipeId}`
                });
                return;
            }

            // User owns the recipe, populate the form
            this.populateFormFromRecipe();
            this.isFormPopulated = true;
        }
    }

    private populateFormFromRecipe() {
        if (!this.recipe) return;

        // Extract cuisineId from href
        const cuisineId = this.recipe.cuisine.href.split('/').pop() || '';

        // Extract mealPlanIds from hrefs
        const mealPlanIds = this.recipe.mealPlans.map(mp => mp.href.split('/').pop() || '');

        this.formData = {
            name: this.recipe.name,
            description: this.recipe.description,
            cookingTime: this.recipe.cookingTime,
            servingSize: this.recipe.servingSize,
            difficulty: this.recipe.difficulty,
            cuisineId: cuisineId,
            ingredients: this.recipe.ingredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit
            })),
            mealPlanIds: mealPlanIds,
            steps: this.recipe.steps
        };
    }

    private generateIdName(name: string): string {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    private handleInputChange(field: string, value: string) {
        this.formData = {...this.formData, [field]: value};
    }

    private handleMultiSelectChange(field: 'mealPlanIds', value: string, checked: boolean) {
        const currentValues = [...this.formData[field]];
        if (checked && !currentValues.includes(value)) {
            currentValues.push(value);
        } else if (!checked) {
            const index = currentValues.indexOf(value);
            if (index > -1) currentValues.splice(index, 1);
        }
        this.formData = {...this.formData, [field]: currentValues};
    }

    private addIngredient() {
        this.formData = {
            ...this.formData,
            ingredients: [...this.formData.ingredients, {name: "", quantity: "", unit: "cups"}]
        };
    }

    private removeIngredient(index: number) {
        const ingredients = [...this.formData.ingredients];
        ingredients.splice(index, 1);
        this.formData = {...this.formData, ingredients};
    }

    private handleIngredientChange(index: number, field: 'name' | 'quantity' | 'unit', value: string) {
        const ingredients = [...this.formData.ingredients];
        ingredients[index] = {...ingredients[index], [field]: value};
        this.formData = {...this.formData, ingredients};
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
            this.formData = {...this.formData, steps};
        }
    }

    private handleStepChange(index: number, value: string) {
        const steps = [...this.formData.steps];
        steps[index] = value;
        this.formData = {...this.formData, steps};
    }

    private validateForm(): boolean {
        const errors: string[] = [];

        if (!this.formData.name.trim()) errors.push("Recipe name is required");
        if (!this.formData.description.trim()) errors.push("Description is required");
        if (!this.formData.cookingTime.trim()) errors.push("Cooking time is required");
        if (!this.formData.servingSize.trim()) errors.push("Serving size is required");
        if (!this.recipeId) errors.push("Recipe ID is required");
        if (!this.recipe) errors.push("Recipe not found");
        if (!this.formData.cuisineId) errors.push("Cuisine selection is required");
        if (this.formData.ingredients.length === 0) errors.push("At least one ingredient is required");
        if (this.formData.ingredients.some(ing => !ing.name.trim() || !ing.quantity.trim())) {
            errors.push("All ingredients must have a name and quantity");
        }
        if (this.formData.steps.some(step => !step.trim())) errors.push("All steps must be filled out");

        this.errors = errors;
        return errors.length === 0;
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        if (!this.validateForm() || this.isSubmitting || !this.recipe || !this.recipeId) return;

        this.isSubmitting = true;
        this.errors = [];

        const selectedCuisine = this.cuisines.find(cuisine => cuisine.idName === this.formData.cuisineId);
        const selectedMealPlans = this.mealplans.filter(mealplan =>
            this.formData.mealPlanIds.includes(mealplan.idName)
        );

        const updatedRecipe: RecipeData = {
            idName: this.recipe.idName, // Keep existing idName
            name: this.formData.name,
            description: this.formData.description,
            imageUrl: this.recipe.imageUrl, // Keep existing imageUrl
            cookingTime: this.formData.cookingTime,
            servingSize: this.formData.servingSize,
            difficulty: this.formData.difficulty,
            chef: this.recipe.chef, // Keep existing chef info
            cuisine: {
                name: selectedCuisine?.name || "",
                href: `/app/cuisine/${this.formData.cuisineId}`
            },
            ingredients: this.formData.ingredients.map(ingredient => ({
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit
            })),
            mealPlans: selectedMealPlans.map(mealplan => ({
                name: mealplan.name,
                href: `/app/mealplan/${mealplan.idName}`
            })),
            steps: this.formData.steps.filter(step => step.trim())
        };

        this.dispatchMessage([
            "recipe/update",
            {
                recipeId: this.recipeId,
                recipe: updatedRecipe,
                onSuccess: () => {
                    this.isSubmitting = false;
                    History.dispatch(this, "history/navigate", {
                        href: `/app/recipe/${this.recipeId}`
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
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 var(--spacing-lg) var(--spacing-xl);
            }

            .page-header {
                margin-bottom: var(--spacing-xl, 3rem);
                text-align: center;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            .page-header h1 {
                margin: 0;
                font-size: 2.5rem;
                color: var(--color-text);
                background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            }

            .chef-info {
                display: flex;
                gap: var(--spacing-lg);
            }

            .chef-details {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .chef-info img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--color-accent);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .chef-info h3 {
                margin: 0;
                color: var(--color-primary);
                font-size: 1.5rem;
                font-weight: 600;
            }

            .chef-info p {
                margin: var(--spacing-sm) 0 0 0;
                color: var(--color-text-secondary);
                font-size: 1rem;
            }

            .recipe-form {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xxl, 3rem);
            }

            .form-section {
                background: var(--color-background-card);
                border-radius: 8px;
                border: 1px solid var(--color-border);
                padding: var(--spacing-xl);
            }

            .form-section h2 {
                font-size: 1.5rem;
                color: var(--color-primary);
                font-weight: 600;
            }

            .form-section h3 {
                margin: var(--spacing-md) 0 var(--spacing-md) 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--color-text);
            }

            .form-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--spacing-xxl, 3rem);
            }

            .form-row {
                display: flex;
                gap: var(--spacing-lg);
            }

            .form-row > * {
                flex: 1;
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
                border: 2px solid var(--color-border);
                border-radius: var(--border-radius-md, 8px);
                background: var(--color-background-page);
                color: var(--color-text);
                font-family: var(--font-body);
                font-size: 1rem;
                margin-bottom: var(--spacing-md);
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            input:focus, textarea:focus, select:focus {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
            }

            textarea {
                min-height: 120px;
                resize: vertical;
                line-height: 1.5;
            }

            .section-description {
                color: var(--color-text-secondary);
                font-size: 0.9rem;
                margin: var(--spacing-sm) 0 var(--spacing-md) 0;
            }

            .ingredient-container {
                margin-bottom: var(--spacing-md);
            }

            .ingredient-row {
                display: grid;
                grid-template-columns: 2.5fr 1fr 1.5fr auto;
                gap: var(--spacing-lg);
                align-items: end;
                padding: var(--spacing-lg);
                background: var(--color-background-page);
                border: 2px solid var(--color-border);
                border-radius: var(--border-radius-md, 8px);
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .ingredient-row:hover {
                border-color: var(--color-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .ingredient-field {
                display: flex;
                flex-direction: column;
            }

            .ingredient-field label {
                margin-bottom: var(--spacing-xs);
                font-size: 0.85rem;
            }

            .ingredient-field input,
            .ingredient-field select {
                margin-bottom: 0;
            }

            .ingredient-field-small {
                min-width: 100px;
            }

            .remove-ingredient {
                background: #dc3545;
                color: white;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                transition: background-color 0.2s;
                padding: 0;
                margin-bottom: 0;
            }

            .remove-ingredient:hover {
                background: #c82333;
            }

            .add-ingredient {
                background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
                color: white;
                border: none;
                padding: var(--spacing-md) var(--spacing-xl);
                border-radius: var(--border-radius-md, 8px);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                margin-top: var(--spacing-md);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .add-ingredient:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .add-ingredient:active {
                transform: translateY(0);
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

            .steps-list {
                max-height: 500px;
                overflow-y: auto;
                padding-right: var(--spacing-sm);
                margin-bottom: var(--spacing-md);
            }

            .step-container {
                position: relative;
                margin-bottom: var(--spacing-lg);
                padding: var(--spacing-lg);
                border: 2px solid var(--color-border);
                border-radius: var(--border-radius-md, 8px);
                background: var(--color-background-page);
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .step-container:hover {
                border-color: var(--color-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .step-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-md);
            }

            .step-header h3 {
                margin: 0;
                color: var(--color-primary);
                font-size: 1.2rem;
                font-weight: 600;
            }

            .remove-step {
                background: #dc3545;
                color: white;
                border: none;
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--border-radius-sm);
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.2s, transform 0.2s;
            }

            .remove-step:hover {
                background: #c82333;
                transform: translateY(-1px);
            }

            .add-step {
                background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
                color: white;
                border: none;
                padding: var(--spacing-md) var(--spacing-xl);
                border-radius: var(--border-radius-md, 8px);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                margin-bottom: var(--spacing-lg);
                width: fit-content;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .add-step:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .add-step:active {
                transform: translateY(0);
            }

            .form-actions {
                display: flex;
                gap: var(--spacing-lg);
                justify-content: center;
                padding-top: var(--spacing-xl, 3rem);
                border-top: 2px solid var(--color-border);
            }

            .form-actions button {
                padding: var(--spacing-md) var(--spacing-xxl, 3rem);
                border-radius: var(--border-radius-md, 8px);
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                min-width: 150px;
            }

            .cancel-button {
                border: 2px solid var(--color-border);
                background: var(--color-background-page);
                color: var(--color-text-secondary);
            }

            .cancel-button:hover {
                background: var(--color-background-hover);
                border-color: var(--color-text-secondary);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

            @media (max-width: 900px) {
                .form-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 768px) {
                .container {
                    padding: 0 var(--spacing-md) var(--spacing-lg);
                }

                .page-header h1 {
                    font-size: 2rem;
                }

                .form-row {
                    flex-direction: column;
                }

                .checkbox-grid {
                    grid-template-columns: 1fr;
                }

                .chef-info {
                    flex-direction: column;
                    text-align: center;
                    padding: var(--spacing-lg);
                }

                .ingredient-row {
                    grid-template-columns: 1fr;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md);
                }

                .remove-ingredient {
                    justify-self: flex-end;
                }

                .form-section {
                    padding: var(--spacing-lg);
                }

                .form-actions {
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .form-actions button {
                    width: 100%;
                }
            }
        `
    ];

    render(): TemplateResult {
        this.removeMuFormDefaultStyles();

        if (!this.recipe && this.recipeId) {
            return html`
                <div class="container">
                    <div class="loading">Loading recipe...</div>
                </div>
            `;
        }

        if (!this.recipe) {
            return html`
                <div class="container">
                    <div class="error-message">
                        <p>Recipe not found.</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="page-header">
                    <h1>Edit Recipe</h1>
                    <div class="chef-info">
                        <div class="chef-details">
                            <h3>Author: ${this.recipe.chef.name}</h3>
                            <p>Editing your recipe</p>
                        </div>
                    </div>
                </div>


                ${this.errors.length > 0 ? html`
                    <div class="error-message">
                        ${this.errors.map(error => html`<p>${error}</p>`)}
                    </div>
                ` : ''}

                <div class="recipe-form">
                    <div class="form-section full-width">
                        <h2>Recipe Information</h2>

                        <label>
                            Recipe Name
                            <input
                                    type="text"
                                    .value=${this.formData.name}
                                    @input=${(e: Event) => this.handleInputChange('name', (e.target as HTMLInputElement).value)}
                                    placeholder="Enter recipe name"
                                    required
                            />
                        </label>

                        <label>
                            Description
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
                                Cooking Time
                                <input
                                        type="text"
                                        placeholder="e.g., 30 minutes"
                                        .value=${this.formData.cookingTime}
                                        @input=${(e: Event) => this.handleInputChange('cookingTime', (e.target as HTMLInputElement).value)}
                                        required
                                />
                            </label>

                            <label>
                                Serving Size
                                <input
                                        type="text"
                                        placeholder="e.g., 4 servings"
                                        .value=${this.formData.servingSize}
                                        @input=${(e: Event) => this.handleInputChange('servingSize', (e.target as HTMLInputElement).value)}
                                        required
                                />
                            </label>

                            <label>
                                Difficulty
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

                    <div class="form-grid">
                        <div class="form-section">
                            <h2>Ingredients</h2>
                            <p class="section-description">Add ingredients with their quantities per serving</p>
                            ${this.formData.ingredients.map((ingredient, index) => html`
                                <div class="ingredient-container">
                                    <div class="ingredient-row">
                                        <div class="ingredient-field">
                                            <label>Ingredient Name</label>
                                            <input
                                                    type="text"
                                                    .value=${ingredient.name}
                                                    @input=${(e: Event) => this.handleIngredientChange(index, 'name', (e.target as HTMLInputElement).value)}
                                                    placeholder="e.g., All-purpose flour"
                                                    required
                                            />
                                        </div>
                                        <div class="ingredient-field ingredient-field-small">
                                            <label>Quantity</label>
                                            <input
                                                    type="text"
                                                    .value=${ingredient.quantity}
                                                    @input=${(e: Event) => this.handleIngredientChange(index, 'quantity', (e.target as HTMLInputElement).value)}
                                                    placeholder="e.g., 2"
                                                    required
                                            />
                                        </div>
                                        <div class="ingredient-field ingredient-field-small">
                                            <label>Unit</label>
                                            <select
                                                    .value=${ingredient.unit}
                                                    @change=${(e: Event) => this.handleIngredientChange(index, 'unit', (e.target as HTMLSelectElement).value)}
                                            >
                                                <option value="cups">cups</option>
                                                <option value="tablespoons">tablespoons</option>
                                                <option value="teaspoons">teaspoons</option>
                                                <option value="grams">grams</option>
                                                <option value="ounces">ounces</option>
                                                <option value="pounds">pounds</option>
                                                <option value="milliliters">milliliters</option>
                                                <option value="liters">liters</option>
                                                <option value="pieces">pieces</option>
                                                <option value="cloves">cloves</option>
                                                <option value="pinch">pinch</option>
                                                <option value="to taste">to taste</option>
                                            </select>
                                        </div>
                                        <button
                                                type="button"
                                                class="remove-ingredient"
                                                @click=${() => this.removeIngredient(index)}
                                                title="Remove ingredient"
                                        >×
                                        </button>
                                    </div>
                                </div>
                            `)}
                            <button type="button" class="add-ingredient" @click=${this.addIngredient}>
                                + Add Ingredient
                            </button>
                        </div>

                        <div class="form-section">
                            <h2>Category & Details</h2>

                            <label>
                                Cuisine
                                <select
                                        .value=${this.formData.cuisineId}
                                        @change=${(e: Event) => this.handleInputChange('cuisineId', (e.target as HTMLSelectElement).value)}
                                        required>
                                    <option value="">Select a cuisine</option>
                                    ${this.cuisines.map(cuisine => html`
                                        <option value="${cuisine.idName}">${cuisine.name}</option>
                                    `)}
                                </select>
                            </label>

                            <h3>Meal Plans</h3>
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
                    </div>

                    <div class="form-section">
                        <h2>Cooking Steps</h2>
                        <div class="steps-list">
                            ${this.formData.steps.map((step, index) => html`
                                <div class="step-container">
                                    <div class="step-header">
                                        <h3>Step ${index + 1}</h3>
                                        ${this.formData.steps.length > 1 ? html`
                                            <button type="button" class="remove-step"
                                                    @click=${() => this.removeStep(index)}>
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
                        </div>
                        <button type="button" class="add-step" @click=${this.addStep}>
                            Add Another Step
                        </button>
                    </div>

                    <div class="form-actions">
                        <button
                                type="button"
                                class="cancel-button"
                                @click=${() => History.dispatch(this, "history/navigate", {href: "/app"})}
                        >
                            Cancel
                        </button>
                        <button
                                type="button"
                                @click=${this.handleSubmit}
                                .disabled=${this.isSubmitting}
                        >
                            ${this.isSubmitting ? 'Updating Recipe...' : 'Update Recipe'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}