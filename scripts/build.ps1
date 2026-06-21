# Build script for copying public files to dist
$ErrorActionPreference = "Stop"

$publicDir = Join-Path $PSScriptRoot "public"
$distDir = Join-Path $PSScriptRoot "dist"

# Create dist directory if not exists
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

# Copy all files from public to dist
Get-ChildItem -Path $publicDir -File | ForEach-Object {
    Copy-Item $_.FullName -Destination $distDir -Force
    Write-Host "Copied: $($_.Name)"
}

# Also copy subdirectories
Get-ChildItem -Path $publicDir -Directory | ForEach-Object {
    $targetDir = Join-Path $distDir $_.Name
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Get-ChildItem -Path $_.FullName -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($publicDir.Length + 1)
        $targetPath = Join-Path $distDir $relativePath
        $targetSubDir = Split-Path $targetPath -Parent
        if (-not (Test-Path $targetSubDir)) {
            New-Item -ItemType Directory -Path $targetSubDir -Force | Out-Null
        }
        Copy-Item $_.FullName -Destination $targetPath -Force
        Write-Host "Copied: $relativePath"
    }
}

Write-Host "Build completed!"
