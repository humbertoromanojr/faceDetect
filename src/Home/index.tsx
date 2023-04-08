import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { Camera, CameraType } from "expo-camera"

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  camera: {
    flex: 1,
  },
})

export function Home() {
  const [permission, requestPermission] = Camera.useCameraPermissions()

  useEffect(() => {
    requestPermission()
  }, [])

  if (!permission?.granted) {
    return console.log("Sem permissão para usar a camera")
  }

  return (
    <View style={styles.container}>
      <Camera type={CameraType.front} style={styles.camera} />
    </View>
  )
}
