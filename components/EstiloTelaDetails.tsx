import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
import { ThemedText } from "./ThemedText";

const API_KEY = "2017240ed8d4e61fbe9ed801fe5da25a";
const BASE_URL = "https://api.themoviedb.org/3";

type RootStackParamList = {
    Home: undefined;
    MovieDetails: { movieId: number };
};

type MovieDetailsScreenRouteProp = RouteProp<
    RootStackParamList,
    "MovieDetails"
>;
type MovieDetailsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MovieDetails"
>;

type Props = {
    route: MovieDetailsScreenRouteProp;
    navigation: MovieDetailsScreenNavigationProp;
};

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

interface WatchProvider{
    results: {
        BR : {
            flatrate: FlatRate[];
        }
    }
}

interface FlatRate{
    logo_path: string | null;
    provider_id: number;
    provider_name: string;
}

export const DetailsComponent: React.FC = () => {
    const movieId = "155"; //581734, 414906, 157336, 389, 240, 278, 155
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(true);
    const [movieWatchProviders, setWatchProvider] = useState<WatchProvider | null>(null);
    const [isLoadingProviders, setIsLoadingProviders] = useState<boolean>(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const responseMovieDetails = await fetch(
                    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits&language=pt-BR`
                );
                const dataMovieDetails: MovieDetails = await responseMovieDetails.json();
                setMovieDetails(dataMovieDetails);
                const responseWatchProviders = await fetch(
                    `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
                );
                const dataWatchProviders: WatchProvider = await responseWatchProviders.json();
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
        return <Text>Erro ao carregar plataformas onde o filme esta disponivel.</Text>;
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

    const {
        results
    } = movieWatchProviders;

    const genresText = genres.map((genre) => genre.name).slice(0,3).join(" • ");

    const castNames = credits.cast
        .slice(0,10)
        .map((member) => member.name)

    const castCharacters = credits.cast
        .slice(0,10)
        .map((member) => member.character)
    
    const castPictures = credits.cast
        .slice(0,10)
        .map((member) => member.profile_path)

    const streamingPlatforms = results.BR.flatrate
        .slice(0, 3)
        .map((member) => member.provider_name)
        
    const streamingPlatformsPosters = results.BR.flatrate
        .slice()
        .map((member) => member.logo_path)

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

    const platforms: any = {
        'Max': require('@/assets/images/max.png'),
        'Max Amazon Channel': require('@/assets/images/max.png'),
        'Netflix': require('@/assets/images/netflix.png'),
        'Amazon Prime Video': require('@/assets/images/prime.png'),
        'Claro tv+': require('@/assets/images/claro-tv.png'),
        'Globoplay': require('@/assets/images/globoplay.png'),
        'Disney Plus': require('@/assets/images/disneyplus.png'),
    };

    // console.log(streamingPlatforms);

    return (
        <>
            <View
                style={{
                    flex: 4 / 5,
                    backgroundColor: "blue",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                }}
            >
                <ImageBackground
                    style={styles.Image}
                    source={posterUrl}
                ></ImageBackground>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    {title}
                </ThemedText>
                <FontAwesome
                    style={{
                        position: "absolute",
                        left: 20,
                        top: 50,
                        padding: 20,
                        borderRadius: 10000,
                        backgroundColor: "#D46162",
                        opacity: 0.8,
                    }}
                    size={25}
                    name="chevron-left"
                    color="white"
                />
                <FontAwesome
                    style={{
                        position: "absolute",
                        right: 20,
                        top: 50,
                        padding: 20,
                        borderRadius: 10000,
                        backgroundColor: "black",
                        opacity: 0.7,
                    }}
                    size={25}
                    name="heart"
                    color="#D46162"
                />
                <FontAwesome
                    style={{
                        position: "absolute",
                        right: 20,
                        top: 120,
                        padding: 20,
                        borderRadius: 10000,
                        backgroundColor: "black",
                        opacity: 0.7,
                    }}
                    size={25}
                    name="eye"
                    color="#D46162"
                />
            </View>
            <View
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
                            top: 7,
                            fontSize: 26,
                        }}
                    >
                        {vote_average_divided}{" "}
                        <FontAwesome size={22} name="star" color="#D46162" />
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
                        {streamingPlatforms.map((name, index)=>(
                            <View key={index} style={styles.streamings}>
                                {platforms[name] ? (
                                    <Image
                                    style={styles.streamingImages}
                                    source={platforms[name]}
                                    ></Image>
                                ):(
                                    <Image
                                    style={styles.streamingImages}
                                    source={streamingPlatformsPostersUrl[index]}
                                    ></Image>
                                )}
                            
                        </View>
                        ))}
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
                    <ScrollView style={{maxHeight: 160, backgroundColor: Colors.dark.background, width:'100%'}}>
                        <ThemedText style={{ fontSize: 19}}>{overview}</ThemedText>
                    </ScrollView>
                    <ThemedText type="subtitle" style={{paddingVertical: 20}}>
                        ELENCO
                    </ThemedText>
                    <View style={{ flex: 3 / 5, flexDirection: "row", marginHorizontal: 5}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {castNames.map((item, index)=>(
                                <View key={index} style={styles.elenco}>
                                <ImageBackground
                                    imageStyle={{ borderRadius: 8}}
                                    style={{ width: 90, height: '100%', borderRadius: 8}}
                                    source={castPicturesUrl[index]}
                                ></ImageBackground>
                                <ThemedText numberOfLines={1} ellipsizeMode="tail" type="default" style={styles.castNames}>
                                    {item}
                                </ThemedText>
                                <ThemedText numberOfLines={1} ellipsizeMode="tail" type="default" style={styles.castNamesCaracters}>
                                    {castCharacters[index]}
                                </ThemedText>
                            </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
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
        marginTop: 270,
        padding: 15,
        backgroundColor: Colors.dark.background,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        shadowOpacity: 4,
    },
    details: {
        fontSize: 12,
        color: "white",
        shadowOpacity: 4,
        opacity: 0.6,
    },
    streamings: {
        height: 22,
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderBlockColor: "black",
        borderRadius: 5,
    },
    streamingImages: {
        width: 32,
        height: '40%',
    },
    elenco: {
        alignItems: 'center',
        marginRight: 10, // Adds space between each item
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        minHeight: 110,
        maxHeight: 150
    },
    castNames:{
        fontSize: 12,
        position:'absolute',
        color: Colors.dark.text,
        backgroundColor: Colors.dark.light,
        maxWidth: 90,
        minWidth: 90,
        paddingHorizontal:5,
        bottom: 19,
    },
    castNamesCaracters:{
        fontSize: 12,
        position:'absolute',
        color: Colors.dark.text,
        backgroundColor: Colors.dark.tabIconSelected,
        maxWidth: 90,
        minWidth: 90,
        paddingHorizontal:5,
        bottom: 0,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8
    }
});
