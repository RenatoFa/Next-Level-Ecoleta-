import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, SafeAreaView, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location'; // exporta todas as funçoes com * 
import api from '../../services/api';


interface Item {
    id: number,
    title: string,
    image_url: string,
}

const Points = () => {

    //Items(Estado)
    const [items, setItems] = useState<Item[]>([]);
    //items selecionados(Estado)
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    //Salvar a posição do Usuario (Estado)  
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]) // começar o vetor com 0
    const navigation = useNavigation()


    // Pedir permição do usuario para pegar sua localização 
    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync(); // saber se ele deu permição 

            if (status !== 'granted') {
                Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização')
                return;
            }

            // Vai me retornar a posição do usuario
            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude])


        }

        loadPosition();
    }, []);


    //Use effect para os Items no Points
    useEffect(() => {

        api.get('items').then(response => {

            setItems(response.data);

        });

    }, []);

    function handleNavigationBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail() {
        navigation.navigate('Detail')
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <TouchableOpacity onPress={handleNavigationBack}>
                    <Icon name="arrow-left" size={32} color="#34cb79" style={{
                        right: 8,
                        top: 16,
                    }} />
                </TouchableOpacity>

                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>




                </View>


            </View>
            <View style={styles.itemsContainer}>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                >

                    {items.map(item => ( // Toda vez que faz um map , precisamos criar uma props chammada key
                        <TouchableOpacity
                            key={String(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}   // passando um vetor com varios styles 
                            ]}
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.6}>
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle} >{item.title} </Text>


                        </TouchableOpacity>
                    ))}







                </ScrollView>

            </View>

        </SafeAreaView>)


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;