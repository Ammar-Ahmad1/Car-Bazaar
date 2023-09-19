import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import {Button as Button1} from "react-native-paper";
import { Modal } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Slider from "@react-native-community/slider";

import { FontAwesome } from "@expo/vector-icons";

import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import userImg from "../../assets/UserrImg.png";
import { useUserStateActions } from "../Slices/userSlice";
import BigImageCard from "../../Components/BigImageCard";
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
import { BACKEND } from "../../CONSTANTS.js";

const images = [
  { id: "1", source: require("../../assets/Image1.jpg") },
  { id: "3", source: require("../../assets/Image3.jpg") },
  { id: "4", source: require("../../assets/Image4.jpg") },
  { id: "5", source: require("../../assets/Image7.jpg") },
  { id: "6", source: require("../../assets/Image6.jpg") },
];
const events = [
  {
    id: "1",
    imageSource: require("../../assets/Image1.jpg"),
    title: "Event 1",
    date: "August 15, 2023",
    location: "Venue 1",
    description: "Description of Event 1.",
  },
  {
    id: "2",
    imageSource: require("../../assets/Image3.jpg"),
    title: "Event 2",
    date: "September 10, 2023",
    location: "Venue 2",
    description: "Description of Event 2.",
  },
  // Add more events with similar structure
];

const DropdownMenu = ({ onLogout, onProfile, onYourCars }) => {
  console.log("DropdownMenu");
  return (
    <View style={styles.dropdownMenu}>
      <TouchableOpacity onPress={onYourCars} style={styles.dropdownItem}>
        <Text>Your Cars</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfile} style={styles.dropdownItem}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout} style={styles.dropdownItem}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const EventCard = ({ event }) => (
  <View style={styles.eventCard}>
    <Image source={event.imageSource} style={styles.eventImage} />
    <View style={styles.eventDetails}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventInfo}>Date: {event.date}</Text>
      <Text style={styles.eventInfo}>Location: {event.location}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(0);
  const [selectedCars, setSelectedCars] = useState([]);
  const toggleFilterModal = () => {
    setShowModal(!showModal);
  };
  const FilterModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filters</Text>
        <TouchableOpacity
          onPress={toggleFilterModal}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "lightgray",
            padding: 5,
            borderRadius: 5,
          }}
        >
          <Text>Close</Text>
        </TouchableOpacity>

        <Text>Year:</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter year..."
          value={yearFilter}
          onChangeText={(text) => setYearFilter(text)}
          keyboardShouldPersistTaps="always"
        />
        <Text>Price: {priceFilter}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100000}
          step={1000}
          value={priceFilter}
          onValueChange={(value) => setPriceFilter(value)}
        />
        <Button title="Apply Filters" onPress={applyFilters} />
      </View>
    );
  };
  const applyFilters = () => {
    // Filter data based on year and price filters
    if (!yearFilter && !priceFilter) {
      setFilteredData(data);
      setShowModal(false);
      return;
    }

    const filteredData = data.filter(
      (item) => item.year.toString() === yearFilter && item.price <= priceFilter
    );
    setFilteredData(filteredData);

    // Close the filter modal
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const getCars = async () => {
    try {
      fetch(`${BACKEND}/car/get-cars`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.cars);
          setData(data.cars);
          setFilteredData(data.cars);
          // selecte

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
  const handleSearch = (text) => {
    setSearch(text);

    if (text === "") {
      setFilteredData(data); // Reset to all cars when search text is empty
    } else {
      const newData = data.filter((item) => {
        const itemData =
          item.make.toUpperCase() +
          item.model.toUpperCase() +
          item.location.toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData); // Update filteredData with search results
    }
  };
  const userActions = useUserStateActions();
  const ImageCard = ({ item }) => (
    <View style={{ marginRight: 20 }}>
      <Text style={{ paddingHorizontal: 10 }}>Coming Soon!</Text>
      <Image source={item.source} style={styles.storyImg} />
    </View>
  );
  const handleLogout = () => {
    // Handle logout logic here
    // For example, call a function to clear user data and navigate to the login screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleYourCars = () => {
    navigation.navigate("userCars");
  };
  const selectCar = (car) => {
    //if length is 2 then remove the first elements  after alert confirmation
    if(selectedCars.length === 2){
      Alert.alert(
        "Alert",
        "You have already selected two cars. Do you want to remove the first car and add this one?",
        [
          {
            text: "Cancel",
            onPress: () => {return},
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => {
              setSelectedCars([car]);
            },
          },
        ],
        { cancelable: false }
      );
    }

    // Check if the car is already selected
    if (selectedCars.includes(car)) {
      
    } else {
      // Check if two cars are already selected
      if (selectedCars.length < 2) {
        setSelectedCars([...selectedCars, car]);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.ImgContainer}>
        <TouchableOpacity onPress={toggleDropdown}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        {isDropdownVisible && (
          <DropdownMenu
            onLogout={handleLogout}
            onProfile={handleProfile}
            onYourCars={handleYourCars}
          />
        )}
        <Text
          style={{ fontSize: Height * 0.03, fontFamily: "Montserrat_Bold" }}
        >
          Car Bazar
        </Text>
        <Button title="Add Car" onPress={() => navigation.navigate("AddCar")} />
      </View>
      {/* Header start  */}
      <View style={styles.headerContainer}>
        <Text
          style={{
            fontSize: Height * 0.03,
            fontFamily: "Montserrat_Bold",
            color: "#fff",
          }}
        >
          Events
        </Text>
        <View
          style={{
            width: "100%",
            marginTop: "4%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            data={events}
            horizontal
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search Cars by name, city or model"
          placeholderTextColor="black"
          onChangeText={(text) => {
            handleSearch(text);
          }}
          value={search} // Added value prop to keep the input field in sync with state
        />
        <TouchableOpacity style={styles.filterIcon} onPress={toggleFilterModal}>
          <FontAwesome name="filter" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1,
        justifyContent: "space-between",
      }}>
        <View
        style={{ flexDirection: "row",
          justifyContent: "space-between",
        }}
        >
          <Text style={styles.recommend}>Recommended</Text>
          <Button1 
          style={{ 
            paddingHorizontal: "6%",
            paddingVertical: "4%",
            fontFamily: "Montserrat_Bold",
            fontSize: Height * 0.02,
            
            borderColor: "black",
            // backgroundColor: "black",
          }}
          disabled={selectedCars.length !== 2}
        onPress={() => navigation.navigate("compare", { selectedCars })}
        
        >{`Compare (${selectedCars.length}/2)`}
        </Button1>
        </View>
        
        <View
          style={{
            width: "100%",
            paddingBottom: "4%",
          }}
        >
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <BigImageCard item={item} navigation={navigation} selectCar={selectCar} selectedCars={selectedCars}/>
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        // onRequestClose={() => setShowModal(false)}
        onRequestClose={toggleFilterModal}
      >
        <TouchableWithoutFeedback onPress={toggleFilterModal}>
          <FilterModalContent />
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
  },
  headerContainer: {
    flex: 0.4,
    // marginTop: "5%",
    padding: 10,
    backgroundColor: "black",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 3,
  },

  userImg: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  ImgContainer: {
    marginTop: "10%",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
  },
  logouttext: {
    fontFamily: "Montserrat_Bold",
    fontSize: Height * 0.019,
    color: "#fff",
    marginLeft: 10, // Add spacing to the left
    marginRight: 10, // Add spacing to the right
    border: "1px solid",
    backgroundColor: "#76A9FA",
    padding: 5,
    borderRadius: 10,
  },
  dropdownMenu: {
    position: "absolute",
    padding: 10,
    top: 70, // Adjust this value to position the menu properly
    // right: 100,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    // zIndex: 9999,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    elevation: 3,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  eventDetails: {
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventInfo: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  eventDescription: {
    fontSize: 14,
    marginTop: 10,
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  storyImg: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    width: "60%",
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1, // Adjust to take available space
    marginLeft: "auto", // Position to the right
    marginRight: 10, // Add spacing to the right
  },

  recommend: {
    paddingHorizontal: "6%",
    paddingVertical: "4%",
    fontFamily: "Montserrat_Bold",
    fontSize: Height * 0.02,
  },
  filterIcon: {
    position: "absolute",
    top: 30,
    right: 30,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "80%", // Adjust the width to your preference
    alignSelf: "center", // Center horizontally
    marginTop: "30%", // Adjust the margin from the top
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
});
