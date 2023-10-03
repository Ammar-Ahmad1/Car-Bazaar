// import { StyleSheet, Text, View, ScrollView } from 'react-native'
// import React,{useState,useEffect} from 'react'
// import CarDetails from '../../Components/CarDetails.js'
// import { useRoute } from '@react-navigation/native'
// import {useUserState} from '../Slices/userSlice.js';
// import {BACKEND} from '../../CONSTANTS.js';
// const DetailScreen = () => {
//    // [1
//   const route = useRoute();
//   // const car = route.params.car;
//   const [car, setCar] = useState(route.params.car);
//   const [winningBid, setWinningBid] = useState(null);
//   const user = useUserState();
//   //recieve get car from route
//   // console.log(car);
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     getCars();
//   }
//   , [
//     car
//   ]);
//   const getCars = async () => {
//     try {
//       fetch(`${BACKEND}/car/get-cars`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data.cars);
//         setData(data.cars);
//         data.cars.map((updatedCar) => {
//           if(updatedCar._id === car._id) {
//             setCar(updatedCar);
//           }
//         }
//         )
//         data.cars.bids.map((bid) => {
//           if(bid.accepted) {
//             setWinningBid(bid);
//           }
//         }
//         )

//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // if(user.id === car.seller) {
//   //   setIsOwner(true);
//   // }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//         <Text style={{fontSize: 30, fontWeight: "bold", marginBottom: 20,marginTop:80}}>Car Details</Text>
//       <CarDetails car={car} getCars={getCars}/>
//       {/* user bids */}
//       {user.id === car.seller._id ? <View style={{marginBottom: 20}}>
//         <Text style={{fontSize: 30, fontWeight: "bold", marginBottom: 20,marginTop:80}}>Bid History</Text>
//         {car.bids.map((bid) => {
//           return (
//             <View style={{marginBottom: 20}}>
//               <Text style={{fontSize: 13}}>Bid Amount: {bid.bidAmount}</Text>
//               <Text style={{fontSize: 13}}>Bidder: {bid.bidder.email}</Text>
//               <Text style={{fontSize: 13}}>Bid Date: {bid.bidTimestamp}</Text>
//               <Text style={{fontSize: 13}}>Bid Status: {bid.accepted ? "Accepted" : bid.rejected ? "Rejected" : "Pending"
//             }</Text>
//             </View>
//           )
//         }
//         )}
//       </View> : null}
// {
//   user.id !== car.seller._id ?
//       <View style={{marginBottom: 20
//       }}>
//       <Text style={{fontSize: 30, fontWeight: "bold", marginBottom: 20,marginTop:80}}>Your Bids</Text>
//       {car.bids.map((bid) => {
//         if(bid.bidder._id === user.id) {
//           return (
//             <View style={{marginBottom: 20}}>
//               <Text style={{fontSize: 13}}>Bid Amount: {bid.bidAmount}</Text>
//               <Text style={{fontSize: 13}}>Bid Date: {bid.bidTimestamp}</Text>
//               <Text style={{fontSize: 13}}>Bid Status: {bid.accepted ? "Accepted" : bid.rejected ? "Rejected" : "Pending"
//             }</Text>
//             </View>
//           )
//         }
//       })}
//       </View>
//       : null
// }
//       {/* all bids */}

//       {
//         car.winningBidder?._id === user.id ?
//         <View style={{marginBottom: 20}}>
//         {/* show message */}
//         <Text style={{fontSize: 30, fontWeight: "bold", marginBottom: 20,marginTop:80}}>Congratulations </Text>
//         <Text style={{fontSize: 13}}>You have won the bid for this car</Text>
//         <Text style={{fontSize: 13}}>Bid Amount: {car.winningBid.bidAmount}</Text>
//         <Text style={{fontSize: 13}}>Bid Date: {car.winningBid.bidTimestamp}</Text>

//         </View> : null
//       }
//     </ScrollView>
//   )
// }

// export default DetailScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center', // Center content vertically
//     // alignItems: 'center',     // Center content horizontally
//     backgroundColor: '#fff',  // Set your desired background color
//     padding: 10,
//   },
// });
import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import CarDetails from "../../Components/CarDetails";
import { useRoute } from "@react-navigation/native";
import { useUserState } from "../Slices/userSlice";
import { BACKEND } from "../../CONSTANTS.js";

const DetailScreen = () => {
  const route = useRoute();
  const [car, setCar] = useState(route.params.car);
  const [winningBid, setWinningBid] = useState(null);
  const user = useUserState();
  const [data, setData] = useState([]);

  useEffect(() => {
    getCars();
  }, []); // Only re-fetch cars when the car object changes

  const getCars = async () => {
    try {
      fetch(`${BACKEND}/car/get-cars`)
        .then((res) => res.json())
        .then((data) => {
          setData(data.cars);
          const updatedCar = data.cars.find(
            (updatedCar) => updatedCar._id === car._id
          );
          if (updatedCar) {
            setCar(updatedCar);
          }

          const winningBids = data.cars
            .flatMap((car) => car.bids)
            .filter((bid) => bid.accepted);

          const winningBidForThisCar = winningBids.find(
            (bid) => bid.car === car._id
          );

          if (winningBidForThisCar) {
            setWinningBid(winningBidForThisCar);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CarDetails car={car} getCars={getCars} />
      {user.id === car.seller._id && (
        <View style={styles.bidHistory}>
          <Text style={styles.subtitle}>Bid History</Text>
          {car.bids.map((bid) => {
            let bidItemStyle = styles.pendingBidItem; // Default style for pending bids

            if (bid.accepted) {
              bidItemStyle = styles.acceptedBidItem; // Style for accepted bids
            } else if (bid.rejected) {
              bidItemStyle = styles.rejectedBidItem; // Style for rejected bids
            }

            return (
              <View key={bid._id} style={[styles.bidItem, bidItemStyle]}>
                <Text>Bid Amount: {bid.bidAmount}</Text>
                <Text>Bidder: {bid.bidder.email}</Text>
                <Text>Bid Date: {bid.bidTimestamp}</Text>
                <Text>
                  Bid Status:{" "}
                  {bid.accepted
                    ? "Accepted"
                    : bid.rejected
                    ? "Rejected"
                    : "Pending"}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {user.id !== car.seller._id && (
        <View style={styles.yourBids}>
          <Text style={styles.subtitle}>Your Bids</Text>
          {car.bids.map((bid) => {
            if (bid.bidder._id === user.id) {
              const bidItemStyle = bid.accepted
                ? styles.acceptedBidItem
                : bid.rejected
                ? styles.rejectedBidItem
                : styles.pendingBidItem;

              return (
                <View key={bid._id} style={[styles.bidItem, bidItemStyle]}>
                  <Text>Bid Amount: {bid.bidAmount}</Text>
                  <Text>Bid Date: {bid.bidTimestamp}</Text>
                  <Text>
                    Bid Status:{" "}
                    {bid.accepted
                      ? "Accepted"
                      : bid.rejected
                      ? "Rejected"
                      : "Pending"}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      )}

      {winningBid && winningBid.bidder._id === user.id && (
        <View style={styles.congratulations}>
          <Text style={styles.subtitle}>Congratulations</Text>
          <Text>You have won the bid for this car</Text>
          <Text>Bid Amount: {winningBid.bidAmount}</Text>
          <Text>Bid Date: {winningBid.bidTimestamp}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 5,
    flexGrow: 1,
    justifyContent: "center", // Center content vertically
    backgroundColor: "white", // Set your desired background color
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 80,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 80,
  },
  bidHistory: {
    marginBottom: 20,
  },
  yourBids: {
    marginBottom: 20,
  },
  bidItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
  },
  acceptedBidItem: {
    backgroundColor: "green", // Change to your desired background color
  },
  rejectedBidItem: {
    backgroundColor: "red", // Change to your desired background color
  },
  pendingBidItem: {
    backgroundColor: "yellow", // Change to your desired background color
  },
  congratulations: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 80,
  },
});
