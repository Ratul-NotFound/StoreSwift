import { AbstractStoreTemplate } from "./base.template";
import { MinimalAtelierTemplate } from "./minimal-atelier.template";
import { LuxeGlowTemplate } from "./luxe-glow.template";
import { TechCyberTemplate } from "./tech-cyber.template";
import { WarmHeritageTemplate } from "./warm-heritage.template";
import { OpulentMaisonTemplate } from "./opulent-maison.template";
import { ArtisanPantryTemplate } from "./artisan-pantry.template";
import { StoreTemplateId } from "./types";

export class TemplateFactory {
  private static registry: Map<string, AbstractStoreTemplate> = new Map();
  private static aliasMap: Map<string, string> = new Map();
  private static defaultTemplate: AbstractStoreTemplate = new MinimalAtelierTemplate();

  static {
    // Register canonical OOP template singletons
    this.registerTemplate(new MinimalAtelierTemplate());
    this.registerTemplate(new LuxeGlowTemplate());
    this.registerTemplate(new TechCyberTemplate());
    this.registerTemplate(new WarmHeritageTemplate());
    this.registerTemplate(new OpulentMaisonTemplate());
    this.registerTemplate(new ArtisanPantryTemplate());

    // Register ergonomic category/theme aliases
    this.registerAlias("fashion", "minimal");
    this.registerAlias("streetwear", "minimal");
    this.registerAlias("apparel", "minimal");

    this.registerAlias("beauty", "glow");
    this.registerAlias("cosmetics", "glow");
    this.registerAlias("beauty_cosmetics", "glow");
    this.registerAlias("skincare", "glow");

    this.registerAlias("cyber", "bold");
    this.registerAlias("tech", "bold");
    this.registerAlias("electronics", "bold");
    this.registerAlias("hardware", "bold");

    this.registerAlias("shoes", "artisan");
    this.registerAlias("footwear", "artisan");
    this.registerAlias("leather", "artisan");
    this.registerAlias("heritage", "artisan");

    this.registerAlias("jewelry", "maison");
    this.registerAlias("watches", "maison");
    this.registerAlias("luxury", "maison");
    this.registerAlias("opulent", "maison");

    this.registerAlias("grocery_food", "pantry");
    this.registerAlias("food", "pantry");
    this.registerAlias("grocery", "pantry");
    this.registerAlias("coffee", "pantry");
    this.registerAlias("organic", "pantry");
  }

  /**
   * Registers a new template or overrides an existing one
   */
  public static registerTemplate(template: AbstractStoreTemplate): void {
    this.registry.set(template.id, template);
  }

  /**
   * Maps an alias keyword to a registered template ID
   */
  public static registerAlias(alias: string, templateId: string): void {
    this.aliasMap.set(alias.toLowerCase().trim(), templateId.toLowerCase().trim());
  }

  /**
   * Retrieves a template instance by its ID or alias with defensive fallback
   */
  public static getTemplate(templateId?: string | null): AbstractStoreTemplate {
    if (!templateId) return this.defaultTemplate;
    const cleanKey = templateId.toLowerCase().trim();

    // Check direct registration first
    const directMatch = this.registry.get(cleanKey);
    if (directMatch) return directMatch;

    // Check alias resolution
    const aliasedId = this.aliasMap.get(cleanKey);
    if (aliasedId) {
      const aliasMatch = this.registry.get(aliasedId);
      if (aliasMatch) return aliasMatch;
    }

    return this.defaultTemplate;
  }

  /**
   * Returns all registered templates as an array of OOP instances
   */
  public static getAllTemplates(): AbstractStoreTemplate[] {
    return Array.from(this.registry.values());
  }

  /**
   * Returns all canonical registered template IDs
   */
  public static getTemplateIds(): StoreTemplateId[] {
    return Array.from(this.registry.keys()) as StoreTemplateId[];
  }

  /**
   * Converts all registered templates to a key-value record
   */
  public static toRecord(): Record<string, AbstractStoreTemplate> {
    const record: Record<string, AbstractStoreTemplate> = {};
    for (const [key, tmpl] of this.registry.entries()) {
      record[key] = tmpl;
    }
    return record;
  }
}
