import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import { connect, disconnect, listenToNewDevs } from '../services/socket';

function Main( { navigation } ) {

    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect( () => {
        (async () => {
            const { granted } = await requestPermissionsAsync();
            if (granted) {
                const { coords } = await getCurrentPositionAsync({ accuracy: 5 });
                const { latitude, longitude } = coords;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                });
            }
        })();
    }, [] );

    useEffect( () => {
        if (devs.length !== 0) {
            setupWebsocket();
            listenToNewDevs( newDev => setDevs([...devs, newDev]) );
        }
    }, [devs] );

    function setupWebsocket() {
        disconnect();
        const { latitude, longitude } = currentRegion;
        const query = { latitude, longitude, techs };
        connect(query);
    }

    async function searchDevs() {

        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data);

    }

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    function handleGoToProfile(githubUsername) {
        navigation.navigate('Profile', {
            github: githubUsername
        })
    }

    if (!currentRegion) return null;
    return (
        <>

            <MapView style={styles.map} onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion}>
                {devs.map( dev => (
                    <Marker key={dev._id} coordinate={{
                        latitude: dev.location.coordinates[1],
                        longitude: dev.location.coordinates[0]
                    }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout style={styles.callout} onPress={ () => handleGoToProfile(dev.github) }>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{dev.name}</Text>
                            <Text style={{ color: '#555', marginTop: 4 }}>{dev.bio}</Text>
                            <Text style={{ marginTop: 4 }}>{dev.techs.join(', ')}</Text>
                        </Callout>
                    </Marker>
                ) )}
            </MapView>

            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar devs por techs...'
                    placeholderTextColor='#888'
                    autoCapitalize='words'
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity style={styles.searchButton} onPress={searchDevs}>
                    <MaterialIcons name="my-location" size={20} color='#fff' />
                </TouchableOpacity>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },

    callout: {
        width: 260,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 24,
        paddingHorizontal: 24,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        elevation: 4,
        shadowOffset: {
            width: 4,
            height: 4
        }
    },

    searchButton: {
        width: 48,
        height: 48,
        backgroundColor: '#7D40E7',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16
    }
})

export default Main;