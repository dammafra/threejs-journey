import { Clone, useGLTF } from '@react-three/drei'

useGLTF.preload('./models/hamburger-draco.glb')

export default function Model() {
  const model = useGLTF('./models/hamburger-draco.glb')
  return (
    <>
      <Clone object={model.scene} scale={0.35} position-x={-4} />
      <Clone object={model.scene} scale={0.35} />
      <Clone object={model.scene} scale={0.35} position-x={4} />
    </>
  )
}
