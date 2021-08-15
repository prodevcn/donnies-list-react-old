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
  Modal,
  ScrollView,
  Box,
  Text,
  Divider,
} from 'native-base';

import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import Screen from '../../../layouts/Screen';
import Plus from '../../../../assets/images/svg/plus.svg';
import Minus from '../../../../assets/images/svg/minus.svg';
import {saveNewSession} from '../../../redux/actions/sessionAction';

const NewSession = props => {
  const [showModal, setShowModal] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState({
    location: '',
    location2: '',
    location3: '',
    location4: '',
  });
  const {currentSessionId, savedSessions} = useSelector(state => state.session);
  const dispatch = useDispatch();
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
    setLocation({location: '', location2: '', location3: '', location4: ''});
  };

  const save = () => {
    if (code !== 0 && name !== 0) {
      const newSession = {
        Part_Cod: code,
        Part_Nam: name,
        quantity: quantity,
        location: location.location,
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
    // AsyncStorage.getItem('saved_sessions').then(data => {
    //   stored_data = JSON.parse(data).data
    // });
  }, []);

  return (
    <Screen
      hasBackButton
      title={'NEW SESSION : ' + currentSessionId}
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
        <VStack flex={1} mt="5" space={2}>
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
          <Button
            variant="ghost"
            onPress={() => {
              setShowModal(true);
            }}>
            Show the items in this session
          </Button>
          <VStack space={2} w="100%" />
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

export default NewSession;
