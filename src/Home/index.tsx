import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Camera, CameraType, FaceDetectionResult } from "expo-camera"
import * as FaceDetector from "expo-face-detector"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  camera: {
    flex: 1,
  },
})

export function Home() {
  const [faceDetected, setFaceDetected] = useState(false)
  const [permission, requestPermission] = Camera.useCameraPermissions()

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
    borderColor: "blue",
    borderWidth: 10,
  }))

  function handleFaceDetected({ faces }: FaceDetectionResult) {
    //console.log("=== faces ===", faces)
    const face = faces[0] as any

    if (face) {
      const { size, origin } = face.bounds

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      }

      setFaceDetected(true)
    } else {
      setFaceDetected(false)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])

  if (!permission?.granted) {
    return console.log("Sem permissão para usar a camera")
  }

  return (
    <View style={styles.container}>
      {faceDetected && <Animated.View style={animatedStyle} />}
      <Camera
        type={CameraType.front}
        style={styles.camera}
        onFacesDetected={handleFaceDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </View>
  )
}
