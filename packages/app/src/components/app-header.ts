import {css, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {Auth, Events, Observer} from '@calpoly/mustang';
import { globalStyles } from '../styles/globalStyles.css.ts';

export class AppHeader extends LitElement {
    _authObserver = new Observer<Auth.Model>(this, 'recipebook:auth');

    @state()
    loggedIn = false;

    @state()
    userid?: string;

    @state()
    isDarkMode = true;

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

        const savedDarkMode = localStorage.getItem('darkMode');
        this.isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';

        if (!this.isDarkMode) {
            this.classList.add('light-mode');
        }
        if (!this.isDarkMode) {
            this.classList.add('light-mode');
        }
    }

    firstUpdated() {
        this._setInitialCheckboxState();
    }

    _setInitialCheckboxState() {
        if (this.shadowRoot) {
            const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (checkbox) {
                checkbox.checked = !this.isDarkMode;
            }
        }
    }

    renderSignInButton() {
        return html`
            <button
                    class="nav-link"
                    @click=${() => {
                        window.location.href = '/public/login.html';
                    }}
            >
                Sign In…
            </button>
        `;
    }

    renderSignOutButton() {
        return html`
            <button
                    class="nav-button"
                    @click=${(e: UIEvent) => {
                        Events.relay(e, 'auth:message', ['auth/signout']);
                        window.location.href = '/app';
                    }}
            >
                Sign Out
            </button>
        `;
    }

    static styles = [
        globalStyles,
        css`
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
                padding: 0 var(--spacing-md);
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

            .user-profile {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .greeting {
                color: var(--color-text-header);
                margin-right: var(--spacing-xs);
            }

            .icon {
                display: inline-block;
                height: 1.5em;
                width: 1.5em;
                vertical-align: middle;
                fill: currentColor;
                margin-right: var(--spacing-xs);
            }

            .logo .icon {
                margin-right: var(--spacing-sm);
                fill: var(--color-accent);
            }

            .nav-link, .nav-button {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                background-color: transparent;
                border: 1px solid transparent;
                cursor: pointer;
                font-size: inherit;
                font-family: inherit;
                line-height: 1.5;
                transition: all 0.2s;
            }

            .nav-button {
                border: 1px solid var(--color-link);
            }

            .nav-link:hover, .nav-button:hover {
                background-color: var(--color-background-hover);
                color: var(--color-link-hover);
                border-color: var(--color-link-hover);
                text-decoration: none;
            }

            .main-nav > label {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                color: var(--color-text-header);
                cursor: pointer;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s;
                user-select: none;
            }

            .main-nav > label:hover {
                background-color: var(--color-background-hover);
            }

            input[type="checkbox"] {
                margin-right: var(--spacing-xs);
                accent-color: var(--color-accent);
                vertical-align: middle;
                cursor: pointer;
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

                .user-profile {
                    width: 100%;
                    justify-content: space-between;
                    margin-bottom: var(--spacing-sm);
                }
            }
        `
    ];

    render() {
        return html`
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
                    <nav>
                        <a href="/app">Home</a>
                    </nav>
                    <div class="user-profile">
                        <svg class="icon">
                            <use href="/icons/icons.svg#user"></use>
                        </svg>
                        <span class="greeting">Hello ${this.userid || "chef"}</span>
                        ${this.loggedIn
                                ? this.renderSignOutButton()
                                : this.renderSignInButton()}
                    </div>
                    <label>
                        <input
                                type="checkbox"
                                autocomplete="off"
                                @change=${this._handleDarkModeToggle}
                                ?checked=${!this.isDarkMode}
                        />
                        Light mode
                    </label>
                </div>
            </div>
        `;
    }

    _handleDarkModeToggle(e: Event) {
        const checkbox = e.target as HTMLInputElement;
        this.isDarkMode = !checkbox.checked;

        if (this.isDarkMode) {
            this.classList.remove('light-mode');
        } else {
            this.classList.add('light-mode');
        }

        if (this.isDarkMode) {
            this.classList.remove('light-mode');
        } else {
            this.classList.add('light-mode');
        }

        const darkModeEvent = new CustomEvent('darkmode:toggle', {
            bubbles: true,
            composed: true,
            detail: { isDarkMode: this.isDarkMode }
        });
        this.dispatchEvent(darkModeEvent);
    }
}