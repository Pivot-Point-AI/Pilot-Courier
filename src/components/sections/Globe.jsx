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
          projection: am5map.geoOrthographic(),
          paddingBottom: 0,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        })
      );

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am4geodata_worldLow,
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true,
        fill: am5.color('#1B2B6B'),
        stroke: am5.color('#bfd0ee'),
        strokeWidth: 0.5,
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color('#537dcf'),
      });

      const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color('#bfd0ee'),
        fillOpacity: 0.15,
        strokeOpacity: 0,
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
      graticuleSeries.mapLines.template.setAll({
        strokeOpacity: 0.15,
        stroke: am5.color('#1B2B6B'),
      });

      chart.animate({
        key: 'rotationX',
        from: 0,
        to: 360,
        duration: 30000,
        loops: Infinity,
      });

      chart.appear(1000, 100);
    })();

    return () => {
      disposed = true;
      root?.dispose();
    };
  }, []);

  return <div ref={chartRef} className={className} />;
}
