import React from 'react';
import { View, Text, ScrollView, StyleSheet ,Image} from 'react-native';
import { DataTable } from 'react-native-paper';

const CarComparisonScreen = ({ route }) => {
  const { selectedCars } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Car Comparison</Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            style={styles.cellWithBorder}
          >Attribute</DataTable.Title>
          {selectedCars.map((car, index) => (
            <DataTable.Title key={index}
              style={styles.cellWithBorder}
            >{car.make + ' ' + car.model}</DataTable.Title>
          ))}
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Year</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
              >{car.year}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Mileage</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
            >{car.mileage}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Price</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
            >{`$${car.price}`}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Condition</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
            >{car.condition}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Fuel Type</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
            >{car.fuelType}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Location</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
            style={styles.cellWithBorder}
            >{car.location}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Contact No.</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}
              style={styles.cellWithBorder}
            >{car.contactPhone}</DataTable.Cell>
          ))}
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell
            style={styles.cellWithBorder}
          >Car Images</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index} style={styles.cellWithBorder}>
              <Image source={{ uri: car.photos[0] }} style={styles.carImage} />
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 64,
    backgroundColor: 'lightgrey',
 
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cellWithBorder: {
    borderRightWidth: 1, // Add a border to the right of each cell
    borderLeftWidth: 1, // Add a border to the left of each cell
    borderTopWidth: 1, // Add a border to the top of each cell
    borderBottomWidth: 1, // Add a border to the bottom of each cell
    borderColor: 'grey', // Color of the border
    padding: 8,
  },
  carImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
});

export default CarComparisonScreen;
