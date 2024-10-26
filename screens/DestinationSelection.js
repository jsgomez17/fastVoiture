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
import axios from "axios";

const DestinationSelection = ({ route }) => {
  const [departAddress, setDepartAddress] = useState("Current Location");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [departCoords, setDepartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [focusedField, setFocusedField] = useState(null); // Para saber cuál campo está enfocado

  // Obtener la ubicación actual del usuario para establecer el punto de partida por defecto
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissions denied", "Location permission is required.");
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

  // Buscar sugerencias de direcciones usando OpenRouteService
  const handleSearchSuggestions = async (text) => {
    const API_KEY = "5b3ce3597851110001cf6248aca98e72c9a040fd8d3eb2efba526f88"; // Coloca aquí tu API key de OpenRouteService
    if (text.length < 3) return; // Espera hasta que el usuario haya ingresado al menos 3 caracteres

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/autocomplete`,
        {
          params: {
            api_key: API_KEY,
            text,
            size: 5, // Limita el número de sugerencias para una mejor experiencia de usuario
          },
        }
      );

      // Actualiza el estado con las sugerencias
      setSuggestions(response.data.features);
    } catch (error) {
      console.log("Error fetching suggestions:", error);
      Alert.alert("Error", "Failed to fetch suggestions.");
    }
  };

  // Maneja la selección de una sugerencia
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

  // Obtener la ruta desde la API de OpenRouteService
  const handleGetRoute = async () => {
    const API_KEY = "5b3ce3597851110001cf6248aca98e72c9a040fd8d3eb2efba526f88"; // Reemplaza con tu API key de OpenRouteService
    if (!departCoords || !destinationCoords) {
      Alert.alert("Error", "Por favor selecciona ambas direcciones.");
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
    } catch (error) {
      console.log("Error fetching route:", error);
      Alert.alert("Error", "Failed to fetch route.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo y título */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/logoFastVoiture.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Réserve course</Text>
        </View>

        {/* Campo de dirección de origen */}
        <Text style={styles.label}>Adresse de départ:</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'adresse de départ"
          value={departAddress}
          onFocus={() => setFocusedField("origin")} // Establece el campo activo
          onChangeText={(text) => {
            setDepartAddress(text);
            handleSearchSuggestions(text);
          }}
        />

        {/* Campo de dirección de destino */}
        <Text style={styles.label}>Adresse de destination:</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'adresse de destination"
          value={destinationAddress}
          onFocus={() => setFocusedField("destination")} // Establece el campo activo
          onChangeText={(text) => {
            setDestinationAddress(text);
            handleSearchSuggestions(text);
          }}
        />

        {/* Lista de sugerencias */}
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
          />
        )}

        <Button title="Afficher la route" onPress={handleGetRoute} />

        {/* Mapa con marcadores y ruta */}
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
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
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
});

export default DestinationSelection;
