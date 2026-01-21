'use client';

import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { mdMirrorExtension, mdMirrorDarkExtension } from '@/config/codemirror-theme';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import markdownItKatex from 'markdown-it-katex';
import 'katex/dist/katex.min.css';
import '@/config/style/github-markdown.css';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Monitor, Smartphone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
}).use(markdownItKatex);

// 自定义fence渲染器来处理chart代码块
const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : '';
  const lang = info.split(/\s+/g)[0];
  
  if (lang === 'chart' || lang === 'bar' || lang === 'area' || lang === 'pie' || lang === 'multiline') {
    try {
      const chartData = JSON.parse(token.content);
      const chartId = `chart-${Math.random().toString(36).substring(7)}`;
      
      // 返回一个占位div，稍后用React组件替换
      return `<div class="chart-placeholder" data-chart='${JSON.stringify(chartData)}' data-chart-type="${lang}" data-chart-id="${chartId}"></div>`;
    } catch (e) {
      console.error('Chart parsing error:', e);
      return defaultFence(tokens, idx, options, env, self);
    }
  }
  
  return defaultFence(tokens, idx, options, env, self);
};

type PreviewMode = 'pc' | 'mobile';

const compressImage = async (file: File, quality = 0.7): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            console.log(`Image compressed: ${file.size} -> ${compressedFile.size} bytes`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export function MdniceEditor({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  showToolbar?: boolean;
}) {
  const { theme, resolvedTheme } = useTheme();
  const [previewHtml, setPreviewHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('pc');
  const editorRef = useRef<any>(null);
  const isSyncingRef = useRef(false);
  
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const editor = editorRef.current?.view;
        const cursorPosition = editor?.state.selection.main.head || 0;
        
        // 保存当前滚动位置
        const editorScroll = editor?.scrollDOM;
        const previewScroll = previewRef.current;
        const savedEditorScrollTop = editorScroll?.scrollTop || 0;
        const savedPreviewScrollTop = previewScroll?.scrollTop || 0;

        const toastId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const fileName = file.name || '图片';
        
        toast.loading(`${fileName} 正在压缩上传中...`, { id: toastId });

        try {
          const compressedFile = await compressImage(file);
          
          const formData = new FormData();
          formData.append('file', compressedFile);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.success && result.url) {
            toast.success(`${fileName} 上传成功`, { id: toastId });
            
            const imageMarkdown = `\n![image](${result.url})\n`;
            const currentValue = value || '';
            
            const newValue = 
              currentValue.slice(0, cursorPosition) + 
              imageMarkdown + 
              currentValue.slice(cursorPosition);
            
            onChange(newValue);
            
            // 恢复滚动位置
            requestAnimationFrame(() => {
              if (editorScroll) {
                editorScroll.scrollTop = savedEditorScrollTop;
              }
              if (previewScroll) {
                previewScroll.scrollTop = savedPreviewScrollTop;
              }
            });
          } else {
            toast.error(`${fileName} 上传失败: ${result.error || '未知错误'}`, { id: toastId });
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`${fileName} 上传失败`, { id: toastId });
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (value) {
      setPreviewHtml(md.render(value));
    }
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setPreviewHtml(md.render(value || ''));
      
      // 渲染图表
      setTimeout(() => {
        const placeholders = previewRef.current?.querySelectorAll('.chart-placeholder');
        placeholders?.forEach((placeholder) => {
          const chartDataStr = placeholder.getAttribute('data-chart');
          const chartType = placeholder.getAttribute('data-chart-type');
          
          if (chartDataStr) {
            try {
              const chartData = JSON.parse(chartDataStr);
              const COLORS = ['#8b9dc3', '#6b8fb3', '#4b7fa3', '#3b6f93'];
              
              if (chartType === 'bar') {
                // 柱形图
                const maxValue = Math.max(...chartData.data.map((d: any) => d[chartData.yKey]));
                const yMax = Math.ceil(maxValue / 100) * 100;
                const yStep = yMax / 4;
                const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
                
                const barWidth = 700 / chartData.data.length * 0.6;
                
                const container = document.createElement('div');
                container.className = 'my-8 w-full rounded-lg';
                container.style.backgroundColor = '#1a2332';
                container.style.height = '450px';
                container.style.padding = '24px';
                container.innerHTML = `
                  <div style="width: 100%; height: 100%;">
                    <svg viewBox="0 0 900 400" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                      <g transform="translate(80, 10)">
                        ${yTicks.map((tick) => {
                          const y = 350 - (tick / yMax) * 310;
                          return `
                            <line x1="-5" y1="${y}" x2="0" y2="${y}" stroke="#999" stroke-width="2"/>
                            <text x="-15" y="${y + 6}" fill="#999" text-anchor="end" font-size="18" font-weight="400">${tick}</text>
                            <line x1="0" y1="${y}" x2="780" y2="${y}" stroke="#444" stroke-dasharray="5 5" stroke-width="1"/>
                          `;
                        }).join('')}
                        
                        ${chartData.data.map((item: any, i: number) => {
                          const x = (i / chartData.data.length) * 780 + (780 / chartData.data.length - barWidth) / 2;
                          const barHeight = (item[chartData.yKey] / yMax) * 310;
                          const y = 350 - barHeight;
                          
                          return `
                            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#8b9dc3"/>
                            <text x="${x + barWidth / 2}" y="380" fill="#999" text-anchor="middle" font-size="18" font-weight="400">${item[chartData.xKey]}</text>
                          `;
                        }).join('')}
                        
                        <line x1="0" y1="0" x2="0" y2="350" stroke="#999" stroke-width="2"/>
                        <line x1="0" y1="350" x2="780" y2="350" stroke="#999" stroke-width="2"/>
                      </g>
                    </svg>
                  </div>
                `;
                
                placeholder.replaceWith(container);
              } else if (chartType === 'area') {
                // 面积图
                const maxValue = Math.max(...chartData.data.map((d: any) => d[chartData.yKey]));
                const yMax = Math.ceil(maxValue / 1000) * 1000;
                const yStep = yMax / 4;
                const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
                
                const container = document.createElement('div');
                container.className = 'my-8 w-full rounded-lg';
                container.style.backgroundColor = '#1a2332';
                container.style.height = '450px';
                container.style.padding = '24px';
                
                let pathD = '';
                let areaD = '';
                chartData.data.forEach((item: any, i: number) => {
                  const x = (i / (chartData.data.length - 1)) * 780;
                  const y = 350 - (item[chartData.yKey] / yMax) * 310;
                  pathD += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
                });
                areaD = pathD + `L 780 350 L 0 350 Z`;
                
                container.innerHTML = `
                  <div style="width: 100%; height: 100%;">
                    <svg viewBox="0 0 900 400" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color:#8b9dc3;stop-opacity:0.6" />
                          <stop offset="100%" style="stop-color:#8b9dc3;stop-opacity:0.1" />
                        </linearGradient>
                      </defs>
                      <g transform="translate(80, 10)">
                        ${yTicks.map((tick) => {
                          const y = 350 - (tick / yMax) * 310;
                          return `
                            <line x1="-5" y1="${y}" x2="0" y2="${y}" stroke="#999" stroke-width="2"/>
                            <text x="-15" y="${y + 6}" fill="#999" text-anchor="end" font-size="18" font-weight="400">${tick}</text>
                            <line x1="0" y1="${y}" x2="780" y2="${y}" stroke="#444" stroke-dasharray="5 5" stroke-width="1"/>
                          `;
                        }).join('')}
                        
                        <path d="${areaD}" fill="url(#areaGradient)"/>
                        <path d="${pathD}" fill="none" stroke="#8b9dc3" stroke-width="3"/>
                        
                        ${chartData.data.map((item: any, i: number) => {
                          const x = (i / (chartData.data.length - 1)) * 780;
                          return `
                            <text x="${x}" y="380" fill="#999" text-anchor="middle" font-size="18" font-weight="400">${item[chartData.xKey]}</text>
                          `;
                        }).join('')}
                        
                        <line x1="0" y1="0" x2="0" y2="350" stroke="#999" stroke-width="2"/>
                        <line x1="0" y1="350" x2="780" y2="350" stroke="#999" stroke-width="2"/>
                      </g>
                    </svg>
                  </div>
                `;
                
                placeholder.replaceWith(container);
              } else if (chartType === 'pie') {
                // 饼图
                const total = chartData.data.reduce((sum: number, item: any) => sum + item[chartData.yKey], 0);
                let currentAngle = -90;
                
                const container = document.createElement('div');
                container.className = 'my-8 w-full rounded-lg';
                container.style.backgroundColor = '#1a2332';
                container.style.height = '450px';
                container.style.padding = '24px';
                container.innerHTML = `
                  <div style="width: 100%; height: 100%;">
                    <svg viewBox="0 0 900 450" style="width: 100%; height: 100%;">
                      <g transform="translate(450, 180)">
                        ${chartData.data.map((item: any, i: number) => {
                          const percentage = item[chartData.yKey] / total;
                          const angle = percentage * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          currentAngle = endAngle;
                          
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;
                          const radius = 160;
                          
                          const x1 = radius * Math.cos(startRad);
                          const y1 = radius * Math.sin(startRad);
                          const x2 = radius * Math.cos(endRad);
                          const y2 = radius * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          return `
                            <path d="M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" 
                                  fill="${COLORS[i % COLORS.length]}" 
                                  stroke="#1a2332" 
                                  stroke-width="2"/>
                          `;
                        }).join('')}
                      </g>
                      <g transform="translate(${450 - chartData.data.length * 60}, 400)">
                        ${chartData.data.map((item: any, i: number) => {
                          const x = i * 120;
                          return `
                            <rect x="${x}" y="0" width="15" height="15" fill="${COLORS[i % COLORS.length]}"/>
                            <text x="${x + 20}" y="12" fill="#999" font-size="16">${item[chartData.xKey]}</text>
                          `;
                        }).join('')}
                      </g>
                    </svg>
                  </div>
                `;
                
                placeholder.replaceWith(container);
              } else if (chartType === 'multiline') {
                // 多系列线图
                const allValues = chartData.data.flatMap((d: any) => 
                  chartData.series.map((s: string) => d[s])
                );
                const maxValue = Math.max(...allValues);
                const yMax = Math.ceil(maxValue / 100) * 100;
                const yStep = yMax / 4;
                const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
                
                const container = document.createElement('div');
                container.className = 'my-8 w-full rounded-lg';
                container.style.backgroundColor = '#1a2332';
                container.style.height = '450px';
                container.style.padding = '24px';
                container.innerHTML = `
                  <div style="width: 100%; height: 100%;">
                    <svg viewBox="0 0 900 450" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                      <g transform="translate(80, 10)">
                        ${yTicks.map((tick) => {
                          const y = 350 - (tick / yMax) * 310;
                          return `
                            <line x1="-5" y1="${y}" x2="0" y2="${y}" stroke="#999" stroke-width="2"/>
                            <text x="-15" y="${y + 6}" fill="#999" text-anchor="end" font-size="18" font-weight="400">${tick}</text>
                            <line x1="0" y1="${y}" x2="780" y2="${y}" stroke="#444" stroke-dasharray="5 5" stroke-width="1"/>
                          `;
                        }).join('')}
                        
                        ${chartData.series.map((seriesKey: string, seriesIdx: number) => {
                          return chartData.data.map((item: any, i: number) => {
                            const x = (i / (chartData.data.length - 1)) * 780;
                            const y = 350 - (item[seriesKey] / yMax) * 310;
                            const prevX = i > 0 ? ((i - 1) / (chartData.data.length - 1)) * 780 : 0;
                            const prevY = i > 0 ? 350 - (chartData.data[i - 1][seriesKey] / yMax) * 310 : 0;
                            
                            return `
                              ${i > 0 ? `<line x1="${prevX}" y1="${prevY}" x2="${x}" y2="${y}" stroke="${COLORS[seriesIdx % COLORS.length]}" stroke-width="3"/>` : ''}
                              <circle cx="${x}" cy="${y}" r="5" fill="${COLORS[seriesIdx % COLORS.length]}"/>
                            `;
                          }).join('');
                        }).join('')}
                        
                        ${chartData.data.map((item: any, i: number) => {
                          const x = (i / (chartData.data.length - 1)) * 780;
                          return `
                            <text x="${x}" y="380" fill="#999" text-anchor="middle" font-size="18" font-weight="400">${item[chartData.xKey]}</text>
                          `;
                        }).join('')}
                        
                        <line x1="0" y1="0" x2="0" y2="350" stroke="#999" stroke-width="2"/>
                        <line x1="0" y1="350" x2="780" y2="350" stroke="#999" stroke-width="2"/>
                      </g>
                      <g transform="translate(${450 - chartData.series.length * 50}, 410)">
                        ${chartData.series.map((seriesKey: string, i: number) => {
                          const x = i * 100;
                          return `
                            <rect x="${x}" y="0" width="15" height="15" fill="${COLORS[i % COLORS.length]}"/>
                            <text x="${x + 20}" y="12" fill="#999" font-size="16">${seriesKey}</text>
                          `;
                        }).join('')}
                      </g>
                    </svg>
                  </div>
                `;
                
                placeholder.replaceWith(container);
              } else {
                // 折线图
                const maxValue = Math.max(...chartData.data.map((d: any) => d[chartData.yKey]));
                const minValue = 0;
                const range = maxValue - minValue;
                const yStep = Math.ceil(range / 4 / 100) * 100;
                const yMax = yStep * 4;
                const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
                
                const container = document.createElement('div');
                container.className = 'my-8 w-full rounded-lg';
                container.style.backgroundColor = '#1a2332';
                container.style.height = '450px';
                container.style.padding = '24px';
                container.innerHTML = `
                  <div style="width: 100%; height: 100%;">
                    <svg viewBox="0 0 900 400" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                      <g transform="translate(80, 10)">
                        ${yTicks.map((tick) => {
                          const y = 350 - (tick / yMax) * 310;
                          return `
                            <line x1="-5" y1="${y}" x2="0" y2="${y}" stroke="#999" stroke-width="2"/>
                            <text x="-15" y="${y + 6}" fill="#999" text-anchor="end" font-size="18" font-weight="400">${tick}</text>
                            <line x1="0" y1="${y}" x2="780" y2="${y}" stroke="#444" stroke-dasharray="5 5" stroke-width="1"/>
                          `;
                        }).join('')}
                        
                        ${chartData.data.map((item: any, i: number) => {
                          const x = (i / (chartData.data.length - 1)) * 780;
                          const y = 350 - (item[chartData.yKey] / yMax) * 310;
                          const prevX = i > 0 ? ((i - 1) / (chartData.data.length - 1)) * 780 : 0;
                          const prevY = i > 0 ? 350 - (chartData.data[i - 1][chartData.yKey] / yMax) * 310 : 0;
                          
                          return `
                            ${i > 0 ? `<line x1="${prevX}" y1="${prevY}" x2="${x}" y2="${y}" stroke="#8b9dc3" stroke-width="3"/>` : ''}
                            <circle cx="${x}" cy="${y}" r="6" fill="#8b9dc3"/>
                            <text x="${x}" y="380" fill="#999" text-anchor="middle" font-size="18" font-weight="400">${item[chartData.xKey]}</text>
                          `;
                        }).join('')}
                        
                        <line x1="0" y1="0" x2="0" y2="350" stroke="#999" stroke-width="2"/>
                        <line x1="0" y1="350" x2="780" y2="350" stroke="#999" stroke-width="2"/>
                      </g>
                    </svg>
                  </div>
                `;
                
                placeholder.replaceWith(container);
              }
            } catch (e) {
              console.error('Chart render error:', e);
            }
          }
        });
      }, 0);
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current?.view?.dom;
    if (editor) {
      editor.addEventListener('paste', handlePaste);
      return () => editor.removeEventListener('paste', handlePaste);
    }
  }, [value]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      const editorScroll = editorRef.current?.view?.scrollDOM;
      const previewScroll = previewRef.current;

      if (!editorScroll || !previewScroll) return;

      const handleEditorScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        const scrollPercentage = editorScroll.scrollTop / (editorScroll.scrollHeight - editorScroll.clientHeight || 1);
        if (!isNaN(scrollPercentage)) {
          previewScroll.scrollTop = scrollPercentage * (previewScroll.scrollHeight - previewScroll.clientHeight);
        }
        
        requestAnimationFrame(() => { isSyncingRef.current = false; });
      };

      const handlePreviewScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        const scrollPercentage = previewScroll.scrollTop / (previewScroll.scrollHeight - previewScroll.clientHeight || 1);
        if (!isNaN(scrollPercentage)) {
          editorScroll.scrollTop = scrollPercentage * (editorScroll.scrollHeight - editorScroll.clientHeight);
        }
        
        requestAnimationFrame(() => { isSyncingRef.current = false; });
      };

      editorScroll.addEventListener('scroll', handleEditorScroll, { passive: true });
      previewScroll.addEventListener('scroll', handlePreviewScroll, { passive: true });

      return () => {
        editorScroll.removeEventListener('scroll', handleEditorScroll);
        previewScroll.removeEventListener('scroll', handlePreviewScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted, previewHtml]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-end ">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">预览模式:</span>
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as PreviewMode)}>
            <TabsList>
              <TabsTrigger value="pc" className="gap-1">
                <Monitor className="h-4 w-4" />
                PC
              </TabsTrigger>
              <TabsTrigger value="mobile" className="gap-1">
                <Smartphone className="h-4 w-4" />
                移动端
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑器
          </div>
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <CodeMirror
              ref={editorRef}
              value={value}
              height="600px"
              extensions={[markdown(), isDark ? mdMirrorDarkExtension : mdMirrorExtension, EditorView.lineWrapping]}
              onChange={(val) => onChange(val)}
              placeholder={placeholder}
              theme={isDark ? 'dark' : 'light'}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: false,
                highlightActiveLine: false,
                foldGutter: true,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            实时预览
          </div>
          <div
            ref={previewRef}
            className={`overflow-auto rounded-lg border shadow-sm ${
              previewMode === 'mobile' ? 'max-w-[375px] min-w-[300px] mx-auto' : ''
            } ${isDark ? 'bg-[#0d1117]' : 'bg-white'}`}
            style={{ height: '600px', padding: previewMode === 'mobile' ? '16px' : '24px' }}
          >
            {previewHtml ? (
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <svg className="mx-auto mb-3 h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">开始输入以查看预览</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
