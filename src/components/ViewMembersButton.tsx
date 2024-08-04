import { Text } from "native-base";
import PrimaryButton from "./PrimaryButton";
import globalStyles from "../styles/global";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { useTranslation } from "react-i18next";
import { StyleProp, ViewStyle } from "react-native";
import { useEffect, useState } from "react";
import { deepSkyBlue } from "../constants/Colors";

type ViewMembersButtonProps = {
  membersLength: number;
  maxUsers: string;
  isCreatingBc: boolean;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
};

const ViewMembersButton = (props: ViewMembersButtonProps) => {
  const { t } = useTranslation();
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (props.maxUsers === "") {
      setMax(0);
    } else {
      setMax(+props.maxUsers);
    }
  }, [props.maxUsers]);

  return (
    <>
      <PrimaryButton
        text={`${t("view_members")} (${props.membersLength})`}
        backgroundColor="#F0FAFF"
        textColor={deepSkyBlue}
        isDisabled={props.isCreatingBc || max === 0}
        isLoading={false}
        onClick={props.onClick}
        props={{
          style: props.style,
        }}
      />
      {max >= 1 && props.membersLength < 1 && (
        <Text
          style={[globalStyles.errorText, { marginStart: horizontalScale(8) }]}
        >
          Add atleast one member to continue
        </Text>
      )}
      {max >= 1 && props.membersLength > max && (
        <Text
          style={[globalStyles.errorText, { marginStart: horizontalScale(8) }]}
        >
          BC cannot have more members than set maximum limit
        </Text>
      )}
    </>
  );
};

export default ViewMembersButton;
