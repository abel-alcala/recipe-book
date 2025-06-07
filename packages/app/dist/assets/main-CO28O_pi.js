import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as p,i as l,b as J,O as U,d as P,c as G,x as s,e as K,r as c,V as v,n as f,f as B,h as b,L as Q,_ as Z,s as V}from"./login-form-DKjEykCR.js";const ee={};function re(t,e,r){switch(t[0]){case"chef/load":ie(t[1],r).then(i=>e(o=>({...o,chef:i}))).catch(i=>{console.error("Failed to load chef:",i)});break;case"chef/save":ae(t[1],r).then(i=>e(o=>({...o,chef:i}))).then(()=>{const{onSuccess:i}=t[1];i&&i()}).catch(i=>{console.error("Failed to save chef:",i);const{onFailure:o}=t[1];o&&o(i)});break;case"chefs/load":te(r).then(i=>e(o=>({...o,chefs:i}))).catch(i=>{console.error("Failed to load chefs:",i)});break;case"recipe/load":oe(t[1],r).then(i=>e(o=>({...o,recipe:i}))).catch(i=>{console.error("Failed to load recipe:",i)});break;case"recipe/create":se(t[1],r).then(i=>e(o=>({...o,recipe:i}))).then(()=>{const{onSuccess:i}=t[1];i&&i()}).catch(i=>{console.error("Failed to create recipe:",i);const{onFailure:o}=t[1];o&&o(i)});break;case"recipes/load":ne().then(i=>e(o=>({...o,recipes:i}))).catch(i=>{console.error("Failed to load recipes:",i)});break;case"cuisine/load":ce(t[1],r).then(i=>e(o=>({...o,cuisine:i}))).catch(i=>{console.error("Failed to load cuisine:",i)});break;case"cuisines/load":de(r).then(i=>e(o=>({...o,cuisines:i}))).catch(i=>{console.error("Failed to load cuisines:",i)});break;case"ingredient/load":le(t[1],r).then(i=>e(o=>({...o,ingredient:i}))).catch(i=>{console.error("Failed to load ingredient:",i)});break;case"ingredients/load":pe(r).then(i=>e(o=>({...o,ingredients:i}))).catch(i=>{console.error("Failed to load ingredients:",i)});break;case"mealplan/load":ge(t[1]).then(i=>{e(n=>({...n,mealplan:i}));const{onSuccess:o}=t[1];o&&o()}).catch(i=>{console.error("Failed to load meal plan:",i),e(n=>({...n,mealplan:void 0}));const{onFailure:o}=t[1];o&&o(i)});break;case"mealplans/load":he().then(i=>e(o=>({...o,mealplans:i}))).catch(i=>{console.error("Failed to load meal plans:",i)});break;default:const a=t[0];throw new Error(`Unhandled message "${a}"`)}}function ie(t,e){return fetch(`/api/chefs/${t.chefId}`,{headers:p.headers(e)}).then(r=>{if(r.status===200)return r.json();throw new Error(`Failed to load chef: ${r.status}`)}).then(r=>(console.log("Chef loaded:",r),r))}function ae(t,e){return fetch(`/api/chefs/${t.chefId}`,{method:"PUT",headers:{...p.headers(e),"Content-Type":"application/json"},body:JSON.stringify(t.chef)}).then(r=>{if(r.status===200)return r.json();throw r.status===401?new Error("You are not authorized to edit this chef profile"):r.status===403?new Error("You can only edit your own chef profile"):new Error(`Failed to save chef: ${r.status}`)}).then(r=>(console.log("Chef saved:",r),r))}function te(t){return fetch("/api/chefs",{headers:p.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load chefs: ${e.status}`)}).then(e=>(console.log("Chefs loaded:",e),e))}function oe(t,e){return fetch(`/api/recipes/${t.recipeId}`,{headers:p.headers(e)}).then(r=>{if(r.status===200)return r.json();throw new Error(`Failed to load recipe: ${r.status}`)}).then(r=>(console.log("Recipe loaded:",r),r))}function se(t,e){return fetch("/api/recipes",{method:"POST",headers:{...p.headers(e),"Content-Type":"application/json"},body:JSON.stringify(t.recipe)}).then(r=>{if(r.status===201)return r.json();throw r.status===401?new Error("You are not authorized to create recipes"):new Error(`Failed to create recipe: ${r.status}`)}).then(r=>(console.log("Recipe created:",r),r))}function ne(){return fetch("/api/recipes").then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load recipes: ${t.status}`)}).then(t=>(console.log("Recipes loaded:",t),t))}function ce(t,e){return fetch(`/api/cuisines/${t.cuisineId}`,{headers:p.headers(e)}).then(r=>{if(r.status===200)return r.json();throw new Error(`Failed to load cuisine: ${r.status}`)}).then(r=>(console.log("Cuisine loaded:",r),r))}function de(t){return fetch("/api/cuisines",{headers:p.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load cuisines: ${e.status}`)}).then(e=>(console.log("Cuisines loaded:",e),e))}function le(t,e){return fetch(`/api/ingredients/${t.ingredientId}`,{headers:p.headers(e)}).then(r=>{if(r.status===200)return r.json();throw new Error(`Failed to load ingredient: ${r.status}`)}).then(r=>(console.log("Ingredient loaded:",r),r))}function pe(t){return fetch("/api/ingredients",{headers:p.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load ingredients: ${e.status}`)}).then(e=>(console.log("Ingredients loaded:",e),e))}function ge(t){return fetch(`/api/mealplans/${t.mealplanId}`).then(e=>{if(e.status===200)return e.json();throw e.status===404?new Error(`Meal plan "${t.mealplanId}" not found`):e.status>=500?new Error("Server error while loading meal plan. Please try again later."):new Error(`Failed to load meal plan: ${e.status}`)}).then(e=>{console.log("Meal plan loaded:",e);const r=e;if(!r.name||!r.idName)throw new Error("Invalid meal plan data received from server");return r.recipes||(r.recipes=[]),r.recipes=r.recipes.map(a=>({...a,href:a.href||"#",name:a.name||"Untitled Recipe"})),r}).catch(e=>{throw e instanceof TypeError&&e.message.includes("fetch")?new Error("Network error: Unable to connect to server"):e})}function he(){return fetch("/api/mealplans").then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load meal plans: ${t.status}`)}).then(t=>(console.log("Meal plans loaded:",t),t))}const me=l`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        line-height: 1.5;
    }

    img {
        max-width: 100%;
        display: block;
    }

    ul, ol {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`,ve=l`
    :host {
        display: block;
        background: var(--color-background-page);
        color: var(--color-text);
        font-family: var(--font-body);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-lg);
    }

    .loading {
        text-align: center;
        padding: var(--spacing-xl);
        font-size: 1.2rem;
        color: var(--color-text-muted);
    }

    h1, h2, h3 {
        font-family: var(--font-display);
        line-height: 1.3;
    }

    h1 {
        color: var(--color-primary);
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-lg);
    }

    h2 {
        color: var(--color-accent);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-md);
    }

    h3 {
        color: var(--color-primary);
        font-size: 1.2rem;
        margin-bottom: var(--spacing-sm);
    }

    p {
        color: var(--color-text);
        line-height: 1.6;
        margin-bottom: var(--spacing-md);
    }

    a {
        color: var(--color-link);
        text-decoration: none;
        transition: color 0.2s;
    }

    a:hover {
        color: var(--color-link-hover);
        text-decoration: underline;
    }

    /* Card styles */

    .card, .recipe-card, .chef-profile, section {
        background: var(--color-background-card);
        border: 1px solid var(--color-accent);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    button {
        background-color: var(--color-accent);
        color: white;
        padding: var(--spacing-sm) var(--spacing-lg);
        border: none;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        font-size: 1rem;
        font-family: inherit;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: var(--color-primary);
    }

    button:disabled {
        background-color: var(--color-text-muted);
        cursor: not-allowed;
    }

    label {
        display: block;
        margin-bottom: var(--spacing-md);
        color: var(--color-text);
    }

    label span {
        display: block;
        margin-bottom: var(--spacing-xs);
        font-weight: bold;
        color: var(--color-accent);
    }

    input {
        width: 100%;
        padding: var(--spacing-sm);
        font-size: 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        background: var(--color-background);
        color: var(--color-text);
    }

    .page-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--spacing-lg);
    }

    .full-width {
        grid-column: 1 / -1;
    }

    .main-content {
        grid-column: span 9;
    }

    .sidebar {
        grid-column: span 3;
    }

    @media (max-width: 768px) {
        .page-grid {
            grid-template-columns: 1fr;
        }

        .main-content,
        .sidebar {
            grid-column: 1 / -1;
        }
    }

    .recipe-header {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: var(--spacing-xl);
        margin-bottom: var(--spacing-xl);
        align-items: start;
    }

    .recipe-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--spacing-xl);
    }

    .recipe-meta {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .recipe-meta-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        background-color: rgba(158, 206, 106, 0.1);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
    }

    .icon {
        width: 20px;
        height: 20px;
        fill: var(--color-accent);
    }

    @media (max-width: 768px) {
        .recipe-header,
        .recipe-content {
            grid-template-columns: 1fr;
        }
    }

    .card-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--spacing-lg);
    }

    .recipe-card {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .recipe-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .recipe-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .recipe-card-content {
        padding: var(--spacing-md);
        flex-grow: 1;
    }

    .recipe-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: rgba(158, 206, 106, 0.05);
        border-top: 1px solid var(--color-border);
        color: var(--color-text-muted);
    }

    .chef-profile {
        text-align: center;
    }

    .chef-profile img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 0 auto var(--spacing-md);
        object-fit: cover;
    }

    /* Steps styles */
    .steps-section ol {
        counter-reset: step-counter;
        list-style: none;
    }

    .steps-section li {
        counter-increment: step-counter;
        position: relative;
        padding-left: 3rem;
        margin-bottom: var(--spacing-lg);
        line-height: 1.6;
        color: var(--color-text);
    }

    .steps-section li::before {
        content: counter(step-counter);
        position: absolute;
        left: 0;
        top: 0;
        width: 2rem;
        height: 2rem;
        background: var(--color-accent);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .meta-info {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
    }

    .meta-item {
        color: var(--color-text-muted);
    }

    .meta-item strong {
        color: var(--color-text);
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .tag, .meal-type-tag {
        background: var(--color-background-hover);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.9rem;
        color: var(--color-text);
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-xl);
        margin-bottom: var(--spacing-xl);
    }

    .info-section {
        background: var(--color-background-card);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-lg);
    }

    .nutrition-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-sm);
    }

    .nutrition-item {
        text-align: center;
        padding: var(--spacing-sm);
    }

    .nutrition-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--color-primary);
    }

    .nutrition-label {
        font-size: 0.9rem;
        color: var(--color-text-muted);
    }
`,h=[me,ve];var ue=Object.defineProperty,_=(t,e,r,a)=>{for(var i=void 0,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=n(e,r,i)||i);return i&&ue(e,r,i),i};const I=class I extends J{constructor(){super(...arguments),this._authObserver=new U(this,"recipebook:auth"),this.loggedIn=!1,this.isDarkMode=!0}connectedCallback(){super.connectedCallback(),this._authObserver.observe(r=>{const{user:a}=r;a&&a.authenticated?(this.loggedIn=!0,this.userid=a.username):(this.loggedIn=!1,this.userid=void 0),this.requestUpdate()});const e=localStorage.getItem("darkMode");this.isDarkMode=e===null?!0:e==="true",this.isDarkMode||this.classList.add("light-mode")}firstUpdated(){this._setInitialCheckboxState()}_setInitialCheckboxState(){if(this.shadowRoot){const e=this.shadowRoot.querySelector('input[type="checkbox"]');e&&(e.checked=!this.isDarkMode)}}render(){return s`
            <div class="header-container">
                <div class="logo-container">
                    <a href="/app" class="logo">
                        <svg class="icon">
                            <use href="/icons/icons.svg#utensils"></use>
                        </svg>
                        RecipeBook
                    </a>
                </div>
                <div class="main-nav">
                    <nav class="when-signed-in" >
                        <a href="/app/recipe/create">Add Recipe</a>
                    </nav>
                    <mu-dropdown>
                        <a slot="actuator" >
                            <svg class="icon" id="profile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" xml:space="preserve"><path d="M135.832 140.848h-70.9c-2.9 0-5.6-1.6-7.4-4.5-1.4-2.3-1.4-5.7 0-8.6l4-8.2c2.8-5.6 9.7-9.1 14.9-9.5 1.7-.1 5.1-.8 8.5-1.6 2.5-.6 3.9-1 4.7-1.3-.2-.7-.6-1.5-1.1-2.2-6-4.7-9.6-12.6-9.6-21.1 0-14 9.6-25.3 21.5-25.3s21.5 11.4 21.5 25.3c0 8.5-3.6 16.4-9.6 21.1-.5.7-.9 1.4-1.1 2.1.8.3 2.2.7 4.6 1.3 3 .7 6.6 1.3 8.4 1.5 5.3.5 12.1 3.8 14.9 9.4l3.9 7.9c1.5 3 1.5 6.8 0 9.1-1.6 2.9-4.4 4.6-7.2 4.6zm-35.4-78.2c-9.7 0-17.5 9.6-17.5 21.3 0 7.4 3.1 14.1 8.2 18.1.1.1.3.2.4.4 1.4 1.8 2.2 3.8 2.2 5.9 0 .6-.2 1.2-.7 1.6-.4.3-1.4 1.2-7.2 2.6-2.7.6-6.8 1.4-9.1 1.6-4.1.4-9.6 3.2-11.6 7.3l-3.9 8.2c-.8 1.7-.9 3.7-.2 4.8.8 1.3 2.3 2.6 4 2.6h70.9c1.7 0 3.2-1.3 4-2.6.6-1 .7-3.4-.2-5.2l-3.9-7.9c-2-4-7.5-6.8-11.6-7.2-2-.2-5.8-.8-9-1.6-5.8-1.4-6.8-2.3-7.2-2.5-.4-.4-.7-1-.7-1.6 0-2.1.8-4.1 2.2-5.9.1-.1.2-.3.4-.4 5.1-3.9 8.2-10.7 8.2-18-.2-11.9-8-21.5-17.7-21.5z"/></svg>
                            <span class="greeting">Hello, <span id="userid">${this.userid}</span></span>
                        </a>
                        <menu>
                            <li class="when-signed-in">
                                <a href="/app/chef/${this.userid}">
                                    View Profile
                                </a>
                            </li>
                            <li>
                                <label @change=${this._handleDarkModeToggle}>
                                    <span>Light mode</span>
                                    <span class="switch">
                                        <input
                                                type="checkbox"
                                                autocomplete="on"
                                                ?checked=${!this.isDarkMode}
                                        />
                                        <span class="slider"></span>
                                    </span>
                                </label>
                            </li>
                            <li class="when-signed-in">
                                <a @click=${this._handleSignOut}>Sign Out</a>
                            </li>
                            <li class="when-signed-out">
                                <a @click=${()=>{window.location.href="/login.html"}}>Sign In</a>
                            </li>
                        </menu>
                    </mu-dropdown>
                </div>
            </div>
        `}_handleDarkModeToggle(e){const r=e.target;this.isDarkMode=!r.checked,this.isDarkMode?this.classList.remove("light-mode"):this.classList.add("light-mode"),localStorage.setItem("darkMode",this.isDarkMode.toString());const a=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{isDarkMode:this.isDarkMode}});this.dispatchEvent(a)}_handleSignOut(e){K.relay(e,"auth:message",["auth/signout"]),window.location.href="/app"}};I.uses=P({"mu-dropdown":G.Element}),I.styles=[h,l`
            :host {
                display: block;
                position: sticky;
                top: 0;
                z-index: 100;
                background-color: var(--color-background-header);
                color: var(--color-text-header);
                padding: var(--spacing-md) 0;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                font-family: var(--font-body);
            }

            .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: var(--spacing-md);
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-md);
            }

            .logo-container {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .logo {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--color-accent);
                text-decoration: none;
                display: flex;
                align-items: center;
                transition: color 0.2s;
            }

            .logo:hover {
                color: var(--color-primary);
                text-decoration: none;
            }

            .main-nav {
                display: flex;
                gap: var(--spacing-md);
                align-items: center;
                flex-wrap: wrap;
            }

            .main-nav nav {
                display: flex;
                gap: var(--spacing-sm);
                align-items: center;
            }

            .main-nav nav a {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s, color 0.2s;
            }

            .main-nav nav a:hover {
                background-color: var(--color-background-hover);
                color: var(--color-link-hover);
                text-decoration: none;
            }

            .icon  {
                display: inline-block;
                height: 1.2em;
                width: 1.2em;
                vertical-align: middle;
                fill: currentColor;

            }

            .icon#profile {
                height: 2.5em;
                width: 2.5em;
                fill: var(--color-accent);
            }

            .logo .icon {
                margin-right: var(--spacing-sm);
                fill: var(--color-accent);
            }

            /* Dropdown styles */
            mu-dropdown {
                position: relative;
            }

            a[slot="actuator"] {
                color: var(--color-link);
                cursor: pointer;
                text-decoration: none;
                display: flex;
                align-items: center;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s, color 0.2s;
            }

            a[slot="actuator"]:hover {
                background-color: var(--color-background-hover);
                color: var(--color-link-hover);
            }

            .greeting {
                color: var(--color-text-header);
            }

            #userid:empty::before {
                content: "chef";
            }

            menu {
                display: none;
                position: absolute;
                top: calc(100% + var(--spacing-sm));
                right: 0;
                min-width: 200px;
                background-color: var(--color-background-header);
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                list-style: none;
                margin: 0;
                padding: var(--spacing-sm);
                z-index: 101;
                animation: fadeIn 0.2s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            mu-dropdown[open] menu {
                display: block;
            }

            menu li {
                margin: 0;
                padding: 0;
            }

            menu a, menu label {
                color: var(--color-link);
                cursor: pointer;
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s, color 0.2s;
                user-select: none;
            }

            menu a:hover, menu label:hover {
                background-color: var(--color-background-hover);
                color: var(--color-link-hover);
            }

            /* Dark Mode Toggle Switch */
            .switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: var(--color-accent);
            }

            input:checked + .slider:before {
                transform: translateX(20px);
            }

            a:has(#userid:empty) ~ menu > .when-signed-in,
            a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
                display: none;
            }
            

            @media (max-width: 775px) {
                .header-container {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .main-nav {
                    width: 100%;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                }

                .main-nav nav {
                    width: 100%;
                    justify-content: flex-start;
                    margin-bottom: var(--spacing-sm);
                    flex-wrap: wrap;
                }
            }
        `];let x=I;_([c()],x.prototype,"loggedIn");_([c()],x.prototype,"userid");_([c()],x.prototype,"isDarkMode");var fe=Object.defineProperty,be=Object.getOwnPropertyDescriptor,k=(t,e,r,a)=>{for(var i=a>1?void 0:a?be(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&fe(e,r,i),i};const j=class j extends v{constructor(){super("recipebook:model"),this.viewMode="recipes",this.selectedCuisine=""}get recipes(){return this.model.recipes||[]}get mealPlans(){return this.model.mealplans||[]}get cuisines(){return this.model.cuisines||[]}get filteredRecipes(){return this.selectedCuisine?this.recipes.filter(e=>e.cuisine.name===this.selectedCuisine):this.recipes}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["recipes/load",{}]),this.dispatchMessage(["mealplans/load",{}]),this.dispatchMessage(["cuisines/load",{}])}handleViewToggle(e){this.viewMode=e}handleCuisineToggle(e){this.selectedCuisine===e?this.selectedCuisine="":this.selectedCuisine=e}getAvailableCuisines(){const e=new Set(this.recipes.map(r=>r.cuisine.name));return Array.from(e).sort()}renderCuisineFilter(){if(this.viewMode!=="recipes")return s`<div class="filter-section hidden"></div>`;const e=this.getAvailableCuisines(),r=this.selectedCuisine!=="",a=this.filteredRecipes.length,i=this.recipes.length;return s`
            <div class="filter-section">
                <div class="filter-header">
                    <div class="filter-title">
                        <svg class="filter-icon" viewBox="0 0 24 24">
                            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                        </svg>
                        Filter by Cuisine
                    </div>
                    ${e.map(o=>s`
                        <div
                                class="cuisine-chip ${this.selectedCuisine===o?"selected":""}"
                                @click=${()=>this.handleCuisineToggle(o)}
                        >
                            <span>${o}</span>
                        </div>
                    `)}
                </div>

                <div class="cuisine-filter">
                    
                </div>

                ${r?s`
                    <div class="filter-summary">
                        Showing ${a} of ${i} recipes for ${this.selectedCuisine} cuisine
                    </div>
                `:""}
            </div>
        `}renderContent(){const e=this.viewMode==="recipes"?this.filteredRecipes:this.mealPlans,r=this.viewMode==="recipes"?this.recipes:this.mealPlans;if(r.length===0&&(this.viewMode==="recipes"?!this.model.recipes:!this.model.mealplans))return s`
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading delicious content...</div>
                </div>
            `;if(e.length===0){const i=r.length===0;return s`
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>
                        ${i?`No ${this.viewMode==="recipes"?"recipes":"meal plans"} found`:`No recipes found for ${this.selectedCuisine} cuisine`}
                    </h3>
                    <p>
                        ${i?"Check back later for new content!":"Try selecting a different cuisine."}
                    </p>
                </div>
            `}return s`
            <div class="content-grid">
                ${e.map(i=>this.renderCard(i))}
            </div>
        `}renderCard(e){const r="cookingTime"in e,a=r?`/app/recipe/${e.idName}`:`/app/mealplan/${e.idName}`;if(r){const i=e;return s`
                <a href=${a} class="item-card">
                    <img
                            class="item-image"
                            src=${i.imageUrl||"/images/placeholder.jpg"}
                            alt=${i.name}
                            loading="lazy"
                    >
                    <div class="item-content">
                        <h3>${i.name}</h3>
                        <p>${i.description}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                </svg>
                                ${i.cookingTime}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                </svg>
                                ${i.cuisine.name}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                                </svg>
                                ${i.servingSize}
                            </span>
                            <span class="difficulty-badge difficulty-${i.difficulty.toLowerCase()}">
                                ${i.difficulty}
                            </span>
                        </div>
                    </div>
                </a>
            `}else{const i=e;return s`
                <a href=${a} class="item-card">
                    <div class="item-content">
                        <h3>${i.name}</h3>
                        <p>${i.purpose}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                ${i.duration}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                                </svg>
                                ${i.recipes.length} recipes
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${i.mealTypes.join(", ")}
                            </span>
                        </div>
                    </div>
                </a>
            `}}render(){return s`
            <div class="container">
                <div class="hero-section">
                    <h1>Welcome to RecipeBook</h1>
                    <p>Discover amazing recipes and create perfect meal plans for your culinary journey!</p>
                </div>

                <div class="view-toggle">
                    <div class="toggle-indicator ${this.viewMode}"></div>
                    <button
                            class="toggle-button ${this.viewMode==="recipes"?"active":""}"
                            @click=${()=>this.handleViewToggle("recipes")}
                    >
                        Recipes
                    </button>
                    <button
                            class="toggle-button ${this.viewMode==="mealplans"?"active":""}"
                            @click=${()=>this.handleViewToggle("mealplans")}
                    >
                        Meal Plans
                    </button>
                </div>

                ${this.renderCuisineFilter()}

                <div class="content-section">
                    ${this.renderContent()}
                </div>
            </div>
        `}};j.styles=[h,l`
            :host {
                display: block;
                background: linear-gradient(135deg,
                var(--color-background-page) 0%,
                var(--color-background) 100%);
                min-height: 100vh;
                font-family: var(--font-body);
            }

            .hero-section {
                text-align: center;
                padding-top: var(--spacing-xxl) 0;
                padding-bottom: var(--spacing-md);
                border-radius: var(--border-radius-lg);
                position: relative;
                overflow: hidden;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
            }

            .hero-section h1 {
                font-size: 3rem;
                margin-bottom: var(--spacing-md);
                background: linear-gradient(135deg,
                var(--color-primary) 0%,
                var(--color-accent-alt) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: relative;
                z-index: 1;
            }

            .hero-section p {
                font-size: 1.2rem;
                color: var(--color-text);
                max-width: 600px;
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }

            /* View Toggle */

            .view-toggle {
                display: flex;
                justify-content: center;
                margin-bottom: var(--spacing-xl);
                position: relative;
                background: var(--color-background-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xs);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }

            .toggle-button {
                flex: 1;
                padding: var(--spacing-md) var(--spacing-lg);
                border: none;
                background: transparent;
                color: var(--color-text);
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                z-index: 2;
                transition: color 0.3s ease;
                border-radius: var(--border-radius-md);
            }

            .toggle-button.active {
                color: var(--color-text-inverted);

            }

            .toggle-indicator {
                position: absolute;
                top: var(--spacing-xs);
                height: calc(100% - var(--spacing-sm));
                width: calc(50% - var(--spacing-xs));
                background: linear-gradient(135deg,
                var(--color-accent) 0%,
                var(--color-accent-alt) 100%);
                border-radius: var(--border-radius-md);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(158, 206, 106, 0.3);
            }

            .toggle-indicator.recipes {
                transform: translateX(-50%);
            }

            .toggle-indicator.mealplans {
                transform: translateX(50%);
            }

            /* Cuisine Filter */
            .filter-section {
                margin-bottom: var(--spacing-xl);
                opacity: 1;
                transform: translateY(0);
                transition: all 0.3s ease;
            }

            .filter-section.hidden {
                opacity: 0;
                transform: translateY(-20px);
                pointer-events: none;
                margin-bottom: 0;
            }

            .filter-header {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: var(--spacing-lg);
                margin-bottom: var(--spacing-md);
                padding: 0 var(--spacing-sm);
            }

            .filter-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--color-text);
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .filter-icon {
                width: 20px;
                height: 20px;
                fill: var(--color-accent);
            }

            .cuisine-filter {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-sm);
                justify-content: center;
            }

            .cuisine-chip {
                display: inline-flex;
                align-items: center;
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--color-background-card);
                border: 2px solid var(--color-border);
                border-radius: var(--border-radius-pill);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                font-weight: 500;
                user-select: none;
                position: relative;
                overflow: hidden;
            }

            .cuisine-chip::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg,
                var(--color-accent) 0%,
                var(--color-accent-alt) 100%);
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .cuisine-chip span {
                position: relative;
                z-index: 1;
                transition: color 0.2s ease;
            }

            .cuisine-chip:hover {
                border-color: var(--color-accent);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(158, 206, 106, 0.2);
            }

            .cuisine-chip.selected {
                border-color: var(--color-accent);
                color: var(--color-text-inverted);
                box-shadow: 0 4px 12px rgba(158, 206, 106, 0.3);
            }

            .cuisine-chip.selected::before {
                opacity: 1;
            }

            .filter-summary {
                text-align: center;
                margin-top: var(--spacing-md);
                padding: var(--spacing-sm);
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                border-left: 4px solid var(--color-accent);
                font-size: 0.9rem;
                color: var(--color-text-muted);
            }

            .content-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .item-card {
                background: var(--color-background-card);
                border: 1px solid var(--color-border);
                border-radius: var(--border-radius-lg);
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                text-decoration: none;
                color: inherit;
                display: block;
            }

            .item-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg,
                transparent 0%,
                rgba(158, 206, 106, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .item-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                border-color: var(--color-accent);
            }

            .item-card:hover::before {
                opacity: 1;
            }

            .item-image {
                width: 100%;
                padding: var(--spacing-lg);
                height: 220px;
                object-fit: contain;
                transition: transform 0.3s ease;
            }

            .item-card:hover .item-image {
                transform: scale(1.05);
            }

            .item-content {
                padding: var(--spacing-lg);
                position: relative;
            }

            .item-content h3 {
                font-size: 1.3rem;
                margin-bottom: var(--spacing-sm);
                color: var(--color-primary);
                transition: color 0.3s ease;
            }

            .item-card:hover .item-content h3 {
                color: var(--color-accent-alt);
            }

            .item-content p {
                color: var(--color-text);
                line-height: 1.6;
                margin-bottom: var(--spacing-md);
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .item-meta {
                display: flex;
                gap: var(--spacing-lg);
                font-size: 0.9rem;
                color: var(--color-text-muted);
                flex-wrap: wrap;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .meta-icon {
                width: 16px;
                height: 16px;
                fill: var(--color-accent);
            }

            .difficulty-badge {
                background: var(--color-accent);
                color: var(--color-text-inverted);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: capitalize;
            }

            .difficulty-easy { background: #10b981; }
            .difficulty-medium { background: #f59e0b; }
            .difficulty-hard { background: #ef4444; }

            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                gap: var(--spacing-lg);
            }

            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid var(--color-border);
                border-top-color: var(--color-accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .loading-text {
                color: var(--color-text-muted);
                font-size: 1.1rem;
            }

            /* Empty State */
            .empty-state {
                text-align: center;
                padding: var(--spacing-xxl);
                color: var(--color-text-muted);
            }

            .empty-state svg {
                width: 120px;
                height: 120px;
                margin-bottom: var(--spacing-lg);
                fill: var(--color-border);
            }

            @media (max-width: 768px) {
                .hero-section h1 {
                    font-size: 2rem;
                }

                .content-grid {
                    grid-template-columns: 1fr;
                }

                .view-toggle {
                    max-width: 100%;
                }

                .item-meta {
                    gap: var(--spacing-md);
                }

                .cuisine-filter {
                    justify-content: flex-start;
                }

                .filter-header {
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    align-items: flex-start;
                }
            }
        `];let g=j;k([c()],g.prototype,"viewMode",2);k([c()],g.prototype,"selectedCuisine",2);k([c()],g.prototype,"recipes",1);k([c()],g.prototype,"mealPlans",1);k([c()],g.prototype,"cuisines",1);k([c()],g.prototype,"filteredRecipes",1);var xe=Object.defineProperty,ye=Object.getOwnPropertyDescriptor,H=(t,e,r,a)=>{for(var i=a>1?void 0:a?ye(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&xe(e,r,i),i};const L=class L extends v{get recipe(){return this.model.recipe}constructor(){super("recipebook:model")}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="recipe-id"&&r!==a&&a&&(console.log("Loading recipe:",a),this.dispatchMessage(["recipe/load",{recipeId:a}]))}render(){return!this.recipe&&this.recipeId?s`
                <div class="loading">Loading recipe...</div>
            `:this.recipe?s`
            <div class="container">
                <div class="page-grid">
                    <div class="full-width">
                        <h1>${this.recipe.name}</h1>
                        <div class="recipe-header">
                            <div class="recipe-image">
                                <img src="${this.recipe.imageUrl}" alt="${this.recipe.name}">
                            </div>
                            <div class="recipe-info">
                                <p><strong>Description:</strong> ${this.recipe.description}</p>
                                <div class="recipe-meta">
                                    <div class="recipe-meta-item">
                                        <svg class="icon">
                                            <use href="/icons/icons.svg#clock"></use>
                                        </svg>
                                        <span><strong>Cooking Time:</strong> ${this.recipe.cookingTime}</span>
                                    </div>
                                    <div class="recipe-meta-item">
                                        <svg class="icon">
                                            <use href="/icons/icons.svg#users"></use>
                                        </svg>
                                        <span><strong>Serving Size:</strong> ${this.recipe.servingSize}</span>
                                    </div>
                                    <div class="recipe-meta-item">
                                        <svg class="icon">
                                            <use href="/icons/icons.svg#chart"></use>
                                        </svg>
                                        <span><strong>Difficulty:</strong> ${this.recipe.difficulty}</span>
                                    </div>
                                    <div class="recipe-meta-item">
                                        <svg class="icon">
                                            <use href="/icons/icons.svg#chef"></use>
                                        </svg>
                                        <span><strong>Chef:</strong> <a href="${this.recipe.chef.href}">${this.recipe.chef.name}</a></span>
                                    </div>
                                    <div class="recipe-meta-item">
                                        <svg class="icon">
                                            <use href="/icons/icons.svg#globe"></use>
                                        </svg>
                                        <span><strong>Cuisine:</strong> <a href="${this.recipe.cuisine.href}">${this.recipe.cuisine.name}</a></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="recipe-content">
                            <div class="ingredients-section">
                                <h2>
                                    <svg class="icon">
                                        <use href="/icons/icons.svg#kitchen"></use>
                                    </svg>
                                    Ingredients
                                </h2>
                                <ul>
                                    ${this.recipe.ingredients.map(e=>s`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                                <h2>Included in Meal Plans</h2>
                                <ul>
                                    ${this.recipe.mealPlans.map(e=>s`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                            </div>
                            <div class="steps-section">
                                <h2>Preparation Steps</h2>
                                <ol>
                                    ${this.recipe.steps.map(e=>s`
                                        <li>${e}</li>
                                    `)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:s`
                <div class="loading">Recipe not found</div>
            `}};L.styles=[h,l`
            :host {
                display: block;
                padding: var(--spacing-lg);
                background: var(--color-background-page);
                min-height: 100vh;
                font-family: var(--font-body);
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
            }

            .recipe-image img {
                width: 100%;
                max-width: 400px;
                height: auto;
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .recipe-info p {
                font-size: 1.1rem;
            }

            .ingredients-section, .steps-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-lg);
                border: 1px solid var(--color-border);
            }

            .ingredients-section h2, .steps-section h2 {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                margin-top: 0;
            }

            .ingredients-section ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .ingredients-section li {
                margin-bottom: var(--spacing-sm);
            }

            .ingredients-section a {
                display: block;
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s;
            }

            .ingredients-section a:hover {
                background-color: var(--color-background-hover);
                text-decoration: none;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }

            @media (max-width: 768px) {
                .recipe-image img {
                    max-width: 100%;
                }
            }
        `];let w=L;H([f({attribute:"recipe-id"})],w.prototype,"recipeId",2);H([c()],w.prototype,"recipe",1);var ke=Object.defineProperty,we=Object.getOwnPropertyDescriptor,z=(t,e,r,a)=>{for(var i=a>1?void 0:a?we(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&ke(e,r,i),i};const M=class M extends v{constructor(){super("recipebook:model"),this._authObserver=new U(this,"recipebook:auth"),this.formData={name:"",description:"",cookingTime:"",servingSize:"",difficulty:"Easy",cuisineId:"",ingredientIds:[],mealPlanIds:[],steps:[""]},this.errors=[],this.isSubmitting=!1}get chef(){return this.model.chef}get cuisines(){return this.model.cuisines||[]}get ingredients(){return this.model.ingredients||[]}get mealplans(){return this.model.mealplans||[]}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="user-id"&&r!==a&&a&&(console.log("Loading chef for recipe creation:",a),this.dispatchMessage(["chef/load",{chefId:a}]))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:r}=e;r&&r.authenticated?this.userId!==r.username&&(this.userId=r.username,console.log("Auto-loaded userId from auth:",this.userId),this.dispatchMessage(["chef/load",{chefId:this.userId}])):this.userId=void 0,this.requestUpdate()}),this.dispatchMessage(["cuisines/load",{}]),this.dispatchMessage(["ingredients/load",{}]),this.dispatchMessage(["mealplans/load",{}]),this.userId&&this.dispatchMessage(["chef/load",{chefId:this.userId}])}generateIdName(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}handleInputChange(e,r){this.formData={...this.formData,[e]:r}}handleMultiSelectChange(e,r,a){const i=[...this.formData[e]];if(a&&!i.includes(r))i.push(r);else if(!a){const o=i.indexOf(r);o>-1&&i.splice(o,1)}this.formData={...this.formData,[e]:i}}addStep(){this.formData={...this.formData,steps:[...this.formData.steps,""]}}removeStep(e){if(this.formData.steps.length>1){const r=[...this.formData.steps];r.splice(e,1),this.formData={...this.formData,steps:r}}}handleStepChange(e,r){const a=[...this.formData.steps];a[e]=r,this.formData={...this.formData,steps:a}}validateForm(){const e=[];return this.formData.name.trim()||e.push("Recipe name is required"),this.formData.description.trim()||e.push("Description is required"),this.formData.cookingTime.trim()||e.push("Cooking time is required"),this.formData.servingSize.trim()||e.push("Serving size is required"),this.userId||e.push("User ID is required - please ensure you're logged in"),this.chef||e.push("Chef profile not found - please ensure you're logged in"),this.formData.cuisineId||e.push("Cuisine selection is required"),this.formData.ingredientIds.length===0&&e.push("At least one ingredient is required"),this.formData.steps.some(r=>!r.trim())&&e.push("All steps must be filled out"),this.errors=e,e.length===0}handleSubmit(e){var q;if(e.preventDefault(),!this.validateForm()||this.isSubmitting)return;this.isSubmitting=!0,this.errors=[];const r=this.generateIdName(this.formData.name),a=this.cuisines.find(d=>d.idName===this.formData.cuisineId),i=this.ingredients.filter(d=>this.formData.ingredientIds.includes(d.idName)),o=this.mealplans.filter(d=>this.formData.mealPlanIds.includes(d.idName)),n={idName:r,name:this.formData.name,description:this.formData.description,imageUrl:`images/${r}.png`,cookingTime:this.formData.cookingTime,servingSize:this.formData.servingSize,difficulty:this.formData.difficulty,chef:{name:((q=this.chef)==null?void 0:q.name)||"",href:`/app/chef/${this.userId}`},cuisine:{name:(a==null?void 0:a.name)||"",href:`/app/cuisine/${this.formData.cuisineId}`},ingredients:i.map(d=>({name:d.name,href:`/app/ingredient/${d.idName}`})),mealPlans:o.map(d=>({name:d.name,href:`/app/mealplan/${d.idName}`})),steps:this.formData.steps.filter(d=>d.trim())};this.dispatchMessage(["recipe/create",{recipe:n,onSuccess:()=>{this.isSubmitting=!1,b.dispatch(this,"history/navigate",{href:`/app/recipe/${r}`})},onFailure:d=>{this.isSubmitting=!1,this.errors=[d.message]}}])}removeMuFormDefaultStyles(){this.updateComplete.then(()=>{var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("mu-form");if(e){const a=e.shadowRoot;if(a){a.querySelectorAll("style").forEach(n=>n.remove());const o=document.createElement("style");o.textContent=`
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
                    `,a.appendChild(o)}}})}render(){return this.removeMuFormDefaultStyles(),!this.chef&&this.userId?s`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?s`
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

                ${this.errors.length>0?s`
                    <div class="error-message">
                        ${this.errors.map(e=>s`<p>${e}</p>`)}
                    </div>
                `:""}

                <div class="recipe-form">
                    <div class="form-section">
                        <h2>Basic Information</h2>

                        <label>
                            Recipe Name *
                            <input
                                    type="text"
                                    .value=${this.formData.name}
                                    @input=${e=>this.handleInputChange("name",e.target.value)}
                                    placeholder="Enter recipe name"
                                    required
                            />
                        </label>

                        <label>
                            Description *
                            <textarea
                                    .value=${this.formData.description}
                                    @input=${e=>this.handleInputChange("description",e.target.value)}
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
                                        @input=${e=>this.handleInputChange("cookingTime",e.target.value)}
                                        required
                                />
                            </label>

                            <label>
                                Serving Size *
                                <input
                                        type="text"
                                        placeholder="e.g., 4 servings"
                                        .value=${this.formData.servingSize}
                                        @input=${e=>this.handleInputChange("servingSize",e.target.value)}
                                        required
                                />
                            </label>

                            <label>
                                Difficulty *
                                <select
                                        .value=${this.formData.difficulty}
                                        @change=${e=>this.handleInputChange("difficulty",e.target.value)}
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
                                    @change=${e=>this.handleInputChange("cuisineId",e.target.value)}
                                    required
                            >
                                <option value="">Select a cuisine</option>
                                ${this.cuisines.map(e=>s`
                                    <option value=${e.idName}>${e.name}</option>
                                `)}
                            </select>
                        </label>
                    </div>

                    <div class="form-section">
                        <h2>Ingredients *</h2>
                        <div class="checkbox-grid">
                            ${this.ingredients.map(e=>s`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.ingredientIds.includes(e.idName)}
                                            @change=${r=>this.handleMultiSelectChange("ingredientIds",e.idName,r.target.checked)}
                                    />
                                    <span>${e.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Meal Plans</h2>
                        <div class="checkbox-grid">
                            ${this.mealplans.map(e=>s`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.mealPlanIds.includes(e.idName)}
                                            @change=${r=>this.handleMultiSelectChange("mealPlanIds",e.idName,r.target.checked)}
                                    />
                                    <span>${e.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Cooking Steps *</h2>
                        ${this.formData.steps.map((e,r)=>s`
                            <div class="step-container">
                                <div class="step-header">
                                    <h3>Step ${r+1}</h3>
                                    ${this.formData.steps.length>1?s`
                                        <button type="button" class="remove-step" @click=${()=>this.removeStep(r)}>
                                            Remove Step
                                        </button>
                                    `:""}
                                </div>
                                <textarea
                                        .value=${e}
                                        @input=${a=>this.handleStepChange(r,a.target.value)}
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
                                @click=${()=>b.dispatch(this,"history/navigate",{href:"/app"})}
                        >
                            Cancel
                        </button>
                        <button
                                type="button"
                                @click=${this.handleSubmit}
                                .disabled=${this.isSubmitting}
                        >
                            ${this.isSubmitting?"Creating Recipe...":"Create Recipe"}
                        </button>
                    </div>
                </div>
            </div>
        `:s`
                <div class="container">
                    <div class="error-message">
                        <p>Chef profile not found. Please ensure you're logged in.</p>
                    </div>
                </div>
            `}};M.uses=P({"mu-form":B.Element}),M.styles=[h,l`
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
        `];let m=M;z([f({attribute:"user-id"})],m.prototype,"userId",2);z([c()],m.prototype,"formData",2);z([c()],m.prototype,"errors",2);z([c()],m.prototype,"isSubmitting",2);z([c()],m.prototype,"chef",1);var $e=Object.defineProperty,Ce=Object.getOwnPropertyDescriptor,A=(t,e,r,a)=>{for(var i=a>1?void 0:a?Ce(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&$e(e,r,i),i};const R=class R extends v{get chef(){return this.model.chef}constructor(){super("recipebook:model")}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="chef-id"&&r!==a&&a&&(console.log("Loading chef:",a),this.dispatchMessage(["chef/load",{chefId:a}]))}render(){return!this.chef&&this.chefId?s`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?s`
            <div class="container">
                <div class="chef-profile">
                    <button
                            class="edit-button"
                            @click=${()=>b.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}/edit`})}>
                        Edit Profile
                    </button>

                    <div class="chef-image">
                        <img src="${this.chef.imageUrl}" alt="${this.chef.name}">
                    </div>
                    <h1>${this.chef.name}</h1>
                    <p class="bio">${this.chef.bio}</p>

                    <div class="section">
                        <h2>Favorite Dishes</h2>
                        <ul>
                            ${this.chef.favoriteDishes.map(e=>s`
                                <li>${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Recipes by ${this.chef.name}</h2>
                        <ul>
                            ${this.chef.recipes.map(e=>s`
                                <li><a href="${e.href}">${e.name}</a></li>
                            `)}
                        </ul>
                    </div>
                </div>
            </div>
        `:s`
                <div class="container">
                    <div class="loading">Chef not found</div>
                </div>
            `}};R.styles=[h,l`
            :host {
                min-height: 100vh;
            }

            .chef-profile {
                position: relative;
                padding-top: var(--spacing-xl);
            }

            .edit-button {
                position: absolute;
                top: 0;
                right: 0;
                padding: var(--spacing-sm) var(--spacing-lg);
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                font-size: 1rem;
                transition: opacity 0.2s;
            }

            .edit-button:hover {
                opacity: 0.9;
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
                color: var(--color-link);
                text-decoration: none;
            }

            .section a:hover {
                background-color: var(--color-background-hover);
                text-decoration: underline;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }

            @media (max-width: 768px) {
                .chef-profile {
                    padding-top: var(--spacing-lg);
                }

                .edit-button {
                    position: static;
                    width: 100%;
                    margin-bottom: var(--spacing-lg);
                }
            }
        `];let $=R;A([f({attribute:"chef-id"})],$.prototype,"chefId",2);A([c()],$.prototype,"chef",1);var De=Object.defineProperty,ze=Object.getOwnPropertyDescriptor,O=(t,e,r,a)=>{for(var i=a>1?void 0:a?ze(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&De(e,r,i),i};const S=class S extends v{get chef(){return this.model.chef}constructor(){super("recipebook:model")}removeMuFormDefaultStyles(){this.updateComplete.then(()=>{var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("mu-form");if(e){const a=e.shadowRoot;if(a){a.querySelectorAll("style").forEach(n=>n.remove());const o=document.createElement("style");o.textContent=`
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
                `,a.appendChild(o)}}})}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="chef-id"&&r!==a&&a&&(console.log("Loading chef for edit:",a),this.errorMessage=void 0,this.dispatchMessage(["chef/load",{chefId:a}]))}handleSubmit(e){if(!this.chefId)return;if(this.errorMessage=void 0,e.detail.idName!==this.chefId){this.errorMessage="Mismatch in Chef ID. Cannot save.";return}this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e.detail,onSuccess:()=>{b.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})},onFailure:a=>{this.errorMessage=a.message||"Failed to save chef profile",console.error("Failed to save chef:",a)}}])}addFavoriteDish(){if(!this.chef)return;const e={...this.chef,favoriteDishes:[...this.chef.favoriteDishes,""]};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e,onSuccess:()=>{},onFailure:r=>console.error("Failed to add dish:",r)}])}removeFavoriteDish(e){if(!this.chef)return;const r=this.chef.favoriteDishes.filter((i,o)=>o!==e),a={...this.chef,favoriteDishes:r};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:a,onSuccess:()=>{},onFailure:i=>console.error("Failed to remove dish:",i)}])}render(){return this.removeMuFormDefaultStyles(),!this.chef&&this.chefId?s`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?s`
            <div class="container">
                <div class="page-header">
                    <h1>Edit Chef Profile</h1>
                </div>

                ${this.errorMessage?s`
                    <div class="error-message">${this.errorMessage}</div>
                `:""}

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
                                ${this.chef.favoriteDishes.map((e,r)=>s`
                                    <div class="list-item">
                                        <input
                                                type="text"
                                                name="favoriteDishes[${r}]"
                                                value="${e}"
                                                placeholder="Dish name"
                                                required
                                        />
                                        <button
                                                type="button"
                                                @click=${()=>this.removeFavoriteDish(r)}>
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
                            @click=${()=>b.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})}>
                        Cancel
                    </button>
                    <input type="hidden" name="idName" value="${this.chef.idName}" />
                </mu-form>
            </div>
        `:s`
                <div class="container">
                    <div class="error-message">Chef profile not found</div>
                </div>
            `}};S.uses=P({"mu-form":B.Element}),S.styles=[h,l`
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
        `];let y=S;O([f({attribute:"chef-id"})],y.prototype,"chefId",2);O([c()],y.prototype,"chef",1);O([c()],y.prototype,"errorMessage",2);var Ie=Object.defineProperty,Me=Object.getOwnPropertyDescriptor,Y=(t,e,r,a)=>{for(var i=a>1?void 0:a?Me(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&Ie(e,r,i),i};const T=class T extends v{get ingredient(){return this.model.ingredient}constructor(){super("recipebook:model")}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="ingredient-id"&&r!==a&&a&&(console.log("Loading ingredient:",a),this.dispatchMessage(["ingredient/load",{ingredientId:a}]))}render(){return!this.ingredient&&this.ingredientId?s`
                <div class="container">
                    <div class="loading">Loading ingredient...</div>
                </div>
            `:this.ingredient?s`
            <div class="container">
                <div class="ingredient-card">
                    <h1>${this.ingredient.name}</h1>
                    <div class="top-section">
                        ${this.ingredient.imageUrl?s`
                            <img src="${this.ingredient.imageUrl}" alt="${this.ingredient.name}"
                                 style="max-width: 250px;">
                        `:""}
                        <div class="details">
                            <p><strong>Category:</strong> ${this.ingredient.category}</p>
                            ${this.ingredient.allergens?s`
                                <p><strong>Allergens:</strong> ${this.ingredient.allergens}</p>
                            `:""}
                            ${this.ingredient.substitutes?s`
                                <p><strong>Substitutes:</strong> ${this.ingredient.substitutes}</p>
                            `:""}
                        </div>
                    </div>

                    ${this.ingredient.nutrition&&this.ingredient.nutrition.length>0?s`
                        <div class="section">
                            <h2>Nutritional Information</h2>
                            <div class="nutrition-grid">
                                ${this.ingredient.nutrition.map(e=>s`
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${e.value}</div>
                                        <div class="nutrition-label">${e.label}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `:""}

                    ${this.ingredient.recipes&&this.ingredient.recipes.length>0?s`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipes.map(e=>s`
                                    <li><a href="${e.href}">${e.name}</a></li>
                                `)}
                            </ul>
                        </div>
                    `:""}
                </div>
            </div>
        `:s`
                <div class="container">
                    <div class="loading">Ingredient not found</div>
                </div>
            `}};T.styles=[h,l`
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

            .top-section {
                display: flex;
            }

            .details {
                padding-left: var(--spacing-lg);
            }

            .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: var(--spacing-md);
                margin-top: var(--spacing-md);
            }

            .nutrition-item {
                text-align: center;
                padding: var(--spacing-md);
                background: var(--color-background-card);
                border-radius: var(--border-radius-sm);
            }

            .nutrition-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
            }

            .nutrition-label {
                font-size: 0.9rem;
                color: var(--color-text-muted);
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

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `];let C=T;Y([f({attribute:"ingredient-id"})],C.prototype,"ingredientId",2);Y([c()],C.prototype,"ingredient",1);var Se=Object.defineProperty,Pe=Object.getOwnPropertyDescriptor,X=(t,e,r,a)=>{for(var i=a>1?void 0:a?Pe(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&Se(e,r,i),i};const N=class N extends v{get cuisine(){return this.model.cuisine}constructor(){super("recipebook:model")}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="cuisine-id"&&r!==a&&a&&(console.log("Loading cuisine:",a),this.dispatchMessage(["cuisine/load",{cuisineId:a}]))}render(){return!this.cuisine&&this.cuisineId?s`
                <div class="container">
                    <div class="loading">Loading cuisine...</div>
                </div>
            `:this.cuisine?s`
            <div class="container">
                <div class="cuisine-header">
                    <h1>${this.cuisine.name}</h1>
                    <p class="region"><strong>Region/Country of Origin:</strong> ${this.cuisine.region}</p>
                    <p class="description">${this.cuisine.description}</p>
                </div>

                <div class="info-grid">
                    <div class="info-section">
                        <h2>Popular Ingredients</h2>
                        <ul class="tag-list">
                            ${this.cuisine.popularIngredients.map(e=>s`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="info-section">
                        <h2>Typical Dishes</h2>
                        <ul class="tag-list">
                            ${this.cuisine.typicalDishes.map(e=>s`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes from ${this.cuisine.name}</h2>
                    <div class="recipe-grid">
                        ${this.cuisine.recipes.map(e=>s`
                            <a href="${e.href}" class="recipe-card">
                                ${e.imageUrl?s`
                                    <img src="${e.imageUrl}" alt="${e.name}">
                                `:""}
                                <div class="recipe-card-content">
                                    <h3>${e.name}</h3>
                                </div>
                            </a>
                        `)}
                    </div>
                </div>
            </div>
        `:s`
                <div class="container">
                    <div class="loading">Cuisine not found</div>
                </div>
            `}};N.styles=[h,l`
            :host {
                min-height: 100vh;
            }

            .cuisine-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .region {
                color: var(--color-text-muted);
                font-size: 1.1rem;
                margin-bottom: var(--spacing-md);
            }

            .description {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
            }

            .recipe-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: var(--spacing-lg);
                margin-top: var(--spacing-lg);
            }

            .recipe-card {
                background: var(--color-background);
                border-radius: var(--border-radius-md);
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                text-decoration: none;
                display: block;
            }

            .recipe-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .recipe-card img {
                width: 100%;
                height: 150px;
                object-fit: cover;
            }

            .recipe-card-content {
                padding: var(--spacing-md);
            }

            .recipe-card h3 {
                font-family: var(--font-display);
                font-size: 1.1rem;
                margin: 0;
                color: var(--color-primary);
            }

            .recipe-card:hover h3 {
                color: var(--color-link-hover);
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `];let D=N;X([f({attribute:"cuisine-id"})],D.prototype,"cuisineId",2);X([c()],D.prototype,"cuisine",1);var Fe=Object.defineProperty,_e=Object.getOwnPropertyDescriptor,F=(t,e,r,a)=>{for(var i=a>1?void 0:a?_e(e,r):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(i=(a?n(e,r,i):n(i))||i);return a&&i&&Fe(e,r,i),i};const E=class E extends v{constructor(){super("recipebook:model"),this.loading=!1}get mealplan(){return this.model.mealplan}attributeChangedCallback(e,r,a){super.attributeChangedCallback(e,r,a),e==="mealplan-id"&&r!==a&&a&&(console.log("Loading meal plan:",a),this.loading=!0,this.error=void 0,this.dispatchMessage(["mealplan/load",{mealplanId:a,onSuccess:()=>{this.loading=!1,console.log("Meal plan loaded successfully")},onFailure:i=>{this.loading=!1,this.error=i.message,console.error("Failed to load meal plan:",i)}}]))}connectedCallback(){super.connectedCallback(),this.mealplanId&&!this.mealplan&&!this.loading&&this.attributeChangedCallback("mealplan-id",null,this.mealplanId)}validateRecipeHref(e){return e?e.startsWith("/app/recipe/")||e.startsWith("http")?e:`/app/recipe/${e}`:"#"}formatScheduleInfo(e,r){if(!e&&!r)return"";const a=[];return e&&a.push(e),r&&a.push(r),a.join(" - ")}render(){var a,i;if(this.loading)return s`
                <div class="container">
                    <div class="loading">
                        <span class="loading-spinner"></span>
                        Loading meal plan...
                    </div>
                </div>
            `;if(this.error)return s`
                <div class="container">
                    <div class="error">
                        <h3>Error Loading Meal Plan</h3>
                        <p>${this.error}</p>
                    </div>
                </div>
            `;if(!this.mealplan&&this.mealplanId)return s`
                <div class="container">
                    <div class="not-found">
                        <h3>Meal Plan Not Found</h3>
                        <p>The requested meal plan could not be found.</p>
                    </div>
                </div>
            `;if(!this.mealplan)return s`
                <div class="container">
                    <div class="not-found">
                        <h3>No Meal Plan</h3>
                        <p>Please select a meal plan to view.</p>
                    </div>
                </div>
            `;const{mealplan:e}=this,r=((a=e.recipes)==null?void 0:a.length)||0;return s`
            <div class="container">
                <div class="mealplan-header">
                    <h1>${e.name}</h1>
                    <div class="meta-info">
                        <span class="meta-item">
                            <strong>Duration:</strong> ${e.duration}
                        </span>
                        <span class="meta-item">
                            <strong>Meal Types:</strong> ${((i=e.mealTypes)==null?void 0:i.join(", "))||"None specified"}
                        </span>
                        <span class="meta-item">
                            <strong>Recipes:</strong> ${r} recipe${r!==1?"s":""}
                        </span>
                    </div>
                    ${e.purpose?s`
                        <div class="purpose">
                            <strong>Purpose:</strong> ${e.purpose}
                        </div>
                    `:""}
                </div>

                <div class="recipes-section">
                    <h2>Included Recipes</h2>

                    ${r>0?s`
                        <div class="recipe-count">
                            ${r} recipe${r!==1?"s":""} in this meal plan
                        </div>
                        <div class="recipe-list">
                            ${e.recipes.map(o=>s`
                                <div class="recipe-item">
                                    <div class="recipe-info">
                                        <div class="recipe-name">${o.name}</div>
                                        ${this.formatScheduleInfo(o.day,o.mealType)?s`
                                            <div class="recipe-schedule">
                                                ${this.formatScheduleInfo(o.day,o.mealType)}
                                            </div>
                                        `:""}
                                    </div>
                                    <a href="${this.validateRecipeHref(o.href)}" class="recipe-link">
                                        View Recipe
                                    </a>
                                </div>
                            `)}
                        </div>
                    `:s`
                        <div class="empty-recipes">
                            No recipes have been added to this meal plan yet.
                        </div>
                    `}

                    ${e.mealTypes&&e.mealTypes.length>0?s`
                        <div class="meal-types">
                            ${e.mealTypes.map(o=>s`
                                <span class="meal-type-tag">${o}</span>
                            `)}
                        </div>
                    `:""}
                </div>
            </div>
        `}};E.styles=[h,l`
            :host {
                min-height: 100vh;
                display: block;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-lg);
            }

            .mealplan-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .mealplan-header h1 {
                margin: 0 0 var(--spacing-md) 0;
                color: var(--color-primary);
                font-size: 2rem;
            }

            .meta-info {
                display: flex;
                gap: var(--spacing-lg);
                flex-wrap: wrap;
                margin-bottom: var(--spacing-md);
            }

            .meta-item {
                font-size: 0.95rem;
                color: var(--color-text-muted);
            }

            .meta-item strong {
                color: var(--color-text);
            }

            .purpose {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
                margin: var(--spacing-md) 0 0 0;
                padding: var(--spacing-md);
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                border-left: 4px solid var(--color-accent);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .recipes-section h2 {
                margin: 0 0 var(--spacing-lg) 0;
                color: var(--color-primary);
                font-size: 1.5rem;
            }

            .recipe-list {
                display: grid;
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-xl);
            }

            .recipe-item {
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease;
                border: 1px solid var(--color-border);
            }

            .recipe-item:hover {
                background-color: var(--color-background-hover);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .recipe-info {
                flex: 1;
                min-width: 0; /* Prevents flex item from overflowing */
            }

            .recipe-name {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
                word-wrap: break-word;
            }

            .recipe-schedule {
                font-size: 0.9rem;
                color: var(--color-text-muted);
                font-style: italic;
            }

            .recipe-link {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border: 1px solid var(--color-link);
                border-radius: var(--border-radius-sm);
                transition: all 0.2s ease;
                white-space: nowrap;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .recipe-link:hover {
                background-color: var(--color-link);
                color: white;
                text-decoration: none;
                transform: translateX(2px);
            }

            .recipe-link::after {
                content: "→";
                transition: transform 0.2s ease;
            }

            .recipe-link:hover::after {
                transform: translateX(2px);
            }

            .meal-types {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                margin-top: var(--spacing-md);
            }

            .meal-type-tag {
                background: var(--color-accent);
                color: var(--color-text-inverted);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.9rem;
                font-weight: 500;
                text-transform: capitalize;
            }

            .loading, .error, .not-found {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                margin: var(--spacing-xl) 0;
            }

            .error {
                color: var(--color-error, #dc3545);
                background: var(--color-error-background, #f8d7da);
                border: 1px solid var(--color-error-border, #f5c6cb);
            }

            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid var(--color-text-muted);
                border-radius: 50%;
                border-top-color: var(--color-primary);
                animation: spin 1s linear infinite;
                margin-right: var(--spacing-sm);
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .empty-recipes {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text-muted);
                font-style: italic;
            }

            .recipe-count {
                font-size: 0.9rem;
                color: var(--color-text-muted);
                margin-bottom: var(--spacing-md);
            }

            @media (max-width: 768px) {
                .container {
                    padding: var(--spacing-md);
                }

                .meta-info {
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .recipe-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                }

                .recipe-link {
                    align-self: flex-end;
                }

                .mealplan-header h1 {
                    font-size: 1.5rem;
                }
            }
        `];let u=E;F([f({attribute:"mealplan-id"})],u.prototype,"mealplanId",2);F([c()],u.prototype,"loading",2);F([c()],u.prototype,"error",2);F([c()],u.prototype,"mealplan",1);const Oe=l`
    :root {
        --color-background-page: #1a1b26;
        --color-background-header: #16161e;
        --color-background-card: #292e42;
        --color-background: #16161e;
        --color-background-hover: rgba(42, 157, 143, 0.1);
        --color-text-header: #c0caf5;
        --color-text: #a9b1d6;
        --color-text-inverted: #ffffff;
        --color-text-muted: #565f89;
        --color-primary: #9ece6a;
        --color-accent: #9ece6a;
        --color-border: #414868;
        --color-grid: #a9b1d6;
        --color-grid-accent: #292e42;
        --color-accent-alt: #7aa2f7;
        --color-link: #7aa2f7;
        --color-link-hover: #bb9af7;

        /* Fonts */
        --font-body: "Lora", serif;
        --font-display: 'Playfair Display', serif;
        --font-size-base: 1rem;
        --font-size-lg: 1.5rem;
        --font-size-xl: 2.5rem;

        /* Spacing */
        --spacing-xs: 0.25rem;
        --spacing-sm: 0.5rem;
        --spacing-md: 1rem;
        --spacing-lg: 1.5rem;
        --spacing-xl: 2rem;
        --spacing-xxl: 3rem;
        --border-radius-sm: 4px;
        --border-radius-md: 8px;
        --border-radius-lg: 12px;
    }

    /* Light mode */
    body.light-mode {
        --color-background-page: #f5f7fa;
        --color-background-header: #ffffff;
        --color-background-card: #ffffff;
        --color-background: #f5f7fa;
        --color-background-hover: rgba(49, 130, 206, 0.1);
        --color-text: #2c3e50;
        --color-text-header: #1a202c;
        --color-text-inverted: #2c3e50;
        --color-text-muted: #718096;
        --color-primary: #2c5282;
        --color-accent: #2c5282;
        --color-border: #e2e8f0;
        --color-grid: #ffffff;
        --color-grid-accent: #f0fdfa;
        --color-accent-alt: #79A978;
        --color-link: #3182ce;
        --color-link-hover: #38b2ac;
    }
`,W=document.createElement("style");W.textContent=Oe.cssText;document.head.append(W);const je=[{path:"/app/recipe/create",view:()=>s`
      <recipe-create></recipe-create>
    `},{path:"/app/recipe/:id",view:t=>s`
      <recipe-view recipe-id=${t.id}></recipe-view>
    `},{path:"/app/chef/:id",view:t=>s`
      <chef-view chef-id=${t.id}></chef-view>
    `},{path:"/app/chef/:id/edit",view:t=>s`
      <chef-edit chef-id=${t.id}></chef-edit>
    `},{path:"/app/ingredient/:id",view:t=>s`
      <ingredient-view ingredient-id=${t.id}></ingredient-view>
    `},{path:"/app/cuisine/:id",view:t=>s`
      <cuisine-view cuisine-id=${t.id}></cuisine-view>
    `},{path:"/app/mealplan/:id",view:t=>s`
      <mealplan-view mealplan-id=${t.id}></mealplan-view>
    `},{path:"/app/mealplan",view:()=>s`
      <mealplan-list-view></mealplan-list-view>
    `},{path:"/app/recipes",view:()=>s`
      <recipes-list-view></recipes-list-view>
    `},{path:"/app",view:()=>s`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];P({"mu-auth":p.Provider,"mu-history":b.Provider,"mu-store":class extends V.Provider{constructor(){super(re,ee,"recipebook:auth")}},"app-header":x,"home-view":g,"recipe-view":w,"recipe-create":m,"chef-view":$,"ingredient-view":C,"cuisine-view":D,"mealplan-view":u,"login-form":Q,"chef-edit":y,"mu-switch":class extends Z.Element{constructor(){super(je,"recipebook:history","recipebook:auth")}}});document.addEventListener("DOMContentLoaded",()=>{const t=localStorage.getItem("darkMode");(t===null?!0:t==="true")||document.body.classList.add("light-mode"),document.body.addEventListener("darkmode:toggle",r=>{const i=r.detail.isDarkMode;i?document.body.classList.remove("light-mode"):document.body.classList.add("light-mode"),localStorage.setItem("darkMode",i.toString())})});
