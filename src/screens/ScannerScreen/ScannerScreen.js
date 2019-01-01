/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Camera from 'react-native-camera';
import memoizeOne from 'memoize-one';

export default class ScannerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
        barcode: ''
    }
  }

  // takePicture = async function() {
  //   if (this.camera) {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await this.camera.takePictureAsync(options)
  //     console.log('************',data.uri);
  //   }
  // };

  onBarCodeRead = memoizeOne((barcodeObj) => {
    console.log("Barcode: " + JSON.stringify(barcodeObj, null, 2));
    this.memoizedSearch(barcodeObj.data)
  });

  searchForProduct = async function(code) {
    try {
      let response = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.props.navigation.navigate('AddScreen')
    } catch (error) {
      console.error(error);
    }
  };

  memoizedSearch = memoizeOne(this.searchForProduct) // THIS NEEDS TO BE MEMOIZED TO PREVENT EXCESSIVE REQS

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          barCodeTypes={[
          	Camera.constants.BarCodeType.upce,
          	Camera.constants.BarCodeType.ean8,
          	Camera.constants.BarCodeType.ean13,
          ]}>
          {/* <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[Take picture]</Text> */}
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});