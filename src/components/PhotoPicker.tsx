import { Text, View } from "native-base";
import { Modal, TouchableOpacity } from "react-native";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { useTranslation } from "react-i18next";
import { Fonts } from "../constants";

export type PickType = "camera" | "gallery";
type PhotoPickerProps = {
  visible: boolean;
  onDismiss: () => void;
  onPick: (type: PickType) => void;
};

const PhotoPicker = ({ visible, onDismiss, onPick }: PhotoPickerProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
    >
      <View flex={1} bg={"rgba(0, 0, 0, 0.63)"} justifyContent={"flex-end"}>
        <View
          mx={horizontalScale(20)}
          bg={"WHITE_COLOR"}
          borderRadius={15}
          mb={verticalScale(15)}
        >
          <TouchableOpacity
            onPress={() => onPick("gallery")}
            activeOpacity={0.8}
            style={{
              borderColor: "DISABLED_COLOR",
              borderBottomWidth: 0.5,
              padding: 20,
            }}
          >
            <Text
              textAlign="center"
              color={"PRIMARY_COLOR"}
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(18)}
            >
              {t("photo_gallery")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onPick("camera")}
            activeOpacity={0.5}
            style={{
              padding: 20,
            }}
          >
            <Text
              textAlign="center"
              color={"PRIMARY_COLOR"}
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(18)}
            >
              {t("camera")}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onDismiss}
          style={{
            borderRadius: 15,
            padding: 20,
            backgroundColor: "white",
            marginHorizontal: horizontalScale(20),
            marginBottom: verticalScale(15),
          }}
        >
          <Text
            textAlign="center"
            color={"PRIMARY_COLOR"}
            fontFamily={Fonts.POPPINS_MEDIUM}
            fontSize={verticalScale(18)}
          >
            {t("cancel")}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PhotoPicker;
