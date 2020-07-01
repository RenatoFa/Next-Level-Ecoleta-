import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons' // Icones
import { View, ImageBackground, Text, Image, StyleSheet, Picker, NativeTouchEvent } from 'react-native'; //tags
import { RectButton } from 'react-native-gesture-handler'; //Botão
import { useNavigation } from '@react-navigation/native'; // Navegação de uma tela para outra
import axios from 'axios';


const Home = () => {


  interface IBGEUFResponse {
    sigla: string;
  }

  interface IBGECityResponse {
    nome: string;
  }


  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectUfs] = useState('');
  const [selectedCity, setSelectCity] = useState('');
  
  
  const navigation = useNavigation(); // Navegação de uma tela para outra

  useEffect(() => {

    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const UfInitials = response.data.map(uf => uf.sigla);
      setUfs(UfInitials);

    })

  }, []);

  useEffect(() => {
    //Carregar os Municipios sempre que a UF mudar
    if (selectedUf === '0') {
        return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const cityNames = response.data.map(city => city.nome)

        setCities(cityNames) // Pode ser o problema

       


    });
}, [selectedUf]);

 
   




  function handleUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectUfs(uf);

  }

  function handleCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectCity(city);

  }


  function handleNavigateToPoints() { // Crio uma função da Tela de Home Para a Tela de Points
    navigation.navigate('Points',{
      selectedUf,
      selectedCity
    });
    
  }
  
  
  

  let myufs = ufs.map(ufss => (
    <Picker.Item label={ufss} value={ufss} key={ufss} />
  ))

  let mycities = cities.map(city=>{
    return <Picker.Item label={city} value={city} key={city}  />
  })


  



  

  



  return (
    <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficente.</Text>
      </View>

      <View style={styles.pickerstyle}>
        <Picker selectedValue={selectedUf} onValueChange={(item, value) => setSelectUfs(item)}>
          {myufs}

        </Picker>

      </View>

      <View style={styles.pickerstyle2}>
        <Picker selectedValue={selectedCity} onValueChange={(item, value) => setSelectCity(item)}>
          {mycities}
        </Picker>

      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => {
          handleNavigateToPoints()
        }}>


          <View style={styles.buttonIcon} >

            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>



          </View>








          <Text style={styles.buttonText}>

            Entrar

          </Text>




        </RectButton>



      </View>
    </ImageBackground>
  )
}

// Estilo 
// Nota: Diferente do React.Js

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  pickerstyle: {

    top: -60,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,

  },

  pickerstyle2: {

    top: -40,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,

  }
});




export default Home;