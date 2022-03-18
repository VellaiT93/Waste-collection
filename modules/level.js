let dimension = {
    row: {}, col: {}
};

let depot = {
    amount: {}, 
    depotCoords: []
};

let demand = {
    amount: {}, 
    demandCoords: [], 
    demandAmounts: []
};

let vehicle = {
    amount: {}, 
    vehicleCapacities: []
};

let capacity;
let transfer;

let description;

let level;
let options = {};


const Level_1 = () => {

    dimension.row = 21;
    dimension.col = 21;

    demand.amount = 4;
    let lvlDemandCoords = [{x: 5, y: 15}, {x: 11, y: 19}, {x: 8, y: 12}, {x: 14, y: 18}];
    let lvlAmounts = [2, 2, 2, 2];
    for (let j = 0; j < demand.amount; j++) {
        demand.demandCoords.push(lvlDemandCoords[j]);
        demand.demandAmounts.push(lvlAmounts[j]);
    }

    depot.amount = 1;
    let lvlDepotCoords = [{x: 6, y: 4}];
    for (let i = 0; i < depot.amount; i++) {
        depot.depotCoords.push(lvlDepotCoords[i]);
    }

    vehicle.amount = 1;
    let lvlCapacities = '&infin';
    for (let j = 0; j < vehicle.amount; j++) {
        vehicle.vehicleCapacities.push(lvlCapacities[j]);
    }
    
    capacity = 'no';
    transfer = 0;

    description = `
        <div id="lvl-description">
            <div>
                Welcome to Level 1 !
                This first level allows you to get familiar with collecting the waste. 
                Your objective is to collect all the waste bags with the shortest possible tour. 
                After clicking Start, the timer starts!
            </div>
        </div>
    `;

    options = {dimension, depot, demand, vehicle, capacity, transfer, description};

    return options;

}


const Level_2 = () => {

    dimension.row = 21;
    dimension.col = 21;

    demand.amount = 4;
    let lvlDemandCoords = [{x: 5, y: 8}, {x: 16, y: 13}, {x: 6, y: 12}, {x: 14, y: 4}];
    let lvlAmounts = [2, 2, 2, 2];
    for (let j = 0; j < demand.amount; j++) {
        demand.demandCoords.push(lvlDemandCoords[j]);
        demand.demandAmounts.push(lvlAmounts[j]);
    }

    depot.amount = 1;
    let lvlDepotCoords = [{x: 6, y: 4}];
    for (let i = 0; i < depot.amount; i++) {
        depot.depotCoords.push(lvlDepotCoords[i]);
    }

    vehicle.amount = 2;
    let lvlCapacities = [4, 4];
    for (let j = 0; j < vehicle.amount; j++) {
        vehicle.vehicleCapacities.push(lvlCapacities[j]);
    }
    
    capacity = 'yes';
    transfer = 0;

    description = `
        <div id="lvl-description">
            <div>
                Welcome to Level 2 !
                In this level you need two vehicles to collect all the waste. 
                The objective is again to collect all the waste bags with the shortest possible tours. 
                After clicking Start, the timer starts!  
            </div>
        </div>
    `;

    options = {dimension, depot, demand, vehicle, capacity, transfer, description};

    return options;

}

const Level_3 = () => {

    dimension.row = 26;
    dimension.col = 26;

    demand.amount = 6;
    let lvlDemandCoords = [{x: 8, y: 16}, {x: 5, y: 13}, {x: 14, y: 18}, {x: 18, y: 13}, {x: 9, y: 18}, {x: 14, y: 15}];
    let lvlAmounts = [2, 2, 2, 2, 2, 2];
    for (let j = 0; j < demand.amount; j++) {
        demand.demandCoords.push(lvlDemandCoords[j]);
        demand.demandAmounts.push(lvlAmounts[j]);
    }

    depot.amount = 1;
    let lvlDepotCoords = [{x:11, y: 4}];
    for (let i = 0; i < depot.amount; i++) {
        depot.depotCoords.push(lvlDepotCoords[i]);
    }

    vehicle.amount = 2;
    let lvlCapacities = [8, 4];
    for (let j = 0; j < vehicle.amount; j++) {
        vehicle.vehicleCapacities.push(lvlCapacities[j]);
    }
    
    capacity = 'yes';
    transfer = 5;

    description = `
        <div id="lvl-description">
            <div>
                Welcome to Level 3! 
                You can now move the waste bags together to the same location in order to place a container there. 
                To drag a waste bag, click on it and move it to an allowed location (in green). 
                If allowed, waste bags can be moved to an empty point in the grid, together with another waste bag or where a container has been placed. 
                This can always be undone to try other possibilities. 
                Note that the same container might be visited by different vehicles until all its waste is collected. Once you are done, click Ready in the Console to collect the containers. 
                The goal is to visit all the containers with the shortest (distance + number of stops) tour.
                After clicking Start, the timer starts !
            </div>
        </div>
    `;

    options = {dimension, depot, demand, vehicle, capacity, transfer, description};

    return options;

}


const Level_4 = () => {

    dimension.row = 38;
    dimension.col = 38;

    demand.amount = 10;
    let lvlDemandCoords = [{x: 5, y: 24}, {x: 26, y: 24}, {x: 20, y: 23}, {x: 11, y: 23}, {x: 6, y: 14}, {x: 5, y: 21}, {x: 4, y: 16}, {x: 18, y: 19}, {x: 28, y: 8}, {x: 25, y: 15}];
    let lvlAmounts = [3, 1, 2, 3, 2, 5, 3, 4, 3, 4];
    for (let j = 0; j < demand.amount; j++) {
        demand.demandCoords.push(lvlDemandCoords[j]);
        demand.demandAmounts.push(lvlAmounts[j]);
    }

    depot.amount = 1;
    let lvlDepotCoords = [{x:11, y: 4}];
    for (let i = 0; i < depot.amount; i++) {
        depot.depotCoords.push(lvlDepotCoords[i]);
    }

    vehicle.amount = 3;
    let lvlCapacities = [10, 10, 10];
    for (let j = 0; j < vehicle.amount; j++) {
        vehicle.vehicleCapacities.push(lvlCapacities[j]);
    }

    capacity = 'yes';
    transfer = 8;

    description = `
        <div id="lvl-description">
            <div>
                Welcome to Level 4 ! 
                All the features presented in the previous levels are included in this level game. 
                Your objective is to collect all the waste at the minimum cost. 
                The cost is calculated with the distance travelled by the vehicles and the number of stops they performed. 
                After clicking Start, the timer starts !  
            </div>
        </div>
    `;

    options = {dimension, depot, demand, vehicle, capacity, transfer, description};

    return options;

}


export const getLevelInit = (lvl) => {

    if (lvl === 'Level 1') {
        level = Level_1();
    } else if (lvl === 'Level 2') {
        level = Level_2();
    } else if (lvl === 'Level 3') {
        level = Level_3();
    } else {
        level = Level_4();
    }

    return level;

}


export const resetLvlElems = async() => {

    return new Promise((resolve) => {
        demand.demandCoords = [];
        demand.demandAmounts = [];
        depot.depotCoords = [];
        vehicle.vehicleCapacities = [];
        description = '';

        setTimeout(() => {
            resolve();
        }, 30);
    });
}