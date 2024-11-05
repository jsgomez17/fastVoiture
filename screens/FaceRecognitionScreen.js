import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Camera } from "expo-camera";

const FaceRecognitionScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          Alert.alert("Permission Denied", "Camera permission is required.");
        }
      } catch (error) {
        console.error("Error requesting camera permissions", error);
        Alert.alert("Error", "Failed to request camera permissions.");
      }
    };

    requestCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Face Recognition Screen</Text>
      {/* Add camera component here once permission is granted */}
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default FaceRecognitionScreen;
