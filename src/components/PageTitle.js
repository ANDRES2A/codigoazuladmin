import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton  from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Link,Route} from 'react-router-dom';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import Settings from 'material-ui/svg-icons/action/settings';
import {logout} from '../utils/Firebase';
import { blue500 } from 'material-ui/styles/colors';

export default class PageTitle extends Component {
    constructor(props){
        super(props);
        this.state={

        };
    }
    logUserOut =() =>{
      logout();
    }
    componentWillMount(){
        
    }
    render() {
        return (
            <AppBar 
            iconElementLeft={
                <Link to={"/"}><FontIcon style={{margin: '10px 0 0',color: '#fff', verticalAlign:'middle'}} className="material-icons">home</FontIcon></Link>
            }
            title={this.props.title} 
            style={{marginBottom:5,backgroundColor: blue500,color:'#fff',marginTop:0,marginLeft:0,marginRight:0,width:'100%' }} 
            iconElementRight = {
              <div>
              {
                this.props.isLoggedIn===true&&
                <div>
                  {
                    this.props.hasSettingsMenu&&
                    <a href="manage">
                    <FontIcon style={{color: '#fff', verticalAlign:'middle'}} className="material-icons">settings</FontIcon>
                    </a>  
                  }
                  <FlatButton 
                    style={{display: 'inline-block',margin: '7px 0 0', color: '#fff'}} 
                    onClick={this.logUserOut}
                    icon = {<Exit />}
                  />
                </div>   
              }
              </div>
            } 
          />  
        );
    }
}


