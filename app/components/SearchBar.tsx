import { Image, StyleSheet, TextInput, View } from "react-native"
import { useThemeColors } from "../hooks/useThemeColor"
import { Row } from "./Row"
import { Colors } from "../constants/Colors"

type Props = {
    value: string,
    onChange: (s: string) => void
}

export function SearchBar ({value, onChange}: Props) {
    const colors = useThemeColors()
    return (
    <Row 
        gap={8} 
        style={[styles.wrapper, {backgroundColor: colors.grayWhite}]}
    >
        <Image source={
            require('@/assets/images/search.png')} 
            width={16} 
            height={16}
        />
        <TextInput 
            style={styles.input} 
            onChangeText={onChange} 
            value={value}
            placeholder="Search..." // Ajoutez un placeholder pour tester
        />
    </Row>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 16,
        height: 32,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 16, // Taille raisonnable pour du texte
        lineHeight: 16,
        height: 50, // Ajustez pour s'adapter au wrapper
    },    
})