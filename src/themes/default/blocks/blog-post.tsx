'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import '@/styles/markdown.css';

export function BlogPost({ post }: { post: { title: string; date: string; content: string } }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 懒加载图片
    if (!contentRef.current) return;

    const images = contentRef.current.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    images.forEach((img) => {
      if (img.src) {
        img.dataset.src = img.src;
        img.src = '';
        imageObserver.observe(img);
      }
    });

    return () => {
      imageObserver.disconnect();
    };
  }, [post.content]);

  return (
    <article className="py-6 md:py-10 lg:py-16">
      <div className="container max-w-4xl mx-auto px-4 md:px-6 lg:w-[728px]">
        <header className="mb-9 md:mb-8 mt-10 md:mt-9">
          <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                {post.date}
              </span>
            </div>
          </div>
        </header>

        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none" ref={contentRef}>
          <article className="markdown-body prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => {
                  console.log('Image component called');
                  return (
                    <img
                      {...props}
                      alt={props.alt || ''}
                      className="w-auto max-w-full h-auto"
                      loading="lazy"
                    />
                  );
                },
                h1: ({ node, ...props }) => {
                  console.log('H1 component called');
                  return <h1 {...props} />;
                },
                h2: ({ node, ...props }) => {
                  console.log('H2 component called');
                  return <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />;
                },
                p: ({ node, ...props }) => {
                  console.log('P component called');
                  return <p className="mb-4 leading-relaxed" {...props} />;
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote 
                    className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600"
                    {...props}
                  />
                ),
                code: ({ node, inline, className, children, ...props }: any) => {
                  console.log('Code component called:', { inline, className, children: String(children).substring(0, 100) });
                  
                  const match = /language-(\w+)/.exec(className || '');
                  const lang = match ? match[1] : '';
                  
                  console.log('Code block lang:', lang);
                  
                  const COLORS = ['#8b9dc3', '#6b8fb3', '#4b7fa3', '#3b6f93'];
                  
                  if (!inline && (lang === 'chart' || lang === 'bar' || lang === 'area' || lang === 'pie' || lang === 'multiline')) {
                    try {
                      const content = String(children).trim();
                      console.log('Parsing chart data:', content);
                      const chartData = JSON.parse(content);
                      console.log('Parsed successfully:', chartData);
                      
                      if (lang === 'bar') {
                        // 柱形图
                        const maxValue = Math.max(...chartData.data.map((d: any) => d[chartData.yKey]));
                        const yMax = Math.ceil(maxValue / 100) * 100;
                        const yStep = yMax / 4;
                        const yTicks = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
                        
                        return (
                          <div className="my-4 md:my-8 w-full h-[300px] md:h-[450px] bg-[#1a2332] rounded-lg p-3 md:p-6 overflow-x-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                  dataKey={chartData.xKey || 'name'} 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                  domain={[0, yMax]}
                                  ticks={yTicks}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                  cursor={false}
                                />
                                <Bar 
                                  dataKey={chartData.yKey || 'value'} 
                                  fill="#8b9dc3"
                                  activeBar={{ fill: '#8b9dc3' }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      } else if (lang === 'area') {
                        // 面积图
                        return (
                          <div className="my-4 md:my-8 w-full h-[300px] md:h-[450px] bg-[#1a2332] rounded-lg p-3 md:p-6 overflow-x-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                  dataKey={chartData.xKey || 'name'} 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                  }}
                                  itemStyle={{ color: '#fff' }}
                                  labelStyle={{ color: '#fff' }}
                                  formatter={(value: any) => [value, '销售额']}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey={chartData.yKey || 'value'} 
                                  stroke="#8b9dc3" 
                                  fill="#8b9dc3"
                                  fillOpacity={0.6}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      } else if (lang === 'pie') {
                        // 饼图
                        return (
                          <div className="my-4 md:my-8 w-full h-[300px] md:h-[450px] bg-[#1a2332] rounded-lg p-3 md:p-6 overflow-x-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData.data}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey={chartData.yKey || 'value'}
                                >
                                  {chartData.data.map((_entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                  }}
                                  itemStyle={{ color: '#fff' }}
                                  labelStyle={{ color: '#fff' }}
                                />
                                <Legend 
                                  wrapperStyle={{ color: '#999', fontSize: '12px' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      } else if (lang === 'multiline') {
                        // 多系列线图
                        return (
                          <div className="my-4 md:my-8 w-full h-[300px] md:h-[450px] bg-[#1a2332] rounded-lg p-3 md:p-6 overflow-x-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                  dataKey={chartData.xKey || 'name'} 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                />
                                <Legend 
                                  wrapperStyle={{ color: '#999', fontSize: '12px' }}
                                />
                                {chartData.series.map((seriesKey: string, index: number) => (
                                  <Line 
                                    key={seriesKey}
                                    type="monotone" 
                                    dataKey={seriesKey} 
                                    stroke={COLORS[index % COLORS.length]} 
                                    strokeWidth={2}
                                    dot={{ fill: COLORS[index % COLORS.length], r: 3 }}
                                  />
                                ))}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      } else {
                        // 折线图（默认）
                        return (
                          <div className="my-4 md:my-8 w-full h-[300px] md:h-[450px] bg-[#1a2332] rounded-lg p-3 md:p-6 overflow-x-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                  dataKey={chartData.xKey || 'name'} 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                  stroke="#999"
                                  style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey={chartData.yKey || 'value'} 
                                  stroke="#8b9dc3" 
                                  strokeWidth={2}
                                  dot={{ fill: '#8b9dc3', r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      }
                    } catch (e) {
                      console.error('Chart parsing error:', e);
                      return <code className={className} {...props}>{children}</code>;
                    }
                  }
                  
                  return <code className={className} {...props}>{children}</code>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </article>
  );
}
