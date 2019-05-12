require('../scss/main.scss');
require('../../node_modules/leaflet-rotatedmarker/leaflet.rotatedMarker.js');
 
// import Chart from 'chart.js';
 
//Variables globale
const map = L.map('mapid').setView([47.115, 2.548828], 6);
const monSelect = document.querySelector('#country');
const myLoader = document.querySelector('.loader');
 
let markers = {};
let allCountry = [];
let markersLayer;
let stateValue;
let data;
let selectedCountry;
let chrono;
let countPlanesOnFly = 0;
let listCountPlane = new Array();
let myChart = null;
let listTimePlane = new Array();
let selectValue = 0;
let ctx = document.getElementById("graphique1");
 
L.tileLayer('https://api.mapbox.com/styles/v1/geoffroycarette/cjqxkkqxb15fm2rlqvssrl8r6/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2VvZmZyb3ljYXJldHRlIiwiYSI6ImNqcXh1c20ycTBiZm80M2tlMnBlazFsc3QifQ.Nj35s8pJZFDudfEJGWHpDA'
}).addTo(map);
 
function updateData() {
    fetch("/json")
        .then((response) => response.json()
            .then((json) => {
                data = json.states;
                listCountry();
                flyingPlanes();
            })
        );
}
 
function listCountry() {
    if (allCountry.length === 0) {
        // Pour chaques donnée du JSON
        data.forEach((element) => {
            if (element[2].length > 0) {
                // Ajoute les pays au array
                allCountry.push(element[2]);
            }
        });
        createListDeroulante(allCountry);
        displaySelect();
    }
 
}
 
function createListDeroulante(allCountry) {
    let uniq = [...new Set(allCountry)];
    allCountry = uniq;
    allCountry.sort();
    let select = document.querySelector('#country');
    allCountry.forEach((element) => {
        select.options[select.options.length] = new Option(element, element);
    });
}
 
function displaySelect() {
    monSelect.style.opacity = '1';
    myLoader.style.opacity = '0';
    setTimeout(function () {
        myLoader.style.display = 'none';
    }, 50);
}
 
 
function filtreCountry() {
    return data.filter((state) => {
        return (state[2] === stateValue) && (state[5]) && (state[6]);
    });
}
 
 
function showMarker() {
 
    markersLayer = new L.LayerGroup();
 
    selectedCountry.forEach((state) => {
        markers[state[0]] = L.marker([state[6], state[5]], {
            lat: state[6],
            lng: state[5],
            icao24: state[0],
            numAvion: state[1],
            pays: state[2],
            icao24: state[0],
            altitude: Math.round(state[7]),
            vitesse: Math.round(state[9] * 3.6),
            rotationAngle: Math.round(state[10])
        });
 
        markers[state[0]].addTo(markersLayer).on('click', markerOnClick);
    });
 
 
    map.addLayer(markersLayer);
}
 
 
function deplacePlane() {
    updateData();
    drawMap();
}
 
 
function drawMap() {
    if (typeof (markersLayer) === "object") {
        map.removeLayer(markersLayer);
    }
    map.closePopup();
    selectedCountry = filtreCountry();
    showMarker();
 
}
 
function markerOnClick(e) {
    var popup = L.popup()
        .setLatLng([e.target.options.lat, e.target.options.lng])
        .setContent("<b>Numéro d'avion : </b>" + e.target.options.numAvion + "<br/>" +
            "<b>Pays d'origine : </b>" + e.target.options.pays + "<br/>" +
            "<b>Latitude : </b>" + e.target.options.lat + "<b> Longitude : </b>" + e.target.options.lng + "<br/>" +
            "<b>Altitude : </b>" + e.target.options.altitude + " m <br/>" +
            "<b>Vitesse : </b>" + e.target.options.vitesse + " km/h <br/>")
        .openOn(map);
};
 
 
function initApplication() {
    updateData();
    chrono = setInterval(deplacePlane, 16000);
}
 
 
/******* Apres chargement page  */
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
       
        initApplication();
 
        monSelect.addEventListener('change', () => {
 
            clearInterval(chrono);
            stateValue = monSelect.value;
            listCountPlane = [];
            listTimePlane = [];
            myChart.destroy();
            myChart = null;
            ctx.innerHTML = '';
            flyingPlanes();
            drawMap();
           
           
            map.flyTo([47.115, 2.548828], 3);
            chrono = setInterval(deplacePlane, 16000);
           
           
        })
    }
}
 
function flyingPlanes() {
 
    countPlanesOnFly = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][8] != true && monSelect.value == 'Tous les pays') {
            countPlanesOnFly++
        } else if (data[i][8] != true && data[i][2] === stateValue) {
            countPlanesOnFly++
        }
    }
 
   
    date = new Date();
    let time = date.toLocaleTimeString();
   
    if (listTimePlane.length < 10) {
        listTimePlane.push(time);
    } else {
        listTimePlane.shift();
        listTimePlane.push(time);
    }
 
    if (listCountPlane.length < 10) {
        listCountPlane.push(countPlanesOnFly);
    } else {
        listCountPlane.shift();
        listCountPlane.push(countPlanesOnFly);
    }
   
    loadGraph();
 
   
}
 
 
 
 
// fonctions pictograme et fenetre information
 
const picto = document.querySelector('.picto');
const myWindow = document.querySelector('#window');
const croix = document.querySelector('.croix');
const logo = document.querySelector('.logo');
picto.addEventListener('click', function () {
 
 
    if (selectValue == 0) {
        myWindow.style.display = 'block';
        monSelect.style.display = 'none';
        selectValue = 1;
    } else if (selectValue == 1) {
        myWindow.style.display = 'none';
        monSelect.style.display = 'block';
        selectValue = 0;
    }
})
 
 
croix.addEventListener('click', function () {
    myWindow.style.display = 'none';
    monSelect.style.display = 'block';
    selectValue = 0;
})
 
//Refresh de la map en cliquant sur le logo
logo.addEventListener('click', function () {
    clearInterval(chrono);
    monSelect.value = 'Tous les pays';
    stateValue = 0;
    map.removeLayer(markersLayer);
    selectedCountry=[];
    listCountPlane = [];
    listTimePlane = [];
    myChart.destroy();
    myChart = null;
    ctx.innerHTML = '';
    flyingPlanes();
    chrono = setInterval(deplacePlane, 16000);
})
 
function loadGraph() {
 
    if (myChart === null) {        
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: listTimePlane,
                datasets: [{
                    label: 'Nombre d\'avions',
                    data: listCountPlane,
                    backgroundColor: [
                        'rgba(0, 0, 0, 0)'
                    ],
                    borderColor: [
                        'rgba(9, 132, 227,1.0)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Heure (mis à jour toutes les 16 secondes)'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Nombre d\'avions'
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Nombre d\'avions en vol en temps réel (' + monSelect.value + ')'
                }
            }
        });
    } else {
       
        myChart.data.datasets.data = listCountPlane;
        myChart.data.labels = listTimePlane;
        myChart.options.title.text = 'Nombre d\'avions en vol en temps réel (' + monSelect.value + ')';
        myChart.update();
 
 
       
    }
 
}