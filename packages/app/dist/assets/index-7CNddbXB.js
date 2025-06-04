(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var Me;class gt extends Error{}gt.prototype.name="InvalidTokenError";function Qi(s){return decodeURIComponent(atob(s).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function tr(s){let t=s.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Qi(t)}catch{return atob(t)}}function ai(s,t){if(typeof s!="string")throw new gt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=s.split(".")[e];if(typeof r!="string")throw new gt(`Invalid token specified: missing part #${e+1}`);let i;try{i=tr(r)}catch(n){throw new gt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new gt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const er="mu:context",ee=`${er}:change`;class ir{constructor(t,e){this._proxy=rr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ir(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function rr(s,t){return new Proxy(s,{get:(r,i,n)=>{if(i==="then")return;const o=Reflect.get(r,i,n);return console.log(`Context['${i}'] => `,o),o},set:(r,i,n,o)=>{const c=s[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(r,i,n,o);if(a){let g=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(g,{property:i,oldValue:c,value:n}),t.dispatchEvent(g)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function sr(s,t){const e=ci(t,s);return new Promise((r,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ci(s,t){const e=`[provides="${s}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const i=t.getRootNode();if(i instanceof ShadowRoot)return ci(s,i.host)}class nr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function li(s="mu:message"){return(t,...e)=>t.dispatchEvent(new nr(e,s))}class oe{constructor(t,e,r="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function or(s){return t=>({...t,...s})}const ie="mu:auth:jwt",hi=class di extends oe{constructor(t,e){super((r,i)=>this.update(r,i),t,di.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:i}=t[1];return e(cr(r)),Kt(i);case"auth/signout":return e(lr()),Kt(this._redirectForLogin);case"auth/redirect":return Kt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};hi.EVENT_TYPE="auth:message";let ui=hi;const pi=li(ui.EVENT_TYPE);function Kt(s,t={}){if(!s)return;const e=window.location.href,r=new URL(s,e);return Object.entries(t).forEach(([i,n])=>r.searchParams.set(i,n)),()=>{console.log("Redirecting to ",s),window.location.assign(r)}}class ar extends ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:Q.authenticateFromLocalStorage()})}connectedCallback(){new ui(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ie),t}}class Q extends G{constructor(t){super();const e=ai(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Q(t);return localStorage.setItem(ie,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ie);return t?Q.authenticate(t):new G}}function cr(s){return or({user:Q.authenticate(s),token:s})}function lr(){return s=>{const t=s.user;return{user:t&&t.authenticated?G.deauthenticate(t):t,token:""}}}function hr(s){return s.authenticated?{Authorization:`Bearer ${s.token||"NO_TOKEN"}`}:{}}function dr(s){return s.authenticated?ai(s.token||""):{}}const Ht=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Q,Provider:ar,User:G,dispatch:pi,headers:hr,payload:dr},Symbol.toStringTag,{value:"Module"}));function Ut(s,t,e){const r=s.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${s.type}:`,i),r.dispatchEvent(i),s.stopPropagation()}function re(s,t="*"){return s.composedPath().find(r=>{const i=r;return i.tagName&&i.matches(t)})}const ur=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:re,relay:Ut},Symbol.toStringTag,{value:"Module"})),pr=new DOMParser;function At(s,...t){const e=s.map((o,c)=>c?[t[c-1],o]:[o]).flat().join(""),r=pr.parseFromString(e,"text/html"),i=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...i),n}function Dt(s){const t=s.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:r};function r(i,n={mode:"open"}){const o=i.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const gr=class gi extends HTMLElement{constructor(){super(),this._state={},Dt(gi.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,i=e.value;r&&(this._state[r]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Ut(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},fr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};gr.template=At`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function fr(s,t){const e=Object.entries(s);for(const[r,i]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return s}const fi=class vi extends oe{constructor(t){super((e,r)=>this.update(e,r),t,vi.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:i}=t[1];e(mr(r,i));break}case"history/redirect":{const{href:r,state:i}=t[1];e(br(r,i));break}}}};fi.EVENT_TYPE="history:message";let ae=fi;class Ue extends ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=vr(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ce(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function vr(s){const t=s.currentTarget,e=r=>r.tagName=="A"&&r.href;if(s.button===0)if(s.composed){const i=s.composedPath().find(e);return i||void 0}else{for(let r=s.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function mr(s,t={}){return history.pushState(t,"",s),()=>({location:document.location,state:history.state})}function br(s,t={}){return history.replaceState(t,"",s),()=>({location:document.location,state:history.state})}const ce=li(ae.EVENT_TYPE),yr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ue,Provider:Ue,Service:ae,dispatch:ce},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const i=new Le(this._provider,t);this._effects.push(i),e(i)}else sr(this._target,this._contextLabel).then(i=>{const n=new Le(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Le{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const mi=class bi extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new P(this,"blazing:auth"),Dt(bi.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$r(i,this._state,e,this.authorization).then(n=>ht(n,this)).then(n=>{const o=`mu-rest-form:${r}`,c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:i}});this.dispatchEvent(c)}).catch(n=>{const o="mu-rest-form:error",c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,i=e.value;r&&(this._state[r]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ht(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ie(this.src,this.authorization).then(e=>{this._state=e,ht(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Ie(this.src,this.authorization).then(i=>{this._state=i,ht(i,this)});break;case"new":r&&(this._state={},ht({},this));break}}};mi.observedAttributes=["src","new","action"];mi.template=At`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ie(s,t){return fetch(s,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${s}:`,e))}function ht(s,t){const e=Object.entries(s);for(const[r,i]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;default:o.value=i;break}}}return s}function $r(s,t,e="PUT",r={}){return fetch(s,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const yi=class $i extends oe{constructor(t,e){super(e,t,$i.EVENT_TYPE,!1)}};yi.EVENT_TYPE="mu:message";let _i=yi;class _r extends ne{constructor(t,e,r){super(e),this._user=new G,this._updateFn=t,this._authObserver=new P(this,r)}connectedCallback(){const t=new _i(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const xr=Object.freeze(Object.defineProperty({__proto__:null,Provider:_r,Service:_i},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,le=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),ze=new WeakMap;let xi=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(le&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ze.set(e,t))}return t}toString(){return this.cssText}};const wr=s=>new xi(typeof s=="string"?s:s+"",void 0,he),kr=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new xi(e,s,he)},Ar=(s,t)=>{if(le)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),i=Rt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}},Ne=le?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return wr(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Er,defineProperty:Sr,getOwnPropertyDescriptor:Pr,getOwnPropertyNames:Cr,getOwnPropertySymbols:Or,getPrototypeOf:Tr}=Object,tt=globalThis,je=tt.trustedTypes,Rr=je?je.emptyScript:"",He=tt.reactiveElementPolyfillSupport,ft=(s,t)=>s,Lt={toAttribute(s,t){switch(t){case Boolean:s=s?Rr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},de=(s,t)=>!Er(s,t),De={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:de};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),tt.litPropertyMetadata??(tt.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&Sr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:n}=Pr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Tr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,r=[...Cr(e),...Or(e)];for(const i of r)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)e.unshift(Ne(i))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ar(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:Lt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Lt;this._$Em=n,this[n]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??de)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(r)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ft("elementProperties")]=new Map,K[ft("finalized")]=new Map,He==null||He({ReactiveElement:K}),(tt.reactiveElementVersions??(tt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,zt=It.trustedTypes,Be=zt?zt.createPolicy("lit-html",{createHTML:s=>s}):void 0,wi="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,ki="?"+O,Mr=`<${ki}>`,F=document,bt=()=>F.createComment(""),yt=s=>s===null||typeof s!="object"&&typeof s!="function",Ai=Array.isArray,Ur=s=>Ai(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Ve=/>/g,N=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Ye=/"/g,Ei=/^(?:script|style|textarea|title)$/i,Lr=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),ut=Lr(1),et=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),We=new WeakMap,H=F.createTreeWalker(F,129);function Si(s,t){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(t):t}const Ir=(s,t)=>{const e=s.length-1,r=[];let i,n=t===2?"<svg>":"",o=dt;for(let c=0;c<e;c++){const a=s[c];let g,f,d=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===dt?f[1]==="!--"?o=Fe:f[1]!==void 0?o=Ve:f[2]!==void 0?(Ei.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??dt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,g=f[1],o=f[3]===void 0?N:f[3]==='"'?Ye:qe):o===Ye||o===qe?o=N:o===Fe||o===Ve?o=dt:(o=N,i=void 0);const h=o===N&&s[c+1].startsWith("/>")?" ":"";n+=o===dt?a+Mr:d>=0?(r.push(g),a.slice(0,d)+wi+a.slice(d)+O+h):a+O+(d===-2?c:h)}return[Si(s,n+(s[e]||"<?>")+(t===2?"</svg>":"")),r]};let se=class Pi{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[g,f]=Ir(t,e);if(this.el=Pi.createElement(g,r),H.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=H.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(wi)){const l=f[o++],h=i.getAttribute(d).split(O),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Nr:p[1]==="?"?jr:p[1]==="@"?Hr:Bt}),i.removeAttribute(d)}else d.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(Ei.test(i.tagName)){const d=i.textContent.split(O),l=d.length-1;if(l>0){i.textContent=zt?zt.emptyScript:"";for(let h=0;h<l;h++)i.append(d[h],bt()),H.nextNode(),a.push({type:2,index:++n});i.append(d[l],bt())}}}else if(i.nodeType===8)if(i.data===ki)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(O,d+1))!==-1;)a.push({type:7,index:n}),d+=O.length-1}n++}}static createElement(t,e){const r=F.createElement("template");return r.innerHTML=t,r}};function it(s,t,e=s,r){var i,n;if(t===et)return t;let o=r!==void 0?(i=e._$Co)==null?void 0:i[r]:e._$Cl;const c=yt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==c&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),c===void 0?o=void 0:(o=new c(s),o._$AT(s,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=o:e._$Cl=o),o!==void 0&&(t=it(s,o._$AS(s,t.values),o,r)),t}let zr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=i;let n=H.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let g;a.type===2?g=new ue(n,n.nextSibling,this,t):a.type===1?g=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(g=new Dr(n,this,t)),this._$AV.push(g),a=r[++c]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=F,i}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},ue=class Ci{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),yt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ur(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==_&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=se.createElement(Si(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new zr(n,this),c=o.u(this.options);o.p(r),this.T(c),this._$AH=o}}_$AC(t){let e=We.get(t.strings);return e===void 0&&We.set(t.strings,e=new se(t)),e}k(t){Ai(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const n of t)i===e.length?e.push(r=new Ci(this.S(bt()),this.S(bt()),this,this.options)):r=e[i],r._$AI(n),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Bt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,i){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const c=t;let a,g;for(t=n[0],a=0;a<n.length-1;a++)g=it(this,c[r+a],e,a),g===et&&(g=this._$AH[a]),o||(o=!yt(g)||g!==this._$AH[a]),g===_?t=_:t!==_&&(t+=(g??"")+n[a+1]),this._$AH[a]=g}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Nr=class extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},jr=class extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Hr=class extends Bt{constructor(t,e,r,i,n){super(t,e,r,i,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??_)===et)return;const r=this._$AH,i=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==_&&(r===_||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Dr=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};const Je=It.litHtmlPolyfillSupport;Je==null||Je(se,ue),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.1.3");const Br=(s,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=i=new ue(t.insertBefore(bt(),n),n,void 0,e??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let X=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Br(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return et}};X._$litElement$=!0,X.finalized=!0,(Me=globalThis.litElementHydrateSupport)==null||Me.call(globalThis,{LitElement:X});const Ke=globalThis.litElementPolyfillSupport;Ke==null||Ke({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fr={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:de},Vr=(s=Fr,t,e)=>{const{kind:r,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,s),r==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,s)},init(c){return c!==void 0&&this.P(o,void 0,s),c}}}if(r==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,s)}}throw Error("Unsupported decorator location: "+r)};function Oi(s){return(t,e)=>typeof e=="object"?Vr(s,t,e):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ti(s){return Oi({...s,state:!0,attribute:!1})}function qr(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function Yr(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ri={};(function(s){var t=function(){var e=function(d,l,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=l);return h},r=[1,9],i=[1,10],n=[1,11],o=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,m,v,b,Vt){var k=b.length-1;switch(v){case 1:return new m.Root({},[b[k-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[b[k-1],b[k]]);break;case 4:case 5:this.$=b[k];break;case 6:this.$=new m.Literal({value:b[k]});break;case 7:this.$=new m.Splat({name:b[k]});break;case 8:this.$=new m.Param({name:b[k]});break;case 9:this.$=new m.Optional({},[b[k-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:i,14:n,15:o},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:n,15:o},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:i,14:n,15:o},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(m,v){this.message=m,this.hash=v};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],m=[null],v=[],b=this.table,Vt="",k=0,Oe=0,Ki=2,Te=1,Zi=v.slice.call(arguments,1),$=Object.create(this.lexer),I={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(I.yy[qt]=this.yy[qt]);$.setInput(l,I.yy),I.yy.lexer=$,I.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var Yt=$.yylloc;v.push(Yt);var Xi=$.options&&$.options.ranges;typeof I.yy.parseError=="function"?this.parseError=I.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gi=function(){var W;return W=$.lex()||Te,typeof W!="number"&&(W=h.symbols_[W]||W),W},w,z,A,Wt,Y={},Ot,C,Re,Tt;;){if(z=p[p.length-1],this.defaultActions[z]?A=this.defaultActions[z]:((w===null||typeof w>"u")&&(w=Gi()),A=b[z]&&b[z][w]),typeof A>"u"||!A.length||!A[0]){var Jt="";Tt=[];for(Ot in b[z])this.terminals_[Ot]&&Ot>Ki&&Tt.push("'"+this.terminals_[Ot]+"'");$.showPosition?Jt="Parse error on line "+(k+1)+`:
`+$.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Jt="Parse error on line "+(k+1)+": Unexpected "+(w==Te?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Jt,{text:$.match,token:this.terminals_[w]||w,line:$.yylineno,loc:Yt,expected:Tt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+z+", token: "+w);switch(A[0]){case 1:p.push(w),m.push($.yytext),v.push($.yylloc),p.push(A[1]),w=null,Oe=$.yyleng,Vt=$.yytext,k=$.yylineno,Yt=$.yylloc;break;case 2:if(C=this.productions_[A[1]][1],Y.$=m[m.length-C],Y._$={first_line:v[v.length-(C||1)].first_line,last_line:v[v.length-1].last_line,first_column:v[v.length-(C||1)].first_column,last_column:v[v.length-1].last_column},Xi&&(Y._$.range=[v[v.length-(C||1)].range[0],v[v.length-1].range[1]]),Wt=this.performAction.apply(Y,[Vt,Oe,k,I.yy,A[1],m,v].concat(Zi)),typeof Wt<"u")return Wt;C&&(p=p.slice(0,-1*C*2),m=m.slice(0,-1*C),v=v.slice(0,-1*C)),p.push(this.productions_[A[1]][0]),m.push(Y.$),v.push(Y._$),Re=b[p[p.length-2]][p[p.length-1]],p.push(Re);break;case 3:return!0}}return!0}},g=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var v=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[v[0],v[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,m,v;if(this.options.backtrack_lexer&&(v={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(v.yylloc.range=this.yylloc.range.slice(0))),m=l[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var b in v)this[b]=v[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,m;this._more||(this.yytext="",this.match="");for(var v=this._currentRules(),b=0;b<v.length;b++)if(p=this._input.match(this.rules[v[b]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=b,this.options.backtrack_lexer){if(l=this.test_match(p,v[b]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,v[m]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,v){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=g;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Yr<"u"&&(s.parser=t,s.Parser=t.Parser,s.parse=function(){return t.parse.apply(t,arguments)})})(Ri);function J(s){return function(t,e){return{displayName:s,props:t,children:e||[]}}}var Mi={Root:J("Root"),Concat:J("Concat"),Literal:J("Literal"),Splat:J("Splat"),Param:J("Param"),Optional:J("Optional")},Ui=Ri.parser;Ui.yy=Mi;var Wr=Ui,Jr=Object.keys(Mi);function Kr(s){return Jr.forEach(function(t){if(typeof s[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:s}}var Li=Kr,Zr=Li,Xr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ii(s){this.captures=s.captures,this.re=s.re}Ii.prototype.match=function(s){var t=this.re.exec(s),e={};if(t)return this.captures.forEach(function(r,i){typeof t[i+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[i+1])}),e};var Gr=Zr({Concat:function(s){return s.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(s){return{re:s.props.value.replace(Xr,"\\$&"),captures:[]}},Splat:function(s){return{re:"([^?]*?)",captures:[s.props.name]}},Param:function(s){return{re:"([^\\/\\?]+)",captures:[s.props.name]}},Optional:function(s){var t=this.visit(s.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(s){var t=this.visit(s.children[0]);return new Ii({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Qr=Gr,ts=Li,es=ts({Concat:function(s,t){var e=s.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(s){return decodeURI(s.props.value)},Splat:function(s,t){return t[s.props.name]?t[s.props.name]:!1},Param:function(s,t){return t[s.props.name]?t[s.props.name]:!1},Optional:function(s,t){var e=this.visit(s.children[0],t);return e||""},Root:function(s,t){t=t||{};var e=this.visit(s.children[0],t);return e?encodeURI(e):!1}}),is=es,rs=Wr,ss=Qr,ns=is;Et.prototype=Object.create(null);Et.prototype.match=function(s){var t=ss.visit(this.ast),e=t.match(s);return e||!1};Et.prototype.reverse=function(s){return ns.visit(this.ast,s)};function Et(s){var t;if(this?t=this:t=Object.create(Et.prototype),typeof s>"u")throw new Error("A route spec is required");return t.spec=s,t.ast=rs.parse(s),t}var os=Et,as=os,cs=as;const ls=qr(cs);var hs=Object.defineProperty,zi=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&hs(t,e,i),i};class $t extends X{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ut`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new ls(i.path)})),this._historyObserver=new P(this,e),this._authObserver=new P(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ut`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(pi(this,"auth/redirect"),ut`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):ut`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ut`
              <h1>Redirecting to ${r}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,i=new URLSearchParams(e),n=r+e;for(const o of this._cases){const c=o.route.match(n);if(c)return{...o,path:r,params:c,query:i}}}redirect(t){ce(this,"history/redirect",{href:t})}}$t.styles=kr`
    :host,
    main {
      display: contents;
    }
  `;zi([Ti()],$t.prototype,"_user");zi([Ti()],$t.prototype,"_match");const ds=Object.freeze(Object.defineProperty({__proto__:null,Element:$t,Switch:$t},Symbol.toStringTag,{value:"Module"})),us=class Ni extends HTMLElement{constructor(){if(super(),Dt(Ni.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};us.template=At`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const ps=class ji extends HTMLElement{constructor(){super(),this._array=[],Dt(ji.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Hi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{re(t,"button.add")?Ut(t,"input-array:add"):re(t,"button.remove")&&Ut(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],gs(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};ps.template=At`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function gs(s,t){t.replaceChildren(),s.forEach((e,r)=>t.append(Hi(e)))}function Hi(s,t){const e=s===void 0?"":`value="${s}"`;return At`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function fs(s){return Object.entries(s).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var vs=Object.defineProperty,ms=Object.getOwnPropertyDescriptor,bs=(s,t,e,r)=>{for(var i=ms(t,e),n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&vs(t,e,i),i};class Di extends X{constructor(t){super(),this._pending=[],this._observer=new P(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,i])=>{console.log("Dispatching queued event",i,r),r.dispatchEvent(i)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}bs([Oi()],Di.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,pe=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Ze=new WeakMap;let Bi=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ze.set(e,t))}return t}toString(){return this.cssText}};const ys=s=>new Bi(typeof s=="string"?s:s+"",void 0,ge),S=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new Bi(e,s,ge)},$s=(s,t)=>{if(pe)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),i=Mt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}},Xe=pe?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ys(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_s,defineProperty:xs,getOwnPropertyDescriptor:ws,getOwnPropertyNames:ks,getOwnPropertySymbols:As,getPrototypeOf:Es}=Object,R=globalThis,Ge=R.trustedTypes,Ss=Ge?Ge.emptyScript:"",Xt=R.reactiveElementPolyfillSupport,vt=(s,t)=>s,Nt={toAttribute(s,t){switch(t){case Boolean:s=s?Ss:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},fe=(s,t)=>!_s(s,t),Qe={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&xs(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:n}=ws(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const c=i==null?void 0:i.call(this);n==null||n.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;const t=Es(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){const e=this.properties,r=[...ks(e),...As(e)];for(const i of r)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)e.unshift(Xe(i))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $s(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Nt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const c=r.getPropertyOptions(i),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((n=c.converter)==null?void 0:n.fromAttribute)!==void 0?c.converter:Nt;this._$Em=i,this[i]=a.fromAttribute(e,c.type)??((o=this._$Ej)==null?void 0:o.get(i))??null,this._$Em=null}}requestUpdate(t,e,r){var i;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??fe)(o,e)||r.useDefault&&r.reflect&&o===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:c}=o,a=this[n];c!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[vt("elementProperties")]=new Map,Z[vt("finalized")]=new Map,Xt==null||Xt({ReactiveElement:Z}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,jt=mt.trustedTypes,ti=jt?jt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Fi="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Vi="?"+T,Ps=`<${Vi}>`,V=document,_t=()=>V.createComment(""),xt=s=>s===null||typeof s!="object"&&typeof s!="function",ve=Array.isArray,Cs=s=>ve(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ei=/-->/g,ii=/>/g,j=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ri=/'/g,si=/"/g,qi=/^(?:script|style|textarea|title)$/i,Os=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),u=Os(1),rt=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),ni=new WeakMap,D=V.createTreeWalker(V,129);function Yi(s,t){if(!ve(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ti!==void 0?ti.createHTML(t):t}const Ts=(s,t)=>{const e=s.length-1,r=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=pt;for(let c=0;c<e;c++){const a=s[c];let g,f,d=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===pt?f[1]==="!--"?o=ei:f[1]!==void 0?o=ii:f[2]!==void 0?(qi.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=i??pt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,g=f[1],o=f[3]===void 0?j:f[3]==='"'?si:ri):o===si||o===ri?o=j:o===ei||o===ii?o=pt:(o=j,i=void 0);const h=o===j&&s[c+1].startsWith("/>")?" ":"";n+=o===pt?a+Ps:d>=0?(r.push(g),a.slice(0,d)+Fi+a.slice(d)+T+h):a+T+(d===-2?c:h)}return[Yi(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class wt{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[g,f]=Ts(t,e);if(this.el=wt.createElement(g,r),D.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=D.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Fi)){const l=f[o++],h=i.getAttribute(d).split(T),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ms:p[1]==="?"?Us:p[1]==="@"?Ls:Ft}),i.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(qi.test(i.tagName)){const d=i.textContent.split(T),l=d.length-1;if(l>0){i.textContent=jt?jt.emptyScript:"";for(let h=0;h<l;h++)i.append(d[h],_t()),D.nextNode(),a.push({type:2,index:++n});i.append(d[l],_t())}}}else if(i.nodeType===8)if(i.data===Vi)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:n}),d+=T.length-1}n++}}static createElement(t,e){const r=V.createElement("template");return r.innerHTML=t,r}}function st(s,t,e=s,r){var o,c;if(t===rt)return t;let i=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl;const n=xt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=i:e._$Cl=i),i!==void 0&&(t=st(s,i._$AS(s,t.values),i,r)),t}class Rs{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??V).importNode(e,!0);D.currentNode=i;let n=D.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let g;a.type===2?g=new St(n,n.nextSibling,this,t):a.type===1?g=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(g=new Is(n,this,t)),this._$AV.push(g),a=r[++c]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=V,i}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),xt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Cs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=wt.createElement(Yi(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Rs(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=ni.get(t.strings);return e===void 0&&ni.set(t.strings,e=new wt(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const n of t)i===e.length?e.push(r=new St(this.O(_t()),this.O(_t()),this,this.options)):r=e[i],r._$AI(n),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,n){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=x}_$AI(t,e=this,r,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!xt(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const c=t;let a,g;for(t=n[0],a=0;a<n.length-1;a++)g=st(this,c[r+a],e,a),g===rt&&(g=this._$AH[a]),o||(o=!xt(g)||g!==this._$AH[a]),g===x?t=x:t!==x&&(t+=(g??"")+n[a+1]),this._$AH[a]=g}o&&!i&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ms extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}}class Us extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}}class Ls extends Ft{constructor(t,e,r,i,n){super(t,e,r,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??x)===rt)return;const r=this._$AH,i=t===x&&r!==x||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==x&&(r===x||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Is{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Qt=mt.litHtmlPolyfillSupport;Qt==null||Qt(wt,St),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.0");const zs=(s,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=i=new St(t.insertBefore(_t(),n),n,void 0,e??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=globalThis;class E extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=zs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return rt}}var oi;E._$litElement$=!0,E.finalized=!0,(oi=B.litElementHydrateSupport)==null||oi.call(B,{LitElement:E});const te=B.litElementPolyfillSupport;te==null||te({LitElement:E});(B.litElementVersions??(B.litElementVersions=[])).push("4.2.0");const Ns={};function js(s,t,e){switch(s[0]){case"chef/load":Hs(s[1],e).then(i=>t(n=>({...n,chef:i}))).catch(i=>{console.error("Failed to load chef:",i)});break;case"chef/save":Ds(s[1],e).then(i=>t(n=>({...n,chef:i}))).catch(i=>{console.error("Failed to save chef:",i)});break;case"chefs/load":Bs(e).then(i=>t(n=>({...n,chefs:i}))).catch(i=>{console.error("Failed to load chefs:",i)});break;default:const r=s[0];throw new Error(`Unhandled message "${r}"`)}}function Hs(s,t){return fetch(`/api/chefs/${s.chefId}`,{headers:Ht.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load chef: ${e.status}`)}).then(e=>(console.log("Chef loaded:",e),e))}function Ds(s,t){return fetch(`/api/chefs/${s.chefId}`,{method:"PUT",headers:{...Ht.headers(t),"Content-Type":"application/json"},body:JSON.stringify(s.chef)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save chef: ${e.status}`)}).then(e=>(console.log("Chef saved:",e),e))}function Bs(s){return fetch("/api/chefs",{headers:Ht.headers(s)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load chefs: ${t.status}`)}).then(t=>(console.log("Chefs loaded:",t),t))}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fs={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:fe},Vs=(s=Fs,t,e)=>{const{kind:r,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),r==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),r==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,s)},init(c){return c!==void 0&&this.C(o,void 0,s,c),c}}}if(r==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,s)}}throw Error("Unsupported decorator location: "+r)};function L(s){return(t,e)=>typeof e=="object"?Vs(s,t,e):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(s){return L({...s,state:!0,attribute:!1})}const qs=S`
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
`,Ys=S`
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
        margin: var(--spacing-xl) 0;
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
`,q=[qs,Ys];var Ws=Object.defineProperty,me=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&Ws(t,e,i),i};const xe=class xe extends E{constructor(){super(...arguments),this._authObserver=new P(this,"recipebook:auth"),this.loggedIn=!1,this.isDarkMode=!0}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:r}=e;r&&r.authenticated?(this.loggedIn=!0,this.userid=r.username):(this.loggedIn=!1,this.userid=void 0),this.requestUpdate()});const t=localStorage.getItem("darkMode");this.isDarkMode=t===null?!0:t==="true",this.isDarkMode||this.classList.add("light-mode"),this.isDarkMode||this.classList.add("light-mode")}firstUpdated(){this._setInitialCheckboxState()}_setInitialCheckboxState(){if(this.shadowRoot){const t=this.shadowRoot.querySelector('input[type="checkbox"]');t&&(t.checked=!this.isDarkMode)}}renderSignInButton(){return u`
            <button
                    class="nav-link"
                    @click=${()=>{window.location.href="/public/login.html"}}
            >
                Sign In…
            </button>
        `}renderSignOutButton(){return u`
            <button
                    class="nav-button"
                    @click=${t=>{ur.relay(t,"auth:message",["auth/signout"]),window.location.href="/app"}}
            >
                Sign Out
            </button>
        `}render(){return u`
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
                        <span class="greeting">Hello ${this.userid||"chef"}</span>
                        ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
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
        `}_handleDarkModeToggle(t){const e=t.target;this.isDarkMode=!e.checked,this.isDarkMode?this.classList.remove("light-mode"):this.classList.add("light-mode"),this.isDarkMode?this.classList.remove("light-mode"):this.classList.add("light-mode");const r=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{isDarkMode:this.isDarkMode}});this.dispatchEvent(r)}};xe.styles=[q,S`
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
        `];let nt=xe;me([y()],nt.prototype,"loggedIn");me([y()],nt.prototype,"userid");me([y()],nt.prototype,"isDarkMode");var Js=Object.defineProperty,Pt=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&Js(t,e,i),i};const we=class we extends E{constructor(){super(...arguments),this.viewMode="recipes",this.recipes=[],this.mealPlans=[],this.loading=!0,this.error=null}connectedCallback(){super.connectedCallback(),this.fetchData()}async fetchData(){this.loading=!0,this.error=null;try{const[t,e]=await Promise.all([fetch("/api/recipes"),fetch("/api/mealplans")]);if(!t.ok||!e.ok)throw new Error("Failed to fetch data from server");const r=await t.json(),i=await e.json();if(!Array.isArray(r)||!Array.isArray(i))throw new Error("Invalid data format received from server");this.recipes=r,this.mealPlans=i}catch(t){this.error="Unable to load content",console.error("Error fetching data:",t)}finally{this.loading=!1}}handleViewToggle(t){this.viewMode=t}renderContent(){if(this.loading)return u`
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading delicious content...</div>
                </div>
            `;if(this.error)return u`
                <div class="error-container">
                    <div class="error-message">${this.error}</div>
                    <button class="retry-button" @click=${this.fetchData}>
                        Try Again
                    </button>
                </div>
            `;const t=this.viewMode==="recipes"?this.recipes:this.mealPlans;return t.length===0?u`
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>No ${this.viewMode==="recipes"?"recipes":"meal plans"} found</h3>
                    <p>Check back later for new content!</p>
                </div>
            `:u`
            <div class="content-grid">
                ${t.map(e=>this.renderCard(e))}
            </div>
        `}renderCard(t){const e="cookingTime"in t,r=e?`/app/recipe/${t.idName}`:`/app/mealplan/${t.idName}`;if(e){const i=t;return u`
                <a href=${r} class="item-card">
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
            `}else{const i=t;return u`
                <a href=${r} class="item-card">
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
            `}}render(){return u`
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

                <div class="content-section">
                    ${this.renderContent()}
                </div>
            </div>
        `}};we.styles=[q,S`
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
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
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

            .content-section {
                animation: fadeIn 0.5s ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
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

            /* Loading State */
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
                to { transform: rotate(360deg); }
            }

            .loading-text {
                color: var(--color-text-muted);
                font-size: 1.1rem;
            }

            /* Error State */
            .error-container {
                text-align: center;
                padding: var(--spacing-xxl);
                background: var(--color-background-card);
                border-radius: var(--border-radius-lg);
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .error-message {
                color: #ef4444;
                font-size: 1.1rem;
                margin-bottom: var(--spacing-lg);
            }

            .retry-button {
                background: var(--color-accent);
                color: white;
                padding: var(--spacing-sm) var(--spacing-xl);
                border: none;
                border-radius: var(--border-radius-md);
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .retry-button:hover {
                background: var(--color-accent-alt);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(158, 206, 106, 0.3);
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

            /* Responsive */
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
            }
        `];let M=we;Pt([y()],M.prototype,"viewMode");Pt([y()],M.prototype,"recipes");Pt([y()],M.prototype,"mealPlans");Pt([y()],M.prototype,"loading");Pt([y()],M.prototype,"error");var Ks=Object.defineProperty,be=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&Ks(t,e,i),i};const ke=class ke extends E{constructor(){super(...arguments),this.loading=!0,this._authObserver=new P(this,"recipebook:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.loadRecipe()})}updated(t){var e;t.has("recipeId")&&((e=this._user)!=null&&e.authenticated)&&this.loadRecipe()}async loadRecipe(){if(this.recipeId){this.loading=!0;try{const t=await fetch(`/api/recipes/${this.recipeId}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.recipe=await t.json()}catch(t){console.error("Failed to load recipe:",t)}finally{this.loading=!1}}}render(){var t;return(t=this._user)!=null&&t.authenticated?this.loading?u`<div class="loading">Loading recipe...</div>`:this.recipe?u`
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
                                    ${this.recipe.ingredients.map(e=>u`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                                <h2>Included in Meal Plans</h2>
                                <ul>
                                    ${this.recipe.mealPlans.map(e=>u`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                            </div>
                            <div class="steps-section">
                                <h2>Preparation Steps</h2>
                                <ol>
                                    ${this.recipe.steps.map(e=>u`
                                        <li>${e}</li>
                                    `)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:u`<div class="loading">Recipe not found</div>`:u`
                <div class="loading">Please log in to view recipe information</div>
            `}};ke.styles=[q,S`
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

            @media (max-width: 768px) {
                .recipe-image img {
                    max-width: 100%;
                }
            }
        `];let ot=ke;be([L({attribute:"recipe-id"})],ot.prototype,"recipeId");be([y()],ot.prototype,"recipe");be([y()],ot.prototype,"loading");var Zs=Object.defineProperty,Xs=Object.getOwnPropertyDescriptor,Wi=(s,t,e,r)=>{for(var i=r>1?void 0:r?Xs(t,e):t,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(t,e,i):o(i))||i);return r&&i&&Zs(t,e,i),i};const Ae=class Ae extends Di{get chef(){return this.model.chef}constructor(){super("recipebook:model")}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="chef-id"&&e!==r&&r&&(console.log("Loading chef:",r),this.dispatchMessage(["chef/load",{chefId:r}]))}render(){return this.model.chef,!this.chef&&this.chefId?u`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?u`
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
                            ${this.chef.favoriteDishes.map(t=>u`
                                <li>${t}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Recipes by ${this.chef.name}</h2>
                        <ul>
                            ${this.chef.recipes.map(t=>u`
                                <li><a href="${t.href}">${t.name}</a></li>
                            `)}
                        </ul>
                    </div>
                </div>
            </div>
        `:u`
                <div class="container">
                    <div class="loading">Chef not found</div>
                </div>
            `}};Ae.styles=[q,S`
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
        `];let kt=Ae;Wi([L({attribute:"chef-id"})],kt.prototype,"chefId",2);Wi([y()],kt.prototype,"chef",1);var Gs=Object.defineProperty,ye=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&Gs(t,e,i),i};const Ee=class Ee extends E{constructor(){super(...arguments),this.loading=!0,this._authObserver=new P(this,"recipebook:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.loadIngredient()})}updated(t){var e;t.has("ingredientId")&&((e=this._user)!=null&&e.authenticated)&&this.loadIngredient()}async loadIngredient(){if(this.ingredientId){this.loading=!0;try{const t=await fetch(`/api/ingredients/${this.ingredientId}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.ingredient=await t.json()}catch(t){console.error("Failed to load ingredient:",t)}finally{this.loading=!1}}}render(){var t;return(t=this._user)!=null&&t.authenticated?this.loading?u`
                <div class="container">
                    <div class="loading">Loading ingredient...</div>
                </div>
            `:this.ingredient?u`
            <div class="container">
                <div class="ingredient-card">
                    <h1>${this.ingredient.name}</h1>
                    <p class="description">${this.ingredient.description}</p>

                    ${this.ingredient.nutritionalInfo?u`
                        <div class="section">
                            <h2>Nutritional Information (per serving)</h2>
                            <div class="nutrition-grid">
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.calories}</div>
                                    <div class="nutrition-label">Calories</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.protein}</div>
                                    <div class="nutrition-label">Protein</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.carbs}</div>
                                    <div class="nutrition-label">Carbs</div>
                                </div>
                                <div class="nutrition-item">
                                    <div class="nutrition-value">${this.ingredient.nutritionalInfo.fat}</div>
                                    <div class="nutrition-label">Fat</div>
                                </div>
                            </div>
                        </div>
                    `:""}

                    ${this.ingredient.storageInstructions?u`
                        <div class="section">
                            <h2>Storage Instructions</h2>
                            <p>${this.ingredient.storageInstructions}</p>
                        </div>
                    `:""}

                    ${this.ingredient.recipesUsing&&this.ingredient.recipesUsing.length>0?u`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipesUsing.map(e=>u`
                                    <li><a href="${e.href}">${e.name}</a></li>
                                `)}
                            </ul>
                        </div>
                    `:""}
                </div>
            </div>
        `:u`
                <div class="container">
                    <div class="loading">Ingredient not found</div>
                </div>
            `:u`
                <div class="container">
                    <div class="loading">Please log in to view ingredient information</div>
                </div>
            `}};Ee.styles=[q,S`
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
        `];let at=Ee;ye([L({attribute:"ingredient-id"})],at.prototype,"ingredientId");ye([y()],at.prototype,"ingredient");ye([y()],at.prototype,"loading");var Qs=Object.defineProperty,$e=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&Qs(t,e,i),i};const Se=class Se extends E{constructor(){super(...arguments),this.loading=!0,this._authObserver=new P(this,"recipebook:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.loadCuisine()})}updated(t){var e;t.has("cuisineId")&&((e=this._user)!=null&&e.authenticated)&&this.loadCuisine()}async loadCuisine(){if(this.cuisineId){this.loading=!0;try{const t=await fetch(`/api/cuisines/${this.cuisineId}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.cuisine=await t.json()}catch(t){console.error("Failed to load cuisine:",t)}finally{this.loading=!1}}}render(){var t;return(t=this._user)!=null&&t.authenticated?this.loading?u`
                <div class="container">
                    <div class="loading">Loading cuisine...</div>
                </div>
            `:this.cuisine?u`
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
                            ${this.cuisine.popularIngredients.map(e=>u`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="info-section">
                        <h2>Typical Dishes</h2>
                        <ul class="tag-list">
                            ${this.cuisine.typicalDishes.map(e=>u`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes from ${this.cuisine.name}</h2>
                    <div class="recipe-grid">
                        ${this.cuisine.recipes.map(e=>u`
                            <a href="${e.href}" class="recipe-card">
                                ${e.imageUrl?u`
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
        `:u`
                <div class="container">
                    <div class="loading">Cuisine not found</div>
                </div>
            `:u`
                <div class="container">
                    <div class="loading">Please log in to view cuisine information</div>
                </div>
            `}};Se.styles=[q,S`
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
        `];let ct=Se;$e([L({attribute:"cuisine-id"})],ct.prototype,"cuisineId");$e([y()],ct.prototype,"cuisine");$e([y()],ct.prototype,"loading");var tn=Object.defineProperty,_e=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&tn(t,e,i),i};const Pe=class Pe extends E{constructor(){super(...arguments),this.loading=!0,this._authObserver=new P(this,"recipebook:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.loadMealPlan()})}updated(t){var e;t.has("mealplanId")&&((e=this._user)!=null&&e.authenticated)&&this.loadMealPlan()}async loadMealPlan(){if(this.mealplanId){this.loading=!0;try{const t=await fetch(`/api/mealplans/${this.mealplanId}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.mealplan=await t.json()}catch(t){console.error("Failed to load meal plan:",t)}finally{this.loading=!1}}}render(){var t;return(t=this._user)!=null&&t.authenticated?this.loading?u`
                <div class="container">
                    <div class="loading">Loading meal plan...</div>
                </div>
            `:this.mealplan?u`
            <div class="container">
                <div class="mealplan-header">
                    <h1>${this.mealplan.name}</h1>
                    <div class="meta-info">
                        <span class="meta-item"><strong>Duration:</strong> ${this.mealplan.duration}</span>
                        <span class="meta-item"><strong>Meal Types:</strong> ${this.mealplan.mealTypes.join(", ")}</span>
                    </div>
                    <p class="purpose"><strong>Purpose:</strong> ${this.mealplan.purpose}</p>
                </div>

                <div class="recipes-section">
                    <h2>Included Recipes</h2>
                    <div class="recipe-list">
                        ${this.mealplan.recipes.map(e=>u`
                            <div class="recipe-item">
                                <div class="recipe-info">
                                    <div class="recipe-name">${e.name}</div>
                                    ${e.day||e.mealType?u`
                                        <div class="recipe-schedule">
                                            ${e.day?e.day:""}
                                            ${e.day&&e.mealType?" - ":""}
                                            ${e.mealType?e.mealType:""}
                                        </div>
                                    `:""}
                                </div>
                                <a href="${e.href}" class="recipe-link">View Recipe →</a>
                            </div>
                        `)}
                    </div>
                    
                    <div class="meal-types">
                        ${this.mealplan.mealTypes.map(e=>u`
                            <span class="meal-type-tag">${e}</span>
                        `)}
                    </div>
                </div>
            </div>
        `:u`
                <div class="container">
                    <div class="loading">Meal plan not found</div>
                </div>
            `:u`
                <div class="container">
                    <div class="loading">Please log in to view meal plans</div>
                </div>
            `}};Pe.styles=[q,S`
            :host {
                min-height: 100vh;
            }

            .mealplan-header {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
                margin-bottom: var(--spacing-xl);
            }

            .purpose {
                font-size: 1.1rem;
                line-height: 1.6;
                color: var(--color-text);
                margin-top: var(--spacing-md);
            }

            .recipes-section {
                background: var(--color-background-card);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-xl);
            }

            .recipe-list {
                display: grid;
                gap: var(--spacing-md);
            }

            .recipe-item {
                background: var(--color-background);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s;
            }

            .recipe-item:hover {
                background-color: var(--color-background-hover);
            }

            .recipe-info {
                flex: 1;
            }

            .recipe-name {
                font-size: 1.1rem;
                font-weight: 500;
                color: var(--color-primary);
                margin-bottom: var(--spacing-xs);
            }

            .recipe-schedule {
                font-size: 0.9rem;
                color: var(--color-text-muted);
            }

            .recipe-link {
                color: var(--color-link);
                text-decoration: none;
                padding: var(--spacing-xs) var(--spacing-sm);
                border: 1px solid var(--color-link);
                border-radius: var(--border-radius-sm);
                transition: background-color 0.2s, color 0.2s;
                white-space: nowrap;
            }

            .recipe-link:hover {
                background-color: var(--color-link);
                color: white;
                text-decoration: none;
            }

            .meal-types {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                margin-top: var(--spacing-md);
            }
        `];let lt=Pe;_e([L({attribute:"mealplan-id"})],lt.prototype,"mealplanId");_e([y()],lt.prototype,"mealplan");_e([y()],lt.prototype,"loading");var en=Object.defineProperty,Ct=(s,t,e,r)=>{for(var i=void 0,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(t,e,i)||i);return i&&en(t,e,i),i};const Ce=class Ce extends E{constructor(){super(...arguments),this.formData={},this.redirect="/app",this.loading=!1}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return u`
            <form
                    @change=${t=>this.handleChange(t)}
                    @submit=${t=>this.handleSubmit(t)}
            >
                <slot></slot>
                <slot name="button">
                    <button ?disabled=${!this.canSubmit||this.loading} type="submit">
                        ${this.loading?"Loading…":"Login"}
                    </button>
                </slot>
                <p class="error">${this.error}</p>
            </form>
        `}handleChange(t){const e=t.target,r=e==null?void 0:e.name,i=e==null?void 0:e.value,n=this.formData;switch(r){case"username":this.formData={...n,username:i};break;case"password":this.formData={...n,password:i};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&(this.loading=!0,fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw new Error("Login failed");return e.json()}).then(e=>{const{token:r}=e,i=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:this.redirect}]});console.log("dispatching message",i),this.dispatchEvent(i)}).catch(e=>{console.log(e),this.error=e.toString()}).finally(()=>this.loading=!1))}};Ce.styles=S`
        .error:not(:empty) {
            color: red;
            border: 1px solid red;
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
        }
    `;let U=Ce;Ct([y()],U.prototype,"formData");Ct([L()],U.prototype,"api");Ct([L()],U.prototype,"redirect");Ct([y()],U.prototype,"error");Ct([y()],U.prototype,"loading");const rn=S`
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
`,Ji=document.createElement("style");Ji.textContent=rn.cssText;document.head.append(Ji);const sn=[{path:"/app/recipe/:id",view:s=>u`
      <recipe-view recipe-id=${s.id}></recipe-view>
    `},{path:"/app/chef/:id",view:s=>u`
      <chef-view chef-id=${s.id}></chef-view>
    `},{path:"/app/ingredient/:id",view:s=>u`
      <ingredient-view ingredient-id=${s.id}></ingredient-view>
    `},{path:"/app/cuisine/:id",view:s=>u`
      <cuisine-view cuisine-id=${s.id}></cuisine-view>
    `},{path:"/app/mealplan/:id",view:s=>u`
      <mealplan-view mealplan-id=${s.id}></mealplan-view>
    `},{path:"/app/mealplan",view:()=>u`
      <mealplan-list-view></mealplan-list-view>
    `},{path:"/app/recipes",view:()=>u`
      <recipes-list-view></recipes-list-view>
    `},{path:"/app",view:()=>u`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];fs({"mu-auth":Ht.Provider,"mu-history":yr.Provider,"mu-store":class extends xr.Provider{constructor(){super(js,Ns,"recipebook:auth")}},"app-header":nt,"home-view":M,"recipe-view":ot,"chef-view":kt,"ingredient-view":at,"cuisine-view":ct,"mealplan-view":lt,"login-form":U,"mu-switch":class extends ds.Element{constructor(){super(sn,"recipebook:history","recipebook:auth")}}});document.addEventListener("DOMContentLoaded",()=>{const s=localStorage.getItem("darkMode");(s===null?!0:s==="true")||document.body.classList.add("light-mode"),document.body.addEventListener("darkmode:toggle",e=>{const i=e.detail.isDarkMode;i?document.body.classList.remove("light-mode"):document.body.classList.add("light-mode"),localStorage.setItem("darkMode",i.toString())})});
