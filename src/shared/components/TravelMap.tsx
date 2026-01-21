'use client';

import { useEffect, useRef, useState } from 'react';

interface TravelMapProps {
  amapKey: string;
  securityKey: string;
  locations?: Array<{
    name: string;
    lng: number;
    lat: number;
    description?: string;
    isCurrent?: boolean;
  }>;
  currentLocationLabel?: string;
}

export default function TravelMap({ amapKey, securityKey, locations, currentLocationLabel = 'Current Location' }: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    // 设置安全密钥
    if (typeof window !== 'undefined') {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: securityKey,
      };
    }

    // 检查脚本是否已加载
    const existingScript = document.querySelector(`script[src*="webapi.amap.com"]`);
    
    const initMap = () => {
      if (!mapRef.current || !window.AMap) return;

      const map = new window.AMap.Map(mapRef.current, {
        zoom: 4,
        center: [105, 35],
        mapStyle: 'amap://styles/grey',
        viewMode: '2D',
        features: ['bg', 'road', 'building', 'point'],
        showLabel: true,
      });

      // 加载控件插件
      window.AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
        // 添加比例尺控件（左下角）
        const scale = new window.AMap.Scale({
          position: 'LB',
        });
        map.addControl(scale);

        // 添加缩放控件（右下角）
        const toolBar = new window.AMap.ToolBar({
          position: 'RB',
          liteStyle: true,
        });
        map.addControl(toolBar);
      });

      map.on('complete', () => {
        setLoading(false);
      });

      // 默认位置数据
      const defaultLocations = [
        { name: '广州', lng: 113.26, lat: 23.13, description: '生活了十年的地方', isCurrent: true },
        { name: '海南', lng: 110.33, lat: 20.03, description: '' },
        { name: '重庆', lng: 106.55, lat: 29.57, description: '' },
        { name: '西安', lng: 108.93, lat: 34.27, description: '' },
        { name: '河南', lng: 113.62, lat: 34.75, description: '观看《只有河南》戏剧演出' },
        { name: '桂林', lng: 110.28, lat: 25.28, description: '' },
        { name: '南宁', lng: 108.37, lat: 22.82, description: '' },
        { name: '贵州黔西南', lng: 104.90, lat: 25.09, description: '' },
        { name: '香港', lng: 114.17, lat: 22.32, description: '' },
        { name: '北京', lng: 116.40, lat: 39.90, description: '' },
        { name: '上海', lng: 121.47, lat: 31.23, description: '' },
        { name: '仙本那', lng: 118.62, lat: 4.47, description: '' },
        { name: '薄荷岛', lng: 123.85, lat: 9.65, description: '' },
        { name: 'PG岛', lng: 120.95, lat: 13.58, description: '' },
        { name: '大阪', lng: 135.50, lat: 34.69, description: '' },
        { name: '东京', lng: 139.69, lat: 35.69, description: '' },
        { name: '京都', lng: 135.76, lat: 35.01, description: '' },
        { name: '清迈', lng: 98.98, lat: 18.79, description: '' },
        { name: '厦门', lng: 118.08, lat: 24.48, description: '' },
      ];

      const markerLocations = locations || defaultLocations;

      // 添加标记点
      markerLocations.forEach((location) => {
        const isCurrentLocation = location.isCurrent;
        const markerColor = isCurrentLocation ? '#27aa56' : '#4A90E2';
        
        // 创建圆形标记的 SVG
        const createCircleIcon = (color: string) => {
          const svg = `
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
            </svg>
          `;
          return `data:image/svg+xml;base64,${btoa(svg)}`;
        };

        const marker = new window.AMap.Marker({
          position: [location.lng, location.lat],
          title: location.name,
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(20, 20),
            image: createCircleIcon(markerColor),
            imageSize: new window.AMap.Size(20, 20),
          }),
        });

        // 创建信息窗口
        const infoWindow = new window.AMap.InfoWindow({
          content: `
            <div style="padding: 12px; width: 250px">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333; white-space: nowrap;">${location.name}</h3>
              ${location.description ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.5;">${location.description}</p>` : ''}
              ${isCurrentLocation ? `<div style="display: inline-block; padding: 4px 12px; background-color: #e8f5e9; color: #27aa56; border-radius: 4px; font-size: 14px; font-weight: 500;">${currentLocationLabel}</div>` : ''}
            </div>
          `,
          offset: new window.AMap.Pixel(0, -20),
          anchor: 'bottom-center',
        });

        marker.on('click', () => {
          infoWindow.open(map, [location.lng, location.lat]);
        });

        map.add(marker);
      });
    };

    if (existingScript) {
      if (window.AMap) {
        initMap();
      } else {
        existingScript.addEventListener('load', initMap);
      }
    } else {
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        setLoading(false);
      };
      document.head.appendChild(script);
    }

    return () => {
      // 清理事件监听
    };
  }, [amapKey, securityKey, locations]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-700 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
      <div className="w-full h-full amap-container" ref={mapRef} />
    </div>
  );
}

declare global {
  interface Window {
    AMap: any;
  }
}
