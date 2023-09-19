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
          <DataTable.Title>Attribute</DataTable.Title>
          {selectedCars.map((car, index) => (
            <DataTable.Title key={index}>{car.make + ' ' + car.model}</DataTable.Title>
          ))}
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Year</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.year}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Mileage</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.mileage}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Price</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{`$${car.price}`}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Condition</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.condition}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Fuel Type</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.fuelType}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Location</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.location}</DataTable.Cell>
          ))}
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Contact Phone</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>{car.contactPhone}</DataTable.Cell>
          ))}
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Car Images</DataTable.Cell>
          {selectedCars.map((car, index) => (
            <DataTable.Cell key={index}>
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
  carImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});

export default CarComparisonScreen;
