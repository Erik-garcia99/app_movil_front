// src/styles/BottomNavStyles.js
/**
 * el margin funciona para serparar ele lemento de sus vecinos, hace espacio fuera del elemento
 * 
 * el padding aumenta el esapcio dentro de la caja en cierra el elemetnos 
 * 
 * 
 */


import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#888888',
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: '500',
  },

  safeArea: { flex: 1, backgroundColor: '#567C8D' },
  screenContainer: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export const font = StyleSheet.create({

  h1:{
    fontSize:15,
    fontFamily:"monospace",
    fontWeight:"bold",
    color:"#000"
  }
})

export const image= StyleSheet.create({

  log_image :{
    resizeMode:"contain",
    // position: 'absolute',
    width:200,
    height:100,
    left: '50%',
    marginLeft: '-20%',
    top: 150,
    
  },

  icono:{
    // position: 'absolute',
    // Centrar horizontalmente
    left: '50%',
    marginLeft: '-5%', // mitad del ancho (asumiendo 40px)
    // Debajo de la imagen, por ejemplo top: 280
    top: 200,

  }
  
})

export const input_label= StyleSheet.create({

label: {
    color: '#fff',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    position:'absolute'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
  },

})

export const default_buttom_scheme = StyleSheet.create({

  buttom:{
    color: '#fff', fontSize: 16, fontWeight: '600', backgroundColor:"#2C2C2C"
  }

})
