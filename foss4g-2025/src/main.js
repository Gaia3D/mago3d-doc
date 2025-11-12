import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import {
  ImageryLayer,
  IonWorldImageryStyle,
  Viewer
} from "cesium";

// Cesium Ion 서비스 접근을 위한 워크숍용 임시 토큰
// 자세한 발급 가이드는 /guides/3_CesiumToken_Guide.md 참고
const CESIUM_TOKEN = "YOUR_KEY"
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

// Cesium Viewer 생성 및 기본 옵션 설정
const viewer = new Viewer("cesiumContainer", {
  infoBox: true, // 클릭 시 정보 박스 표시 활성화
});
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.enableLighting = true;

// 기본 위성 지도 레이어 추가
const mapLayer = ImageryLayer.fromWorldImagery({
  style: IonWorldImageryStyle.AERIAL,
});
viewer.imageryLayers.add(mapLayer);
const toolbar = document.getElementById("toolbar");

// ============================================
// STEP 1: 지형(Terrain) 데이터 로드
// ============================================
try {
  let purdueTerrainProvider;

  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 1] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Mago3D로 변환한 지형 데이터를 Cesium Terrain Provider로 로드
  purdueTerrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
      "/output/terrain/"  // 지형 데이터가 있는 로컬 경로
  );

  // 뷰어에 지형 데이터 적용
  viewer.terrainProvider = purdueTerrainProvider;

  // 지형 on/off 토글 버튼 생성
  const terrainButton = document.createElement("button");
  terrainButton.textContent = "Toggle Terrain";
  terrainButton.onclick = () => {
    // 현재 지형이 활성화되어 있으면 평평한 지구로, 아니면 지형 데이터로 전환
    if (viewer.terrainProvider === purdueTerrainProvider) {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    } else {
      viewer.terrainProvider = purdueTerrainProvider;
    }
  };
  toolbar.appendChild(terrainButton)

  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 1] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

  // ============================================
  // 관심 영역 표시 및 카메라 초기 위치 설정
  // ============================================
  // 뉴질랜드 오클랜드 근처의 관심 영역 경계 [west, south, east, north]
  const originalBounds = [174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130];

  // 경계를 3D 좌표로 변환하여 노란색 테두리 생성
  const rectangleCoordinates = Cesium.Cartesian3.fromDegreesArray([
    originalBounds[0], originalBounds[1], originalBounds[2], originalBounds[1],
    originalBounds[2], originalBounds[3], originalBounds[0], originalBounds[3],
    originalBounds[0], originalBounds[1]
  ]);

  // 노란색 테두리 polyline 추가
  viewer.entities.add({
    name: 'Yellow Bounds',
    polyline: {
      positions: rectangleCoordinates,
      width: 4,
      material: Cesium.Color.YELLOW.withAlpha(0.7), // 투명도 0.7의 노란색
      clampToGround: true  // 지형에 붙도록 설정
    }
  });

  // 카메라를 관심 영역으로 이동
  viewer.camera.setView({
    destination : new Cesium.Rectangle.fromDegrees(originalBounds[0],originalBounds[1],originalBounds[2],originalBounds[3])
  });
} catch (e) {
  console.log(`Error loading terrain: ${e}`);
}

// ============================================
// STEP 2: 건물 3D 타일셋 로드 및 높이별 스타일링
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 2] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Mago3D로 변환한 3D 건물 타일셋 로드
  const tileset = await Cesium.Cesium3DTileset.fromUrl("/premade-output/tileset/buildings/tileset.json");

  // 건물 높이에 따른 색상 스타일 적용
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["Number(${height}) < 10", "color('lightgrey')"],   // 10m 미만: 연한 회색
        ["Number(${height}) < 20", "color('skyblue')"],     // 10-20m: 하늘색
        ["Number(${height}) < 30", "color('green')"],       // 20-30m: 녹색
        ["Number(${height}) < 40", "color('yellow')"],      // 30-40m: 노란색
        ["Number(${height}) < 50", "color('orange')"],      // 40-50m: 주황색
        ["Number(${height}) < 60", "color('red')"],         // 50-60m: 빨간색
        ["Number(${height}) < 70", "color('purple')"],      // 60-70m: 보라색
        ["true", "color('pink')"]                           // 70m 이상: 분홍색
      ]
    }
  });

  // 씬에 건물 타일셋 추가
  viewer.scene.primitives.add(tileset);

  // 건물 on/off 토글 버튼 생성
  const buildingButton = document.createElement("button");
  buildingButton.textContent = "Toggle Buildings";
  buildingButton.onclick = () => {
    tileset.show = !tileset.show;
  };
  toolbar.appendChild(buildingButton);
  
  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 2] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

  // 건물 타일셋으로 카메라 이동
  viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
    duration: 3,
    offset : new Cesium.HeadingPitchRange( 0,  Cesium.Math.toRadians(-60), tileset.boundingSphere.radius * 1.5 )
  });


} catch (error) {
  console.log(`Error creating building tileset: ${error}`);
}

// ============================================
// STEP 3: 숲(Forest) 3D 타일셋 로드
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 3] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Mago3D로 변환한 3D 숲 타일셋 로드
  const forestTileset = await Cesium.Cesium3DTileset.fromUrl("/premade-output/tileset/forest/tileset.json");

  // 씬에 숲 타일셋 추가
  viewer.scene.primitives.add(forestTileset);

  // 숲 on/off 토글 버튼 생성
  const forestButton = document.createElement("button");
  forestButton.textContent = "Toggle Forest";
  forestButton.onclick = () => {
    forestTileset.show = !forestTileset.show;
  };
  toolbar.appendChild(forestButton);
  
  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 3] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
} catch (error) {
  console.log(`Error creating forest tileset: ${error}`);
}

// ============================================
// STEP 4: 포인트 클라우드(Point Cloud) 로드 및 분류별 스타일링
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 4] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // 포인트 클라우드 타일셋 로드 (LiDAR 데이터)
  const pointTileset = await Cesium.Cesium3DTileset.fromUrl(
    '/premade-output/tileset/pointcloud/tileset.json',
    {
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    }
  );

  // LiDAR 포인트 클라우드의 분류별 색상 및 표시 여부 정의
  // https://user-images.githubusercontent.com/11743012/48382415-e61d5e00-e695-11e8-8841-228dd96732c4.png
  const ASPRS_STYLE = [
    { id: 0, name: 'Default (No Classification)', color: 'rgb(26,26,26)', enabled: true },
    { id: 1, name: 'Unclassified', color: 'rgb(170,170,170)', enabled: false },
    { id: 2, name: 'Ground', color: 'rgb(170,85,0)', enabled: true },             // 지면: 갈색
    { id: 3, name: 'Low Vegetation', color: 'rgb(0,170,170)', enabled: true },    // 낮은 식생: 청록색
    { id: 4, name: 'Medium Vegetation', color: 'rgb(85,255,85)', enabled: true }, // 중간 식생: 연두색
    { id: 5, name: 'High Vegetation', color: 'rgb(0,128,0)', enabled: true },     // 높은 식생: 녹색
    { id: 6, name: 'Building', color: 'rgb(255,85,85)', enabled: true },          // 건물: 연한 빨강
    { id: 7, name: 'Low Point (Noise)', color: 'rgb(170,0,0)', enabled: false },  // 노이즈: 숨김
    { id: 9, name: 'Water', color: 'rgb(0,0,191)', enabled: true },               // 물: 파란색
    { id: 10, name: 'Rail', color: 'rgb(0,0,64)', enabled: true },                // 철도: 진한 파랑
    { id: 11, name: 'Road Surface', color: 'rgb(80,80,80)', enabled: true },     // 도로: 회색
    { id: 13, name: 'Wire Guard', color: 'rgb(0,0,8)', enabled: true },
    { id: 14, name: 'Wire Conductor', color: 'rgb(0,0,4)', enabled: true },
    { id: 15, name: 'Transmission Tower', color: 'rgb(255,255,0)', enabled: true }, // 송전탑: 노란색
    { id: 16, name: 'Wire Structure Connector', color: 'rgb(0,0,1)', enabled: true },
    { id: 17, name: 'Bridge Deck', color: 'rgb(0,0,0)', enabled: true },         // 교량: 검은색
    { id: 18, name: 'High Noise', color: 'rgb(100,100,100)', enabled: false }    // 높은 노이즈: 숨김
  ];

  // enabled가 false인 분류는 표시하지 않도록 조건 생성
  const showConditions = ASPRS_STYLE
    .filter(cls => !cls.enabled)
    .map(cls => `\${CLASSIFICATION} !== ${cls.id}`);

  showConditions.push('${CLASSIFICATION} < 18');

  // enabled가 true인 분류에 색상 적용
  const colorConditions = ASPRS_STYLE
    .filter(cls => cls.enabled)
    .map(cls => [`\${CLASSIFICATION} === ${cls.id}`, `color('${cls.color}')`]);

  colorConditions.push(['true', "color('white')"]);

  // 포인트 클라우드 스타일 적용
  const style = new Cesium.Cesium3DTileStyle({
    show: showConditions.join(' && '),
    color: {
      conditions: colorConditions
    },
    pointSize: 3  // 포인트 크기
  });

  pointTileset.style = style;
  viewer.scene.primitives.add(pointTileset);

  // 포인트 클라우드 on/off 토글 버튼 생성
  const pcButton = document.createElement("button");
  pcButton.textContent = "Toggle Point Cloud";
  pcButton.onclick = () => {
    pointTileset.show = !pointTileset.show;
  };
  toolbar.appendChild(pcButton);
  
  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 4] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
} catch (e) {
  console.log(`Error loading point cloud: ${e}`);
}

// Koordinates WMTS 타일 서비스 접근을 위한 API 키
const KOORDINATES_KEY = "YOUR_KEY";

// ============================================
// STEP 5: WMTS 항공 사진 레이어 추가
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 5] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Koordinates의 WMTS 항공 사진 타일 서비스 설정
  const koordinatesWMTS = new Cesium.UrlTemplateImageryProvider({
    url: `https://tiles-cdn.koordinates.com/services;key=${KOORDINATES_KEY}/tiles/v4/layer=121752/EPSG:3857/{z}/{x}/{y}.png`,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 0,   // 최소 줌 레벨
    maximumLevel: 21,  // 최대 줌 레벨
    credit: 'Koordinates'  // 출처 표시
  });

  // 뷰어에 항공 사진 레이어 추가
  const koordinatesLayer = viewer.imageryLayers.addImageryProvider(koordinatesWMTS);

  const toolbar = document.getElementById("toolbar");

  // 항공 사진 레이어 on/off 토글 버튼 생성
  const wmtsButton = document.createElement("button");
  wmtsButton.textContent = "Toggle Aerial Layer";
  wmtsButton.onclick = () => {
    koordinatesLayer.show = !koordinatesLayer.show;
  };
  toolbar.appendChild(wmtsButton);
  
  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 5] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

} catch (error) {
  console.error("Error loading Koordinates WMTS layer:", error);
}

// ============================================
// STEP 6: WMTS 도로 레이어 추가
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 6] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Koordinates의 WMTS 도로 타일 서비스 설정 (빨간색으로 표시)
  const koordinatesWMTS = new Cesium.UrlTemplateImageryProvider({
    url: `https://tiles-cdn.koordinates.com/services;key=${KOORDINATES_KEY}/tiles/v4/layer=53378.431413,color=ff0000/{z}/{x}/{y}.png`,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),  // Web Mercator 투영법 (EPSG:3857)
    minimumLevel: 0,   // 최소 줌 레벨
    maximumLevel: 21,  // 최대 줌 레벨
    credit: 'Koordinates'  // 출처 표시
  });

  // 뷰어에 도로 레이어 추가
  const koordinatesLayer = viewer.imageryLayers.addImageryProvider(koordinatesWMTS);

  const toolbar = document.getElementById("toolbar");
  
  // 도로 레이어 on/off 토글 버튼 생성
  const wmtsButton = document.createElement("button");
  wmtsButton.textContent = "Toggle Road Layer";
  wmtsButton.onclick = () => {
    koordinatesLayer.show = !koordinatesLayer.show;
  };
  toolbar.appendChild(wmtsButton);
  
  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 6] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
} catch (error) {
  console.error("Error loading Koordinates WMTS layer:", error);
}