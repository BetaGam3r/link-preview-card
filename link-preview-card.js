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
        border-radius: 8px;
        padding: 10px;
        max-width: 400px;
        border: 2px solid var(--themeColor);
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
        margin: 0px auto;
        border-radius: 8px;
        border: 4px solid var(--themeColor);
      }

      .content {
        margin-top: 12px;
        padding: 0 10px;
      }
      
      .title {
        font-weight: bold;
        font-size: 1.2rem;
        margin: 15px 0px;
        color: var(--themeColor);
      }

      details {
      border: 2px solid var(--themeColor);
      border-radius: 8px;
      text-align: center;
      padding: 8px;
      height: 70px;
      overflow: auto;
      }

      details summary {
        text-align: center;
        font-size: 18px;
        padding: 8px 0;
      }

      .desc {
        font-size: 0.9rem;
        color: white;
        margin: 10px 0px;
      }

      .url {
        display: inline-block;
        padding: 8px 12px;
        margin: 8px auto 8px;
        font-weight: bold;
        color: #fff;
        border: 2px solid var(--themeColor);
        border-radius: 8px;
        transition: background-color 0.3s ease-in-out;
      }

      .url:hover {
        background-color: var(--themeColor);
      }

      .loading-spinner {
        margin: 20px auto;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
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
          padding: 10px;
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