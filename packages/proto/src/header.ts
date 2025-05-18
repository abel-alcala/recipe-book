import {css, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {Auth, Events, Observer} from '@calpoly/mustang';

export class HeaderElement extends LitElement {
    _authObserver = new Observer<Auth.Model>(this, 'blazing:auth');

    @state()
    loggedIn = false;

    @state()
    userid?: string;

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((authModel: Auth.Model) => {
            const {user} = authModel;
            if (user && user.authenticated) {
                this.loggedIn = true;
                this.userid = user.username;
            } else {
                this.loggedIn = false;
                this.userid = undefined;
            }
            this.requestUpdate();
        });
    }

    firstUpdated() {
        this._setInitialCheckboxState();
    }

    _setInitialCheckboxState() {
        if (this.shadowRoot) {
            const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (checkbox) {
                checkbox.checked = document.body.classList.contains('light-mode');
            }
        }
    }


    renderSignInButton() {
        return html`
            <a href="/login.html" class="nav-link">
                Sign In…
            </a>
        `;
    }

    renderSignOutButton() {
        return html`
            <button
                    class="nav-button"
                    @click=${(e: UIEvent) => {
                        Events.relay(e, 'auth:message', ['auth/signout']);
                    }}
            >
                Sign Out
            </button>
        `;
    }

    static styles = css`
        :host {
            display: block;
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: var(--color-background-header, #16161e);
            color: var(--color-text-header, #c0caf5);
            padding: var(--spacing-md, 1rem) 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: var(--font-body, "Lora", serif);
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: var(--spacing-md, 1rem);
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-md, 1rem);
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm, 0.5rem);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--color-accent, #9ece6a);
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .main-nav {
            display: flex;
            gap: var(--spacing-md, 1rem);
            align-items: center;
            flex-wrap: wrap;
        }

        .main-nav nav {
            display: flex;
            gap: var(--spacing-sm, 0.5rem);
            align-items: center;
        }

        .main-nav nav a {
            color: var(--color-link, #7aa2f7);
            text-decoration: none;
            padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
            border-radius: var(--border-radius-sm, 4px);
            transition: background-color 0.2s, color 0.2s;
        }

        .main-nav nav a:hover {
            background-color: rgba(42, 157, 143, 0.1);
            color: var(--color-link-hover, #bb9af7);
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm, 0.5rem);
        }

        .greeting {
            color: inherit;
            margin-right: var(--spacing-xs, 0.25rem);
        }

        .icon {
            display: inline-block;
            height: 1.5em;
            width: 1.5em;
            vertical-align: middle;
            fill: currentColor;
            margin-right: var(--spacing-xs, 0.25rem);
        }

        .logo .icon {
            margin-right: var(--spacing-sm, 0.5rem);
            fill: var(--color-accent, #9ece6a);
        }

        .nav-link, .nav-button {
            color: var(--color-link, #7aa2f7);
            text-decoration: none;
            padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
            border-radius: var(--border-radius-sm, 4px);
            background-color: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            font-size: inherit;
            font-family: inherit;
            line-height: 1.5;
        }

        .nav-link:hover, .nav-button:hover {
            background-color: rgba(42, 157, 143, 0.1);
            color: var(--color-link-hover, #bb9af7);
            border-color: rgba(42, 157, 143, 0.2);
        }

        .main-nav > label {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs, 0.25rem);
            color: inherit;
            cursor: pointer;
            padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
            border-radius: var(--border-radius-sm, 4px);
            transition: background-color 0.2s;
        }

        .main-nav > label:hover {
            background-color: rgba(42, 157, 143, 0.1);
        }

        input[type="checkbox"] {
            margin-right: var(--spacing-xs, 0.25rem);
            accent-color: var(--color-accent, #9ece6a);
            vertical-align: middle;
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
            }

            .main-nav nav {
                margin-bottom: var(--spacing-sm, 0.5rem);
                flex-wrap: wrap;
            }

            .user-profile {
                margin-bottom: var(--spacing-sm, 0.5rem);
            }
        }
    `;

    render() {
        return html`
            <div class="header-container">
                <div class="logo-container">
                    <a href="/index.html" class="logo">
                        <svg class="icon">
                            <use href="/icons/icons.svg#utensils"></use>
                        </svg>
                        RecipeBook
                    </a>
                </div>
                <div class="main-nav">
                    <nav>
                        <a href="/index.html">Home</a>
                        <a href="/mealplan.html">Meal Plans</a>
                        <a href="#">Recipes</a>
                    </nav>
                    <div class="user-profile">
                        <svg class="icon">
                            <use href="/icons/icons.svg#user"></use>
                        </svg>
                        <span class="greeting"> Hello ${this.userid || "chef"}</span>
                        ${this.loggedIn
                                ? this.renderSignOutButton()
                                : this.renderSignInButton()}
                    </div>
                    <label>
                        <input type="checkbox" autocomplete="off" @change=${this._handleDarkModeToggle}/>
                        Dark mode
                    </label>
                </div>
            </div>
        `;
    }

    _handleDarkModeToggle(e: Event) {
        const checkbox = e.target as HTMLInputElement;
        const newIsDarkModeState = !checkbox.checked;
        const darkModeEvent = new CustomEvent('darkmode:toggle', {
            bubbles: true,
            composed: true,
            detail: {isDarkMode: newIsDarkModeState}
        });
        this.dispatchEvent(darkModeEvent);
    }
}