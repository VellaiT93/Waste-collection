let VEHICLE_ID = 1;


/*** 
*  Creates a new vehicle DOM node
*  Creates a tooltip node attached to the vehicle
*  Creates a thumbnail node attached to the vehicle DOM
***/
export const setupVehicle = (coordX, coordY, capacity) => {

    // Vehicle node
    const vehicle = document.createElement('div');
    vehicle.classList.add('vehicle');
    vehicle.classList.add('passive');
    vehicle.setAttribute('id', 'vehicle_' + VEHICLE_ID++);
    vehicle.setAttribute('data-currentCapacity', '' + capacity);
    vehicle.setAttribute('data-totalCapacity', '' + capacity);
    vehicle.style.gridRowStart = coordX;
    vehicle.style.gridColumnStart = coordY;

    // Tooltip node
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.classList.add('vehicle-tooltip');
    tooltip.style.display = 'none';
    
    let tooltipContent = `
        <div>Vehicle ${vehicle.id.replace('vehicle_', '')}</div>
        <div id="total-capacity">Total capacity: ${vehicle.getAttribute('data-totalcapacity')}</div>
        <div id="current-capacity">Current capacity: ${vehicle.getAttribute('data-currentcapacity')}</div>
    `;

    // Thumbnail node
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    thumbnail.classList.add('vehicle-thumbnail');

    let thumbnailContent = `(${vehicle.getAttribute('data-currentcapacity')}/${vehicle.getAttribute('data-totalcapacity')})`;

    thumbnail.innerHTML = thumbnailContent;

    tooltip.innerHTML = tooltipContent;

    vehicle.appendChild(tooltip);
    vehicle.appendChild(thumbnail);

    return vehicle;

}


/***
*  Updates the capacity of a specific vehicle
***/
export const updateCapacity = (vehicle, amount, keyword) => {

    let result;

    // Check if update or restore
    if (keyword === 'update') {
        result = parseInt(vehicle.getAttribute('data-currentCapacity')) - amount;
    } else {
        result = parseInt(vehicle.getAttribute('data-currentCapacity')) + amount;
    }

    vehicle.setAttribute('data-currentCapacity', '' + result);

    let tooltipContent = `
        <div>Vehicle ${vehicle.id.replace('vehicle_', '')}</div>
        <div id="total-capacity">Total capacity: ${parseInt(vehicle.getAttribute('data-totalCapacity'))}</div>
        <div id="current-capacity">Current capacity: ${result}</div>
    `;

    let thumbnailContent = `(${vehicle.getAttribute('data-currentCapacity')}/${vehicle.getAttribute('data-totalCapacity')})`;

    vehicle.querySelector('.tooltip').innerHTML = tooltipContent;
    vehicle.querySelector('.thumbnail').innerHTML = thumbnailContent;

    document.getElementById(vehicle.id).querySelector('.tooltip').innerHTML = tooltipContent;
    document.getElementById(vehicle.id).querySelector('.thumbnail').innerHTML = thumbnailContent;

}


/***
*  Reset vehicle id at new game
***/
export const resetVehicleId = async() => {

    return new Promise((resolve) => {
        VEHICLE_ID = 1;

        setTimeout(() => {
            resolve();
        }, 30);
    });

}