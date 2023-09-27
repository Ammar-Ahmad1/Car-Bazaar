import React,{useState,useEffect} from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {Button} from 'react-native-paper';
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
// import { useNavigation } from '@react-navigation/native';

const UserCard = ({ item, navigation, getCars,selectCar,selectedCars }) => {
  //   const navigation = useNavigation();
  const [selected, setSelected] = useState(false);


  const handleCardPress = () => {
    // Navigate to the CarDetails screen, passing the car item as a parameter
    navigation.navigate("Detail", { car: item });
  };

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
          style={{ paddingHorizontal: 10, fontSize: 18, paddingVertical: 5 }}
        >
          {item.make} {item.model} {item.year}
        </Text>
        <Text style={{ paddingHorizontal: 10, fontSize: 18 }}>
          Status:{" "}
          {item.isBiddingOpen
            ? "Bidding Open"
            : item.winningBid
            ? "Sold"
            : "Bidding not..."}
        </Text>
        </View>
        <Text style={{ paddingHorizontal: 10, fontSize: 18 }}>
          Current Bid: {item.currentBid===0 ? "No bids yet" :item.currentBid}
        </Text>
        {/* <Button mode="outlined" onPress={handleComparePress} style={{marginVertical:10}}
        disabled={selected}
        >
          Add to compare
        </Button> */}

      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  bigImg: {
    width: Width * 0.9,
    height: Width * 0.5,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
