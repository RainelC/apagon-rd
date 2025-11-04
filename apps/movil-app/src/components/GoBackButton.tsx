import { Pressable } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";

export const GoBackButton = () => {
    return (
        <Pressable onPress={() => router.back() } >
            <MaterialIcons name="keyboard-arrow-left" size={35  }/>
        </Pressable>
    )
}