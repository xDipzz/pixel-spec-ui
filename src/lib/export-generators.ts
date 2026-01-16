import { UIElement } from './types';

export const generatePrompt = (el: UIElement): string => {
  const parts: string[] = [];

  parts.push(`UI SPECIFICATION: ${el.name.toUpperCase()}`);
  parts.push(`==========================================`);
  parts.push(``);

  // 1. Role & Identity
  parts.push(`COMPONENT ROLE:`);
  parts.push(`This element is a ${el.type}. Its primary role is ${el.type === 'container' ? 'to group related child elements' : 'to display ' + el.type + ' information'}.`);
  parts.push(``);

  // 2. Geometry & Spacing
  parts.push(`GEOMETRY & POSITION:`);
  parts.push(`- The component is located at X: ${Math.round(el.bounds.x)}% and Y: ${Math.round(el.bounds.y)}% within its parent context.`);
  parts.push(`- It has a fixed dimension of ${Math.round(el.bounds.width)}px width and ${Math.round(el.bounds.height)}px height.`);
  
  if (el.styles.padding) {
    const { top, right, bottom, left } = el.styles.padding;
    parts.push(`- Internal spacing (padding) is configured as: Top: ${top}px, Right: ${right}px, Bottom: ${bottom}px, Left: ${left}px.`);
  }
  
  if (el.styles.gap) {
    parts.push(`- It maintains a consistent gap of ${el.styles.gap}px between its internal child elements.`);
  }
  parts.push(``);

  // 3. Visual Styling
  parts.push(`VISUAL STYLING:`);
  if (el.styles.background) {
    parts.push(`- Background: It uses a solid fill of ${el.styles.background}.`);
  }
  if (el.styles.borderRadius) {
    parts.push(`- Corner Radius: All corners are rounded to ${el.styles.borderRadius}.`);
  }
  if (el.styles.border) {
    parts.push(`- Border: It has a stroke defined as "${el.styles.border}".`);
  }
  if (el.styles.opacity !== undefined) {
    parts.push(`- Opacity: The element has a transparency level of ${el.styles.opacity * 100}%.`);
  }
  parts.push(``);

  // 4. Typography
  if (el.styles.fontSize || el.styles.fontWeight || el.styles.color) {
    parts.push(`TYPOGRAPHY DETAILS:`);
    if (el.content) parts.push(`- Display Text: "${el.content}"`);
    if (el.styles.fontSize) parts.push(`- Font Size: ${el.styles.fontSize}`);
    if (el.styles.fontWeight) parts.push(`- Font Weight: ${el.styles.fontWeight}`);
    if (el.styles.lineHeight) parts.push(`- Line Height: ${el.styles.lineHeight}`);
    if (el.styles.color) parts.push(`- Text Color: ${el.styles.color}`);
    if (el.styles.textAlign) parts.push(`- Text Alignment: ${el.styles.textAlign}`);
    parts.push(``);
  }

  // 5. Layout Behavior
  if (el.styles.display || el.styles.flexDirection) {
    parts.push(`LAYOUT BEHAVIOR:`);
    parts.push(`- The element uses a ${el.styles.display || 'block'} layout model.`);
    if (el.styles.flexDirection) {
      parts.push(`- Children are stacked in a ${el.styles.flexDirection} direction.`);
      parts.push(`- Alignment: ${el.styles.justifyContent || 'start'} (horizontal) and ${el.styles.alignItems || 'start'} (vertical).`);
    }
  }

  return parts.join('\n');
};

export const generateJSON = (el: UIElement): string => {
  return JSON.stringify({
    id: el.id,
    name: el.name,
    type: el.type,
    bounds: el.bounds,
    styles: el.styles,
    content: el.content,
  }, null, 2);
};

export const generateTailwind = (el: UIElement): string => {
  const classes: string[] = [];
  
  if (el.styles.display === 'flex') classes.push('flex');
  if (el.styles.display === 'grid') classes.push('grid');
  if (el.styles.flexDirection === 'column') classes.push('flex-col');
  if (el.styles.justifyContent === 'center') classes.push('justify-center');
  if (el.styles.justifyContent === 'space-between') classes.push('justify-between');
  if (el.styles.alignItems === 'center') classes.push('items-center');

  if (el.styles.padding) {
    const { top, right, bottom, left } = el.styles.padding;
    if (top === bottom && left === right && top === left) {
      classes.push(`p-[${top}px]`);
    } else {
      classes.push(`pt-[${top}px] pr-[${right}px] pb-[${bottom}px] pl-[${left}px]`);
    }
  }
  
  if (el.styles.gap) classes.push(`gap-[${el.styles.gap}px]`);
  if (el.styles.fontSize) classes.push(`text-[${el.styles.fontSize}]`);
  if (el.styles.fontWeight === '700' || el.styles.fontWeight === '800') classes.push('font-bold');
  else if (el.styles.fontWeight === '600') classes.push('font-semibold');
  else if (el.styles.fontWeight === '500') classes.push('font-medium');
  if (el.styles.lineHeight) classes.push(`leading-[${el.styles.lineHeight}]`);
  if (el.styles.borderRadius === '9999px') classes.push('rounded-full');
  else if (el.styles.borderRadius) classes.push(`rounded-[${el.styles.borderRadius}]`);
  if (el.styles.background) classes.push(`bg-[${el.styles.background}]`);
  if (el.styles.color) classes.push(`text-[${el.styles.color}]`);
  if (el.styles.textAlign === 'center') classes.push('text-center');
  if (el.styles.opacity !== undefined) classes.push(`opacity-[${el.styles.opacity}]`);

  const tag = el.type === 'button' ? 'button' : el.type === 'input' ? 'input' : 'div';
  const content = el.content || '{ children }';

  return `<${tag} className="${classes.join(' ')}">
  ${content}
</${tag}>`;
};

export const generateCSS = (el: UIElement): string => {
  const lines: string[] = [`.${el.id.replace(/_/g, '-')} {`];
  
  if (el.styles.display) lines.push(`  display: ${el.styles.display};`);
  if (el.styles.flexDirection) lines.push(`  flex-direction: ${el.styles.flexDirection};`);
  if (el.styles.justifyContent) lines.push(`  justify-content: ${el.styles.justifyContent};`);
  if (el.styles.alignItems) lines.push(`  align-items: ${el.styles.alignItems};`);
  if (el.styles.width) lines.push(`  width: ${el.styles.width};`);
  if (el.styles.height) lines.push(`  height: ${el.styles.height};`);

  if (el.styles.padding) {
    const { top, right, bottom, left } = el.styles.padding;
    lines.push(`  padding: ${top}px ${right}px ${bottom}px ${left}px;`);
  }
  if (el.styles.gap) lines.push(`  gap: ${el.styles.gap}px;`);
  if (el.styles.fontSize) lines.push(`  font-size: ${el.styles.fontSize};`);
  if (el.styles.fontWeight) lines.push(`  font-weight: ${el.styles.fontWeight};`);
  if (el.styles.lineHeight) lines.push(`  line-height: ${el.styles.lineHeight};`);
  if (el.styles.letterSpacing) lines.push(`  letter-spacing: ${el.styles.letterSpacing};`);
  if (el.styles.color) lines.push(`  color: ${el.styles.color};`);
  if (el.styles.background) lines.push(`  background: ${el.styles.background};`);
  if (el.styles.border) lines.push(`  border: ${el.styles.border};`);
  if (el.styles.borderRadius) lines.push(`  border-radius: ${el.styles.borderRadius};`);
  if (el.styles.boxShadow) lines.push(`  box-shadow: ${el.styles.boxShadow};`);
  if (el.styles.opacity !== undefined) lines.push(`  opacity: ${el.styles.opacity};`);
  if (el.styles.textAlign) lines.push(`  text-align: ${el.styles.textAlign};`);
  
  lines.push(`}`);
  return lines.join('\n');
};

export const getExportContent = (el: UIElement, tab: 'spec' | 'json' | 'tailwind' | 'css'): string => {
  switch (tab) {
    case 'spec': return generatePrompt(el);
    case 'json': return generateJSON(el);
    case 'tailwind': return generateTailwind(el);
    case 'css': return generateCSS(el);
  }
};
