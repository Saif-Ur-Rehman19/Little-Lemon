import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { MaskedTextInput } from "react-native-mask-text";
import { AppContext } from "../store/AuthContext";


function Profile({navigation}) {
  const [imageUri, setImageUri] = useState(null);
  const [firstLetter, setFirstLetter] = useState("");
  const [orderStatuses, setOrderStatuses] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [inputPhone, setInputPhone] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");

  const {setIsOnboardingCompleted} = useContext(AppContext)
 

  useEffect(() => {
    async function getFirstLetterOfUser() {
      try {
        let userName = await AsyncStorage.getItem("userInfo");
        setFirstLetter(userName.charAt(0));
        setFirstName(userName);
      } catch (error) {
        console.error(error);
      }
    }
    getFirstLetterOfUser();
  }, []);
  
  useEffect(() => {
    async function getEmail() {
      try {
        let email = await AsyncStorage.getItem("email");
        setEmail(email)
      } catch (error) {
        console.error(error)
      }
    }
    getEmail();
  }, [])

  useEffect(() => {
    async function getUserInfo() {

    }
    getUserInfo()
  }, [])

  useEffect(() => {
    let uri = '';
    let phone = 0
    let name = ''
    async function getData() {
      try {
        orderStatusesCheckbox = await AsyncStorage.getItem('orderStatusesCheckbox');
        setOrderStatuses(JSON.parse(orderStatusesCheckbox))
        passwordChangesCheckbox = await AsyncStorage.getItem('passwordChangesCheckbox');
        setPasswordChanges(JSON.parse(passwordChangesCheckbox))
        specialOffersCheckbox = await AsyncStorage.getItem('specialOffersCheckbox');
        setSpecialOffers(JSON.parse(specialOffersCheckbox))
        newsletterCheckbox = await AsyncStorage.getItem('newsletterCheckbox');
        setNewsletter(JSON.parse(newsletterCheckbox))
        uri = await AsyncStorage.getItem('avatarImage');
        setImageUri(uri)
        phone = await AsyncStorage.getItem('inputPhone');
        setInputPhone(phone)
        name = await AsyncStorage.getItem('lastName');
        setLastName(name)
      } catch (error) {
        
      }
    }
    getData();
    console.log("uri " + uri)
  }, [])
 
  

  function toggleOrderStatusesCheckbox() {
    setOrderStatuses(!orderStatuses);
  }

  function togglePasswordChangesCheckbox() {
    setPasswordChanges(!passwordChanges)
  }
  
  function toggleSpecialOffersCheckbox() {
    setSpecialOffers(!specialOffers)
  }

  function toggleNewsletterCheckbox() {
    setNewsletter(!newsletter)
  }

  function handleEnteredPhoneNumber(phone) {
    // Only allow digits and no more than 10 characters
    const formattedPhoneNumber = phone.replace(/[^\d]/g, '').slice(0, 10);
    // Validate that the input matches the US phone number format
    if (/^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(formattedPhoneNumber)) {
      setInputPhone(formattedPhoneNumber);
    }
  }

  function onChangeLastName(name) {
    setLastName(name);
  }


  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

   async function logout() {
    try {
      await AsyncStorage.clear();
      setIsOnboardingCompleted(false)
    } catch (error) {
      console.error(error);
    }
  }

  async function saveChanges() {
    try {
      if (imageUri != null && inputPhone != null && lastName != "") {
        await AsyncStorage.setItem("avatarImage", imageUri);
        await AsyncStorage.setItem("lastName", lastName);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("inputPhone", inputPhone);
        await AsyncStorage.setItem("orderStatusesCheckbox", JSON.stringify(orderStatuses));
        await AsyncStorage.setItem("passwordChangesCheckbox", JSON.stringify(passwordChanges));
        await AsyncStorage.setItem("specialOffersCheckbox", JSON.stringify(specialOffers));
        await AsyncStorage.setItem("newsletterCheckbox", JSON.stringify(newsletter));
        Alert.alert("Changes saved successfully!");
      } else {
        Alert.alert("Please enter all details correctly!")
      }
     
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteImage() {
    if(imageUri) {
      setImageUri('');
      await AsyncStorage.removeItem('avatarImage');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity style={{marginTop: '10%'}} onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back-circle-sharp"
          size={40}
          color="#678983"
          style={{ marginLeft: "3%"}}
        />
        </TouchableOpacity>
        
        <Image
          source={require("../assets/Logo.png")}
          style={{
            resizeMode: "contain",
            marginVertical: "5%",
            alignSelf: "center",
          }}
        />
        <Pressable
          onPress={pickImage}
          style={{
            backgroundColor: "black",
            borderRadius: 40,
            width: 80,
            height: 80,
            marginLeft: "4%",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "5%",
          }}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: "white",
                alignSelf: "center",
              }}
            >
              {firstLetter}
            </Text>
          )}
        </Pressable>
      </View>
      <ScrollView
        style={{
          borderWidth: 0.5,
          borderColor: "#678983",
          flex: 1,
          margin: "1%",
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: "5%",
            marginTop: "2%",
          }}
        >
          Personal information
        </Text>
        <Text style={{ marginLeft: "5%", color: "gray", marginTop: "5%" }}>
          Avatar
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginLeft: "5%",
              marginTop: "2%",
            }}
          />
          <TouchableOpacity style={{ marginLeft: "5%", marginTop: "10%" }} onPress={pickImage}>
            <View
              style={{
                backgroundColor: "#678983",
                padding: "5%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>Change</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: "5%", marginTop: "10%" }} onPress={deleteImage}>
            <View
              style={{
                backgroundColor: "white",
                padding: "5%",
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#678983",
                borderWidth: 1,
              }}
            >
              <Text style={{ color: "#678983" }}>Remove</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ margin: "4%" }}>First Name</Text>
        <TextInput
          style={{
            borderWidth: 0.5,
            height: 49,
            borderColor: "gray",
            marginHorizontal: "2%",
            borderRadius: 4,
            paddingHorizontal: 10,
          }}
          value={firstName}
        />
        <Text style={{ margin: "4%" }}>Last Name</Text>
        <TextInput
          style={{
            borderWidth: 0.5,
            height: 49,
            borderColor: "gray",
            marginHorizontal: "2%",
            borderRadius: 4,
            paddingHorizontal: 10,
          }}
          onChangeText={onChangeLastName}
          value={lastName}
        />
        <Text style={{ margin: "4%" }}>Email</Text>
        <TextInput
          style={{
            borderWidth: 0.5,
            height: 49,
            borderColor: "gray",
            marginHorizontal: "2%",
            borderRadius: 4,
            paddingHorizontal: 10,
          }}
          value={email}
        />
        <Text style={{ margin: "4%" }}>Phone Number</Text>
        <TextInput
          style={{
            borderWidth: 0.5,
            height: 49,
            borderColor: "gray",
            marginHorizontal: "2%",
            borderRadius: 4,
            paddingHorizontal: 10,
          }}
          keyboardType={"phone-pad"}
          onChangeText={handleEnteredPhoneNumber}
          maxLength={10}
          placeholder="Enter 10 digit US number"
          value={inputPhone}
        />
        <Text style={{ margin: "4%", fontWeight: "bold" }}>
          Email notifications
        </Text>
        <View style={{ flexDirection: "row", marginBottom: "3%" }}>
          <Checkbox
            style={{ marginLeft: "4%", marginRight: "2%" }}
            onValueChange={toggleOrderStatusesCheckbox}
            value={orderStatuses}
            color={"#678983"}
          />
          <Text>Order Statuses</Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: "3%" }}>
          <Checkbox
            style={{ marginLeft: "4%", marginRight: "2%" }}
            onValueChange={togglePasswordChangesCheckbox}
            value={passwordChanges}
            color={"#678983"}
          />
          <Text>Password Changes</Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: "3%" }}>
          <Checkbox
            style={{ marginLeft: "4%", marginRight: "2%" }}
            value={specialOffers}
            onValueChange={toggleSpecialOffersCheckbox}
            color={"#678983"}
          />
          <Text>Special Offers</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Checkbox
            style={{ marginLeft: "4%", marginRight: "2%" }}
            value={newsletter}
            onValueChange={toggleNewsletterCheckbox}
            color={"#678983"}
          />
          <Text>Newsletter</Text>
        </View>
        <TouchableOpacity
        onPress={logout}
          style={{
            backgroundColor: "#E7B10A",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
            width: "95%",
            alignSelf: "center",
            borderRadius: 8,
            height: "5%",
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginBottom: '15%', justifyContent: 'center'}}>
          <TouchableOpacity style={{ marginLeft: "5%", marginTop: "10%" }}>
            <View
              style={{
                backgroundColor: "white",
                padding: "5%",
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#678983",
                borderWidth: 1,
              }}
            >
              <Text style={{ color: "#678983" }}>Discard Changes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: "5%", marginTop: "10%" }} onPress={saveChanges}>
            <View
              style={{
                backgroundColor: "#678983",
                padding: "5%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>Save Changes</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
