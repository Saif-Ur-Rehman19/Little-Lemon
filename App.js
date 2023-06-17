import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "./screens/Onboarding";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "./screens/Profile";

import { LogBox } from "react-native";
import { AppContext } from "./store/AuthContext";
import Home from "./screens/Home";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function getData() {
      const data = await AsyncStorage.getItem("userInfo");
      if (data != null) {
        setIsOnboardingCompleted(true);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <AppContext.Provider
        value={{
          isOnboardingCompleted: isOnboardingCompleted,
          setIsOnboardingCompleted: setIsOnboardingCompleted,
        }}
      >
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator>
            {isOnboardingCompleted ? (
              <>
              <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false }}
              />
              </>
            ) : (
              <Stack.Screen
                name="Onboard"
                component={Onboarding}
                initialParams={{
                  setIsOnboardingCompleted: setIsOnboardingCompleted,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </>
  );
}
