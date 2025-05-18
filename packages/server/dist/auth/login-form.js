"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var login_form_exports = {};
__export(login_form_exports, {
  LoginFormElement: () => LoginFormElement
});
module.exports = __toCommonJS(login_form_exports);
var import_lit = require("lit");
var import_decorators = require("lit/decorators.js");
class LoginFormElement extends import_lit.LitElement {
  @((0, import_decorators.state)())
  formData = {};
  @((0, import_decorators.property)())
  api;
  @((0, import_decorators.property)())
  redirect = "/index.html";
  @((0, import_decorators.state)())
  error;
  get canSubmit() {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }
  render() {
    return import_lit.html`
      <form
        @change=${(e) => this.handleChange(e)}
        @submit=${(e) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button
            ?disabled=${!this.canSubmit}
            type="submit">
            Login
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }
  static styles = import_lit.css`
    .error:not(:empty) {
      color: red;
      border: 1px solid red;
      padding: 10px;
    }
  `;
  handleChange(event) {
    const target = event.target;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;
    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }
  handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    if (this.canSubmit) {
      fetch(
        this?.api || "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.formData)
        }
      ).then((res) => {
        if (res.status !== 200)
          throw new Error("Login failed");
        else return res.json();
      }).then((json) => {
        const { token } = json;
        const customEvent = new CustomEvent(
          "auth:message",
          {
            bubbles: true,
            composed: true,
            detail: [
              "auth/signin",
              { token, redirect: this.redirect }
            ]
          }
        );
        console.log("dispatching message", customEvent);
        this.dispatchEvent(customEvent);
      }).catch((error) => {
        console.log(error);
        this.error = error.toString();
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginFormElement
});
