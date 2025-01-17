import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAuth } from "../contexts/AuthContext";

interface Group {
    id: number;
    name: string;
    image: string | null; // Group images can be null
}

type RootStackParamList = {
    groups: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "groups"
>;

const uri =
    Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":3000") ??
    "yourapi.com";
const EXPO_PUBLIC_BASE_NGROK = `http://${uri}`;

export default function MatchScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { userId, authToken } = useAuth(); // Get user ID and token from context
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

        const fetchGroups = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${EXPO_PUBLIC_BASE_NGROK}/users/${userId}/groups`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch groups");
                }

                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setIsLoading(false);
                setRefreshing(false);
            }
        };
    
    useEffect(() => {
        fetchGroups();
    }, [userId, authToken]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchGroups();
    };

    const renderGroup = ({ item }: { item: Group }) => {
        // Helper function to check if the string is a base64 image
        const isBase64Image = (image: string | null): boolean => {
            if (!image) return false;
            const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,/;
            return base64Pattern.test(image);
        };
    
        const imageSource = item.image
            ? isBase64Image(item.image)
                ? { uri: item.image } // Base64 image
                : { uri: `data:image/jpeg;base64,${item.image}` } // Add prefix if missing
            : require("../../assets/images/No-Image-Placeholder.png");
    
        return (
            <View style={styles.groupContainer}>
                <Image
                    source={imageSource}
                    style={styles.groupImage}
                />
                <Text style={styles.groupName}>{item.name}</Text>
            </View>
        );
    };

    if (isLoading && !refreshing) {
        return (
            <View style={{}}>
                <ActivityIndicator size="large" color={Colors.dark.tabIconSelected} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { flexDirection: "column" }]} >
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.dark.background,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingHorizontal: 16,
                    gap: 10,
                }}
            >
                <ThemedText type="title" style={{ marginTop: "10%" }}>
                    Minhas Sessões
                </ThemedText>
            </View>
            <SafeAreaView
                style={{
                    flex: 4 / 2,
                    backgroundColor: Colors.dark.background,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <FlatList
                    data={groups}
                    renderItem={renderGroup}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </SafeAreaView>
            <View
                style={{
                    flex: 3 / 4,
                    backgroundColor: Colors.dark.background,
                    paddingLeft: 20,
                    paddingTop: 20,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                }}
            >
                <ThemedText
                    type="subtitle"
                    style={{
                        position: "absolute",
                        marginTop: 10,
                        marginLeft: 20,
                    }}
                >
                    Criar nova sessão
                </ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da Sessão"
                    keyboardType="default"
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                />
                <Pressable style={styles.button}>
                    <ThemedText
                        type={"defaultSemiBold"}
                        style={{ fontSize: Fonts.dark.buttonText }}
                    >
                        Criar
                    </ThemedText>
                </Pressable>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.dark.background,
                    paddingLeft: 20,
                    paddingTop: 20,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                }}
            >
                <ThemedText
                    type="subtitle"
                    style={{
                        position: "absolute",
                        marginTop: 10,
                        marginLeft: 20,
                    }}
                >
                    Entrar em sessão existente
                </ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Endereço da Sessão"
                    keyboardType="default"
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                />
                <Pressable style={styles.button}>
                    <ThemedText
                        type={"defaultSemiBold"}
                        style={{ fontSize: Fonts.dark.buttonText }}
                    >
                        Entrar
                    </ThemedText>
                </Pressable>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupContainer: {
        alignItems: "center",
        marginRight: 15,
    },
    groupImage: {
        borderRadius: 8,
        width: 170,
        height: 260,
        elevation: 10,
    },
    listContainer: {
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        paddingLeft: 20,
    },
    boxContainer: {
        flex: 1,
    },
    card: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 160,
        height: 230,
        borderRadius: 8,
        margin: 8,
        elevation: 10,
    },
    elevated: {
        backgroundColor: "white",
    },
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text,
    },
    button: {
        position: "absolute",
        right: 12,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
        marginTop: 40,
        fontSize: Fonts.dark.buttonText,
    },
    backButton: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.8,
        marginTop: 32,
    },
    groupName: {
        fontSize: 16,
        color: Colors.dark.text,
        alignSelf: 'flex-start',
        fontWeight: '500'
    },
});
