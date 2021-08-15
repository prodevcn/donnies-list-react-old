/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import {
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {
  View,
  useToast,
  HStack,
  Button,
  FormControl,
  VStack,
  Input,
  Fab,
  ArrowBackIcon,
  Box,
  Text,
  Heading,
  Pressable,
} from 'native-base';

import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import Screen from '../../../layouts/Screen';
import Plus from '../../../../assets/images/svg/plus.svg';
import Minus from '../../../../assets/images/svg/minus.svg';
import {saveNewSession} from '../../../redux/actions/sessionAction';
const EditSession = props => {
  const {savedSessions} = useSelector(state => state.session);
  const dispatch = useDispatch();
  const [onCamera, setOnCamera] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState({
    location1: '',
    location2: '',
    location3: '',
    location4: '',
  });

  const toast = useToast();

  const plusQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  const minusQuantity = () => {
    if (quantity === 0) {
      return;
    } else if (quantity - 1 < 0) {
      setQuantity(0);
    } else {
      setQuantity(prev => prev - 1);
    }
  };
  const clearAll = () => {
    setCode('');
    setName('');
    setQuantity(0);
    setLocation({location1: '', location2: '', location3: '', location4: ''});
  };

  const save = () => {
    if (code !== 0 && name !== 0) {
      const newSession = {
        Part_Cod: code,
        Part_Nam: name,
        Quantity: quantity,
        location1: location.location1,
        location2: location.location2,
        location3: location.location3,
        location4: location.location4,
      };
      let storedData = savedSessions;
      storedData.push(newSession);
      dispatch(saveNewSession(storedData)).then(res => {
        if (res?.message === 'success') {
          toast.show({title: 'Successfully saved !'});
        }
      });
      clearAll();
    } else {
      toast.show({title: 'Please fill all the required'});
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs permission for camera access',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setOnCamera(true);
      } else {
        toast.show({title: 'CAMERA permission denied'});
      }
    } catch (err) {
      toast.show({title: 'Camera permission error'});
    }
  };

  const openCamera = () => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    } else {
      setOnCamera(true);
    }
  };

  const onBarcodeScan = scanResult => {
    setCode(scanResult);
    setOnCamera(false);
  };

  useEffect(() => {
    if (savedSessions.length === 0) {
    } else {
      const lastSession = savedSessions.pop();
      console.log(lastSession);
      setCode(lastSession.Part_Cod);
      setName(lastSession.Part_Nam);
      setLocation({
        location1: lastSession.location1,
        location2: lastSession.location2,
        location3: lastSession.location3,
        location4: lastSession.location4,
      });
      setQuantity(lastSession.quantity);
    }
  }, []);

  return (
    <Screen
      hasBackButton
      title="NEW SESSION"
      hasScroll={onCamera ? false : true}
      hasHeader={onCamera ? false : true}>
      {onCamera ? (
        <View style={styles.cameraScreen}>
          <CameraKitCameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#06b6d4'}
            frameColor={'#06b6d4'}
            colorForScannerFrame={'black'}
            onReadCode={e => {
              onBarcodeScan(e.nativeEvent.codeStringValue);
            }}
          />
          <Fab
            placement="top-left"
            onPress={() => {
              setOnCamera(false);
            }}
            icon={<ArrowBackIcon size={6} color="white" />}
            size={10}
          />
        </View>
      ) : (
        <VStack flex={1} mt="10" space={2}>
          <HStack space={2} w="100%">
            <Button variant="ghost" p={0}>
              <ScanIcon
                width={24}
                height={24}
                color="#06b6d4"
                onPress={() => {
                  openCamera();
                }}
              />
            </Button>
            <FormControl
              isRequired
              isInvalid={code === '' ? true : false}
              w="90%">
              <Input
                placeholder="Please input code"
                onChangeText={text => {
                  setCode(text);
                }}
                value={code}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
          </HStack>
          <VStack space={2} w="100%">
            <FormControl
              isRequired
              isInvalid={code === '' ? true : false}
              w="100%">
              <FormControl.Label>Part Code</FormControl.Label>
              <Input
                placeholder="Please input code"
                onChangeText={text => {
                  setCode(text);
                }}
                value={code}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={name === '' ? true : false}
              w="100%">
              <FormControl.Label>Part Name</FormControl.Label>
              <Input
                placeholder="Please input name"
                onChangeText={text => {
                  setName(text);
                }}
                value={name}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <FormControl w="100%">
              <FormControl.Label>Quantity</FormControl.Label>
              <Input
                placeholder="Please input quantity"
                keyboardType="number-pad"
                justifyContent="center"
                textAlign="center"
                onChangeText={text => {
                  setQuantity(Number(text));
                }}
                value={quantity.toString()}
                autoCapitalize="none"
                type="number"
                InputLeftElement={
                  <Button
                    variant="ghost"
                    onPress={() => {
                      minusQuantity();
                    }}>
                    <Minus width={24} height={24} color="#06b6d4" />
                  </Button>
                }
                InputRightElement={
                  <Button
                    variant="ghost"
                    onPress={() => {
                      plusQuantity();
                    }}>
                    <Plus width={24} height={24} color="#06b6d4" />
                  </Button>
                }
              />
            </FormControl>
            <FormControl w="100%">
              <FormControl.Label>Location 1</FormControl.Label>
              <Input
                placeholder="Please input location1"
                onChangeText={text => {
                  setLocation(state => ({...state, location1: text}));
                }}
                value={location.location1}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <FormControl w="100%">
              <FormControl.Label>Location 2</FormControl.Label>
              <Input
                placeholder="Please input location2"
                onChangeText={text => {
                  setLocation(state => ({...state, location2: text}));
                }}
                value={location.location2}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <FormControl w="100%">
              <FormControl.Label>Location 3</FormControl.Label>
              <Input
                placeholder="Please input location3"
                onChangeText={text => {
                  setLocation(state => ({...state, location3: text}));
                }}
                value={location.location3}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <FormControl w="100%">
              <FormControl.Label>Location 4</FormControl.Label>
              <Input
                placeholder="Please input location 4"
                onChangeText={text => {
                  setLocation(state => ({...state, location4: text}));
                }}
                value={location.location4}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            {code !== '' && name !== '' && (
              <HStack space={2} w="100%" justifyContent="space-between">
                <Button
                  variant="outline"
                  w="40%"
                  onPress={() => {
                    clearAll();
                  }}>
                  Cancel
                </Button>
                <Button
                  w="40%"
                  onPress={() => {
                    save();
                  }}>
                  Save
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      )}
    </Screen>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cameraScreen: {
    flex: 1,
    left: -width * 0.05,
    height: height,
  },
});

export default EditSession;
