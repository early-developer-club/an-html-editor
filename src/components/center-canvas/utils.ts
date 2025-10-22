import type { AHTMLElement } from "@/components/html-editor/html-editor.types";

/**
 * 텍스트 전용 요소인지 확인
 * children이 없고, innerHTML이 있는 요소 (p, h1-h6, span 등)
 */
export const isTextOnlyElement = (elementId: string, elements: AHTMLElement[]): boolean => {
  const element = elements.find((el) => el.id === elementId);
  if (!element) return false;

  const hasNoChildren = !elements.some((el) => el.parentId === elementId);
  const hasInnerHTML = Boolean(element.innerHTML && element.innerHTML.trim() !== "");

  return hasNoChildren && hasInnerHTML;
};

/**
 * 이미지 요소인지 확인
 */
export const isImageElement = (elementId: string, elements: AHTMLElement[]): boolean => {
  const element = elements.find((el) => el.id === elementId);
  if (!element) return false;

  return element.tagName === "img";
};

/**
 * 요소 찾기
 */
export const findElement = (elementId: string, elements: AHTMLElement[]): AHTMLElement | undefined => {
  return elements.find((el) => el.id === elementId);
};
