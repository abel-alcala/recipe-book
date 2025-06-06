(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();var Ut;class ve extends Error{}ve.prototype.name="InvalidTokenError";function di(s){return decodeURIComponent(atob(s).replace(/(.)/g,(e,t)=>{let i=t.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function hi(s){let e=s.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return di(e)}catch{return atob(e)}}function ur(s,e){if(typeof s!="string")throw new ve("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,i=s.split(".")[t];if(typeof i!="string")throw new ve(`Invalid token specified: missing part #${t+1}`);let r;try{r=hi(i)}catch(o){throw new ve(`Invalid token specified: invalid base64 for part #${t+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new ve(`Invalid token specified: invalid json for part #${t+1} (${o.message})`)}}const pi="mu:context",ht=`${pi}:change`;class ui{constructor(e,t){this._proxy=gi(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class mt extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new ui(e,this),this.style.display="contents"}attach(e){return this.addEventListener(ht,e),e}detach(e){this.removeEventListener(ht,e)}}function gi(s,e){return new Proxy(s,{get:(i,r,o)=>{if(r==="then")return;const a=Reflect.get(i,r,o);return console.log(`Context['${r}'] => `,a),a},set:(i,r,o,a)=>{const c=s[r];console.log(`Context['${r.toString()}'] <= `,o);const n=Reflect.set(i,r,o,a);if(n){let g=new CustomEvent(ht,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(g,{property:r,oldValue:c,value:o}),e.dispatchEvent(g)}else console.log(`Context['${r}] was not set to ${o}`);return n}})}function mi(s,e){const t=gr(e,s);return new Promise((i,r)=>{if(t){const o=t.localName;customElements.whenDefined(o).then(()=>i(t))}else r({context:e,reason:`No provider for this context "${e}:`})})}function gr(s,e){const t=`[provides="${s}"]`;if(!e||e===document.getRootNode())return;const i=e.closest(t);if(i)return i;const r=e.getRootNode();if(r instanceof ShadowRoot)return gr(s,r.host)}class fi extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function mr(s="mu:message"){return(e,...t)=>e.dispatchEvent(new fi(t,s))}class ft{constructor(e,t,i="service:message",r=!0){this._pending=[],this._context=t,this._update=e,this._eventType=i,this._running=r}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const i=t.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function vi(s){return e=>({...e,...s})}const pt="mu:auth:jwt",fr=class vr extends ft{constructor(e,t){super((i,r)=>this.update(i,r),e,vr.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:i,redirect:r}=e[1];return t(yi(i)),ot(r);case"auth/signout":return t($i()),ot(this._redirectForLogin);case"auth/redirect":return ot(this._redirectForLogin,{next:window.location.href});default:const o=e[0];throw new Error(`Unhandled Auth message "${o}"`)}}};fr.EVENT_TYPE="auth:message";let br=fr;const yr=mr(br.EVENT_TYPE);function ot(s,e={}){if(!s)return;const t=window.location.href,i=new URL(s,t);return Object.entries(e).forEach(([r,o])=>i.searchParams.set(r,o)),()=>{console.log("Redirecting to ",s),window.location.assign(i)}}class bi extends mt{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:ie.authenticateFromLocalStorage()})}connectedCallback(){new br(this.context,this.redirect).attach(this)}}class re{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(pt),e}}class ie extends re{constructor(e){super();const t=ur(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new ie(e);return localStorage.setItem(pt,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(pt);return e?ie.authenticate(e):new re}}function yi(s){return vi({user:ie.authenticate(s),token:s})}function $i(){return s=>{const e=s.user;return{user:e&&e.authenticated?re.deauthenticate(e):e,token:""}}}function xi(s){return s.authenticated?{Authorization:`Bearer ${s.token||"NO_TOKEN"}`}:{}}function _i(s){return s.authenticated?ur(s.token||""):{}}const A=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ie,Provider:bi,User:re,dispatch:yr,headers:xi,payload:_i},Symbol.toStringTag,{value:"Module"}));function je(s,e,t){const i=s.target,r=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${s.type}:`,r),i.dispatchEvent(r),s.stopPropagation()}function ut(s,e="*"){return s.composedPath().find(i=>{const r=i;return r.tagName&&r.matches(e)})}const wi=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ut,relay:je},Symbol.toStringTag,{value:"Module"})),ki=new DOMParser;function Me(s,...e){const t=s.map((a,c)=>c?[e[c-1],a]:[a]).flat().join(""),i=ki.parseFromString(t,"text/html"),r=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...r),o}function Ke(s){const e=s.firstElementChild,t=e&&e.tagName==="TEMPLATE"?e:void 0;return{attach:i};function i(r,o={mode:"open"}){const a=r.attachShadow(o);return t&&a.appendChild(t.content.cloneNode(!0)),a}}const $r=class xr extends HTMLElement{constructor(){super(),this._state={},Ke(xr.template).attach(this),this.addEventListener("change",e=>{const t=e.target;if(t){const i=t.name,r=t.value;i&&(this._state[i]=r)}}),this.form&&this.form.addEventListener("submit",e=>{e.preventDefault(),je(e,"mu-form:submit",this._state)})}set init(e){this._state=e||{},Ei(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}};$r.template=Me`
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
  `;let Si=$r;function Ei(s,e){const t=Object.entries(s);for(const[i,r]of t){const o=e.querySelector(`[name="${i}"]`);if(o){const a=o;switch(a.type){case"checkbox":const c=a;c.checked=!!r;break;case"date":a.value=r.toISOString().substr(0,10);break;default:a.value=r;break}}}return s}const _r=Object.freeze(Object.defineProperty({__proto__:null,Element:Si},Symbol.toStringTag,{value:"Module"})),wr=class kr extends ft{constructor(e){super((t,i)=>this.update(t,i),e,kr.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:i,state:r}=e[1];t(Ci(i,r));break}case"history/redirect":{const{href:i,state:r}=e[1];t(Pi(i,r));break}}}};wr.EVENT_TYPE="history:message";let vt=wr;class jt extends mt{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=Ai(e);if(t){const i=new URL(t.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),bt(t,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new vt(this.context).attach(this)}}function Ai(s){const e=s.currentTarget,t=i=>i.tagName=="A"&&i.href;if(s.button===0)if(s.composed){const r=s.composedPath().find(t);return r||void 0}else{for(let i=s.target;i;i===e?null:i.parentElement)if(t(i))return i;return}}function Ci(s,e={}){return history.pushState(e,"",s),()=>({location:document.location,state:history.state})}function Pi(s,e={}){return history.replaceState(e,"",s),()=>({location:document.location,state:history.state})}const bt=mr(vt.EVENT_TYPE),se=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:jt,Provider:jt,Service:vt,dispatch:bt},Symbol.toStringTag,{value:"Module"}));class Y{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,i)=>{if(this._provider){const r=new Ht(this._provider,e);this._effects.push(r),t(r)}else mi(this._target,this._contextLabel).then(r=>{const o=new Ht(r,e);this._provider=r,this._effects.push(o),r.attach(a=>this._handleChange(a)),t(o)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),this._effects.forEach(t=>t.runEffect())}}class Ht{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Sr=class Er extends HTMLElement{constructor(){super(),this._state={},this._user=new re,this._authObserver=new Y(this,"blazing:auth"),Ke(Er.template).attach(this),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Oi(r,this._state,t,this.authorization).then(o=>ue(o,this)).then(o=>{const a=`mu-rest-form:${i}`,c=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:t,[i]:o,url:r}});this.dispatchEvent(c)}).catch(o=>{const a="mu-rest-form:error",c=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:t,error:o,url:r,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const i=t.name,r=t.value;i&&(this._state[i]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},ue(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&Ft(this.src,this.authorization).then(t=>{this._state=t,ue(t,this)}))})}attributeChangedCallback(e,t,i){switch(e){case"src":this.src&&i&&i!==t&&!this.isNew&&Ft(this.src,this.authorization).then(r=>{this._state=r,ue(r,this)});break;case"new":i&&(this._state={},ue({},this));break}}};Sr.observedAttributes=["src","new","action"];Sr.template=Me`
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
  `;function Ft(s,e){return fetch(s,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${s}:`,t))}function ue(s,e){const t=Object.entries(s);for(const[i,r]of t){const o=e.querySelector(`[name="${i}"]`);if(o){const a=o;switch(a.type){case"checkbox":const c=a;c.checked=!!r;break;default:a.value=r;break}}}return s}function Oi(s,e,t="PUT",i={}){return fetch(s,{method:t,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(e)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Ar=class Cr extends ft{constructor(e,t){super(t,e,Cr.EVENT_TYPE,!1)}};Ar.EVENT_TYPE="mu:message";let Pr=Ar;class Mi extends mt{constructor(e,t,i){super(t),this._user=new re,this._updateFn=e,this._authObserver=new Y(this,i)}connectedCallback(){const e=new Pr(this.context,(t,i)=>this._updateFn(t,i,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const Ti=Object.freeze(Object.defineProperty({__proto__:null,Provider:Mi,Service:Pr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=globalThis,yt=Le.ShadowRoot&&(Le.ShadyCSS===void 0||Le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$t=Symbol(),qt=new WeakMap;let Or=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==$t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(yt&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=qt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&qt.set(t,e))}return e}toString(){return this.cssText}};const Di=s=>new Or(typeof s=="string"?s:s+"",void 0,$t),Ii=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new Or(t,s,$t)},zi=(s,e)=>{if(yt)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),r=Le.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}},Bt=yt?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return Di(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ri,defineProperty:Ni,getOwnPropertyDescriptor:Li,getOwnPropertyNames:Ui,getOwnPropertySymbols:ji,getPrototypeOf:Hi}=Object,oe=globalThis,Yt=oe.trustedTypes,Fi=Yt?Yt.emptyScript:"",Wt=oe.reactiveElementPolyfillSupport,be=(s,e)=>s,He={toAttribute(s,e){switch(e){case Boolean:s=s?Fi:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},xt=(s,e)=>!Ri(s,e),Vt={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:xt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),oe.litPropertyMetadata??(oe.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Vt){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&Ni(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=Li(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get(){return r==null?void 0:r.call(this)},set(a){const c=r==null?void 0:r.call(this);o.call(this,a),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Vt}static _$Ei(){if(this.hasOwnProperty(be("elementProperties")))return;const e=Hi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(be("properties"))){const t=this.properties,i=[...Ui(t),...ji(t)];for(const r of i)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)t.unshift(Bt(r))}else e!==void 0&&t.push(Bt(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zi(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EC(e,t){var i;const r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(o!==void 0&&r.reflect===!0){const a=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:He).toAttribute(t,r.type);this._$Em=e,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){var i;const r=this.constructor,o=r._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const a=r.getPropertyOptions(o),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:He;this._$Em=o,this[o]=c.fromAttribute(t,a.type),this._$Em=null}}requestUpdate(e,t,i){if(e!==void 0){if(i??(i=this.constructor.getPropertyOptions(e)),!(i.hasChanged??xt)(this[e],t))return;this.P(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,i){this._$AL.has(e)||this._$AL.set(e,t),i.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r)a.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],a)}let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(i)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[be("elementProperties")]=new Map,G[be("finalized")]=new Map,Wt==null||Wt({ReactiveElement:G}),(oe.reactiveElementVersions??(oe.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fe=globalThis,qe=Fe.trustedTypes,Jt=qe?qe.createPolicy("lit-html",{createHTML:s=>s}):void 0,Mr="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,Tr="?"+D,qi=`<${Tr}>`,W=document,xe=()=>W.createComment(""),_e=s=>s===null||typeof s!="object"&&typeof s!="function",Dr=Array.isArray,Bi=s=>Dr(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",at=`[ 	
\f\r]`,ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Kt=/-->/g,Xt=/>/g,j=RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Zt=/'/g,Gt=/"/g,Ir=/^(?:script|style|textarea|title)$/i,Yi=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),me=Yi(1),ae=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Qt=new WeakMap,F=W.createTreeWalker(W,129);function zr(s,e){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Jt!==void 0?Jt.createHTML(e):e}const Wi=(s,e)=>{const t=s.length-1,i=[];let r,o=e===2?"<svg>":"",a=ge;for(let c=0;c<t;c++){const n=s[c];let g,m,p=-1,l=0;for(;l<n.length&&(a.lastIndex=l,m=a.exec(n),m!==null);)l=a.lastIndex,a===ge?m[1]==="!--"?a=Kt:m[1]!==void 0?a=Xt:m[2]!==void 0?(Ir.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=j):m[3]!==void 0&&(a=j):a===j?m[0]===">"?(a=r??ge,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,g=m[1],a=m[3]===void 0?j:m[3]==='"'?Gt:Zt):a===Gt||a===Zt?a=j:a===Kt||a===Xt?a=ge:(a=j,r=void 0);const h=a===j&&s[c+1].startsWith("/>")?" ":"";o+=a===ge?n+qi:p>=0?(i.push(g),n.slice(0,p)+Mr+n.slice(p)+D+h):n+D+(p===-2?c:h)}return[zr(s,o+(s[t]||"<?>")+(e===2?"</svg>":"")),i]};let gt=class Rr{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,a=0;const c=e.length-1,n=this.parts,[g,m]=Wi(e,t);if(this.el=Rr.createElement(g,i),F.currentNode=this.el.content,t===2){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=F.nextNode())!==null&&n.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(Mr)){const l=m[a++],h=r.getAttribute(p).split(D),u=/([.?@])?(.*)/.exec(l);n.push({type:1,index:o,name:u[2],strings:h,ctor:u[1]==="."?Ji:u[1]==="?"?Ki:u[1]==="@"?Xi:Xe}),r.removeAttribute(p)}else p.startsWith(D)&&(n.push({type:6,index:o}),r.removeAttribute(p));if(Ir.test(r.tagName)){const p=r.textContent.split(D),l=p.length-1;if(l>0){r.textContent=qe?qe.emptyScript:"";for(let h=0;h<l;h++)r.append(p[h],xe()),F.nextNode(),n.push({type:2,index:++o});r.append(p[l],xe())}}}else if(r.nodeType===8)if(r.data===Tr)n.push({type:2,index:o});else{let p=-1;for(;(p=r.data.indexOf(D,p+1))!==-1;)n.push({type:7,index:o}),p+=D.length-1}o++}}static createElement(e,t){const i=W.createElement("template");return i.innerHTML=e,i}};function ne(s,e,t=s,i){var r,o;if(e===ae)return e;let a=i!==void 0?(r=t._$Co)==null?void 0:r[i]:t._$Cl;const c=_e(e)?void 0:e._$litDirective$;return(a==null?void 0:a.constructor)!==c&&((o=a==null?void 0:a._$AO)==null||o.call(a,!1),c===void 0?a=void 0:(a=new c(s),a._$AT(s,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=a:t._$Cl=a),a!==void 0&&(e=ne(s,a._$AS(s,e.values),a,i)),e}let Vi=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=((e==null?void 0:e.creationScope)??W).importNode(t,!0);F.currentNode=r;let o=F.nextNode(),a=0,c=0,n=i[0];for(;n!==void 0;){if(a===n.index){let g;n.type===2?g=new _t(o,o.nextSibling,this,e):n.type===1?g=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(g=new Zi(o,this,e)),this._$AV.push(g),n=i[++c]}a!==(n==null?void 0:n.index)&&(o=F.nextNode(),a++)}return F.currentNode=W,r}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},_t=class Nr{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ne(this,e,t),_e(e)?e===x||e==null||e===""?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==ae&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Bi(e)?this.k(e):this._(e)}S(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}_(e){this._$AH!==x&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(W.createTextNode(e)),this._$AH=e}$(e){var t;const{values:i,_$litType$:r}=e,o=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=gt.createElement(zr(r.h,r.h[0]),this.options)),r);if(((t=this._$AH)==null?void 0:t._$AD)===o)this._$AH.p(i);else{const a=new Vi(o,this),c=a.u(this.options);a.p(i),this.T(c),this._$AH=a}}_$AC(e){let t=Qt.get(e.strings);return t===void 0&&Qt.set(e.strings,t=new gt(e)),t}k(e){Dr(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new Nr(this.S(xe()),this.S(xe()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},Xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=x}_$AI(e,t=this,i,r){const o=this.strings;let a=!1;if(o===void 0)e=ne(this,e,t,0),a=!_e(e)||e!==this._$AH&&e!==ae,a&&(this._$AH=e);else{const c=e;let n,g;for(e=o[0],n=0;n<o.length-1;n++)g=ne(this,c[i+n],t,n),g===ae&&(g=this._$AH[n]),a||(a=!_e(g)||g!==this._$AH[n]),g===x?e=x:e!==x&&(e+=(g??"")+o[n+1]),this._$AH[n]=g}a&&!r&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ji=class extends Xe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}},Ki=class extends Xe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}},Xi=class extends Xe{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=ne(this,e,t,0)??x)===ae)return;const i=this._$AH,r=e===x&&i!==x||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==x&&(i===x||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}},Zi=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ne(this,e)}};const er=Fe.litHtmlPolyfillSupport;er==null||er(gt,_t),(Fe.litHtmlVersions??(Fe.litHtmlVersions=[])).push("3.1.3");const Gi=(s,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let r=i._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;i._$litPart$=r=new _t(e.insertBefore(xe(),o),o,void 0,t??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ee=class extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Gi(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ae}};ee._$litElement$=!0,ee.finalized=!0,(Ut=globalThis.litElementHydrateSupport)==null||Ut.call(globalThis,{LitElement:ee});const tr=globalThis.litElementPolyfillSupport;tr==null||tr({LitElement:ee});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qi={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:xt},es=(s=Qi,e,t)=>{const{kind:i,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(t.name,s),i==="accessor"){const{name:a}=t;return{set(c){const n=e.get.call(this);e.set.call(this,c),this.requestUpdate(a,n,s)},init(c){return c!==void 0&&this.P(a,void 0,s),c}}}if(i==="setter"){const{name:a}=t;return function(c){const n=this[a];e.call(this,c),this.requestUpdate(a,n,s)}}throw Error("Unsupported decorator location: "+i)};function Lr(s){return(e,t)=>typeof t=="object"?es(s,e,t):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,a?{...i,wrapped:!0}:i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ur(s){return Lr({...s,state:!0,attribute:!1})}function ts(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function rs(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var jr={};(function(s){var e=function(){var t=function(p,l,h,u){for(h=h||{},u=p.length;u--;h[p[u]]=l);return h},i=[1,9],r=[1,10],o=[1,11],a=[1,12],c=[5,11,12,13,14,15],n={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,u,v,f,y,et){var k=y.length-1;switch(f){case 1:return new v.Root({},[y[k-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[y[k-1],y[k]]);break;case 4:case 5:this.$=y[k];break;case 6:this.$=new v.Literal({value:y[k]});break;case 7:this.$=new v.Splat({name:y[k]});break;case 8:this.$=new v.Param({name:y[k]});break;case 9:this.$=new v.Optional({},[y[k-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},{1:[2,2]},t(c,[2,4]),t(c,[2,5]),t(c,[2,6]),t(c,[2,7]),t(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},t(c,[2,10]),t(c,[2,11]),t(c,[2,12]),{1:[2,1]},t(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:r,14:o,15:a},t(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let u=function(v,f){this.message=v,this.hash=f};throw u.prototype=Error,new u(l,h)}},parse:function(l){var h=this,u=[0],v=[null],f=[],y=this.table,et="",k=0,Rt=0,ai=2,Nt=1,ni=f.slice.call(arguments,1),$=Object.create(this.lexer),L={yy:{}};for(var tt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,tt)&&(L.yy[tt]=this.yy[tt]);$.setInput(l,L.yy),L.yy.lexer=$,L.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var rt=$.yylloc;f.push(rt);var ci=$.options&&$.options.ranges;typeof L.yy.parseError=="function"?this.parseError=L.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var li=function(){var X;return X=$.lex()||Nt,typeof X!="number"&&(X=h.symbols_[X]||X),X},w,U,E,it,K={},Re,P,Lt,Ne;;){if(U=u[u.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=li()),E=y[U]&&y[U][w]),typeof E>"u"||!E.length||!E[0]){var st="";Ne=[];for(Re in y[U])this.terminals_[Re]&&Re>ai&&Ne.push("'"+this.terminals_[Re]+"'");$.showPosition?st="Parse error on line "+(k+1)+`:
`+$.showPosition()+`
Expecting `+Ne.join(", ")+", got '"+(this.terminals_[w]||w)+"'":st="Parse error on line "+(k+1)+": Unexpected "+(w==Nt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(st,{text:$.match,token:this.terminals_[w]||w,line:$.yylineno,loc:rt,expected:Ne})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(E[0]){case 1:u.push(w),v.push($.yytext),f.push($.yylloc),u.push(E[1]),w=null,Rt=$.yyleng,et=$.yytext,k=$.yylineno,rt=$.yylloc;break;case 2:if(P=this.productions_[E[1]][1],K.$=v[v.length-P],K._$={first_line:f[f.length-(P||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(P||1)].first_column,last_column:f[f.length-1].last_column},ci&&(K._$.range=[f[f.length-(P||1)].range[0],f[f.length-1].range[1]]),it=this.performAction.apply(K,[et,Rt,k,L.yy,E[1],v,f].concat(ni)),typeof it<"u")return it;P&&(u=u.slice(0,-1*P*2),v=v.slice(0,-1*P),f=f.slice(0,-1*P)),u.push(this.productions_[E[1]][0]),v.push(K.$),f.push(K._$),Lt=y[u[u.length-2]][u[u.length-1]],u.push(Lt);break;case 3:return!0}}return!0}},g=function(){var p={EOF:1,parseError:function(h,u){if(this.yy.parser)this.yy.parser.parseError(h,u);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,u=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===v.length?this.yylloc.first_column:0)+v[v.length-u.length].length-u[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var u,v,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),v=l[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],u=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var y in f)this[y]=f[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,u,v;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),y=0;y<f.length;y++)if(u=this._input.match(this.rules[f[y]]),u&&(!h||u[0].length>h[0].length)){if(h=u,v=y,this.options.backtrack_lexer){if(l=this.test_match(u,f[y]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,f[v]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,u,v,f){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return p}();n.lexer=g;function m(){this.yy={}}return m.prototype=n,n.Parser=m,new m}();typeof rs<"u"&&(s.parser=e,s.Parser=e.Parser,s.parse=function(){return e.parse.apply(e,arguments)})})(jr);function Z(s){return function(e,t){return{displayName:s,props:e,children:t||[]}}}var Hr={Root:Z("Root"),Concat:Z("Concat"),Literal:Z("Literal"),Splat:Z("Splat"),Param:Z("Param"),Optional:Z("Optional")},Fr=jr.parser;Fr.yy=Hr;var is=Fr,ss=Object.keys(Hr);function os(s){return ss.forEach(function(e){if(typeof s[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:s}}var qr=os,as=qr,ns=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Br(s){this.captures=s.captures,this.re=s.re}Br.prototype.match=function(s){var e=this.re.exec(s),t={};if(e)return this.captures.forEach(function(i,r){typeof e[r+1]>"u"?t[i]=void 0:t[i]=decodeURIComponent(e[r+1])}),t};var cs=as({Concat:function(s){return s.children.reduce((function(e,t){var i=this.visit(t);return{re:e.re+i.re,captures:e.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(s){return{re:s.props.value.replace(ns,"\\$&"),captures:[]}},Splat:function(s){return{re:"([^?]*?)",captures:[s.props.name]}},Param:function(s){return{re:"([^\\/\\?]+)",captures:[s.props.name]}},Optional:function(s){var e=this.visit(s.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(s){var e=this.visit(s.children[0]);return new Br({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),ls=cs,ds=qr,hs=ds({Concat:function(s,e){var t=s.children.map((function(i){return this.visit(i,e)}).bind(this));return t.some(function(i){return i===!1})?!1:t.join("")},Literal:function(s){return decodeURI(s.props.value)},Splat:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Param:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Optional:function(s,e){var t=this.visit(s.children[0],e);return t||""},Root:function(s,e){e=e||{};var t=this.visit(s.children[0],e);return t?encodeURI(t):!1}}),ps=hs,us=is,gs=ls,ms=ps;Te.prototype=Object.create(null);Te.prototype.match=function(s){var e=gs.visit(this.ast),t=e.match(s);return t||!1};Te.prototype.reverse=function(s){return ms.visit(this.ast,s)};function Te(s){var e;if(this?e=this:e=Object.create(Te.prototype),typeof s>"u")throw new Error("A route spec is required");return e.spec=s,e.ast=us.parse(s),e}var fs=Te,vs=fs,bs=vs;const ys=ts(bs);var $s=Object.defineProperty,Yr=(s,e,t,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(e,t,r)||r);return r&&$s(e,t,r),r};class we extends ee{constructor(e,t,i=""){super(),this._cases=[],this._fallback=()=>me`
      <h1>Not Found</h1>
    `,this._cases=e.map(r=>({...r,route:new ys(r.path)})),this._historyObserver=new Y(this,t),this._authObserver=new Y(this,i)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),me`
      <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(yr(this,"auth/redirect"),me`
              <h1>Redirecting for Login</h1>
            `):t.view(t.params||{}):me`
              <h1>Authenticating</h1>
            `;if("redirect"in t){const i=t.redirect;if(typeof i=="string")return this.redirect(i),me`
              <h1>Redirecting to ${i}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:i}=e,r=new URLSearchParams(t),o=i+t;for(const a of this._cases){const c=a.route.match(o);if(c)return{...a,path:i,params:c,query:r}}}redirect(e){bt(this,"history/redirect",{href:e})}}we.styles=Ii`
    :host,
    main {
      display: contents;
    }
  `;Yr([Ur()],we.prototype,"_user");Yr([Ur()],we.prototype,"_match");const xs=Object.freeze(Object.defineProperty({__proto__:null,Element:we,Switch:we},Symbol.toStringTag,{value:"Module"})),Wr=class Vr extends HTMLElement{constructor(){if(super(),Ke(Vr.template).attach(this),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Wr.template=Me`
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
  `;let _s=Wr;const ws=Object.freeze(Object.defineProperty({__proto__:null,Element:_s},Symbol.toStringTag,{value:"Module"})),ks=class Jr extends HTMLElement{constructor(){super(),this._array=[],Ke(Jr.template).attach(this),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(Kr("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const i=new Event("change",{bubbles:!0}),r=t.value,o=t.closest("label");if(o){const a=Array.from(this.children).indexOf(o);this._array[a]=r,this.dispatchEvent(i)}}}),this.addEventListener("click",e=>{ut(e,"button.add")?je(e,"input-array:add"):ut(e,"button.remove")&&je(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],Ss(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const i=Array.from(this.children).indexOf(t);this._array.splice(i,1),t.remove()}}};ks.template=Me`
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
  `;function Ss(s,e){e.replaceChildren(),s.forEach((t,i)=>e.append(Kr(t)))}function Kr(s,e){const t=s===void 0?"":`value="${s}"`;return Me`
    <label>
      <input ${t} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Ze(s){return Object.entries(s).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var Es=Object.defineProperty,As=Object.getOwnPropertyDescriptor,Cs=(s,e,t,i)=>{for(var r=As(e,t),o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(e,t,r)||r);return r&&Es(e,t,r),r};class M extends ee{constructor(e){super(),this._pending=[],this._observer=new Y(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([i,r])=>{console.log("Dispatching queued event",r,i),i.dispatchEvent(r)}),t.setEffect(()=>{var i;if(console.log("View effect",this,t,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",i),t.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([t,i]))}ref(e){return this.model?this.model[e]:void 0}}Cs([Lr()],M.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=globalThis,wt=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kt=Symbol(),rr=new WeakMap;let Xr=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(wt&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=rr.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&rr.set(t,e))}return e}toString(){return this.cssText}};const Ps=s=>new Xr(typeof s=="string"?s:s+"",void 0,kt),S=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new Xr(t,s,kt)},Os=(s,e)=>{if(wt)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),r=Ue.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}},ir=wt?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return Ps(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ms,defineProperty:Ts,getOwnPropertyDescriptor:Ds,getOwnPropertyNames:Is,getOwnPropertySymbols:zs,getPrototypeOf:Rs}=Object,z=globalThis,sr=z.trustedTypes,Ns=sr?sr.emptyScript:"",nt=z.reactiveElementPolyfillSupport,ye=(s,e)=>s,Be={toAttribute(s,e){switch(e){case Boolean:s=s?Ns:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},St=(s,e)=>!Ms(s,e),or={attribute:!0,type:String,converter:Be,reflect:!1,useDefault:!1,hasChanged:St};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),z.litPropertyMetadata??(z.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=or){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&Ts(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=Ds(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:r,set(a){const c=r==null?void 0:r.call(this);o==null||o.call(this,a),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??or}static _$Ei(){if(this.hasOwnProperty(ye("elementProperties")))return;const e=Rs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ye("properties"))){const t=this.properties,i=[...Is(t),...zs(t)];for(const r of i)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)t.unshift(ir(r))}else e!==void 0&&t.push(ir(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Os(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var o;const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){const a=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:Be).toAttribute(t,i.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){var o,a;const i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const c=i.getPropertyOptions(r),n=typeof c.converter=="function"?{fromAttribute:c.converter}:((o=c.converter)==null?void 0:o.fromAttribute)!==void 0?c.converter:Be;this._$Em=r,this[r]=n.fromAttribute(t,c.type)??((a=this._$Ej)==null?void 0:a.get(r))??null,this._$Em=null}}requestUpdate(e,t,i){var r;if(e!==void 0){const o=this.constructor,a=this[e];if(i??(i=o.getPropertyOptions(e)),!((i.hasChanged??St)(a,t)||i.useDefault&&i.reflect&&a===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},a){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r){const{wrapped:c}=a,n=this[o];c!==!0||this._$AL.has(o)||n===void 0||this.C(o,void 0,a,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ye("elementProperties")]=new Map,Q[ye("finalized")]=new Map,nt==null||nt({ReactiveElement:Q}),(z.reactiveElementVersions??(z.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $e=globalThis,Ye=$e.trustedTypes,ar=Ye?Ye.createPolicy("lit-html",{createHTML:s=>s}):void 0,Zr="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,Gr="?"+I,Ls=`<${Gr}>`,V=document,ke=()=>V.createComment(""),Se=s=>s===null||typeof s!="object"&&typeof s!="function",Et=Array.isArray,Us=s=>Et(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ct=`[ 	
\f\r]`,fe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,nr=/-->/g,cr=/>/g,H=RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lr=/'/g,dr=/"/g,Qr=/^(?:script|style|textarea|title)$/i,js=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),d=js(1),ce=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),hr=new WeakMap,q=V.createTreeWalker(V,129);function ei(s,e){if(!Et(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ar!==void 0?ar.createHTML(e):e}const Hs=(s,e)=>{const t=s.length-1,i=[];let r,o=e===2?"<svg>":e===3?"<math>":"",a=fe;for(let c=0;c<t;c++){const n=s[c];let g,m,p=-1,l=0;for(;l<n.length&&(a.lastIndex=l,m=a.exec(n),m!==null);)l=a.lastIndex,a===fe?m[1]==="!--"?a=nr:m[1]!==void 0?a=cr:m[2]!==void 0?(Qr.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=H):m[3]!==void 0&&(a=H):a===H?m[0]===">"?(a=r??fe,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,g=m[1],a=m[3]===void 0?H:m[3]==='"'?dr:lr):a===dr||a===lr?a=H:a===nr||a===cr?a=fe:(a=H,r=void 0);const h=a===H&&s[c+1].startsWith("/>")?" ":"";o+=a===fe?n+Ls:p>=0?(i.push(g),n.slice(0,p)+Zr+n.slice(p)+I+h):n+I+(p===-2?c:h)}return[ei(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class Ee{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,a=0;const c=e.length-1,n=this.parts,[g,m]=Hs(e,t);if(this.el=Ee.createElement(g,i),q.currentNode=this.el.content,t===2||t===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=q.nextNode())!==null&&n.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(Zr)){const l=m[a++],h=r.getAttribute(p).split(I),u=/([.?@])?(.*)/.exec(l);n.push({type:1,index:o,name:u[2],strings:h,ctor:u[1]==="."?qs:u[1]==="?"?Bs:u[1]==="@"?Ys:Ge}),r.removeAttribute(p)}else p.startsWith(I)&&(n.push({type:6,index:o}),r.removeAttribute(p));if(Qr.test(r.tagName)){const p=r.textContent.split(I),l=p.length-1;if(l>0){r.textContent=Ye?Ye.emptyScript:"";for(let h=0;h<l;h++)r.append(p[h],ke()),q.nextNode(),n.push({type:2,index:++o});r.append(p[l],ke())}}}else if(r.nodeType===8)if(r.data===Gr)n.push({type:2,index:o});else{let p=-1;for(;(p=r.data.indexOf(I,p+1))!==-1;)n.push({type:7,index:o}),p+=I.length-1}o++}}static createElement(e,t){const i=V.createElement("template");return i.innerHTML=e,i}}function le(s,e,t=s,i){var a,c;if(e===ce)return e;let r=i!==void 0?(a=t._$Co)==null?void 0:a[i]:t._$Cl;const o=Se(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((c=r==null?void 0:r._$AO)==null||c.call(r,!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=r:t._$Cl=r),r!==void 0&&(e=le(s,r._$AS(s,e.values),r,i)),e}class Fs{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=((e==null?void 0:e.creationScope)??V).importNode(t,!0);q.currentNode=r;let o=q.nextNode(),a=0,c=0,n=i[0];for(;n!==void 0;){if(a===n.index){let g;n.type===2?g=new De(o,o.nextSibling,this,e):n.type===1?g=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(g=new Ws(o,this,e)),this._$AV.push(g),n=i[++c]}a!==(n==null?void 0:n.index)&&(o=q.nextNode(),a++)}return q.currentNode=V,r}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class De{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=le(this,e,t),Se(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==ce&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Us(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&Se(this._$AH)?this._$AA.nextSibling.data=e:this.T(V.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Ee.createElement(ei(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{const a=new Fs(r,this),c=a.u(this.options);a.p(t),this.T(c),this._$AH=a}}_$AC(e){let t=hr.get(e.strings);return t===void 0&&hr.set(e.strings,t=new Ee(e)),t}k(e){Et(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new De(this.O(ke()),this.O(ke()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Ge{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(e,t=this,i,r){const o=this.strings;let a=!1;if(o===void 0)e=le(this,e,t,0),a=!Se(e)||e!==this._$AH&&e!==ce,a&&(this._$AH=e);else{const c=e;let n,g;for(e=o[0],n=0;n<o.length-1;n++)g=le(this,c[i+n],t,n),g===ce&&(g=this._$AH[n]),a||(a=!Se(g)||g!==this._$AH[n]),g===_?e=_:e!==_&&(e+=(g??"")+o[n+1]),this._$AH[n]=g}a&&!r&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class qs extends Ge{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class Bs extends Ge{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Ys extends Ge{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=le(this,e,t,0)??_)===ce)return;const i=this._$AH,r=e===_&&i!==_||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==_&&(i===_||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ws{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){le(this,e)}}const lt=$e.litHtmlPolyfillSupport;lt==null||lt(Ee,De),($e.litHtmlVersions??($e.litHtmlVersions=[])).push("3.3.0");const Vs=(s,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let r=i._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;i._$litPart$=r=new De(e.insertBefore(ke(),o),o,void 0,t??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=globalThis;class te extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Vs(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ce}}var pr;te._$litElement$=!0,te.finalized=!0,(pr=B.litElementHydrateSupport)==null||pr.call(B,{LitElement:te});const dt=B.litElementPolyfillSupport;dt==null||dt({LitElement:te});(B.litElementVersions??(B.litElementVersions=[])).push("4.2.0");const Js={};function Ks(s,e,t){switch(s[0]){case"chef/load":Xs(s[1],t).then(r=>e(o=>({...o,chef:r}))).catch(r=>{console.error("Failed to load chef:",r)});break;case"chef/save":Zs(s[1],t).then(r=>e(o=>({...o,chef:r}))).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{console.error("Failed to save chef:",r);const{onFailure:o}=s[1];o&&o(r)});break;case"chefs/load":Gs(t).then(r=>e(o=>({...o,chefs:r}))).catch(r=>{console.error("Failed to load chefs:",r)});break;case"recipe/load":Qs(s[1],t).then(r=>e(o=>({...o,recipe:r}))).catch(r=>{console.error("Failed to load recipe:",r)});break;case"recipe/create":eo(s[1],t).then(r=>e(o=>({...o,recipe:r}))).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{console.error("Failed to create recipe:",r);const{onFailure:o}=s[1];o&&o(r)});break;case"recipes/load":to().then(r=>e(o=>({...o,recipes:r}))).catch(r=>{console.error("Failed to load recipes:",r)});break;case"cuisine/load":ro(s[1],t).then(r=>e(o=>({...o,cuisine:r}))).catch(r=>{console.error("Failed to load cuisine:",r)});break;case"cuisines/load":io(t).then(r=>e(o=>({...o,cuisines:r}))).catch(r=>{console.error("Failed to load cuisines:",r)});break;case"ingredient/load":so(s[1],t).then(r=>e(o=>({...o,ingredient:r}))).catch(r=>{console.error("Failed to load ingredient:",r)});break;case"ingredients/load":oo(t).then(r=>e(o=>({...o,ingredients:r}))).catch(r=>{console.error("Failed to load ingredients:",r)});break;case"mealplan/load":ao(s[1]).then(r=>{e(a=>({...a,mealplan:r}));const{onSuccess:o}=s[1];o&&o()}).catch(r=>{console.error("Failed to load meal plan:",r),e(a=>({...a,mealplan:void 0}));const{onFailure:o}=s[1];o&&o(r)});break;case"mealplans/load":no().then(r=>e(o=>({...o,mealplans:r}))).catch(r=>{console.error("Failed to load meal plans:",r)});break;default:const i=s[0];throw new Error(`Unhandled message "${i}"`)}}function Xs(s,e){return fetch(`/api/chefs/${s.chefId}`,{headers:A.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load chef: ${t.status}`)}).then(t=>(console.log("Chef loaded:",t),t))}function Zs(s,e){return fetch(`/api/chefs/${s.chefId}`,{method:"PUT",headers:{...A.headers(e),"Content-Type":"application/json"},body:JSON.stringify(s.chef)}).then(t=>{if(t.status===200)return t.json();throw t.status===401?new Error("You are not authorized to edit this chef profile"):t.status===403?new Error("You can only edit your own chef profile"):new Error(`Failed to save chef: ${t.status}`)}).then(t=>(console.log("Chef saved:",t),t))}function Gs(s){return fetch("/api/chefs",{headers:A.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load chefs: ${e.status}`)}).then(e=>(console.log("Chefs loaded:",e),e))}function Qs(s,e){return fetch(`/api/recipes/${s.recipeId}`,{headers:A.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load recipe: ${t.status}`)}).then(t=>(console.log("Recipe loaded:",t),t))}function eo(s,e){return fetch("/api/recipes",{method:"POST",headers:{...A.headers(e),"Content-Type":"application/json"},body:JSON.stringify(s.recipe)}).then(t=>{if(t.status===201)return t.json();throw t.status===401?new Error("You are not authorized to create recipes"):new Error(`Failed to create recipe: ${t.status}`)}).then(t=>(console.log("Recipe created:",t),t))}function to(){return fetch("/api/recipes").then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to load recipes: ${s.status}`)}).then(s=>(console.log("Recipes loaded:",s),s))}function ro(s,e){return fetch(`/api/cuisines/${s.cuisineId}`,{headers:A.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load cuisine: ${t.status}`)}).then(t=>(console.log("Cuisine loaded:",t),t))}function io(s){return fetch("/api/cuisines",{headers:A.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load cuisines: ${e.status}`)}).then(e=>(console.log("Cuisines loaded:",e),e))}function so(s,e){return fetch(`/api/ingredients/${s.ingredientId}`,{headers:A.headers(e)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load ingredient: ${t.status}`)}).then(t=>(console.log("Ingredient loaded:",t),t))}function oo(s){return fetch("/api/ingredients",{headers:A.headers(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load ingredients: ${e.status}`)}).then(e=>(console.log("Ingredients loaded:",e),e))}function ao(s){return fetch(`/api/mealplans/${s.mealplanId}`).then(e=>{if(e.status===200)return e.json();throw e.status===404?new Error(`Meal plan "${s.mealplanId}" not found`):e.status>=500?new Error("Server error while loading meal plan. Please try again later."):new Error(`Failed to load meal plan: ${e.status}`)}).then(e=>{console.log("Meal plan loaded:",e);const t=e;if(!t.name||!t.idName)throw new Error("Invalid meal plan data received from server");return t.recipes||(t.recipes=[]),t.recipes=t.recipes.map(i=>({...i,href:i.href||"#",name:i.name||"Untitled Recipe"})),t}).catch(e=>{throw e instanceof TypeError&&e.message.includes("fetch")?new Error("Network error: Unable to connect to server"):e})}function no(){return fetch("/api/mealplans").then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to load meal plans: ${s.status}`)}).then(s=>(console.log("Meal plans loaded:",s),s))}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const co={attribute:!0,type:String,converter:Be,reflect:!1,hasChanged:St},lo=(s=co,e,t)=>{const{kind:i,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(t.name,s),i==="accessor"){const{name:a}=t;return{set(c){const n=e.get.call(this);e.set.call(this,c),this.requestUpdate(a,n,s)},init(c){return c!==void 0&&this.C(a,void 0,s,c),c}}}if(i==="setter"){const{name:a}=t;return function(c){const n=this[a];e.call(this,c),this.requestUpdate(a,n,s)}}throw Error("Unsupported decorator location: "+i)};function C(s){return(e,t)=>typeof t=="object"?lo(s,e,t):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(s){return C({...s,state:!0,attribute:!1})}const ho=S`
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
`,po=S`
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
`,T=[ho,po];var uo=Object.defineProperty,At=(s,e,t,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(e,t,r)||r);return r&&uo(e,t,r),r};const We=class We extends te{constructor(){super(...arguments),this._authObserver=new Y(this,"recipebook:auth"),this.loggedIn=!1,this.isDarkMode=!0}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:i}=t;i&&i.authenticated?(this.loggedIn=!0,this.userid=i.username):(this.loggedIn=!1,this.userid=void 0),this.requestUpdate()});const e=localStorage.getItem("darkMode");this.isDarkMode=e===null?!0:e==="true",this.isDarkMode||this.classList.add("light-mode")}firstUpdated(){this._setInitialCheckboxState()}_setInitialCheckboxState(){if(this.shadowRoot){const e=this.shadowRoot.querySelector('input[type="checkbox"]');e&&(e.checked=!this.isDarkMode)}}render(){return d`
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
        `}_handleDarkModeToggle(e){const t=e.target;this.isDarkMode=!t.checked,this.isDarkMode?this.classList.remove("light-mode"):this.classList.add("light-mode"),localStorage.setItem("darkMode",this.isDarkMode.toString());const i=new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{isDarkMode:this.isDarkMode}});this.dispatchEvent(i)}_handleSignOut(e){wi.relay(e,"auth:message",["auth/signout"]),window.location.href="/app"}};We.uses=Ze({"mu-dropdown":ws.Element}),We.styles=[T,S`
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
        `];let de=We;At([b()],de.prototype,"loggedIn");At([b()],de.prototype,"userid");At([b()],de.prototype,"isDarkMode");var go=Object.defineProperty,mo=Object.getOwnPropertyDescriptor,pe=(s,e,t,i)=>{for(var r=i>1?void 0:i?mo(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&go(e,t,r),r};const Pt=class Pt extends M{constructor(){super("recipebook:model"),this.viewMode="recipes",this.selectedCuisine=""}get recipes(){return this.model.recipes||[]}get mealPlans(){return this.model.mealplans||[]}get cuisines(){return this.model.cuisines||[]}get filteredRecipes(){return this.selectedCuisine?this.recipes.filter(e=>e.cuisine.name===this.selectedCuisine):this.recipes}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["recipes/load",{}]),this.dispatchMessage(["mealplans/load",{}]),this.dispatchMessage(["cuisines/load",{}])}handleViewToggle(e){this.viewMode=e}handleCuisineToggle(e){this.selectedCuisine===e?this.selectedCuisine="":this.selectedCuisine=e}getAvailableCuisines(){const e=new Set(this.recipes.map(t=>t.cuisine.name));return Array.from(e).sort()}renderCuisineFilter(){if(this.viewMode!=="recipes")return d`<div class="filter-section hidden"></div>`;const e=this.getAvailableCuisines(),t=this.selectedCuisine!=="",i=this.filteredRecipes.length,r=this.recipes.length;return d`
            <div class="filter-section">
                <div class="filter-header">
                    <div class="filter-title">
                        <svg class="filter-icon" viewBox="0 0 24 24">
                            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                        </svg>
                        Filter by Cuisine
                    </div>
                    ${e.map(o=>d`
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

                ${t?d`
                    <div class="filter-summary">
                        Showing ${i} of ${r} recipes for ${this.selectedCuisine} cuisine
                    </div>
                `:""}
            </div>
        `}renderContent(){const e=this.viewMode==="recipes"?this.filteredRecipes:this.mealPlans,t=this.viewMode==="recipes"?this.recipes:this.mealPlans;if(t.length===0&&(this.viewMode==="recipes"?!this.model.recipes:!this.model.mealplans))return d`
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading delicious content...</div>
                </div>
            `;if(e.length===0){const r=t.length===0;return d`
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>
                        ${r?`No ${this.viewMode==="recipes"?"recipes":"meal plans"} found`:`No recipes found for ${this.selectedCuisine} cuisine`}
                    </h3>
                    <p>
                        ${r?"Check back later for new content!":"Try selecting a different cuisine."}
                    </p>
                </div>
            `}return d`
            <div class="content-grid">
                ${e.map(r=>this.renderCard(r))}
            </div>
        `}renderCard(e){const t="cookingTime"in e,i=t?`/app/recipe/${e.idName}`:`/app/mealplan/${e.idName}`;if(t){const r=e;return d`
                <a href=${i} class="item-card">
                    <img
                            class="item-image"
                            src=${r.imageUrl||"/images/placeholder.jpg"}
                            alt=${r.name}
                            loading="lazy"
                    >
                    <div class="item-content">
                        <h3>${r.name}</h3>
                        <p>${r.description}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                </svg>
                                ${r.cookingTime}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                </svg>
                                ${r.cuisine.name}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                                </svg>
                                ${r.servingSize}
                            </span>
                            <span class="difficulty-badge difficulty-${r.difficulty.toLowerCase()}">
                                ${r.difficulty}
                            </span>
                        </div>
                    </div>
                </a>
            `}else{const r=e;return d`
                <a href=${i} class="item-card">
                    <div class="item-content">
                        <h3>${r.name}</h3>
                        <p>${r.purpose}</p>
                        <div class="item-meta">
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                ${r.duration}
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                                </svg>
                                ${r.recipes.length} recipes
                            </span>
                            <span class="meta-item">
                                <svg class="meta-icon" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${r.mealTypes.join(", ")}
                            </span>
                        </div>
                    </div>
                </a>
            `}}render(){return d`
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
        `}};Pt.styles=[T,S`
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
        `];let O=Pt;pe([b()],O.prototype,"viewMode",2);pe([b()],O.prototype,"selectedCuisine",2);pe([b()],O.prototype,"recipes",1);pe([b()],O.prototype,"mealPlans",1);pe([b()],O.prototype,"cuisines",1);pe([b()],O.prototype,"filteredRecipes",1);var fo=Object.defineProperty,vo=Object.getOwnPropertyDescriptor,ti=(s,e,t,i)=>{for(var r=i>1?void 0:i?vo(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&fo(e,t,r),r};const Ot=class Ot extends M{get recipe(){return this.model.recipe}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="recipe-id"&&t!==i&&i&&(console.log("Loading recipe:",i),this.dispatchMessage(["recipe/load",{recipeId:i}]))}render(){return!this.recipe&&this.recipeId?d`
                <div class="loading">Loading recipe...</div>
            `:this.recipe?d`
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
                                    ${this.recipe.ingredients.map(e=>d`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                                <h2>Included in Meal Plans</h2>
                                <ul>
                                    ${this.recipe.mealPlans.map(e=>d`
                                        <li><a href="${e.href}">${e.name}</a></li>
                                    `)}
                                </ul>
                            </div>
                            <div class="steps-section">
                                <h2>Preparation Steps</h2>
                                <ol>
                                    ${this.recipe.steps.map(e=>d`
                                        <li>${e}</li>
                                    `)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:d`
                <div class="loading">Recipe not found</div>
            `}};Ot.styles=[T,S`
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
        `];let Ae=Ot;ti([C({attribute:"recipe-id"})],Ae.prototype,"recipeId",2);ti([b()],Ae.prototype,"recipe",1);var bo=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,Ie=(s,e,t,i)=>{for(var r=i>1?void 0:i?yo(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&bo(e,t,r),r};const Ve=class Ve extends M{constructor(){super("recipebook:model"),this._authObserver=new Y(this,"recipebook:auth"),this.formData={name:"",description:"",cookingTime:"",servingSize:"",difficulty:"Easy",cuisineId:"",ingredientIds:[],mealPlanIds:[],steps:[""]},this.errors=[],this.isSubmitting=!1}get chef(){return this.model.chef}get cuisines(){return this.model.cuisines||[]}get ingredients(){return this.model.ingredients||[]}get mealplans(){return this.model.mealplans||[]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="user-id"&&t!==i&&i&&(console.log("Loading chef for recipe creation:",i),this.dispatchMessage(["chef/load",{chefId:i}]))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:t}=e;t&&t.authenticated?this.userId!==t.username&&(this.userId=t.username,console.log("Auto-loaded userId from auth:",this.userId),this.dispatchMessage(["chef/load",{chefId:this.userId}])):this.userId=void 0,this.requestUpdate()}),this.dispatchMessage(["cuisines/load",{}]),this.dispatchMessage(["ingredients/load",{}]),this.dispatchMessage(["mealplans/load",{}]),this.userId&&this.dispatchMessage(["chef/load",{chefId:this.userId}])}generateIdName(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}handleInputChange(e,t){this.formData={...this.formData,[e]:t}}handleMultiSelectChange(e,t,i){const r=[...this.formData[e]];if(i&&!r.includes(t))r.push(t);else if(!i){const o=r.indexOf(t);o>-1&&r.splice(o,1)}this.formData={...this.formData,[e]:r}}addStep(){this.formData={...this.formData,steps:[...this.formData.steps,""]}}removeStep(e){if(this.formData.steps.length>1){const t=[...this.formData.steps];t.splice(e,1),this.formData={...this.formData,steps:t}}}handleStepChange(e,t){const i=[...this.formData.steps];i[e]=t,this.formData={...this.formData,steps:i}}validateForm(){const e=[];return this.formData.name.trim()||e.push("Recipe name is required"),this.formData.description.trim()||e.push("Description is required"),this.formData.cookingTime.trim()||e.push("Cooking time is required"),this.formData.servingSize.trim()||e.push("Serving size is required"),this.userId||e.push("User ID is required - please ensure you're logged in"),this.chef||e.push("Chef profile not found - please ensure you're logged in"),this.formData.cuisineId||e.push("Cuisine selection is required"),this.formData.ingredientIds.length===0&&e.push("At least one ingredient is required"),this.formData.steps.some(t=>!t.trim())&&e.push("All steps must be filled out"),this.errors=e,e.length===0}handleSubmit(e){var c;if(e.preventDefault(),!this.validateForm()||this.isSubmitting)return;this.isSubmitting=!0,this.errors=[];const t=this.generateIdName(this.formData.name),i=this.cuisines.find(n=>n.idName===this.formData.cuisineId),r=this.ingredients.filter(n=>this.formData.ingredientIds.includes(n.idName)),o=this.mealplans.filter(n=>this.formData.mealPlanIds.includes(n.idName)),a={idName:t,name:this.formData.name,description:this.formData.description,imageUrl:`images/${t}.png`,cookingTime:this.formData.cookingTime,servingSize:this.formData.servingSize,difficulty:this.formData.difficulty,chef:{name:((c=this.chef)==null?void 0:c.name)||"",href:`/app/chef/${this.userId}`},cuisine:{name:(i==null?void 0:i.name)||"",href:`/app/cuisine/${this.formData.cuisineId}`},ingredients:r.map(n=>({name:n.name,href:`/app/ingredient/${n.idName}`})),mealPlans:o.map(n=>({name:n.name,href:`/app/mealplan/${n.idName}`})),steps:this.formData.steps.filter(n=>n.trim())};this.dispatchMessage(["recipe/create",{recipe:a,onSuccess:()=>{this.isSubmitting=!1,se.dispatch(this,"history/navigate",{href:`/app/recipe/${t}`})},onFailure:n=>{this.isSubmitting=!1,this.errors=[n.message]}}])}removeMuFormDefaultStyles(){this.updateComplete.then(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("mu-form");if(e){const i=e.shadowRoot;if(i){i.querySelectorAll("style").forEach(a=>a.remove());const o=document.createElement("style");o.textContent=`
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
                    `,i.appendChild(o)}}})}render(){return this.removeMuFormDefaultStyles(),!this.chef&&this.userId?d`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?d`
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

                ${this.errors.length>0?d`
                    <div class="error-message">
                        ${this.errors.map(e=>d`<p>${e}</p>`)}
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
                                ${this.cuisines.map(e=>d`
                                    <option value=${e.idName}>${e.name}</option>
                                `)}
                            </select>
                        </label>
                    </div>

                    <div class="form-section">
                        <h2>Ingredients *</h2>
                        <div class="checkbox-grid">
                            ${this.ingredients.map(e=>d`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.ingredientIds.includes(e.idName)}
                                            @change=${t=>this.handleMultiSelectChange("ingredientIds",e.idName,t.target.checked)}
                                    />
                                    <span>${e.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Meal Plans</h2>
                        <div class="checkbox-grid">
                            ${this.mealplans.map(e=>d`
                                <label class="checkbox-label">
                                    <input
                                            type="checkbox"
                                            .checked=${this.formData.mealPlanIds.includes(e.idName)}
                                            @change=${t=>this.handleMultiSelectChange("mealPlanIds",e.idName,t.target.checked)}
                                    />
                                    <span>${e.name}</span>
                                </label>
                            `)}
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Cooking Steps *</h2>
                        ${this.formData.steps.map((e,t)=>d`
                            <div class="step-container">
                                <div class="step-header">
                                    <h3>Step ${t+1}</h3>
                                    ${this.formData.steps.length>1?d`
                                        <button type="button" class="remove-step" @click=${()=>this.removeStep(t)}>
                                            Remove Step
                                        </button>
                                    `:""}
                                </div>
                                <textarea
                                        .value=${e}
                                        @input=${i=>this.handleStepChange(t,i.target.value)}
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
                                @click=${()=>se.dispatch(this,"history/navigate",{href:"/app"})}
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
        `:d`
                <div class="container">
                    <div class="error-message">
                        <p>Chef profile not found. Please ensure you're logged in.</p>
                    </div>
                </div>
            `}};Ve.uses=Ze({"mu-form":_r.Element}),Ve.styles=[T,S`
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
        `];let R=Ve;Ie([C({attribute:"user-id"})],R.prototype,"userId",2);Ie([b()],R.prototype,"formData",2);Ie([b()],R.prototype,"errors",2);Ie([b()],R.prototype,"isSubmitting",2);Ie([b()],R.prototype,"chef",1);var $o=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,ri=(s,e,t,i)=>{for(var r=i>1?void 0:i?xo(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&$o(e,t,r),r};const Mt=class Mt extends M{get chef(){return this.model.chef}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="chef-id"&&t!==i&&i&&(console.log("Loading chef:",i),this.dispatchMessage(["chef/load",{chefId:i}]))}render(){return!this.chef&&this.chefId?d`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?d`
            <div class="container">
                <div class="chef-profile">
                    <button
                            class="edit-button"
                            @click=${()=>se.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}/edit`})}>
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
                            ${this.chef.favoriteDishes.map(e=>d`
                                <li>${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Recipes by ${this.chef.name}</h2>
                        <ul>
                            ${this.chef.recipes.map(e=>d`
                                <li><a href="${e.href}">${e.name}</a></li>
                            `)}
                        </ul>
                    </div>
                </div>
            </div>
        `:d`
                <div class="container">
                    <div class="loading">Chef not found</div>
                </div>
            `}};Mt.styles=[T,S`
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
        `];let Ce=Mt;ri([C({attribute:"chef-id"})],Ce.prototype,"chefId",2);ri([b()],Ce.prototype,"chef",1);var _o=Object.defineProperty,wo=Object.getOwnPropertyDescriptor,Ct=(s,e,t,i)=>{for(var r=i>1?void 0:i?wo(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&_o(e,t,r),r};const Je=class Je extends M{get chef(){return this.model.chef}constructor(){super("recipebook:model")}removeMuFormDefaultStyles(){this.updateComplete.then(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("mu-form");if(e){const i=e.shadowRoot;if(i){i.querySelectorAll("style").forEach(a=>a.remove());const o=document.createElement("style");o.textContent=`
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
                `,i.appendChild(o)}}})}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="chef-id"&&t!==i&&i&&(console.log("Loading chef for edit:",i),this.errorMessage=void 0,this.dispatchMessage(["chef/load",{chefId:i}]))}handleSubmit(e){if(!this.chefId)return;if(this.errorMessage=void 0,e.detail.idName!==this.chefId){this.errorMessage="Mismatch in Chef ID. Cannot save.";return}this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e.detail,onSuccess:()=>{se.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})},onFailure:i=>{this.errorMessage=i.message||"Failed to save chef profile",console.error("Failed to save chef:",i)}}])}addFavoriteDish(){if(!this.chef)return;const e={...this.chef,favoriteDishes:[...this.chef.favoriteDishes,""]};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:e,onSuccess:()=>{},onFailure:t=>console.error("Failed to add dish:",t)}])}removeFavoriteDish(e){if(!this.chef)return;const t=this.chef.favoriteDishes.filter((r,o)=>o!==e),i={...this.chef,favoriteDishes:t};this.dispatchMessage(["chef/save",{chefId:this.chefId,chef:i,onSuccess:()=>{},onFailure:r=>console.error("Failed to remove dish:",r)}])}render(){return this.removeMuFormDefaultStyles(),!this.chef&&this.chefId?d`
                <div class="container">
                    <div class="loading">Loading chef profile...</div>
                </div>
            `:this.chef?d`
            <div class="container">
                <div class="page-header">
                    <h1>Edit Chef Profile</h1>
                </div>

                ${this.errorMessage?d`
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
                                ${this.chef.favoriteDishes.map((e,t)=>d`
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
                    <button
                            type="button"
                            class="cancel-button"
                            @click=${()=>se.dispatch(this,"history/navigate",{href:`/app/chef/${this.chefId}`})}>
                        Cancel
                    </button>
                    <input type="hidden" name="idName" value="${this.chef.idName}" />
                </mu-form>
            </div>
        `:d`
                <div class="container">
                    <div class="error-message">Chef profile not found</div>
                </div>
            `}};Je.uses=Ze({"mu-form":_r.Element}),Je.styles=[T,S`
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
        `];let he=Je;Ct([C({attribute:"chef-id"})],he.prototype,"chefId",2);Ct([b()],he.prototype,"chef",1);Ct([b()],he.prototype,"errorMessage",2);var ko=Object.defineProperty,So=Object.getOwnPropertyDescriptor,ii=(s,e,t,i)=>{for(var r=i>1?void 0:i?So(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&ko(e,t,r),r};const Tt=class Tt extends M{get ingredient(){return this.model.ingredient}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="ingredient-id"&&t!==i&&i&&(console.log("Loading ingredient:",i),this.dispatchMessage(["ingredient/load",{ingredientId:i}]))}render(){return!this.ingredient&&this.ingredientId?d`
                <div class="container">
                    <div class="loading">Loading ingredient...</div>
                </div>
            `:this.ingredient?d`
            <div class="container">
                <div class="ingredient-card">
                    <h1>${this.ingredient.name}</h1>
                    <div class="top-section">
                        ${this.ingredient.imageUrl?d`
                            <img src="${this.ingredient.imageUrl}" alt="${this.ingredient.name}"
                                 style="max-width: 250px;">
                        `:""}
                        <div class="details">
                            <p><strong>Category:</strong> ${this.ingredient.category}</p>
                            ${this.ingredient.allergens?d`
                                <p><strong>Allergens:</strong> ${this.ingredient.allergens}</p>
                            `:""}
                            ${this.ingredient.substitutes?d`
                                <p><strong>Substitutes:</strong> ${this.ingredient.substitutes}</p>
                            `:""}
                        </div>
                    </div>

                    ${this.ingredient.nutrition&&this.ingredient.nutrition.length>0?d`
                        <div class="section">
                            <h2>Nutritional Information</h2>
                            <div class="nutrition-grid">
                                ${this.ingredient.nutrition.map(e=>d`
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${e.value}</div>
                                        <div class="nutrition-label">${e.label}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `:""}

                    ${this.ingredient.recipes&&this.ingredient.recipes.length>0?d`
                        <div class="section">
                            <h2>Used in Recipes</h2>
                            <ul>
                                ${this.ingredient.recipes.map(e=>d`
                                    <li><a href="${e.href}">${e.name}</a></li>
                                `)}
                            </ul>
                        </div>
                    `:""}
                </div>
            </div>
        `:d`
                <div class="container">
                    <div class="loading">Ingredient not found</div>
                </div>
            `}};Tt.styles=[T,S`
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
        `];let Pe=Tt;ii([C({attribute:"ingredient-id"})],Pe.prototype,"ingredientId",2);ii([b()],Pe.prototype,"ingredient",1);var Eo=Object.defineProperty,Ao=Object.getOwnPropertyDescriptor,si=(s,e,t,i)=>{for(var r=i>1?void 0:i?Ao(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&Eo(e,t,r),r};const Dt=class Dt extends M{get cuisine(){return this.model.cuisine}constructor(){super("recipebook:model")}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="cuisine-id"&&t!==i&&i&&(console.log("Loading cuisine:",i),this.dispatchMessage(["cuisine/load",{cuisineId:i}]))}render(){return!this.cuisine&&this.cuisineId?d`
                <div class="container">
                    <div class="loading">Loading cuisine...</div>
                </div>
            `:this.cuisine?d`
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
                            ${this.cuisine.popularIngredients.map(e=>d`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>

                    <div class="info-section">
                        <h2>Typical Dishes</h2>
                        <ul class="tag-list">
                            ${this.cuisine.typicalDishes.map(e=>d`
                                <li class="tag">${e}</li>
                            `)}
                        </ul>
                    </div>
                </div>

                <div class="recipes-section">
                    <h2>Recipes from ${this.cuisine.name}</h2>
                    <div class="recipe-grid">
                        ${this.cuisine.recipes.map(e=>d`
                            <a href="${e.href}" class="recipe-card">
                                ${e.imageUrl?d`
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
        `:d`
                <div class="container">
                    <div class="loading">Cuisine not found</div>
                </div>
            `}};Dt.styles=[T,S`
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
        `];let Oe=Dt;si([C({attribute:"cuisine-id"})],Oe.prototype,"cuisineId",2);si([b()],Oe.prototype,"cuisine",1);var Co=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,Qe=(s,e,t,i)=>{for(var r=i>1?void 0:i?Po(e,t):e,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(e,t,r):a(r))||r);return i&&r&&Co(e,t,r),r};const It=class It extends M{constructor(){super("recipebook:model"),this.loading=!1}get mealplan(){return this.model.mealplan}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e==="mealplan-id"&&t!==i&&i&&(console.log("Loading meal plan:",i),this.loading=!0,this.error=void 0,this.dispatchMessage(["mealplan/load",{mealplanId:i,onSuccess:()=>{this.loading=!1,console.log("Meal plan loaded successfully")},onFailure:r=>{this.loading=!1,this.error=r.message,console.error("Failed to load meal plan:",r)}}]))}connectedCallback(){super.connectedCallback(),this.mealplanId&&!this.mealplan&&!this.loading&&this.attributeChangedCallback("mealplan-id",null,this.mealplanId)}validateRecipeHref(e){return e?e.startsWith("/app/recipe/")||e.startsWith("http")?e:`/app/recipe/${e}`:"#"}formatScheduleInfo(e,t){if(!e&&!t)return"";const i=[];return e&&i.push(e),t&&i.push(t),i.join(" - ")}render(){var i,r;if(this.loading)return d`
                <div class="container">
                    <div class="loading">
                        <span class="loading-spinner"></span>
                        Loading meal plan...
                    </div>
                </div>
            `;if(this.error)return d`
                <div class="container">
                    <div class="error">
                        <h3>Error Loading Meal Plan</h3>
                        <p>${this.error}</p>
                    </div>
                </div>
            `;if(!this.mealplan&&this.mealplanId)return d`
                <div class="container">
                    <div class="not-found">
                        <h3>Meal Plan Not Found</h3>
                        <p>The requested meal plan could not be found.</p>
                    </div>
                </div>
            `;if(!this.mealplan)return d`
                <div class="container">
                    <div class="not-found">
                        <h3>No Meal Plan</h3>
                        <p>Please select a meal plan to view.</p>
                    </div>
                </div>
            `;const{mealplan:e}=this,t=((i=e.recipes)==null?void 0:i.length)||0;return d`
            <div class="container">
                <div class="mealplan-header">
                    <h1>${e.name}</h1>
                    <div class="meta-info">
                        <span class="meta-item">
                            <strong>Duration:</strong> ${e.duration}
                        </span>
                        <span class="meta-item">
                            <strong>Meal Types:</strong> ${((r=e.mealTypes)==null?void 0:r.join(", "))||"None specified"}
                        </span>
                        <span class="meta-item">
                            <strong>Recipes:</strong> ${t} recipe${t!==1?"s":""}
                        </span>
                    </div>
                    ${e.purpose?d`
                        <div class="purpose">
                            <strong>Purpose:</strong> ${e.purpose}
                        </div>
                    `:""}
                </div>

                <div class="recipes-section">
                    <h2>Included Recipes</h2>

                    ${t>0?d`
                        <div class="recipe-count">
                            ${t} recipe${t!==1?"s":""} in this meal plan
                        </div>
                        <div class="recipe-list">
                            ${e.recipes.map(o=>d`
                                <div class="recipe-item">
                                    <div class="recipe-info">
                                        <div class="recipe-name">${o.name}</div>
                                        ${this.formatScheduleInfo(o.day,o.mealType)?d`
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
                    `:d`
                        <div class="empty-recipes">
                            No recipes have been added to this meal plan yet.
                        </div>
                    `}

                    ${e.mealTypes&&e.mealTypes.length>0?d`
                        <div class="meal-types">
                            ${e.mealTypes.map(o=>d`
                                <span class="meal-type-tag">${o}</span>
                            `)}
                        </div>
                    `:""}
                </div>
            </div>
        `}};It.styles=[T,S`
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
        `];let J=It;Qe([C({attribute:"mealplan-id"})],J.prototype,"mealplanId",2);Qe([b()],J.prototype,"loading",2);Qe([b()],J.prototype,"error",2);Qe([b()],J.prototype,"mealplan",1);var Oo=Object.defineProperty,ze=(s,e,t,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(e,t,r)||r);return r&&Oo(e,t,r),r};const zt=class zt extends te{constructor(){super(...arguments),this.formData={},this.redirect="/app",this.loading=!1}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return d`
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
        `}handleChange(e){const t=e.target,i=t==null?void 0:t.name,r=t==null?void 0:t.value,o=this.formData;switch(i){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(e){e.preventDefault(),this.canSubmit&&(this.loading=!0,fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw new Error("Login failed");return t.json()}).then(t=>{const{token:i}=t,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:i,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(t=>{console.log(t),this.error=t.toString()}).finally(()=>this.loading=!1))}};zt.styles=S`
        .error:not(:empty) {
            color: red;
            border: 1px solid red;
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
        }
    `;let N=zt;ze([b()],N.prototype,"formData");ze([C()],N.prototype,"api");ze([C()],N.prototype,"redirect");ze([b()],N.prototype,"error");ze([b()],N.prototype,"loading");const Mo=S`
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
`,oi=document.createElement("style");oi.textContent=Mo.cssText;document.head.append(oi);const To=[{path:"/app/recipe/create",view:()=>d`
      <recipe-create></recipe-create>
    `},{path:"/app/recipe/:id",view:s=>d`
      <recipe-view recipe-id=${s.id}></recipe-view>
    `},{path:"/app/chef/:id",view:s=>d`
      <chef-view chef-id=${s.id}></chef-view>
    `},{path:"/app/chef/:id/edit",view:s=>d`
      <chef-edit chef-id=${s.id}></chef-edit>
    `},{path:"/app/ingredient/:id",view:s=>d`
      <ingredient-view ingredient-id=${s.id}></ingredient-view>
    `},{path:"/app/cuisine/:id",view:s=>d`
      <cuisine-view cuisine-id=${s.id}></cuisine-view>
    `},{path:"/app/mealplan/:id",view:s=>d`
      <mealplan-view mealplan-id=${s.id}></mealplan-view>
    `},{path:"/app/mealplan",view:()=>d`
      <mealplan-list-view></mealplan-list-view>
    `},{path:"/app/recipes",view:()=>d`
      <recipes-list-view></recipes-list-view>
    `},{path:"/app",view:()=>d`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];Ze({"mu-auth":A.Provider,"mu-history":se.Provider,"mu-store":class extends Ti.Provider{constructor(){super(Ks,Js,"recipebook:auth")}},"app-header":de,"home-view":O,"recipe-view":Ae,"recipe-create":R,"chef-view":Ce,"ingredient-view":Pe,"cuisine-view":Oe,"mealplan-view":J,"login-form":N,"chef-edit":he,"mu-switch":class extends xs.Element{constructor(){super(To,"recipebook:history","recipebook:auth")}}});document.addEventListener("DOMContentLoaded",()=>{const s=localStorage.getItem("darkMode");(s===null?!0:s==="true")||document.body.classList.add("light-mode"),document.body.addEventListener("darkmode:toggle",t=>{const r=t.detail.isDarkMode;r?document.body.classList.remove("light-mode"):document.body.classList.add("light-mode"),localStorage.setItem("darkMode",r.toString())})});
