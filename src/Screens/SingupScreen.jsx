import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
const height = Dimensions.get("screen").height;
import { useToast } from "react-native-toast-notifications";
import KeybordWrapper from "../../Components/KeybordWrapper";
import axios from "axios";
import { BACKEND } from "../../CONSTANTS";


const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").label("Name"),
  email: Yup.string(),
  password: Yup.string(),
  confirmPassword: Yup.string()

});

const SingupScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const signUpHandler = async (values) => {
    if (name.length < 3) {
      Alert.alert("Error", "Name should be at least 3 chars")
      return
    }
    if(email.length < 3){
      Alert.alert("Error","Email is required")
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password length should at least be 8")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords donot match")
      return
    }
    

    try {
      console.log("before request")
      console.log("test")
      const { data } = await axios.post(`${BACKEND}/user/sign-up`, {
        email, name, password
      });
      if (data) {
        console.log("data is ", data)
        Alert.alert("Success", "Signed up successfully")
        navigation.navigate("Login")
      }
    } catch (error) {
      console.log("error is ", error)
      console.log(error.response.data)
      Alert.alert("Error", error?.response?.data?.message)

    }

  }
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  return (
    <KeybordWrapper>
      <View style={style.container}>
        <Text style={style.head}>Welcome Onboard!</Text>
        <View style={style.form}>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(value) => {
              console.log("clicked");
              signUpHandler(value)
              //navigation.navigate("loginn");

            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={style.label}>Name</Text>

                <TextInput
                  placeholder="Enter your name"
                  style={style.inputhnd}
                  name="name"
                  value={name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  onChange={(e) => setName(e.nativeEvent.text)}
                />
                {errors.name && touched.name && (
                  <Text style={{ color: "red" }}>{errors.name}</Text>
                )}
                <Text style={style.label}>Email</Text>

                <TextInput
                  placeholder="Enter your Email address"
                  style={style.inputhnd}
                  name="email"
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                />
                {errors.email && touched.email && (
                  <Text style={{ color: "red" }}>{errors.email}</Text>
                )}
                <Text style={style.label}>Password</Text>

                <TextInput
                  placeholder="Create a Password"
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                  value={password}
                  style={style.inputhnd}
                  name="password"
                  secureTextEntry
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                />
                {errors.password && touched.password && (
                  <Text style={{ color: "red" }}>{errors.password}</Text>
                )}
                <Text style={style.label}>Confirm Password</Text>

                <TextInput
                  placeholder="Confirm Your Password"
                  onBlur={handleBlur("confirmPassword")}
                  onChangeText={handleChange("confirmPassword")}
                  style={style.inputhnd}
                  name="confirmPassword "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                  secureTextEntry
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
                )}
                <TouchableOpacity style={style.btn} onPress={signUpHandler}>
                  <Text
                    style={{
                      fontFamily: "Montserrat_Bold",
                      color: "#fff",
                      alignSelf: "center",
                      fontSize: height * 0.02,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <View style={style.singIn}>
                  <Text style={style.account}>Already have an account ? </Text>
                  <Text
                    style={style.end}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Sign In
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeybordWrapper>
  );
};

export default SingupScreen;

const style = StyleSheet.create({
  container: {
    width: "85%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "10%",
    height: height * 0.8,
  },
  head: {
    top: 75,
    fontWeight: "500",
    fontSize: height * 0.022,
    lineHeight: 30,
    fontFamily: "Montserrat_Bold",
  },
  para: {
    top: 85,
    fontSize: 13,
    lineHeight: 19,
    color: "#55847AF7",
    fontFamily: "Montserrat_Regular",
    width: "70%",
    left: "3.5%",
  },
  form: {
    width: "100%",
    height: height * 0.5,
    top: 120,
  },
  inputhnd: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 3,
    paddingHorizontal: 8,
    borderColor: "#ffff",
    paddingVertical: height * 0.012,
  },
  btn: {
    width: "100%",
    backgroundColor: "#007BFF",
    color: "#fff",
    alignSelf: "center",
    borderRadius: 3,
    padding: 12,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 18,
    fontFamily: "Montserrat_Bold",
    paddingVertical: "3%",
    marginVertical: "5%",
  },
  singIn: {
    flexDirection: "row",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 22,
    alignSelf: "center",
  },
  end: {
    color: "#000f45",
    fontWeight: "600",
    fontFamily: "Montserrat_Bold",
  },
  label: {
    fontFamily: "Montserrat_Regular",
    fontSize: height * 0.016,
    position: "relative",
    top: 10,
  },
  account: {
    fontFamily: "Montserrat_Regular",
    fontSize: height * 0.015,
  },
});
