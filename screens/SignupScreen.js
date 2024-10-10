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

// Esquema de validación de Yup
const SignupSchema = Yup.object().shape({
  nom: Yup.string().required("Requerido"),
  prenom: Yup.string().required("Requerido"),
  telephone: Yup.string()
    .required("Requerido")
    .matches(/^\d{10}$/, "Debe contener 10 dígitos"),
  email: Yup.string().email("E-mail invalido").required("Requerido"),
  password: Yup.string()
    .min(6, "Debe tener al menos 6 caracteres")
    .required("Requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Requerido"),
});

const SignupScreen = () => {
  const [role, setRole] = useState("passenger"); // Por defecto es 'passenger'

  const handleSignup = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.2.20:3000/api/users/register",
        {
          ...values,
          role,
        }
      );
      console.log("Utilisateur créé:", response.data);
    } catch (error) {
      console.log("Erreur lors de la création de l'utilisateur:", error);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        nom: "",
        prenom: "",
        telephone: "",
        role: "passenger",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => handleSignup(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/logoFastVoiture.png")} // Chemin de votre logo dans le dossier assets
              style={styles.logo}
            />
            <Text style={styles.title}>Inscription</Text>
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

          {/* Formulario adicional si es 'passager' */}
          {role === "passenger" && (
            <>
              <Text>Nom</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("nom")}
                onBlur={handleBlur("nom")}
                value={values.nom}
              />
              {errors.nom && <Text style={styles.error}>{errors.nom}</Text>}

              <Text>Prénom</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("prenom")}
                onBlur={handleBlur("prenom")}
                value={values.prenom}
              />
              {errors.prenom && (
                <Text style={styles.error}>{errors.prenom}</Text>
              )}

              <Text>Téléphone</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("telephone")}
                onBlur={handleBlur("telephone")}
                value={values.telephone}
                keyboardType="phone-pad"
              />
              {errors.telephone && (
                <Text style={styles.error}>{errors.telephone}</Text>
              )}
            </>
          )}
          {/* Email y Mot de Passe, campos comunes */}
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

          <Text>Confirmez le mot de passe</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}
          <Button onPress={handleSubmit} title="Créer un compte" />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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

export default SignupScreen;
