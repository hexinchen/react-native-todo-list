import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const router = useRouter();
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    async function fetchData(id) {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);

          setTodo(myTodo);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchData(id);
  }, [id]);

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  async function handleSave() {
    try {
      const savedTodo = { ...todo, title: todo.title };
      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const newTodoList = storageTodos.map((item) =>
          item.id.toString() === id ? savedTodo : item
        );

        await AsyncStorage.setItem("TodoApp", JSON.stringify(newTodoList));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
      }

      router.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          maxLength={30}
          value={todo?.title || ""}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark")
          }
          style={{ marginLeft: 10 }}
        >
          {colorScheme === "dark" ? (
            <Octicons
              name="moon"
              size={36}
              color={theme.text}
              style={{ width: 36 }}
            />
          ) : (
            <Octicons
              name="sun"
              size={36}
              color={theme.text}
              style={{ width: 36 }}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"}></StatusBar>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 5,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
  });
}
