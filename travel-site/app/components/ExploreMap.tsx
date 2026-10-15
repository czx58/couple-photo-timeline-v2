'use client';

import { useEffect, useRef, useState } from 'react';

export interface MapLocation {
  name: string;
  district?: string;
  city?: string;
  province?: string;
  lat: number;
  lng: number;
}

interface ExploreMapProps {
  onSelectLocation: (location: MapLocation) => void;
}

export default function ExploreMap({ onSelectLocation }: ExploreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const AMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [keyword, setKeyword] = useState('');

  const isDaytime = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  };

  const formatName = (name?: string, fallback = 'Selected Place') =>
    name?.trim() || fallback;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;

    const apiKey = process.env.NEXT_PUBLIC_GAODE_KEY;
    if (!apiKey) {
      setLoadError('未配置高德地图 Key');
      return;
    }

    import('@amap/amap-jsapi-loader')
      .then((mod) => {
        if (cancelled) return;
        const AMapLoader = mod.default;
        return AMapLoader.load({
          key: apiKey,
          version: '2.0',
          plugins: ['AMap.Geocoder', 'AMap.Marker'],
        });
      })
      .then((AMap) => {
        if (cancelled || !AMap) return;
        AMapRef.current = AMap;
        if (!mapRef.current) return;

        mapInstance.current = new AMap.Map(mapRef.current, {
          zoom: 4,
          center: [116.397428, 39.90923],
          mapStyle: isDaytime() ? 'amap://styles/normal' : 'amap://styles/dark',
        });

        mapInstance.current.on('click', (e: any) => {
          const lnglat = e.lnglat;
          const geocoder = new AMap.Geocoder({});
          geocoder.getAddress(lnglat, (status: string, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const ac = result.regeocode.addressComponent;
              const location: MapLocation = {
                name: formatName(ac.district || ac.street || ac.city || ac.province),
                district: ac.district,
                city: ac.city,
                province: ac.province,
                lat: lnglat.lat,
                lng: lnglat.lng,
              };
              placeMarker(location);
              onSelectLocation(location);
            } else {
              const location: MapLocation = {
                name: 'Selected Place',
                lat: lnglat.lat,
                lng: lnglat.lng,
              };
              placeMarker(location);
              onSelectLocation(location);
            }
          });
        });

        setIsReady(true);
      })
      .catch((err) => {
        console.error('Gaode map load failed:', err);
        setLoadError('地图加载失败，请检查网络或 API Key');
      });

    return () => {
      cancelled = true;
      mapInstance.current?.destroy();
      mapInstance.current = null;
      AMapRef.current = null;
      markerRef.current = null;
    };
  }, [onSelectLocation]);

  const placeMarker = (location: MapLocation) => {
    const AMap = AMapRef.current;
    const map = mapInstance.current;
    if (!AMap || !map) return;

    if (markerRef.current) {
      markerRef.current.setPosition([location.lng, location.lat]);
    } else {
      markerRef.current = new AMap.Marker({
        position: [location.lng, location.lat],
        anchor: 'bottom-center',
      });
      markerRef.current.setMap(map);
    }
    map.setCenter([location.lng, location.lat]);
    map.setZoom(12);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const AMap = AMapRef.current;
    const map = mapInstance.current;
    if (!AMap || !map || !keyword.trim()) return;

    try {
      const res = await fetch(`/api/search-place?q=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      if (!res.ok || data.error || !data.data?.length) {
        setLoadError(`未找到「${keyword}」，请尝试其他关键词`);
        return;
      }

      const poi = data.data[0];
      const location: MapLocation = {
        name: formatName(poi.name),
        district: poi.district,
        city: poi.city,
        province: poi.province,
        lat: poi.lat,
        lng: poi.lng,
      };
      placeMarker(location);
      onSelectLocation(location);
    } catch (err) {
      console.error('Search failed:', err);
      setLoadError('搜索失败，请检查网络');
    }
  };

  const handleLocate = () => {
    const AMap = AMapRef.current;
    const map = mapInstance.current;
    if (!AMap || !map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location: MapLocation = {
          name: 'My Location',
          lat: latitude,
          lng: longitude,
        };
        placeMarker(location);
        onSelectLocation(location);
      },
      () => {
        setLoadError('无法获取当前位置');
      }
    );
  };

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white text-gray-500">
        <div className="text-center">
          <p className="text-lg">{loadError}</p>
          <p className="mt-2 text-sm text-gray-400">请检查 .env.local 中的 NEXT_PUBLIC_GAODE_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-gray-400">
          Loading map...
        </div>
      )}

      {isReady && (
        <>
          <form
            onSubmit={handleSearch}
            className="absolute left-4 right-4 top-4 z-10 flex max-w-md gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg md:left-6 md:right-auto"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search place..."
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <button
            onClick={handleLocate}
            className="absolute bottom-24 right-4 z-10 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 md:bottom-6"
            title="Locate me"
          >
            📍
          </button>
        </>
      )}
    </div>
  );
}
