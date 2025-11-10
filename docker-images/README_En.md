# Docker Images Loading Scripts

This folder contains scripts to load all Docker images for the mago3D platform.

## Usage

### Linux / Mac / Git Bash (Windows)

```bash
cd docker-images
./load-images.sh
```

Or:

```bash
bash load-images.sh
```

### Windows PowerShell

```powershell
cd docker-images
.\load-images.ps1
```

If you encounter execution policy errors:

```powershell
# Allow execution for current session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\load-images.ps1
```

## Script Features

- Automatically detects all `.tar` files in the docker-images folder
- Loads each image sequentially into Docker
- Shows progress (e.g., [3/12] Loading: mago3d-geoserver_latest.tar)
- Displays success/failure statistics summary
- Lists loaded images after completion

## Included Docker Images

The tar files in this folder contain the following mago3D components:

- **mago3d-configrepo**: Configuration repository
- **mago3d-configserver**: Configuration server
- **mago3d-fluentd**: Log collector
- **mago3d-gdal-converter**: GDAL-based data converter
- **mago3d-geoserver**: Geospatial data server
- **mago3d-grafana**: Monitoring dashboard
- **mago3d-opensearch**: Search engine
- **mago3d-opensearch-dashboard**: Search dashboard
- **mago3d-postgresql**: Spatial database
- **mago3d-prometheus**: Metrics collector
- **mago3d-rabbitmq**: Message broker
- **mago3d-storage**: MinIO storage
- **mago3d-traefik**: Reverse proxy

## Verify After Loading

Check if images were successfully loaded:

```bash
docker images | grep mago3d
```

## Troubleshooting

### Docker is not running

```bash
# Linux
sudo systemctl start docker

# macOS
# Start Docker Desktop application

# Windows
# Start Docker Desktop application
```

### Permission errors (Linux)

```bash
sudo ./load-images.sh
```

### Insufficient disk space

Ensure you have enough disk space before loading. All images require approximately 10GB or more.

```bash
docker system df
```

## Notes

- The loading process may take several minutes depending on image sizes and system performance
- `.docker_temp_*` files are temporary and will not be loaded
- Each image is loaded independently, so if one fails, others will continue to load
