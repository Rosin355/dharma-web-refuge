const SOCIAL_META_START = '<!-- SOCIAL_META_START -->';
const SOCIAL_META_END = '<!-- SOCIAL_META_END -->';
const SITE_NAME = 'Comunità Bodhidharma';
// Le credenziali anon sono pubbliche per definizione e sono già incluse nel client web.
// Le variabili Netlify, quando presenti, hanno comunque la precedenza.
const FALLBACK_SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

type ContentRecord = {
  title: string;
  description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
};

type RouteDefinition = {
  prefix: string;
  table: 'posts' | 'events' | 'ceremonies';
  select: string;
  fallbackDescription: string;
  type: 'article' | 'website';
};

const ROUTES: RouteDefinition[] = [
  {
    prefix: '/blog/',
    table: 'posts',
    select: 'title,excerpt,content,image_url,status',
    fallbackDescription: 'Articolo della Comunità Bodhidharma',
    type: 'article',
  },
  {
    prefix: '/eventi/',
    table: 'events',
    select: 'title,description,image_url,status',
    fallbackDescription: 'Evento della Comunità Bodhidharma',
    type: 'website',
  },
  {
    prefix: '/cerimonie/',
    table: 'ceremonies',
    select: 'title,description,image_url,status',
    fallbackDescription: 'Cerimonia della Comunità Bodhidharma',
    type: 'website',
  },
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

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

const buildSocialMetadata = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  type: 'article' | 'website';
}) => {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const safeImageUrl = escapeHtml(imageUrl);

  return `${SOCIAL_META_START}
    <title>${safeTitle}</title>
    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta name="description" content="${safeDescription}" />
    <meta name="author" content="${SITE_NAME}" />

    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="it_IT" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:alt" content="${safeTitle}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
    ${SOCIAL_META_END}`;
};

const replaceSocialMetadata = (html: string, metadata: string) => {
  const startIndex = html.indexOf(SOCIAL_META_START);
  const endIndex = html.indexOf(SOCIAL_META_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return html;
  }

  return `${html.slice(0, startIndex)}${metadata}${html.slice(endIndex + SOCIAL_META_END.length)}`;
};

const getContent = async (
  route: RouteDefinition,
  id: string,
  supabaseUrl: string,
  supabaseAnonKey: string,
) => {
  const apiUrl = new URL(`/rest/v1/${route.table}`, supabaseUrl);
  apiUrl.searchParams.set('select', route.select);
  apiUrl.searchParams.set('id', `eq.${id}`);
  apiUrl.searchParams.set('status', 'eq.published');
  apiUrl.searchParams.set('limit', '1');

  const response = await fetch(apiUrl, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) return null;

  const records = await response.json() as ContentRecord[];
  return records[0] || null;
};

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname.replace(/\/+$/, '');
  const route = ROUTES.find(({ prefix }) => pathname.startsWith(prefix));

  if (!route) return context.next();

  const id = decodeURIComponent(pathname.slice(route.prefix.length));
  if (!UUID_PATTERN.test(id)) return context.next();

  const supabaseUrl = Netlify.env.get('SUPABASE_URL') || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = Netlify.env.get('SUPABASE_ANON_KEY') || FALLBACK_SUPABASE_ANON_KEY;

  const content = await getContent(route, id, supabaseUrl, supabaseAnonKey);
  if (!content?.title) return context.next();

  const response = await context.next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  const rawDescription = route.table === 'posts'
    ? content.excerpt || content.content
    : content.description;
  const description = (stripHtml(rawDescription || '') || route.fallbackDescription).slice(0, 200);
  const canonicalUrl = `${requestUrl.origin}${route.prefix}${id}`;
  const imageUrl = new URL(content.image_url || '/logo.png', requestUrl.origin).href;
  const title = `${content.title} - ${SITE_NAME}`;
  const metadata = buildSocialMetadata({
    title,
    description,
    canonicalUrl,
    imageUrl,
    type: route.type,
  });
  const html = replaceSocialMetadata(await response.text(), metadata);

  return new Response(html, response);
};

export const config = {
  path: ['/blog/*', '/eventi/*', '/cerimonie/*'],
  method: 'GET',
  onError: 'bypass',
};
