# Nginx 기반 이미지 사용
FROM nginx:latest

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 HTML 파일 및 리소스 복사
COPY . /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]