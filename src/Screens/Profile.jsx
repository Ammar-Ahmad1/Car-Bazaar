import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useUserState, useUserStateActions } from "../Slices/userSlice";
import { BACKEND } from "../../CONSTANTS.js";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"; // Import the LineChart component

const Profile = ({ navigation }) => {
  const user = useUserState();
  const userActions = useUserStateActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({
    name: "",
    email: "",
    // Add other user attributes here
  });

  // Dummy data for the PieChart
  const carBrandData = [
    {
      name: "Toyota",
      population: 30, // Percentage of the market share (replace with actual data)
      color: "rgba(0, 128, 255, 0.7)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Honda",
      population: 20, // Percentage of the market share (replace with actual data)
      color: "rgba(50, 205, 50, 0.7)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Ford",
      population: 15, // Percentage of the market share (replace with actual data)
      color: "rgba(255, 0, 0, 0.7)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Chevrolet",
      population: 10, // Percentage of the market share (replace with actual data)
      color: "rgba(128, 0, 128, 0.7)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Tesla",
      population: 25, // Percentage of the market share (replace with actual data)
      color: "rgba(255, 140, 0, 0.7)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  // Dummy data for the LineChart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 60, 70, 80, 90, 100], // Replace with your data
      },
    ],
  };
  const carSalesData = {
    labels: ["Toyota", "Honda", "Ford", "Chevrolet", "Tesla"],
    datasets: [
      {
        data: [3500, 2800, 2200, 1800, 5000], // Car sales data (replace with actual numbers)
      },
    ],
  };
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    // You can implement the logic to save edited user data here
    console.log(editedUserInfo);

    await fetch(`${BACKEND}/user/update-user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editedUserInfo.name,
        email: editedUserInfo.email,
        // Add other user attributes here
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Alert.alert("Profile Updated Successfully");
        userActions.setUser(data.user);
        setIsEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUserInfo.name}
              onChangeText={(text) =>
                setEditedUserInfo({ ...editedUserInfo, name: text })
              }
            />
          ) : (
            <Text style={styles.input}>{user.name}</Text>
          )}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUserInfo.email}
              onChangeText={(text) =>
                setEditedUserInfo({ ...editedUserInfo, email: text })
              }
            />
          ) : (
            <Text style={styles.input}>{user.email}</Text>
          )}
        </View>
        {/* Add other user attributes here */}
        {isEditing ? (
          <>
            <Button title="Save Profile" onPress={handleSaveProfile} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </>
        ) : (
          <>
            <Button title="Edit Profile" onPress={handleEditProfile} />
            <Button title="Back" onPress={() => navigation.goBack()} />
          </>
        )}
        <View >
          <Text style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
            marginLeft: 20,
            alignSelf: "center",

          }}>Data Charts:</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Car Sales Chart:</Text>
          <BarChart
            data={carSalesData}
            width={300}
            height={200}
            yAxisLabel="Units Sold"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />
        </View>
        

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Car Brand Market Share:</Text>
          <PieChart
            data={carBrandData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
        <View style={styles.fieldContainer}>
        <Text style={styles.label}>Car Price Trend:</Text>
        <LineChart
          data={chartData}
          width={300}
          height={200}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
        />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    fontSize: 16,
  },
});

export default Profile;
