import { useAnimations, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'

export default function Model() {
  const model = useGLTF('./models/Fox/glTF-Binary/Fox.glb')
  const animations = useAnimations(model.animations, model.scene)

  const { animation } = useControls({ animation: { options: animations.names } })

  useEffect(() => {
    model.scene.traverse(child => (child.castShadow = true))

    const action = animations.actions[animation]
    action.reset().fadeIn(0.5).play()

    return () => action.fadeOut(0.5)
  }, [animation])

  return <primitive object={model.scene} scale={0.02} position={[-2.5, 0, 2.5]} rotation-y={0.3} />
}

useGLTF.preload('./models/Fox/glTF-Binary/Fox.glb')
