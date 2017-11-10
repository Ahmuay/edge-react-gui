// @flow
import React, { Component } from 'react'
// import * as Constants from '../../../common/constants'
import { Input } from './materialWrappers/indexMaterial'

type Props = {

  style: any,
  label: string,
  value?: string,
  placeholder?: string,
  autoCorrect: boolean,
  autoFocus: boolean,
  forceFocus: boolean,
  autoCapitalize?: string,
  secureTextEntry: boolean,
  showSecureCheckbox: boolean,
  returnKeyType?: string,
  error?: string,
  onSubmitEditing():void,
  onFocus():void,
  onChangeText():void,
}

type State = {
  secure: boolean,
  autoFocus: boolean
}

class FormField extends Component<Props, State> {
  static defaultProps = {
    autoCapitalize: 'none',
    autoCorrect: false,
    autoFocus: false,
    forceFocus: false,
    returnKeyType: 'go',
    onFocus: null
  }
  componentWillMount () {
    const secure = this.props.secureTextEntry
      ? this.props.secureTextEntry
      : false
    this.setState({
      secure: secure,
      autoFocus: this.props.autoFocus
    })
  }
  render () {
    const {
      container,
      baseColor,
      tintColor,
      textColor,
      errorColor,
      titleTextStyle

    } = this.props.style
    return (
      <Input
        label={this.props.label}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        error={this.props.error}
        containerStyle={container}
        secureTextEntry={this.state.secure}
        returnKeyType={this.props.returnKeyType}
        baseColor={baseColor}
        tintColor={tintColor}
        textColor={textColor}
        errorColor={errorColor}
        titleTextStyle={titleTextStyle}
        autoFocus={this.state.autoFocus}
        forceFocus={this.props.forceFocus}
        onFocus={this.props.onFocus}
        autoCapitalize={'none'}
        onSubmitEditing={this.onSubmitEditing.bind(this)}
        />
    )
  }
  onSubmitEditing = () => {
    if (this.props.onSubmitEditing) {
      this.props.onSubmitEditing()
    }
  }
}

export { FormField }
