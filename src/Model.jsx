import { useGLTF } from '@react-three/drei'

useGLTF.preload('./models/hamburger-draco.glb')

export default function Model() {
  const model = useGLTF('./models/hamburger-draco.glb')
  return <primitive object={model.scene} scale={0.35} />
}
