/**
 * Copyright 2025 BetaGam3r
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.loadingState = false;


    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--themeColor);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        border-radius: var(--ddd-radius-sm);
        padding: var(--ddd-spacing-3);
        max-width: 400px;
        border: var(--ddd-border-sm);
        border-color: var(--themeColor);
      }

      :host(:hover) {
        transform: translateY(-5px);
      }

      .preview {
        display: flex;
        flex-direction: column;
        text-align: center;
      }

      img {
        display: block;
        max-width: 80%;
        height: auto;
        margin: var(--ddd-spacing-0) auto;
        border-radius: var(--ddd-radius-sm);
        border: var(--ddd-border-lg);
        border-color: var(--themeColor);
      }

      .content {
        margin-top: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
      }
      
      .title {
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-font-size-s);
        margin: var(--ddd-spacing-4) var(--ddd-spacing-0);
        color: var(--themeColor);
      }

      details {
      border: var(--ddd-border-sm);
      border-color: var(--themeColor);
      border-radius: var(--ddd-radius-sm);
      text-align: center;
      padding: var(--ddd-spacing-2);
      height: 70px;
      overflow: auto;
      }

      details summary {
        text-align: center;
        font-size: var(--ddd-font-size-3xs);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
      }

      .desc {
        font-size: var(--ddd-font-size-3xs);
        color: var(--ddd-theme-default-white);
        margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
      }

      .url {
        display: inline-block;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        margin: var(--ddd-spacing-2) auto;
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-white);
        border: var(--ddd-border-sm);
        border-color: var(--themeColor);
        border-radius: var(--ddd-radius-sm);
        transition: background-color 0.3s ease-in-out;
      }

      .url:hover {
        background-color: var(--themeColor);
      }

      .loading-spinner {
        margin: var(--ddd-spacing-5) auto;
        border: var(--ddd-border-lg);
        border-color: var(--ddd-theme-default-white);
        border-top: var(--ddd-border-lg);
        border-top-color: var(--ddd-theme-default-skyBlue);
        border-radius: var(--ddd-radius-xl);
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 600px) {
        :host {
          max-width: 100%;
          padding: var(--ddd-spacing-3);
        }
      }
    `];
  }

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      
      const json = await response.json();

      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }
 
  defaultTheme() {
    if(this.href.includes("psu.edu")) {
      return "var(--ddd-primary-2)";
    }
    else {
      return "var(--ddd-primary-15)";
    }
  }

  handleImageError() {
    console.warn("Image failed to load:", this.image)
    this.image = "";
    this.requestUpdate();
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="preview" style="--themeColor: ${this.themeColor}" part="preview">
        ${this.loadingState
          ? html`<div class="loading-spinner" part="loading-spinner"></div>`
          : html`
            ${this.image ? html`<img src="${this.image}" alt="" @error="${this.handleImageError}" part="image" />` : ''}
            <div class="content" part="content">
              <h3 class="title" part="title">${this.title}</h3>
              <details part="details">
                <summary part="summary">Description</summary>
                <p class="desc" part="desc">${this.description}</p>
              </details>
              <a href="${this.link}" target="_blank" class="url" part="url">Visit Site</a>
            </div>
        `}
      </div>
    `;
  }




  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);