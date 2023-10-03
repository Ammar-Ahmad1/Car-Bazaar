import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { DataTable } from "react-native-paper";
// import backgroundImage from "../../assets/";

const CarComparisonScreen = ({ route }) => {
  const { selectedCars } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.heading}>Car Comparison</Text> */}

      <View style={styles.carImagesContainer}>
        {selectedCars.map((car, index) => (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // marginHorizontal: 10,
            }}
          >
            <Image
              key={index}
              source={{ uri: car.photos[0] }}
              style={styles.carImage}
            />
            <Text>{car.make + " " + car.model}</Text>
          </View>
        ))}
      </View>
      <DataTable>
        <DataTable.Header>
          {/* <DataTable.Title
            style={styles.cellWithBorder}
          >Attribute</DataTable.Title> */}
          <View style={styles.cellWithBorder}></View>
          {selectedCars.map((car, index) => (
            <DataTable.Title key={index} style={styles.cellWithBorder}>
              {car.make + " " + car.model}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Year</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Year</Text>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.year}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Mileage</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Mileage</Text>

          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.mileage}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Price</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Price</Text>
          {selectedCars.map((car, index) => (
            <DataTable.Cell
              key={index}
              style={styles.cellWithBorder}
            >{`Rs.${car.price}`}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Condition</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Condition</Text>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.condition}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Fuel Type</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Fuel Type</Text>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.fuelType}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Location</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Location</Text>

          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.location}
            </DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          {/* <DataTable.Cell
            style={styles.cellWithBorder}
          >Contact No.</DataTable.Cell> */}
          <Text style={styles.cellWithBorder}>Contact No.</Text>

          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              {car.contactPhone}
            </DataTable.Cell>
          ))}
        </DataTable.Row>
        {/*  */}
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    // paddingVertical: 64,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  cellWithBorder: {
    padding: 8,
    width: 100,
  },
  // carImage: {
  //   width: 80,
  //   height: 80,
  //   resizeMode: 'cover',
  // },
  carImagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
  },
  carImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginHorizontal: 10,
  },
});

export default CarComparisonScreen;
