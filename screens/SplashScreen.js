import { View, Text, StyleSheet } from "react-native";

function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Loading...
            </Text>
        </View>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    text: {
        fontSize: 28
    }
})