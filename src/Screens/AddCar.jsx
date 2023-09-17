import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CarForm from '../../Components/CarInputForm.js'
const AddCar = ({navigation}) => {
  return (
    <View
        style={{
            flex: 1,
            backgroundColor: "#fff",
            // alignItems: "center",
            justifyContent: "center",
            padding: "10%",
            }}
    >
     <CarForm
      navigation={navigation}
     />
    </View>
  )
}

export default AddCar

const styles = StyleSheet.create({})