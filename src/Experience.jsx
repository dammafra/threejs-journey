import { animated, useSpring } from '@react-spring/three'
import {
  CameraControls,
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Text,
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import Macbook from './Macbook'

const debugSite = { url: 'https://bruno-simon.com/html', color: '#ffffff' }

const sites = [
  { url: 'https://drysland.vercel.app', color: '#76B0C3' },
  { url: 'https://templerumble.vercel.app', color: '#6E5437' },
  { url: 'https://dammagotchi.vercel.app', color: '#ffffff' },
]

const randomSite = sites[Math.floor(Math.random() * sites.length)]

const AnimatedText = animated(Text)

export default function Experience({ debug }) {
  const [site, _setSite] = useState(debug ? debugSite : randomSite)

  const { aspect } = useThree(state => state.viewport)
  const cameraControlsRef = useRef()

  const titleSprings = useSpring({
    position: aspect > 1 ? [2, 0, 0.75] : [-0.05, 2.5, 0.75],
    rotationY: aspect > 1 ? -1.25 : 0,
    fontSize: aspect > 1 ? 1 : 0.6,
  })

  useEffect(() => {
    if (aspect > 1) {
      cameraControlsRef.current.moveTo(0, -0.25, 0, true)
      cameraControlsRef.current.setPosition(-3, 1.5, 4, true)
    } else {
      cameraControlsRef.current.moveTo(0, 0.5, 0, true)
      cameraControlsRef.current.setPosition(0, 3, 8, true)
    }
  }, [aspect])

  return (
    <>
      <PresentationControls global rotation={[0.13, 0.1, 0]} polar={[-0.4, 0.2]} damping={0.1} snap>
        <Suspense>
          <Float rotationIntensity={0.4}>
            <group position={[0, 0, -1.55]} rotation-x={-0.35}>
              <Html
                transform
                className="html-screen"
                distanceFactor={1.7}
                scale={0.7}
                occlude="blending"
                zIndexRange={[0, 1]}
              >
                <iframe src={site.url} />
                {!debug && <a className="overlay" target="_blank" href={site.url} />}
              </Html>
              <rectAreaLight
                width={3}
                height={2}
                intensity={65}
                color={site.color}
                rotation-y={Math.PI}
              />
              {!debug && (
                <mesh position-z={0.001} scale={[3.05, 2, 1]}>
                  <planeGeometry />
                  <meshStandardMaterial transparent opacity={0.1} roughness={0} metalness={1} />
                </mesh>
              )}
            </group>
            <Macbook scale={0.1} position-y={-1}></Macbook>
          </Float>

          <Float rotationIntensity={0.5}>
            <AnimatedText
              font="./fonts/MonomaniacOne-Regular.ttf"
              position={titleSprings.position}
              rotation-y={titleSprings.rotationY}
              fontSize={titleSprings.fontSize}
              textAlign="center"
              color="#0077b6"
            >
              dammafra
            </AnimatedText>
          </Float>
        </Suspense>
      </PresentationControls>

      <Environment preset="apartment" />
      <ContactShadows position-y={-2} opacity={0.4} scale={5} blur={2.4} far={3} />
      <CameraControls enabled={false} ref={cameraControlsRef} />
    </>
  )
}
