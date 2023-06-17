import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");
function Onboarding({navigation, route}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  function handleEmailInput(emailAddress) {
    setEmail(emailAddress);
    setDisabled(false);
  }

  function handleFirstNameInput(firstNameText) {
    setFirstName(firstNameText);
    setDisabled(false);
  }

  async function storeUserInfo(name) {
    try {
      await AsyncStorage.setItem("userInfo", name);
    } catch (error) {
      console.error(error);
    }
  }
  
  async function storeUserEmail(email) {
    try {
      await AsyncStorage.setItem("email", email);
    } catch (error) {
      console.error(error);
    }
  }

  function validateName() {
    if (firstName === null || firstName.length < 3) {
      return false;
    }
    if (
      firstName.includes(
        "0" || "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9"
      )
    ) {
      return false;
    }
    return true;
  }

  function validateEmail() {
    if (email === null) {
      return false;
    }
    if (email.includes("@") && email.endsWith(".com")) {
      return true;
    } else {
      return false;
    }
  }

  function nextButtonHandler() {
    if (validateEmail() && validateName()) {
      storeUserInfo(firstName);
      storeUserEmail(email);
      route.params.setIsOnboardingCompleted(true);
      Alert.alert("Success!", "Your submission is saved");
    } else {
      Alert.alert("Warning!", "Please enter your name and email correctly");
      setDisabled(true);
    }
    setEmail("");
    setFirstName("");
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={require("../assets/Logo.png")} style={styles.logo} />
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.welcomeText}>Let us get to know you</Text>
          <Text style={styles.firstName}>First Name</Text>
          <TextInput
            style={styles.inputFirstName}
            onChangeText={handleFirstNameInput}
            value={firstName}
          />
          <Text style={styles.email}>Email</Text>
          <TextInput
            style={styles.inputEmail}
            keyboardType="email-address"
            onChangeText={handleEmailInput}
            value={email}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            disabled={disabled}
            onPress={nextButtonHandler}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: width,
    height: height * 0.15,
    backgroundColor: "#E1EEDD",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    resizeMode: "contain",
    marginTop: "15%",
  },
  mainContainer: {
    width: width,
    height: height * 0.6,
    backgroundColor: "#BDCDD6",
    alignItems: "center",
  },
  welcomeText: {
    marginTop: "15%",
    fontSize: 24,
    color: "#2C3333",
  },
  firstName: {
    color: "#2C3333",
    marginTop: "35%",
    fontSize: 24,
  },
  email: {
    color: "#2C3333",
    marginTop: "5%",
    fontSize: 24,
  },
  inputFirstName: {
    borderWidth: 1,
    width: width * 0.77,
    marginTop: "5%",
    borderColor: "#2C3333",
    borderRadius: 8,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
  },
  inputEmail: {
    borderWidth: 1,
    width: width * 0.77,
    marginTop: "5%",
    borderColor: "#2C3333",
    borderRadius: 8,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
  },
  footer: {
    backgroundColor: "#DDF7E3",
    width: width,
    height: height * 0.25,
    alignItems: "flex-end",
  },
  nextButton: {
    margin: "15%",
    backgroundColor: "#BDCDD6",
    height: "20%",
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: {
    color: "#2C3333",
  },
});
