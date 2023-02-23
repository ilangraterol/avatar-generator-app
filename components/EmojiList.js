import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Image, Platform, Pressable, Text } from 'react-native';
import useStickerApiRequest from '../hooks/useStickerApiRequest';




export default function EmojiList({ onSelect, onCloseModal, apiKey='Mez8HUk91MVfdP9Uh7INaTOsdJqDH52Q' }) {
    const { data, error } = useStickerApiRequest(apiKey);

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    if (!data) {
        console.log(data);
        return <Text>Loading......</Text>;
    }

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web' ? true : false}
            data={data.data}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => {
                return (
                    <Pressable
                        onPress={() => {
                            onSelect(item.images.original.url);
                            onCloseModal();
                        }}>
                        <Image source={{ uri: item.images.fixed_width.url }} key={index} style={styles.image} />
                    </Pressable>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 20,
    },
});