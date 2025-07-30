import { OrbitControls } from '@react-three/drei'
import { EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { ToneMappingMode } from 'postprocessing'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'
import Drunk from './Drunk'

export default function Experience() {
  const drunkRef = useRef()

  useEffect(() => {
    console.log(drunkRef.current)
  }, [])

  const drunkProps = useControls({
    frequency: { value: 12, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
  })

  return (
    <>
      <color args={['#fffff0']} attach="background" />

      <EffectComposer
        multisampling={8} //default
      >
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL} // default
        /> */}
        {/* <Glitch
          mode={GlitchMode.SPORADIC} // default
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
        /> */}
        {/* <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} /> */}
        {/* <Bloom mipmapBlur intensity={0.1} luminanceThreshold={0} /> */}
        {/* <DepthOfField focusDistance={0.025} focalLength={0.025} bokehScale={6} /> */}
        <Drunk ref={drunkRef} {...drunkProps} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
        {/* Bloom */}
        {/* <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={10} /> */}
        {/* <meshBasicMaterial color={[1.5 * 10, 1 * 10, 4 * 10]} /> */}
      </mesh>

      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  )
}
