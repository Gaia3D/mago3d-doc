# mago3D 데이터 수집 가이드

## 기본 설정
### 1. 워크샵 디렉터리 구조 생성

실습에 사용할 폴더를 생성합니다.  
이 폴더는 실습 과정에서 데이터를 저장하고 관리하기 위한 기본 작업 공간이 됩니다.  
Windows와 Mac/Linux 환경에 맞춰 아래 단계를 따라 진행하세요.

- Windows
  1. 명령 프롬프트 실행 
     - 시작 메뉴에서 cmd 또는 명령 프롬프트를 검색하여 실행합니다.
  2. 아래 명령어를 입력하여 폴더를 생성합니다:
     ```sh
     C:\> mkdir mago3d
     ```
  3. 생성된 폴더는 C:\mago3d 경로에 위치합니다.

- Mac / Linux
  1. 터미널 실행 
     - Mac에서는 Launchpad에서, Linux에서는 응용 프로그램 메뉴에서 터미널을 실행합니다.
  2. 아래 명령어를 입력하여 폴더를 생성합니다:
     ```sh
     mkdir ~/mago3d
     ```
  3. 생성된 폴더는 홈 디렉토리`~/mago3d`에 위치합니다.

<br/>
이제 실습 준비가 완료되었습니다. 다음 단계를 진행하세요! 🚀

---
### 2. IDE 준비 및 구성
IDE란 프로그래머가 소프트웨어 코드를 효율적으로 개발하도록 돕는 소프트웨어 애플리케이션입니다.

실습 마지막 챕터에 IDE를 사용하여 결과물을 확인합니다.
Visual Studio Code 또는 IntelliJ 사용을 권장합니다.

설치가 안되어있으신 분들은 무료로 사용 가능한 [https://code.visualstudio.com/](https://code.visualstudio.com/) 에서 다운받으세요.

---
### 3. Docker 설치 및 확인
도커는 애플리케이션을 컨테이너 단위로 패키징하고 실행할 수 있게 해주는 가상화 플랫폼입니다.

이번 워크샵의 대부분의 실습은 도커 명령어로 실행됩니다.

만약 도커가 설치 되어있지 않다면 실습 진행이 어려우므로, [https://www.docker.com/](https://www.docker.com/) 에서 도커를 다운 받으신 후 진행 하시기 바랍니다.

---
### 4. LINZ Data Service API 키 발행
설명 추가

[https://data.linz.govt.nz/](https://data.linz.govt.nz/) 에 가입합니다.

다음과 같이 API 키를 발행합니다
![step1](../images/api_key1.png)

![step2](../images/api_key2.png)

![step3](../images/api_key3.png)

![step4](../images/api_key4.png)

생성된 API 키는 복사하여 따로 저장해야 합니다.

## 데이터 다운로드
### Overture Maps 데이터

**1. 파이썬 설치**

- Python을 설치합니다 [https://www.python.org/downloads/](https://www.python.org/downloads/)

- 설치 시 하단의 [Add python.exe to PATH]를 체크한 후 [Install Now]를 클릭합니다.

   ![](../images/installPython.png)

- cmd 창을 열고 Python이 설치되었는지 확인합니다. 다음 명령어를 입력하세요.
   ```sh
   python --version
   ```
- 정상적으로 설치되었을 경우 다음과 같이 출력됩니다.
   ```sh
   Python 3.12.2
   ```
**2. 가상환경 생성**

- cmd 창에서 가상환경을 생성하려는 디렉터리로 이동합니다. 아까 생성해준 디렉터리로 이동하려면 다음 명령어를 입력하세요.

   - Windows
      ```sh
      cd C:\mago3d
      ```
   - Mac / Linux
      ```sh
      cd ~/mago3d
      ```

- 다음 명령어를 입력하여 가상환경을 생성합니다.
    ```sh
    python -m venv myvenv
    ```

- 여기서 `myvenv`는 가상환경의 이름입니다. 원하는 이름으로 변경할 수 있습니다.

**3. 가상환경 활성화**

- 가상환경을 활성화하려면 cmd 창에서 다음 명령어를 입력합니다.
  - Windows
    ```sh
    myvenv\Scripts\activate
    ```
  - Mac / Linux
    ```sh
    source myenv/bin/activate
    ```

- 위 명령어를 실행하면, 프롬프트가 `(myvenv)`와 같이 변경되어 가상환경이 활성화된 것을 알 수 있습니다.

**4. Overture Maps 패키지 설치**

- 가상환경이 활성화된 상태에서, Overture Maps 패키지를 설치하기 위해 cmd 창에서 다음 명령어를 입력합니다.
    ```sh
    pip install overturemaps
    ```
**5. Overture Maps 데이터 다운로드**
- building
   - Windows
      ```
      overturemaps download ^
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 ^
      -f geojson ^
      --type=building ^
      -o foss4g-2025\public\auckland_central_building.geojson
      ```
   - Powershell
      ```
      overturemaps download `
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
      -f geojson `
      --type=building `
      -o foss4g-2025/public/auckland_central_building.geojson
      ```
   - Mac / Linux
      ```
      overturemaps download \
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 \
      -f geojson \
      --type=building \
      -o foss4g-2025/public/auckland_central_building.geojson
      ```

- land-use
   - Windows
      ```
      overturemaps download ^
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 ^
      -f geojson ^
      --type=land_use ^
      -o foss4g-2025/public/auckland_central_land_use.geojson
      ```
   - Powershell
      ```
      overturemaps download `
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 `
      -f geojson `
      --type=land_use `
      -o foss4g-2025/public/auckland_central_land_use.geojson
      ```
   - Mac / Linux
      ```
      overturemaps download \
      --bbox=174.7493740584586419,-36.8648980092102789,174.7949689180301220,-36.8329413929010130 \
      -f geojson \
      --type=land_use \
      -o foss4g-2025/public/auckland_central_land_use.geojson
      ```

---
### 항공 영상 데이터
https://data.linz.govt.nz/layer/121752-auckland-0075m-urban-aerial-photos-2024-2025/

이전에 발급받은 API 키를 사용해 WMTS 데이터를 사용합니다.

![](../images/aerial.png)

---
### 도로 영상 데이터

https://data.linz.govt.nz/layer/53378-nz-roads-road-section-geometry/

이전에 발급받은 API 키를 사용해 WMTS 데이터를 사용합니다.

![](../images/road.png)

---
### DEM 데이터

https://data.linz.govt.nz/layer/121859-new-zealand-lidar-1m-dem/

원하는 영역을 지정해 데이터를 다운받습니다.

![](../images/crop_dem.png)

![](../images/export_dem.png)

![](../images/download_dem.png)

---
### 포인트 클라우드 데이터

https://data.linz.govt.nz/layer/d3VcCb5rKzNsNGk/auckland-part-1-lidar-point-cloud-2024/

원하는 영역을 지정해 데이터를 다운받습니다.

![](../images/crop_pointcloud.png)

![](../images/export_pointcloud.png)

![](../images/download_pointcloud.png)