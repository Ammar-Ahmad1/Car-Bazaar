import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import { useUserState } from "../src/Slices/userSlice.js";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BACKEND } from "../CONSTANTS.js";
import CarViewer from "./CarViewer.js";

const CarDetails = ({ car, getCars }) => {
  const navigation = useNavigation();
  const user = useUserState();
  const isOwner = user && user.id === car.seller._id;
  console.log("isOwner", isOwner);

  const isBiddingAvailable = !isOwner && car.isBiddingOpen;
  console.log("isBiddingAvailable", isBiddingAvailable);
  const [isBidModalVisible, setIsBidModalVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const sliderItems = car.photos.map((photo, index) => ({
    uri: photo,
    id: `image-${index}`,
  }));

  const [activeSlide, setActiveSlide] = React.useState(0);

  const toggleBidModal = () => {
    setIsBidModalVisible(!isBidModalVisible);
    if (!isBidModalVisible) {
      setBidAmount("");
    }
  };

  const renderImageItem = ({ item }) => {
    return (
      <Image
        source={{ uri: item.uri }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    );
  };

  const submitBid = async () => {
    const parsedBidAmount = parseFloat(bidAmount);

    if (
      !isNaN(parsedBidAmount) &&
      parsedBidAmount > car.currentBid &&
      parsedBidAmount > car.price
    ) {
      try {
        const response = await fetch(`${BACKEND}/car/place-bid/${car._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bidAmount: parsedBidAmount, userId: user.id }),
        });

        if (response.status === 200) {
          alert("Bid placed successfully");
          getCars();
          toggleBidModal();
        } else if (response.status === 400) {
          alert("Invalid bid amount. Please enter a higher bid.");
        } else if (response.status === 403) {
          alert("Bidding is not open for this car.");
        } else {
          alert("Bid could not be placed due to a server error.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while placing the bid.");
      }
    } else {
      alert("Invalid bid amount. Please enter a higher bid.");
    }
  };

  const handleStartBidding = async () => {
    const response = await fetch(`${BACKEND}/car/start-bidding/${car._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        startingBid: car.price,
      }),
    });

    if (response.status === 200) {
      alert("Bidding started successfully");
      getCars();
    } else {
      alert("Bidding could not be started");
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const response = await fetch(
        `${BACKEND}/car/accept-bid/${car._id}/${bidId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.status === 200) {
        alert("Bid accepted successfully");
        getCars();
      } else if (response.status === 403) {
        alert("Permission denied");
      } else if (response.status === 404) {
        alert("Bid not found");
      } else {
        alert("Bid could not be accepted due to a server error.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while accepting the bid.");
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      const response = await fetch(
        `${BACKEND}/car/reject-bid/${car._id}/${bidId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.status === 200) {
        alert("Bid rejected successfully");
        getCars();
      } else if (response.status === 403) {
        alert("Permission denied");
      } else if (response.status === 404) {
        alert("Bid not found");
      } else {
        alert("Bid could not be rejected due to a server error.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while rejecting the bid.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          data={sliderItems}
          renderItem={renderImageItem}
          sliderWidth={400}
          itemWidth={300}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={sliderItems.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
      <View
      style = {styles.carModelContainer}
      >
       <ScrollView scrollEnabled={false}>
      <CarViewer 
      car = {car}
      />
    </ScrollView>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.makeModelText}>
          {car.make} {car.model} {car.year}
        </Text>
        <Text style={styles.yearPriceText}>Price: Rs.{car.price}</Text>
        <Text style={styles.descriptionText}>{car.description}</Text>
        <Text style={styles.conditionText}>Condition: {car.condition}</Text>
        <Text style={styles.locationText}>Location: {car.location}</Text>
        <Text style={styles.contactText}>Contact: {car.contactPhone}</Text>
      </View>

      {isOwner ? (
        <>
          {car.isBiddingOpen ? (
            <>
              {car.bids?.length > 0 ? (
                <View style={styles.bidSection}>
                  <Text style={styles.bidTitle}>Bids:</Text>
                  {car.bids.map((bid, index) => (
                    <View key={index} style={styles.bidItem}>
                      <Text key={index} style={styles.bidAmount}>
                        ${bid.bidAmount} by {bid.bidder?.name}
                      </Text>
                      <Text style={styles.bidAmount}>
                        {bid.accepted
                          ? "Accepted"
                          : bid.rejected
                          ? "Rejected"
                          : "Pending"}
                      </Text>
                      {bid.accepted || bid.rejected ? null : (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAcceptBid(bid._id)}
                          >
                            <FontAwesome name="check" size={20} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleRejectBid(bid._id)}
                          >
                            <FontAwesome name="times" size={20} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ) : car.isBiddingOpen ? (
                <Text style={styles.noBiddingMessage}>
                  No bids have been placed yet.
                </Text>
              ) : null}
            </>
          ) : isOwner && !car.winningBid ? (
            <TouchableOpacity
              style={styles.startBiddingButton}
              onPress={handleStartBidding}
            >
              <Text style={styles.startBiddingButtonText}>Start Bidding</Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                padding: 10,
                backgroundColor: "yellow",
                color: "black",
              }}
            >
              Bidding is not avaiable for this car.
            </Text>
          )}
        </>
      ) : (
        <>
          {car.isBiddingOpen ? (
            <TouchableOpacity style={styles.bidButton} onPress={toggleBidModal}>
              <Text style={styles.bidButtonText}>Place a Bid</Text>
            </TouchableOpacity>
          ) : car.winningBidder?._id === user.id ? (
            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                padding: 10,
                backgroundColor: "green",
                color: "white",
              }}
            >
              Congartulations!! You are the winning bidder!
            </Text>
          ) : (
            <Text style={styles.noBiddingMessage}>
              Bidding is not avaiable for this car.
            </Text>
          )}
        </>
      )}

      <Modal
        visible={isBidModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleBidModal}
      >
        <View style={styles.bidModalContainer}>
          <View style={styles.bidModalContent}>
            <Text style={styles.bidModalTitle}>Place a Bid</Text>
            <TextInput
              style={styles.bidInput}
              placeholder="Enter your bid amount"
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={(text) => setBidAmount(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={submitBid}>
                <Text style={styles.submitButtonText}>Submit Bid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleBidModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  sliderImage: {
    width: 300,
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  carModelContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flex: 1,
    // aspectRatio: 1,
    marginTop: 20,
  },

  makeModelText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  yearPriceText: {
    fontSize: 18,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  conditionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  bidButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  bidButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  paginationContainer: {
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  bidModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bidModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
    alignItems: "center",
  },
  bidModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bidInput: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "45%",
    alignItems: "center",
    marginRight: 10,
  },
  submitButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "gray",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  startBiddingButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  startBiddingButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  noBiddingMessage: {
    fontSize: 18,
    marginTop: 20,
    padding: 10,
  },
  bidSection: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bidAmount: {
    fontSize: 16,
    marginBottom: 10,
  },
  bidItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "green",
    borderRadius: 5,
    width: 30,
    height: 30,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "red",
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarDetails;
