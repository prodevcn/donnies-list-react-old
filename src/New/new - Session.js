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
  Heading,
  Pressable,
  Modal,
  ScrollView,
  Box,
  Text,
} from 'native-base';

import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import Screen from '../../../layouts/Screen';
import Plus from '../../../../assets/images/svg/plus.svg';
import Minus from '../../../../assets/images/svg/minus.svg';
import SearchIcon from '../../../../assets/images/svg/search.svg';
import Next from '../../../../assets/images/svg/next.svg';
import Prev from '../../../../assets/images/svg/prev.svg';

import {inventoryGeneralFetching} from '../../../redux/actions/queryAction';
import {saveNewItem} from '../../../redux/actions/sessionAction';
import {GENERAL_FETCHING} from '../../../constants/actions';

const EditSession = props => {
  const [showModal, setShowModal] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [page, setPage] = useState(1);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState({
    location: '',
    location2: '',
    location3: '',
    location4: '',
  });
  const {currentSessionId, savedItems} = useSelector(state => state.session);
  const {queryData, fetching} = useSelector(state => state.query);
  const dispatch = useDispatch();
  const toast = useToast();

  const onSubmit = () => {
    if (code === '') {
      toast.show({title: 'Please input code'});
    } else {
      dispatch(
        inventoryGeneralFetching({
          code: code,
          show_cost: false,
          page: 1,
        }),
      );
    }
  };

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

  const selectItem = item => {
    setCode(item.Part_Cod);
    setName(item.Part_Nam);
    dispatch(dispatchController =>
      dispatchController({
        type: GENERAL_FETCHING.SUCCESS,
        payload: [],
      }),
    );
  };

  const addItemToSession = () => {
    if (code !== 0 && name !== 0) {
      const newItem = {
        Part_Cod: code,
        Part_Nam: name,
        quantity: quantity,
        location: location.location,
        location2: location.location2,
        location3: location.location3,
        location4: location.location4,
      };
      let storedItems = savedItems;
      storedItems.push(newItem);
      dispatch(saveNewItem(storedItems)).then(res => {
        if (res?.message === 'success') {
          toast.show({title: 'Successfully saved !'});
        }
      });
      clearAll();
    } else {
      toast.show({title: 'Please fill all the required'});
    }
  };

  const fetchingNextPage = type => {
    dispatch(
      inventoryGeneralFetching({
        code: code,
        show_cost: false,
        page: type === 'prev' ? page - 1 : page + 1,
      }),
    );
    if (type === 'prev') {
      setPage(prev => prev - 1);
    } else {
      setPage(prev => prev + 1);
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
    console.log(fetching);
  }, [fetching]);

  return (
    <Screen
      hasBackButton
      isLoading={fetching}
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
              w="80%">
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
            <Button
              variant="ghost"
              onPress={() => {
                onSubmit();
              }}
              p={0}>
              <SearchIcon width={24} height={24} color="#06b6d4" />
            </Button>
          </HStack>
          <Button
            variant="ghost"
            onPress={() => {
              setShowModal(true);
            }}>
            Show the items in this session
          </Button>
          <VStack space={2} w="100%">
            {queryData.length === 10 && (
              <HStack w="40%" justifyContent="space-around">
                {page > 1 && (
                  <Button
                    p={0}
                    variant="ghost"
                    onPress={() => {
                      fetchingNextPage('prev');
                    }}>
                    <Prev width={20} height={20} color="#000" />
                  </Button>
                )}
                <Heading size="sm">Page : {page}</Heading>
                <Button
                  p={0}
                  variant="ghost"
                  onPress={() => {
                    fetchingNextPage('next');
                  }}>
                  <Next width={20} height={20} color="#000" />
                </Button>
              </HStack>
            )}
            {queryData.length >= 1 &&
              queryData.map((item, index) => (
                <Pressable
                  w="100%"
                  key={`PRESS_${index}`}
                  onPress={() => {
                    selectItem(item);
                  }}>
                  <HStack
                    alignItems="center"
                    rounded="md"
                    key={`GENERAL_DATA_${index}`}
                    w="100%"
                    bg={index % 2 === 0 && 'primary.600'}
                    p={3}>
                    <Text
                      color={index % 2 === 0 ? 'white' : 'primary.600'}
                      w="50%">
                      {item.Part_Cod}
                    </Text>
                    <Text
                      w="50%"
                      color={index % 2 === 0 ? 'white' : 'primary.600'}>
                      {item.Part_Nam}
                    </Text>
                  </HStack>
                </Pressable>
              ))}
            {queryData.length < 1 && (
              <Box width="100%">
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
                  <HStack
                    space={2}
                    w="100%"
                    mt={3}
                    justifyContent="space-between">
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
                        // save();
                        addItemToSession();
                      }}>
                      Save
                    </Button>
                  </HStack>
                )}
              </Box>
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
