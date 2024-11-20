import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native"; // Importa Lottie para la animación
import { Ionicons } from "@expo/vector-icons";

const Reservation = ({ route, navigation }) => {
  // Extraemos los datos pasados desde la pantalla de inicio de sesión
  const { nom, prenom, email } = route.params;

  // Función para navegar a la pantalla de selección de dirección
  const handleGoToDestinationScreen = () => {
    navigation.navigate("DestinationSelection", {
      email, // Paso opcional para pasarlo directamente
    });
  };

  // Función para navegar a la pantalla de reservacion de course
  const handleGoToReservationLater = () => {
    navigation.navigate("ReservationLater", {
      email,
    }); // Navega a la pantalla de selección de dirección
  };

  // Función para navegar a la pantalla de selección de dirección
  const handleGoToUserModification = () => {
    navigation.navigate("UserModificationScreen", {
      email, // Paso opcional para pasarlo directamente
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo y título */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../public/assets/logoFastVoiture.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Réserve course</Text>
        </View>

        {/* Texto de bienvenida debajo del logo y título */}
        <Text style={styles.welcomeText}>
          Bienvenue, {nom} {prenom}
        </Text>

        {/* Animación en la parte superior */}
        <LottieView
          source={require("../public/assets/car-animation.json")} // Archivo de animación Lottie
          autoPlay
          loop
          style={styles.animation}
        />

        {/* Campo de búsqueda de dirección */}
        <TouchableOpacity
          style={styles.searchField}
          onPress={handleGoToDestinationScreen} // Navega al presionar
        >
          <Ionicons name="search" size={20} color="gray" />
          <Text style={styles.searchText}>Où allez-vous?</Text>
        </TouchableOpacity>

        {/* Sugerencias de servicios en tarjetas */}
        <Text style={styles.suggestionsTitle}>Suggestions</Text>
        <View style={styles.suggestionsContainer}>
          <TouchableOpacity
            style={styles.suggestionCard}
            onPress={handleGoToDestinationScreen} // Navega al presionar
          >
            <Image
              source={require("../public/assets/car-icon.png")}
              style={styles.icon}
            />
            <Text style={styles.suggestionText}>Course</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.suggestionCard}
            onPress={handleGoToReservationLater}
          >
            <Image
              source={require("../public/assets/reserve-icon.png")}
              style={styles.icon}
            />
            <Text style={styles.suggestionText}>Réserver</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Button
            style={styles.button}
            onPress={handleGoToUserModification}
            title="Modifier l'utilisateur"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchText: {
    fontSize: 16,
    color: "#888",
    marginLeft: 8, // Espaciado para separar el icono del texto
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  suggestionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suggestionCard: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
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
});

export default Reservation;
