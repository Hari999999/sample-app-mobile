import React, { Component } from 'react';
import { ShoppingCart } from '../shopping-cart';
import { Credentials } from '../credentials';
import { Button, Divider } from 'react-native-elements';
import i18n from '../config/i18n';
import { testProperties } from '../config/TestProperties';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  MAKE_ACCESSIBLE_FOR_AUTOMATION,
  MUSEO_SANS_BOLD,
  MUSEO_SANS_NORMAL,
  WINDOW_WIDTH,
} from '../config/Constants';
import { colors } from '../utils/colors';


export default class InventoryListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      image_url: props.image_url,
      name: props.name,
      desc: props.desc,
      price: props.price,
      // Set our initial state now
      itemInCart: ShoppingCart.isItemInCart(props.id),
    };

    ShoppingCart.registerCartListener(this);

    if (Credentials.isProblemUser()) {
      // Replace our image with our broken link image
      this.state.image_url = require('../../img/sl-404.jpg');
    }

    // Need to pass this in explicitly since it's a subcomponent
    this.navigation = props.navigation;

    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.navigateToItem = this.navigateToItem.bind(this);
  }

  addToCart() {

    if (Credentials.isProblemUser()) {
      // Bail out now, don't add to cart if the item ID is odd
      if (this.state.id % 2 === 1) {
        return;
      }
    }

    ShoppingCart.addItem(this.state.id);
    this.setState({ itemInCart: true });
  }

  removeFromCart() {

    if (Credentials.isProblemUser()) {
      // Bail out now, don't remove from cart if the item ID is even
      if (this.state.id % 2 === 0) {
        return;
      }
    }

    ShoppingCart.removeItem(this.state.id);
    this.setState({ itemInCart: false });
  }

  navigateToItem() {

    var itemId = this.state.id;
    if (Credentials.isProblemUser()) {
      itemId += 1;
    }

    this.navigation.navigate('InventoryItem', { id: itemId });
  }

  render() {

    var cartButton;

    if (ShoppingCart.isItemInCart(this.state.id)) {
      cartButton = (
        <Button
          buttonStyle={ [ styles.buttonStyle, styles.removeButtonStyle ] }
          containerStyle={ styles.buttonContainerStyle }
          titleStyle={ [ styles.buttonTitleStyle, styles.removeButtonTitleStyle ] }
          onPress={ this.removeFromCart }
          title={ i18n.t('inventoryItemPage.removeButton') }
          { ...testProperties(i18n.t('inventoryListPage.removeButton')) }
        />);
    } else {
      cartButton = (
        <Button
          buttonStyle={ styles.buttonStyle }
          containerStyle={ styles.buttonContainerStyle }
          titleStyle={ styles.buttonTitleStyle }
          onPress={ this.addToCart }
          title={ i18n.t('inventoryItemPage.addButton') }
          { ...testProperties(i18n.t('inventoryListPage.addButton')) }
        />);
    }
    // Needed to add `accessible={false}` to the TouchableOpacity component, otherwise the components are not accessible and shown
    // in a flat UI structure
    return (
      <View style={ styles.item_container }{ ...testProperties(i18n.t('inventoryListPage.itemContainer')) }>
        <TouchableOpacity
          onPress={ this.navigateToItem }
          { ...MAKE_ACCESSIBLE_FOR_AUTOMATION }
        >
          <Image
            source={ this.state.image_url }
            style={ styles.item_image }
            resizeMode="contain"
          />

          <View { ...testProperties(i18n.t('inventoryListPage.itemDescription')) }>
            <Text style={ styles.item_name }>{ this.state.name }</Text>
            <Text style={ styles.item_desc }>{ this.state.desc }</Text>
          </View>

          <Divider style={ [ styles.divider, styles.descriptionPriceDivider ] }/>

          <View>
            <Text style={ styles.price_text }{ ...testProperties(i18n.t('inventoryListPage.price')) }>
              ${ this.state.price }
            </Text>
            { cartButton }
          </View>

          <Divider style={ styles.divider }/>

        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item_container: {
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
  },
  item_image: {
    flex: 1,
    alignSelf: 'stretch',
    // This is for keeping the aspect ratio and make it repsonse
    height: (WINDOW_WIDTH - 50) * 1.25,
    width: WINDOW_WIDTH - 50,
    marginBottom: 20,
  },
  item_name: {
    color: colors.slRed,
    fontSize: 24,
    fontFamily: MUSEO_SANS_BOLD,
    paddingBottom: 10,
  },
  item_desc: {
    color: colors.gray,
    fontSize: 16,
    fontFamily: MUSEO_SANS_NORMAL,
  },
  divider: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 2,
    width: '100%',
    marginBottom: 0,
    marginTop: 40,
  },
  descriptionPriceDivider: {
    width: '40%',
    marginBottom: 30,
    marginTop: 30,
  },
  price_text: {
    color: colors.slRed,
    fontSize: 28,
    fontFamily: MUSEO_SANS_NORMAL,
    paddingBottom: 20,
  },
  buttonContainerStyle: {
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: colors.white,
    borderColor: colors.slRed,
    borderWidth: 3,
    borderRadius: 0,
    paddingBottom: 5,
    paddingTop: 5,
  },
  buttonTitleStyle: {
    color: colors.slRed,
    fontSize: 18,
    fontFamily: MUSEO_SANS_BOLD,
  },
  removeButtonStyle: {
    borderColor: colors.gray,
  },
  removeButtonTitleStyle: {
    color: colors.gray,
  },
});
