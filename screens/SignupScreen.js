import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Esquema de validación de Yup
const SignupSchema = Yup.object().shape({
  nom: Yup.string().required("Requerido"),
  prenom: Yup.string().required("Requerido"),
  telephone: Yup.string()
    .required("Requerido")
    .matches(/^\d{10}$/, "Doit contenir 10 chiffres"), // Validación para teléfono de 10 dígitos
  password: Yup.string()
    .min(6, "Doit contenir au moins 6 caractères")
    .required("Requerido"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("Requerido"),
});

const SignupScreen = () => {
  const handleSignup = (values) => {
    // Aquí conectas con tu API para registrar al usuario
    axios
      .post("http://tuapi.com/signup", values)
      .then((response) => {
        console.log("Utilisateur créé:", response.data);
      })
      .catch((error) => {
        console.log("Erreur lors de la création de l'utilisateur:", error);
      });
  };

  return (
    <Formik
      initialValues={{
        nom: "",
        prenom: "",
        telephone: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => handleSignup(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
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
          {errors.prenom && <Text style={styles.error}>{errors.prenom}</Text>}

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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  error: {
    color: "red",
  },
});

export default SignupScreen;
