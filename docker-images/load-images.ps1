# Docker Images Loading Script (PowerShell)
# This script loads all .tar files in the current directory into Docker

# Set error action preference
$ErrorActionPreference = "Stop"

# Get the directory where the script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Docker Images Loading Script" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Find all .tar files in the directory (excluding temp files)
$TarFiles = Get-ChildItem -Path $ScriptDir -Filter "*.tar" -File |
    Where-Object { -not $_.Name.StartsWith(".") } |
    Sort-Object Name

if ($TarFiles.Count -eq 0) {
    Write-Host "Error: No .tar files found in $ScriptDir" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($TarFiles.Count) Docker image(s) to load" -ForegroundColor Green
Write-Host ""

# Counter for tracking progress
$Loaded = 0
$Failed = 0
$Total = $TarFiles.Count
$Counter = 0

# Load each tar file
foreach ($TarFile in $TarFiles) {
    $Counter++
    Write-Host "[$Counter/$Total] Loading: " -NoNewline -ForegroundColor Yellow
    Write-Host "$($TarFile.Name)" -ForegroundColor Blue

    try {
        docker load -i $TarFile.FullName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Successfully loaded: $($TarFile.Name)" -ForegroundColor Green
            $Loaded++
        } else {
            throw "Docker load returned exit code: $LASTEXITCODE"
        }
    }
    catch {
        Write-Host "✗ Failed to load: $($TarFile.Name)" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $Failed++
    }
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Total images: $Total"
Write-Host "Successfully loaded: $Loaded" -ForegroundColor Green
if ($Failed -gt 0) {
    Write-Host "Failed: $Failed" -ForegroundColor Red
}
Write-Host ""

# List loaded images
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Loaded Docker Images" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
docker images | Select-String -Pattern "mago3d|REPOSITORY"
if (-not $?) {
    docker images
}

exit 0
