import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "./contexts/AuthContext";

type User = {
    id: number;
    name: string;
    second_name: string;
    user: string;
};

type GroupUser = {
    id: number;
    userId: number;
    groupId: number;
    user: User;
};

type Group = {
    id: number;
    name: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    users: GroupUser[];
};

type RootStackParamList = {
    history: { groupId: number };
    groups: { groupId: number };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const HistoryScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute<GroupsNavigationProp>();
    const { groupId } = route.params;
    const { authToken } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log(groupId);
    navigation = useNavigation();

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(
                    `${URL_LOCALHOST}/groups/${groupId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch group data");
                }
                const data: Group = await response.json();
                setGroup(data);
                // console.log(data);
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroup();
    }, [groupId]);

    if (!group) {
        return (
            <View style={{}}>
                <Text>Grupo não econtrado.</Text>
            </View>
        );
    }

    const imageSource = group.image
        ? { uri: group.image }
        : require("@/assets/images/group_background.png");

    return (
        <View style={styles.mainContainer}>
            <View
                style={{
                    flex: 1 / 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: Colors.dark.background,
                    marginTop: 30,
                }}
            >
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FontAwesome
                        size={30}
                        name="chevron-left"
                        color={Colors.dark.text}
                    />
                </Pressable>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    backgroundColor: Colors.dark.background,
                }}>
                    <ThemedText type="subtitle" style={styles.groupName}>
                        {group.name}
                    </ThemedText>
                    <View style={styles.groupImage}>
                        <Image
                            source={imageSource}
                            style={styles.groupImage}
                        ></Image>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 3,
                    alignItems: "center",
                    backgroundColor: Colors.dark.background,
                    marginTop: 10,
                }}
            >
                <ThemedText type="title" style={{ marginBottom: 20 }}>
                    Histórico
                </ThemedText>
                <ScrollView
                    style={{
                        width: "100%",
                        height: "100%",
                        gap: 5,
                        padding: 0,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <View style={styles.poster}>
                            <Image
                                source={require("@/assets/images/movie-poster.jpg")}
                                style={styles.poster}
                            ></Image>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ThemedText type="default" style={styles.text}>
                                Filme: Nada de Novo no Front
                            </ThemedText>
                            <ThemedText type="default" style={styles.text}>
                                Grupo: Escola
                            </ThemedText>
                            <ThemedText
                                type="default"
                                style={styles.text}
                            ></ThemedText>
                            <ThemedText
                                type="default"
                                style={styles.text}
                            ></ThemedText>
                            <ThemedText type="default" style={styles.endText}>
                                Data do Match: 16/04/2024
                            </ThemedText>
                            <FontAwesome
                                size={20}
                                name="trash"
                                style={styles.trash}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.dark.background,
        gap: 10,
    },
    backButton: {
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.dark.background,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
  },
    groupImage: {
        width: 50,
        height: 50,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        elevation: 2,
    },
    groupName:{
      height: 50,
      paddingVertical: 14,
      paddingHorizontal: 10,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      backgroundColor: Colors.dark.tabIconSelected,
    },
    poster: {
        width: 70,
        height: 100,
        borderRadius: 5,
        elevation: 2,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#414344",
        marginTop: 5,
        padding: 5,
        elevation: 5,
        borderRadius: 5,
    },
    text: {
        marginLeft: 10,
    },
    endText: {
        marginRight: 5,
        marginTop: 5,
        textAlign: "right",
        opacity: 0.5,
        fontSize: 10,
    },
    trash: {
        position: "absolute",
        right: 5,
        top: 5,
        color: Colors.dark.tabIconSelected,
        opacity: 0.6,
    },
});

export default HistoryScreen;
