import { useLoader } from '@react-three/fiber'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'

export default function Model() {
  // prettier-ignore
  const model = useLoader(
    GLTFLoader, 
    './models/FlightHelmet/glTF/FlightHelmet.gltf', 
    loader => loader.setDRACOLoader(new DRACOLoader().setDecoderPath('./draco/'))
  )

  return <primitive object={model.scene} scale={5} position-y={-1} />
}
