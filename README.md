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

- [x] Refactor the part where we create particles.positions. We kept it simple, but you can improve it.
- [ ] Add a small movement to the particles at all times to add more life to the experience.
- [ ] Add your own models.
- [ ] Add more particles. I used a modest number of particles composing the shapes, but you can increase it by tenfold without performance issues.
- [ ] Add some particles everywhere because the only particles we have right now are the ones from the models.
- [ ] Add more tweaks to control the transition, especially for the amplitude variable which can drastically change the look and feel of the animation.
