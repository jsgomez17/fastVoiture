import React, { useState } from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Esquema de validación de Yup para el formulario de login
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  password: Yup.string()
    .min(6, "Doit contenir au moins 6 caractères")
    .required("Un mot de passe est requis"),
});

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState("passenger"); // Por defecto 'passenger'

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.2.20:3000/api/users/login",
        {
          email: values.email,
          password: values.password,
          role,
        }
      );
      console.log("Connexion réussie:", response.data);

      // Aquí redirigimos a la pantalla de reserva
      navigation.navigate("Reservation");
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

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          {/* Logo y título */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/logoFastVoiture.png")}
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
});

export default LoginScreen;
