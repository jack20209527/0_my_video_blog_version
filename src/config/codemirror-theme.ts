import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// mdnice 风格的颜色配置
const lightColors = {
  background: '#f5f5f5',
  foreground: '#202020',
  selection: '#b3d7ff',
  activeLine: '#dddcdc',
  cursor: '#505050',
  comment: '#ac002b',
  string: '#e46918',
  keyword: '#023a52',
  variable: '#90a959',
  link: '#b26a00',
  heading: '#202020',
};

const darkColors = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  selection: '#264f78',
  activeLine: '#2a2a2a',
  cursor: '#aeafad',
  comment: '#6a9955',
  string: '#ce9178',
  keyword: '#569cd6',
  variable: '#9cdcfe',
  link: '#3794ff',
  heading: '#4ec9b0',
};

// 编辑器主题
const mdMirrorTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
  },
  '.cm-content': {
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  '.cm-line': {
    wordBreak: 'break-all',
  },
}, { dark: false });

const mdMirrorDarkTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    backgroundColor: darkColors.background,
    color: darkColors.foreground,
  },
  '.cm-content': {
    caretColor: darkColors.cursor,
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: darkColors.cursor,
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: darkColors.selection,
  },
  '.cm-activeLine': {
    backgroundColor: darkColors.activeLine,
  },
  '.cm-gutters': {
    backgroundColor: darkColors.background,
    color: '#858585',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: darkColors.activeLine,
  },
  '.cm-line': {
    wordBreak: 'break-all',
  },
}, { dark: true });

// 语法高亮 - 亮色主题
const mdMirrorLightHighlight = HighlightStyle.define([
  { tag: t.heading, color: lightColors.heading, fontWeight: '700' },
  { tag: t.heading1, fontSize: '1.5em' },
  { tag: t.heading2, fontSize: '1.3em' },
  { tag: t.heading3, fontSize: '1.1em' },
  { tag: t.strong, fontWeight: '700', color: lightColors.heading },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: lightColors.link, textDecoration: 'underline' },
  { tag: t.url, color: lightColors.link },
  { tag: t.monospace, color: lightColors.string, backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '3px' },
  { tag: t.quote, color: lightColors.comment, fontStyle: 'italic' },
  { tag: t.comment, color: lightColors.comment },
  { tag: t.string, color: lightColors.string },
  { tag: t.keyword, color: lightColors.keyword, fontWeight: '600' },
  { tag: t.variableName, color: lightColors.variable },
  { tag: t.propertyName, color: lightColors.variable },
  { tag: t.atom, color: '#aa759f' },
  { tag: t.number, color: '#aa759f' },
]);

// 语法高亮 - 暗色主题
const mdMirrorDarkHighlight = HighlightStyle.define([
  { tag: t.heading, color: darkColors.heading, fontWeight: '700' },
  { tag: t.heading1, fontSize: '1.5em' },
  { tag: t.heading2, fontSize: '1.3em' },
  { tag: t.heading3, fontSize: '1.1em' },
  { tag: t.strong, fontWeight: '700', color: darkColors.heading },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: darkColors.link, textDecoration: 'underline' },
  { tag: t.url, color: darkColors.link },
  { tag: t.monospace, color: darkColors.string, backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '3px' },
  { tag: t.quote, color: darkColors.comment, fontStyle: 'italic' },
  { tag: t.comment, color: darkColors.comment },
  { tag: t.string, color: darkColors.string },
  { tag: t.keyword, color: darkColors.keyword, fontWeight: '600' },
  { tag: t.variableName, color: darkColors.variable },
  { tag: t.propertyName, color: darkColors.variable },
  { tag: t.atom, color: '#dcdcaa' },
  { tag: t.number, color: '#b5cea8' },
]);

export const mdMirrorExtension: Extension = [
  mdMirrorTheme,
  syntaxHighlighting(mdMirrorLightHighlight),
];

export const mdMirrorDarkExtension: Extension = [
  mdMirrorDarkTheme,
  syntaxHighlighting(mdMirrorDarkHighlight),
];
