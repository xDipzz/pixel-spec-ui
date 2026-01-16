import { UIElement, DesignToken } from './types';

export const mockElements: UIElement[] = [
  {
    id: 'app_shell',
    name: 'App Shell',
    type: 'container',
    parentId: null,
    childrenIds: ['sidebar', 'main', 'right_panel'],
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    styles: { padding: { top: 0, right: 0, bottom: 0, left: 0 }, background: '#0a0a0a' },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    type: 'container',
    parentId: 'app_shell',
    childrenIds: ['logo', 'nav_home', 'nav_explore', 'nav_notif', 'nav_messages', 'btn_post'],
    bounds: { x: 2, y: 2, width: 16, height: 96 },
    styles: { padding: { top: 16, right: 12, bottom: 16, left: 12 }, background: '#0f0f0f', borderRadius: '12px', gap: 8 },
  },
  {
    id: 'logo',
    name: 'Logo',
    type: 'image',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 4, y: 4, width: 6, height: 3 },
    styles: { borderRadius: '6px' },
    content: 'logo.svg',
  },
  {
    id: 'nav_home',
    name: 'Nav Item: Home',
    type: 'nav',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 3, y: 10, width: 14, height: 4 },
    styles: { 
      padding: { top: 10, right: 14, bottom: 10, left: 14 }, 
      fontSize: '15px', 
      fontWeight: '600', 
      color: '#ffffff',
      background: '#1a1a1a',
      borderRadius: '9999px'
    },
    content: 'Home',
  },
  {
    id: 'nav_explore',
    name: 'Nav Item: Explore',
    type: 'nav',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 3, y: 15, width: 14, height: 4 },
    styles: { 
      padding: { top: 10, right: 14, bottom: 10, left: 14 }, 
      fontSize: '15px', 
      fontWeight: '400', 
      color: '#71717a',
      borderRadius: '9999px'
    },
    content: 'Explore',
  },
  {
    id: 'nav_notif',
    name: 'Nav Item: Notifications',
    type: 'nav',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 3, y: 20, width: 14, height: 4 },
    styles: { 
      padding: { top: 10, right: 14, bottom: 10, left: 14 }, 
      fontSize: '15px', 
      fontWeight: '400', 
      color: '#71717a',
      borderRadius: '9999px'
    },
    content: 'Notifications',
  },
  {
    id: 'nav_messages',
    name: 'Nav Item: Messages',
    type: 'nav',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 3, y: 25, width: 14, height: 4 },
    styles: { 
      padding: { top: 10, right: 14, bottom: 10, left: 14 }, 
      fontSize: '15px', 
      fontWeight: '400', 
      color: '#71717a',
      borderRadius: '9999px'
    },
    content: 'Messages',
  },
  {
    id: 'btn_post',
    name: 'Button: Post',
    type: 'button',
    parentId: 'sidebar',
    childrenIds: [],
    bounds: { x: 3, y: 32, width: 14, height: 5 },
    styles: { 
      padding: { top: 14, right: 0, bottom: 14, left: 0 }, 
      fontSize: '15px', 
      fontWeight: '700', 
      color: '#ffffff',
      background: '#1d9bf0',
      borderRadius: '9999px',
      alignment: 'center'
    },
    content: 'Post',
  },
  {
    id: 'main',
    name: 'Main Feed',
    type: 'container',
    parentId: 'app_shell',
    childrenIds: ['header_tabs', 'composer', 'post_1', 'post_2'],
    bounds: { x: 20, y: 2, width: 48, height: 96 },
    styles: { 
      padding: { top: 0, right: 0, bottom: 0, left: 0 }, 
      border: '1px solid #2a2a2a',
      gap: 0 
    },
  },
  {
    id: 'header_tabs',
    name: 'Header Tabs',
    type: 'container',
    parentId: 'main',
    childrenIds: ['tab_for_you', 'tab_following'],
    bounds: { x: 20, y: 2, width: 48, height: 5 },
    styles: { 
      padding: { top: 0, right: 16, bottom: 0, left: 16 },
      border: '1px solid #2a2a2a',
      gap: 0
    },
  },
  {
    id: 'tab_for_you',
    name: 'Tab: For You',
    type: 'text',
    parentId: 'header_tabs',
    childrenIds: [],
    bounds: { x: 28, y: 3, width: 10, height: 3 },
    styles: { 
      fontSize: '15px', 
      fontWeight: '700', 
      color: '#ffffff',
      alignment: 'center'
    },
    content: 'For you',
  },
  {
    id: 'tab_following',
    name: 'Tab: Following',
    type: 'text',
    parentId: 'header_tabs',
    childrenIds: [],
    bounds: { x: 42, y: 3, width: 12, height: 3 },
    styles: { 
      fontSize: '15px', 
      fontWeight: '500', 
      color: '#71717a',
      alignment: 'center'
    },
    content: 'Following',
  },
  {
    id: 'composer',
    name: 'Composer',
    type: 'input',
    parentId: 'main',
    childrenIds: [],
    bounds: { x: 20, y: 8, width: 48, height: 10 },
    styles: { 
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      fontSize: '20px',
      fontWeight: '400',
      color: '#71717a',
      border: '1px solid #2a2a2a'
    },
    content: "What's happening?",
  },
  {
    id: 'post_1',
    name: 'Card: Post #1',
    type: 'card',
    parentId: 'main',
    childrenIds: ['avatar_1', 'username_1', 'post_text_1'],
    bounds: { x: 20, y: 19, width: 48, height: 18 },
    styles: { 
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      border: '1px solid #2a2a2a',
      gap: 12
    },
  },
  {
    id: 'avatar_1',
    name: 'Avatar',
    type: 'image',
    parentId: 'post_1',
    childrenIds: [],
    bounds: { x: 21, y: 20, width: 4, height: 4 },
    styles: { borderRadius: '9999px', background: '#3b82f6' },
  },
  {
    id: 'username_1',
    name: 'Username',
    type: 'text',
    parentId: 'post_1',
    childrenIds: [],
    bounds: { x: 26, y: 20, width: 15, height: 2 },
    styles: { fontSize: '15px', fontWeight: '700', color: '#ffffff' },
    content: 'John Doe',
  },
  {
    id: 'post_text_1',
    name: 'Post Text',
    type: 'text',
    parentId: 'post_1',
    childrenIds: [],
    bounds: { x: 26, y: 23, width: 40, height: 8 },
    styles: { fontSize: '15px', fontWeight: '400', lineHeight: '1.5', color: '#e5e5e5' },
    content: 'Just shipped a new feature! 🚀 The team has been working hard on this for weeks.',
  },
  {
    id: 'post_2',
    name: 'Card: Post #2',
    type: 'card',
    parentId: 'main',
    childrenIds: [],
    bounds: { x: 20, y: 38, width: 48, height: 18 },
    styles: { 
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      border: '1px solid #2a2a2a',
      gap: 12
    },
  },
  {
    id: 'right_panel',
    name: 'Right Panel',
    type: 'container',
    parentId: 'app_shell',
    childrenIds: ['search_input', 'subscribe_card', 'trending_card'],
    bounds: { x: 70, y: 2, width: 28, height: 96 },
    styles: { 
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      gap: 16
    },
  },
  {
    id: 'search_input',
    name: 'Search Input',
    type: 'input',
    parentId: 'right_panel',
    childrenIds: [],
    bounds: { x: 71, y: 3, width: 26, height: 5 },
    styles: { 
      padding: { top: 12, right: 16, bottom: 12, left: 40 },
      fontSize: '15px',
      color: '#71717a',
      background: '#16181c',
      borderRadius: '9999px'
    },
    content: 'Search',
  },
  {
    id: 'subscribe_card',
    name: 'Card: Subscribe',
    type: 'card',
    parentId: 'right_panel',
    childrenIds: ['subscribe_title', 'subscribe_btn'],
    bounds: { x: 71, y: 10, width: 26, height: 16 },
    styles: { 
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      background: '#16181c',
      borderRadius: '16px',
      gap: 12
    },
  },
  {
    id: 'subscribe_title',
    name: 'Subscribe Title',
    type: 'text',
    parentId: 'subscribe_card',
    childrenIds: [],
    bounds: { x: 72, y: 11, width: 24, height: 3 },
    styles: { fontSize: '20px', fontWeight: '800', color: '#ffffff' },
    content: 'Subscribe to Premium',
  },
  {
    id: 'subscribe_btn',
    name: 'Subscribe Button',
    type: 'button',
    parentId: 'subscribe_card',
    childrenIds: [],
    bounds: { x: 72, y: 18, width: 14, height: 4 },
    styles: { 
      padding: { top: 8, right: 16, bottom: 8, left: 16 },
      fontSize: '15px',
      fontWeight: '700',
      color: '#000000',
      background: '#eff3f4',
      borderRadius: '9999px'
    },
    content: 'Subscribe',
  },
  {
    id: 'trending_card',
    name: 'Card: Trending',
    type: 'card',
    parentId: 'right_panel',
    childrenIds: [],
    bounds: { x: 71, y: 28, width: 26, height: 24 },
    styles: { 
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      background: '#16181c',
      borderRadius: '16px',
      gap: 16
    },
  },
];

export const mockTokens: DesignToken = {
  colors: [
    { name: 'background', value: '#0a0a0a' },
    { name: 'surface', value: '#16181c' },
    { name: 'border', value: '#2a2a2a' },
    { name: 'text-primary', value: '#ffffff' },
    { name: 'text-secondary', value: '#71717a' },
    { name: 'accent-blue', value: '#1d9bf0' },
    { name: 'accent-green', value: '#00ba7c' },
  ],
  typography: [
    { name: 'heading-xl', size: '20px', weight: '800' },
    { name: 'heading-lg', size: '17px', weight: '700' },
    { name: 'body', size: '15px', weight: '400' },
    { name: 'caption', size: '13px', weight: '400' },
  ],
  spacing: [
    { name: 'xs', value: '4px' },
    { name: 'sm', value: '8px' },
    { name: 'md', value: '12px' },
    { name: 'lg', value: '16px' },
    { name: 'xl', value: '24px' },
  ],
  radius: [
    { name: 'sm', value: '6px' },
    { name: 'md', value: '12px' },
    { name: 'lg', value: '16px' },
    { name: 'full', value: '9999px' },
  ],
};

export const getElementById = (id: string): UIElement | undefined => 
  mockElements.find(el => el.id === id);

export const getChildElements = (parentId: string | null): UIElement[] =>
  mockElements.filter(el => el.parentId === parentId);

export const getRootElements = (): UIElement[] =>
  mockElements.filter(el => el.parentId === null);
