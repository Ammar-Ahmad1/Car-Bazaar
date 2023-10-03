import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { useUserState } from "../Slices/userSlice";
import { BACKEND } from "../../CONSTANTS.js";
import UserCard from "../../Components/UserCard"; // Make sure to import UserCard
// import BigImageCard from '../../Components/BigImageCard'; // Make sure to import BigImageCard

const UserCars = ({ navigation }) => {
  const user = useUserState();
  const [cars, setCars] = useState([]);

  const getCars = async () => {
    try {
      fetch(`${BACKEND}/car/get-cars`)
        .then((res) => res.json())
        .then((data) => {
          const userCars = data.cars.filter(
            (car) => car.seller._id === user.id
          );
          setCars(userCars);
          console.log(userCars);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "white",
      }}
    >
      {cars.length === 0 && (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
            marginTop: 80,
          }}
        >
          You have not added any cars yet
        </Text>
      )}
      <FlatList
        data={cars}
        renderItem={({ item }) => (
          <UserCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default UserCars;
