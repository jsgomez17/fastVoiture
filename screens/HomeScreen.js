// HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native"; // Importa Lottie para la animación

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo de l'application */}
      <Image
        source={require("../public/assets/logoFastVoiture.png")} // Chemin de votre logo dans le dossier assets
        style={styles.logo}
      />

      {/* Texte de bienvenue */}
      <Text style={styles.title}>¡Bienvenue à FastVoiture!</Text>

      {/* Animación en la parte superior */}
      <LottieView
        source={require("../public/assets/car-animation.json")} // Archivo de animación Lottie
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Bouton pour se connecter */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.buttonText}>Connecter</Text>
      </TouchableOpacity>

      {/* Bouton pour s'inscrire */}
      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={() => navigation.navigate("SignupScreen")}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // fond blanc
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
    alignItems: "center",
  },
  signupButton: {
    backgroundColor: "#32cd32", //Couleur différente pour le bouton d'inscription
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default HomeScreen;
