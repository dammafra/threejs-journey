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

Here are some improvement ideas:

- [ ] Introduction animation where objects come up when ready and loaded;
- [ ] Sounds (don’t forget that the user needs to interact with the page through a click or a keyboard press before being able to play sounds);
- [ ] Make the camera zoom in on the screen when hovering over it (currently, the UX is really bad and it’s hard to read);
- [ ] Easter eggs;
- [ ] A better environment with objects in the back, particles, etc. (here’s a good inspiration https://codesandbox.io/s/interactive-spline-scene-live-html-f79ucc);
- [ ] Reflections on the screen (this one might be tricky because you need to create them inside the <Html> as HTML/CSS content because the iframe is on top of the WebGL);
- [ ] Improve the actual content of the iframe;
- [ ] Make it mobile friendly.
