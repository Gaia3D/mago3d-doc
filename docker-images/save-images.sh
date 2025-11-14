#!/bin/bash

# 이미지 목록을 배열로 정의
IMAGES=(
  "mago3d-fluentd:latest"
  "mago3d-prometheus:latest"
  "mago3d-grafana:latest"
  "mago3d-configrepo:latest"
  "mago3d-configserver:latest"
  "alpine:latest"
  "mago3d-postgresql:latest"
  "mago3d-geoserver:latest"
  "mago3d-keycloak:latest"
  "mago3d-opensearch:latest"
  "mago3d-opensearch-dashboard:latest"
  "mago3d-rabbitmq:latest"
  "mago3d-storage:latest"
  "mago3d-traefik:latest"
  "mago3d-gdal-converter:latest"
  "mago3d-t3d-converter:latest"
  "mago3d-f4d-converter:latest"
  "mago3d-terrain-converter:latest"
  "mago3d-dataset-app:latest"
  "mago3d-userset-app:latest"
  "mago3d-layerset-app:latest"
  "mago3d-api-doc:latest"
  "mago3d-frontend:latest"
)

# Docker Registry 변수
REGISTRY="gaia3d"

# 이미지 저장 루프
for IMAGE in "${IMAGES[@]}"; do
  FULL_IMAGE="${REGISTRY}/${IMAGE}"
  TAR_FILE="${IMAGE//:/_}.tar"

  echo "Saving image: $FULL_IMAGE to $TAR_FILE"

  # 이미지 Save
  docker save -o "$TAR_FILE" "$FULL_IMAGE"

  echo "Saved $FULL_IMAGE to $TAR_FILE"
done

echo "All images have been saved."