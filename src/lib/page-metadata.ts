const SITE_NAME = 'Comunità Bodhidharma';
const DEFAULT_TITLE = 'Comunità Bodhidharma - Centro Monastico e Blog Spirituale';
const DEFAULT_DESCRIPTION = 'Centro monastico della Comunità Bodhidharma - Blog, insegnamenti, eventi e cerimonie nella tradizione buddhista zen. Scopri il tuo percorso spirituale.';

export type PageMetadata = {
  title: string;
  description: string | null | undefined;
  pathname: string;
  image?: string | null;
  type?: 'article' | 'website';
};

const stripHtml = (value: string) => value
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

export const buildContentUrl = (pathname: string) =>
  new URL(pathname, window.location.origin).href;

export const normalizeDescription = (
  value: string | null | undefined,
  fallback: string,
  maxLength = 200,
) => {
  const normalized = value ? stripHtml(value) : '';
  return (normalized || fallback).slice(0, maxLength);
};

const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

const setCanonicalUrl = (url: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = url;
};

const setDocumentMetadata = ({
  title,
  description,
  url,
  image,
  type,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  type: 'article' | 'website';
}) => {
  document.title = title;
  setCanonicalUrl(url);
  setMetaTag('name', 'description', description);

  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:locale', 'it_IT');
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', type);
  setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'og:image', image);
  setMetaTag('property', 'og:image:alt', title);

  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', image);
};

export const resetPageMetadata = () => {
  const origin = window.location.origin;
  setDocumentMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${origin}/`,
    image: `${origin}/logo.png`,
    type: 'website',
  });
};

export const applyPageMetadata = ({
  title,
  description,
  pathname,
  image,
  type = 'website',
}: PageMetadata) => {
  const url = buildContentUrl(pathname);
  const normalizedTitle = `${title} - ${SITE_NAME}`;

  setDocumentMetadata({
    title: normalizedTitle,
    description: normalizeDescription(description, SITE_NAME),
    url,
    image: new URL(image || '/logo.png', window.location.origin).href,
    type,
  });

  return resetPageMetadata;
};
