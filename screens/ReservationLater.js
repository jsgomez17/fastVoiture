import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_IP } from "../config";

const ReservationLater = ({ route }) => {
  const [departAddress, setDepartAddress] = useState("Emplacement actuel");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [departCoords, setDepartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleOptions, setVehicleOptions] = useState([]); // Estado para almacenar los datos actualizados de vehículos
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const { email } = route.params;

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Autorisations refusées",
          "Une autorisation de localisation est requise."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setDepartCoords(currentCoords);
    })();
  }, []);

  // Función para obtener sugerencias de direcciones
  const handleSearchSuggestions = async (text) => {
    const API_KEY = "5b3ce3597851110001cf6248aca98e72c9a040fd8d3eb2efba526f88";
    if (text.length < 3) return;

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/autocomplete`,
        {
          params: {
            api_key: API_KEY,
            text,
            size: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.log("Erreur lors de la récupération des suggestions:", error);
      Alert.alert("Erreur", "Impossible de récupérer les suggestions.");
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const { geometry, properties } = suggestion;
    const coords = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };

    if (focusedField === "origin") {
      setDepartCoords(coords);
      setDepartAddress(properties.label);
    } else if (focusedField === "destination") {
      setDestinationCoords(coords);
      setDestinationAddress(properties.label);
    }
    setSuggestions([]);
  };

  // Función para obtener la ruta y la distancia
  const handleGetRoute = async () => {
    const API_KEY = "5b3ce3597851110001cf6248aca98e72c9a040fd8d3eb2efba526f88";
    if (!departCoords || !destinationCoords) {
      Alert.alert("Erreur", "Veuillez sélectionner les deux adresses.");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: API_KEY,
            start: `${departCoords.longitude},${departCoords.latitude}`,
            end: `${destinationCoords.longitude},${destinationCoords.latitude}`,
          },
        }
      );
      const coordinates = response.data.features[0].geometry.coordinates.map(
        ([longitude, latitude]) => ({
          latitude,
          longitude,
        })
      );
      setRouteCoordinates(coordinates);
      const distance =
        response.data.features[0].properties.segments[0].distance / 1000; // en km

      // Solicitar precios al backend con la distancia calculada
      const priceResponse = await axios.post(`${API_IP}/api/calculer-prix`, {
        distance,
      });
      setVehicleOptions(priceResponse.data); // Actualizar estado de opciones de vehículo
    } catch (error) {
      console.log("Erreur lors de la récupération de l'itinéraire:", error);
      Alert.alert("Erreur", "Impossible de récupérer l'itinéraire.");
    }
  };

  // Función para manejar la reserva
  const handleReserve = async () => {
    if (!selectedVehicle || !date || !time) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner un type de véhicule, une date et une heure."
      );
      return;
    }

    // Combinar la fecha y hora en un formato de objeto Date
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");
    const datetime = new Date(year, month - 1, day, hours, minutes, seconds);

    const reservationData = {
      idcourse: Math.random().toString(36).substring(2, 15), // Genera un ID aleatorio para la reserva
      date: datetime, // Guarda la fecha y hora combinadas
      address_depart: departAddress,
      address_destination: destinationAddress,
      type_vehicule: selectedVehicle.type,
      capacity: selectedVehicle.capacity,
      prix: parseFloat(selectedVehicle.price.replace(" $CA", "")), // Elimina "$CA" y convierte a número
      id_usuario: email, // ID del usuario como email
      estado: "reservado pour plus tard",
    };

    try {
      const response = await axios.post(
        `${API_IP}/api/reserver`,
        reservationData
      );
      Alert.alert(
        "Réservation confirmée",
        `Réservation pour le véhicule ${selectedVehicle.type} confirmée pour le ${datetime}!`
      );
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      Alert.alert("Erreur", "Erreur lors de la création de la réservation.");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate.toLocaleDateString());
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime.toLocaleTimeString());
    hideTimePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../public/assets/logoFastVoiture.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Réserver une course plus tard</Text>
        </View>

        <Text style={styles.label}>Adresse de départ:</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'adresse de départ"
          value={departAddress}
          onFocus={() => setFocusedField("origin")}
          onChangeText={(text) => {
            setDepartAddress(text);
            handleSearchSuggestions(text);
          }}
        />

        <Text style={styles.label}>Adresse de destination:</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'adresse de destination"
          value={destinationAddress}
          onFocus={() => setFocusedField("destination")}
          onChangeText={(text) => {
            setDestinationAddress(text);
            handleSearchSuggestions(text);
          }}
        />

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.properties.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <Text style={styles.suggestionText}>
                  {item.properties.label}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}

        {/* Selección de fecha y hora */}
        <View style={styles.datetimeContainer}>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {date ? `Date: ${date}` : "Sélectionner la date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimePicker} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {time ? `Heure: ${time}` : "Sélectionner l'heure"}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
        />

        <Button title="Afficher la route" onPress={handleGetRoute} />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: departCoords ? departCoords.latitude : 45.5017,
            longitude: departCoords ? departCoords.longitude : -73.5673,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {departCoords && (
            <Marker coordinate={departCoords} title="Adresse de départ" />
          )}
          {destinationCoords && (
            <Marker
              coordinate={destinationCoords}
              title="Adresse de destination"
            />
          )}
          <Polyline coordinates={routeCoordinates} strokeColor="blue" />
        </MapView>

        {/* Opciones de vehículos */}
        <Text style={styles.vehicleOptionsTitle}>Choisissez une course</Text>
        <FlatList
          data={vehicleOptions}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.vehicleOption,
                selectedVehicle === item.id && styles.selectedVehicleOption,
              ]}
              onPress={() => setSelectedVehicle(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.vehicleImage}
                onError={() => console.log("Error loading image:", item.image)}
              />
              {/* Contenedor para el título y la capacidad */}
              <View style={styles.vehicleInfoContainer}>
                <View style={styles.vehicleTypeContainer}>
                  <Text style={styles.vehicleType}>{item.type}</Text>
                  <FontAwesome name="user" size={14} color="gray" />
                  <Text style={styles.vehicleCapacity}> {item.capacity}</Text>
                </View>
                <Text style={styles.vehiclePrice}>{item.price}</Text>
                <Text style={styles.vehicleEta}>{item.eta}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {/* Botón de reserva */}
        <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveButtonText}>Réserver</Text>
        </TouchableOpacity>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
    elevation: 5,
  },
  suggestionText: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  reserveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  vehicleOptionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  vehicleOption: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    width: 160,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedVehicleOption: {
    borderColor: "black",
  },
  vehicleImage: {
    width: 120,
    height: 40,
    marginBottom: 10,
    resizeMode: "contain",
  },
  vehicleInfoContainer: {
    alignItems: "center",
  },
  vehicleTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    marginRight: 10,
  },
  vehicleCapacity: {
    fontSize: 14,
    color: "gray",
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },
  vehicleEta: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});

export default ReservationLater;
