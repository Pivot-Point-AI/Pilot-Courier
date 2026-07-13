'use client';
import { useLayoutEffect, useRef } from 'react';

export default function Globe({ className = '' }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let root;
    let disposed = false;

    (async () => {
      const am5 = await import('@amcharts/amcharts5');
      const am5map = await import('@amcharts/amcharts5/map');
      const am5themes_Animated = (await import('@amcharts/amcharts5/themes/Animated')).default;
      const am4geodata_worldLow = (await import('@amcharts/amcharts4-geodata/worldLow')).default;

      if (disposed) return;

      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);
      root._logo?.dispose();

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'rotateX',
          panY: 'rotateY',
          rotationY: -18,
          projection: am5map.geoOrthographic(),
          paddingBottom: 0,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        })
      );

      const oceanGradient = am5.RadialGradient.new(root, {
        stops: [
          { color: am5.color('#7ea0e0') },
          { color: am5.color('#4467c4') },
          { color: am5.color('#233d84') },
          { color: am5.color('#0d1c47') },
          { color: am5.color('#050b1f') },
        ],
      });

      const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fillGradient: oceanGradient,
        strokeOpacity: 0,
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
      graticuleSeries.mapLines.template.setAll({
        strokeOpacity: 0.1,
        strokeWidth: 0.5,
        stroke: am5.color('#bcd0f7'),
      });

      const landGradient = am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color('#f5f9ff') },
          { color: am5.color('#d3e2fb') },
          { color: am5.color('#aec4ee') },
        ],
        rotation: 100,
      });

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am4geodata_worldLow,
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true,
        fillGradient: landGradient,
        fillOpacity: 0.97,
        stroke: am5.color('#152652'),
        strokeWidth: 0.4,
        strokeOpacity: 0.45,
        shadowColor: am5.color('#050b1f'),
        shadowBlur: 4,
        shadowOpacity: 0.25,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color('#ffffff'),
      });

      // Shipping hub network — glowing points connected by animated arcs, spread across every continent
      const hubs = [
        { id: 'ny', lat: 40.7, lon: -74.0 },
        { id: 'la', lat: 34.0, lon: -118.2 },
        { id: 'sp', lat: -23.5, lon: -46.6 },
        { id: 'ld', lat: 51.5, lon: -0.12 },
        { id: 'ca', lat: 30.0, lon: 31.2 },
        { id: 'jo', lat: -26.2, lon: 28.0 },
        { id: 'du', lat: 25.2, lon: 55.3 },
        { id: 'mu', lat: 19.1, lon: 72.9 },
        { id: 'sg', lat: 1.35, lon: 103.8 },
        { id: 'sh', lat: 31.2, lon: 121.5 },
        { id: 'to', lat: 35.7, lon: 139.7 },
        { id: 'sy', lat: -33.9, lon: 151.2 },
      ];
      const routes = [
        ['ny', 'ld'],
        ['ny', 'la'],
        ['ny', 'sp'],
        ['ld', 'ca'],
        ['ld', 'du'],
        ['ca', 'jo'],
        ['ca', 'du'],
        ['jo', 'mu'],
        ['du', 'mu'],
        ['du', 'sg'],
        ['mu', 'sg'],
        ['sg', 'sh'],
        ['sg', 'sy'],
        ['sh', 'to'],
        ['to', 'sy'],
        ['to', 'la'],
        ['sp', 'jo'],
      ];

      // Layered glow passes underneath the crisp route lines — widest/faintest to narrowest/brightest
      const outerGlowSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      outerGlowSeries.mapLines.template.setAll({
        stroke: am5.color('#6f9dff'),
        strokeOpacity: 0.25,
        strokeWidth: 9,
      });

      const glowLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      glowLineSeries.mapLines.template.setAll({
        stroke: am5.color('#9dc0ff'),
        strokeOpacity: 0.5,
        strokeWidth: 5,
      });

      const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: am5.color('#ffffff'),
        strokeOpacity: 1,
        strokeWidth: 1.6,
        shadowColor: am5.color('#bcd6ff'),
        shadowBlur: 6,
        shadowOpacity: 0.9,
      });

      routes.forEach(([fromId, toId]) => {
        const from = hubs.find((h) => h.id === fromId);
        const to = hubs.find((h) => h.id === toId);
        const geometry = {
          type: 'LineString',
          coordinates: [
            [from.lon, from.lat],
            [to.lon, to.lat],
          ],
        };
        outerGlowSeries.pushDataItem({ geometry });
        glowLineSeries.pushDataItem({ geometry });
        lineSeries.pushDataItem({ geometry });
      });

      const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      pointSeries.bullets.push(() => {
        const outerGlow = am5.Circle.new(root, {
          radius: 10,
          fill: am5.color('#7fa8ff'),
          fillOpacity: 0.35,
        });
        outerGlow.animate({
          key: 'radius',
          from: 5,
          to: 16,
          duration: 1600,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic),
        });
        outerGlow.animate({
          key: 'fillOpacity',
          from: 0.4,
          to: 0,
          duration: 1600,
          loops: Infinity,
        });

        const glow = am5.Circle.new(root, {
          radius: 7,
          fill: am5.color('#d3e2ff'),
          fillOpacity: 0.75,
        });
        glow.animate({
          key: 'radius',
          from: 3,
          to: 12,
          duration: 1400,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic),
        });
        glow.animate({
          key: 'fillOpacity',
          from: 0.8,
          to: 0,
          duration: 1400,
          loops: Infinity,
        });

        const dot = am5.Circle.new(root, {
          radius: 3.2,
          fill: am5.color('#ffffff'),
          stroke: am5.color('#3b57c9'),
          strokeWidth: 1.2,
          shadowColor: am5.color('#bcd6ff'),
          shadowBlur: 14,
          shadowOpacity: 1,
        });

        const container = am5.Container.new(root, {});
        container.children.push(outerGlow);
        container.children.push(glow);
        container.children.push(dot);

        return am5.Bullet.new(root, { sprite: container });
      });

      hubs.forEach((h) => {
        pointSeries.data.push({ geometry: { type: 'Point', coordinates: [h.lon, h.lat] } });
      });

      chart.animate({
        key: 'rotationX',
        from: 0,
        to: 360,
        duration: 40000,
        loops: Infinity,
      });

      chart.appear(1000, 100);
    })();

    return () => {
      disposed = true;
      root?.dispose();
    };
  }, []);

  return (
    <div className={className}>
      {/* Outer atmosphere glow */}
      <div
        className="absolute -inset-5 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(130,170,255,0.55), rgba(130,170,255,0) 70%)',
        }}
      />
      <div ref={chartRef} className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_45px_rgba(80,120,255,0.75)]" />
      {/* Crisp rim edge for definition */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: '0 0 0 1px rgba(200,220,255,0.35)' }}
      />
      {/* Specular highlight */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), rgba(255,255,255,0) 45%)',
        }}
      />
      {/* Rim shading for a spherical, less-flat look */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: 'inset -7px -7px 20px rgba(0,0,0,0.4), inset 5px 5px 16px rgba(255,255,255,0.18)',
        }}
      />
      {/* Grounded drop shadow beneath the sphere */}
      <div
        className="absolute left-1/2 bottom-[-10%] -translate-x-1/2 w-[70%] h-[16%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5,10,30,0.45), rgba(5,10,30,0) 75%)',
        }}
      />
    </div>
  );
}
