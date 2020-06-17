import React from 'react';
import { StatusBar, View } from 'react-native'; // importação do VIew e do StatusBar
import {AppLoading} from 'expo' // Pagina de Splashing


import {Ubuntu_700Bold,useFonts} from '@expo-google-fonts/ubuntu';//Carregamento de Fonte
import {Roboto_400Regular,Roboto_500Medium} from '@expo-google-fonts/roboto';// Carregamento de Fonte



import Routes from './src/routes';



 export default function App() {

  const[fontsLoaded]=useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading/>
  }


  return (

    //Fragmento (Modo de utilizar uma encapsular varias tags)
    <>
      <StatusBar barStyle= "dark-content" backgroundColor="transparent" translucent/>
      <Routes/>
      </>
  );
  
}

