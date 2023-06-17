import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [starterActive, setStarterActive] = useState(false);
  const [mainsActive, setMainsActive] = useState(false);
  const [desertsAcitve, setDesertsActive] = useState(false);
  const [drinks, setDrinks] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    (async () => {
      let menuItems = [];
      await createTable();
      menuItems = await getMenuItemsFromDatabase();
      if (menuItems.length < 1) {
        menuItems = await getMenuData();
        saveMenuItems(menuItems);
        menuItems = await getMenuItemsFromDatabase();
        setData(menuItems);
      } else {
        setData(menuItems);
      }
      console.log(menuItems)
    })();
  }, []);

  useEffect(() => {
    filterByCategory(selectedCategories)
  }, [selectedCategories]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterByDishName(searchText);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchText])

  const filterByDishName = (searchText) => {
    const sql = `SELECT * FROM menu WHERE name LIKE ?`;
    const params = [`%${searchText}%`];
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, { rows }) => {
          const searchedDish = rows._array;
          setData(searchedDish);
        },
        (_, error) => {
          console.error(error);
        }
      );
    });
  }

  const handleCategoryPress = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const filterByCategory = (categories) => {
    if (categories.length === 0) {
      const sql = `SELECT * FROM menu`;
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          [],
          (_, { rows }) => {
            const unFilteredData = rows._array;
            setData(unFilteredData);
          },
          (_, error) => {
            console.error(error);
          }
        );
      });
    } else {
    let placeholders = '';
    let categoryValues = [];
    for (let i = 0; i < categories.length; i++) {
      placeholders += (i !== 0 ? ', ' : '') + '?';
      categoryValues.push(categories[i]);
    }
    const sql = `SELECT * FROM menu WHERE image IN (${placeholders})`;
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        categoryValues,
        (_, { rows }) => {
          const filteredData = rows._array;
          setData(filteredData);
        },
        (_, error) => {
          console.error(error);
        }
      );
    });
  }
  }

  async function createTable() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists menu (id integer primary key AUTOINCREMENT, name text, price text, description text, image text, category text);",
          [],
          () => {
            resolve();
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  function saveMenuItems(menuItems) {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into menu (name, price, description, image, category) values ${menuItems
          .map(
            (item) =>
              `("${item.name}", "${item.price}", "${item.description}","${item.category}", "${item.image}")`
          )
          .join(", ")}`
      );
    });
  }

  async function getMenuData() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const json = await response.json();
      const menuData = json.menu;
      return menuData;
    } catch (error) {
      console.error(error);
    }
  }

  async function getMenuItemsFromDatabase() {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM menu", [], (_, { rows }) => {
          resolve(rows._array);
        });
      });
    });
  }

  function RenderMenuItem({ item }) {
    return (
      <View style={{ marginLeft: "5%", flex: 1 }}>
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 22,
            marginVertical: "3%",
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", flexWrap: "wrap", flex: 1 }}>
            {item.description}
          </Text>
          <Image
            source={{
              uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.category}?raw=true`,
            }}
            style={{ width: 150, height: 150, marginRight: "5%" }}
          />
        </View>
        <Text style={{ fontSize: 22 }}>${item.price}</Text>
        <View
          style={{
            borderWidth: 0.29,
            borderColor: "gray",
            marginVertical: "4%",
          }}
        ></View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView horizontal={false}>
        <View style={styles.container}>
          <Image source={require("./../assets/Logo.png")} style={styles.logo} />
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("./../assets/tilly.png")}
              style={{
                width: 85,
                height: 85,
                resizeMode: "contain",
                borderRadius: 40,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#495e57" }}>
          <Text
            style={{
              color: "#F9D949",
              margin: "4%",
              fontSize: 44,
              marginBottom: 0,
            }}
          >
            Little Lemon
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", fontSize: 28, marginLeft: "4%" }}>
              Chicago
            </Text>
            <Image
              source={require("../assets/littleLemonBurger.jpg")}
              style={{
                width: 140,
                height: 170,
                marginLeft: "32%",
                borderRadius: 10,
                top: "3%",
              }}
            />
          </View>
          <Text
            style={{
              color: "white",
              marginLeft: "4%",
              fontSize: 18,
              bottom: "27%",
            }}
          >
            We are a family ownwed{`\n`} Mediterranean restaurent,{`\n`} focused
            on traditional{`\n`} recipes served with a{`\n`} modern twist.
          </Text>
          <View
            style={{
              bottom: "9%",
              //marginLeft: "13%",
              backgroundColor: "#edefee",
              width: "92%",
              height: 60,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <TextInput placeholder="Search Dishes" onChangeText={handleSearchTextChange} value={searchText}
              style={{
                width: "100%",
                flex: 1,
                paddingLeft: "10%",
                fontSize: 18,
                color: "black",
                marginLeft:'2%'
              }}
            />
            <View style={{ position: "absolute", left: "4%", }}>
              <FontAwesome name="search" size={24} color="black"/>
            </View>
          </View>
        </View>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: "5%",
            marginTop: "10%",
          }}
        >
          ORDER FOR DELIVERY!
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            marginRight: 10,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setStarterActive(!starterActive);
              handleCategoryPress("starters")
            }}
            style={{
              backgroundColor: starterActive ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: starterActive ? "white" : "black",
              }}
            >
              Starters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMainsActive(!mainsActive);
              handleCategoryPress("mains")
            }}
            style={{
              backgroundColor: mainsActive ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: mainsActive ? "white" : "black",
              }}
            >
              Mains
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDesertsActive(!desertsAcitve);
              handleCategoryPress("desserts")
            }}
            style={{
              backgroundColor: desertsAcitve ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: desertsAcitve ? "white" : "black",
              }}
            >
              Desserts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDrinks(!drinks);
            }}
            style={{
              backgroundColor: drinks ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{ fontWeight: "bold", color: drinks ? "white" : "black" }}
            >
              Drinks
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <FlatList data={data} renderItem={RenderMenuItem} style={{ flex: 1 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: "5%",
    flexDirection: "row",
  },
  logo: {
    resizeMode: "contain",
    marginTop: "5%",
  },
  profileContainer: {
    left: "44%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;