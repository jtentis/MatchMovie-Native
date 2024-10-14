import React from 'react';
import { StyleSheet } from 'react-native';
import { DetailsComponent } from '../../components/EstiloTelaDetails';

const MovieDetailsScreen= () => {
    return (
        <DetailsComponent />
    )
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
