import { Button, IButtonProps } from "native-base";
import { Fonts } from "../constants";
import { deepSkyBlue } from "../constants/Colors";

type SecondaryButtonProps = {
  text: string;
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
  props?: IButtonProps;
};

const SecondaryButton = ({
  text,
  isLoading,
  isDisabled,
  onClick,
  props,
}: SecondaryButtonProps) => {
  return (
    <Button
      {...props}
      isLoading={isLoading}
      variant="outline"
      android_ripple={{
        color: "#cee4f0",
      }}
      borderColor={deepSkyBlue}
      _text={{
        color: deepSkyBlue,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
      }}
      _loading={{
        backgroundColor: "#cecece",
      }}
      _spinner={{
        color: "black",
        padding: 1,
      }}
      _pressed={{
        backgroundColor: deepSkyBlue,
        _text: {
          color: "white",
        },
      }}
      spinnerPlacement="start"
      _disabled={{
        backgroundColor: "#cecece",
        borderColor: "#cecece",
        _text: {
          color: "black",
          fontFamily: Fonts.POPPINS_MEDIUM,
        },
      }}
      isDisabled={isDisabled}
      size={"lg"}
      p={4}
      borderRadius={16}
      borderWidth={1}
      isPressed={isLoading}
      onPress={onClick}
    >
      {text}
    </Button>
  );
};

export default SecondaryButton;
