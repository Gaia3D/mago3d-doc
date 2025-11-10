# 오픈 데이터, 오픈소스, 오픈 표준: mago3D로 빠르게 디지털 트윈 도시 구축하기

## 워크샵 개요

이 워크샵은 FOSS4G가 개최되는 지역의 오픈 데이터를 활용하여 **디지털 트윈 도시를 처음부터 구축하는 경험**을 제공합니다.   

참가자들은:
- 다양한 지오스페이셜 소스에서 **오픈 데이터를 수집**
- 오픈소스 도구(**mago3DTiler**, **mago3DTerrainer**)를 사용하여 **데이터를 변환**
- **OGC(Open Geospatial Consortium) 표준**에 따라 데이터를 제공하는 **전체 워크플로우를 경험**

도시 **건물**과 **지형**을 3D로 시각화하고, **도로** 레이어와 **항공 영상**을 오버레이하여 현실적인 도시 환경을 구축합니다.    
또한 도시에 나무를 심어 **산림**을 구성해보고, 대용량 포인트 클라우드 데이터를 변환하고 오버레이합니다.   

이 모든 과정은 **오픈 데이터, 오픈소스, 오픈 표준**에만 의존하여, 참가자들이 준비되지 않은 PC에서 디지털 트윈 도시를 처음부터 만드는 경험을 할 수 있도록 합니다.   

---

## 학습 목표

이 워크샵을 마치면 참가자들은 다음을 수행할 수 있습니다:

1. 워크샵 지역에서 오픈 데이터 수집 및 다운로드
2. GDAL 및 mago3DTiler를 사용한 3D 건물 데이터 처리 및 변환
3. mago3DTerrainer를 활용한 DEM 데이터 기반 지형 모델 생성
4. 포인트 클라우드 데이터 변환 및 식생 기반 개체목 가시화
5. OGC WMTS를 사용한 지오스페이셜 데이터 서빙
6. CesiumJS를 활용한 인터랙티브 3D 웹 애플리케이션 생성
7. 3시간 동안 처음부터 완전한 디지털 트윈 도시 구축

---

## 사전 준비사항

### 필수 소프트웨어
- **Docker Desktop** (Windows/Mac) 또는 **Docker Engine** (Linux)
- 저장소 클론을 위한 **Git**
- **Python** (버전 3.8 이상)
- **Node.js** (버전 14 이상)
- **IDE**: Visual Studio Code 또는 IntelliJ IDEA (권장)
- **웹 브라우저**: Chrome, Firefox 또는 Edge (최신 버전)

### 필수 접근 권한
- **Cesium ion access token**: [cesium.com/ion](https://cesium.com/ion/)에서 무료 계정을 생성하고 access token을 발급받으세요

### 하드웨어 요구사항
- **최소사양**: 8GB RAM, 20GB 여유 디스크 공간
- **권장사양**: 16GB 이상 RAM, 50GB 이상 여유 디스크 공간, 전용 GPU
- 데이터 다운로드를 위한 안정적인 인터넷 연결

### 사전 지식
- GIS 개념에 대한 기본 이해
- 커맨드라인 도구 사용 경험
- Docker에 대한 기본 지식 (있으면 도움이 되지만 필수는 아님)

---

## 워크샵 구성

### 1부: 소개 (15분)
워크샵 개요, 목표 및 환경 설정을 소개합니다.

### 2부: 데이터 수집 (45분)
다양한 출처에서 오픈 지오스페이셜 데이터를 수집하고 다운로드하는 방법을 학습합니다.

**주요 내용:**
- 작업 환경 설정
- **Overture Maps**에서 건물 풋프린트, 토지 이용 다운로드
- **LINZ Data Service**에서 DEM, 도로, 항공 영상, 포인트 클라우드 데이터 획득

참고로, 전 세계 오픈 데이터는 아래와 같은 소스에서 얻을 수 있습니다:
- **Copernicus Data Space Ecosystem**에서 Sentinel 위성 영상 다운로드
- **NASA SRTM/ASTER DEM** DEM 데이터 획득

### 3부: 데이터 가공 (60분)
원본 데이터를 웹 최적화된 3D 타일과 지형으로 변환합니다.

**주요 내용:**
- **GDAL/OGR**을 활용한 데이터 전처리
- **mago3DTerrainer**를 사용한 Quantized Mesh 지형 생성
- **mago3DTiler**를 사용하여 3D 건물의 OGC 3DTiles 변환
- **mago3DTiler**를 사용한 산림 3DTiles i3dm 변환
- **mago3DTiler**를 사용하여 포인트 클라우드 (LAS/LAZ) OGC 3DTiles 변환

### 4부: 시각화 (40분)
디지털 트윈 도시를 시각화하는 인터랙티브 3D 웹 애플리케이션을 구축합니다.

**주요 내용:**
- Access Token 설정 및 CesiumJS 뷰어 설정
- 지형(Quantized Mesh) 로드
- 항공 영상 및 도로 레이어 추가
- 건물 3D Tiles 로드
- 산림 및 포인트 클라우드 3D Tiles 로드
- 최종 3D 디지털 트윈 도시 확인

### 5부: 하드웨어 가속 (10분)
GPU 가속을 통한 데이터 처리 성능 최적화

**주요 내용:**
- 접속 브라우저의 그래픽 가속 여부 확인
- 그래픽 가속 설정 전/후 성능 비교 실습

---

## 워크샵 일정

| 시간            | 섹션               | 활동              |
|---------------|------------------|-----------------|
| 01:30 - 01:45 | 소개(15분)          | 워크샵 개요 및 환경 설정  |
| 01:45 - 02:30 | 데이터 수집(45분)      | 지오스페이셜 데이터 다운로드 |
| 02:30 - 03:00 | 데이터 가공 - 1부(30분) | GDAL 전처리        |
| 03:00 - 03:30 | 휴식(30분)          | 커피 브레이크         |
| 03:30 - 04:00 | 데이터 가공 - 2부(30분) | 3차원 데이터 변환      |
| 04:00 - 04:40 | 시각화(40분)         | 3D 웹 애플리케이션 구축  |
| 04:40 - 04:50 | 고급 주제(10분)       | 하드웨어 가속         |
| 04:50 - 05:00 | Q&A(10분)         | 질의응답 및 마무리      |

**총 소요 시간**: 3.5시간

---

## 목차

### [1. 데이터 수집 가이드](guides/1_Resource_Guide_Ko.md)

#### 기본 설정
- 실습을 위한 작업 디렉토리 생성
- IDE 준비 및 Git 저장소 클론
- 필수 소프트웨어 설치 및 설치 확인

#### 데이터 다운로드
- Overture Maps 건물 풋프린트, 토지 이용 벡터 데이터
- 오픈 데이터 소스(LINZ Data Service) DEM, 포인트 클라우드
- 오픈 데이터 소스(LINZ Data Service) 항공영상, 도로 WMTS 서비스

---

### [2. 데이터 가공 가이드](guides/2_Processing_Guide_Ko.md)

#### 데이터 전처리
- Overture Maps 건물 풋프린트 데이터 건물 높이 전처리
- Overture Maps 토지 이용 데이터 산림 데이터로 변환
- DEM 고도 데이터 및 나무 인스턴스 3D 모델 준비

#### mago3D 도구 설명
- **mago3DTerrainer**: 최적화된 지형 생성
  - DEM(GeoTIFF)를 입력 받아 단순한 커멘드로 지형 타일 생성
  - 고정밀 Quantized mesh 생성
  - 다해상도 DEM 타일 생성 지원
  - 지형 조명을 위한 Normal Vector 계산 지원
  - 다양한 사용자 정의 옵션 제공
- **mago3DTiler**: 3D Tiles 형식으로 변환 
  - 3DS, OBJ, FBX, Collada DAE, GlTF, GLB, IFC 등 다양한 포맷 지원
  - 높은 정확도의 LAS, LAZ 데이터 변환 
  - 높이 돌출 및 속성 매핑
  - 좌표계 변환 및 지형 드레이핑
  - 다양한 사용자 정의 옵션 제공

#### mago3D 실습
- mago3DTerrainer로 지형 생성
- mago3DTiler로 건물 3D 타일 생성
- mago3DTiler로 산림 3D 타일 생성
- mago3DTiler로 포인트 클라우드 3D 타일 생성

---

### [3. 시각화 가이드](guides/3_Visualization_Guide_Ko.md)

#### 3D 애플리케이션 구축
- 샘플 코드 구조 및 설정
- IDE에서 어플리케이션 실행
- 샘플 코드 설명
- 변환 옵션에 따른 결과물 확인

#### 결과물
- CesiumJS 뷰어에서 레이어 시각화
- 레이어 토글 및 속성 확인
- 완성된 3D 디지털 트윈 확인

---

### [선택: 하드웨어 가속](guides/Hardware_Acceleration_Ko.md)

#### GPU 가속 처리
- GPU 가속을 통한 데이터 처리 성능 최적화
- 접속 브라우저의 그래픽 가속 여부 확인
- 그래픽 가속 설정 전/후 성능 비교 실습

---

## 데이터셋 정보

이 워크샵은 **FOSS4G 개최 도시/지역의 실제 오픈 데이터**를 사용합니다:
- Overture Maps의 건물 풋프린트
- Overture Maps의 토지 이용 데이터
- LINZ Data Service의 고도 데이터
- LINZ Data Service의 항공 영상
- LINZ Data Service의 도로 네트워크 데이터
- LINZ Data Service의 포인트 클라우드 데이터

**대상 지역**: FOSS4G 2025 개최지 뉴질랜드 오클랜드 중심가

워크샵 중 데이터를 다운로드할 수 없는 참가자를 위해 [`public/`](public/) 디렉터리에 샘플 데이터셋이 제공됩니다.

---

## 샘플 코드

[`src/`](src/) 디렉터리에서 다음을 포함한 완전한 작동 예제를 확인할 수 있습니다:
- CesiumJS 기반 3D 웹 애플리케이션
- 지형, 항공 영상, 도로, 건물, 산림, 포인트 클라우드 레이어 로드
- 사용자 정의 인터랙션 및 시각화 설정

---

## 추가 자료

### 데이터 소스
- [Overture Maps](https://overturemaps.org/)
- [LINZ Data Service](https://data.linz.govt.nz/)

### 도구 및 라이브러리
- [Docker](https://www.docker.com/)
- [GDAL/OGR](https://gdal.org/)
- [mago3D Terrainer](https://github.com/Gaia3D/mago-3d-terrainer)
- [mago3D Tiler](https://github.com/Gaia3D/mago-3d-tiler)
- [OGC WMTS 표준](https://www.ogc.org/standard/wmts/)
- [CesiumJS](https://cesium.com/cesiumjs/)

---

## 지원 및 문의

**워크샵 강사:**
- 정연화, 가이아쓰리디, yhjeong@gaia3d.com
- 조성준, 가이아쓰리디, sjcho@gaia3d.com
- 윤정인, 가이아쓰리디, jiyoon@gaia3d.com

**기술 지원:**
- GitHub 이슈: [github.com/Gaia3D/mago3d-doc](https://github.com/Gaia3D/mago3d-doc)
- 공식 웹사이트: [www.mago3d.com](http://www.mago3d.com/)

---

## 라이선스

이 워크샵 자료는 Apache License 2.0 하에 제공됩니다.
mago3D 플랫폼은 Apache License 2.0 하에 라이선스가 부여된 오픈소스 소프트웨어입니다.

---

**함께 멋진 3D 디지털 트윈을 만들어 봅시다!**