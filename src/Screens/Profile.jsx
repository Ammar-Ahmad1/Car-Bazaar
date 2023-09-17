import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet ,Alert} from "react-native";
import { useUserState,useUserStateActions} from "../Slices/userSlice";
import {BACKEND} from "../../CONSTANTS.js";

const Profile = ({navigation}) => {
  const user = useUserState();
  const userActions = useUserStateActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({
    name: "",
    email: "",
    // Add other user attributes here
  });

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
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
