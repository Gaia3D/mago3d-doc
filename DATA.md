
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/Bangkok-districts.geojson -nln district -nlt PROMOTE_TO_MULTI
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/bangkok_water.geojson -nln water -nlt PROMOTE_TO_MULTI
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/bangkok_building.geojson -nln building -nlt PROMOTE_TO_MULTI
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/SriLanka_building.geojson -nln srilanka_building -nlt PROMOTE_TO_MULTI
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/Ahmedabad_building.geojson -nln ahmedabad_building -nlt PROMOTE_TO_MULTI
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f PostgreSQL PG:"host=map.gaia3d.com port=54325 user=postgres dbname=postgres password=postgres" /data/district/district.geojson -nln boundaries -nlt PROMOTE_TO_MULTI
```

```sql
CREATE TABLE crop_building AS
SELECT
    ST_MakeValid(ST_Intersection(a.wkb_geometry, b.wkb_geometry)) AS geom,
    a.* -- building 테이블의 모든 속성을 포함
FROM
    building a,
    district b
WHERE
    ST_Intersects(a.wkb_geometry, b.wkb_geometry);
```

```sql
UPDATE crop_building
SET height = num_floors * 3.3
WHERE height IS NULL
  AND num_floors IS NOT NULL;

UPDATE srilanka_building
SET height = num_floors * 3.3
WHERE height IS NULL
  AND num_floors IS NOT NULL;

UPDATE ahmedabad_building
SET height = num_floors * 3.3
WHERE height IS NULL
  AND num_floors IS NOT NULL;
```

## export to GeoJSON
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/building.geojson "PG:host=map.gaia3d.com port=54325 dbname=postgres user=postgres password=postgres" -sql "SELECT geom, height FROM crop_building"
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/srilanka_building_height.geojson "PG:host=map.gaia3d.com port=54325 dbname=postgres user=postgres password=postgres" -sql "SELECT wkb_geometry, height FROM srilanka_building"
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/ahmedabad_building_height.geojson "PG:host=map.gaia3d.com port=54325 dbname=postgres user=postgres password=postgres" -sql "SELECT wkb_geometry, height FROM ahmedabad_building"


docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/srilanka_western3_2.geojson "PG:host=map.gaia3d.com port=54325 dbname=postgres user=postgres password=postgres" -sql "WITH boundaries AS (
    SELECT
      adm1_en AS name,
      ST_Union(wkb_geometry) AS wkb_geometry
    FROM boundaries
    GROUP BY adm1_en
),
extent AS (
    SELECT
        ST_XMin(ST_Extent(wkb_geometry)) AS x_min,
        ST_XMax(ST_Extent(wkb_geometry)) AS x_max,
        ST_YMin(ST_Extent(wkb_geometry)) AS y_min,
        ST_YMax(ST_Extent(wkb_geometry)) AS y_max
    FROM boundaries
    WHERE name = 'Western'
),
 top_left_halves AS (
    SELECT
        -- Top Left Bottom Half
        ST_MakeEnvelope(x_min, (y_min + y_max) / 2, (x_min + x_max) / 2, (3 * y_max + y_min) / 4, 4326) AS top_left_bottom,
        -- Top Left Top Half
        ST_MakeEnvelope(x_min, (3 * y_max + y_min) / 4, (x_min + x_max) / 2, y_max, 4326) AS top_left_top
    FROM extent
)
SELECT
    b.wkb_geometry,
    b.height
FROM srilanka_building b, boundaries bd
WHERE ST_Intersects(b.wkb_geometry, bd.wkb_geometry) AND bd.name = 'Western' AND ST_Intersects(b.wkb_geometry, (SELECT top_left_top FROM top_left_halves))"
```

## export to Shapefile
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "ESRI Shapefile" /data/building.shp "PG:host=map.gaia3d.com port=54325 dbname=postgres user=postgres password=postgres" -sql "SELECT geom, height FROM crop_building" -lco ENCODING=UTF-8

docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "ESRI Shapefile" /data/ridge.shp "PG:host=59.27.63.245 port=5432 dbname=postgres user=postgres password=!mago3dmago#d!" -sql "SELECT * FROM geoserver.shp_91cabde028402e206f407c63f029bd82" -lco ENCODING=UTF-8
```

## run mago3dTiler
```shell
docker run --rm -v C:\workspace:/data gaia3d/mago-3d-tiler -it geojson -hc height -c 4326 -mh 3.3 -te /data/terrain/dem_30m.tif -i /data/input -o /data/output
## footprints
docker run --rm -v /data2:/data carped99/mdtp-mago3d-tiler -it geojson -hc BL_HEIGHT -c 4326 -mh 3.3 -te /data/terrain/dem_30m_kk.tif -i /data/input -o /data/output
## point cloud
docker run --rm -v /data2:/data carped99/mdtp-mago3d-tiler -it las -i /data/pc/tile1 -o /data/output/pc/tile1 -crs 32648

```
```shell
docker run --rm -v C:\workspace:/data gaia3d/mago-3d-tiler -it shp -hc height  -c 4326 -mh 3.3 -te /data/terrain/dem_30m.tif -i /data/input -o /data/output
```

## GeoJSON 빌딩 전처리
1. 건물 높이(height) 추출
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/khlongtoei_hegiht.geojson /data/khlongtoei_building_origin.geojson -sql "SELECT height FROM khlongtoei_building_origin WHERE height IS NOT NULL"
```

2. 건물 층수(num_floors)를 높이로 변환
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/khlongtoei_num_floors.geojson /data/khlongtoei_building_origin.geojson -sql "SELECT num_floors * 3.3 AS height FROM khlongtoei_building_origin WHERE height IS NULL"
```

3. 병합
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" /data/khlongtoei_building.geojson /data/khlongtoei_hegiht.geojson
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 ogr2ogr -f "GeoJSON" -append /data/khlongtoei_building.geojson /data/khlongtoei_num_floors.geojson
```

## JP2 파일을 TIF 파일로 변환하는 방법
```shell
docker run --rm -v C:\workspace:/data ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 gdal_translate -of GTiff /data/T43QBF_20240511T053639_TCI_10m.jp2 /data/T43QBF_20240511T053639_TCI_10m.tif
```

```shell
docker run --rm -v C:\bangkok:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr -f "GeoJSON" /data/input/buildings.geojson /data/BUILDING_THAILAND_with_GLOBALID_v2-S2.gpkg -t_srs EPSG:4326
```

## GeoJSON 빌딩 전처리
```shell
docker run --rm \
  -v /data3/input/{region}:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr \
  -f "GeoJSON" /data/{region}_height.geojson /data/{region}_building.geojson \
  -sql "SELECT height FROM {region}_building WHERE height IS NOT NULL"
```

```shell
docker run --rm \
  -v /data3/input/{region}:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr \
  -f "GeoJSON" /data/{region}_num_floors.geojson /data/{region}_building.geojson \
  -sql "SELECT num_floors * 3.3 AS height FROM {region}_building WHERE height IS NULL"
```

```shell  
docker run --rm \
  -v /data3/input/{region}:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr \
  -f "GeoJSON" /data/{region}_building_new.geojson /data/{region}_height.geojson
```

```shell
docker run --rm \
  -v /data3/input/{region}:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr \
  -f "GeoJSON" -append /data/{region}_building_new.geojson /data/{region}_num_floors.geojson
```

## JP2 파일을 TIF 파일로 변환하는 방법
```shell
docker run --rm \
    -v /data3/input/{origin_directory}:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 gdal_translate \
    -of GTiff /data/{T48PZC_20250302T030539_TCI_10m}.jp2 /data/{T48PZC_20250302T030539_TCI_10m}.tif
```

## mago3dTiler 실행
```shell
docker run \
    --rm \
    -v /data3/input:/workspace gaia3d/mago-3d-tiler \
    -input /workspace/danang \
    -output /workspace/danang_tiles2 \
    -log /workspace/danang_tiles/log.txt \
    -it geojson \
    -crs 4326 \
    -te /workspace/danang_dem/danang_dem.tif \
    -mh 3.3 \
    -hc height \
    -debug
```

## docker cp
```shell
docker cp ~/{tiles} mago3d-storage-1:/home
```

## minio cli
```shell
docker exec -it mago3d-storage-1 bash
```

```shell
mc alias list
```

```shell
mc alias set myminio http://localhost:9000 minioadmin minioadmin
```

```shell
mc ls myminio
```

```shell
mc cp --recursive /home/{tiles}/ myminio/mdtp/{tiles}
```



