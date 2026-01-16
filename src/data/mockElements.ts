export type ElementType = 'container' | 'text' | 'button' | 'input' | 'image' | 'card' | 'icon' | 'nav';

export interface MockElement {
  id: string;
  name: string;
  type: ElementType;
  parentId: string | null;
  bounds: { x: number; y: number; width: number; height: number };
  styles: {
    margin?: string;
    padding?: string;
    gap?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    color?: string;
    background?: string;
    border?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
  content?: string;
}

export const mockElements: MockElement[] = [
  {
    id: 'app-shell',
    name: 'App Shell',
    type: 'container',
    parentId: null,
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    styles: { padding: '0', background: '#0a0a0a' },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    type: 'container',
    parentId: 'app-shell',
    bounds: { x: 2, y: 3, width: 18, height: 94 },
    styles: { padding: '16px', background: '#111111', borderRadius: '12px', gap: '24px' },
  },
  {
    id: 'logo',
    name: 'Logo',
    type: 'image',
    parentId: 'sidebar',
    bounds: { x: 4, y: 5, width: 8, height: 4 },
    styles: { borderRadius: '8px' },
    content: 'logo.svg',
  },
  {
    id: 'nav-home',
    name: 'Nav Item: Home',
    type: 'nav',
    parentId: 'sidebar',
    bounds: { x: 4, y: 12, width: 14, height: 4 },
    styles: { padding: '10px 12px', fontSize: '14px', fontWeight: '500', color: '#ffffff', borderRadius: '8px', background: '#1a1a1a' },
    content: 'Home',
  },
  {
    id: 'nav-explore',
    name: 'Nav Item: Explore',
    type: 'nav',
    parentId: 'sidebar',
    bounds: { x: 4, y: 17, width: 14, height: 4 },
    styles: { padding: '10px 12px', fontSize: '14px', fontWeight: '500', color: '#888888', borderRadius: '8px' },
    content: 'Explore',
  },
  {
    id: 'btn-post',
    name: 'Button: Post',
    type: 'button',
    parentId: 'sidebar',
    bounds: { x: 4, y: 24, width: 14, height: 5 },
    styles: { padding: '12px 24px', fontSize: '14px', fontWeight: '600', color: '#000000', background: '#22c55e', borderRadius: '9999px' },
    content: 'Post',
  },
  {
    id: 'main',
    name: 'Main',
    type: 'container',
    parentId: 'app-shell',
    bounds: { x: 22, y: 3, width: 50, height: 94 },
    styles: { padding: '0', gap: '0', border: '1px solid #222' },
  },
  {
    id: 'tabs',
    name: 'Tabs',
    type: 'container',
    parentId: 'main',
    bounds: { x: 23, y: 4, width: 48, height: 5 },
    styles: { padding: '0 16px', gap: '24px', borderRadius: '0', background: 'transparent' },
  },
  {
    id: 'composer',
    name: 'Composer',
    type: 'input',
    parentId: 'main',
    bounds: { x: 23, y: 10, width: 48, height: 12 },
    styles: { padding: '16px', fontSize: '16px', color: '#ffffff', background: '#0a0a0a', border: '1px solid #222', borderRadius: '0' },
    content: "What's happening?",
  },
  {
    id: 'post-1',
    name: 'Card: Post #1',
    type: 'card',
    parentId: 'main',
    bounds: { x: 23, y: 24, width: 48, height: 20 },
    styles: { padding: '16px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '0', gap: '12px' },
  },
  {
    id: 'right-panel',
    name: 'Right Panel',
    type: 'container',
    parentId: 'app-shell',
    bounds: { x: 74, y: 3, width: 24, height: 94 },
    styles: { padding: '16px', gap: '16px' },
  },
  {
    id: 'search-input',
    name: 'Search Input',
    type: 'input',
    parentId: 'right-panel',
    bounds: { x: 75, y: 4, width: 22, height: 5 },
    styles: { padding: '10px 16px', fontSize: '14px', color: '#888888', background: '#111111', border: '1px solid #222', borderRadius: '9999px' },
    content: 'Search',
  },
  {
    id: 'subscribe-card',
    name: 'Card: Subscribe',
    type: 'card',
    parentId: 'right-panel',
    bounds: { x: 75, y: 11, width: 22, height: 18 },
    styles: { padding: '16px', background: '#111111', borderRadius: '16px', gap: '12px' },
  },
];

export const getElementTypeColor = (type: ElementType): string => {
  const colors: Record<ElementType, string> = {
    container: 'bg-[hsl(var(--el-container)/.2)] text-[hsl(var(--el-container))]',
    text: 'bg-[hsl(var(--el-text)/.2)] text-[hsl(var(--el-text))]',
    button: 'bg-[hsl(var(--el-button)/.2)] text-[hsl(var(--el-button))]',
    input: 'bg-[hsl(var(--el-input)/.2)] text-[hsl(var(--el-input))]',
    image: 'bg-[hsl(var(--el-image)/.2)] text-[hsl(var(--el-image))]',
    card: 'bg-[hsl(var(--el-card)/.2)] text-[hsl(var(--el-card))]',
    icon: 'bg-[hsl(var(--el-icon)/.2)] text-[hsl(var(--el-icon))]',
    nav: 'bg-[hsl(var(--el-container)/.2)] text-[hsl(var(--el-container))]',
  };
  return colors[type];
};

export const generateExports = (element: MockElement) => {
  const spec = `# ${element.name}
Type: ${element.type}
ID: ${element.id}

## Position
x: ${element.bounds.x}%
y: ${element.bounds.y}%
width: ${element.bounds.width}%
height: ${element.bounds.height}%

## Styles
${Object.entries(element.styles).map(([k, v]) => `${k}: ${v}`).join('\n')}
${element.content ? `\n## Content\n"${element.content}"` : ''}`;

  const json = JSON.stringify({
    id: element.id,
    name: element.name,
    type: element.type,
    bounds: element.bounds,
    styles: element.styles,
    content: element.content,
  }, null, 2);

  const tailwind = `<div className="${generateTailwindClasses(element)}">
  ${element.content ? element.content : '{ children }'}
</div>`;

  const css = `.${element.id.replace(/[^a-zA-Z0-9]/g, '-')} {
${Object.entries(element.styles).map(([k, v]) => `  ${camelToKebab(k)}: ${v};`).join('\n')}
}`;

  return { spec, json, tailwind, css };
};

const generateTailwindClasses = (el: MockElement): string => {
  const c: string[] = [];
  if (el.styles.padding) c.push(`p-[${el.styles.padding.split(' ')[0]}]`);
  if (el.styles.fontSize) c.push(`text-[${el.styles.fontSize}]`);
  if (el.styles.fontWeight === '700') c.push('font-bold');
  if (el.styles.fontWeight === '600') c.push('font-semibold');
  if (el.styles.fontWeight === '500') c.push('font-medium');
  if (el.styles.borderRadius) c.push(`rounded-[${el.styles.borderRadius}]`);
  if (el.styles.gap) c.push(`gap-[${el.styles.gap}]`);
  return c.join(' ') || 'flex';
};

const camelToKebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
