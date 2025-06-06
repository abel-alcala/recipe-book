import {css, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {Auth, define, Dropdown, Events, Observer} from '@calpoly/mustang';
import { globalStyles } from '../styles/globalStyles.css.ts';

export class AppHeader extends LitElement {
    static uses = define({
        "mu-dropdown": Dropdown.Element
    });

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
                                <a @click=${() => {
                                    window.location.href = '/login.html';
                                }}>Sign In</a>
                            </li>
                        </menu>
                    </mu-dropdown>
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

        localStorage.setItem('darkMode', this.isDarkMode.toString());

        const darkModeEvent = new CustomEvent('darkmode:toggle', {
            bubbles: true,
            composed: true,
            detail: { isDarkMode: this.isDarkMode }
        });
        this.dispatchEvent(darkModeEvent);
    }

    _handleSignOut(e: MouseEvent) {
        Events.relay(e, 'auth:message', ['auth/signout']);
        window.location.href = '/app';
    }
}