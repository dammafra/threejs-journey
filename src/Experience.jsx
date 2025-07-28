import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'
import { MeshMatcapMaterial, SRGBColorSpace, TorusGeometry } from 'three'

const torusGeometry = new TorusGeometry(1, 0.6, 16, 32)
const material = new MeshMatcapMaterial()

export default function Experience() {
  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)
  matcapTexture.colorSpace = SRGBColorSpace

  // const [torusGeometry, setTorusGeometry] = useState()
  // const [material, setMaterial] = useState()

  useEffect(() => {
    material.matcap = matcapTexture
    material.needsUpdate = true
  }, [])

  // const donutsGroup = useRef()
  const donuts = useRef([])

  useFrame((state, delta) => {
    // for (const donut of donutsGroup.current.children) {
    //   donut.rotation.y += delta * 0.2
    // }

    for (const donut of donuts.current) {
      donut.rotation.y += delta * 0.2
    }
  })

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} /> */}
      {/* <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}

      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          material={material}
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
        </Text3D>
      </Center>

      {/* <group ref={donutsGroup}> */}
      {[...Array(100)].map((_, index) => (
        <mesh
          ref={donut => (donuts.current[index] = donut)}
          key={index}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
      {/* </group> */}
    </>
  )
}
