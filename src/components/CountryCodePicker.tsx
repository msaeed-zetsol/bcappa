import { CountryItem, CountryPicker } from "react-native-country-codes-picker";

type CountryCodePicker = {
  visible: boolean;
  onPicked: (code: CountryItem) => void;
  onDismiss: () => void;
};

const CountryCodePicker = ({
  visible,
  onPicked,
  onDismiss,
}: CountryCodePicker) => {
  return (
    <CountryPicker
      lang={"en"}
      show={visible}
      pickerButtonOnPress={(item: CountryItem) => onPicked(item)}
      style={{
        modal: {
          maxHeight: "75%",
          padding: 16,
        },
        textInput: {
          paddingStart: 16,
        },
        countryName: {
          color: "black",
        },
        dialCode: {
          color: "black",
        },
      }}
      onBackdropPress={onDismiss}
    />
  );
};

export default CountryCodePicker;
