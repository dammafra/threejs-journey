import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'

export default function Experience() {
  const cubeRef = useRef()
  const directionalLightRef = useRef()
  // useHelper(directionalLightRef, DirectionalLightHelper, 1)

  const lightformerRef = useRef()

  const { color, opacity, blur } = useControls('contact shadows', {
    color: '#1d8f75',
    opacity: { value: 0.4, min: 0, max: 1, step: 0.001 },
    blur: { value: 2.8, min: 0, max: 10, step: 0.001 },
  })

  // const { sunPosition } = useControls('sky', {
  //   sunPosition: { value: [1, 2, 3] },
  // })

  const { envMapIntensity } = useControls('environment map', {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
  })

  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime
    // cubeRef.current.position.x = 2 + Math.sin(time)
    cubeRef.current.rotation.y += delta * 0.2
    // lightformerRef.current.rotation.y += delta * 0.2
  })

  return (
    <>
      {/* <BakeShadows /> */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}
      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      />

      <color args={['ivory']} attach="background" />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <directionalLight
        ref={directionalLightRef}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      /> */}
      {/* <ambientLight intensity={1.5} /> */}

      {/* <Sky sunPosition={sunPosition} /> */}

      <Environment
        // files={[
        //   './environmentMaps/2/px.jpg',
        //   './environmentMaps/2/nx.jpg',
        //   './environmentMaps/2/py.jpg',
        //   './environmentMaps/2/ny.jpg',
        //   './environmentMaps/2/pz.jpg',
        //   './environmentMaps/2/nz.jpg',
        // ]}
        // files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
        // preset="sunset"
        environmentIntensity={envMapIntensity}
        background
        resolution={1024}
        // frames={Infinity}
      >
        <color args={['#000000']} attach="background" />
        {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
        <Lightformer
          ref={lightformerRef}
          position-z={-5}
          scale={10}
          color="red"
          intensity={10}
          form="ring"
        />
      </Environment>

      <mesh position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh ref={cubeRef} position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  )
}
