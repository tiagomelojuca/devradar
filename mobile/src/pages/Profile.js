import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile( { route, navigation } ) {

    const { github } = route.params;

    return (
        <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${github}` }}/>
    );

}

export default Profile;