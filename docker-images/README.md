# Docker Images Loading Scripts

이 폴더에는 mago3D 플랫폼의 모든 Docker 이미지를 로드하는 스크립트가 포함되어 있습니다.

## 사용 방법

### Linux / Mac / Git Bash (Windows)

```bash
cd docker-images
./load-images.sh
```

또는:

```bash
bash load-images.sh
```

### Windows PowerShell

```powershell
cd docker-images
.\load-images.ps1
```

만약 실행 정책 오류가 발생하면:

```powershell
# 현재 세션에서만 실행 허용
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\load-images.ps1
```

## 스크립트 기능

- docker-images 폴더 내의 모든 `.tar` 파일을 자동으로 감지
- 각 이미지를 순차적으로 Docker에 로드
- 진행 상황 표시 (예: [3/12] Loading: mago3d-geoserver_latest.tar)
- 성공/실패 통계 요약
- 로드 완료 후 이미지 목록 표시

## 포함된 Docker 이미지

이 폴더의 tar 파일들은 다음 mago3D 컴포넌트를 포함합니다:

- **mago3d-postgresql**: 공간 데이터베이스
- **mago3d-geoserver**: 지리공간 서버
- **mago3d-keycloak**: 인증 서버
- **mago3d-rabbitmq**: 메시지 브로커
- **mago3d-storage**: 스토리지 서버
- **mago3d-traefik**: 리버스 프록시
- **mago3d-configrepo**: 설정 저장소
- **mago3d-configserver**: 설정 서버
- **mago3d-fluentd**: 로그 수집기
- **mago3d-prometheus**: 메트릭 수집기
- **mago3d-grafana**: 모니터링 대시보드
- **mago3d-opensearch**: 검색 엔진
- **mago3d-opensearch-dashboard**: 검색 대시보드
- **mago3d-gdal-converter**: GDAL 기반 데이터 변환기
- **mago3d-t3d-converter**: 3DTiles 데이터 변환기
- **mago3d-terrain-converter**: Terrain 데이터 변환기
- **mago3d-dataset-app**: 데이터셋 관리 애플리케이션
- **mago3d-layerset-app**: 레이어셋 관리 애플리케이션
- **mago3d-userset-app**: 사용자 관리 애플리케이션
- **mago3d-frontend**: mago3D 웹 프론트엔드
- **mago3d-api-doc**: API 문서 어플리케이션

## 로드 후 확인

이미지가 성공적으로 로드되었는지 확인:

```bash
docker images | grep mago3d
```

## 문제 해결

### Docker가 실행 중이 아닌 경우

```bash
# Linux
sudo systemctl start docker

# macOS
# Docker Desktop 애플리케이션 시작

# Windows
# Docker Desktop 애플리케이션 시작
```

### 권한 오류 (Linux)

```bash
sudo ./load-images.sh
```

### 디스크 공간 부족

로드하기 전에 충분한 디스크 공간이 있는지 확인하세요. 약 13GB 이상의 공간이 필요합니다.

```bash
docker system df
```

## 참고

- 로드 과정은 이미지 크기와 시스템 성능에 따라 몇 분이 소요될 수 있습니다
- `.docker_temp_*` 파일은 임시 파일이므로 로드되지 않습니다
- 각 이미지는 독립적으로 로드되므로 하나가 실패해도 다른 이미지는 계속 로드됩니다
