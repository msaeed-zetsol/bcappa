import { Button, IButtonProps } from "native-base";
import { Fonts } from "../constants";

type PrimaryButtonProps = {
  text: string;
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
  props?: IButtonProps;
};

const PrimaryButton = ({
  text,
  isLoading,
  isDisabled,
  onClick,
  props,
}: PrimaryButtonProps) => {
  return (
    <Button
      {...props}
      isLoading={isLoading}
      variant="solid"
      android_ripple={{
        color: "#cee4f0",
      }}
      _text={{
        color: "white",
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
      }}
      _loading={{
        backgroundColor: "#cecece",
      }}
      _spinner={{
        color: "black",
        padding: 1,
      }}
      spinnerPlacement="start"
      backgroundColor={"PRIMARY_COLOR"}
      _disabled={{
        backgroundColor: "#cecece",
        _text: {
          color: "black",
          fontFamily: Fonts.POPPINS_MEDIUM,
        },
      }}
      isDisabled={isDisabled}
      size={"lg"}
      p={4}
      borderRadius={16}
      isPressed={isLoading}
      onPress={onClick}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
