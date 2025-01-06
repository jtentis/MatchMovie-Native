import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";

const API_KEY = "2017240ed8d4e61fbe9ed801fe5da25a";
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_NGROK = 'https://c5aa-201-76-179-217.ngrok-free.app';

type RootStackParamList = {
    details: { movieId: number };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList>;

interface Genre {
    id: number;
    name: string;
}

interface CastMember {
    cast_id: number;
    name: string;
    profile_path: string;
    character: string;
}

interface MovieDetails {
    title: string;
    overview: string;
    vote_average: number;
    release_date: string;
    runtime: number;
    genres: Genre[];
    credits: {
        cast: CastMember[];
    };
    poster_path: string | null;
}

interface WatchProvider {
    results: {
        BR?: {
            flatrate?: FlatRate[];
        };
    };
}

interface FlatRate {
    logo_path: string | null;
    provider_id: number;
    provider_name: string;
}

const MovieDetailsScreen = () => {
    const route = useRoute<DetailsScreenRouteProp>();
    const { movieId } = route.params; //581734, 414906, 157336, 389, 240, 278, 155
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(true);
    const [movieWatchProviders, setWatchProvider] =
        useState<WatchProvider | null>(null);
    const [isLoadingProviders, setIsLoadingProviders] = useState<boolean>(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const responseMovieDetails = await fetch(
                    `${BASE_NGROK}/movies/${movieId}/details`
                );
                console.log('filme clicado', movieId);
                const dataMovieDetails: MovieDetails =
                    await responseMovieDetails.json();
                setMovieDetails(dataMovieDetails);
                const responseWatchProviders = await fetch(
                    `${BASE_NGROK}/movies/${movieId}/watch_providers`
                );
                const dataWatchProviders: WatchProvider =
                    await responseWatchProviders.json();
                setWatchProvider(dataWatchProviders);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingDetails(false);
                setIsLoadingProviders(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (isLoadingDetails && isLoadingProviders) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!movieWatchProviders) {
        return <Text>Erro ao carregar detalhes do filme.</Text>;
    }

    if (!movieDetails) {
        return (
            <Text>
                Erro ao carregar plataformas onde o filme esta disponivel.
            </Text>
        );
    }

    const {
        title,
        overview,
        vote_average,
        release_date,
        runtime,
        genres,
        credits,
        poster_path,
    } = movieDetails;

    const { results } = movieWatchProviders;

    const genresText = genres
        .map((genre) => genre.name)
        .slice(0, 2)
        .join(" • ");

    const castNames = credits.cast.slice(0, 20).map((member) => member.name);

    const castCharacters = credits.cast
        .slice(0, 20)
        .map((member) => member.character);

    const castPictures = credits.cast
        .slice(0, 20)
        .map((member) => member.profile_path);

    const streamingPlatforms =
        results.BR?.flatrate
            ?.slice(0, 4)
            .map((member) => member.provider_name) || [];

    const streamingPlatformsPosters =
        results.BR?.flatrate?.slice(0, 4).map((member) => member.logo_path) ||
        [];

    //ajeitando para retornar bonitinho
    const vote_average_divided = (vote_average / 2).toFixed(2);
    const release_date_reduced = release_date.substring(
        0,
        release_date.length - 6
    );

    const posterUrl = poster_path
        ? { uri: `https://image.tmdb.org/t/p/w500${poster_path}` }
        : require("@/assets/images/No-Image-Placeholder.png");

    const castPicturesUrl = castPictures.map((path) =>
        path
            ? { uri: `https://image.tmdb.org/t/p/w500${path}` }
            : require("@/assets/images/no-image.png")
    );

    const streamingPlatformsPostersUrl = streamingPlatformsPosters.map((path) =>
        path
            ? { uri: `https://image.tmdb.org/t/p/w500${path}` }
            : require("@/assets/images/no-image.png")
    );
    
    // const platforms: any = {
    //     "Max": require("@/assets/images/max.png"),
    //     "Max Amazon Channel": require("@/assets/images/max.png"),
    //     "Netflix": require("@/assets/images/netflix.png"),
    //     "Amazon Prime Video": require("@/assets/images/prime.png"),
    //     "Claro tv+": require("@/assets/images/claro-tv.png"),
    //     "Globoplay": require("@/assets/images/globoplay.png"),
    //     "Disney Plus": require("@/assets/images/disneyplus.png"),
    // };

    // console.log(route.params);

    return (
        <>
            <View
                style={{
                    flex: 4 / 5,
                    backgroundColor: "blue",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    borderBottomWidth: 2,
                    borderColor: Colors.dark.tabIconSelected,
                }}
            >
                <ImageBackground
                    
                    style={styles.Image}
                    source={posterUrl}
                ></ImageBackground>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    {title}
                </ThemedText>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <View >
                        <FontAwesome size={30} name="chevron-left" color={Colors.dark.text} />
                    </View>
                </Pressable>
                <View style={styles.likeButton}>
                    <FontAwesome size={25} name="heart" color="white" />
                </View>
                <View style={styles.watchedButton}>
                    <FontAwesome size={25} name="eye" color="#D46162" />
                </View>
            </View>
            <ScrollView
                alwaysBounceVertical={true}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    backgroundColor: Colors.dark.background,
                    padding: 15,
                    paddingTop: 5,
                }}
            >
                <View
                    style={{
                        flex: 1 / 10,
                        flexDirection: "row",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 0,
                    }}
                >
                    <ThemedText type="defaultSemiBold" style={styles.details}>
                        {release_date_reduced} &#x2022; {runtime}min &#x2022;{" "}
                        {genresText}
                    </ThemedText>
                    <ThemedText
                        type="subtitle"
                        style={{
                            position: "relative",
                            right: 0,
                            top: 0,
                            fontSize: 20,
                        }}
                    >
                        {vote_average_divided}{" "}
                        <FontAwesome size={20} name="star" color="#D46162" />
                    </ThemedText>
                </View>
                <View
                    style={{
                        flex: 1 / 14,
                        flexDirection: "row",
                        backgroundColor: Colors.dark.background,
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: 0,
                        gap: 2,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            backgroundColor: Colors.dark.background,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 1.2,
                        }}
                    >
                        {streamingPlatforms.length > 0 ? (
                            streamingPlatforms.map((name, index) => (
                                <View key={index} style={styles.streamings}>
                                    <Image
                                        style={styles.streamingImages}
                                        source={streamingPlatformsPostersUrl[index]}
                                    />
                                </View>
                            ))
                        ) : (
                            <ThemedText type="defaultSemiBold" style={styles.details}>Nenhuma plataforma de streaming disponível.</ThemedText>
                        )}
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.dark.background,
                        justifyContent: "space-around",
                        alignItems: "center",
                        paddingVertical: 10,
                    }}
                >
                    <View
                        style={{
                            minHeight: 200,
                            maxHeight: '100%',
                            backgroundColor: Colors.dark.background,
                            width: "100%",
                        }}
                    >
                        <ThemedText type="subtitle" style={{textAlign:"center"}}>SINOPSE</ThemedText>
                        <ThemedText style={{ fontSize: 16, textAlign:"justify", marginTop: 5 }}>
                            {overview}
                        </ThemedText>
                    </View>
                    <ThemedText type="subtitle" style={{ paddingVertical: 20 }}>
                        ELENCO
                    </ThemedText>
                    <View
                        style={{
                            flex: 3 / 5,
                            flexDirection: "column",
                            marginLeft: 5,
                            marginBottom: 10,
                            alignSelf:"flex-end"
                        }}
                    >
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                columnGap: 5,
                          }}
                        >
                            {castNames.map((item, index) => (
                                <View key={index} style={styles.elenco}>
                                    <ImageBackground
                                        imageStyle={{ borderTopRightRadius: 8, borderTopLeftRadius: 8}}
                                        style={{
                                            width: 70,
                                            height: 90,
                                        }}
                                        source={castPicturesUrl[index]}
                                    ></ImageBackground>
                                    <ThemedText
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        type="default"
                                        style={styles.castNames}
                                    >
                                        {item}
                                    </ThemedText>
                                    <ThemedText
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        type="default"
                                        style={[styles.castNames, styles.castNamesCaracters]}
                                    >
                                        {castCharacters[index]}
                                    </ThemedText>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    Image: {
        width: "100%",
        height: "100%",
        resizeMode: "center",
    },
    title: {
        fontSize: 24,
        color: "white",
        position: "absolute",
        bottom: 0,
        marginBottom: "5%",
        padding: 14,
        backgroundColor: Colors.dark.background,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        shadowOpacity: 4,
        elevation: 5,
    },
    details: {
        fontSize: 12,
        color: "white",
        shadowOpacity: 4,
        opacity: 0.6,
    },
    streamings: {
        height: 22,
        width: 22,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderBlockColor: "black",
        borderRadius: 5,
    },
    streamingImages: {
        width: 16,
        height: 16,
        borderRadius: 3,
    },
    elenco: {
        alignItems: "center",
        // marginRight: 35,
        columnGap: 30,
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
    },
    castNames: {
        fontSize: 10,
        color: Colors.dark.text,
        backgroundColor: Colors.dark.light,
        paddingHorizontal: 5,
        width: 70,
    },
    castNamesCaracters: {
        bottom: 0,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: Colors.dark.tabIconSelected,
    },
    backButton: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 60,
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,

    },
    likeButton: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 0,
        top: 60,
        width: 55,
        height: 55,
        backgroundColor: Colors.dark.background,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        opacity: .8
    },
    watchedButton: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 0,
        top: 120,
        width: 55,
        height: 55,
        backgroundColor: Colors.dark.background,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        opacity: .8
    },
});

export default MovieDetailsScreen;
