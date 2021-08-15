/* eslint-disable react/jsx-no-undef */
<VStack flex={1} mt="10" space={2}>
  <VStack space={2} w="100%">
    <FormControl isRequired isInvalid={code === "" ? true : false} w="100%">
      <FormControl.Label>Part Code</FormControl.Label>
      <Input
        placeholder="Please input code"
        onChangeText={(text) => {
          setCode(text);
        }}
        value={code}
        autoCapitalize="none"
        type="text"
      />
    </FormControl>
    <FormControl isRequired isInvalid={name === "" ? true : false} w="100%">
      <FormControl.Label>Part Name</FormControl.Label>
      <Input
        placeholder="Please input name"
        onChangeText={(text) => {
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
        onChangeText={(text) => {
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
            }}
          >
            <Minus width={24} height={24} color="#06b6d4" />
          </Button>
        }
        InputRightElement={
          <Button
            variant="ghost"
            onPress={() => {
              plusQuantity();
            }}
          >
            <Plus width={24} height={24} color="#06b6d4" />
          </Button>
        }
      />
    </FormControl>
    <FormControl w="100%">
      <FormControl.Label>Location 1</FormControl.Label>
      <Input
        placeholder="Please input location1"
        onChangeText={(text) => {
          setLocation((state) => ({ ...state, location1: text }));
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
        onChangeText={(text) => {
          setLocation((state) => ({ ...state, location2: text }));
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
        onChangeText={(text) => {
          setLocation((state) => ({ ...state, location3: text }));
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
        onChangeText={(text) => {
          setLocation((state) => ({ ...state, location4: text }));
        }}
        value={location.location4}
        autoCapitalize="none"
        type="text"
      />
    </FormControl>
    {code !== "" && name !== "" && (
      <HStack space={2} w="100%" justifyContent="space-between">
        <Button
          variant="outline"
          w="40%"
          onPress={() => {
            clearAll();
          }}
        >
          Cancel
        </Button>
        <Button
          w="40%"
          onPress={() => {
            save();
          }}
        >
          Save
        </Button>
      </HStack>
    )}
  </VStack>
  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    <Modal.Content maxWidth="400px">
      <Modal.CloseButton />
      <Modal.Header>Saved Sessions</Modal.Header>
      <Modal.Body>
        <ScrollView>
          {savedSessions.map((item, index) => {
            if (item.Part_Cod === code || item.Part_Nam === name) {
              return (
                <Box my={1} key={`BOX_${index}`}>
                  {Object.keys(item).map((key, index1) => (
                    <HStack
                      alignItems="center"
                      rounded="md"
                      key={`ITEM_${index}_${index1}`}
                      w="100%"
                      bg={index1 % 2 === 0 && "primary.600"}
                      p={3}
                    >
                      <Text
                        color={index1 % 2 === 0 ? "white" : "primary.600"}
                        w="50%"
                      >
                        {key}
                      </Text>
                      <Text
                        w="50%"
                        color={index1 % 2 === 0 ? "white" : "primary.600"}
                      >
                        {item[key]}
                      </Text>
                    </HStack>
                  ))}
                  <Divider my={3} />
                </Box>
              );
            }
          })}
        </ScrollView>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="ghost"
          onPress={() => {
            setShowModal(false);
          }}
        >
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
</VStack>;
