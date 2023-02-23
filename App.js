import { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import { Button, ImageViewer, CircleButton, IconButton, EmojiPicker, EmojiList, EmojiSticker } from './components/index';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  // Estado para controlar si el modal está visible o no
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Estado para controlar si se muestran las opciones de la aplicación o no
  const [showAppOptions, setShowAppOptions] = useState(false);
  // Estado para guardar el emoji seleccionado
  const [pickedEmoji, setPickedEmoji] = useState(null);
  // Estado para guardar la imagen seleccionada
  const [selectedImage, setSelectedImage] = useState(null);
  // Referencia a la imagen
  const imageRef = useRef();
  // Permisos de la biblioteca de medios
  const [status, requestPermission] = MediaLibrary.usePermissions();

  // Si el estado es nulo, solicitamos permisos
  if (status === null) {
    requestPermission();
  }
  // Función para seleccionar una imagen de la biblioteca de medios
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    // Si se seleccionó una imagen, la guardamos y mostramos las opciones de la aplicación
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);

    } else {
      // Si no se seleccionó una imagen, mostramos una alerta
      alert('You did not select any image.');
    }
  };
  // Función para restablecer los estados
  const onReset = () => {
    setShowAppOptions(false);
  };
  // Función para mostrar el modal
  const onAddSticker = () => {
    setIsModalVisible(true);
  };
  // Función para cerrar el modal
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  // Función para guardar la imagen
  const onSaveImageAsync = async () => {
    // Si se ejecuta en un dispositivo móvil
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      // Si se ejecuta en un navegador
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then(dataUrl => {
          let link = document.createElement('a');
          link.download = 'sticker-smash.jpeg';
          link.href = dataUrl;
          link.click();
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
    </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>

      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});