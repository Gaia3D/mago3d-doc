#!/bin/bash
# upload_and_cleanup.sh
# 사용법: ./upload_and_cleanup.sh {tiles_folder}

TILES=$1
CONTAINER=mago3d-storage-1
BUCKET=myminio/mdtp/${TILES}

if [ -z "$TILES" ]; then
  echo "사용법: $0 {tiles_folder}"
  exit 1
fi

echo "[1/5] 호스트에서 컨테이너로 복사..."
docker cp ~/${TILES} ${CONTAINER}:/home

echo "[2/5] MinIO alias 확인 및 설정..."
ALIAS_EXISTS=$(docker exec ${CONTAINER} mc alias list | grep -c "myminio" || true)
if [ "${ALIAS_EXISTS}" -eq 0 ]; then
  echo "alias 'myminio' 없음. 새로 설정합니다..."
  docker exec ${CONTAINER} mc alias set myminio http://localhost:9000 minioadmin !mago3dmago#d!
  echo "alias 설정 완료."
else
  echo "alias 'myminio' 확인됨."
fi

echo "[3/5] MinIO 버킷에 업로드..."
docker exec ${CONTAINER} mc cp --recursive /home/${TILES}/ ${BUCKET}

echo "[4/5] 업로드 검증..."
# 호스트에서 카운트 (컨테이너 내부 명령어 의존 없음)
LOCAL_COUNT=$(find ~/${TILES} -type f | wc -l)
BUCKET_COUNT=$(docker exec ${CONTAINER} mc ls ${BUCKET}/ --recursive | wc -l)

echo "원본 파일 수: ${LOCAL_COUNT}, 버킷 파일 수: ${BUCKET_COUNT}"

if [ "${LOCAL_COUNT}" -eq "${BUCKET_COUNT}" ]; then
  echo "[5/5] 업로드 확인 완료. 임시 파일 제거..."
  docker exec ${CONTAINER} rm -rf /home/${TILES}
  echo "정리 완료."
else
  echo "[오류] 파일 수 불일치! 임시 파일을 유지합니다."
  echo "수동으로 확인 후 제거하세요: docker exec ${CONTAINER} rm -rf /home/${TILES}"
  exit 1
fi