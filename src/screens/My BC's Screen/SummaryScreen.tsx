import React, { useState } from 'react';
import { StyleSheet, StatusBar, ScrollView, Modal } from 'react-native';
import { View, Text, Radio, Button } from 'native-base';
import { horizontalScale, verticalScale } from '../../utilities/Dimensions';
import { Fonts } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { newColorTheme } from '../../constants/Colors';
import Heading from '../../components/Heading';
import { apimiddleWare } from '../../utilities/HelperFunctions';
import JazzCash from '../../assets/svg/JazzCash';
import Payment from '../../assets/svg/payment';
import Err from '../../assets/svg/Err';

const SummaryScreen = () => {
  const paymentMethod = [
    {
      name: 'Credit/Debit Card',
      value: 'credit-debit-card',
      ImageComponent: JazzCash,
    },
    {
      name: 'Voucher Payment',
      value: 'voucher-payment',
      ImageComponent: JazzCash,
    },
  ];

  const [value, setValue] = useState<any>(null);
  const [activeModalItem, setActiveModalItem] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const route: any = useRoute();
  const { item, member, bcData }: any = route.params;
  const navigation: any = useNavigation();

  function calculateTotal(monthlyAmount: number, bcCharges: number, Tax: number) {
    let total = 0;
    total = monthlyAmount + bcCharges + Tax;
    return total;
  }

  const changeStatus = async () => {
    setIsLoading(true);

    if (!item?.id) {
      setIsLoading(false);
      return;
    }

    const data = {
      paid: true,
      paymentMethod: value,
    };

    try {
      const response = await apimiddleWare({
        url: `/bcs/payments/${item?.id}`,
        method: 'put',
        data: data,
      });

      if (response) {
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setError(true);
      return;
    }
  };

  const openEditModal = () => {
    setActiveModalItem(true);
  };

  return (
    <View backgroundColor={newColorTheme.BACKGROUND_COLOR} flex={1}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <View mx={horizontalScale(20)}>
        <Heading name={'Summary'} navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(10) }}
        showsVerticalScrollIndicator={false}
      >
        <View
          bg={'WHITE_COLOR'}
          borderRadius={15}
          mx={horizontalScale(20)}
          mt={verticalScale(40)}
          p={5}
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 10,
              height: 2,
            },
            shadowRadius: 20,
          }}
        >
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color="GREY" fontFamily={Fonts.POPPINS_MEDIUM}>
              BC Month
            </Text>
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              {new Date(item?.month).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color="GREY" fontFamily={Fonts.POPPINS_MEDIUM}>
              BC Type
            </Text>
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              {bcData?.type.toUpperCase()}
            </Text>
          </View>
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color="GREY" fontFamily={Fonts.POPPINS_MEDIUM}>
              Amount
            </Text>
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              Rs {bcData?.amount}
            </Text>
          </View>
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color="GREY" fontFamily={Fonts.POPPINS_MEDIUM}>
              BC Charges
            </Text>
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              Rs 0
            </Text>
          </View>
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color="GREY" fontFamily={Fonts.POPPINS_MEDIUM}>
              Tax
            </Text>
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              Rs 0
            </Text>
          </View>
          <View borderWidth={0.5} borderColor={'#EEEEEE'} mt={5} />
          <View
            mt={3}
            flexDirection="row"
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text color={'BLACK_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              Total
            </Text>
            <Text
              color={'PRIMARY_COLOR'}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
              fontSize={'md'}
            >
              Rs {calculateTotal(bcData?.amount, 0, 0)}
            </Text>
          </View>
        </View>
        <Text
          color="#06202E"
          mx={horizontalScale(20)}
          fontFamily={Fonts.POPPINS_MEDIUM}
          mt={5}
        >
          Please select your payment method
        </Text>
        {paymentMethod.map((item, index) => {
          return (
            <View
              key={index}
              mx={horizontalScale(20)}
              bg={'WHITE_COLOR'}
              borderRadius={15}
              mt={verticalScale(15)}
              p={3}
              px={5}
              style={{
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 10,
                  height: 2,
                },
                shadowRadius: 20,
              }}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems="center"
            >
              <Radio.Group
                name="Payment Radio Group"
                value={value && value}
                onChange={(nextValue: any) => {
                  setValue(nextValue);
                  console.log(nextValue);
                }}
              >
                <Radio
                  value={item.value}
                  my={1}
                  fontFamily={Fonts.POPPINS_EXTRA_BOLD}
                >
                  {item.name}
                </Radio>
              </Radio.Group>
              <item.ImageComponent />
            </View>
          );
        })}
        <Button
          mx={horizontalScale(20)}
          isLoading={isLoading}
          isDisabled={value === null}
          variant="solid"
          _text={{
            color: 'WHITE_COLOR',
            fontFamily: Fonts.POPPINS_SEMI_BOLD,
          }}
          _loading={{
            _text: {
              color: 'BLACK_COLOR',
              fontFamily: Fonts.POPPINS_MEDIUM,
            },
          }}
          _spinner={{
            color: 'BLACK_COLOR',
          }}
          _pressed={{
            backgroundColor: 'DISABLED_COLOR',
          }}
          spinnerPlacement="end"
          backgroundColor={'PRIMARY_COLOR'}
          size={'lg'}
          mt={verticalScale(40)}
          p={'4'}
          borderRadius={16}
          isPressed={isLoading}
          onPress={() => {
            openEditModal();
          }}
        >
          Pay
        </Button>
        <Modal
          visible={activeModalItem}
          transparent={true}
          animationType="slide"
        >
          <StatusBar
            backgroundColor={'rgba(0, 0, 0, 0.63)'}
            barStyle={'dark-content'}
          />
          <View flex={1} bg={'rgba(0, 0, 0, 0.63)'} justifyContent={'center'}>
            <View
              mx={horizontalScale(20)}
              bg={'WHITE_COLOR'}
              borderRadius={15}
              py={verticalScale(20)}
            >
              <View justifyContent={'center'} alignItems={'center'}>
                <Payment />
                <Text
                  mt={verticalScale(20)}
                  color={'BLACK_COLOR'}
                  fontSize={'2xl'}
                  letterSpacing={1}
                  fontFamily={Fonts.POPPINS_SEMI_BOLD}
                >
                  Are you sure
                </Text>
                <Text
                  color={'GREY'}
                  fontSize={'sm'}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  to pay the BC?
                </Text>
              </View>
              <View mt={5} flexDirection={'row'} justifyContent={'center'}>
                <Button
                  variant="solid"
                  _text={{
                    color: 'BLACK_COLOR',
                    fontFamily: Fonts.POPPINS_SEMI_BOLD,
                  }}
                  backgroundColor={'#D3D3D3'}
                  size={'md'}
                  px={'7'}
                  mr={2}
                  borderRadius={10}
                  onPress={() => {
                    setActiveModalItem(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  variant="solid"
                  _text={{
                    color: 'WHITE_COLOR',
                    fontFamily: Fonts.POPPINS_SEMI_BOLD,
                  }}
                  _loading={{
                    _text: {
                      color: 'BLACK_COLOR',
                      fontFamily: Fonts.POPPINS_MEDIUM,
                    },
                  }}
                  _spinner={{
                    color: 'BLACK_COLOR',
                  }}
                  _pressed={{
                    backgroundColor: 'DISABLED_COLOR',
                  }}
                  spinnerPlacement="end"
                  backgroundColor={'PRIMARY_COLOR'}
                  size={'lg'}
                  px={'10'}
                  borderRadius={10}
                  isDisabled={value === null}
                  isPressed={isLoading}
                  onPress={async () => {
                    setActiveModalItem(false);
                    await changeStatus();
                  }}
                >
                  Pay
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={error} transparent={true} animationType="slide">
          <View flex={1} bg={'rgba(0, 0, 0, 0.63)'} justifyContent={'center'}>
            <View
              mx={horizontalScale(20)}
              bg={'WHITE_COLOR'}
              borderRadius={15}
              py={verticalScale(20)}
            >
              <View justifyContent={'center'} alignItems={'center'}>
                <Err />
                <Text
                  textAlign={'center'}
                  mt={verticalScale(20)}
                  color={'BLACK_COLOR'}
                  fontSize={'2xl'}
                  letterSpacing={1}
                  fontFamily={Fonts.POPPINS_SEMI_BOLD}
                >
                  Payment unsuccessful!
                </Text>
                <Text
                  color={'GREY'}
                  fontSize={'sm'}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  Please try again.
                </Text>
              </View>
              <View mt={5} flexDirection={'row'} justifyContent={'center'}>
                <Button
                  variant="solid"
                  _text={{
                    color: 'BLACK_COLOR',
                    fontFamily: Fonts.POPPINS_SEMI_BOLD,
                  }}
                  backgroundColor={'#D3D3D3'}
                  size={'md'}
                  px={'7'}
                  mr={2}
                  borderRadius={10}
                  onPress={() => {
                    setError(false);
                    navigation.goBack();
                  }}
                >
                  OK
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({});
