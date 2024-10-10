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
  ScrollView, // Importamos ScrollView
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Esquema de validación de Yup
const SignupSchema = Yup.object().shape({
  nom: Yup.string().required("Le nom est requis"),
  prenom: Yup.string().required("Le prenom est requis"),
  telephone: Yup.string()
    .required("Le telephone est requis")
    .matches(/^\d{10}$/, "Doit contenir 10 chiffress"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  password: Yup.string()
    .min(6, "Doit contenir au moins 6 caractères")
    .required("Un mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("Un mot de passe est requis"),
});

const SignupScreen = ({ navigation }) => {
  const [role, setRole] = useState("passenger"); // Por defecto es 'passenger'

  const handleSignup = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        "http://192.168.2.20:3000/api/users/register",
        {
          ...values,
          role,
        }
      );
      console.log("Utilisateur créé:", response.data);

      // Muestra un mensaje de éxito
      Alert.alert("Succès", "Utilisateur créé avec succès");

      // Limpia los campos del formulario
      resetForm();
    } catch (error) {
      console.log("Erreur lors de la création de l'utilisateur:", error);
      // Manejo de errores específicos
      if (error.response && error.response.status === 400) {
        Alert.alert("Erreur", "l'utilisateur existe déjà"); // Mensaje del servidor
      } else {
        Alert.alert("Erreur", "Impossible de créer un utilisateur");
      }
    }
  };

  return (
    <Formik
      initialValues={{
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={handleSignup} // Se pasa directamente el manejador de envío
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image
                source={require("../assets/logoFastVoiture.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Inscripción</Text>
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
                  style={
                    role === "driver" ? styles.radioSelected : styles.radio
                  }
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

            {/* Enlace a la página de login */}
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginText}>
                Avez-vous déjà un compte ? Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  loginText: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});

export default SignupScreen;
