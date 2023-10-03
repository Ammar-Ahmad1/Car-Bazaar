import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {BACKEND} from '../CONSTANTS.js'
import axios from "axios";
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
// import { useNavigation } from '@react-navigation/native';

const UserCard = ({ item, navigation, getCars, selectCar, selectedCars }) => {
  //   const navigation = useNavigation();
  const [selected, setSelected] = useState(false);

  const handleCardPress = () => {
    // Navigate to the CarDetails screen, passing the car item as a parameter
    navigation.navigate("Detail", { car: item });
  };
  const handleDelete = () => {
      try{
        axios.delete(`${BACKEND}/car/delete-car/${item._id}`)
        .then((res) => {
          console.log(res.data)
          Alert.alert("Car Deleted Successfully")
          getCars()
        })

      }catch(err){
        console.log(err)
      }
  }
  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View
        style={{
          marginVertical: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 10,
          backgroundColor: "#fff",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Image source={{ uri: item.photos[0] }} style={styles.bigImg} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <Text
            style={{ paddingHorizontal: 2, fontSize: 18, paddingVertical: 5 }}
          >
            {item.make} {item.model} {item.year}
          </Text>
          <Text style={{ paddingHorizontal: 10, fontSize: 18 }}>
            Status:{" "}
            {item.isBiddingOpen
              ? "Bidding"
              : item.winningBid
              ? "Sold"
              : "Bidding"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
         >
          <Text style={{ paddingHorizontal: 2, fontSize: 18 }}>
            Current Bid:{" "}
            {item.currentBid === 0 ? "No bids yet" : item.currentBid}
          </Text>
          <TouchableOpacity 
            style={{ paddingHorizontal: 10, fontSize: 18 , borderWidth:1, borderColor:'black', borderRadius:10, padding:5}}
            onPress={handleDelete}
          >
          <MaterialIcons name="delete" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  bigImg: {
    width: Width * 0.8,
    height: Width * 0.4,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
