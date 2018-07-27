/* eslint-disable no-undef */

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import '../utils/Style.css';
import CircularProgress from 'material-ui/CircularProgress';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {DirectionsRenderer, Marker as MarkerGoogle } from "react-google-maps";
import {GoogleMapsWrapper} from '../utils/GoogleMapsWrapper';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import { blue500 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {setActiveFalse} from '../utils/Controller';
import {auth,db} from '../utils/Firebase';
const alerts = db.ref('alerts');

export default class Mapa extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoading:true,
      location: null,
      current: null,
      markers:[],
      directionsEnabled:false,
      directions:null,
      locations:null,
      alerts:null,
      detailEnabled:false,
      key:null,
      detalleInfo:null,
    };
  }
  getLocation(){
    if (navigator.geolocation) {
      let current = navigator.geolocation.getCurrentPosition(this.showPosition);
      this.setState({isLoading:false})

    } else { 
      alert( "Geolocalización falló");
      this.setState({isLoading:false})
    } 
  }
  handleLocation = (element,key) =>{
    let loc = element.localizacion.localizacion
    let loca = loc.split(',');
    let location = {
      lat:parseFloat(loca[0]),
      lng:parseFloat(loca[1])
    };
    this.setState({location, detailEnabled:true,detalleInfo:element,key})
  }
  disableDetail=()=>{
    this.setState({detailEnabled:false,detailInfo:null,location:this.state.current,key:null})
  }
  findMe = () =>{
    this.setState({location:this.state.current});
  }
  showPosition = (position) => {
    let location= {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    this.setState({location,current:location})
    console.log('location: ', location);
  }
  setAsAtendida = () =>{
    setActiveFalse(this.state.key);
    this.disableDetail();
  }
  componentWillMount(){
    this.getLocation();
  }
  componentDidMount(){
    alerts.on('value', snapshot => {
      this.setState({
        alerts: snapshot.toJSON()
      })
    })
  }
  render() {
    let markers = this.state.alerts!==null &&
    Object.entries(this.state.alerts).map((element,index) => {
      let key = element[0];
      let marker = element[1];
      console.log('marker: ', marker);
      if(marker.active===true && marker.localizacion.localizacion !== null && marker.localizacion.localizacion){
        return(
            <MarkerGoogle
              key={index}
              position={{ lat: parseFloat(marker.localizacion.localizacion.split(',')[0]), lng: parseFloat(marker.localizacion.localizacion.split(',')[1]) }}
              icon={{url:require('../assets/alert.png'),scaledSize:{width:30,height:30}, anchor: { x: 15, y: 15 }}}
            >
            </MarkerGoogle>
        );
      }
      else{
        return '';
      }
    });
    
    if(this.state.location!==null && this.state.alerts!==null){
      let detalle= Object.entries(this.state.alerts).map((elem,index)=>{
        let element = elem[1];
        if(element.active===true){
          return(
            <TableRow key={index}>
              <TableRowColumn >
                  {element.ci}
              </TableRowColumn>
              <TableRowColumn >
                {element.nombre}
              </TableRowColumn>
              <TableRowColumn >
                  {element.telefono}
              </TableRowColumn>
              <TableRowColumn >
                  {element.email}
              </TableRowColumn>
              <TableRowColumn>
                  <IconButton iconClassName="material-icons" tooltip="Detalle" onClick={()=>this.handleLocation(element,elem[0])}>pageview</IconButton>
              </TableRowColumn>
            </TableRow>
          )
        }
        else return '';
      });
      let detalleInfo = this.state.detailEnabled === true &&
      (
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn >
              <b>Información del Reportante</b>
            </TableRowColumn>
            <TableRowColumn >
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               Nombre
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.nombe}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               Cédula
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.ci}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               Teléfono
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.telefono}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               Correo electrónico
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.email}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               <b>Detalles de la persona en situación de calle</b>
            </TableRowColumn>
            <TableRowColumn >
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              ¿La persona es hombre o mujer?
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.reporte.sexo}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
            ¿Cuál es su rango etario?
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.reporte.rangoEtario}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              ¿Alguna Dificultad?
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.reporte.dificultad}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              Describa la dificultad
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.reporte.dificultadDetail}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
               <b>Detalles de la alerta</b>
            </TableRowColumn>
            <TableRowColumn >
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              Tipo de atención
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.detalle.tipo}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
            ¿La persona está mojada/desabrigada?
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.detalle.mojada}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              ¿Se encuentra bajo protección?
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.detalle.protegido}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              <b>Ubicación de la persona</b>
            </TableRowColumn>
            <TableRowColumn >
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              Punto de referencia
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.localizacion.puntoDeReferencia}
            </TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn >
              Comentairo
            </TableRowColumn>
            <TableRowColumn >
              {this.state.detalleInfo.localizacion.comentario}
            </TableRowColumn>
          </TableRow>
        </TableBody>
      );
      return this.state.isLoading === true ? <div className="content"><CircularProgress color={blue500} size={100} thickness={7} /></div> : (
        <div>
          <GoogleMapsWrapper
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4p8aVVRafBkEim7ffpU_9OrEh_eHBPfc&v=3.32.1a&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '400px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            defaultZoom={15}
            center={this.state.location}>
            <MarkerClusterer
              averageCenter
              enableRetinaIcons
              gridSize={60}>
                <MarkerGoogle
                  position={this.state.current}
                  icon={{url:require('../assets/pin.png'),scaledSize:{width:30,height:30}, anchor: { x: 15, y: 15 }}}
                >
                </MarkerGoogle>
                {markers}
            </MarkerClusterer>
            {
              this.state.directionsEnabled === true &&
              <DirectionsRenderer directions={this.state.directions}></DirectionsRenderer>
            }
          </GoogleMapsWrapper>
          <br />
          <div style={{padding:20}}>
          {
            this.state.detailEnabled === true ?
            <Paper className="paperCanchas" zDepth={2}>
            <Toolbar>
                <ToolbarGroup>
                    <IconButton iconClassName="material-icons" style={{textAlign:'right',color:'#000'}} tooltip="Agregar" onClick={this.disableDetail}>arrow_back</IconButton>
                    <ToolbarTitle text={'Detalle de la Alerta'} style={{color:'#000'}} />
                </ToolbarGroup>
            </Toolbar>
            <Table responsive bodyStyle={{overflow:'visible'}}  selectable={false}>
                {detalleInfo}             
            </Table>
            <div><br /><br /></div>
            <RaisedButton label="Marcar como atendida" fullWidth={true} secondary={true} onClick={this.setAsAtendida}/>
          </Paper>
            :
            <Paper className="paperCanchas" zDepth={2}>
            <IconButton iconClassName="material-icons" tooltip="Mi Ubicación" onClick={()=>this.setState({location:this.state.current})}>person_pin_circle</IconButton>
            <Table responsive bodyStyle={{overflow:'visible'}}  selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn >Cédula</TableHeaderColumn>
                    <TableHeaderColumn >Nombre</TableHeaderColumn>
                    <TableHeaderColumn >Telefono</TableHeaderColumn>
                    <TableHeaderColumn >Correo</TableHeaderColumn>
                    <TableHeaderColumn >Ubicar</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {detalle}
              </TableBody>
            </Table>
          </Paper>
          }
           
          </div>
        </div>
      )
    } else return '';
  }
}


