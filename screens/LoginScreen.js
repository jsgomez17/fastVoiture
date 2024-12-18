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
import * as LocalAuthentication from "expo-local-authentication"; // Importamos el módulos de reconocimiento
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_IP } from "../config";

// Esquema de validación de Yup para el formulario de login
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  password: Yup.string().min(6, "Doit contenir au moins 6 caractères"),
});

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState("passenger"); // Por defecto 'passenger'
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Verificar si el dispositivo soporta biometría
  useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${API_IP}/users/login/`, {
        email: values.email,
        password: values.password,
        role,
      });
      console.log("Connexion réussie:", response.data);

      const { nom, prenom, email } = response.data;

      // Aquí redirigimos a la pantalla de reserva y enviamos nom y prenom
      navigation.navigate("Reservation", {
        nom,
        prenom,
        email,
      });
    } catch (error) {
      console.log("Erreur lors de la connexion:", error);
      // Manejo de errores específicos
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert(
            "Erreur",
            "L'utilisateur n'existe pas, veuillez vous inscrire."
          );
        } else {
          Alert.alert("Erreur", error.response.data.message);
        }
      } else {
        Alert.alert("Erreur", "Échec de la connexion");
      }
    }
  };

  // Función para manejar la autenticación biométrica (huella)
  const handleBiometricAuth = async (email) => {
    // Verifica si el dispositivo soporta autenticación biométrica
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (!compatible) {
      Alert.alert(
        "Erreur",
        "Ce dispositif ne supporte pas l'authentification biométrique."
      );
      return;
    }

    // Verifica si hay métodos de autenticación disponibles (huella y/o cara)
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!enrolled) {
      Alert.alert(
        "Erreur",
        "Aucune méthode d'authentification biométrique n'est enregistrée."
      );
      return;
    }

    // Autenticación biométrica
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Connectez-vous avec votre empreinte digitale",
      fallbackLabel: "Utiliser le mot de passe",
    });

    if (biometricAuth.success) {
      // Si la autenticación es exitosa, busca al usuario en la base de datos
      try {
        if (!email) {
          Alert.alert("Erreur", "Veuillez d'abord entrer votre email.");
          return;
        }
        console.log("Recherche d'un utilisateur avec son email :", email); // Verificar que `email` no esté vacío
        const response = await axios.get(`${API_IP}/users/${email}`);
        const { nom, prenom } = response.data;
        console.log("Données de l'utilisateur:", nom, prenom, email);

        // Navega a la pantalla de reserva pasando nom y prenom
        navigation.navigate("Reservation", {
          nom,
          prenom,
          email,
        });
      } catch (error) {
        Alert.alert("Erreur", "Utilisateur non trouvé");
        console.log("Erreur lors de la récupération de l'utilisateur:", error);
      }
    } else {
      Alert.alert("Erreur", "Échec de l'authentification biométrique");
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values) => handleLogin(values)} // Pass the values to handleLogin
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          {/* Logo y título */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../public/assets/logoFastVoiture.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Connecter</Text>
          </View>

          {/* Radio Button para Pasajero o Conductor */}
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

          {/* Formulario de correo y contraseña */}
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

          {/* Botón de autenticación con huella dactilar */}
          {isBiometricSupported && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={() => handleBiometricAuth(values.email)} // Pasar el email aquí
            >
              <Image
                source={require("../public/assets/fingerprint.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
          )}

          {/* Enlace a la página de inscripción */}
          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.loginText}>
              Vous n'avez pas de compte ? S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row", // Hace que los elementos estén en la misma línea
    alignItems: "center", // Centra verticalmente
    justifyContent: "center", // Centra horizontalmente
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  radioButton: {
    marginHorizontal: 10,
  },
  radio: {
    fontSize: 18,
    color: "gray",
  },
  radioSelected: {
    fontSize: 18,
    color: "blue",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  loginText: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
  biometricButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  biometricText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginScreen;
