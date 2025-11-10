# 데이터 처리 가이드

## 데이터 준비

이번 과정은 수집한 데이터를 웹으로 서비스하기 위해 데이터를 처리하는 방법을 안내합니다.
이 과정에서 데이터 처리용 오픈 소스 도구를 사용합니다.

도시 디지털 트윈을 구현하고 시각화 하는데 강력한 기능을 제공하지만, 각 도구의 특성과 요구사항에 맞는 데이터 형식으로 변환이 필요합니다.
진행할 데이터 변환 작업을 표로 정리하면 다음과 같습니다.

| 변환 작업             | 입력 데이터 형식          | 출력 데이터 형식                    | 사용 도구                              |
|-------------------|--------------------|------------------------------|------------------------------------|
| 건물 데이터 전처리        | GeoJSON (.geojson) | GeoJSON (.geojson)           | GDAL, ogr2ogr                      |
| 산림 데이터 전처리        | GeoJSON (.geojson) | GeoPackage (.gpkg)           | GDAL, ogr2ogr                      |
| 지형 데이터 생성         | GeoTIFF (.tif)     | terrain 디렉토리 구조, layer.json  | mago3DTerrainer                    |
| 건물 3D 타일 생성       | GeoJSON (.geojson) | 3D Tiles (glb), tileset.json | mago3DTiler                        |
| 산림 3D 타일 생성       | GeoPackage (.gpkg) | 3D Tiles (i3dm), tileset.json | mago3DTiler                        |
| 포인트 클라우드 3D 타일 생성 | LAZ (.laz)         | 3D Tiles (pnts), tileset.json | mago3DTiler                        |
| OGC WMTS 서비스 설정   | -                  | OGC WMTS 서비스               | The LINZ Data Service Tile Service |

모든 원본 데이터가 준비가 되었는지 확인하세요.
원본 데이터는 `foss4g-2025/public` 디렉토리에 저장되어 있어야 합니다.
예를 들어, 건물 데이터가 `foss4g-2025/public/auckland_central_building.geojson`에 위치 하는 것을 권장 합니다.

## 데이터 전처리
데이터 전처리는 GDAL/OGR 도구를 사용하여 수행됩니다.
GDAL/OGR은 다양한 지리공간 데이터 형식을 처리할 수 있는 강력한 오픈 소스 라이브러리입니다.
이번 과정에서는 `ogr2ogr` 명령을 사용하여 건물과 산림 데이터를 전처리 합니다.

### 건물 데이터 전처리
Overture Maps에서 다운로드한 건물 데이터는 GeoJSON 형식으로 제공됩니다.
이 데이터를 GDAL/OGR의 `ogr2ogr` 명령을 사용하여 건물 높이 정보를 가공합니다.

다운로드 받은 원본 데이터는 다음과 같은 속성을 가지고 있습니다.
원본의 속성 중에 `height`, `num_floors` 속성을 사용하여 건물 높이를 계산합니다.
![building_attributes.png](../images/building_attributes.png)

windows:
```shell
docker run --rm ^
  -v {YOUR_PROJECT_ROOT_DIR}\mago3d-doc\foss4g-2025\public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr ^
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/auckland_central_building.geojson ^
  -dialect SQLite ^
  -sql "SELECT geometry, CASE WHEN height IS NOT NULL THEN height WHEN num_floors IS NOT NULL THEN num_floors * 3.3 ELSE 3.3 END AS height FROM auckland_central_building"
```

powershell:
```shell
docker run --rm `
  -v {YOUR_PROJECT_ROOT_DIR}/mago3d-doc/foss4g-2025/public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr `
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/auckland_central_building.geojson `
  -dialect SQLite `
  -sql "SELECT geometry, CASE WHEN height IS NOT NULL THEN height WHEN num_floors IS NOT NULL THEN num_floors * 3.3 ELSE 3.3 END AS height FROM auckland_central_building"
```

linux/mac:
```shell
docker run --rm \
  -v {YOUR_PROJECT_ROOT_DIR}/mago3d-doc/foss4g-2025/public:/data ghcr.io/osgeo/gdal:ubuntu-full-3.9.0 ogr2ogr \
  -f "GeoJSON" /data/converted/auckland_building.geojson /data/auckland_central_building.geojson \
  -dialect SQLite \
  -sql "SELECT geometry, CASE WHEN height IS NOT NULL THEN height WHEN num_floors IS NOT NULL THEN num_floors * 3.3 ELSE 3.3 END AS height FROM auckland_central_building"
```

위 구문에 대한 설명은 다음과 같습니다:
- `docker run --rm`: Docker 컨테이너를 실행하고 작업이 끝나면 컨테이너를 제거합니다.
- `-v {YOUR_PROJECT_ROOT_DIR}\mago3d-doc\foss4g-2025\public:/data`: 호스트의 `foss4g-2025/public` 디렉토리를 컨테이너의 `/data` 디렉토리에 마운트합니다.
- `ghcr.io/osgeo/gdal:ubuntu-full-3.9.0`: GDAL이 설치된 Docker 이미지입니다.
- `ogr2ogr`: GDAL의 명령줄 도구로, 벡터 데이터를 변환하는 데 사용됩니다.
- `-f "GeoJSON"`: 출력 형식을 GeoJSON으로 지정합니다.
- `/data/converted/auckland_building.geojson`: 출력 파일 경로입니다.
- `/data/auckland_central_building.geojson`: 입력 파일 경로입니다.
- `-dialect SQLite`: SQL 쿼리를 SQLite 방언으로 실행합니다.
- `-sql "SELECT ..."`: SQL 쿼리를 사용하여 건물 높이 정보를 처리합니다.   
  sql 쿼리는 `height` 속성에 값을 채웁니다.   
  `height`에 값이 있으면 height 값을 사용하고,   
  `num_floors`에 값이 있으면 num_floors * 3.3 (평균 층고 3.3미터 가정)을 사용하며,   
  둘 다 없으면 기본 높이 `3.3미터`를 할당합니다.   

[참고] 만들어진 height 속성은 이후 3D 타일 생성 과정에서 사용됩니다. 단위는 미터입니다.

