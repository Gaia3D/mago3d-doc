# FOSS4G 2025 Workshop Script - Data Processing Guide
## 데이터 처리 가이드 발표 스크립트 (1시간)

**Total Duration: 60 minutes**
**총 소요 시간: 60분**

---

## Opening & Introduction (5 minutes / 5분)

### **[SLIDE: Data Processing Overview]**

안녕하세요! 이제 데이터 처리 섹션을 시작하겠습니다.
Hello! Now we'll start the data processing section.

이번 섹션을 진행할 가이아쓰리디에 정연화입니다. 저는 백엔드 웹 개발자입니다. 편하게 루비라고 불러주시기 바랍니다.
I'm Jeong Yeonhwa from Gaia3D, and I'm a backend web developer. Please feel free to call me Ruby.

이 세션은 약 1시간 정도 소요될 예정입니다.
This session will take about one hour.

세션을 진행하다가 3시에 30분 휴식 시간을 가질 예정입니다.
We'll take a 30-minute break at 3 o'clock while proceeding with the session.

앞서 수집한 원시 데이터를 웹에 최적화된 3D 콘텐츠로 변환하는 과정을 함께 진행하겠습니다.
We'll go through the process of converting the raw data we collected earlier into web-optimized 3D content.

### **[SLIDE: What We'll Cover Today]**

오늘 다룰 내용은 크게 세 부분으로 나뉩니다.
Today's content has three main parts.

첫째, GDAL을 사용한 데이터 전처리입니다.
First, data preprocessing using GDAL.

둘째, mago3DTerrainer를 사용한 지형 생성입니다.
Second, terrain generation using mago3DTerrainer.

셋째, mago3DTiler를 사용한 3D Tiles 변환입니다.
Third, 3D Tiles conversion using mago3DTiler.

각 단계마다 실습 시간을 충분히 드릴 예정이니 천천히 따라오시면 됩니다.
We'll give enough hands-on time for each step, so please follow along at your own pace.

### **[SLIDE: Prerequisites Check]**

시작하기 전에 다음 사항을 확인해주세요.
Before we start, please check the following items.

Docker Desktop이 설치되어 실행 중인지 확인하세요.
Make sure Docker Desktop is installed and running.

원본 데이터가 foss4g-2025/public 디렉토리에 있는지 확인하세요.
Check that your source data is in the foss4g-2025/public directory.

충분한 디스크 공간이 있는지 확인하세요. 약 2-4 GB가 필요합니다.
Make sure you have enough disk space. You'll need about 2 to 4 GB.

**[Confirmation / 확인]**

혹시 아직 데이터 다운로드가 완료되지 않으신 분 계신가요?
Is anyone still downloading data?

다운로드에 문제가 있으시면 `public/raw`의 샘플 데이터를 사용하시면 됩니다.
If you have trouble downloading, you can use the sample data in `public/raw`.

모두 준비되셨나요? 그럼 시작하겠습니다!
Is everyone ready? Let's begin!

---

### **[SLIDE: Data Preparation]**

화면에 표를 봐주시기 바랍니다.
Please look at the table on the screen.

이 표는 우리가 오늘 처리할 데이터 유형과 각 데이터에 사용할 도구를 요약한 것입니다.
This table summarizes the types of data we'll process today and the tools we'll use for each.

---

## Part 1: Data Preprocessing with GDAL (20 minutes / 20분)

### **[SLIDE: Data Preprocessing Overview]**

자, 이제 본격적으로 데이터 전처리를 시작하겠습니다.
Okay, now let's start data preprocessing.

GDAL은 지리공간 데이터를 처리하는 가장 강력한 오픈소스 도구 중 하나입니다.
GDAL is one of the most powerful open-source tools for processing geospatial data.

우리는 GDAL을 사용하여 건물 데이터와 산림 데이터를 전처리할 것입니다.
We'll use GDAL to preprocess building data and forest data.

### **1.1 Building Data Preprocessing (10 minutes / 10분)**

### **[SLIDE: Building Data Overview]**

먼저 Overture Maps에서 다운로드한 건물 데이터를 살펴보겠습니다.
First, let's look at the building data we downloaded from Overture Maps.

### **[SLIDE: Building Attributes]**

건물 데이터에는 두 가지 중요한 속성이 있습니다.
The building data has two important attributes.

하나는 height입니다. 이것은 건물의 실제 높이를 미터 단위로 나타냅니다.
One is "height". This shows the actual building height in meters.

다른 하나는 num_floors입니다. 이것은 건물의 층수를 나타냅니다.
The other is "num_floors". This shows the number of floors in the building.

### **[SLIDE: Conversion Logic]**

건물의 3D 모델을 만들기 위해서는 높이 정보가 필수적입니다.
Height information is essential for creating 3D models of buildings.

하지만 모든 건물에 높이 정보가 있는 것은 아닙니다.
But not all buildings have height information.

그래서 우리는 다음과 같은 로직을 사용합니다.
So we use the following logic.

첫째, height 값이 있으면 그 값을 사용합니다.
First, if there's a height value, we use that value.

둘째, height가 없고 num_floors가 있으면, num_floors에 3.3을 곱합니다.
Second, if there's no height but there's num_floors, we multiply num_floors by 3.3.

이것은 평균 층고가 3.3미터라고 가정한 것입니다.
This assumes an average floor height of 3.3 meters.

셋째, 둘 다 없으면 기본값 3.3미터를 할당합니다.
Third, if we have neither, we assign a default value of 3.3 meters.

### **[SLIDE: GDAL Command]**

이제 실제 명령어를 실행해보겠습니다.
Now let's run the actual command.

명령어가 길기 때문에 천천히 따라오세요.
The command is long, so please follow along carefully.

환경에 적절한 명령어를 사용하세요.
Use the command appropriate for your environment.

YOUR_PROJECT_ROOT_DIR을 여러분의 실제 프로젝트 경로로 바꿔주세요.
Please replace YOUR_PROJECT_ROOT_DIR with your actual project path.

### **[SLIDE: Command Explanation]**

이 명령어가 하는 일을 간단히 설명드리겠습니다.
Let me briefly explain what this command does.

docker run --rm은 Docker 컨테이너를 실행하고 완료 후 자동으로 제거합니다.
"docker run --rm" runs a Docker container and removes it automatically after completion.

-v 옵션은 호스트 디렉토리를 컨테이너에 마운트합니다.
The "-v" option mounts your host directory to the container.

반드시 절대 경로를 사용해야 합니다.
You must use an absolute path.

ogr2ogr은 벡터 데이터 변환 도구입니다.
"ogr2ogr" is a vector data conversion tool.

-f "GeoJSON"은 출력 형식을 GeoJSON으로 지정합니다.
"-f GeoJSON" specifies the output format as GeoJSON.

**[Hands-on Time / 실습 시간 - 3 minutes / 3분]**

이제 명령어를 실행해주세요.
Now please run the command.

첫 실행 시 Docker 이미지를 다운로드하는데 1-2분 정도 걸릴 수 있습니다.
On first run, downloading the Docker image may take 1-2 minutes.

**[Confirmation / 확인]**

모두 파일이 생성되셨나요?
Has everyone created the file?

`public` 폴더 안에 auckland_building.geojson 파일이 보이시나요?
Can you see the auckland_building.geojson file in the `public` folder?

혹시 에러가 발생하신 분 계신가요?
Is anyone getting errors?

### **1.2 Forest Data Preprocessing (10 minutes / 10분)**

### **[SLIDE: Forest Data Overview]**

이제 산림을 만들기 위한 데이터를 처리하겠습니다.
Now we'll process data to create forests.

Overture Maps의 토지 이용 데이터에서 산림 영역만 추출할 것입니다.
We'll extract only forest areas from Overture Maps land use data.

### **[SLIDE: Forest Attributes]**

토지 이용 데이터에는 subtype과 class라는 속성이 있습니다.
The land use data has attributes called "subtype" and "class".

우리는 이 속성들을 사용하여 공원과 잔디 지역을 필터링할 것입니다.
We'll use these attributes to filter park and grass areas.

왜 공원과 잔디 지역을 선택하냐구요?
Why are we choosing parks and grass areas?

이 지역들에 나무를 심어서 산림을 만들 것이기 때문입니다.
Because we'll plant trees in these areas to create forests.

### **[SLIDE: Forest Conversion Command]**

환경에 맞는 명령어를 사용하시고 YOUR_PROJECT_ROOT_DIR을 실제 경로로 바꿔주세요.
Please use the command appropriate for your environment and replace YOUR_PROJECT_ROOT_DIR with your actual path.

이번에는 GeoPackage 형식으로 변환하겠습니다.
This time we'll convert to GeoPackage format.

mago3DTiler는 GeoPackage, GeoJSON, Shapefile 등 다양한 형식을 지원합니다.
mago3DTiler supports various formats like GeoPackage, GeoJSON, and Shapefile.

따라서, 원하시는 형식으로 지정하여 저장하시면 됩니다.
So you can specify and save in your desired format.

여기서 중요한 부분은 "20 AS height"입니다.
The important part here is "20 AS height".

이것은 나무의 높이를 20미터로 설정한다는 의미입니다.
This means we're setting the tree height to 20 meters.

이 값은 나중에 원하는 나무 높이로 조정할 수 있습니다.
You can adjust this value to your desired tree height later.

여기서 height라는 값은 원하시는 값으로 변경하셔도 됩니다. 추후에 mago3DTiler에서 **scaleColumn**에 지정하여 사용하게 됩니다.
You can change this height value to whatever you want. Later, it will be used in mago3DTiler by specifying it in the **scaleColumn**.

**[Hands-on Time / 실습 시간 - 2 minutes / 2분]**

명령어를 실행하시고 처리가 완료될 때까지 기다려주세요.
Please run the command and wait for processing to complete.

**[Confirmation / 확인]**

`public` 폴더 안에 auckland_forest.gpkg 파일이 생성되었나요?
Has the auckland_forest.gpkg file been created in the `public` folder?

여기까지 모두 잘 따라오셨나요?
Has everyone followed along well so far?

이제 GDAL 전처리는 완료되었습니다.
Now we've completed GDAL preprocessing.

잠깐 쉬는 시간을 가지면서 각자 데이터를 확인해보시기 바랍니다.
Let's take a short break and check your data.

---

## Part 2: Terrain Generation with mago3DTerrainer (15 minutes / 15분)

### **[SLIDE: mago3DTerrainer Introduction]**

좋습니다. 이제 가장 흥미로운 부분을 시작하겠습니다.
Good. Now let's start the most interesting part.

먼저 mago3DTerrainer를 사용하여 지형을 생성하겠습니다.
First, we'll generate terrain using mago3DTerrainer.

mago3DTerrainer는 DEM 데이터를 웹 스트리밍에 최적화된 Quantized Mesh 형식으로 변환하는 도구입니다.
mago3DTerrainer is a tool that converts DEM data into Quantized Mesh format optimized for web streaming.

### **[SLIDE: What is Quantized Mesh?]**

잠깐 Quantized Mesh가 무엇인지 설명드리겠습니다.
Let me briefly explain what Quantized Mesh is.

Quantized Mesh는 Cesium에서 개발한 지형 타일 형식입니다.
Quantized Mesh is a terrain tile format developed by Cesium.

이 형식의 장점을 몇 가지 말씀드리겠습니다.
Let me tell you about some advantages of this format.

첫째, 파일 크기가 매우 작습니다.
First, the file sizes are very small.

좌표를 압축하여 저장하기 때문입니다.
This is because coordinates are stored in compressed form.

둘째, 계층적 LOD 구조를 지원합니다.
Second, it supports a hierarchical LOD structure.

LOD는 Level of Detail의 약자입니다.
LOD stands for Level of Detail.

이것은 효율적인 스트리밍을 가능하게 합니다.
This enables efficient streaming.

셋째, 법선 벡터를 포함하여 사실적인 조명 효과를 구현할 수 있습니다.
Third, it includes normal vectors for realistic lighting effects.

### **[SLIDE: Terrain Generation Command]**

mago3DTerrainer는 Docker 이미지로 제공되므로 설치가 매우 간단합니다.
mago3DTerrainer is provided as a Docker image, so installation is very simple.

다음 명령어를 실행하세요.
Please run the following command.

### **[SLIDE: Command Options Explained]**

각 옵션의 의미를 설명드리겠습니다.
Let me explain what each option means.

--input은 입력 DEM 파일 경로입니다.
"--input" is the input DEM file path.

--output은 출력 타일셋이 저장될 폴더입니다.
"--output" is the folder where the output tileset will be saved.

--calculateNormals는 조명 효과를 위한 법선 벡터를 계산합니다.
"--calculateNormals" calculates normal vectors for lighting effects.

이 옵션을 추가하면 지형에 더 사실적인 조명 효과를 줄 수 있습니다.
Adding this option gives the terrain more realistic lighting effects.

--minDepth 0은 최소 타일 깊이입니다.
"--minDepth 0" is the minimum tile depth.

--maxDepth 17은 최대 타일 깊이입니다.
"--maxDepth 17" is the maximum tile depth.

숫자가 클수록 더 상세한 지형을 만들 수 있습니다.
Higher numbers create more detailed terrain.

하지만 처리 시간도 더 오래 걸립니다.
But processing time also takes longer.

**[Hands-on Time / 실습 시간 - 5 minutes / 5분]**

명령어를 실행하시고 처리가 진행되는 것을 지켜봐주세요.
Please run the command and watch the processing proceed.

처리 시간은 DEM 파일의 크기에 따라 다릅니다.
Processing time varies depending on the DEM file size.

보통 1-2분 정도 소요됩니다.
It usually takes about 1-2 minutes.

터미널에 진행 상황이 표시될 것입니다.
Progress will be displayed in the terminal.

### **[While Processing / 처리 중 설명]**

처리가 진행되는 동안 추가 옵션 및 출력 구조에 대해 설명드리겠습니다.
While processing proceeds, let me explain additional options and output structure.

다음 명령어를 실행하면 mago3DTerrainer의 모든 옵션을 볼 수 있습니다.
You can see all options of mago3DTerrainer by running the following command.

```shell
docker run --rm gaia3d/mago-3d-terrainer --help
```

추가 옵션에 대해 궁금하신 분들은 나중에 확인해보시기 바랍니다.
If you're curious about additional options, please check them later.

처리가 완료되면 terrain 폴더 안에 여러 하위 폴더가 생성됩니다.
When processing is complete, several subfolders will be created in the terrain folder.

0, 1, 2... 17까지의 폴더들이 생성됩니다.
Folders numbered 0, 1, 2... up to 17 will be created.

각 폴더는 하나의 LOD 레벨을 나타냅니다.
Each folder represents one LOD level.

layer.json 파일도 생성됩니다.
A layer.json file will also be created.

이 파일이 전체 타일셋의 메타데이터를 담고 있습니다.
This file contains metadata for the entire tileset.

**[Confirmation / 확인]**

처리가 완료되셨나요?
Has processing completed?

terrain 폴더가 생성되었고 안에 여러 숫자 폴더들이 있나요?
Has the terrain folder been created with several numbered folders inside?

layer.json 파일이 보이시나요?
Can you see the layer.json file?

좋습니다! 지형 생성이 완료되었습니다.
Great! Terrain generation is complete.

---

## Part 3: 3D Tiles Conversion with mago3DTiler (25 minutes / 25분)

### **[SLIDE: mago3DTiler Introduction]**

이제 mago3DTiler를 사용할 차례입니다.
Now it's time to use mago3DTiler.

mago3DTiler는 다양한 3D 데이터를 OGC 3D Tiles 형식으로 변환하는 강력한 도구입니다.
mago3DTiler is a powerful tool that converts various 3D data into OGC 3D Tiles format.

오늘은 세 가지 유형의 데이터를 변환하겠습니다.
Today we'll convert three types of data.

건물, 산림, 포인트 클라우드입니다.
The buildings, forests, and point clouds.

### **3.1 Building 3D Tiles Generation (8 minutes / 8분)**

### **[SLIDE: Building 3D Tiles]**

먼저 건물부터 시작하겠습니다.
Let's start with buildings first.

우리는 2D 건물 footprint의 높이 속성을 사용하여 3D 건물로 돌출시킬 것입니다.
We will extrude 2D building footprints into 3D buildings using height attributes.

다음 명령어를 실행하세요.
Please run the following command.

### **[SLIDE: Building Command Options]**

중요한 옵션들을 설명하겠습니다.
Let me explain the important options.

--inputType geojson은 입력 파일 형식이 GeoJSON임을 지정합니다.
"--inputType geojson" specifies that the input file format is GeoJSON.

--crs 4326은 좌표 참조 시스템을 지정합니다.
"--crs 4326" specifies the coordinate reference system.

4326은 WGS84의 EPSG 코드를 의미합니다.
4326 means the EPSG code for WGS84.

--heightColumn height는 높이 정보가 들어있는 컬럼을 지정합니다.
"--heightColumn height" specifies the column containing height information.

이것이 가장 중요한 옵션입니다.
This is the most important option.

이 옵션 덕분에 2D 폴리곤이 3D 건물로 변환됩니다.
Thanks to this option, 2D polygons are converted into 3D buildings.

--minHeightColumn 옵션은 건물의 높이 속성에 값이 없는 경우 기본값을 지정합니다.
"--minHeightColumn" option specifies a default value if the building height attribute has no value.

terrain 옵션은 건물을 extrude 할 때 베이스가 되는 높이를 참조할 DEM 파일 경로를 지정합니다.
The "terrain" option specifies the DEM file path that serves as the base height when extruding buildings.

**[Hands-on Time / 실습 시간 - 4 minutes / 4분]**

명령어를 실행하고 처리를 기다려주세요.
Please run the command and wait for processing.

건물 데이터의 양에 따라 5-10분 정도 소요될 수 있습니다.
Depending on the amount of building data, it may take about 5-10 minutes.

### **[While Processing / 처리 중 설명]**

처리가 진행되는 동안 3D Tiles 형식에 대해 설명드리겠습니다.
While processing proceeds, let me explain the 3D Tiles format.

3D Tiles는 OGC의 공식 표준입니다.
3D Tiles is an official OGC standard.

OGC는 Open Geospatial Consortium의 약자입니다.
OGC stands for Open Geospatial Consortium.

이 형식의 핵심 특징은 HLOD입니다.
The core feature of this format is HLOD.

HLOD는 Hierarchical Level of Detail의 약자입니다.
HLOD stands for Hierarchical Level of Detail.

데이터가 계층적 트리 구조로 조직됩니다.
Data is organized in a hierarchical tree structure.

시점에 따라 적절한 상세도의 데이터만 로드됩니다.
Only appropriately detailed data is loaded based on the viewpoint.

이를 통해 수백만 개의 건물도 웹에서 부드럽게 렌더링할 수 있습니다.
This allows even millions of buildings to render smoothly on the web.

다음 명령어를 실행하면 mago3DTiler의 모든 옵션을 볼 수 있습니다.
You can see all options of mago3DTiler by running the following command.

```shell
docker run --rm gaia3d/mago-3d-tiler --help
```

옵션에 대해 궁금하신 분들은 나중에 확인해보시기 바랍니다.
Please check them later if you're curious about the options.

옵션 중에서 `skirtHeight` 옵션에 대해서 설명드리겠습니다.
Among the options, let me explain the `skirtHeight` option.

이 옵션은 지형과 건물 사이의 틈을 메우기 위해 사용됩니다.
This option is used to fill gaps between terrain and buildings.

이해를 돕기 위해 그림을 살펴보도록 하겠습니다.
Let's look at a diagram to help understand.

### **[SLIDE: Skirt Height Explanation]**

건물과 지형 사이에 틈이 있을 수 있습니다.
There can be gaps between buildings and terrain.

이 틈은 건물이 떠 있는 것처럼 보이게 만듭니다.
These gaps make buildings appear to be floating.

skirtHeight 옵션은 이 틈을 메우기 위해 건물 바닥에 추가 높이를 아래로 더합니다.
The skirtHeight option adds extra height downward at the building base to fill these gaps.

이 옵션이 없으면 기본적을 4m의 skirt가 추가됩니다.
Without this option, a default skirt of 4m is added.

**[Confirmation / 확인]**

처리가 완료되었나요?
Has processing completed?

output/tileset/building 폴더가 생성되었나요?
Has the output/tileset/building folder been created?

tileset.json 파일과 data 폴더가 보이시나요?
Can you see the tileset.json file and data folder?

### **3.2 Forest 3D Tiles Generation (8 minutes / 8분)**

### **[SLIDE: Forest 3D Tiles - Instanced Models]**

이제 정말 흥미로운 부분입니다!
Now for a fascinating part!

산림을 만들어보겠습니다!
Let's create a forest!

산림은 i3dm 형식을 사용합니다.
Forests use the i3dm format.

i3dm은 Instanced 3D Model의 약자입니다.
i3dm stands for Instanced 3D Model.

이 형식은 동일한 3D 모델을 여러 위치에 효율적으로 배치할 수 있게 해줍니다.
This format allows efficient placement of the same 3D model in multiple locations.

예를 들어, 하나의 나무 모델을 수천 번 재사용할 수 있습니다.
For example, one tree model can be reused thousands of times.

### **[SLIDE: Tree Model]**

먼저 나무 3D 모델이 필요합니다.
First, we need a tree 3D model.

워크샵 자료에는 `mix-tree-1m.glb` 파일이 포함되어 있습니다.
The workshop materials include an `mix-tree-1m.glb` file.

이것은 GLB 형식의 간단한 나무 모델입니다.
This is a simple tree model in GLB format.

실제 프로젝트에서는 더 복잡하고 사실적인 모델을 사용할 수 있습니다.
In real projects, you can use more complex and realistic models.

### **[SLIDE: Forest Generation Command]**

다음 명령어로 산림을 생성합니다.
Create the forest with the following command.

### **[SLIDE: Forest Command Options]**

새로운 옵션들을 설명하겠습니다.
Let me explain the new options.

--scaleColumn height는 나무 인스턴스의 높이 속성을 지정합니다.
"--scaleColumn height" specifies the height attribute for tree instances.

--outputType i3dm은 인스턴스 타일 형식으로 출력합니다.
"--outputType i3dm" outputs in instance tile format.

--instance는 반복 배치할 GLB 모델 파일을 지정합니다.
"--instance" specifies the GLB model file to place repeatedly.

--terrain은 나무를 지형에 맞춰 배치하기 위한 DEM 파일입니다.
"--terrain" is the DEM file for placing trees on the terrain.

--tilesVersion 1.0은 3D Tiles 버전을 지정합니다.
"--tilesVersion 1.0" specifies the 3D Tiles version.

최신 타일 버전에서 i3dm을 호출하는 방식에 장점이 없기 때문에 1.0 버전을 사용합니다.
We use version 1.0 because there are no advantages in calling i3dm in the latest tile version.

**[Hands-on Time / 실습 시간 - 3 minutes / 3분]**

명령어를 실행해주세요.
Please run the command.

이 처리는 비교적 빠릅니다. 1-2분 정도면 완료됩니다.
This processing is relatively fast. It completes in about 1-2 minutes.

**[Confirmation / 확인]**

output/tileset/forest 폴더가 생성되었나요?
Has the output/tileset/forest folder been created?

.i3dm 확장자를 가진 파일들이 생성되어 있나요?
Have files with .i3dm extension been created?

### **3.3 Point Cloud 3D Tiles Generation (9 minutes / 9분)**

### **[SLIDE: Point Cloud 3D Tiles]**

마지막으로 포인트 클라우드 데이터를 변환하겠습니다.
Finally, let's convert point cloud data.

포인트 클라우드는 LiDAR 스캔이나 사진측량으로 생성된 데이터입니다.
Point clouds are data generated from LiDAR scans or photogrammetry.

수백만, 수천만 개의 점으로 이루어져 있습니다.
They consist of millions or tens of millions of points.

매우 상세한 표면 정보를 제공합니다.
They provide very detailed surface information.

### **[SLIDE: LAZ Format]**

다운로드한 데이터는 LAZ 형식입니다.
The data we downloaded is in LAZ format.

LAZ는 LAS 형식의 압축 버전입니다.
LAZ is a compressed version of LAS format.

파일 크기가 훨씬 작습니다.
File sizes are much smaller.

mago3DTiler는 LAZ 파일을 직접 읽을 수 있습니다.
mago3DTiler can read LAZ files directly.

**[Hands-on Time / 실습 시간 - 4 minutes / 4분]**

명령어를 실행해주세요.
Please run the command.

포인트 클라우드 처리는 데이터 크기에 따라 시간이 걸릴 수 있습니다.
Point cloud processing may take time depending on data size.

우리 샘플 데이터는 20-30분 정도 소요될 수 있습니다.
Our sample data may take about 20-30 minutes.

### **[SLIDE: Point Cloud Options]**

--inputType laz는 LAZ 압축 포인트 클라우드 형식을 지정합니다.
"--inputType laz" specifies LAZ compressed point cloud format.

--pointRatio 70은 원본 데이터의 70%만 사용합니다.
"--pointRatio 70" uses only 70% of the source data.

이것은 파일 크기를 최적화하기 위한 것입니다.
This is for optimizing file size.

높은 비율은 고품질이지만 파일 크기가 큽니다.
High ratios give high quality but large file sizes.

낮은 비율은 빠른 로딩이지만 품질이 낮습니다.
Low ratios give fast loading but lower quality.

70%는 품질과 성능의 좋은 균형입니다.
70% is a good balance of quality and performance.

### **[While Processing / 처리 중 설명]**

처리가 진행되는 동안 포인트 클라우드 3D Tiles의 장점을 설명드리겠습니다.
While processing proceeds, let me explain the advantages of point cloud 3D Tiles.

첫째, 원본 LAZ 파일은 수 GB에 달할 수 있습니다.
First, original LAZ files can reach several GB.

하지만 3D Tiles로 변환하면 웹에서 스트리밍 가능합니다.
But converting to 3D Tiles makes them streamable on the web.

둘째, LOD 구조 덕분에 효율적인 렌더링이 가능합니다.
Second, LOD structure enables efficient rendering.

먼 곳은 적은 점으로, 가까운 곳은 많은 점으로 표시됩니다.
Distant areas show fewer points, nearby areas show more points.

셋째, 색상 정보가 보존됩니다.
Third, color information is preserved.

사진처럼 사실적인 표현이 가능합니다.
Photo-realistic representation is possible.

**[Confirmation / 확인]**

포인트 클라우드 처리가 완료되셨나요?
Has point cloud processing completed?

시간이 오래 걸리는 경우, 다음 세션에서 미리 처리된 결과물을 사용할 수 있습니다.
If it takes too long, we can use pre-processed results in the next session.

`premade-output` 경로에 있는 결과물을 사용하시면 됩니다.
You can use the results in the `premade-output` path.

output/tileset/pointcloud 폴더가 생성되었나요?
Has the output/tileset/pointcloud folder been created?

.pnts 확장자를 가진 파일들이 있나요?
Are there files with .pnts extension?

---

## Wrap-up & Troubleshooting (5 minutes / 5분)

### **[SLIDE: What We've Accomplished]**

축하합니다! 데이터 처리 단계를 모두 완료하셨습니다!
Congratulations! You've completed all data processing steps!

지금까지 우리가 만든 것을 정리해보겠습니다.
Let's review what we've created so far.

첫째, 지형 타일셋을 생성했습니다.
First, we generated a terrain tileset.

둘째, 건물 3D Tiles를 만들었습니다.
Second, we created building 3D Tiles.

셋째, 산림 3D Tiles를 생성했습니다.
Third, we generated forest 3D Tiles.

넷째, 포인트 클라우드 3D Tiles를 변환했습니다.
Fourth, we converted point cloud 3D Tiles.

이 모든 데이터를 시각화할 준비가 되었습니다!
We're now ready to visualize all this data!

### **[SLIDE: Common Issues]**

혹시 문제가 발생하신 분들을 위해 일반적인 문제와 해결 방법을 정리했습니다.
For those who encountered problems, here are common issues and solutions.

**문제 1: Docker 실행 권한 오류**
**Issue 1: Docker permission error**

"Cannot connect to the Docker daemon"이라는 메시지가 나오는 경우입니다.
This is when you see "Cannot connect to the Docker daemon".

해결 방법: Docker Desktop이 실행 중인지 확인하세요.
Solution: Check that Docker Desktop is running.

**문제 2: 볼륨 마운트 오류**
**Issue 2: Volume mount error**

"Error response from daemon: invalid mount config"라는 메시지가 나오는 경우입니다.
This is when you see "Error response from daemon: invalid mount config".

해결 방법: 절대 경로를 사용했는지 확인하세요.
Solution: Make sure you're using an absolute path.

경로에 한글이나 공백이 없는지 확인하세요.
Make sure there are no Korean characters or spaces in the path.

**문제 3: 메모리 부족**
**Issue 3: Out of memory**

"Container killed by OOM killer"라는 메시지가 나오는 경우입니다.
This is when you see "Container killed by OOM killer".

해결 방법: Docker Desktop 설정에서 메모리를 최소 4GB 이상으로 늘리세요.
Solution: Increase memory to at least 4GB in Docker Desktop settings.

### **[SLIDE: Next Steps]**

다음 세션에서는 CesiumJS를 사용하여 이 모든 레이어를 시각화할 것입니다.
In the next session, we'll visualize all these layers using CesiumJS.

우리가 만든 지형, 건물, 숲, 포인트 클라우드를 모두 3D로 볼 수 있습니다.
We'll be able to see our terrain, buildings, forests, and point clouds all in 3D.

정말 멋진 디지털 트윈 도시가 완성될 것입니다!
A really amazing digital twin city will be complete!

**[Questions / 질문 시간 - 3 minutes / 3분]**

여기까지 질문 있으신가요?
Any questions so far?

특히 데이터 변환 과정에서 이해가 안 되는 부분이 있으면 지금 질문해주세요.
Especially if there's any part of the data conversion process you don't understand, please ask now.

**[Break Announcement / 휴식 안내]**

다음 세션 전에 30분간 휴식 시간을 갖겠습니다.
We'll have a 30-minute break before the next session.

휴식 시간 동안 생성된 파일들을 확인하시고, 문제가 있으면 저에게 말씀해주세요.
During the break, please check your generated files and let me know if you have any problems.

30분 후에 다시 만나겠습니다!
See you in 30 minutes!

---