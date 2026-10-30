import {
  TemplateFactory,
  AbstractStoreTemplate,
  IStoreTemplate,
  StoreTemplateId,
  StoreTemplateClasses,
  StoreTemplateVibe,
  TrustManifestoItem,
  DesignPhilosophy
} from "@/templates";

export type StoreTemplate = IStoreTemplate;
export type {
  StoreTemplateId,
  StoreTemplateClasses,
  StoreTemplateVibe,
  TrustManifestoItem,
  DesignPhilosophy,
  AbstractStoreTemplate
};

export const STORE_TEMPLATES: Record<string, AbstractStoreTemplate> = TemplateFactory.toRecord();
export const ALL_TEMPLATES: string[] = TemplateFactory.getTemplateIds();

export function getTemplateConfig(templateId?: string): AbstractStoreTemplate {
  return TemplateFactory.getTemplate(templateId);
}

export { TemplateFactory };
