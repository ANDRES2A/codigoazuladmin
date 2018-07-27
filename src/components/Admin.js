import React, { Component } from 'react';
import '../utils/Style.css';
import Mapa from './Mapa';
import PageTitle from './PageTitle';

export default class Admin extends Component {
    constructor(props){
        super(props);
        this.state={
            guias:[],
        };
    }
    startOver(){
    }
    componentWillMount(){
        this.startOver();
    }
    render() {
        return(
            <div className="App">
                <PageTitle 
                    title="Código Azul"
                    isLoggedIn={true}
                    hasSettingsMenu ={false}
                />
                <Mapa></Mapa>
            </div>
        )
    }
}


