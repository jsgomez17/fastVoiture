import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Esquema de validación de Yup para el formulario de login
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail invalide").required("Requerido"),
  password: Yup.string()
    .min(6, "Doit contenir au moins 6 caractères")
    .required("Requerido"),
});

const LoginScreen = () => {
  const [role, setRole] = useState("passenger"); // Por defecto 'passenger'

  const handleLogin = (values) => {
    axios
      .post("http://tuapi.com/login", { ...values, role })
      .then((response) => {
        console.log("Connexion réussie:", response.data);
      })
      .catch((error) => {
        console.log("Erreur lors de la connexion:", error);
      });
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        role: "passenger",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values) => handleLogin(values)}
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
});

export default LoginScreen;
