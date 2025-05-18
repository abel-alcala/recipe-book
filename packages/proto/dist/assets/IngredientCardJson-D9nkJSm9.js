import{i as g,b as m,O as p,x as n,n as u,r as h}from"./state-BwZx0JEs.js";const v={styles:g`
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      display: block;
    }
    ul, ol, menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    body {
      line-height: 1.5;
    }
    svg {
      max-width: 100%;
    }
  `};var f=Object.defineProperty,s=(d,t,e,c)=>{for(var r=void 0,a=d.length-1,l;a>=0;a--)(l=d[a])&&(r=l(t,e,r)||r);return r&&f(t,e,r),r};const o=class o extends m{constructor(){super(...arguments),this.src="",this.name="",this.ingredients=[],this.currentIngredient=null,this._authObserver=new p(this,"blazing:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.loadData()})}updated(t){(t.has("src")||t.has("name"))&&this.loadData()}async loadData(){if(this.src)try{const t=await fetch(this.src,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=t.headers.get("content-type");if(!(e!=null&&e.includes("application/json")))throw new Error("Invalid content type - expected JSON");const c=await t.json();this.ingredients=c.ingredients,this.currentIngredient=this.ingredients.find(r=>r.name.toLowerCase()===this.name.toLowerCase())||null,this.currentIngredient||console.warn(`Ingredient "${this.name}" not found in data`)}catch(t){console.error("Failed to load ingredient data:",t),this.currentIngredient=null}}render(){var t;return(t=this._user)!=null&&t.authenticated?this.currentIngredient?n`
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
                            ${this.currentIngredient.nutrition.map(e=>n`
                                <li>${e.label}: ${e.value}</li>
                            `)}
                        </ul>
                    </div>
                </div>
                <div class="recipes">
                    <h2>Used In Recipes:</h2>
                    <ul>
                        ${this.currentIngredient.recipes.map(e=>n`
                            <li><a href="${e.href}">${e.name}</a></li>`)}
                    </ul>
                </div>
            </div>
        `:n`
                <div class="loading">${this.ingredients.length?"Ingredient not found":"Loading..."}</div>`:n`
                <div class="loading">Please log in to view ingredient information</div>`}};o.styles=[v.styles,g`
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
        `];let i=o;s([u()],i.prototype,"src");s([u()],i.prototype,"name");s([h()],i.prototype,"ingredients");s([h()],i.prototype,"currentIngredient");customElements.define("ingredient-info",i);export{i as I};
