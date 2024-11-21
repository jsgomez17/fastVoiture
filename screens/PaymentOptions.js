import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";
import { API_GEO, API_IP } from "../config";

const PaymentOptions = ({ route, navigation }) => {
  const { reservationID, amount } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState("");
  const [orderId, setOrderId] = useState("");

  const updateReservationStatus = async (status) => {
    try {
      await axios.patch(`${API_IP}/reservations/update-status`, {
        reservationId: reservationID,
        status: status,
      });
      Alert.alert("Paiement réussi", `Statut de réservation: ${status}`);
      navigation.navigate("ReservationSuccess");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de mettre à jour le statut de la réservation"
      );
    }
  };

  const handleCashPayment = async () => {
    Alert.alert(
      "Confirmer le paiement",
      "Voulez-vous confirmer le paiement en espèces?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              await updateReservationStatus("Payé en espèces");

              // Realizar la solicitud para obtener detalles de la reserva
              const reservationResponse = await axios.get(
                `${API_IP}/reservations/${reservationID}/details`
              );

              const reservationDetails = reservationResponse.data;

              // Navegar a la pantalla de resumen de transacción
              navigation.navigate("ReservationSuccess", {
                reservationDetails: {
                  id_usuario: reservationDetails.id_usuario,
                  id: reservationDetails._id,
                  date: new Date(reservationDetails.date).toLocaleDateString(),
                  address_depart: reservationDetails.address_depart,
                  address_destination: reservationDetails.address_destination,
                  type_vehicule: reservationDetails.type_vehicule,
                  capacity: reservationDetails.capacity,
                  price: reservationDetails.prix,
                  paymentMethod: "Espèces",
                },
              });
            } catch (error) {
              Alert.alert(
                "Erreur",
                "Le paiement en espèces n'a pas pu être effectué."
              );
            }
          },
        },
      ]
    );
  };
  const handlePayPalPayment = async () => {
    try {
      const response = await axios.post(`${API_IP}/paypal/create-order`, {
        amount,
      });
      setPaypalUrl(response.data.approvalUrl);
      setOrderId(response.data.orderId);
      setShowWebView(true);
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'initier le paiement avec PayPal.");
    }
  };

  const capturePayPalOrder = async () => {
    try {
      await axios.post(`${API_IP}/paypal/capture-order`, { orderId });
      Alert.alert("Paiement réussi", "Le paiement a été complété avec succès.");
      updateReservationStatus("Payé via PayPal");

      // Realizar la solicitud para obtener detalles de la reserva
      const reservationResponse = await axios.get(
        `${API_IP}/reservations/${reservationID}/details`
      );

      const reservationDetails = reservationResponse.data;

      // Navegar a la pantalla de resumen de transacción
      navigation.navigate("ReservationSuccess", {
        reservationDetails: {
          id_usuario: reservationDetails.id_usuario,
          id: reservationDetails._id,
          date: new Date(reservationDetails.date).toLocaleDateString(),
          address_depart: reservationDetails.address_depart,
          address_destination: reservationDetails.address_destination,
          type_vehicule: reservationDetails.type_vehicule,
          capacity: reservationDetails.capacity,
          price: reservationDetails.prix,
          paymentMethod: "Paypal",
        },
      });
    } catch (error) {
      Alert.alert("Erreur", "Le paiement n'a pas pu être effectué.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../public/assets/logoFastVoiture.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Paiement</Text>
        </View>
        <Text style={styles.label}>Sélectionnez un mode de paiement:</Text>

        <TouchableOpacity
          style={[
            styles.paymentButton,
            selectedPaymentMethod === "cash" && styles.selectedButton,
          ]}
          onPress={() => {
            setSelectedPaymentMethod("cash");
            handleCashPayment();
          }}
        >
          <Text style={styles.paymentText}>Espèces</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentButton,
            selectedPaymentMethod === "paypal" && styles.selectedButton,
          ]}
          onPress={handlePayPalPayment}
        >
          <Text style={styles.paymentText}>PayPal</Text>
        </TouchableOpacity>

        {showWebView && (
          <Modal visible={showWebView} transparent animationType="slide">
            <WebView
              source={{ uri: paypalUrl }}
              onNavigationStateChange={(navState) => {
                if (navState.url.includes("/paypal/success")) {
                  setShowWebView(false);
                  capturePayPalOrder(); // Captura la orden
                } else if (navState.url.includes("/paypal/cancel")) {
                  setShowWebView(false);
                  Alert.alert(
                    "Paiement annulé",
                    "L'utilisateur a annulé le paiement."
                  );
                }
              }}
              onError={() => {
                setShowWebView(false);
                Alert.alert(
                  "Erreur",
                  "Il y a eu un problème avec le paiement."
                );
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWebView(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </Modal>
        )}
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
    marginBottom: 20,
  },
  logo: { width: 75, height: 75, marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  label: {
    fontSize: 18,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  paymentText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  selectedButton: { backgroundColor: "#0056b3" },
  closeButton: {
    padding: 10,
    backgroundColor: "#ff4444",
    alignItems: "center",
    borderRadius: 5,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});

export default PaymentOptions;
