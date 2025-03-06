# Three.js Journey

![](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white)
![](https://img.shields.io/badge/OpenGL-FFFFFF?style=for-the-badge&logo=opengl)
![](https://img.shields.io/badge/blender-%23F5792A.svg?style=for-the-badge&logo=blender&logoColor=white)
![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

This repository contains the exercises completed as part of the [Three.js Journey](https://threejs-journey.com/) course by [Bruno Simon](https://bruno-simon.com/).

## Lessons

### Chapter 01 - Basics

3.  [First Three.js project](https://dammafra-03-first-threejs-project.vercel.app)
4.  [Transform objects](https://dammafra-04-transform-objects.vercel.app)
5.  [Animations](https://dammafra-05-animations.vercel.app)
6.  [Cameras](https://dammafra-06-cameras.vercel.app)
7.  [Fullscreen and resizing](https://dammafra-07-fullscreen-and-resizing.vercel.app)
8.  [Geometries](https://dammafra-08-geometries.vercel.app)
9.  [Debug UI](https://dammafra-09-debug-ui.vercel.app)
10. [Textures](https://dammafra-10-textures.vercel.app)
11. [Materials](https://dammafra-11-materials.vercel.app)
12. [3D text](https://dammafra-12-3d-text.vercel.app)
13. [Go live](https://dammafra-13-go-live.vercel.app)

### Chapter 02 - Classic Techniques

14. [Lights](https://dammafra-14-lights.vercel.app)
15. [Shadows](https://dammafra-15-shadows.vercel.app)
16. [Haunted house](https://dammafra-16-haunted-house.vercel.app)
17. [Particles](https://dammafra-17-particles.vercel.app)
18. [Galaxy generator](https://dammafra-18-galaxy-generator.vercel.app)
19. [Scroll based animation](https://dammafra-19-scroll-based-animation.vercel.app)

### Chapter 03 - Advanced Techniques

20. [Physics](https://dammafra-20-physics.vercel.app)
21. [Imported models](https://dammafra-21-imported-models.vercel.app)
22. [Raycaster and mouse events](https://dammafra-22-raycaster-and-mouse-events.vercel.app)
23. [Custom models with Blender](https://dammafra-23-custom-models-with-blender.vercel.app)
24. [Environment map](https://dammafra-24-environment-map.vercel.app)
25. [Realistic render](https://dammafra-25-realistic-render.vercel.app)
26. [Code structuring for bigger projects](https://dammafra-26-code-structuring-for-bigger-projects.vercel.app)

### Chapter 04 - Shaders

27. [Shaders](https://dammafra-27-shaders.vercel.app)
28. [Shader patterns](https://dammafra-28-shader-patterns.vercel.app)
29. [Raging sea](https://dammafra-29-raging-sea.vercel.app)
30. [Animated galaxy](https://dammafra-30-animated-galaxy.vercel.app)
31. [Modified Materials](https://dammafra-31-modified-materials.vercel.app)
32. TBD

## Challenges

16. February 2025 - [Tamagotchi](https://dammafra-challenges-016-tamagotchi.vercel.app)

<hr />

## Setup

Each lesson is developed in a separate branch.

1. Create a new branch using the kebab-case format,
   for example `01-first-lesson`.
2. Checkout to the new branch
3. Unzip the starter provided in the course lesson
4. Run the following command:

   ```bash
   npm i && npm i prettier --save-dev && npm pkg set scripts.format="prettier --write ." && npm run format
   ```

   - Installs all the lesson dependencies
   - Adds `prettier` as a development dependency
   - Adds a `format` script to the `package.json` file
   - Runs the `format` script to automatically format the project files with `prettier`

## Deploy

Each push to a branch initiates a deployment to a separate Vercel project for every lesson.

Each lesson will be available live at `dammafra.<branch-name>.vercel.app`.

[Go to the Vercel Dashboard](https://vercel.com/dammafras-projects)
