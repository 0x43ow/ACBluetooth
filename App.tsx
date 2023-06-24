import RNBluetoothClassic, { BluetoothDevice, BluetoothEventType } from 'react-native-bluetooth-classic';
import React from 'react';
import { useEffect } from 'react';
import { Alert,Button,StyleSheet,useColorScheme,View,PermissionsAndroid} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  useEffect(() => {
    (async () => {
      await checkAndRequestPermissions();
    })();
  }, []);

  async function checkAndRequestPermissions() {
    const permissionsToCheck = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
  
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        permissionsToCheck
      );
  
      let allPermissionsGranted = true;
      for (const permission of permissionsToCheck) {
        if (granted[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
          allPermissionsGranted = false;
          break;
        }
      }
  
      if (allPermissionsGranted) {
        console.log('All permissions granted.');
      } else {
        console.log('Some permissions were not granted.');
      }
    } catch (err) {
      displayAlert('error', err as string);
    }
  }


  const displayAlert = (title : string, message: string) => {
    Alert.alert(title, message, [
      {text: 'OK', onPress: () => {}},
    ]);
  }

  const parseElement = (element : BluetoothDevice) => {
    return `Name:${element.name} Address:${element.address} ID:${element.id}\n\n`;
  }

  const parseResult = (title: string, result : BluetoothDevice[]) => {
    var text = `devices: ${result.length}\n`;
    result.forEach(element => {
      text += parseElement(element);
    });
    displayAlert(title, text);
  }


  const listPairedDevices = () => {
    RNBluetoothClassic.getBondedDevices().then((result) => {
      parseResult('Paired devices', result);
    }).catch((error) => {
      displayAlert('Error', error.message);
    })
  }


  const listConnectedDevices = () => {
    RNBluetoothClassic.getConnectedDevices().then((result) => {
      parseResult('Connected devices', result);
    }).catch((error) => {
      displayAlert('Error', error.message);
    })
  }


  const beginDeviceDiscovery = () => {
    RNBluetoothClassic.startDiscovery().then((result) => {
      parseResult('Discovered devices', result);
    }).catch((error) => {
      displayAlert('Error', error.message);
    })
  }

  const connectToBtDevice = (address : string) => {
    RNBluetoothClassic.connectToDevice(address).then((result) => {

    }).catch((error) => {displayAlert("Error", error.message);});
  }

  const writeToBtDevice = (address : string, message : string) => {
    RNBluetoothClassic.writeToDevice(address, message).then((result) => {

    }).catch((error) => {displayAlert("error", error.message);});
  }

  const readFromBtDevice = (address : string) => {
    RNBluetoothClassic.readFromDevice(address).then((result) => {
      
    }).catch((error) => {displayAlert("Error", error.message)});
  }



  return (
      <View style={styles.container}>
        <Button title='List paired devices' onPress={listPairedDevices}></Button>
        <Button title='List connected devices' onPress={listConnectedDevices}></Button>
        <Button title='Begin device discovery' onPress={beginDeviceDiscovery}></Button>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    allignItems : 'center'
  },
});

export default App;
