# 💻 샘플 코드를 사용한 결과 확인

- 선호하는 IDE에서 `C:\mago3d\workspace\index.html` 파일을 엽니다
    - 필요한 경우 ✏️ 아이콘이 있는 코드를 환경에 맞게 수정합니다
- index.html 파일을 열어두고 서버를 활성화하여 Chrome에서 결과를 확인합니다

## 샘플 코드

---

### CesiumJS 라이브러리 로드
```html
<script src="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Cesium.js"></script>
<link href="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```
CesiumJS는 3D 지구본 및 지도 시각화를 위한 오픈소스 JavaScript 라이브러리입니다.
`Cesium.js`: 지도와 3D 지구본을 렌더링하기 위해 JavaScript 코드에서 사용됩니다.
`widgets.css`: Cesium의 기본 UI 컴포넌트 스타일을 제공하는 CSS 파일입니다.

---

### HTML 코드
```html
    <div id="cesiumContainer"></div>
    <div id="function-div">
        <h3>Fly to</h3>
        <button id="bangkok-btn">Bangkok</button>

        <h3>Toggle Layer</h3>
        <button id="buildings-btn">buildings</button>
        <div id="layerButtons"></div>
    </div>
```
`<div id="cesiumContainer"></div>`: Cesium이 3D 지구본을 렌더링할 공간입니다. JavaScript 코드에서 Cesium.Viewer를 사용하여 이 div에 3D 뷰가 생성됩니다.
```html
<div id="function-div">
    <h3>Fly to</h3>
    <button id="bangkok-btn">Bangkok</button>

    <h3>Toggle Layer</h3>
    <button id="buildings-btn">buildings</button>
    <div id="layerButtons"></div>
</div>
```
카메라 이동 및 레이어 전환과 같은 특정 기능과 상호작용할 수 있는 버튼이 포함된 UI 패널입니다.

---

### Javascript 코드
#### 1. Cesium Viewer 초기화
뷰어와 초기 3D 지구본 환경을 설정합니다.
```javascript
const viewer = new Cesium.Viewer('cesiumContainer');
viewer.scene.globe.depthTestAgainstTerrain = true; // 지형에 대한 3D 객체의 적절한 깊이 테스트를 보장합니다.
viewer.scene.requestRenderMode = true; // 장면 변경 시에만 렌더링하여 렌더링 성능을 최적화합니다.
```
* cesiumContainer div 내에서 3D 지구본을 렌더링하는 Cesium Viewer를 초기화합니다.
* 더 나은 성능을 위해 깊이 테스트 및 렌더링 최적화를 구성합니다.

---

#### 2. 리소스 구성
이미지 제공자 또는 외부 데이터 소스와 같은 리소스를 지정합니다.
```javascript
const resource_3d = './output/tileset.json'; // 3D 타일셋 리소스 경로
const resource_terrain = './assets/terrain/'; // 지형 데이터 경로
const geoserverUrl = 'http://localhost:8080/geoserver/wms'; // GeoServer WMS 서비스 URL
const resource_2d = 'mago3d:sentinel'; // 2D 이미지를 위한 GeoServer 레이어
const resource_transportation = 'mago3d:transportation'; // 교통 데이터를 위한 GeoServer 레이어
```
지형, 3D 타일 및 2D 이미지 레이어에 사용되는 파일 경로와 GeoServer URL을 정의합니다.

---

#### 3. 지형 설정
현실적인 고도를 위해 Quantized-Mesh 지형을 추가하는 등 지형을 구성합니다.
```javascript
viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(resource_terrain);
```
지정된 경로의 지형 데이터를 사용하도록 Cesium Viewer를 구성합니다.

---

#### 4. 3D 타일셋 설정
건물이나 다른 3D 모델과 같은 3D 타일셋을 로드하여 장면에 표시합니다.
```javascript
const tileset = await Cesium.Cesium3DTileset.fromUrl(resource_3d);
viewer.scene.primitives.add(tileset);
```
3D 타일셋(예: 건물 또는 기타 구조물)을 로드하여 장면에 추가합니다.

---

#### 5. 기본 이미지 설정
컨텍스트를 위해 기본 지도 레이어(예: OpenStreetMap, Bing Maps)를 추가합니다.
```javascript
viewer.scene.imageryLayers.removeAll(); // 기본 이미지 레이어를 모두 제거합니다.
const osm = new Cesium.OpenStreetMapImageryProvider({
    url: 'https://a.tile.openstreetmap.org/'
});
viewer.scene.imageryLayers.addImageryProvider(osm);
```
기본 지도 이미지를 OpenStreetMap 타일로 설정합니다.

---

#### 6. GeoServer에서 레이어 추가
GeoServer의 WMS 레이어(예: 교통 또는 위성 이미지)를 통합합니다.
```javascript
const layers = {};
const addLayer = (layerName) => {
    const layer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
            url: geoserverUrl,
            layers: layerName,
            minimumLevel: 0,
            parameters: {
                service: "WMS",
                version: "1.1.1",
                request: "GetMap",
                transparent: "true",
                format: "image/png",
                tiled: true
            }
        })
    );
    viewer.scene.imageryLayers.add(layer);
    layers[layerName] = layer;
};
addLayer(resource_2d);
addLayer(resource_transportation);
```
GeoServer WMS 레이어(예: 위성 이미지, 교통 데이터)를 Cesium Viewer에 동적으로 추가합니다.

---

#### 7. 스타일링을 위한 Post-Render 리스너
렌더링 후 추가 스타일을 적용하여 시각화를 향상시킵니다.
```javascript
const removeListener = viewer.scene.postRender.addEventListener(
    function () {
        if (viewer.scene.globe.tilesLoaded) {
            setStyle(); // 타일이 완전히 로드된 후 스타일을 적용합니다.
            removeListener(); // 완료되면 리스너를 제거합니다.
        }
    }.bind(this)
);
```
지형과 타일이 로드된 후 스타일이 적용되도록 합니다.

---

#### 8. Fly-to 기능
카메라가 특정 좌표로 이동하거나 특정 기능을 확대할 수 있습니다.
```javascript
const bangkok = { lat: 13.730276, lng: 100.560534 };
const bangkokBtn = document.getElementById("bangkok-btn");

const flyToPosition = (viewer, position) => {
    const alt = 50000;
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, alt)
    });
};
bangkokBtn.addEventListener("click", () => flyToPosition(viewer, bangkok));
```
버튼을 클릭하면 카메라를 특정 위치(예: 방콕)로 이동시키는 함수를 정의합니다.

---

#### 9. 3D 건물 토글 / GeoServer 레이어 토글
다양한 레이어를 대화식으로 표시하거나 숨기는 기능을 추가합니다.
```javascript
const buildingsBtn = document.getElementById("buildings-btn");

const toggleBuildings = () => {
    tileset.show = !tileset.show; // 3D 타일셋의 가시성을 토글합니다.
    buildingsBtn.style.color = buildingsBtn.style.color === 'gray' ? '' : 'gray'; // 버튼 색상을 업데이트합니다.
};
buildingsBtn.addEventListener("click", toggleBuildings);
```
3D 타일셋(예: 건물)의 가시성을 토글하고 버튼의 색상을 업데이트하여 상태를 나타냅니다.

```javascript
const layerButtonsContainer = document.getElementById('layerButtons');
const layerNames = [resource_2d, resource_transportation];

const toggleLayer = (layerName, button) => {
    if (layers[layerName]) {
        layers[layerName].show = !layers[layerName].show; // 레이어 가시성을 토글합니다.
    }
    button.style.color = button.style.color === 'gray' ? '' : 'gray'; // 버튼 색상을 업데이트합니다.
};

layerNames.forEach(layerName => {
    const button = document.createElement('button');
    button.textContent = layerName; // 버튼 텍스트는 레이어 이름입니다.
    button.onclick = () => toggleLayer(layerName, button);
    layerButtonsContainer.appendChild(button);
});
```
GeoServer 레이어의 가시성을 토글하는 버튼을 동적으로 생성합니다.

---

#### 10. 3D 타일 스타일링 적용
기능을 강조하거나 색 구성표를 적용하는 등 3D 타일의 모양을 변경합니다.
```javascript
const setStyle = () => {
    tileset.style = new Cesium.Cesium3DTileStyle({
        defines: {
            Height: "Number(${height})" // 스타일링을 위한 높이 속성을 정의합니다.
        },
        color: {
            conditions: [
                ["${Height} >= 100", "color('purple')"],
                ["${Height} >= 95", "color('pink')"],
                ["${Height} >= 80", "color('red')"],
                ["${Height} >= 70", "color('orange')"],
                ["${Height} >= 45", "color('yellow')"],
                ["${Height} >= 27", "color('lime')"],
                ["${Height} >= 7", "color('cyan')"],
                ["${Height} >= 1", "color('white')"],
                ["true", "color('lightgray')"]
            ]
        }
    });
};
```
높이 속성을 기반으로 3D 타일셋에 동적 스타일을 적용하여 고도에 따라 기능을 색상으로 구분합니다.

#### 11. 건물 외곽선 강조
건물 외곽선을 강조하는 스타일을 적용하여 시각화에서 구조물을 더 잘 보이게 합니다.
이것은 유용한 개선 사항이지만 완전히 선택 사항이며 핵심 기능에는 영향을 미치지 않습니다.

---

## IDE

### 1. Visual Studio Code

![](../../images/ko/vsCodeLiveExtension.png)
![](../../images/ko/vsCodeServer.png)

### 2. Intellij

![](../../images/ko/intellijServer.png)

## 결과

- 접속 후 초기 화면:

  ![](../../images/ko/result_init.png)

- 좌측 상단의 **[Bangkok]** 버튼을 눌러 방콕의 경관을 확인합니다

  ![](../../images/ko/result_bangkok.png)

- Toggle Layer 버튼을 클릭하여 레이어 표시를 제어합니다

- 확대하여 작업의 잘 렌더링된 결과를 확인합니다

  ![](../../images/ko/result_final.png)

<br/>

> ### ⚠️ 화면이 계속 자동으로 새로고침되는 경우
>
> 그래픽 카드나 RAM 메모리가 부족하면 Cesium이 자동으로 페이지를 재부팅합니다

<br/>

> ### 추가로 유의해야 할 사항:
>
> 지형은 곡선이지만 건물은 직사각형이기 때문에 때때로 건물과 지형 사이에 눈에 보이는 틈이 생길 수 있습니다.
> 이를 처리하기 위해 mago-3d-tiler에는 스커트(skirt) 옵션이 포함되어 있습니다.
> * 작동 방식:
>
> 건물의 중심이 먼저 지형과 정렬됩니다.
> 타일 생성 과정에서 스커트 옵션은 건물의 기단부를 특정 값만큼 아래로 확장합니다.
> 이렇게 하면 건물이 곡선 지형에 매끄럽게 연결된 것처럼 보입니다.
>
> * 기본값:
>
> 기본 스커트 값은 7미터이며, 이는 건물의 기단 깊이가 7미터 확장됨을 의미합니다.
> 이렇게 하면 건물과 지형 사이의 간격을 효과적으로 채울 수 있습니다.


<br/>

## 🎉 축하합니다! 🎉


