## 데이터 다운로드
bbox coordinates:
174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130

참고 사이트:
https://explore.overturemaps.org/

* building download:
windows:
```
overturemaps download ^
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 ^
  -f geojson ^
  --type=building ^
  -o foss4g-2025\public\auckland_central_building.geojson
```

powershell:
```
overturemaps download `
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
  -f geojson `
  --type=building `
  -o foss4g-2025/public/auckland_central_building.geojson
```

linux/mac:
```
overturemaps download \
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 \
  -f geojson \
  --type=building \
  -o foss4g-2025/public/auckland_central_building.geojson
```

* land-use download:
```
overturemaps download `
  --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
  -f geojson `
  --type=land_use `
  -o foss4g-2025/public/auckland_central_land_use.geojson
```

## 건물 데이터 전처리
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/auckland_central_building.geojson ^
  -dialect SQLite ^
  -sql "SELECT geometry, CASE WHEN height IS NOT NULL THEN height WHEN num_floors IS NOT NULL THEN num_floors * 3.3 ELSE 3.3 END AS height FROM auckland_central_building"
```

## 산림 데이터 전처리
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GPKG" /data/converted/auckland_forest.gpkg /data/auckland_central_land_use.geojson ^
  -sql "SELECT subtype, class, 20 AS height FROM auckland_central_land_use WHERE subtype = 'park' OR (subtype = 'managed' AND class = 'grass')"
```

## 지형
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/workspace gaia3d/mago-3d-terrainer ^
  --input /workspace/BA32.tif ^
  --output /workspace/output/terrain/ ^
  --log /workspace/output/terrain/log.txt ^
  --calculateNormals --minDepth 0 --maxDepth 17
```

## 건물
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/workspace gaia3d/mago-3d-tiler ^
  --input /workspace/converted/auckland_building.geojson ^
  --output /workspace/output/tileset/buildings/ ^
  --inputType geojson ^
  --crs 4326 ^
  --heightColumn height ^
  --minimumHeight 3.3 ^
  --terrain /workspace/BA32.tif ^
  --log /workspace/output/tileset/buildings/log.txt
```

## 산림
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/workspace gaia3d/mago-3d-tiler ^
  --scaleColumn height ^
  --inputType gpkg ^
  --input /workspace/converted/auckland_forest.gpkg ^
  --outputType i3dm ^
  --output /workspace/output/tileset/forest ^
  --crs 4326 ^
  --instance /workspace/instance-LOD3.glb ^
  --terrain /workspace/BA32.tif ^
  --log /workspace/output/tileset/forest/log.txt ^
  --tilesVersion 1.0
```

## 포인트 클라우드
```
docker run --rm ^
  -v C:\Users\user\IdeaProjects\mago3d-doc\foss4g-2025\public:/workspace gaia3d/mago-3d-tiler ^
  --input /workspace ^
  --output /workspace/output/tileset/pointcloud ^
  --log /workspace/output/tileset/pointcloud/log.txt ^
  --inputType laz ^
  --crs 4326 ^
  --pointRatio 70 ^
  --tilesVersion 1.0
```