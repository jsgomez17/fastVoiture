import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Camera } from "expo-camera"; // Importer la caméra
import * as LocalAuthentication from "expo-local-authentication";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_IP } from "../config";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  password: Yup.string().min(6, "Doit contenir au moins 6 caractères"),
});

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState("passenger");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    };
    checkPermissions();
  }, []);

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${API_IP}/users/login/`, {
        email: values.email,
        password: values.password,
        role,
      });
      const { nom, prenom, email } = response.data;
      navigation.navigate("Reservation", { nom, prenom, email });
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Erreur",
          error.response.status === 404
            ? "L'utilisateur n'existe pas, veuillez vous inscrire."
            : error.response.data.message
        );
      } else {
        Alert.alert("Erreur", "Échec de la connexion");
      }
    }
  };

  const handleFaceRecognition = async () => {
    if (!cameraPermission) {
      Alert.alert("Permission requise", "Activez l'accès à la caméra.");
      return;
    }

    setIsCameraVisible(true);
  };

  const captureAndVerifyFace = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ base64: true });
      setIsCameraVisible(false);

      try {
        // Remplacez cela par votre API ou modèle de reconnaissance faciale
        const response = await axios.post(`${API_IP}/face-recognition`, {
          image: photo.base64,
        });

        if (response.data.success) {
          const { nom, prenom, email } = response.data.user;
          navigation.navigate("Reservation", { nom, prenom, email });
        } else {
          Alert.alert("Erreur", "Reconnaissance faciale échouée");
        }
      } catch (error) {
        Alert.alert("Erreur", "Erreur lors de la reconnaissance faciale");
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={(values) => handleLogin(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require("../public/assets/logoFastVoiture.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Connecter</Text>
          </View>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              onPress={() => setRole("passenger")}
              style={styles.radioButton}
            >
              <Text
                style={
                  role === "passenger" ? styles.radioSelected : styles.radio
                }
              >
                Passager
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRole("driver")}
              style={styles.radioButton}
            >
              <Text
                style={role === "driver" ? styles.radioSelected : styles.radio}
              >
                Conducteur
              </Text>
            </TouchableOpacity>
          </View>

          <Text>E-mail</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text>Mot de passe</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Button onPress={handleSubmit} title="Se connecter" />

          {isBiometricSupported && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={() => handleFaceRecognition()}
            >
              <Text style={styles.biometricText}>
                Connectez-vous avec la reconnaissance faciale
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.loginText}>
              Vous n'avez pas de compte ? S'inscrire
            </Text>
          </TouchableOpacity>

          {isCameraVisible && (
            <Camera
              style={styles.camera}
              ref={(ref) => setCameraRef(ref)}
              onCameraReady={captureAndVerifyFace}
            />
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  // Styles ici...
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
