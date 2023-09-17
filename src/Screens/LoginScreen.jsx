import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import React, { useState } from "react";
// import Login from "../assets/loginn.png";
//   import Login from "../assets/wellcome.png";

import { Formik } from "formik";
import * as Yup from "yup";

import { useToast } from "react-native-toast-notifications";
import KeybordWrapper from "../../Components/KeybordWrapper";
import axios from "axios";
import { BACKEND } from "../../CONSTANTS";
import { useUserStateActions } from "../Slices/userSlice";
const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter valid email")
    .required("Email is required")
    .label("Email"),
  password: Yup.string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required")
    .label("Password"),
});

const LoginScreen = ({ navigation }) => {
  // const navigation = useNavigation();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userActions = useUserStateActions();
  const loginHandler = async () => {
    console.log("values are ", email, password);
    console.log("clicked");
    //navigation.navigate("Home");
    setLoading(true);
    try {
      console.log("before req");

      const { data } = await axios.post(`${BACKEND}/user/sign-in`, {
        email,
        password,
      });
      console.log(data);
      userActions.setUser(data.user);
      Alert.alert("Success", "Logged in successfully");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.log("in errr block");
      console.log(error.response.data);
      Alert.alert("Error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeybordWrapper>
      <KeyboardAvoidingView style={style.container}>
        <View style={{ marginTop: "25%" }}>
          <View style={style.imgContainer}>
            <Text style={style.Wtext}>Wellcome to Car Bazar</Text>
            {/* <Image source={Login} style={style.loginImg}></Image> */}
          </View>
          <View style={style.login}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(value) => {
                console.log("handle submit called");
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
                <KeyboardAvoidingView
                  behavior="position"
                  style={style.loginContainer}
                >
                  <View style={style.textIn}>
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
                      placeholder="Enter your password"
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
                    <Text style={style.passward}>Forgot Password ?</Text>
                    {/* <TouchableOpacity onPress={(values) => loginHandler(values)}
                      disabled={loading}
                    >
                      <Text style={style.btn}>Sign In</Text>
                    </TouchableOpacity> */}
                    <Button
                      onPress={(values) => loginHandler(values)}
                      loading={loading}
                      mode="contained"
                      style={{
                        alignSelf: "center",
                        textAlign: "center",
                        top: 35,
                        width: "100%",
                      }}
                    >
                      Sign In
                    </Button>
                  </View>
                </KeyboardAvoidingView>
              )}
            </Formik>
            <View style={style.singIn}>
              <Text style={style.account}>Dont have an account ?</Text>
              <Text
                onPress={() => navigation.navigate("SingUp")}
                style={style.end}
              >
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </KeybordWrapper>
  );
};

export default LoginScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    marginTop: "10%",
  },
  imgContainer: {
    // backgroundColor: "#475",
    marginTop: 40,
  },
  Wtext: {
    fontSize: 22,
    fontWeight: "500",
    alignSelf: "center",
    top: 30,
    lineHeight: 40,
    fontFamily: "Montserrat_Medium",
    padding: "4%",
  },
  loginImg: {
    width: width * 0.93,
    height: height * 0.25,
    resizeMode: "contain",
    top: 40,
    alignSelf: "center",
  },
  login: {
    flex: 2,
    // backgroundColor: "#940",
    alignItems: "center",
  },
  loginContainer: {
    width: "100%",
    paddingVertical: 50,
    overflow: "hidden",
    // backgroundColor: "#9293",
  },
  textIn: {
    width: width * 0.9,
    alignSelf: "center",
  },
  inputhnd: {
    width: "100%",
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    // height: ,
    marginBottom: 3,
    paddingHorizontal: 8,
    borderColor: "#ffff",
    paddingVertical: height * 0.012,
  },
  passward: {
    fontWeight: "500",
    fontSize: 16,
    color: "#55847A",
    marginTop: 6,
    fontFamily: "Montserrat_Regular",
  },
  btn: {
    width: "100%",
    backgroundColor: "#007BFF",
    color: "#fff",
    alignSelf: "center",
    borderRadius: 6,
    padding: 12,
    textAlign: "center",
    top: 35,
    fontWeight: "500",

    fontSize: 25,
    fontFamily: "Montserrat_Medium",
  },
  singIn: {
    flexDirection: "row",
    top: 1,
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 22,
  },
  end: {
    color: "#000f45",
    fontWeight: "600",
    fontFamily: "Montserrat_Medium",
    fontSize: height * 0.016,
  },
  label: {
    fontFamily: "Montserrat_Regular",
    fontSize: height * 0.02,
    position: "relative",
    top: 10,
  },
  account: {
    fontFamily: "Montserrat_Regular",
    fontSize: height * 0.015,
  },
});
