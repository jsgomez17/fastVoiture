//External imports
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios"; // Asegúrate de tener axios instalado
import { API_IP } from "../config";

const UserModificationScreen = ({ route, navigation }) => {
  const { email } = route.params; // Obtener el email del usuario desde los parámetros de la ruta
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [facialId, setFacialId] = useState("");
  const [voiceData, setVoiceData] = useState("");

  // Función para manejar la modificación del usuario
  const handleUpdateUser = async () => {
    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    try {
      // Lógica para actualizar el usuario
      const response = await axios.put(
        `${API_IP}/users/${email}`, //todo: actualizar direccion api cuando ya este lista
        {
          nom,
          prenom,
          telephone,
          password,
          facialId,
          voiceData,
        }
      );

      Alert.alert("Succès", response.data.message);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response ? error.response.data : `Error desconocido ${error}`
      );
    }
  };

  const handleRegisterVoice = async () => {
    try {
      // Lógica para registrar el reconocimiento vocal
      const response = await axios.post(`${API_IP}/users/registerVoice`, {
        email,
        voiceData,
      });

      Alert.alert("Succès", response.data.message);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response ? error.response.data : `Error desconocido ${error}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l'utilisateur</Text>

      <TextInput
        style={styles.input}
        placeholder="Prenom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={prenom}
        onChangeText={setPrenom}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={telephone}
        onChangeText={setTelephone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false} // Hacer el campo de email no editable si no quieres que el usuario lo cambie
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir Mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Facial"
        value={facialId}
        onChangeText={setFacialId}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Voix"
        value={voiceData}
        onChangeText={setVoiceData}
      />

      <Button
        title="Enregistrer les modifications"
        onPress={handleUpdateUser}
      />

      <Button
        title="Enregistrer votre Face"
        onPress={() => handleBiometricAuth(values.email)}
      ></Button>

      <Button title="Enregistrer Voix" onPress={handleRegisterVoice} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  faceRecognitionButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  faceRecognitionText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserModificationScreen;
