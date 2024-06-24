import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const API_KEY = '2017240ed8d4e61fbe9ed801fe5da25a';
const BASE_URL = 'https://api.themoviedb.org/3';

type RootStackParamList = {
    Home: undefined;
    MovieDetails: { movieId: number };
};

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

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

const MovieDetailsScreen: React.FC<Props> = ({ route }) => {
    const { movieId } = route.params;
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
                const data: MovieDetails = await response.json();
                setMovieDetails(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!movieDetails) {
        return <Text>Erro ao carregar detalhes do filme.</Text>;
    }

    const { title, overview, vote_average, release_date, runtime, genres, credits, poster_path } = movieDetails;
    const genresText = genres.map((genre) => genre.name).join(', ');
    const cast = credits.cast.slice(0, 10).map((member) => member.name).join(', ');

    const posterUrl = poster_path
        ? { uri: `https://image.tmdb.org/t/p/w500${poster_path}` }
        : require('@/assets/images/No-Image-Placeholder.png');

    return (
        <ScrollView style={styles.container}>
            <Image source={posterUrl} style={styles.posterImage} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>Sinopse: {overview}</Text>
            <Text style={styles.text}>Nota: {vote_average}</Text>
            <Text style={styles.text}>Ano: {release_date.split('-')[0]}</Text>
            <Text style={styles.text}>Duração: {runtime} minutos</Text>
            <Text style={styles.text}>Gêneros: {genresText}</Text>
            <Text style={styles.text}>Elenco: {cast}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    posterImage: {
        width: '100%',
        height: 500,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default MovieDetailsScreen;
