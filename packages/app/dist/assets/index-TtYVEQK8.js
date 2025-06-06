(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var Ut;class ue extends Error{}ue.prototype.name="InvalidTokenError";function nr(s){return decodeURIComponent(atob(s).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function ar(s){let e=s.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return nr(e)}catch{return atob(e)}}function li(s,e){if(typeof s!="string")throw new ue("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,r=s.split(".")[t];if(typeof r!="string")throw new ue(`Invalid token specified: missing part #${t+1}`);let i;try{i=ar(r)}catch(o){throw new ue(`Invalid token specified: invalid base64 for part #${t+1} (${o.message})`)}try{return JSON.parse(i)}catch(o){throw new ue(`Invalid token specified: invalid json for part #${t+1} (${o.message})`)}}const cr="mu:context",ot=`${cr}:change`;class lr{constructor(e,t){this._proxy=dr(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class lt extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new lr(e,this),this.style.display="contents"}attach(e){return this.addEventListener(ot,e),e}detach(e){this.removeEventListener(ot,e)}}function dr(s,e){return new Proxy(s,{get:(r,i,o)=>{if(i==="then")return;const n=Reflect.get(r,i,o);return console.log(`Context['${i}'] => `,n),n},set:(r,i,o,n)=>{const c=s[i];console.log(`Context['${i.toString()}'] <= `,o);const a=Reflect.set(r,i,o,n);if(a){let g=new CustomEvent(ot,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(g,{property:i,oldValue:c,value:o}),e.dispatchEvent(g)}else console.log(`Context['${i}] was not set to ${o}`);return a}})}function hr(s,e){const t=di(e,s);return new Promise((r,i)=>{if(t){const o=t.localName;customElements.whenDefined(o).then(()=>r(t))}else i({context:e,reason:`No provider for this context "${e}:`})})}function di(s,e){const t=`[provides="${s}"]`;if(!e||e===document.getRootNode())return;const r=e.closest(t);if(r)return r;const i=e.getRootNode();if(i instanceof ShadowRoot)return di(s,i.host)}class pr extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function hi(s="mu:message"){return(e,...t)=>e.dispatchEvent(new pr(t,s))}class dt{constructor(e,t,r="service:message",i=!0){this._pending=[],this._context=t,this._update=e,this._eventType=r,this._running=i}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const r=t.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function ur(s){return e=>({...e,...s})}const nt="mu:auth:jwt",pi=class ui extends dt{constructor(e,t){super((r,i)=>this.update(r,i),e,ui.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:r,redirect:i}=e[1];return t(fr(r)),Qe(i);case"auth/signout":return t(mr()),Qe(this._redirectForLogin);case"auth/redirect":return Qe(this._redirectForLogin,{next:window.location.href});default:const o=e[0];throw new Error(`Unhandled Auth message "${o}"`)}}};pi.EVENT_TYPE="auth:message";let gi=pi;const fi=hi(gi.EVENT_TYPE);function Qe(s,e={}){if(!s)return;const t=window.location.href,r=new URL(s,t);return Object.entries(e).forEach(([i,o])=>r.searchParams.set(i,o)),()=>{console.log("Redirecting to ",s),window.location.assign(r)}}class gr extends lt{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:Q.authenticateFromLocalStorage()})}connectedCallback(){new gi(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(nt),e}}class Q extends G{constructor(e){super();const t=li(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new Q(e);return localStorage.setItem(nt,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(nt);return e?Q.authenticate(e):new G}}function fr(s){return ur({user:Q.authenticate(s),token:s})}function mr(){return s=>{const e=s.user;return{user:e&&e.authenticated?G.deauthenticate(e):e,token:""}}}function vr(s){return s.authenticated?{Authorization:`Bearer ${s.token||"NO_TOKEN"}`}:{}}function br(s){return s.authenticated?li(s.token||""):{}}const P=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Q,Provider:gr,User:G,dispatch:fi,headers:vr,payload:br},Symbol.toStringTag,{value:"Module"}));function ze(s,e,t){const r=s.target,i=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${s.type}:`,i),r.dispatchEvent(i),s.stopPropagation()}function at(s,e="*"){return s.composedPath().find(r=>{const i=r;return i.tagName&&i.matches(e)})}const yr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:at,relay:ze},Symbol.toStringTag,{value:"Module"})),$r=new DOMParser;function Pe(s,...e){const t=s.map((n,c)=>c?[e[c-1],n]:[n]).flat().join(""),r=$r.parseFromString(t,"text/html"),i=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...i),o}function Ye(s){const e=s.firstElementChild,t=e&&e.tagName==="TEMPLATE"?e:void 0;return{attach:r};function r(i,o={mode:"open"}){const n=i.attachShadow(o);return t&&n.appendChild(t.content.cloneNode(!0)),n}}const mi=class vi extends HTMLElement{constructor(){super(),this._state={},Ye(vi.template).attach(this),this.addEventListener("change",e=>{const t=e.target;if(t){const r=t.name,i=t.value;r&&(this._state[r]=i)}}),this.form&&this.form.addEventListener("submit",e=>{e.preventDefault(),ze(e,"mu-form:submit",this._state)})}set init(e){this._state=e||{},xr(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}};mi.template=Pe`
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
  `;let _r=mi;function xr(s,e){const t=Object.entries(s);for(const[r,i]of t){const o=e.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!i;break;case"date":n.value=i.toISOString().substr(0,10);break;default:n.value=i;break}}}return s}const wr=Object.freeze(Object.defineProperty({__proto__:null,Element:_r},Symbol.toStringTag,{value:"Module"})),bi=class yi extends dt{constructor(e){super((t,r)=>this.update(t,r),e,yi.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:r,state:i}=e[1];t(Er(r,i));break}case"history/redirect":{const{href:r,state:i}=e[1];t(Ar(r,i));break}}}};bi.EVENT_TYPE="history:message";let ht=bi;class zt extends lt{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=kr(e);if(t){const r=new URL(t.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),pt(t,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new ht(this.context).attach(this)}}function kr(s){const e=s.currentTarget,t=r=>r.tagName=="A"&&r.href;if(s.button===0)if(s.composed){const i=s.composedPath().find(t);return i||void 0}else{for(let r=s.target;r;r===e?null:r.parentElement)if(t(r))return r;return}}function Er(s,e={}){return history.pushState(e,"",s),()=>({location:document.location,state:history.state})}function Ar(s,e={}){return history.replaceState(e,"",s),()=>({location:document.location,state:history.state})}const pt=hi(ht.EVENT_TYPE),Le=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:zt,Provider:zt,Service:ht,dispatch:pt},Symbol.toStringTag,{value:"Module"}));class ee{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,r)=>{if(this._provider){const i=new Lt(this._provider,e);this._effects.push(i),t(i)}else hr(this._target,this._contextLabel).then(i=>{const o=new Lt(i,e);this._provider=i,this._effects.push(o),i.attach(n=>this._handleChange(n)),t(o)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),this._effects.forEach(t=>t.runEffect())}}class Lt{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const $i=class _i extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new ee(this,"blazing:auth"),Ye(_i.template).attach(this),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Sr(i,this._state,t,this.authorization).then(o=>le(o,this)).then(o=>{const n=`mu-rest-form:${r}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:t,[r]:o,url:i}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:t,error:o,url:i,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const r=t.name,i=t.value;r&&(this._state[r]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},le(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&Dt(this.src,this.authorization).then(t=>{this._state=t,le(t,this)}))})}attributeChangedCallback(e,t,r){switch(e){case"src":this.src&&r&&r!==t&&!this.isNew&&Dt(this.src,this.authorization).then(i=>{this._state=i,le(i,this)});break;case"new":r&&(this._state={},le({},this));break}}};$i.observedAttributes=["src","new","action"];$i.template=Pe`
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
  `;function Dt(s,e){return fetch(s,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${s}:`,t))}function le(s,e){const t=Object.entries(s);for(const[r,i]of t){const o=e.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!i;break;default:n.value=i;break}}}return s}function Sr(s,e,t="PUT",r={}){return fetch(s,{method:t,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(e)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const xi=class wi extends dt{constructor(e,t){super(t,e,wi.EVENT_TYPE,!1)}};xi.EVENT_TYPE="mu:message";let ki=xi;class Pr extends lt{constructor(e,t,r){super(t),this._user=new G,this._updateFn=e,this._authObserver=new ee(this,r)}connectedCallback(){const e=new ki(this.context,(t,r)=>this._updateFn(t,r,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const Cr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Pr,Service:ki},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie=globalThis,ut=Ie.ShadowRoot&&(Ie.ShadyCSS===void 0||Ie.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,gt=Symbol(),Nt=new WeakMap;let Ei=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==gt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ut&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=Nt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Nt.set(t,e))}return e}toString(){return this.cssText}};const Or=s=>new Ei(typeof s=="string"?s:s+"",void 0,gt),Tr=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new Ei(t,s,gt)},Mr=(s,e)=>{if(ut)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),i=Ie.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}},jt=ut?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return Or(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Rr,defineProperty:Ir,getOwnPropertyDescriptor:Ur,getOwnPropertyNames:zr,getOwnPropertySymbols:Lr,getPrototypeOf:Dr}=Object,te=globalThis,Ht=te.trustedTypes,Nr=Ht?Ht.emptyScript:"",Ft=te.reactiveElementPolyfillSupport,ge=(s,e)=>s,De={toAttribute(s,e){switch(e){case Boolean:s=s?Nr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},ft=(s,e)=>!Rr(s,e),Bt={attribute:!0,type:String,converter:De,reflect:!1,hasChanged:ft};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),te.litPropertyMetadata??(te.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Bt){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Ir(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=Ur(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const c=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Bt}static _$Ei(){if(this.hasOwnProperty(ge("elementProperties")))return;const e=Dr(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ge("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ge("properties"))){const t=this.properties,r=[...zr(t),...Lr(t)];for(const i of r)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(jt(i))}else e!==void 0&&t.push(jt(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mr(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EC(e,t){var r;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){const n=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:De).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){var r;const i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const n=i.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:De;this._$Em=o,this[o]=c.fromAttribute(t,n.type),this._$Em=null}}requestUpdate(e,t,r){if(e!==void 0){if(r??(r=this.constructor.getPropertyOptions(e)),!(r.hasChanged??ft)(this[e],t))return;this.P(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,r){this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$EO)==null||e.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(r)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ge("elementProperties")]=new Map,J[ge("finalized")]=new Map,Ft==null||Ft({ReactiveElement:J}),(te.reactiveElementVersions??(te.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis,je=Ne.trustedTypes,qt=je?je.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ai="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Si="?"+O,jr=`<${Si}>`,B=document,ve=()=>B.createComment(""),be=s=>s===null||typeof s!="object"&&typeof s!="function",Pi=Array.isArray,Hr=s=>Pi(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",et=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yt=/-->/g,Vt=/>/g,D=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Wt=/'/g,Jt=/"/g,Ci=/^(?:script|style|textarea|title)$/i,Fr=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),he=Fr(1),ie=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Kt=new WeakMap,j=B.createTreeWalker(B,129);function Oi(s,e){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return qt!==void 0?qt.createHTML(e):e}const Br=(s,e)=>{const t=s.length-1,r=[];let i,o=e===2?"<svg>":"",n=de;for(let c=0;c<t;c++){const a=s[c];let g,f,h=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===de?f[1]==="!--"?n=Yt:f[1]!==void 0?n=Vt:f[2]!==void 0?(Ci.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=D):f[3]!==void 0&&(n=D):n===D?f[0]===">"?(n=i??de,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,g=f[1],n=f[3]===void 0?D:f[3]==='"'?Jt:Wt):n===Jt||n===Wt?n=D:n===Yt||n===Vt?n=de:(n=D,i=void 0);const d=n===D&&s[c+1].startsWith("/>")?" ":"";o+=n===de?a+jr:h>=0?(r.push(g),a.slice(0,h)+Ai+a.slice(h)+O+d):a+O+(h===-2?c:d)}return[Oi(s,o+(s[t]||"<?>")+(e===2?"</svg>":"")),r]};let ct=class Ti{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,n=0;const c=e.length-1,a=this.parts,[g,f]=Br(e,t);if(this.el=Ti.createElement(g,r),j.currentNode=this.el.content,t===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=j.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(Ai)){const l=f[n++],d=i.getAttribute(h).split(O),u=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:u[2],strings:d,ctor:u[1]==="."?Yr:u[1]==="?"?Vr:u[1]==="@"?Wr:Ve}),i.removeAttribute(h)}else h.startsWith(O)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(Ci.test(i.tagName)){const h=i.textContent.split(O),l=h.length-1;if(l>0){i.textContent=je?je.emptyScript:"";for(let d=0;d<l;d++)i.append(h[d],ve()),j.nextNode(),a.push({type:2,index:++o});i.append(h[l],ve())}}}else if(i.nodeType===8)if(i.data===Si)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(O,h+1))!==-1;)a.push({type:7,index:o}),h+=O.length-1}o++}}static createElement(e,t){const r=B.createElement("template");return r.innerHTML=e,r}};function re(s,e,t=s,r){var i,o;if(e===ie)return e;let n=r!==void 0?(i=t._$Co)==null?void 0:i[r]:t._$Cl;const c=be(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(s),n._$AT(s,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=n:t._$Cl=n),n!==void 0&&(e=re(s,n._$AS(s,e.values),n,r)),e}let qr=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=((e==null?void 0:e.creationScope)??B).importNode(t,!0);j.currentNode=i;let o=j.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let g;a.type===2?g=new mt(o,o.nextSibling,this,e):a.type===1?g=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(g=new Jr(o,this,e)),this._$AV.push(g),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=j.nextNode(),n++)}return j.currentNode=B,i}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},mt=class Mi{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=re(this,e,t),be(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==ie&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Hr(e)?this.k(e):this._(e)}S(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}_(e){this._$AH!==$&&be(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){var t;const{values:r,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=ct.createElement(Oi(i.h,i.h[0]),this.options)),i);if(((t=this._$AH)==null?void 0:t._$AD)===o)this._$AH.p(r);else{const n=new qr(o,this),c=n.u(this.options);n.p(r),this.T(c),this._$AH=n}}_$AC(e){let t=Kt.get(e.strings);return t===void 0&&Kt.set(e.strings,t=new ct(e)),t}k(e){Pi(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const o of e)i===t.length?t.push(r=new Mi(this.S(ve()),this.S(ve()),this,this.options)):r=t[i],r._$AI(o),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},Ve=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(e,t=this,r,i){const o=this.strings;let n=!1;if(o===void 0)e=re(this,e,t,0),n=!be(e)||e!==this._$AH&&e!==ie,n&&(this._$AH=e);else{const c=e;let a,g;for(e=o[0],a=0;a<o.length-1;a++)g=re(this,c[r+a],t,a),g===ie&&(g=this._$AH[a]),n||(n=!be(g)||g!==this._$AH[a]),g===$?e=$:e!==$&&(e+=(g??"")+o[a+1]),this._$AH[a]=g}n&&!i&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Yr=class extends Ve{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}},Vr=class extends Ve{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}},Wr=class extends Ve{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=re(this,e,t,0)??$)===ie)return;const r=this._$AH,i=e===$&&r!==$||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==$&&(r===$||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}},Jr=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){re(this,e)}};const Xt=Ne.litHtmlPolyfillSupport;Xt==null||Xt(ct,mt),(Ne.litHtmlVersions??(Ne.litHtmlVersions=[])).push("3.1.3");const Kr=(s,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let i=r._$litPart$;if(i===void 0){const o=(t==null?void 0:t.renderBefore)??null;r._$litPart$=i=new mt(e.insertBefore(ve(),o),o,void 0,t??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let X=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Kr(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ie}};X._$litElement$=!0,X.finalized=!0,(Ut=globalThis.litElementHydrateSupport)==null||Ut.call(globalThis,{LitElement:X});const Zt=globalThis.litElementPolyfillSupport;Zt==null||Zt({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xr={attribute:!0,type:String,converter:De,reflect:!1,hasChanged:ft},Zr=(s=Xr,e,t)=>{const{kind:r,metadata:i}=t;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),o.set(t.name,s),r==="accessor"){const{name:n}=t;return{set(c){const a=e.get.call(this);e.set.call(this,c),this.requestUpdate(n,a,s)},init(c){return c!==void 0&&this.P(n,void 0,s),c}}}if(r==="setter"){const{name:n}=t;return function(c){const a=this[n];e.call(this,c),this.requestUpdate(n,a,s)}}throw Error("Unsupported decorator location: "+r)};function Ri(s){return(e,t)=>typeof t=="object"?Zr(s,e,t):((r,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(i,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ii(s){return Ri({...s,state:!0,attribute:!1})}function Gr(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function Qr(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ui={};(function(s){var e=function(){var t=function(h,l,d,u){for(d=d||{},u=h.length;u--;d[h[u]]=l);return d},r=[1,9],i=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,d,u,v,m,b,Je){var k=b.length-1;switch(m){case 1:return new v.Root({},[b[k-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[b[k-1],b[k]]);break;case 4:case 5:this.$=b[k];break;case 6:this.$=new v.Literal({value:b[k]});break;case 7:this.$=new v.Splat({name:b[k]});break;case 8:this.$=new v.Param({name:b[k]});break;case 9:this.$=new v.Optional({},[b[k-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},{1:[2,2]},t(c,[2,4]),t(c,[2,5]),t(c,[2,6]),t(c,[2,7]),t(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},t(c,[2,10]),t(c,[2,11]),t(c,[2,12]),{1:[2,1]},t(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:i,14:o,15:n},t(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,d){if(d.recoverable)this.trace(l);else{let u=function(v,m){this.message=v,this.hash=m};throw u.prototype=Error,new u(l,d)}},parse:function(l){var d=this,u=[0],v=[null],m=[],b=this.table,Je="",k=0,Mt=0,ir=2,Rt=1,rr=m.slice.call(arguments,1),y=Object.create(this.lexer),z={yy:{}};for(var Ke in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ke)&&(z.yy[Ke]=this.yy[Ke]);y.setInput(l,z.yy),z.yy.lexer=y,z.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Xe=y.yylloc;m.push(Xe);var sr=y.options&&y.options.ranges;typeof z.yy.parseError=="function"?this.parseError=z.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var or=function(){var V;return V=y.lex()||Rt,typeof V!="number"&&(V=d.symbols_[V]||V),V},w,L,E,Ze,Y={},Me,S,It,Re;;){if(L=u[u.length-1],this.defaultActions[L]?E=this.defaultActions[L]:((w===null||typeof w>"u")&&(w=or()),E=b[L]&&b[L][w]),typeof E>"u"||!E.length||!E[0]){var Ge="";Re=[];for(Me in b[L])this.terminals_[Me]&&Me>ir&&Re.push("'"+this.terminals_[Me]+"'");y.showPosition?Ge="Parse error on line "+(k+1)+`:
`+y.showPosition()+`
Expecting `+Re.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ge="Parse error on line "+(k+1)+": Unexpected "+(w==Rt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ge,{text:y.match,token:this.terminals_[w]||w,line:y.yylineno,loc:Xe,expected:Re})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+L+", token: "+w);switch(E[0]){case 1:u.push(w),v.push(y.yytext),m.push(y.yylloc),u.push(E[1]),w=null,Mt=y.yyleng,Je=y.yytext,k=y.yylineno,Xe=y.yylloc;break;case 2:if(S=this.productions_[E[1]][1],Y.$=v[v.length-S],Y._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},sr&&(Y._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Ze=this.performAction.apply(Y,[Je,Mt,k,z.yy,E[1],v,m].concat(rr)),typeof Ze<"u")return Ze;S&&(u=u.slice(0,-1*S*2),v=v.slice(0,-1*S),m=m.slice(0,-1*S)),u.push(this.productions_[E[1]][0]),v.push(Y.$),m.push(Y._$),It=b[u[u.length-2]][u[u.length-1]],u.push(It);break;case 3:return!0}}return!0}},g=function(){var h={EOF:1,parseError:function(d,u){if(this.yy.parser)this.yy.parser.parseError(d,u);else throw new Error(d)},setInput:function(l,d){return this.yy=d||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var d=l.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var d=l.length,u=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===v.length?this.yylloc.first_column:0)+v[v.length-u.length].length-u[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),d=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+d+"^"},test_match:function(l,d){var u,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=l[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],u=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var b in m)this[b]=m[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,d,u,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),b=0;b<m.length;b++)if(u=this._input.match(this.rules[m[b]]),u&&(!d||u[0].length>d[0].length)){if(d=u,v=b,this.options.backtrack_lexer){if(l=this.test_match(u,m[b]),l!==!1)return l;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(l=this.test_match(d,m[v]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,u,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();a.lexer=g;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Qr<"u"&&(s.parser=e,s.Parser=e.Parser,s.parse=function(){return e.parse.apply(e,arguments)})})(Ui);function W(s){return function(e,t){return{displayName:s,props:e,children:t||[]}}}var zi={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Li=Ui.parser;Li.yy=zi;var es=Li,ts=Object.keys(zi);function is(s){return ts.forEach(function(e){if(typeof s[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:s}}var Di=is,rs=Di,ss=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ni(s){this.captures=s.captures,this.re=s.re}Ni.prototype.match=function(s){var e=this.re.exec(s),t={};if(e)return this.captures.forEach(function(r,i){typeof e[i+1]>"u"?t[r]=void 0:t[r]=decodeURIComponent(e[i+1])}),t};var os=rs({Concat:function(s){return s.children.reduce((function(e,t){var r=this.visit(t);return{re:e.re+r.re,captures:e.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(s){return{re:s.props.value.replace(ss,"\\$&"),captures:[]}},Splat:function(s){return{re:"([^?]*?)",captures:[s.props.name]}},Param:function(s){return{re:"([^\\/\\?]+)",captures:[s.props.name]}},Optional:function(s){var e=this.visit(s.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(s){var e=this.visit(s.children[0]);return new Ni({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),ns=os,as=Di,cs=as({Concat:function(s,e){var t=s.children.map((function(r){return this.visit(r,e)}).bind(this));return t.some(function(r){return r===!1})?!1:t.join("")},Literal:function(s){return decodeURI(s.props.value)},Splat:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Param:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Optional:function(s,e){var t=this.visit(s.children[0],e);return t||""},Root:function(s,e){e=e||{};var t=this.visit(s.children[0],e);return t?encodeURI(t):!1}}),ls=cs,ds=es,hs=ns,ps=ls;Ce.prototype=Object.create(null);Ce.prototype.match=function(s){var e=hs.visit(this.ast),t=e.match(s);return t||!1};Ce.prototype.reverse=function(s){return ps.visit(this.ast,s)};function Ce(s){var e;if(this?e=this:e=Object.create(Ce.prototype),typeof s>"u")throw new Error("A route spec is required");return e.spec=s,e.ast=ds.parse(s),e}var us=Ce,gs=us,fs=gs;const ms=Gr(fs);var vs=Object.defineProperty,ji=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&vs(e,t,i),i};class ye extends X{constructor(e,t,r=""){super(),this._cases=[],this._fallback=()=>he`
      <h1>Not Found</h1>
    `,this._cases=e.map(i=>({...i,route:new ms(i.path)})),this._historyObserver=new ee(this,t),this._authObserver=new ee(this,r)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),he`
      <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(fi(this,"auth/redirect"),he`
              <h1>Redirecting for Login</h1>
            `):t.view(t.params||{}):he`
              <h1>Authenticating</h1>
            `;if("redirect"in t){const r=t.redirect;if(typeof r=="string")return this.redirect(r),he`
              <h1>Redirecting to ${r}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:r}=e,i=new URLSearchParams(t),o=r+t;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:r,params:c,query:i}}}redirect(e){pt(this,"history/redirect",{href:e})}}ye.styles=Tr`
    :host,
    main {
      display: contents;
    }
  `;ji([Ii()],ye.prototype,"_user");ji([Ii()],ye.prototype,"_match");const bs=Object.freeze(Object.defineProperty({__proto__:null,Element:ye,Switch:ye},Symbol.toStringTag,{value:"Module"})),Hi=class Fi extends HTMLElement{constructor(){if(super(),Ye(Fi.template).attach(this),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Hi.template=Pe`
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
  `;let ys=Hi;const $s=Object.freeze(Object.defineProperty({__proto__:null,Element:ys},Symbol.toStringTag,{value:"Module"})),_s=class Bi extends HTMLElement{constructor(){super(),this._array=[],Ye(Bi.template).attach(this),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(qi("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const r=new Event("change",{bubbles:!0}),i=t.value,o=t.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=i,this.dispatchEvent(r)}}}),this.addEventListener("click",e=>{at(e,"button.add")?ze(e,"input-array:add"):at(e,"button.remove")&&ze(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],xs(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const r=Array.from(this.children).indexOf(t);this._array.splice(r,1),t.remove()}}};_s.template=Pe`
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
  `;function xs(s,e){e.replaceChildren(),s.forEach((t,r)=>e.append(qi(t)))}function qi(s,e){const t=s===void 0?"":`value="${s}"`;return Pe`
    <label>
      <input ${t} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function vt(s){return Object.entries(s).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var ws=Object.defineProperty,ks=Object.getOwnPropertyDescriptor,Es=(s,e,t,r)=>{for(var i=ks(e,t),o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&ws(e,t,i),i};class I extends X{constructor(e){super(),this._pending=[],this._observer=new ee(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([r,i])=>{console.log("Dispatching queued event",i,r),r.dispatchEvent(i)}),t.setEffect(()=>{var r;if(console.log("View effect",this,t,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",r),t.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([t,r]))}ref(e){return this.model?this.model[e]:void 0}}Es([Ri()],I.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=globalThis,bt=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),Gt=new WeakMap;let Yi=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(bt&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=Gt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Gt.set(t,e))}return e}toString(){return this.cssText}};const As=s=>new Yi(typeof s=="string"?s:s+"",void 0,yt),A=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new Yi(t,s,yt)},Ss=(s,e)=>{if(bt)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),i=Ue.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}},Qt=bt?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return As(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ps,defineProperty:Cs,getOwnPropertyDescriptor:Os,getOwnPropertyNames:Ts,getOwnPropertySymbols:Ms,getPrototypeOf:Rs}=Object,M=globalThis,ei=M.trustedTypes,Is=ei?ei.emptyScript:"",tt=M.reactiveElementPolyfillSupport,fe=(s,e)=>s,He={toAttribute(s,e){switch(e){case Boolean:s=s?Is:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},$t=(s,e)=>!Ps(s,e),ti={attribute:!0,type:String,converter:He,reflect:!1,useDefault:!1,hasChanged:$t};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),M.litPropertyMetadata??(M.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ti){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Cs(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=Os(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){const c=i==null?void 0:i.call(this);o==null||o.call(this,n),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ti}static _$Ei(){if(this.hasOwnProperty(fe("elementProperties")))return;const e=Rs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(fe("properties"))){const t=this.properties,r=[...Ts(t),...Ms(t)];for(const i of r)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(Qt(i))}else e!==void 0&&t.push(Qt(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ss(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var o;const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:He).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){var o,n;const r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const c=r.getPropertyOptions(i),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((o=c.converter)==null?void 0:o.fromAttribute)!==void 0?c.converter:He;this._$Em=i,this[i]=a.fromAttribute(t,c.type)??((n=this._$Ej)==null?void 0:n.get(i))??null,this._$Em=null}}requestUpdate(e,t,r){var i;if(e!==void 0){const o=this.constructor,n=this[e];if(r??(r=o.getPropertyOptions(e)),!((r.hasChanged??$t)(n,t)||r.useDefault&&r.reflect&&n===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:o},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i){const{wrapped:c}=n,a=this[o];c!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[fe("elementProperties")]=new Map,K[fe("finalized")]=new Map,tt==null||tt({ReactiveElement:K}),(M.reactiveElementVersions??(M.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,Fe=me.trustedTypes,ii=Fe?Fe.createPolicy("lit-html",{createHTML:s=>s}):void 0,Vi="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Wi="?"+T,Us=`<${Wi}>`,q=document,$e=()=>q.createComment(""),_e=s=>s===null||typeof s!="object"&&typeof s!="function",_t=Array.isArray,zs=s=>_t(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",it=`[ 	
\f\r]`,pe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ri=/-->/g,si=/>/g,N=RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),oi=/'/g,ni=/"/g,Ji=/^(?:script|style|textarea|title)$/i,Ls=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),p=Ls(1),se=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ai=new WeakMap,H=q.createTreeWalker(q,129);function Ki(s,e){if(!_t(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ii!==void 0?ii.createHTML(e):e}const Ds=(s,e)=>{const t=s.length-1,r=[];let i,o=e===2?"<svg>":e===3?"<math>":"",n=pe;for(let c=0;c<t;c++){const a=s[c];let g,f,h=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===pe?f[1]==="!--"?n=ri:f[1]!==void 0?n=si:f[2]!==void 0?(Ji.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=N):f[3]!==void 0&&(n=N):n===N?f[0]===">"?(n=i??pe,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,g=f[1],n=f[3]===void 0?N:f[3]==='"'?ni:oi):n===ni||n===oi?n=N:n===ri||n===si?n=pe:(n=N,i=void 0);const d=n===N&&s[c+1].startsWith("/>")?" ":"";o+=n===pe?a+Us:h>=0?(r.push(g),a.slice(0,h)+Vi+a.slice(h)+T+d):a+T+(h===-2?c:d)}return[Ki(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};class xe{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,n=0;const c=e.length-1,a=this.parts,[g,f]=Ds(e,t);if(this.el=xe.createElement(g,r),H.currentNode=this.el.content,t===2||t===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=H.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(Vi)){const l=f[n++],d=i.getAttribute(h).split(T),u=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:u[2],strings:d,ctor:u[1]==="."?js:u[1]==="?"?Hs:u[1]==="@"?Fs:We}),i.removeAttribute(h)}else h.startsWith(T)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(Ji.test(i.tagName)){const h=i.textContent.split(T),l=h.length-1;if(l>0){i.textContent=Fe?Fe.emptyScript:"";for(let d=0;d<l;d++)i.append(h[d],$e()),H.nextNode(),a.push({type:2,index:++o});i.append(h[l],$e())}}}else if(i.nodeType===8)if(i.data===Wi)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(T,h+1))!==-1;)a.push({type:7,index:o}),h+=T.length-1}o++}}static createElement(e,t){const r=q.createElement("template");return r.innerHTML=e,r}}function oe(s,e,t=s,r){var n,c;if(e===se)return e;let i=r!==void 0?(n=t._$Co)==null?void 0:n[r]:t._$Cl;const o=_e(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=i:t._$Cl=i),i!==void 0&&(e=oe(s,i._$AS(s,e.values),i,r)),e}class Ns{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=((e==null?void 0:e.creationScope)??q).importNode(t,!0);H.currentNode=i;let o=H.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let g;a.type===2?g=new Oe(o,o.nextSibling,this,e):a.type===1?g=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(g=new Bs(o,this,e)),this._$AV.push(g),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=H.nextNode(),n++)}return H.currentNode=q,i}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Oe{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=oe(this,e,t),_e(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==se&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(q.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=xe.createElement(Ki(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(t);else{const n=new Ns(i,this),c=n.u(this.options);n.p(t),this.T(c),this._$AH=n}}_$AC(e){let t=ai.get(e.strings);return t===void 0&&ai.set(e.strings,t=new xe(e)),t}k(e){_t(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const o of e)i===t.length?t.push(r=new Oe(this.O($e()),this.O($e()),this,this.options)):r=t[i],r._$AI(o),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class We{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(e,t=this,r,i){const o=this.strings;let n=!1;if(o===void 0)e=oe(this,e,t,0),n=!_e(e)||e!==this._$AH&&e!==se,n&&(this._$AH=e);else{const c=e;let a,g;for(e=o[0],a=0;a<o.length-1;a++)g=oe(this,c[r+a],t,a),g===se&&(g=this._$AH[a]),n||(n=!_e(g)||g!==this._$AH[a]),g===_?e=_:e!==_&&(e+=(g??"")+o[a+1]),this._$AH[a]=g}n&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class js extends We{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class Hs extends We{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Fs extends We{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=oe(this,e,t,0)??_)===se)return;const r=this._$AH,i=e===_&&r!==_||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==_&&(r===_||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Bs{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){oe(this,e)}}const rt=me.litHtmlPolyfillSupport;rt==null||rt(xe,Oe),(me.litHtmlVersions??(me.litHtmlVersions=[])).push("3.3.0");const qs=(s,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let i=r._$litPart$;if(i===void 0){const o=(t==null?void 0:t.renderBefore)??null;r._$litPart$=i=new Oe(e.insertBefore($e(),o),o,void 0,t??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class Z extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qs(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return se}}var ci;Z._$litElement$=!0,Z.finalized=!0,(ci=F.litElementHydrateSupport)==null||ci.call(F,{LitElement:Z});const st=F.litElementPolyfillSupport;st==null||st({LitElement:Z});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");const Ys={};function Vs(s,e,t){switch(s[0]){case"chef/load":Ws(s[1],t).then(i=>e(o=>({...o,chef:i}))).catch(i=>{console.error("Failed to load chef:",i)});break;case"chef/save":Js(s[1],t).then(i=>e(o=>({...o,chef:i}))).then(()=>{const{onSuccess:i}=s[1];i&&i()}).catch(i=>{console.error("Failed to save chef:",i);const{onFailure:o}=s[1];o&&o(i)});break;case"chefs/load":Ks(t).then(i=>e(o=>({...o,chefs:i}))).catch(i=>{console.error("Failed to load chefs:",i)});break;case"recipe/load":Xs(s[1],t).then(i=>e(o=>({...o,recipe:i}))).catch(i=>{console.error("Failed to load recipe:",i)});break;case"recipes/load":Zs().then(i=>e(o=>({...o,recipes:i}))).catch(i=>{console.error("Failed to load recipes:",i)});break;case"cuisine/load":Gs(s[1],t).then(i=>e(o=>({...o,cuisine:i}))).catch(i=>{console.error("Failed to load cuisine:",i)});break;case"cuisines/load":Qs(t).then(i=>e(o=>({...o,cuisines:i}))).catch(i=>{console.error("Failed to load cuisines:",i)});break;case"ingredient/load":eo(s[1],t).then(i=>e(o=>({...o,ingredient:i}))).catch(i=>{console.error("Failed to load ingredient:",i)});break;case"ingredients/load":to(t).then(i=>e(o=>({...o,ingredients:i}))).catch(i=>{console.error("Failed to load ingredients:",i)});break;case"mealplan/load":io(s[1]).then(i=>e(o=>({...o,mealplan:i}))).catch(i=>{console.error("Failed to load meal plan:",i)});break;case"mealplans/load":ro().then(i=>e(o=>({...o,mealplans:i}))).catch(i=>{console.error("Failed to load meal plans:",i)});break;default:const r=s[0];throw new Error(`Unhandled message "${r}"`)}}function Ws(s,e){return fetch(`/api/chefs/${s.chefId}`,{headers:P.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load chef: ${t.status}`)}).then(t=>(console.log("Chef loaded:",t),t))}function Js(s,e){return fetch(`/api/chefs/${s.chefId}`,{method:"PUT",headers:{...P.headers(e),"Content-Type":"application/json"},body:JSON.stringify(s.chef)}).then(t=>{if(t.status===200)return t.json();throw t.status===401?new Error("You are not authorized to edit this chef profile"):t.status===403?new Error("You can only edit your own chef profile"):new Error(`Failed to save chef: ${t.status}`)}).then(t=>(console.log("Chef saved:",t),t))}function Ks(s){return fetch("/api/chefs",{headers:P.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load chefs: ${e.status}`)}).then(e=>(console.log("Chefs loaded:",e),e))}function Xs(s,e){return fetch(`/api/recipes/${s.recipeId}`,{headers:P.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load recipe: ${t.status}`)}).then(t=>(console.log("Recipe loaded:",t),t))}function Zs(){return fetch("/api/recipes").then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to load recipes: ${s.status}`)}).then(s=>(console.log("Recipes loaded:",s),s))}function Gs(s,e){return fetch(`/api/cuisines/${s.cuisineId}`,{headers:P.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load cuisine: ${t.status}`)}).then(t=>(console.log("Cuisine loaded:",t),t))}function Qs(s){return fetch("/api/cuisines",{headers:P.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load cuisines: ${e.status}`)}).then(e=>(console.log("Cuisines loaded:",e),e))}function eo(s,e){return fetch(`/api/ingredients/${s.ingredientId}`,{headers:P.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load ingredient: ${t.status}`)}).then(t=>(console.log("Ingredient loaded:",t),t))}function to(s){return fetch("/api/ingredients",{headers:P.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load ingredients: ${e.status}`)}).then(e=>(console.log("Ingredients loaded:",e),e))}function io(s){return fetch(`/api/mealplans/${s.mealplanId}`).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load meal plan: ${e.status}`)}).then(e=>(console.log("Meal plan loaded:",e),e))}function ro(){return fetch("/api/mealplans").then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to load meal plans: ${s.status}`)}).then(s=>(console.log("Meal plans loaded:",s),s))}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const so={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:$t},oo=(s=so,e,t)=>{const{kind:r,metadata:i}=t;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),r==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(t.name,s),r==="accessor"){const{name:n}=t;return{set(c){const a=e.get.call(this);e.set.call(this,c),this.requestUpdate(n,a,s)},init(c){return c!==void 0&&this.C(n,void 0,s,c),c}}}if(r==="setter"){const{name:n}=t;return function(c){const a=this[n];e.call(this,c),this.requestUpdate(n,a,s)}}throw Error("Unsupported decorator location: "+r)};function C(s){return(e,t)=>typeof t=="object"?oo(s,e,t):((r,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(i,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(s){return C({...s,state:!0,attribute:!1})}const no=A`
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
`,ao=A`
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
`,U=[no,ao];var co=Object.defineProperty,xt=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&co(e,t,i),i};const Be=class Be extends Z{constructor(){super(...arguments),this._authObserver=new ee(this,"recipebook:auth"),this.loggedIn=!1,this.isDarkMode=!0}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:r}=t;r&&r.authenticated?(this.loggedIn=!0,this.userid=r.username):(this.loggedIn=!1,this.userid=void 0),this.requestUpdate()});const e=localStorage.getItem("darkMode");this.isDarkMode=e===null?!0:e==="true",this.isDarkMode||this.classList.add("light-mode")}firstUpdated(){this._setInitialCheckboxState()}_setInitialCheckboxState(){if(this.shadowRoot){const e=this.shadowRoot.querySelector('input[type="checkbox"]');e&&(e.checked=!this.isDarkMode)}}render(){return p`
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
                                <a @click=${()=>{window.location.href="/public/login.html"}}>Sign In</a>
                            </li>
                        </menu>
                    </mu-dropdown>
                </div>
            </div>
        `}_handleDarkModeToggle(e){const t=e.target;this.isDarkMode=!t.checked,this.isDarkMode?this.classList.remove("light-mode"):this.classList.add("light-mode"),localStorage.setItem("darkMode",this.isDarkMode.toString());const r=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{isDarkMode:this.isDarkMode}});this.dispatchEvent(r)}_handleSignOut(e){yr.relay(e,"auth:message",["auth/signout"]),window.location.href="/app"}};Be.uses=vt({"mu-dropdown":$s.Element}),Be.styles=[U,A`
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
        `];let ne=Be;xt([x()],ne.prototype,"loggedIn");xt([x()],ne.prototype,"userid");xt([x()],ne.prototype,"isDarkMode");var lo=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,wt=(s,e,t,r)=>{for(var i=r>1?void 0:r?ho(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&lo(e,t,i),i};const Et=class Et extends I{constructor(){super("recipebook:model"),this.viewMode="recipes"}get recipes(){return this.model.recipes||[]}get mealPlans(){return this.model.mealplans||[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["recipes/load",{}]),this.dispatchMessage(["mealplans/load",{}])}handleViewToggle(e){this.viewMode=e}renderContent(){const e=this.viewMode==="recipes"?this.recipes:this.mealPlans;return e.length===0&&(this.viewMode==="recipes"?!this.model.recipes:!this.model.mealplans)?p`
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading delicious content...</div>
                </div>
            `:e.length===0?p`
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>No ${this.viewMode==="recipes"?"recipes":"meal plans"} found</h3>
                    <p>Check back later for new content!</p>
                </div>
            `:p`
            <div class="content-grid">
                ${e.map(r=>this.renderCard(r))}
            </div>
        `}renderCard(e){const t="cookingTime"in e,r=t?`/app/recipe/${e.idName}`:`/app/mealplan/${e.idName}`;if(t){const i=e;return p`
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
            `}else{const i=e;return p`
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
            `}}render(){return p`
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
        `}};Et.styles=[U,A`
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
            }
        `];let ae=Et;wt([x()],ae.prototype,"viewMode",2);wt([x()],ae.prototype,"recipes",1);wt([x()],ae.prototype,"mealPlans",1);var po=Object.defineProperty,uo=Object.getOwnPropertyDescriptor,Xi=(s,e,t,r)=>{for(var i=r>1?void 0:r?uo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&po(e,t,i),i};const At=class At extends I{get recipe(){return this.model.recipe}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="recipe-id"&&t!==r&&r&&(console.log("Loading recipe:",r),this.dispatchMessage(["recipe/load",{recipeId:r}]))}render(){return!this.recipe&&this.recipeId?p`
                <div class="loading">Loading recipe...</div>
            `:this.recipe?p`
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
                                    ${this.recipe.ingredients.map(e=>p`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                                <h2>Included in Meal Plans</h2>
                                <ul>
                                    ${this.recipe.mealPlans.map(e=>p`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                            </div>
                            <div class="steps-section">
                                <h2>Preparation Steps</h2>
                                <ol>
                                    ${this.recipe.steps.map(e=>p`
                                        <li>${e}</li>
                                    `)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:p`
                <div class="loading">Recipe not found</div>
            `}};At.styles=[U,A`
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
        `];let we=At;Xi([C({attribute:"recipe-id"})],we.prototype,"recipeId",2);Xi([x()],we.prototype,"recipe",1);var go=Object.defineProperty,fo=Object.getOwnPropertyDescriptor,Zi=(s,e,t,r)=>{for(var i=r>1?void 0:r?fo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&go(e,t,i),i};const St=class St extends I{get chef(){return this.model.chef}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="chef-id"&&t!==r&&r&&(console.log("Loading chef:",r),this.dispatchMessage(["chef/load",{chefId:r}]))}render(){return!this.chef&&this.chefId?p`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?p`
            <div class="container">
                <div class="chef-profile">
                    <button
                            class="edit-button"
                            @click=${()=>Le.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}/edit`})}>
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
                            ${this.chef.favoriteDishes.map(e=>p`
                                <li>${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Recipes by ${this.chef.name}</h2>
                        <ul>
                            ${this.chef.recipes.map(e=>p`
                                <li><a href="${e.href}">${e.name}</a></li>
                            `)}
                        </ul>
                    </div>
                </div>
            </div>
        `:p`
                <div class="container">
                    <div class="loading">Chef not found</div>
                </div>
            `}};St.styles=[U,A`
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
        `];let ke=St;Zi([C({attribute:"chef-id"})],ke.prototype,"chefId",2);Zi([x()],ke.prototype,"chef",1);var mo=Object.defineProperty,vo=Object.getOwnPropertyDescriptor,kt=(s,e,t,r)=>{for(var i=r>1?void 0:r?vo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&mo(e,t,i),i};const qe=class qe extends I{get chef(){return this.model.chef}constructor(){super("recipebook:model")}removeMuFormDefaultStyles(){this.updateComplete.then(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("mu-form");if(e){const r=e.shadowRoot;if(r){r.querySelectorAll("style").forEach(n=>n.remove());const o=document.createElement("style");o.textContent=`
                    button {
                        background: var(--color-primary);
                        color: white;
                        cursor: pointer;
                        transition: opacity 0.2s, background-color 0.2s, border-color 0.2s, color 0.2s;
                        padding: var(--spacing-md) var(--spacing-lg); // Increased padding for better click targets
                        border-radius: 4px !important;
                        font-size: 1rem;
                        font-weight: 600;
                    }
                   
                    button:hover {
                        background-color: var(--color-primary-dark, #3b82f6);
                        border-color: var(--color-primary-dark, #3b82f6);
                        opacity: 0.9;
                    }
                `,r.appendChild(o)}}})}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="chef-id"&&t!==r&&r&&(console.log("Loading chef for edit:",r),this.errorMessage=void 0,this.dispatchMessage(["chef/load",{chefId:r}]))}handleSubmit(e){if(!this.chefId)return;if(this.errorMessage=void 0,e.detail.idName!==this.chefId){this.errorMessage="Mismatch in Chef ID. Cannot save.";return}this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e.detail,onSuccess:()=>{Le.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})},onFailure:r=>{this.errorMessage=r.message||"Failed to save chef profile",console.error("Failed to save chef:",r)}}])}addFavoriteDish(){if(!this.chef)return;const e={...this.chef,favoriteDishes:[...this.chef.favoriteDishes,""]};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e,onSuccess:()=>{},onFailure:t=>console.error("Failed to add dish:",t)}])}removeFavoriteDish(e){if(!this.chef)return;const t=this.chef.favoriteDishes.filter((i,o)=>o!==e),r={...this.chef,favoriteDishes:t};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:r,onSuccess:()=>{},onFailure:i=>console.error("Failed to remove dish:",i)}])}render(){return this.removeMuFormDefaultStyles(),!this.chef&&this.chefId?p`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?p`
            <div class="container">
                <div class="page-header">
                    <h1>Edit Chef Profile</h1>
                </div>

                ${this.errorMessage?p`
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

                            <label for="imageUrl">Profile Image URL</label>
                            <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    required
                            />
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
                                ${this.chef.favoriteDishes.map((e,t)=>p`
                                    <div class="list-item">
                                        <input
                                                type="text"
                                                name="favoriteDishes[${t}]"
                                                value="${e}"
                                                placeholder="Dish name"
                                                required
                                        />
                                        <button
                                                type="button"
                                                @click=${()=>this.removeFavoriteDish(t)}>
                                            Remove
                                        </button>
                                    </div>
                                `)}
                            </div>
                        </div>
                    </div>


                    <div class="form-section">
                        <h2>Your Recipes</h2>
                        <div id="recipes-container">
                            ${this.chef.recipes.map((e,t)=>p`
                                <div class="list-item">
                                    <input 
                                        type="text" 
                                        name="recipes[${t}].name" 
                                        value="${e.name}"
                                        readonly
                                    />
                                    <input 
                                        type="hidden" 
                                        name="recipes[${t}].href" 
                                        value="${e.href}"
                                    />
                                </div>
                            `)}
                        </div>
                        <p class="helper-text">
                            Recipes are managed separately. Create new recipes from the recipes page.
                        </p>
                    </div>
                    <button
                            type="button"
                            class="cancel-button"
                            @click=${()=>Le.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})}>
                        Cancel
                    </button>

                    <input type="hidden" name="idName" value="${this.chef.idName}" />
                </mu-form>
            </div>
        `:p`
                <div class="container">
                    <div class="error-message">Chef profile not found</div>
                </div>
            `}};qe.uses=vt({"mu-form":wr.Element}),qe.styles=[U,A`
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
        `];let ce=qe;kt([C({attribute:"chef-id"})],ce.prototype,"chefId",2);kt([x()],ce.prototype,"chef",1);kt([x()],ce.prototype,"errorMessage",2);var bo=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,Gi=(s,e,t,r)=>{for(var i=r>1?void 0:r?yo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&bo(e,t,i),i};const Pt=class Pt extends I{get ingredient(){return this.model.ingredient}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="ingredient-id"&&t!==r&&r&&(console.log("Loading ingredient:",r),this.dispatchMessage(["ingredient/load",{ingredientId:r}]))}render(){return!this.ingredient&&this.ingredientId?p`
                <div class="container">
                    <div class="loading">Loading ingredient...</div>
                </div>
            `:this.ingredient?p`
            <div class="container">
                <div class="ingredient-card">
                    <h1>${this.ingredient.name}</h1>
                    <div class="top-section">
                        ${this.ingredient.imageUrl?p`
                            <img src="${this.ingredient.imageUrl}" alt="${this.ingredient.name}"
                                 style="max-width: 250px;">
                        `:""}
                        <div class="details">
                            <p><strong>Category:</strong> ${this.ingredient.category}</p>
                            ${this.ingredient.allergens?p`
                                <p><strong>Allergens:</strong> ${this.ingredient.allergens}</p>
                            `:""}
                            ${this.ingredient.substitutes?p`
                                <p><strong>Substitutes:</strong> ${this.ingredient.substitutes}</p>
                            `:""}
                        </div>
                    </div>

                    ${this.ingredient.nutrition&&this.ingredient.nutrition.length>0?p`
                        <div class="section">
                            <h2>Nutritional Information</h2>
                            <div class="nutrition-grid">
                                ${this.ingredient.nutrition.map(e=>p`
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${e.value}</div>
                                        <div class="nutrition-label">${e.label}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `:""}

                    ${this.ingredient.recipes&&this.ingredient.recipes.length>0?p`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipes.map(e=>p`
                                    <li><a href="${e.href}">${e.name}</a></li>
                                `)}
                            </ul>
                        </div>
                    `:""}
                </div>
            </div>
        `:p`
                <div class="container">
                    <div class="loading">Ingredient not found</div>
                </div>
            `}};Pt.styles=[U,A`
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
        `];let Ee=Pt;Gi([C({attribute:"ingredient-id"})],Ee.prototype,"ingredientId",2);Gi([x()],Ee.prototype,"ingredient",1);var $o=Object.defineProperty,_o=Object.getOwnPropertyDescriptor,Qi=(s,e,t,r)=>{for(var i=r>1?void 0:r?_o(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&$o(e,t,i),i};const Ct=class Ct extends I{get cuisine(){return this.model.cuisine}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="cuisine-id"&&t!==r&&r&&(console.log("Loading cuisine:",r),this.dispatchMessage(["cuisine/load",{cuisineId:r}]))}render(){return!this.cuisine&&this.cuisineId?p`
                <div class="container">
                    <div class="loading">Loading cuisine...</div>
                </div>
            `:this.cuisine?p`
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
                            ${this.cuisine.popularIngredients.map(e=>p`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="info-section">
                        <h2>Typical Dishes</h2>
                        <ul class="tag-list">
                            ${this.cuisine.typicalDishes.map(e=>p`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes from ${this.cuisine.name}</h2>
                    <div class="recipe-grid">
                        ${this.cuisine.recipes.map(e=>p`
                            <a href="${e.href}" class="recipe-card">
                                ${e.imageUrl?p`
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
        `:p`
                <div class="container">
                    <div class="loading">Cuisine not found</div>
                </div>
            `}};Ct.styles=[U,A`
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
        `];let Ae=Ct;Qi([C({attribute:"cuisine-id"})],Ae.prototype,"cuisineId",2);Qi([x()],Ae.prototype,"cuisine",1);var xo=Object.defineProperty,wo=Object.getOwnPropertyDescriptor,er=(s,e,t,r)=>{for(var i=r>1?void 0:r?wo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&xo(e,t,i),i};const Ot=class Ot extends I{get mealplan(){return this.model.mealplan}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="mealplan-id"&&t!==r&&r&&(console.log("Loading meal plan:",r),this.dispatchMessage(["mealplan/load",{mealplanId:r}]))}render(){return!this.mealplan&&this.mealplanId?p`
                <div class="container">
                    <div class="loading">Loading meal plan...</div>
                </div>
            `:this.mealplan?p`
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
                        ${this.mealplan.recipes.map(e=>p`
                            <div class="recipe-item">
                                <div class="recipe-info">
                                    <div class="recipe-name">${e.name}</div>
                                    ${e.day||e.mealType?p`
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
                        ${this.mealplan.mealTypes.map(e=>p`
                            <span class="meal-type-tag">${e}</span>
                        `)}
                    </div>
                </div>
            </div>
        `:p`
                <div class="container">
                    <div class="loading">Meal plan not found</div>
                </div>
            `}};Ot.styles=[U,A`
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

            .meal-type-tag {
                background: var(--color-accent);
                color: var(--color-text-inverted);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: 0.9rem;
            }

            .loading {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text);
            }
        `];let Se=Ot;er([C({attribute:"mealplan-id"})],Se.prototype,"mealplanId",2);er([x()],Se.prototype,"mealplan",1);var ko=Object.defineProperty,Te=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&ko(e,t,i),i};const Tt=class Tt extends Z{constructor(){super(...arguments),this.formData={},this.redirect="/app",this.loading=!1}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return p`
            <form
                    @change=${e=>this.handleChange(e)}
                    @submit=${e=>this.handleSubmit(e)}
            >
                <slot></slot>
                <slot name="button">
                    <button ?disabled=${!this.canSubmit||this.loading} type="submit">
                        ${this.loading?"Loading…":"Login"}
                    </button>
                </slot>
                <p class="error">${this.error}</p>
            </form>
        `}handleChange(e){const t=e.target,r=t==null?void 0:t.name,i=t==null?void 0:t.value,o=this.formData;switch(r){case"username":this.formData={...o,username:i};break;case"password":this.formData={...o,password:i};break}}handleSubmit(e){e.preventDefault(),this.canSubmit&&(this.loading=!0,fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw new Error("Login failed");return t.json()}).then(t=>{const{token:r}=t,i=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:this.redirect}]});console.log("dispatching message",i),this.dispatchEvent(i)}).catch(t=>{console.log(t),this.error=t.toString()}).finally(()=>this.loading=!1))}};Tt.styles=A`
        .error:not(:empty) {
            color: red;
            border: 1px solid red;
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
        }
    `;let R=Tt;Te([x()],R.prototype,"formData");Te([C()],R.prototype,"api");Te([C()],R.prototype,"redirect");Te([x()],R.prototype,"error");Te([x()],R.prototype,"loading");const Eo=A`
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
`,tr=document.createElement("style");tr.textContent=Eo.cssText;document.head.append(tr);const Ao=[{path:"/app/recipe/:id",view:s=>p`
      <recipe-view recipe-id=${s.id}></recipe-view>
    `},{path:"/app/chef/:id",view:s=>p`
      <chef-view chef-id=${s.id}></chef-view>
    `},{path:"/app/chef/:id/edit",view:s=>p`
    <chef-edit chef-id=${s.id}></chef-edit>
  `},{path:"/app/ingredient/:id",view:s=>p`
      <ingredient-view ingredient-id=${s.id}></ingredient-view>
    `},{path:"/app/cuisine/:id",view:s=>p`
      <cuisine-view cuisine-id=${s.id}></cuisine-view>
    `},{path:"/app/mealplan/:id",view:s=>p`
      <mealplan-view mealplan-id=${s.id}></mealplan-view>
    `},{path:"/app/mealplan",view:()=>p`
      <mealplan-list-view></mealplan-list-view>
    `},{path:"/app/recipes",view:()=>p`
      <recipes-list-view></recipes-list-view>
    `},{path:"/app",view:()=>p`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];vt({"mu-auth":P.Provider,"mu-history":Le.Provider,"mu-store":class extends Cr.Provider{constructor(){super(Vs,Ys,"recipebook:auth")}},"app-header":ne,"home-view":ae,"recipe-view":we,"chef-view":ke,"ingredient-view":Ee,"cuisine-view":Ae,"mealplan-view":Se,"login-form":R,"chef-edit":ce,"mu-switch":class extends bs.Element{constructor(){super(Ao,"recipebook:history","recipebook:auth")}}});document.addEventListener("DOMContentLoaded",()=>{const s=localStorage.getItem("darkMode");(s===null?!0:s==="true")||document.body.classList.add("light-mode"),document.body.addEventListener("darkmode:toggle",t=>{const i=t.detail.isDarkMode;i?document.body.classList.remove("light-mode"):document.body.classList.add("light-mode"),localStorage.setItem("darkMode",i.toString())})});
