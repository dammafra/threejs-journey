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

export default function Experience() {
  const sites = [
    { url: 'https://dammagotchi.vercel.app', color: '#ffffff' },
    { url: 'https://drysland.vercel.app', color: '#76B0C3' },
    { url: 'https://templerumble.vercel.app', color: '#6E5437' },
  ]

  const randomSite = sites[Math.floor(Math.random() * sites.length)]

  return (
    <>
      <color args={['#FFC109']} attach="background" />

      <Environment preset="city" />

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.5]}
        damping={0.1}
        snap
      >
        <Float rotationIntensity={0.4}>
          <group position={[0, 0, -1.58]} rotation-x={-0.35}>
            <Html transform wrapperClass="html-screen" distanceFactor={1.7} scale={0.7}>
              <iframe src={randomSite.url} />
              <div className="overlay" onClick={() => window.open(randomSite.url)} />
            </Html>
            <rectAreaLight
              width={3}
              height={2}
              intensity={65}
              color={randomSite.color}
              rotation-y={Math.PI}
            />
          </group>
          <Suspense>
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
