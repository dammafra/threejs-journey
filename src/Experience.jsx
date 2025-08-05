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
import { Suspense, useEffect, useRef } from 'react'
import Macbook from './Macbook'

const sites = [
  { url: 'https://dammagotchi.vercel.app', color: '#ffffff' },
  { url: 'https://drysland.vercel.app', color: '#76B0C3' },
  { url: 'https://templerumble.vercel.app', color: '#6E5437' },
]

const randomSite = sites[Math.floor(Math.random() * sites.length)]
const AnimatedText = animated(Text)

export default function Experience({ debug }) {
  const { aspect } = useThree(state => state.viewport)
  const cameraControlsRef = useRef()

  const titleSprings = useSpring({
    position: aspect > 1 ? [2, 0.5, 0.75] : [-0.05, 3, 0.75],
    rotationY: aspect > 1 ? -1.25 : 0,
    fontSize: aspect > 1 ? 1 : 0.5,
  })

  useEffect(() => {
    cameraControlsRef.current.enabled = true

    if (aspect > 1) {
      cameraControlsRef.current.moveTo(0, 0, 0, true)
      cameraControlsRef.current.setPosition(-3, 1.5, 4, true)
    } else {
      cameraControlsRef.current.moveTo(0, 1.5, 0, true)
      cameraControlsRef.current.setPosition(0, 3, 6, true)
    }

    cameraControlsRef.current.enabled = false
  }, [aspect])

  return (
    <>
      <Environment preset="apartment" />
      <CameraControls ref={cameraControlsRef} />

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
                {!debug && <iframe src={randomSite.url} />}
                <a className="overlay" target="_blank" href={randomSite.url} />
              </Html>
              <rectAreaLight
                width={3}
                height={2}
                intensity={65}
                color={randomSite.color}
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

      <ContactShadows position-y={-2} opacity={0.4} scale={5} blur={2.4} far={3} />
    </>
  )
}
