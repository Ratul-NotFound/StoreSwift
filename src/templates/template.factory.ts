import { AbstractStoreTemplate } from "./base.template";
import { MinimalAtelierTemplate } from "./minimal-atelier.template";
import { LuxeGlowTemplate } from "./luxe-glow.template";
import { TechCyberTemplate } from "./tech-cyber.template";
import { WarmHeritageTemplate } from "./warm-heritage.template";
import { StoreTemplateId } from "./types";

export class TemplateFactory {
  private static registry: Map<string, AbstractStoreTemplate> = new Map();
  private static defaultTemplate: AbstractStoreTemplate = new MinimalAtelierTemplate();

  static {
    // Register canonical OOP template singletons
    this.registerTemplate(new MinimalAtelierTemplate());
    this.registerTemplate(new LuxeGlowTemplate());
    this.registerTemplate(new TechCyberTemplate());
    this.registerTemplate(new WarmHeritageTemplate());
  }

  /**
   * Registers a new template or overrides an existing one
   */
  public static registerTemplate(template: AbstractStoreTemplate): void {
    this.registry.set(template.id, template);
  }

  /**
   * Retrieves a template instance by its unique ID with fallback to default
   */
  public static getTemplate(templateId?: string | null): AbstractStoreTemplate {
    if (!templateId) return this.defaultTemplate;
    const match = this.registry.get(templateId.toLowerCase().trim());
    return match || this.defaultTemplate;
  }

  /**
   * Returns all registered templates as an array of OOP instances
   */
  public static getAllTemplates(): AbstractStoreTemplate[] {
    return Array.from(this.registry.values());
  }

  /**
   * Returns all registered template IDs
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

