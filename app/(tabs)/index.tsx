/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { StyleSheet, View, Image } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';

export default function ProfileScreen() {
    let idCounter = React.useRef(0);
    interface DataProp {
        id: number;
        widthRatio?: number;
        heightRatio?: number;
        imageUrl: string;
    }

    const getData = () => {
        const originalData = [
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/9e3Dz7aCANy5aRUQF745IlNloJ1.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/589uhtJOujc72fgNl6HcMYJS64D.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/9e3Dz7aCANy5aRUQF745IlNloJ1.jpg',
                heightRatio: 3/2
            },
            {
                imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/589uhtJOujc72fgNl6HcMYJS64D.jpg',
                heightRatio: 3/2
            },
        ];

        let clonedData: DataProp[] = [];

        for (let i = 0; i < 5; i++) {
            const newData = originalData.map((item) => ({
                ...item,
                id: ++idCounter.current,
            }));
            clonedData = [...clonedData, ...newData];
        }

        return clonedData;
    };

    const renderItem = ({ item }: { item: DataProp }) => {
        return (
            <View style={styles.boxContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.box}
                    resizeMode="center"
                />
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <ResponsiveGrid
                maxItemsPerColumn={2}
                data={getData()}
                renderItem={renderItem}
                showScrollIndicator={false}
                keyExtractor={(item: DataProp) => item.id.toString()}
            />

            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                }}
            >

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    boxContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    box: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent'
    },
    text: {
        color: 'white',
        fontSize: 10,
        position: 'absolute',
        bottom: 10,
    },
});