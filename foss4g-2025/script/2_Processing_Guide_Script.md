# FOSS4G 2025 Workshop Script - Data Processing Guide
## 데이터 처리 가이드 발표 스크립트

**Total Duration: 60 minutes**  
**총 소요 시간: 60분**

---

## Session Opening (1 minute / 1분)

자, 다들 잘 쉬셨나요?  
Welcome back, everyone! I hope you had a good break.

쉬는 동안 모두 다운로드가 완료되었나요?  
Has everyone finished downloading during the break?

다운로드 받은 파일의 압축을 풀고 LAZ 파일을 `public` 디렉토리에 복사해주세요.  
Please unzip the downloaded file and copy the LAZ files to the `public` directory.

**[Confirmation / 확인]**

혹시 아직 데이터 다운로드가 완료되지 않으신 분 계신가요?  
Is there anyone who hasn't finished downloading yet?

걱정마세요. 다운로드에 문제가 있으시면 `public/raw`의 샘플 데이터를 사용하시면 됩니다.  
Don't worry. If you're having trouble with the download, you can use the sample data in the `public/raw` directory.

모두 준비되셨나요? 그럼 시작하겠습니다!  
Is everyone ready? Great, let's get started!

---

## Opening & Introduction (5 minutes / 5분)

### **[SLIDE: Data Processing Overview]**

안녕하세요! 이제 데이터 처리 세션을 시작하겠습니다.  
Hello everyone! Let's begin our data processing session.

이번 세션을 진행할 가이아쓰리디의 정연화입니다. 저는 백엔드 웹 개발자입니다. 편하게 루비라고 불러주시기 바랍니다.  
My name is YeonHwa Jeong from Gaia3D, and I'll be leading this session. I'm a backend web developer, and please feel free to call me Ruby.

이 세션은 약 1시간 정도 소요될 예정입니다.  
This session will take about one hour.

세션을 진행하다가 3시에 30분 휴식 시간을 가질 예정입니다.  
We'll have a 30-minute break at 3 PM during the session.

앞서 수집한 원시 데이터를 웹에 최적화된 3D 콘텐츠로 변환하는 과정을 함께 진행하겠습니다.  
Today, we'll go through the process of converting the raw data we collected earlier into web-optimized 3D content.

### **[SLIDE: What We'll Cover Today]**

오늘 다룰 내용은 크게 세 부분으로 나뉩니다.  
Today's session is divided into three main parts.

첫째, GDAL을 사용한 데이터 전처리입니다.  
First, data preprocessing using GDAL.

둘째, mago3DTerrainer를 사용한 지형 생성입니다.  
Second, terrain generation using mago3DTerrainer.

셋째, mago3DTiler를 사용한 3D Tiles 변환입니다.  
Third, 3D Tiles conversion using mago3DTiler.

각 단계마다 실습 시간을 충분히 드릴 예정이니 천천히 따라오시면 됩니다.
There's enough time for hands-on practice at each step, so you can follow along at your own pace.

### **[SLIDE: Prerequisites Check]**

시작하기 전에 다음 사항을 확인해주세요.  
Before we begin, let’s make sure everyone has everything ready.

Docker Desktop이 설치되어 실행 중인지 확인하세요.  
First, please check that Docker Desktop is installed and running.

모두 Docker Desktop을 실행합니다.  
Everyone, go ahead and launch Docker Desktop now.

실행이 되었다면 터미널을 열고 `docker images` 커맨드를 입력하세요.  
Once it's running, open your terminal and type `docker images`.

혹시 이미 mago3d-tiler, terrainer 이미지가 있는 경우, 새로운 버전으로 받아야 해서 지워주시기 바랍니다.  
If you already have the mago3d-tiler or terrainer images from before, please remove them as we need to pull the latest versions for this workshop.

원본 데이터가 `foss4g-2025/public` 디렉토리에 있는지 확인하세요.  
Next, confirm that your source data is in the `foss4g-2025/public` directory.

충분한 디스크 공간이 있는지 확인하세요. 약 2-4 GB가 필요합니다.  
Check that you have enough disk space. you'll need about 2 to 4 GB.

마지막으로 네트워크 연결 상태가 양호한지 확인해주세요.  
And finally, check that your internet connection is stable.

### **[SLIDE: Tool Versions]**

이번 세션에서 사용할 도구의 버전 정보는 다음과 같습니다.  
Here are the versions of the tools we'll be using today.

### **[SLIDE: Data Preparation]**

화면의 표를 봐주시기 바랍니다.  
Please take a look at the table on the screen.

이 표는 우리가 오늘 처리할 데이터 유형과 각 데이터에 사용할 도구를 요약한 것입니다.  
This table summarizes the types of data we'll be processing today and which tools we'll use for each one.

건물과 산림에 대한 전처리는 GeoJSON 원본 데이터를 사용하며, GDAL의 ogr2ogr 도구를 이용합니다.  
For buildings and forests, we'll preprocess the original GeoJSON data using the ogr2ogr tool from GDAL.

지형을 생성하기 위해서는 DEM GeoTIFF 파일을 사용하며, mago3DTerrainer 도구를 이용합니다.  
For terrain generation, we'll use the DEM GeoTIFF file with the mago3DTerrainer tool.

건물, 산림, 포인트 클라우드를 3D로 서비스하기 위해서 mago3DTiler 도구를 이용합니다.  
And to serve buildings, forests, and point clouds in 3D, we'll use the mago3DTiler tool.

---

## Part 1: Data Preprocessing (20 minutes / 20분)

### **[SLIDE: Data Preprocessing Overview]**

자, 이제 본격적으로 데이터 전처리를 시작하겠습니다.  
Alright, let's dive into data preprocessing.

GDAL은 지리공간 데이터를 처리하는 가장 강력한 오픈소스 도구 중 하나입니다.  
GDAL is one of the most powerful open-source tools for processing geospatial data.

우리는 GDAL을 사용하여 건물 데이터와 산림 데이터를 전처리할 것입니다.  
We'll be using GDAL to preprocess our building and forest data.

### **1.1 Building Data Preprocessing (10 minutes / 10분)**

### **[SLIDE: Building Data Overview]**

먼저 Overture Maps에서 다운로드한 건물 데이터를 살펴보겠습니다.  
First, let's take a look at the building data we downloaded from Overture Maps.

### **[SLIDE: Building Attributes]**

건물 데이터에는 두 가지 중요한 속성이 있습니다.  
The building data contains two important attributes.

하나는 height입니다. 이것은 건물의 실제 높이를 미터 단위로 나타냅니다.  
The first is "height," which represents the actual building height in meters.

다른 하나는 num_floors입니다. 이것은 건물의 층수를 나타냅니다.  
The second is "num_floors," which indicates the number of floors in the building.

### **[SLIDE: Conversion Logic]**

건물의 3D 모델을 만들기 위해서는 높이 정보가 필수적입니다.  
To create 3D building models, we need height information.

하지만 모든 건물에 높이 정보가 있는 것은 아닙니다.  
However, not all buildings have height information.

그래서 우리는 다음과 같은 로직을 사용합니다.  
So here's the logic we'll use:

첫째, height 값이 있으면 그 값을 사용합니다.  
First, if a height value exists, we'll use it.

둘째, height가 없고 num_floors가 있으면 num_floors에 3.3을 곱합니다.  
Second, if height is missing but num_floors is available, we'll multiply num_floors by 3.3.

이것은 평균 층고가 3.3미터라고 가정한 것입니다.  
This assumes an average floor height of 3.3 meters.

셋째, 둘 다 없으면 기본값 3.3미터를 할당합니다.  
Third, if neither value is available, we'll assign a default height of 3.3 meters.

### **[SLIDE: GDAL Command]**

이제 실제 명령어를 실행해보겠습니다.  
Now let's run the actual command.

명령어가 길기 때문에 천천히 따라오세요.  
The command is quite long, so please follow along carefully.

환경에 적절한 명령어를 사용하세요.  
Use the command that's appropriate for your operating system.

`YOUR_PROJECT_ROOT_DIR`을 여러분의 실제 프로젝트 경로로 바꿔주세요.  
Make sure to replace `YOUR_PROJECT_ROOT_DIR` with your actual project path.

실습을 편하게 하기 위해 미리 YOUR_PROJECT_ROOT_DIR을 제 경로로 바꿔놓도록 하겠습니다.  
To make it easier, I’ll replace it with my own path for now.

**[Hands-on Time / 실습 시간 - 3 minutes / 3분]**

이제 명령어를 실행해주세요.  
Please run the command now.

첫 실행 시 Docker 이미지를 다운로드하는데 1-2분 정도 걸릴 수 있습니다.  
If this is your first time running it, downloading the Docker image may take a minute or two.

### **[SLIDE: Command Explanation]**

이제 명령어가 하는 일을 간단히 설명드리겠습니다.  
Let me briefly explain what this command does.

`docker run --rm`은 Docker 컨테이너를 실행하고 완료 후 자동으로 제거합니다.  
`docker run --rm` runs a Docker container and automatically removes it when it's done.

`-v` 옵션은 호스트 디렉토리를 컨테이너에 마운트합니다.  
The `-v` option mounts your host directory into the container.

반드시 절대 경로를 사용해야 합니다.  
You must use an absolute path here.

`ogr2ogr`은 벡터 데이터 변환 도구입니다.  
`ogr2ogr` is a vector data conversion tool.

`-f "GeoJSON"`은 출력 형식을 GeoJSON으로 지정합니다.  
`-f "GeoJSON"` specifies that we want our output in GeoJSON format.

`-dialect SQLite`는 SQLite 데이터베이스 엔진을 사용하도록 지정합니다.  
`-dialect SQLite` means to use the SQLite database engine.

`-sql` 옵션은 SQL 쿼리를 사용하여 데이터를 처리합니다.  
And the `-sql` option lets us use SQL queries to process the data.

**[Confirmation / 확인]**

모두 파일이 생성되셨나요?  
Has everyone successfully created the file?

`public` 폴더 안에 auckland_building.geojson 파일이 보이시나요?  
Can you see the auckland_building.geojson file in your `public` folder?

혹시 에러가 발생하신 분 계신가요?  
Is anyone encountering any errors?

### **[SLIDE: Building Data Processing Complete]**

훌륭합니다! 이제 건물 데이터 전처리가 완료되었습니다.  
Excellent! The building data preprocessing is complete.

결과 파일을 QGIS에서 열어서 확인해보면 다음과 같이 높이값이 채워진 것을 볼 수 있습니다.  
If you open the result file in QGIS, you can see the height values have been filled as shown.

### **1.2 Forest Data Preprocessing (10 minutes / 10분)**

### **[SLIDE: Forest Data Overview]**

이제 산림을 만들기 위한 데이터를 처리하겠습니다.  
Now let's move on to processing the forest data.

Overture Maps의 토지 이용 데이터에서 산림 영역만 추출할 것입니다.  
We'll select only the forest areas from the Overture Maps land use data.

### **[SLIDE: Forest Attributes]**

토지 이용 데이터에는 subtype과 class라는 속성이 있습니다.  
The land use data contains attributes called "subtype" and "class."

우리는 이 속성들을 사용하여 공원과 잔디 지역을 필터링할 것입니다.  
We'll use these attributes to filter for park and grass areas.

이 지역들에 나무를 심어서 산림을 만들 것이기 때문입니다.  
It's because we'll be planting trees in these locations to create our forests.

**[Hands-on Time / 실습 시간 - 2 minutes / 2분]**

명령어를 실행하시고 처리가 완료될 때까지 기다려주세요.  
Please run the command and wait for the processing to complete.

### **[SLIDE: Forest Conversion Command]**

명령어 옵션을 살펴보겠습니다.  
Let's review the command options.

이번에는 출력 포맷을 GeoPackage로 지정했습니다.  
For this one, we're using the GeoPackage format.

mago3DTiler는 입력받는 2차원 데이터 포맷으로 GeoPackage, GeoJSON, Shapefile을 지원합니다.  
mago3DTiler supports GeoPackage, GeoJSON, and Shapefile as 2D input data formats.

따라서 GeoPackage, GeoJSON 중 원하는 포맷을 선택하시면 됩니다.  
Therefore, you can choose either GeoPackage or GeoJSON format.

여기서 중요한 부분은 "20 AS height"입니다.  
The important part here is "20 AS height."

이것은 나무의 높이를 20미터로 설정한다는 의미입니다.  
This sets the tree height to 20 meters.

이 값은 나중에 원하는 나무 높이로 조정할 수 있습니다.  
If you'd like, you can change this value to a different tree height later.

여기서 `height`는 추후에 mago3DTiler에서 scaleColumn 옵션에 지정하여 사용하게 됩니다.  
This `height` column will be used later in mago3DTiler's scaleColumn option.

**[Confirmation / 확인]**

`public` 폴더 안에 auckland_forest.gpkg 파일이 생성되었나요?  
Can you see the auckland_forest.gpkg file in your `public` folder?

결과 파일을 QGIS에서 열어서 확인해보면 다음과 같이 산림 영역만 추출된 것을 볼 수 있습니다.  
If you open it in QGIS, you'll see that only the forest areas have been filtered.

여기까지 모두 잘 따라오셨나요?  
Is everyone following along well so far?

이제 GDAL 전처리는 완료되었습니다.  
Good, the GDAL preprocessing is now complete.

잠깐 쉬는 시간을 가지면서 각자 데이터를 확인해보시기 바랍니다.  
Let's take a short break while you check your data.

---

## Part 2: Terrain Generation with mago3DTerrainer (15 minutes / 15분)

### **[SLIDE: Data Conversion]**

좋습니다. 이제 가장 흥미로운 부분을 시작하겠습니다.  
Great. Now let's move on to one of the most exciting parts.

데이터 변환은 mago3DTerrainer와 mago3DTiler 두 가지 도구를 사용합니다.  
For data conversion, we'll use two tools: mago3DTerrainer and mago3DTiler.

먼저 mago3DTerrainer를 사용하여 지형을 생성하겠습니다.  
First, we'll generate terrain using mago3DTerrainer.

mago3DTerrainer는 DEM 데이터를 웹 스트리밍에 최적화된 Quantized Mesh 형식으로 변환하는 도구입니다.  
mago3DTerrainer converts DEM data into Quantized Mesh format, which is optimized for web streaming.

mago3DTiler는 다양한 3D 데이터를 OGC 3D Tiles 형식으로 변환하는 도구입니다.  
mago3DTiler converts various types of 3D data into the OGC 3D Tiles format.

mago3DTiler는 2D 데이터의 속성값으로 3D Tiles를 생성하는 강력한 기능을 제공합니다.  
mago3DTiler provides powerful capabilities to create 3D Tiles from 2D data attributes.

### **[SLIDE: mago3D Tools Usage Guide]**

mago3DTerrainer는 최적화된 지형을 생성합니다.  
mago3DTerrainer generates optimized terrain.

mago3DTerrainer는 다음과 같은 주요 특징을 갖습니다.  
mago3DTerrainer has the following key features:

- Creates terrain tiles from DEM (GeoTIFF) with simple commands
- Generates high-accuracy Quantized Mesh
- Supports multi-resolution DEM tile generation
- Calculates Normal Vectors for terrain lighting
- Provides various customization options

mago3DTiler는 3D Tiles 형식으로 변환합니다.  
mago3DTiler converts data into the 3D Tiles format.

mago3DTiler는 다음과 같은 주요 특징을 갖습니다.  
mago3DTiler has the following key features:

- Supports various formats: 3DS, OBJ, FBX, Collada DAE, glTF, GLB, IFC, etc.
- High-accuracy LAS, LAZ data conversion
- Height extrusion and attribute mapping
- Coordinate system transformation and terrain draping
- Provides various customization options

링크를 누르면 GitHub 레포지토리에서 각 도구의 자세한 정보를 확인할 수 있습니다.  
Clicking the links will take you to the GitHub repositories where you can find detailed information about each tool.

### **[SLIDE: Terrain Generation Command]**

자, 이제 지형을 생성해보겠습니다.  
Now, let's generate the terrain.

변환에 대한 입력은 앞서 준비한 DEM GeoTIFF 파일입니다.  
The input for conversion is the DEM GeoTIFF file we prepared earlier.

출력은 terrain tileset과 `layer.json` 메타데이터 파일입니다.  
The output will be a terrain tileset and a `layer.json` metadata file.

`mago3DTerrainer`는 원본 데이터의 CRS를 자동으로 감지하여 올바르게 변환합니다.  
`mago3DTerrainer` automatically detects the CRS of your source data and converts it correctly.

`mago3DTerrainer`는 Docker 이미지로 제공되므로 설치가 매우 간단합니다.  
`mago3DTerrainer` comes as a Docker image, so installation is very simple.

다음 명령어를 실행하세요.  
Please run the following command.

### **[SLIDE: Command Options Explained]**

각 옵션의 의미를 설명드리겠습니다.  
Let me explain what each option means.

`--input`은 입력 DEM 파일 경로입니다.  
`--input` specifies the input DEM file path.

`--output`은 출력 terrain tileset이 저장될 폴더입니다.  
`--output` is the folder where the terrain tiles will be saved.

`--calculateNormals`는 조명 효과를 위한 법선 벡터를 계산합니다.  
`--calculateNormals` calculates normal vectors for lighting effects.

이 옵션을 추가하면 지형에 더 사실적인 조명 효과를 줄 수 있습니다.  
This option makes the terrain lighting look more realistic.

`--minDepth 0`은 최소 타일 깊이입니다.  
`--minDepth 0` is the minimum tile depth.

`--maxDepth 17`은 최대 타일 깊이입니다.  
`--maxDepth 17` is the maximum tile depth.

숫자가 클수록 더 상세한 지형을 만들 수 있습니다.  
Larger numbers create more detailed terrain.

하지만 처리 시간도 더 오래 걸립니다.  
But it will also take more time to process.

**[Hands-on Time / 실습 시간 - 5 minutes / 5분]**

명령어를 실행하시고 처리가 진행되는 것을 지켜봐주세요.  
Please run the command and watch the processing progress.

처리 시간은 DEM 파일의 크기에 따라 다릅니다.  
The processing time depends on your DEM file size.

보통 1-2분 정도 소요됩니다.  
It usually takes about 1 to 2 minutes.

터미널에 진행 상황이 표시될 것입니다.  
You'll see the progress displayed in your terminal.

### **[While Processing / 처리 중 설명]**

다음 명령어를 실행하면 mago3DTerrainer의 모든 옵션을 볼 수 있습니다.  
You can view all mago3DTerrainer options by running the following command.

추가 옵션에 대해 궁금하신 분들은 나중에 확인해보시기 바랍니다.  
If you're interested in additional options, please check them later.

처리가 완료되면 terrain 폴더 안에 여러 하위 폴더가 생성됩니다.  
When processing completes, several subfolders will be created inside the terrain folder.

0, 1, 2... 17까지의 폴더들이 생성됩니다.  
You'll see folders named 0, 1, 2... up to 17.

각 폴더는 하나의 LOD 레벨을 나타냅니다.  
Each folder represents one LOD level.

layer.json 파일도 생성됩니다.  
A layer.json file will also be created.

이 파일이 전체 tileset의 메타데이터를 담고 있습니다.  
This file contains metadata about the entire tileset.

**[Confirmation / 확인]**

처리가 완료되셨나요?  
Has processing completed?

terrain 폴더가 생성되었고 안에 여러 숫자 폴더들이 있나요?  
Has the terrain folder been created with several numbered folders inside?

layer.json 파일이 보이시나요?  
Can you see the layer.json file?

좋습니다! 지형 생성이 완료되었습니다.  
Great! Terrain generation is complete.

변환 결과로 그림과 같이 지형이 가시화될 것입니다.  
When you visualize the conversion result, the terrain will appear as shown in the image.

---

## Part 3: 3D Tiles Conversion with mago3DTiler (25 minutes / 25분)

### **3.1 Building 3D Tiles Generation (8 minutes / 8분)**

### **[SLIDE: Building 3D Tiles]**

다음은 건물 변환입니다.  
Next, we'll convert the buildings.

입력은 앞서 GDAL로 전처리한 auckland_building.geojson 파일입니다.  
The input is the auckland_building.geojson file we preprocessed with GDAL.

출력은 GLB 형식의 3D Tiles tileset입니다.  
The output will be a 3D Tiles tileset in GLB format.

우리는 2D 건물 footprint의 높이 속성을 사용하여 3D 건물로 돌출시킬 것입니다.  
We'll extrude 2D building footprints into 3D buildings using their height attributes.

**[Hands-on Time / 실습 시간 - 4 minutes / 4분]**

다음 명령어를 실행하세요.  
Please run the following command.

명령어를 실행하고 처리를 기다려주세요.  
Run the command and wait for the processing to complete.

건물 데이터의 양에 따라 5-10분 정도 소요될 수 있습니다.  
Depending on the amount of building data, this may take about 5 to 10 minutes.

### **[SLIDE: Building Command Options]**

중요한 옵션들을 설명하겠습니다.  
Let me explain the important options.

`--inputType geojson`은 입력 파일 형식이 GeoJSON임을 지정합니다.  
`--inputType geojson` specifies that the input file format is GeoJSON.

`--crs 4326`은 좌표 참조 시스템을 지정합니다.  
`--crs 4326` specifies the coordinate reference system.

4326은 WGS84의 EPSG 코드를 의미합니다.  
4326 is the EPSG code for WGS84.

`--heightColumn height`는 높이 정보가 들어있는 컬럼을 지정합니다.  
`--heightColumn height` specifies which column contains the height information.

이것이 가장 중요한 옵션입니다.  
This is the most important option.

이 옵션 덕분에 2D 폴리곤이 3D 건물로 변환됩니다.  
This option enables the conversion of 2D polygons into 3D buildings.

`--minimumHeight` 옵션은 건물의 높이 속성에 값이 없는 경우 기본값을 지정합니다.  
The `--minimumHeight` option sets a default value when height data is missing.

`--terrain` 옵션은 건물을 extrude할 때 베이스가 되는 높이를 참조할 DEM 파일 경로를 지정합니다.  
The `--terrain` option specifies the DEM file path to reference the base ground height when extruding buildings.

다음 명령어를 실행하면 mago3DTiler의 모든 옵션을 볼 수 있습니다.  
You can view all mago3DTiler options by running the following command.

옵션에 대해 궁금하신 분들은 나중에 확인해보시기 바랍니다.  
If you're interested in the options, please check them later.

옵션 중에서 `skirtHeight` 옵션에 대해서 설명드리겠습니다.  
Let me explain the `skirtHeight` option.

이 옵션은 지형과 건물 사이의 틈을 메우기 위해 사용됩니다.  
This option is used to fill gaps between terrain and buildings.

이해를 돕기 위해 그림을 살펴보도록 하겠습니다.  
Let's look at a diagram to help you understand.

### **[SLIDE: Skirt Height Explanation]**

건물과 지형 사이에 틈이 있을 수 있습니다.  
There can be gaps between buildings and terrain.

이 틈은 건물이 떠 있는 것처럼 보이게 만듭니다.  
These gaps make buildings appear to float.

skirtHeight 옵션은 이 틈을 메우기 위해 건물 바닥에 추가 높이를 아래로 더합니다.  
The skirtHeight option adds extra height downward at the building base to fill these gaps.

이 옵션이 없으면 기본적으로 4m의 skirt가 추가됩니다.  
Without this option, a default 4m skirt is added.

**[Confirmation / 확인]**

처리가 완료되었나요?  
Has processing completed?

output/tileset/building 폴더가 생성되었나요?  
Has the output/tileset/building folder been created?

tileset.json 파일과 data 폴더가 보이시나요?  
Can you see the tileset.json file and data folder?

좋습니다. 건물 변환이 완료되었습니다.  
Great! Building conversion is complete.

변환 결과로 그림과 같이 건물이 가시화될 것입니다.  
When you visualize the conversion result, the buildings will appear as shown in the image.

### **3.2 Forest 3D Tiles Generation (8 minutes / 8분)**

### **[SLIDE: Forest 3D Tiles - Instanced Models]**

이제 정말 흥미로운 부분입니다!  
Now for a really exciting part!

산림을 만들어보겠습니다!  
Let's create a forest!

입력은 앞서 GDAL로 전처리한 auckland_forest.gpkg 파일과 3D 모델이 필요합니다.  
The inputs are the auckland_forest.gpkg file we preprocessed with GDAL and a 3D model.

출력은 i3dm 형식의 3D Tiles tileset입니다.  
The output will be a 3D Tiles tileset in i3dm format.

산림은 i3dm 형식을 사용합니다.  
Forests use the i3dm format.

i3dm은 Instanced 3D Model의 약자입니다.  
i3dm stands for Instanced 3D Model.

이 형식은 동일한 3D 모델을 여러 위치에 효율적으로 배치할 수 있게 해줍니다.  
This format allows you to efficiently place the same 3D model in multiple locations.

예를 들어 하나의 나무 모델을 수천 번 재사용할 수 있습니다.  
For example, you can reuse one tree model thousands of times.

워크샵 자료에는 `mix-tree-1m.glb` 파일이 포함되어 있습니다.  
The workshop materials include a `mix-tree-1m.glb` file.

이것은 GLB 형식의 간단한 나무 모델입니다.  
This is a simple tree model in GLB format.

실제 프로젝트에서는 더 복잡하고 사실적인 모델을 사용할 수 있습니다.  
In real projects, you can use more detailed and realistic models.

**[Hands-on Time / 실습 시간 - 3 minutes / 3분]**

명령어를 실행해주세요.  
Please run the command.

이 처리는 비교적 빠릅니다. 1-2분 정도면 완료됩니다.  
This processing is relatively fast. It completes in about 1-2 minutes.

### **[SLIDE: Forest Command Options]**

새로운 옵션들을 설명하겠습니다.  
Let me explain the new options.

`--scaleColumn height`는 나무 인스턴스의 높이 속성을 지정합니다.  
`--scaleColumn height` specifies the height attribute for tree instances.

`--outputType i3dm`은 instance tile 형식으로 출력합니다.  
`--outputType i3dm` outputs in instance tile format.

`--instance`는 반복 배치할 GLB 모델 파일을 지정합니다.  
`--instance` specifies the GLB model file to be placed repeatedly.

`--terrain`은 나무를 지형에 맞춰 배치하기 위한 DEM 파일입니다.  
`--terrain` is the DEM file for placing trees on the terrain.

`--tilesVersion 1.0`은 3D Tiles 버전을 지정합니다.  
`--tilesVersion 1.0` specifies the 3D Tiles version.

최신 타일 버전에서 i3dm을 호출하는 방식에 장점이 없기 때문에 1.0 버전을 사용합니다.  
We use version 1.0 because there are no advantages to using i3dm in the latest tile version.

**[Confirmation / 확인]**

다들 완료되셨나요?  
Is everyone done?

`output/tileset/forest` 폴더가 생성되었나요?  
Has the `output/tileset/forest` folder been created?

.i3dm 확장자를 가진 파일들이 생성되어 있나요?  
Have files with the .i3dm extension been created?

좋습니다! 산림 변환이 완료되었습니다.  
Great! Forest conversion is complete.

변환 결과로 그림과 같이 산림이 가시화될 것입니다.  
When you visualize the conversion result, the forests will appear as shown in the image.

### **3.3 Point Cloud 3D Tiles Generation (9 minutes / 9분)**

### **[SLIDE: Point Cloud 3D Tiles]**

마지막으로 포인트 클라우드 데이터를 변환하겠습니다.  
Finally, let's convert the point cloud data.

포인트 클라우드는 LiDAR 스캔이나 사진측량으로 생성된 데이터입니다.  
Point clouds are generated from LiDAR scans or photogrammetry.

수백만, 수천만 개의 점으로 이루어져 있습니다.  
They consist of millions or tens of millions of points.

매우 상세한 표면 정보를 제공합니다.  
They provide very detailed surface information.

다운로드한 데이터는 LAZ 형식입니다.  
Our downloaded data is in LAZ format.

LAZ는 LAS 형식의 압축 버전입니다.  
LAZ is a compressed version of the LAS format.

파일 크기가 훨씬 작습니다.  
The file size is much smaller.

mago3DTiler는 LAZ 파일을 직접 읽을 수 있습니다.  
mago3DTiler can read LAZ files directly.

출력은 .pnts 확장자를 가진 point cloud 3D Tiles tileset입니다.  
The output will be a point cloud 3D Tiles tileset with a .pnts extension.

**[Hands-on Time / 실습 시간 - 4 minutes / 4분]**

명령어를 실행해주세요.  
Please run the command.

포인트 클라우드 처리는 데이터 크기에 따라 시간이 걸릴 수 있습니다.  
Point cloud processing may take time depending on data size.

우리 샘플 데이터는 20-30분 정도 소요될 수 있습니다.  
Our sample data may take about 20-30 minutes.

### **[SLIDE: Point Cloud Options]**

`--inputType laz`는 LAZ 압축 point cloud 형식을 지정합니다.  
`--inputType laz` specifies the LAZ compressed point cloud format.

`--pointRatio 70`은 원본 데이터의 70%만 사용합니다.  
`--pointRatio 70` uses only 70% of the original data.

이것은 파일 크기를 최적화하기 위한 것입니다.  
This is to optimize file size.

높은 비율은 고품질이지만 파일 크기가 큽니다.  
Higher ratios give better quality but larger files.

낮은 비율은 빠른 로딩이지만 품질이 낮습니다.  
Lower ratios load faster but with lower quality.

70%는 품질과 성능의 좋은 균형입니다.  
70% is a good balance between quality and performance.

**[Confirmation / 확인]**

포인트 클라우드 처리가 완료되셨나요?  
Has point cloud processing completed?

`output/tileset/pointcloud` 폴더가 생성되었나요?  
Has the `output/tileset/pointcloud` folder been created?

.pnts 확장자를 가진 파일들이 있나요?  
Are there files with the .pnts extension?

시간이 오래 걸리는 경우 다음 세션에서 미리 처리된 결과물을 사용할 수 있습니다.  
If this takes too long, we can use pre-processed results in the next session.

`premade-output` 경로에 있는 결과물을 사용하시면 됩니다.  
You can use the results in the `premade-output` directory.

좋습니다! 포인트 클라우드 변환이 완료되었습니다.  
Great! Point cloud conversion is complete.

변환 결과로 그림과 같이 포인트 클라우드가 가시화될 것입니다.  
When you visualize the conversion result, the point clouds will appear as shown in the image.

---

## Wrap-up & Troubleshooting (5 minutes / 5분)

### **[SLIDE: What We've Accomplished]**

축하합니다! 데이터 처리 단계를 모두 완료하셨습니다!  
Congratulations! You've successfully completed all the data processing steps!

지금까지 우리가 만든 것을 정리해보겠습니다.  
Let's review what we've accomplished.

첫째, 지형 tileset을 생성했습니다.  
First, we generated a terrain tileset.

둘째, 건물 3D Tiles를 만들었습니다.  
Second, we created building 3D Tiles.

셋째, 산림 3D Tiles를 생성했습니다.  
Third, we generated forest 3D Tiles.

넷째, 포인트 클라우드 3D Tiles를 변환했습니다.  
Fourth, we converted point cloud data to 3D Tiles.

이 모든 데이터를 시각화할 준비가 되었습니다!  
We're now ready to visualize all of this data!

### **[SLIDE: Next Steps]**

다음 세션에서는 CesiumJS를 사용하여 이 모든 레이어를 시각화할 것입니다.  
In the next session, we'll visualize all these layers using CesiumJS.

우리가 만든 지형, 건물, 숲, 포인트 클라우드를 모두 3D로 볼 수 있습니다.  
You'll see all the terrain, buildings, forests, and point clouds we created in 3D.

정말 멋진 디지털 트윈 도시가 완성될 것입니다!  
It will be an amazing digital twin city!

**[Questions / 질문 시간 - 3 minutes / 3분]**

여기까지 질문 있으신가요?  
Does anyone have questions so far?

특히 데이터 변환 과정에서 이해가 안 되는 부분이 있으면 지금 질문해주세요.  
If there's any part of the data conversion process that's unclear, please feel free to ask now.

**[Break Announcement / 휴식 안내]**

다음 세션 전에 30분간 휴식 시간을 갖겠습니다.  
We'll take a 30-minute break before the next session.

휴식 시간 동안 생성된 파일들을 확인하시고, 문제가 있으면 저에게 말씀해주세요.  
During the break, please check your generated files, and let me know if you have any problems.

30분 후에 다시 만나겠습니다!  
See you back here in 30 minutes!

---

### **[SLIDE: Common Issues]**

혹시 문제가 발생하신 분들을 위해 일반적인 문제와 해결 방법을 정리했습니다.  
For those who encountered any issues, I've compiled some common problems and their solutions.

**문제 1: Docker 실행 권한 오류**  
**Issue 1: Docker permission error**

"Cannot connect to the Docker daemon"이라는 메시지가 나오는 경우입니다.  
If you see the message "Cannot connect to the Docker daemon":

해결 방법: Docker Desktop이 실행 중인지 확인하세요.  
Solution: Please verify that Docker Desktop is running.

**문제 2: 볼륨 마운트 오류**  
**Issue 2: Volume mount error**

"Error response from daemon: invalid mount config"라는 메시지가 나오는 경우입니다.  
If you encounter "Error response from daemon: invalid mount config":

해결 방법: 절대 경로를 사용했는지 확인하세요.  
Solution: Please ensure you're using an absolute path.

경로에 한글이나 공백이 없는지 확인하세요.  
Also check that there are no Korean characters or spaces in the path.

**문제 3: 메모리 부족**  
**Issue 3: Out of memory**

"Container killed by OOM killer"라는 메시지가 나오는 경우입니다.  
If you see "Container killed by OOM killer":

해결 방법: Docker Desktop 설정에서 메모리를 최소 4GB 이상으로 늘리세요.  
Solution: Please increase the memory allocation to at least 4GB in your Docker Desktop settings.

---

## End of Session

감사합니다!  
Thank you!