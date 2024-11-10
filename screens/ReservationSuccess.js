import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";

const ReservationSuccess = ({ route, navigation }) => {
  const { reservationDetails } = route.params || {}; // Usa || {} para evitar errores si route.params está indefinido

  // Validación para asegurarse de que reservationDetails e id_usuario existen
  if (!reservationDetails || !reservationDetails.id_usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Détails de la réservation ou id_usuario non disponibles
        </Text>
      </View>
    );
  }

  // Almacenamos el email (id_usuario) para pasarlo a la siguiente pantalla
  const email = reservationDetails.id_usuario;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../public/assets/logoFastVoiture.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Résumé des transactions</Text>
        </View>

        <LottieView
          source={require("../public/assets/car-animation.json")}
          autoPlay
          loop
          style={styles.animation}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Numéro de réservation:</Text>
          <Text style={styles.value}>{reservationDetails.id}</Text>

          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{email}</Text>

          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{reservationDetails.date}</Text>

          <Text style={styles.label}>Adresse de départ:</Text>
          <Text style={styles.value}>{reservationDetails.address_depart}</Text>

          <Text style={styles.label}>Adresse de destination:</Text>
          <Text style={styles.value}>
            {reservationDetails.address_destination}
          </Text>

          <Text style={styles.label}>Type de véhicule:</Text>
          <Text style={styles.value}>{reservationDetails.type_vehicule}</Text>

          <Text style={styles.label}>Capacité:</Text>
          <Text style={styles.value}>{reservationDetails.capacity}</Text>

          <Text style={styles.label}>Montant payé:</Text>
          <Text style={styles.value}>${reservationDetails.price} CAD</Text>

          <Text style={styles.label}>Mode de paiement:</Text>
          <Text style={styles.value}>{reservationDetails.paymentMethod}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DestinationSelection", { email })}
        >
          <Text style={styles.buttonText}>Créer une autre réservation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  logo: { width: 80, height: 80 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  detailsContainer: {
    marginTop: 20,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ReservationSuccess;
