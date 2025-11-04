# mago3d-tiler practice

```bash
docker run --rm carped99/mdtp-mago3d-tiler:latest --help
```

```bash
docker run --rm -v .\sample:/data carped99/mdtp-mago3d-tiler:latest -it geojson 
-hc height -c 4326 -mh 3.3 -te /data/input/dem.tif --input /data/input --output /data/assets/3dtiles
```

# mago3d-terrainer practice

```bash
docker run --rm carped99/mdtp-mago3d-terrainer:latest --help
```

```bash
docker run --rm -v .\sample:/data carped99/mdtp-mago3d-terrainer:latest 
-cn -it bilinear -mn 0 -mx 16 --input /data/input --output /data/assets/terrain
```