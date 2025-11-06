```
GEOMETRYCOLLECTION(POLYGON ((174.74875299908837 -36.83832308413148, 174.74875299908837 -36.867518264813455, 174.7843583126396 -36.867518264813455, 174.7843583126396 -36.83832308413148, 174.74875299908837 -36.83832308413148)))
```

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              174.74875299908837,
              -36.83832308413148
            ],
            [
              174.74875299908837,
              -36.867518264813455
            ],
            [
              174.7843583126396,
              -36.867518264813455
            ],
            [
              174.7843583126396,
              -36.83832308413148
            ],
            [
              174.74875299908837,
              -36.83832308413148
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}
```

## 데이터 다운로드
bbox coordinates:
174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130

참고 사이트:
https://explore.overturemaps.org/

windows:
```
overturemaps download ^
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 ^
  -f geojson ^
  --type=building ^
  -o auckland_central_building.geojson
```

powershell:
```
overturemaps download `
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
  -f geojson `
  --type=building `
  -o auckland_central_building.geojson
```

linux/mac:
```
overturemaps download \
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 \
  -f geojson \
  --type=building \
  -o auckland_central_building.geojson
```

```
overturemaps download `
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
  -f geojson `
  --type=land_use `
  -o auckland_central_land_use.geojson
```

## 건물 데이터 전처리
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/height.geojson /data/auckland_central_building.geojson ^
  -sql "SELECT height FROM auckland_central_building WHERE height IS NOT NULL"
```

```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/num_floors.geojson /data/auckland_central_building.geojson ^
  -sql "SELECT num_floors * 3.3 AS height FROM auckland_central_building WHERE height IS NULL"
```

```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/height.geojson
```

```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/num_floors.geojson
```

## 산림 데이터 전처리
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GPKG" /data/converted/auckland_forest.gpkg /data/auckland_central_land_use.geojson ^
  -sql "SELECT * FROM auckland_central_land_use WHERE subtype = 'park' OR (subtype = 'managed' AND class = 'grass')"
```

## 지형
```

```

