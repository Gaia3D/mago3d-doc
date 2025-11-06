# Open Data, Open Source, Open Standard: Quickly Build Your Digital Twin City with mago3D

## Workshop Overview

This workshop provides participants with the experience of **creating a digital twin city from scratch** by utilizing open data from the region where FOSS4G is held.

Participants will:
- **Collect open data** from multiple geospatial sources
- **Transform data** using open-source tools (**mago3DTiler**, **mago3DTerrainer**)
- **Experience the full workflow** of serving data according to **OGC (Open Geospatial Consortium) standards**

You will visualize city buildings and terrain in 3D, overlay road layers and aerial imagery to construct a realistic urban environment. Additionally, participants will transform and overlay point cloud data, and then **plant trees in the city**.

This entire process relies on **open data, open source, and open standards**, allowing participants to experience building a digital twin city from scratch on an unprepared PC.

---

## Learning Objectives

By the end of this workshop, participants will be able to:

1. Collect and download open geospatial data from the workshop region
2. Process and convert 3D building data using GDAL and mago3DTiler
3. Generate terrain models from DEM data using mago3DTerrainer
4. Transform point cloud data and visualize vegetation-based individual tree models
5. Serve geospatial data using OGC WMTS
6. Create interactive 3D web applications with CesiumJS
7. Build a complete digital twin city from scratch in 3 hours.

---

## Prerequisites

### Required Software
- **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- **Git** for cloning repositories
- **Python** (version 3.8 or higher)
- **Node.js** (version 14 or higher)
- **IDE**: Visual Studio Code or IntelliJ IDEA (recommended)
- **Web Browser**: Chrome, Firefox, or Edge (latest version)

### Required Access
- **Cesium ion access token**: Sign up for a free account at [cesium.com/ion](https://cesium.com/ion/) and obtain your access token

### Hardware Requirements
- **Minimum**: 8GB RAM, 20GB free disk space
- **Recommended**: 16GB+ RAM, 50GB+ free disk space, dedicated GPU
- Stable internet connection for downloading data

### Technical Knowledge
- Basic understanding of GIS concepts
- Familiarity with command-line tools
- Basic knowledge of Docker (helpful but not required)

---

## Workshop Structure

### Part 1: Data Collection (30 minutes)
Learn how to collect and download open geospatial data from various sources.

**Topics covered:**
- Setting up the development environment
- Downloading building footprints and vegetation distribution data from **Overture Maps**
- Acquiring DEM, road layers, aerial imagery, and point cloud data from **LINZ Data Service**

For reference, open data from around the world can be obtained from sources such as:
- Downloading Sentinel satellite imagery from **Copernicus Data Space Ecosystem**
- Obtaining elevation data from **NASA SRTM/ASTER DEM**

### Part 2: Data Processing (90 minutes)
Transform raw geospatial data into web-optimized 3D tiles and terrain.

**Topics covered:**
- Generating Quantized Mesh terrain using **mago3DTerrainer**
- Preprocessing building data with **GDAL/OGR**
- Converting 3D buildings to OGC 3DTiles using **mago3DTiler**
- Converting forest data to 3DTiles i3dm format using **mago3DTiler**
- Converting point cloud data (LAS/LAZ) to OGC 3DTiles using **mago3DTiler**

### Part 3: Visualization (45 minutes)
Build an interactive 3D web application to visualize your digital twin city.

**Topics covered:**
- Setting up Access Token and CesiumJS viewer
- Loading terrain (Quantized Mesh)
- Adding aerial imagery and road layers
- Loading building 3D Tiles
- Loading forest and point cloud 3D Tiles
- Viewing the final 3D digital twin city

### Part 4 (Optional): Hardware Acceleration (15 minutes)
Optimize data processing performance through GPU acceleration.

**Topics covered:**
- Checking graphics acceleration status in your browser
- Hands-on comparison of performance before and after enabling graphics acceleration

---

## Workshop Schedule

| Time | Section | Activity |
|------|---------|----------|
| 00:00 - 00:15 | Introduction | Workshop overview and environment setup |
| 00:15 - 00:45 | Data Collection | Download and organize geospatial data |
| 00:45 - 01:30 | Data Processing - Part 1 | GDAL preprocessing and building conversion |
| 01:30 - 02:00 | Data Processing - Part 2 | Terrain generation and OGC WMTS setup |
| 02:00 - 02:15 | Break | Coffee break |
| 02:15 - 03:00 | Visualization | Build 3D web application |
| 03:00 - 03:15 | Advanced Topics | Hardware acceleration (optional) |
| 03:15 - 03:30 | Q&A | Questions and wrap-up |

**Total Duration**: 3.5 hours

---

## Table of Contents

### [1. Data Collection Guide](guides/1_Resource_Guide_En.md)

#### Basic Setup
- Creating the workshop directory structure
- IDE preparation and configuration
- Docker installation and verification
- OGC WMTS service verification

#### Downloading Data
- Overture Maps building footprints
- Aerial imagery from open data sources
- NASA SRTM/ASTER DEM elevation data

---

### [2. Data Processing Guide](guides/2_Processing_Guide_En.md)

#### Data Preprocessing
- Processing Overture Maps building data
- Converting aerial imagery formats
- Preparing DEM/DSM elevation data

#### mago3D Tools
- **mago3DTiler**: Convert 3D data to 3D Tiles format
  - Supported formats: GeoJSON, Shapefile, IFC, OBJ, Collada, LAS/LAZ
  - Height extrusion and attribute mapping
  - CRS transformation and terrain draping
- **mago3DTerrainer**: Generate optimized terrain tiles
  - Quantized mesh generation from DEM
  - Multi-resolution terrain pyramid
  - Terrain lighting and slope analysis

#### OGC WMTS Configuration
- Setting up OGC WMTS service
- Configuring tile layers
- Publishing raster and vector layers via WMTS
- Layer preview and styling

---

### [3. Visualization Guide](guides/3_Visualization_Guide_En.md)

#### Building the 3D Application
- Sample code structure and setup
- Running the application in your IDE
- Understanding CesiumJS integration
- Adding custom interactions

#### Results
- Viewing the complete 3D digital twin
- Performance optimization tips
- Sharing and deployment options

---

### [Optional: Hardware Acceleration](guides/Hardware_Acceleration_En.md)

#### GPU-Accelerated Processing
- Docker GPU support configuration
- NVIDIA CUDA setup for Linux/Windows
- Performance benchmarks
- Troubleshooting common issues

---

## Dataset Information

This workshop uses **real-world open data from the FOSS4G host city/region**, including:
- Building footprints from Overture Maps
- Aerial imagery from open data sources
- Elevation data from NASA SRTM/ASTER
- Road network data
- Point cloud data for vegetation

**Target Region**: To be determined based on FOSS4G 2025 location

Sample datasets are provided in the [`dataset/`](dataset/) directory for participants who cannot download data during the workshop.

---

## Sample Code

Complete working examples are available in the [`src/`](src/) directory, including:
- HTML/JavaScript samples for CesiumJS integration
- Configuration files for mago3D platform
- GDAL processing scripts
- Docker Compose deployment examples

---

## Additional Resources

### Documentation
- [mago3D Introduction](../lang/en/1_mago3D_Introduction.md)
- [mago3D Installation Guide](../lang/en/2_mago3D_Installation_Guide.md)
- [mago3D User Guide](../lang/en/3_mago3D_User_Guide.md)
- [mago3D API Documentation](https://mdtp.gaia3d.com/doc/)

### Data Sources
- [Overture Maps](https://overturemaps.org/)
- [NASA Earthdata](https://earthdata.nasa.gov/)
- Open aerial imagery data sources

### Tools and Libraries
- [GDAL/OGR](https://gdal.org/)
- [OGC WMTS Standard](https://www.ogc.org/standard/wmts/)
- [CesiumJS](https://cesium.com/cesiumjs/)
- [Docker](https://www.docker.com/)

---

## Support and Contact

**Workshop Instructors:**
- TBD

**Technical Support:**
- GitHub Issues: [github.com/Gaia3D/mago3d-doc](https://github.com/Gaia3D/mago3d-doc)
- Official Website: [www.mago3d.com](http://www.mago3d.com/)

**Organization:**
- Gaia3D, Inc.

---

## License

This workshop material is provided under the Apache License 2.0.
mago3D platform is open-source software licensed under Apache License 2.0.

---

**Let's build amazing 3D digital twins together!**
