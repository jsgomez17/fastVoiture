import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

const RideTrackingScreen = ({ route }) => {
  const { userLocation, driverLocation } = route.params; // Recibe las ubicaciones desde la navegación

  const [location, setLocation] = useState({
    user: userLocation,
    driver: driverLocation,
  });

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

export default RideTrackingScreen;
