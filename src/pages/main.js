import React, { Component} from "react";
//import api from '../services/api';
import axios from 'axios';

import {ProgressBarAndroid, View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from "react-native";

export default class Main extends Component {

  static navigationOptions = {
    title: "Joabe"
  };

  state = {
    productsInfo: {},
    docs: [],
    page: 1,
    msg: "vazio"
  };

  componentDidMount() {
    this.loadProducts();
  }


  loadProducts = async ( page = 1 ) => {  // por padrão vai ser 1'
    try {
      const response = await axios.get(`https://rocketseat-node.herokuapp.com/api/products?page=${page}`);
      const { docs, ...productsInfo} =  response.data; // extrai de data os docs e infos

      this.setState({
        docs: [...this.state.docs, ...docs], //concatena os docs com novos docs
        productsInfo,
        page//importante salvar porque toda vez que vai ate o fim da lista ele volta pra 1, se nao o salvar
      });

    } catch (e) {
      this.setState({msg: e.message});
    }
  };

  loadMore = () => {
    const { page, productsInfo} = this.state; //pega as duas variaveis de dentro de state pra usar dentro do metodo

    if (page === productsInfo.pages) return; //compara para ver se ja atingiu o limite de paginas

    const pageNumber = page + 1;

    this.loadProducts ( pageNumber );
  };

  renderItem = ({item}) => (

    <View style = {styles.productsContainer}>

      <Text style = {styles.productsTitle}>{item.title}</Text>

      <Image  source = {{uri: 'https://image.redbull.com/rbcom/010/2014-07-16/1331665124920_2/0100/0/1/lily-allen.jpg'}}
        style = {styles.productsImage} />

      <Text style = {styles.productsDescription}>{item.description}</Text>

      <TouchableOpacity
        style = {styles.productsButton}
        onPress = { () => {
          this.props.navigation.navigate("Product", {product: item});
        }}>
        <Text style = {styles.productsButtonText}> ver mais </Text>
      </TouchableOpacity>

    </View>
  );

  /*
    {this.state.docs.map( products => {
        return <Text key = {products._id}>{products.title}</Text>;
    })}
  */

  render() {
    return (
      <View style = {styles.container}>

        <FlatList
            contentContainerStyle = {styles.list}
            data = {this.state.docs}
            keyExtractor = {item => item._id}
            renderItem = {this.renderItem}
            onEndReached = {this.loadMore}
            onEndReachedThreshold = {0.2}
             />

      </View>
    );
  }
}

const styles = {
  container: {
    padding: 8,
    backgroundColor: '#fff',
    flex:1
  },
  list: {
    padding: 10
  },
  productsContainer: {
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 5
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productsImage: {
    flex: 1,
    width: 290,
    height: 270,
    marginTop: 20
  },
  productsDescription: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
    marginTop: 20
  },
  productsButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DA552F',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsButtonText:{
    color: '#DA552F',
    padding: 10,
  }
};
