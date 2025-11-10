# mago3D Installation Guide

---

This document provides instructions on how to install mago3D using Docker Compose.

## Prerequisites
* An environment with Docker installed
* An environment with a localhost certificate installed
* An environment with git installed (https://github.com/git-guides/install-git)

Start the Docker daemon.  
For Windows, launch Docker Desktop.  
For Mac, launch Docker Desktop.  
For Linux, start the Docker service.  

### How to Install Certificate
Generate a localhost certificate using [mkcert](https://github.com/FiloSottile/mkcert)

* winget(Windows)    
  Run the following command in an elevated PowerShell terminal (as an administrator).
  ```powershell
  winget install mkcert
  ```
* brew(macOS)
  ```bash
  brew install mkcert
  ```

* Install the local CA
  ```cmd
  mkcert -install
  ```

* Generate the certificate
  ```cmd
  mkdir certs
  ```
  ```cmd
  cd certs
  ```
  ```cmd
  mkcert -cert-file default.crt -key-file default.key localhost dev.localhost *.localhost
  ```

If a certificate is installed on the server
Copy the certificate and place it in the `certs` path.

### Windows Users Notice

If you are using Docker Desktop on Windows, make sure the following is configured for volume mounts to work properly:

1. **Docker Desktop Settings Check**
   - Docker Desktop > Settings > Resources > File Sharing
   - Ensure `C:\` drive is in the shared list
   - Add it and Apply & Restart if not present

2. **Using WSL2** (Recommended)
   - Docker Desktop > Settings > General
   - Check "Use the WSL 2 based engine"
   - WSL2 improves file mount performance

3. **Path Issue Resolution**
   - Execute scripts from the `install` directory
   - Ensure working directory is correct for relative paths (`./certs`) to be recognized

## 2. Create Docker Network
Run the following command to create the Docker Network.
```bash
docker network create mago3d
```

## 3. Deploy using Docker Compose

### Linux / Mac / Git Bash (Windows)

```bash
cd install
./compose.sh up -d
```
If you don't have execution permissions, run the following command
```bash
chmod +x *.sh
./compose.sh up -d
```

If you want to stop it, run the following command.
```bash
./compose.sh down
```

### Windows (CMD / PowerShell)

```cmd
cd install
compose.bat up -d
```

If you want to stop it, run the following command.
```cmd
compose.bat down
```

### Compose Script Usage

#### Available Commands
- `config`: Outputs the final config file, after doing merges and interpolations
- `build`: Build or rebuild services
- `push`: Push service images
- `up`: Create and start containers
- `down`: Stop and remove containers
- `ps`: List containers
- `logs`: View output from containers

#### Options
- `--env-file <path>`: Specify an environment file (default: .env.compose)
- `-h, --help`: Print help message

#### Usage Examples

```bash
# Linux/Mac/Git Bash
./compose.sh up -d                           # Start in background
./compose.sh logs -f                         # View logs in real-time
./compose.sh ps                              # List running containers
./compose.sh down                            # Stop and remove containers
./compose.sh --env-file .env.prod up -d      # Use custom environment file
```

```cmd
REM Windows
compose.bat up -d                            REM Start in background
compose.bat logs -f                          REM View logs in real-time
compose.bat ps                               REM List running containers
compose.bat down                             REM Stop and remove containers
compose.bat --env-file .env.prod up -d       REM Use custom environment file
```

If Docker Hub access is unstable, load the *.tar files in the `/docker-images` directory first, then run `./compose.sh up -d` (Linux/Mac) or `compose.bat up -d` (Windows).

### Docker Image Loading

#### Linux / Mac / Git Bash (Windows)

```bash
cd docker-images
./load-images.sh
```

Or:

```bash
bash load-images.sh
```

#### Windows PowerShell

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

#### Script Features

- Automatically detects all `.tar` files in the docker-images folder
- Loads each image sequentially into Docker
- Shows progress (e.g., [3/12] Loading: mago3d-geoserver_latest.tar)
- Displays success/failure statistics summary
- Lists loaded images after completion

#### Included Docker Images

The tar files in this folder contain the following mago3D components:

- **mago3d-postgresql**: Spatial database
- **mago3d-geoserver**: Geospatial data server
- **mago3d-keycloak**: Authentication and authorization management
- **mago3d-rabbitmq**: Message broker
- **mago3d-storage**: Storage server
- **mago3d-traefik**: Reverse proxy
- **mago3d-configrepo**: Configuration repository
- **mago3d-configserver**: Configuration server
- **mago3d-fluentd**: Log collector
- **mago3d-prometheus**: Metrics collector
- **mago3d-grafana**: Monitoring dashboard
- **mago3d-opensearch**: Search engine
- **mago3d-opensearch-dashboard**: Search dashboard
- **mago3d-gdal-converter**: GDAL data converter
- **mago3d-t3d-converter**: 3D tile generator
- **mago3d-f4d-converter**: F4D tile generator
- **mago3d-terrain-converter**: Terrain data generator
- **mago3d-dataset-app**: Dataset management application
- **mago3d-layerset-app**: Layerset management application
- **mago3d-userset-app**: User management application
- **mago3d-frontend**: Frontend application
- **mago3d-api-doc**: API documentation server

#### Verify After Loading

Check if images were successfully loaded:

```bash
docker images | grep mago3d
```

#### Troubleshooting

##### Docker is not running

```bash
# Linux
sudo systemctl start docker

# macOS
# Start Docker Desktop application

# Windows
# Start Docker Desktop application
```

##### Permission errors (Linux)

```bash
sudo ./load-images.sh
```

##### Insufficient disk space

Ensure you have enough disk space before loading. Approximately 13GB or more is required.

```bash
docker system df
```

##### Windows Volume Mount Errors

If you encounter `Error response from daemon: invalid mount config` or certs-related errors on Windows:

1. **Check Working Directory**
   ```cmd
   cd C:\Users\user\IdeaProjects\mago3d-doc\install
   compose.bat config
   ```
   - Use config command to verify volume paths are correct

2. **Restart Docker Desktop**
   - Completely quit and restart Docker Desktop
   - Re-share drives in Settings > Resources > File Sharing

3. **Use Absolute Paths** (Last resort)
   - Modify docker-compose.base.yml file
   - Change `./certs` → `C:/Users/user/IdeaProjects/mago3d-doc/install/certs`
   - Note: This may cause compatibility issues in other environments

4. **Use WSL2 Paths** (When using WSL2)
   - Clone project inside WSL2
   - Use WSL2 filesystem (`~/projects/mago3d-doc`) instead of `/mnt/c/` path

#### Notes

- The loading process may take several minutes depending on image sizes and system performance
- `.docker_temp_*` files are temporary and will not be loaded
- Each image is loaded independently, so if one fails, others will continue to load

### 4. Check Access
* https://dev.localhost/dashboard/  
  ![traefik.png](../images/Installation_Guide/traefik.png)

* https://dev.localhost/auth/  
  ![keycloak.png](../images/Installation_Guide/keycloak.png)
* Account: admin/keycloak

* https://dev.localhost/configrepo/  
  ![configrepo.png](../images/Installation_Guide/configrepo.png)
* Account: git/git

* https://dev.localhost/geoserver/  
  ![geoserver.png](../images/Installation_Guide/geoserver.png)
* Account: admin/geoserver

* https://dev.localhost/minio/console/login  
  ![minio.png](../images/Installation_Guide/minio.png)
* Account: minioadmin/minioadmin

* https://dev.localhost/rabbitmq/  
  ![rabbitmq.png](../images/Installation_Guide/rabbitmq.png)
* Account: admin/admin

* https://dev.localhost/prometheus/query  
  ![prometheus.png](../images/Installation_Guide/prometheus.png)

* https://dev.localhost/grafana/   
  ![grafana.png](../images/Installation_Guide/grafana.png)
* Account: admin/admin

* https://dev.localhost/user  
* Account: admin/admin
* After logging in, access the user page
  ![user-page.png](../images/Installation_Guide/user-page.png)

* https://dev.localhost/admin  
* Account: admin/admin
* After logging in, access the admin page
  ![admin-page.png](../images/Installation_Guide/admin-page.png)
