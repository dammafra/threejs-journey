# Three.js Journey

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:5173
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Going Further

- [ ] Add more tweaks
- [ ] Test with other planet textures
- [ ] Rotate the earth according to the real-life rotation relative to the sun
- [ ] Animate the clouds by adding some displacement on the UV
- [ ] Create clouds using a Perlin function or a Perlin texture
- [ ] Add [Lensflare](https://threejs.org/docs/#examples/en/objects/Lensflare) ([example](https://threejs.org/examples/#webgl_lensflares)) for the sun (textures are provided in `static/lenses/`).
- [x] Add stars or a Milky Way environment map in the back
