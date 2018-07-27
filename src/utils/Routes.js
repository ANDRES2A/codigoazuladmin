import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import './Style.css';
import Login from '../components/Login';
import Admin from '../components/Admin';
import {auth} from './Firebase';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import { blue500 } from 'material-ui/styles/colors';

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => authed === true
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
      />
    )
  }
  
  function PublicRoute ({component: Component, authed, superuser, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => 
          authed === false? 
            <Component {...props} />
          :  
            <Redirect to='/admin' />
        }
      />
    )
  }

export default class Routes extends Component {
    constructor(props){
        super(props);
        this.state={
            loading:true,
            authed:false,
            store:null,
        }
    }
    componentDidMount () {
        this.removeListener = auth.onAuthStateChanged((user) => {
            if (user) {
                localStorage.uid = user.uid;
                this.setState({
                    authed: true,
                    loading: false,
                })
            } else {
                this.setState({
                    authed: false,
                    loading: false,
                })
            }
        })
    }
    componentWillUnmount () {
        this.removeListener()
    }
    render() {
    return this.state.loading === true ? <div className="content"><CircularProgress color={blue500} size={100} thickness={7} /></div> : (
            <BrowserRouter>
                <Switch>
                    <PrivateRoute path='/' authed={this.state.authed}  exact component={Admin} />
                    <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                    <PrivateRoute authed={this.state.authed} path='/admin' component={Admin} />
                    <Route render={() => <h6>Error 404 No Encontrado</h6>} />
                </Switch>
          </BrowserRouter>
          );
  }
}