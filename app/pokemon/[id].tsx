import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import RootView from "../components/RootView";
import { Row } from "../components/Row";
import ThemedText from "../components/ThemedText";
import { usefetchQuery } from "../hooks/useFetchQuery";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColor";
import { basePokemonStats, formatPokemonSize, formatPokemonWeight, getPokemonArtwork } from "../functions/pokemon";
import { Card } from "../components/Card";
import { PokemonType } from "../components/Pokemon/PokemonType";
import { PokemonSpec } from "../components/Pokemon/PokemonSpec";
import { PokemonStat } from "../components/Pokemon/PokemonStat";
import { Audio } from "expo-av";

export default function Pokemon(){
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const {data: pokemon} = usefetchQuery("/pokemon/[id]", {id: params.id})
    const {data: species} = usefetchQuery("/pokemon-species/[id]", {id: params.id})
    const id = parseInt(params.id, 10)
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType] : colors.tint 
    const types = pokemon?.types ?? []
    const bio = species?.flavor_text_entries
        ?.find(({language}) => language.name == 'en')
        ?.flavor_text.replaceAll("\n", ". ");

    const stats= pokemon?.stats ?? basePokemonStats

    const onImagePress = async () => {
        const cry = pokemon?.cries.latest
        if(!cry){
            return
        }
        const { sound } = await Audio.Sound.createAsync(
            {
                uri: cry
            }, 
            {shouldPlay: true}
        );
        sound.playAsync();
    }
    const onPrevious = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)}})
    }
    const onNext = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id+1, 600)}})
    }

    return <RootView backgroundColor={colorType}>
        <View>
            <Image style={styles.pokeball} source={require('@/assets/images/big_pokeball.png')} width={208} height={208}/>
            <Row style={styles.header}>
                <Pressable onPress={router.back} style={styles.pressable}>
                <Row gap={8} style={{alignItems: "center"}}>
                    <Image source={require('@/assets/images/arrow_back.png')} style={styles.backIcon} />
                    <ThemedText variant="headline" color="grayWhite" style={{textTransform: 'capitalize'}}>
                        {pokemon?.name}
                    </ThemedText>
                </Row>
            </Pressable>
            <ThemedText variant="subtitle2" color="grayWhite">
                #{params.id.padStart(3, '0')}
            </ThemedText>
            </Row>

            

            <Card style={[styles.card]}>
                <Row style={styles.imageRow}>
                    {id == 1 ? <View style={{ width: 24, height: 24 }}></View> :
                        <Pressable onPress={onPrevious}>
                            <Image width={24} height={24} source={require('@/assets/images/arrow_left.png')} />
                        </Pressable>}
                    <Pressable onPress={onImagePress}>
                        <Image
                            style={styles.artwork}
                            source={{ uri: getPokemonArtwork(params.id) }}
                            width={200}
                            height={200}
                        />
                    </Pressable>
                    <Pressable onPress={onNext}>
                        <Image width={24} height={24} source={require('@/assets/images/arrow_right.png')} />
                    </Pressable>
                </Row>
                <Row gap={16} style={{height: 20}}>
                    {types.map(type => <PokemonType name={type.type.name} key={type.type.name}/>)}
                </Row>
                <ThemedText variant="subtitle1" style={{color: colorType}}>
                    About
                </ThemedText>
                
                <Row>
                    <PokemonSpec 
                        style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLigth}}
                        title={formatPokemonWeight(pokemon?.weight)} 
                        description={"Weight"}  
                        image={require('@/assets/images/weight.png')}
                    />
                    <PokemonSpec 
                        style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLigth}}
                        title={formatPokemonSize(pokemon?.height)} 
                        description={"Size"}  
                        image={require('@/assets/images/height.png')}
                    />
                    <PokemonSpec 
                        title={pokemon?.moves.slice(0,2).map((m) => m.move.name).join("\n")} 
                        description={"Moves"}
                    />
                </Row>
                <ThemedText>{bio}</ThemedText>
                <ThemedText variant="subtitle1" style={{color: colorType}}>
                    base Stat
                </ThemedText>

                <View style={{alignSelf: 'stretch'}}>
                    {stats.map((stat) =>(
                        <PokemonStat
                            key= {stat.stat.name}
                            name={stat.stat.name}
                            value={stat.base_stat}
                            color={colorType}
                        />
                    ))}
                </View>
            </Card>
        </View>
    </RootView>
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: 'space-between',
    },
    pokeball: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    imageRow: {
        position: 'absolute',
        top: -140, 
        zIndex: 2,
        justifyContent: 'space-between',
        left: 0,
        right: 0,
        paddingHorizontal: 20,       
    },
    pressable: {
        flexDirection: 'row',  // Aligne les éléments horizontalement
        alignItems: 'center',  // Centre verticalement le texte et l'icône
    },
    backIcon: {
        width: 32,
        height: 32,
    },
    artwork: {
    },
    body: {
    },
    card: {
        paddingHorizontal: 20,
        marginTop: 144,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: 'center'
    },
})