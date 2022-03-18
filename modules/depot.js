import { setupVehicle } from './vehicle.js';


const gameBoard = document.getElementById('canvas');

let DEPOT_ID = 1;


/*** 
*  Creates a new depot DOM node
*  Creates a tooltip node attached to the depot DOM as garage
*  The garage is filled with vehicles according to the level
***/
export const setupDepot = (coordX, coordY, vehiclesValue, capacity) => {

    const cellWidth = gameBoard.firstChild.clientWidth;
    const cellHeight = gameBoard.firstChild.clientHeight;
    const marginTooltip = cellHeight + 'px';
    const marginThumbnail = cellHeight * -1.5 + 'px';
    const marginLeftVehicle = 1.3 * cellWidth + 'px';
    const marginTopVehicle = -2 * cellHeight + 'px';

    // Depot node
    const depot = document.createElement('div');
    depot.classList.add('depot');
    depot.setAttribute('id', 'depot_' + DEPOT_ID++);
    depot.style.gridRowStart = coordX;
    depot.style.gridColumnStart = coordY;

    // Tooltip node
    let garage = document.createElement('div');
    garage.classList.add('tooltip');
    garage.setAttribute('id', 'garage');
    garage.style.marginTop = marginTooltip;

    // Thumbnail node
    let thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    thumbnail.style.marginTop = marginThumbnail;

    // Selected vehicle node
    let selectedVehicle = document.createElement('div');
    selectedVehicle.setAttribute('id', 'selected-vehicle');
    selectedVehicle.style.marginLeft = marginLeftVehicle;
    selectedVehicle.style.marginTop = marginTopVehicle;

    let title = document.createElement('div');
    title.innerHTML = 'Selected vehicle';
    title.style.display = 'none';

    let thumbnailContent = 'Depot';
    thumbnail.innerHTML = thumbnailContent;


    selectedVehicle.appendChild(title);

    depot.appendChild(garage);
    depot.appendChild(thumbnail);
    depot.appendChild(selectedVehicle);
    gameBoard.appendChild(depot);

    setupGarage(coordX, coordY, garage, vehiclesValue, capacity);
    
}


/*** 
* Setup depots garage 
***/
const setupGarage = (coordX, coordY, garage, numVehicles, capacity) => {

    let title = '<div>Garage: </div>';
    garage.innerHTML = title;

    if (!capacity.length) {
        for (let i = 0; i < numVehicles; i++) {
            capacity.push('&');
        }
    }

    for (let j = 0; j < numVehicles; j++) {
        garage.appendChild(setupVehicle(coordX, coordY, capacity[0]));
        capacity.splice(0, 1);
    }

}


/***
*  Reset depot id at new game
***/
export const resetDepotId = async() => {

    return new Promise((resolve) => {
        DEPOT_ID = 1;

        setTimeout(() => {
            resolve();
        }, 30);
    });

}