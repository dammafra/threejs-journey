import {
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Text,
} from '@react-three/drei'
import { Suspense } from 'react'
import Macbook from './Macbook'

const sites = [
  { url: 'https://dammagotchi.vercel.app', color: '#ffffff' },
  { url: 'https://drysland.vercel.app', color: '#76B0C3' },
  { url: 'https://templerumble.vercel.app', color: '#6E5437' },
]

const randomSite = sites[Math.floor(Math.random() * sites.length)]

export default function Experience() {
  return (
    <>
      <color args={['#FFC109']} attach="background" />

      <Environment preset="apartment" />

      <PresentationControls global rotation={[0.13, 0.1, 0]} polar={[-0.4, 0.2]} damping={0.5} snap>
        <Float rotationIntensity={0.4}>
          <Suspense>
            <group position={[0, 0, -1.55]} rotation-x={-0.35}>
              <Html
                transform
                wrapperClass="html-screen"
                distanceFactor={1.7}
                scale={0.7}
                occlude="blending"
              >
                <iframe src={randomSite.url} />
                <a className="overlay" target="_blank" href={randomSite.url} />
              </Html>
              <rectAreaLight
                width={3}
                height={2}
                intensity={65}
                color={randomSite.color}
                rotation-y={Math.PI}
              />
              <mesh position-z={0.03} scale={[3, 2, 1]}>
                <planeGeometry />
                <meshStandardMaterial
                  transparent
                  opacity={0.1}
                  roughness={0}
                  metalness={1}
                  color="white"
                />
              </mesh>
            </group>
            <Macbook scale={0.1} position-y={-1}></Macbook>
          </Suspense>
        </Float>
        <Text
          font="./fonts/MonomaniacOne-Regular.ttf"
          fontSize={1}
          position={[2, 0.5, 0.75]}
          rotation-y={-1.25}
          textAlign="center"
          color="#0077b6"
        >
          dammafra
        </Text>
      </PresentationControls>

      <ContactShadows position-y={-2} opacity={0.4} scale={5} blur={2.4} far={3} />
    </>
  )
}
