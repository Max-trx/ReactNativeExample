import { View, type ViewProps, type ViewStyle } from "react-native";
import { Shadows } from "../constants/Shadows";
import { useThemeColors } from "../hooks/useThemeColor";

type Props = ViewProps

export function Card({style, ...rest}: Props){
    const colors = useThemeColors()
    return <View style={[style, styles, {backgroundColor: colors.grayWhite}]} {...rest}></View>
}

const styles = {
    borderRadius: 8,
    ...Shadows.dp2
} satisfies ViewStyle