import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import {
  ImageryLayer,
  IonWorldImageryStyle,
  Viewer
} from "cesium";

// Constants for Point Cloud Styling
const INDIANA_LIDAR_PC_STYLE = [
  { id: 0, name: 'Default (No Classification)', color: 'rgb(26,26,26)', enabled: true },
  { id: 1, name: 'Unclassified', color: 'rgb(170,170,170)', enabled: false },
  { id: 2, name: 'Ground', color: 'rgb(170,85,0)', enabled: true },
  { id: 3, name: 'Low Vegetation', color: 'rgb(0,170,170)', enabled: true },
  { id: 4, name: 'Medium Vegetation', color: 'rgb(85,255,85)', enabled: true },
  { id: 5, name: 'High Vegetation', color: 'rgb(0,128,0)', enabled: true },
  { id: 6, name: 'Building', color: 'rgb(255,85,85)', enabled: true },
  { id: 7, name: 'Low Point (Noise)', color: 'rgb(170,0,0)', enabled: false },
  { id: 9, name: 'Water', color: 'rgb(0,0,191)', enabled: true },
  { id: 10, name: 'Rail', color: 'rgb(0,0,64)', enabled: true },
  { id: 11, name: 'Road Surface', color: 'rgb(80,80,80)', enabled: true },
  { id: 13, name: 'Wire Guard', color: 'rgb(0,0,8)', enabled: true },
  { id: 14, name: 'Wire Conductor', color: 'rgb(0,0,4)', enabled: true },
  { id: 15, name: 'Transmission Tower', color: 'rgb(255,255,0)', enabled: true },
  { id: 16, name: 'Wire Structure Connector', color: 'rgb(0,0,1)', enabled: true },
  { id: 17, name: 'Bridge Deck', color: 'rgb(0,0,0)', enabled: true },
  { id: 18, name: 'High Noise', color: 'rgb(100,100,100)', enabled: false }
];


// --- Initial Setup ---
// Add your Cesium ion access token.
Cesium.Ion.defaultAccessToken = 'YOUR_ACCESS_TOKEN';

// Initialize the Cesium Viewer.
const viewer = new Viewer("cesiumContainer", {
  infoBox: true,
});
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.enableLighting = true;

// Add the base imagery layer.
const mapLayer = ImageryLayer.fromWorldImagery({
  style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
});
viewer.imageryLayers.add(mapLayer);
const toolbar = document.getElementById("toolbar");

// --- Workshop Steps ---

// Step 1: Load Terrain Data
try {
  let purdueTerrainProvider;

  // Uncomment the line below to load the terrain data.

  purdueTerrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
      "/perdue/pre-made-output/terrain/"
  );
  viewer.terrainProvider = purdueTerrainProvider;

  // --- make button section ---
  const terrainButton = document.createElement("button");
  terrainButton.textContent = "Toggle Terrain";
  terrainButton.onclick = () => {
    if (viewer.terrainProvider === purdueTerrainProvider) {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    } else {
      viewer.terrainProvider = purdueTerrainProvider;
    }
  };
  toolbar.appendChild(terrainButton)

  // --- Code to visualize the terrain boundary (for reference) ---
  const originalBounds = [ -86.03777909739436,40.0306734475314, -86.00282579151833,40.05506456114478];
  const buffer = 0.005;
  const bufferedBounds = [
    originalBounds[0] - buffer, originalBounds[1] - buffer,
    originalBounds[2] + buffer, originalBounds[3] + buffer
  ];
  const rectangleCoordinates = Cesium.Cartesian3.fromDegreesArray([
    bufferedBounds[0], bufferedBounds[1], bufferedBounds[2], bufferedBounds[1],
    bufferedBounds[2], bufferedBounds[3], bufferedBounds[0], bufferedBounds[3],
    bufferedBounds[0], bufferedBounds[1]
  ]);
  viewer.entities.add({
    name: 'Terrain Bounds',
    polyline: {
      positions: rectangleCoordinates,
      width: 4,
      material: Cesium.Color.YELLOW.withAlpha(0.7),
      clampToGround: true
    }
  });

  viewer.camera.setView({
    destination : new Cesium.Rectangle.fromDegrees(originalBounds[0],originalBounds[1],originalBounds[2],originalBounds[3])
  });
  // --- End of boundary visualization code ---

} catch (e) {
  console.log(`Error loading terrain: ${e}`);
}


// Step 2: Load and Style the Buildings 3D Tileset
try {
  // Uncomment the code block below to load the building 3D tiles and apply a style.

  const tileset = await Cesium.Cesium3DTileset.fromUrl("/perdue/pre-made-output/tileset/buildings/tileset.json");
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["Number(${rel_height}) < 10", "color('lightgrey')"],
        ["Number(${rel_height}) < 20", "color('skyblue')"],
        ["Number(${rel_height}) < 30", "color('green')"],
        ["Number(${rel_height}) < 40", "color('yellow')"],
        ["Number(${rel_height}) < 50", "color('orange')"],
        ["Number(${rel_height}) < 60", "color('red')"],
        ["Number(${rel_height}) < 70", "color('purple')"],
        ["true", "color('pink')"]
      ]
    }
  });

  viewer.scene.primitives.add(tileset);

    const buildingButton = document.createElement("button");
  buildingButton.textContent = "Toggle Buildings";
  buildingButton.onclick = () => {
    tileset.show = !tileset.show;
  };
  toolbar.appendChild(buildingButton);


  viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
    duration: 3,
    offset : new Cesium.HeadingPitchRange( 0,  Cesium.Math.toRadians(-60), tileset.boundingSphere.radius * 1.5 )
  });

} catch (error) {
  console.log(`Error creating building tileset: ${error}`);
}


// Step 3: Load the Forest 3D Tileset
try {
  // Uncomment the code block below to load the forest 3D tiles.

  const forestTileset = await Cesium.Cesium3DTileset.fromUrl("/perdue/pre-made-output/tileset/forest/tileset.json");
  viewer.scene.primitives.add(forestTileset);

    const forestButton = document.createElement("button");
  forestButton.textContent = "Toggle Forest";
  forestButton.onclick = () => {
    forestTileset.show = !forestTileset.show;
  };
  toolbar.appendChild(forestButton);

} catch (error) {
  console.log(`Error creating forest tileset: ${error}`);
}


// Step 4: Load and Style the Point Cloud
try {
  // Uncomment the code block below to load the point cloud and apply a style.

  const pointTileset = await Cesium.Cesium3DTileset.fromUrl(
       '/perdue/pre-made-output/tileset/pointcloud/tileset.json',
       {
         maximumScreenSpaceError: 4,
         maximumMemoryUsage: 4096,
         classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
       }
   );

  const showConditions = INDIANA_LIDAR_PC_STYLE
      .filter(cls => !cls.enabled)
      .map(cls => `\${CLASSIFICATION} !== ${cls.id}`);

  showConditions.push('${CLASSIFICATION} < 18');

  const colorConditions = INDIANA_LIDAR_PC_STYLE
      .filter(cls => cls.enabled)
      .map(cls => [`\${CLASSIFICATION} === ${cls.id}`, `color('${cls.color}')`]);

  colorConditions.push(['true', "color('white')"]);

  const style = new Cesium.Cesium3DTileStyle({
    show: showConditions.join(' && '),
    color: {
      conditions: colorConditions
    },
    pointSize: 1.5
  });

  pointTileset.style = style;
  viewer.scene.primitives.add(pointTileset);

    const pcButton = document.createElement("button");
  pcButton.textContent = "Toggle Point Cloud";
  pcButton.onclick = () => {
    pointTileset.show = !pointTileset.show;
  };
  toolbar.appendChild(pcButton);


} catch (e) {
  console.log(`Error loading point cloud: ${e}`);
}


// --- Utility Functions ---

// Log coordinate and camera info to the console on mouse click
function onClickGet4326() {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(async function (input) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartesian = viewer.camera.pickEllipsoid(input.position, ellipsoid);
    if (!cartesian) return;

    let carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    let lon = Cesium.Math.toDegrees(carto.longitude);
    let lat = Cesium.Math.toDegrees(carto.latitude);
    let TerrainHgt = await getTerrainHeight(lon, lat);
    let heading = Cesium.Math.toDegrees(viewer.camera.heading);
    let pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
    let roll = Cesium.Math.toDegrees(viewer.camera.roll);

    console.log('--- Click Location Info ---');
    console.log('Longitude:', lon);
    console.log('Latitude:', lat);
    console.log('Terrain Height:', TerrainHgt);
    console.log('Camera Heading:', heading);
    console.log('Camera Pitch:', pitch);
    console.log('Camera Roll:', roll);

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// Async function to get the terrain height at a specific longitude and latitude
async function getTerrainHeight(lon, lat) {
  let cartoLoc = new Cesium.Cartographic.fromDegrees(lon, lat);
  try {
    // Check if the terrainProvider is loaded and available
    if (!viewer.terrainProvider || !viewer.terrainProvider.availability) {
      console.log("Terrain data is not loaded yet.");
      return 0;
    }
    const updatedLocation = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartoLoc]);
    return updatedLocation[0].height;
  } catch (error) {
    console.error("Error sampling terrain height:", error);
    return 0;
  }
}

onClickGet4326();