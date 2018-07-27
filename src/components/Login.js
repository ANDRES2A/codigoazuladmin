import React, { Component } from 'react';
import {auth} from '../utils/Firebase';
import '../utils/Style.css';
import { blue500 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from'material-ui/TextField';
import Paper from 'material-ui/Paper';
import logo from '../assets/512.png';
import PageTitle from './PageTitle';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            isLoading:false,
            error:false,
        };
    }
    handleSubmit = (e) =>{
        this.setState({isLoading:true})
        let email = this.state.email;
        let password = this.state.password;
        e.preventDefault();
        let self = this;
            auth.signInWithEmailAndPassword(email,password).then((data)=>{
                self.setState({isLoading:false})
            })
            .catch((error) => {
                self.setState({error:true,isLoading:false,});
                alert('Datos Incorrectos');
            })
       
    }
    componentWillMount(){
        
    }
    render() {
        return this.state.isLoading === true ? <div className="content"><CircularProgress color={blue500} size={100} thickness={7} /></div> : (
            <div className="App">
                <PageTitle title={'Código Azul'}/>
                <Paper className="loginContainer" zDepth={1}>
                    <div>
                    <img src={logo} width="200" alt="logo"/>
                    </div>
                    <div>
                    <h3>INGRESO</h3>
                    </div>
                    <div>
                        <TextField 
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value})} 
                        floatingLabelText="Correo electrónico"/>
                    </div>
                    <div>
                        <TextField 
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value})} 
                        floatingLabelText="Contraseña" 
                        type="password"/>
                    </div>                    
                    <div style={{padding:20}}>
                        <RaisedButton label="Entrar" onClick={this.handleSubmit}>
                            <input type="submit" className="submit"/>
                        </RaisedButton>
                    </div>
                    {
                        this.state.error&&
                        <div>
                            <h6 style={{color:'red'}}>Error, Intente nuevamente</h6>
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}


