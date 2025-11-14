import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import {
  ImageryLayer,
  IonWorldImageryStyle,
  Viewer
} from "cesium";

// Temporary Cesium Ion token for workshop access (see /guides/3_CesiumToken_Guide.md for details)
const CESIUM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZGYxNGE0ZS0yYTIwLTRkMDktOGQ5ZS0zYmFkOTNlNjlkNDQiLCJpZCI6MjQ2MzU5LCJpYXQiOjE3NjAzNDIwNzd9.5Dkwz6dO3KNyF7HUUlZdErWPolkYaL1swEA-2dTOWdQ"
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

// Create Cesium Viewer and set basic options
const viewer = new Viewer("cesiumContainer", {
  infoBox: true, // Enable info box on click
});

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.enableLighting = true;

// Boundary of the area of interest near Auckland, New Zealand [west, south, east, north]
const originalBounds = [174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130];

// Polyline coordinates
const rectanglePositions = Cesium.Cartesian3.fromDegreesArray([
  originalBounds[0], originalBounds[1],
  originalBounds[2], originalBounds[1],
  originalBounds[2], originalBounds[3],
  originalBounds[0], originalBounds[3],
  originalBounds[0], originalBounds[1]
]);

// Add yellow polyline
viewer.entities.add({
  name: 'Yellow Bounds',
  polyline: {
    positions: rectanglePositions,
    width: 4,
    material: Cesium.Color.YELLOW,
    clampToGround: true
  }
});

// Move camera to the area of interest
viewer.camera.setView({
  destination : new Cesium.Rectangle.fromDegrees(originalBounds[0],originalBounds[1],originalBounds[2],originalBounds[3])
});

const toolbar = document.getElementById("toolbar");

// ============================================
// STEP 1: Load terrain data
// ============================================
try {

  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 1] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // Load terrain converted with Mago3D using Cesium Terrain Provider
  const workshopTerrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
      "/output/terrain/"  // Local path containing terrain data
  );

  // Apply terrain data to the viewer
  viewer.terrainProvider = workshopTerrainProvider;

  // Create terrain toggle button
  const terrainButton = document.createElement("button");
  terrainButton.textContent = "Toggle Terrain";
  terrainButton.onclick = () => {
    // Switch between terrain and flat ellipsoid
    if (viewer.terrainProvider === workshopTerrainProvider) {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    } else {
      viewer.terrainProvider = workshopTerrainProvider;
    }
  };
  toolbar.appendChild(terrainButton)

❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 1] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

} catch (e) {
  console.log(`Error loading terrain: ${e}`);
}

// ============================================
// STEP 2: Load building 3D tileset and apply height-based styling
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 2] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Load building 3D tileset converted with Mago3D
  const tileset = await Cesium.Cesium3DTileset.fromUrl("/output/tileset/buildings/tileset.json");

  // Apply color style based on building height
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["Number(${height}) < 10", "color('lightgrey')"],   // <10m: light gray
        ["Number(${height}) < 20", "color('skyblue')"],     // 10–20m: sky blue
        ["Number(${height}) < 30", "color('green')"],       // 20–30m: green
        ["Number(${height}) < 40", "color('yellow')"],      // 30–40m: yellow
        ["Number(${height}) < 50", "color('orange')"],      // 40–50m: orange
        ["Number(${height}) < 60", "color('red')"],         // 50–60m: red
        ["Number(${height}) < 70", "color('purple')"],      // 60–70m: purple
        ["true", "color('pink')"]                           // ≥70m: pink
      ]
    }
  });

  // Add building tileset to scene
  viewer.scene.primitives.add(tileset);

  // Create building toggle button
  const buildingButton = document.createElement("button");
  buildingButton.textContent = "Toggle Buildings";
  buildingButton.onclick = () => {
    tileset.show = !tileset.show;
  };
  toolbar.appendChild(buildingButton);

  ❌ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [STEP 2] UNCOMMENT THIS BLOCK ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

  // Move camera to the building tileset
  viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
    duration: 3,
    offset : new Cesium.HeadingPitchRange( 0,  Cesium.Math.toRadians(-60), tileset.boundingSphere.radius * 1.5 )
  });


} catch (error) {
  console.log(`Error creating building tileset: ${error}`);
}

// ============================================
// STEP 3: Load forest 3D tileset
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 3] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Load forest 3D tileset converted with Mago3D
  const forestTileset = await Cesium.Cesium3DTileset.fromUrl("/output/tileset/forest/tileset.json");

  // Add forest tileset to scene
  viewer.scene.primitives.add(forestTileset);

  // Create forest toggle button
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
// STEP 4: Load Point Cloud and Apply Classification-based Styling
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 4] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Load point cloud tileset (LiDAR data)
  const pointTileset = await Cesium.Cesium3DTileset.fromUrl(
    '/output/tileset/pointcloud/tileset.json',
    {
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    }
  );

  // Define ASPRS classification color & visibility mappings
  // https://user-images.githubusercontent.com/11743012/48382415-e61d5e00-e695-11e8-8841-228dd96732c4.png
  const ASPRS_STYLE = [
    { id: 0, name: 'Default (No Classification)', color: 'rgb(26,26,26)', enabled: true },
    { id: 1, name: 'Unclassified', color: 'rgb(170,170,170)', enabled: false },
    { id: 2, name: 'Ground', color: 'rgb(170,85,0)', enabled: true },             // Ground: brown
    { id: 3, name: 'Low Vegetation', color: 'rgb(0,170,170)', enabled: true },    // Low vegetation: cyan
    { id: 4, name: 'Medium Vegetation', color: 'rgb(85,255,85)', enabled: true }, // Medium vegetation: light green
    { id: 5, name: 'High Vegetation', color: 'rgb(0,128,0)', enabled: true },     // High vegetation: green
    { id: 6, name: 'Building', color: 'rgb(255,85,85)', enabled: true },          // Building: light red
    { id: 7, name: 'Low Point (Noise)', color: 'rgb(170,0,0)', enabled: false },  // Noise: hidden
    { id: 9, name: 'Water', color: 'rgb(0,0,191)', enabled: true },               // Water: blue
    { id: 10, name: 'Rail', color: 'rgb(0,0,64)', enabled: true },                // Rail: dark blue
    { id: 11, name: 'Road Surface', color: 'rgb(80,80,80)', enabled: true },      // Road: gray
    { id: 13, name: 'Wire Guard', color: 'rgb(0,0,8)', enabled: true },
    { id: 14, name: 'Wire Conductor', color: 'rgb(0,0,4)', enabled: true },
    { id: 15, name: 'Transmission Tower', color: 'rgb(255,255,0)', enabled: true }, // Tower: yellow
    { id: 16, name: 'Wire Structure Connector', color: 'rgb(0,0,1)', enabled: true },
    { id: 17, name: 'Bridge Deck', color: 'rgb(0,0,0)', enabled: true },         // Bridge: black
    { id: 18, name: 'High Noise', color: 'rgb(100,100,100)', enabled: false }    // High noise: hidden
  ];

  // Build show conditions for disabled classifications
  const showConditions = ASPRS_STYLE
    .filter(cls => !cls.enabled)
    .map(cls => `\${CLASSIFICATION} !== ${cls.id}`);

  // Always hide classifications above 18
  showConditions.push('${CLASSIFICATION} < 18');

  // Build color conditions for enabled classifications
  const colorConditions = ASPRS_STYLE
    .filter(cls => cls.enabled)
    .map(cls => [`\${CLASSIFICATION} === ${cls.id}`, `color('${cls.color}')`]);

  // Default fallback color
  colorConditions.push(['true', "color('white')"]);

  // Apply 3D tile style
  const style = new Cesium.Cesium3DTileStyle({
    show: showConditions.join(' && '),
    color: {
      conditions: colorConditions
    },
    pointSize: 3 // Point size
  });

  pointTileset.style = style;
  viewer.scene.primitives.add(pointTileset);

  // Create point cloud on/off toggle button
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

// API key for accessing Koordinates WMTS tile service
const KOORDINATES_KEY = "526914358e004b599d6ba581e1617740";

// ============================================
// STEP 5: Add WMTS Aerial Imagery Layer
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 5] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Configure Koordinates WMTS aerial imagery tile service
  const koordinatesWMTS = new Cesium.UrlTemplateImageryProvider({
    url: `https://tiles-cdn.koordinates.com/services;key=${KOORDINATES_KEY}/tiles/v4/layer=121752/EPSG:3857/{z}/{x}/{y}.png`,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 0,   // Minimum zoom level
    maximumLevel: 21,  // Maximum zoom level
    credit: 'Koordinates'  // Credits
  });

  // Add aerial imagery layer to viewer
  const koordinatesLayer = viewer.imageryLayers.addImageryProvider(koordinatesWMTS);

  const toolbar = document.getElementById("toolbar");

  // Create aerial layer toggle button
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
// STEP 6: Add WMTS Road Layer
// ============================================
try {
  /* ❌ ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [STEP 6] UNCOMMENT THIS BLOCK ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼

  // Configure Koordinates WMTS road tile service (red overlay)
  const koordinatesWMTS = new Cesium.UrlTemplateImageryProvider({
    url: `https://tiles-cdn.koordinates.com/services;key=${KOORDINATES_KEY}/tiles/v4/layer=53378.431413,color=ff0000/{z}/{x}/{y}.png`,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),  // Web Mercator (EPSG:3857)
    minimumLevel: 0,   // Minimum zoom level
    maximumLevel: 21,  // Maximum zoom level
    credit: 'Koordinates'  // Credits
  });

  // Add road layer to viewer
  const koordinatesLayer = viewer.imageryLayers.addImageryProvider(koordinatesWMTS);

  const toolbar = document.getElementById("toolbar");

  // Create road layer toggle button
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