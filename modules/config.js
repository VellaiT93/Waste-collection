import { setupCell } from './cell.js';
import { setupDemand, updateAmount } from './demand.js';
import { setupDepot } from './depot.js';
import { updateCapacity } from './vehicle.js';
import { setupSVG } from './svg.js';
import { 
    animatePath, incrementLineId, denoteLineId, 
    resetLineId, dragDemands, removeLine, collectedAnim 
} from './animation.js';
import { resetElements, resetShowHide, setInGame, toggleMenuButtons } from '../main.js';


/*** Global variables */
const backer = document.getElementById('backer');
const consoleContent = document.getElementById('console-content');
const showHide = document.getElementById('show-hide-button');
const ready = document.getElementById('ready-button');
const gameBoard = document.getElementById('canvas');
const winScreen = document.getElementById('win-screen');
const previousLvl = document.getElementById('previous-lvl');
const nextLvl = document.getElementById('next-lvl');

let selectedVehicle;
let currentX;
let currentY;
let targetX;
let targetY;
let lastX = [];
let lastY = [];

let currentLines = [];

let collectedTempDemand;
let collectedTempDemands = [];
let collectedDemands = [];
let collectedTempAmounts = [];

let isDemand = false;

let maxTransferValue;
let withCapacity = false;

let totalCost = 0;
let tempCost = 0;
let tempCosts = [];


let counter = 0;
let total;

let THRESHOLD_DEMAND = 0;
let THRESHOLD_DEPOT = 0;

let currentLevel;

let userLoggedIn = false;


let startDate;
let endDate;


/*** Calculate smallest route possible */
const calculateRoute = () => {

    let tempLines = [];
    let stalemate = false;
    let requestID;


    // Checking distance between vehicle and target demand @returns distance X and Y
    const checkDistance = (target, position) => {
        return target < position ? position - target : target - position;
    }

    return new Promise((resolve) => {

        // Setting best direction and appending the path
        const setPath = () => {

            if (checkDistance(targetX, currentX) > checkDistance(targetY, currentY) && !stalemate) {
                if (targetX < currentX) {
                    currentX--;
                } else {
                    currentX++;
                }
            } else if (checkDistance(targetY, currentY) > checkDistance(targetX, currentX) && !stalemate) {
                if (targetY < currentY) {
                    currentY--;
                } else {
                    currentY++;
                }
            } else {
                stalemate = true;

                if (targetX < currentX) {
                    currentX--;
                } else {
                    currentX++;
                }

                if (targetX === currentX) {
                    stalemate = false;
                }
            }

            // Temporarly save lines into array
            tempLines.push({currentX, currentY});

            // If target has been reached, otherwise request anim
            if (targetX === currentX && targetY === currentY) {
                cancelAnimationFrame(requestID);
                
                currentX = parseInt(targetX);
                currentY = parseInt(targetY);
                currentLines.push(tempLines);
                tempLines = [];
                incrementLineId();
    
                lastX.push(currentX);
                lastY.push(currentY);
    
                if (isDemand) {
                    let dataAmountResult;
                    let vehicleCapacity = parseInt(selectedVehicle.getAttribute('data-currentCapacity'));
                    let demandAmount = parseInt(collectedTempDemand.getAttribute('data-amount'));

                    if (withCapacity === true) {
                        if (demandAmount <= vehicleCapacity) {
                            dataAmountResult = demandAmount;
                            updateCapacity(selectedVehicle, demandAmount, 'update');
                        } else {
                            dataAmountResult = vehicleCapacity;
                            collectedTempDemand.classList.add('active');
                            updateCapacity(selectedVehicle, vehicleCapacity, 'update');
                        }
                    } else {
                        dataAmountResult = demandAmount;
                    }

                    updateAmount(collectedTempDemand, dataAmountResult, 'update');

                    collectedTempDemands.push(collectedTempDemand);
                    collectedTempAmounts.push(dataAmountResult);
                    
                    isDemand = false;
                }

                tempCost++;
                tempCosts.push(tempCost);
                document.getElementById('temp-cost').innerHTML = 'Temp cost: ' + tempCost;
    
                setTimeout(() => {
                    resolve();
                }, 5);
                
            } else {
                animatePath(currentX, currentY);

                tempCost++;
                document.getElementById('temp-cost').innerHTML = 'Temp cost: ' + tempCost;

                setTimeout(() => {
                    requestID = requestAnimationFrame(setPath);
                }, 30);
            }

        }

        requestID = requestAnimationFrame(setPath);

    });

}
/*** */


/*** Vehicle animation */
const moveVehicle = async(i, j, lastX, lastY) => {

    let requestID;

    selectedVehicle.querySelector('.thumbnail').style.display = 'none';
    selectedVehicle.querySelector('.tooltip').style.display = 'none';

    return new Promise((resolve) => {

        const routeVehicle = () => {
            
            if (currentLines[i][j].currentX === lastX && currentLines[i][j].currentY > lastY) {
                selectedVehicle.style.transform = 'rotate(0deg)';
            } else if (currentLines[i][j].currentX === lastX && currentLines[i][j].currentY < lastY) {
                selectedVehicle.style.transform = 'scaleX(-1)';
            } else if (currentLines[i][j].currentY === lastY && currentLines[i][j].currentX > lastX) {
                selectedVehicle.style.transform = 'rotate(90deg)';
            } else {
                selectedVehicle.style.transform = 'rotate(-90deg)';
            }

            if (j < currentLines[i].length) {
                selectedVehicle.style.gridRowStart = currentLines[i][j].currentX;
                selectedVehicle.style.gridColumnStart = currentLines[i][j].currentY;
                lastX = parseInt(selectedVehicle.style.gridRowStart);
                lastY = parseInt(selectedVehicle.style.gridColumnStart);

                appendToGameboard(selectedVehicle);

                j++;
                totalCost++;
                document.getElementById('total-cost').innerHTML = 'Total cost: ' + totalCost;
            }

            // Remove steps
            if (j !== currentLines[i].length) {
                let steps = document.getElementsByClassName('line');
                steps[0].remove();
            }

            // Remove demand and drag line (always first)
            if (j === currentLines[i].length) {
                if (collectedTempDemands.length) {
                    if (collectedTempDemands[0].getAttribute('data-amount') === '0') {
                        // Play collected anim and highlight effect
                        let effect = document.createElement('div');
                        effect.classList.add('collect-effect');
                        effect.style.gridRowStart = collectedTempDemands[0].style.gridRowStart;
                        effect.style.gridColumnStart = collectedTempDemands[0].style.gridColumnStart;

                        let highlight = document.createElement('div');
                        highlight.classList.add('collected-highlight');
                        highlight.style.gridRowStart = collectedTempDemands[0].style.gridRowStart;
                        highlight.style.gridColumnStart = collectedTempDemands[0].style.gridColumnStart;

                        let amount = 0;

                        if (collectedTempDemands[0].classList.contains('composition')) {
                            Array.from(document.getElementsByClassName('demand')).forEach(demand => {
                                if (demand.getAttribute('data-composition') === collectedTempDemands[0].id) {
                                    removeLine(parseInt(demand.id.replace('demand_', '')));
                                    amount += parseInt(demand.getAttribute('data-total-amount'));

                                    Array.from(document.getElementsByClassName('drag-line_' + demand.id.replace('demand_', ''))).forEach(line => {
                                        line.remove();
                                    });

                                    demand.remove();
                                    consoleContent.innerHTML += '> Demand ' + demand.id.replace('demand_', '') + ' collected \n';
                                }   
                            });

                            effect.innerHTML = '+ ' + amount;
                        } else {
                            if (parseInt(maxTransferValue) !== 0 && !collectedTempDemands[0].classList.contains('composition')) {
                                removeLine(parseInt(collectedTempDemands[0].id.replace('demand_', '')));

                                let id = collectedTempDemands[0].id.replace('demand_', '');

                                if (Array.from(document.getElementsByClassName('drag-line_' + id)).length > 0) {
                                    Array.from(document.getElementsByClassName('drag-line_' + id)).forEach(line => {
                                        line.remove();
                                    });
                                }
                            }

                            effect.innerHTML = '+ ' + collectedTempDemands[0].getAttribute('data-total-amount');

                            consoleContent.innerHTML += '> Demand ' + collectedTempDemands[0].id.replace('demand_', '') + ' collected.\n';
                        }

                        collectedAnim(effect, highlight);

                        // Add to array (to save)
                        collectedDemands.push(collectedTempDemands[0]);

                        // Remove demand (DOM and array elem)
                        document.getElementById(collectedTempDemands[0].id).remove();
                        collectedTempDemands.splice(collectedTempDemands[0], 1);
                    }
                }
                i++;
                j = 0;
            }
            
            if (i === currentLines.length) {
                cancelAnimationFrame(requestID);
                currentLines = [];
                collectedTempDemands = [];
                collectedTempAmounts = [];
                i = 0;
                resetLineId();
                selectedVehicle.remove();

                consoleContent.innerHTML += '> Vehicle ' + selectedVehicle.id.replace('vehicle_', '') + ' has been returned to the depot.\n';

                setTimeout(() => {
                    resolve();
                }, 30);
                
            } else {
                setTimeout(() => {
                    requestID = requestAnimationFrame(routeVehicle);
                }, 60);
            }

        }

        requestID = requestAnimationFrame(routeVehicle);

    });

}
/*** */


/*** Play --> Collect demands and design samllest route */
const play = () => {

    let demandsLeft = document.getElementsByClassName('demand active');
    let compositionsLeft = document.getElementsByClassName('demand active composition');
    let depotsLeft = document.getElementsByClassName('depot');

    Array.from(demandsLeft).forEach(demand => {
        let demandClone = demand.cloneNode(true);
        demand.parentNode.replaceChild(demandClone, demand);
    });

    Array.from(depotsLeft).forEach(depot => {
        let depotClone = depot.cloneNode(true);
        depot.parentNode.replaceChild(depotClone, depot);
    });

    Array.from(demandsLeft).forEach(demand => {
        demand.addEventListener('click', async() => {
            if (demand.classList.contains('active') && demand.getAttribute('data-amount') > '0') {
                if (withCapacity === true) {
                    // If capacity of chosen vehicle is 0 -> cancel
                    if (selectedVehicle.getAttribute('data-currentCapacity') === '0') {
                        alert("The vehicles capacity is full. Return the vehicle to the depot and come back with another one.");
                        return;
                    } 
                }

                collectedTempDemand = demand;
                demand.classList.remove('active');
                isDemand = true;

                targetX = parseInt(demand.style.gridRowStart);
                targetY = parseInt(demand.style.gridColumnStart);

                Array.from(demandsLeft).forEach(demand => {
                    let demandClone = demand.cloneNode(true);
                    demand.parentNode.replaceChild(demandClone, demand);
                });
                
                Array.from(depotsLeft).forEach(depot => {
                    let depotClone = depot.cloneNode(true);
                    depot.parentNode.replaceChild(depotClone, depot);
                });

                showHide.disabled = true;
                showHide.classList.add('not-allowed');

                backer.disabled = true;
                backer.classList.add('not-allowed');

                toggleMenuButtons('disable');

                await calculateRoute();
                play();

                showHide.disabled = false;
                showHide.classList.remove('not-allowed');

                backer.disabled = false;
                backer.classList.remove('not-allowed');

                toggleMenuButtons('enable');

            } else {
                alert("Demand has already been collected!");
            }
        });
    });

    Array.from(depotsLeft).forEach(depot => {
        depot.addEventListener('click', async function(e) {
            // Not to fire on garage click
            if (e.target !== this) return;

            // If capacity of current vehicle is 0 --> go to depot
            if (selectedVehicle.getAttribute('data-currentCapacity') === '0' || !demandsLeft.length || !compositionsLeft.length) {
                selectedVehicle.classList.add('active');
                selectedVehicle.classList.remove('passive');
                selectedVehicle.classList.remove('selected');
                selectedVehicle.firstChild.style.display = 'none';

                targetX = parseInt(depot.style.gridRowStart);
                targetY = parseInt(depot.style.gridColumnStart);

                Array.from(demandsLeft).forEach(demand => {
                    let demandClone = demand.cloneNode(true);
                    demand.parentNode.replaceChild(demandClone, demand);
                });

                Array.from(depotsLeft).forEach(depot => {
                    let depotClone = depot.cloneNode(true);
                    depot.parentNode.replaceChild(depotClone, depot);
                });

                showHide.disabled = true;
                showHide.classList.add('not-allowed');

                backer.disabled = true;
                backer.classList.add('not-allowed');

                toggleMenuButtons('disable');

                await calculateRoute();
                document.getElementById('selected-vehicle').querySelector('.vehicle').remove();
                document.getElementById('selected-vehicle').firstChild.style.display = 'none';
                await moveVehicle(0, 0, parseInt(selectedVehicle.style.gridRowStart), parseInt(selectedVehicle.style.gridColumnStart));

                showHide.disabled = false;
                showHide.classList.remove('not-allowed');

                backer.disabled = false;
                backer.classList.remove('not-allowed');

                toggleMenuButtons('enable');

                if (demandsLeft.length) {
                    chooseVehicle();
                } else {
                    backer.style.display = 'none';
                    finishLvl();
                }
            } else {
                alert("Vehicle has enough capacity to carry more before returning to the depot.");
            }
        });
    });

}
/***  */


/*** Select vehicle at begining and after returning to the depot (depends on number of vehicles) */
export const chooseVehicle = () => {

    let demandsLeft = document.getElementsByClassName('demand active');
    let vehiclesLeft = document.getElementsByClassName('vehicle');

    // Blend in back button with animation
    if (backer.style.display === 'none') {
        backer.style.display = 'block';

        backer.style.animationPlayState = 'running';
        backer.style.animationIterationCount = '2';
    }

    // Add event listener to available vehicle nodes --> choose vehicle
    Array.from(vehiclesLeft).forEach(vehicle => {
        vehicle.addEventListener('click', () => {
            selectedVehicle = vehicle;
            selectedVehicle.classList.add('selected');
            selectedVehicle.classList.remove('passive');

            currentX = parseInt(vehicle.style.gridRowStart);
            currentY = parseInt(vehicle.style.gridColumnStart);
            lastX.push(currentX);
            lastY.push(currentY);

            document.getElementById('selected-vehicle').firstChild.style.display = 'block';
            document.getElementById('selected-vehicle').appendChild(selectedVehicle);

            Array.from(vehiclesLeft).forEach(vehicle => {
                if (vehicle.id !== selectedVehicle.id) {
                    let vehicleClone = vehicle.cloneNode(true);
                    vehicle.parentNode.replaceChild(vehicleClone, vehicle);
                }
            });

            consoleContent.innerHTML += "> Chosen vehicle: Vehicle " + selectedVehicle.id.replace('vehicle_', '') + '\n';
            consoleContent.innerHTML += "> Play \n";

            play();
        });
    });

    Array.from(demandsLeft).forEach(demand => {
        demand.addEventListener('click', () => {
            alert("Select a vehicle!");
        });
    });

    consoleContent.innerHTML += "> Choose vehicle \n";

}
/***  */


/*** Returns the transfer distance of a dragged demand */
export const checkTransferDistance = (element, fixedX, fixedY) => {

    let elemX = parseInt(element.style.gridRowStart);
    let elemY = parseInt(element.style.gridColumnStart);

    let fixX = parseInt(fixedX);
    let fixY = parseInt(fixedY);

    let transfer = parseInt(maxTransferValue);

    let used;
    let left;

    let result;


    if (elemY !== fixY) {
        if (elemY < fixY) {
            used = fixY - elemY;
        } else {
            used = elemY - fixY;
        }
    } else if (elemX !== fixX) {
        if (elemX < fixX) {
            used = fixX - elemX;
        } else {
            used = elemX - fixX;
        }
    }

    left = transfer - used;

    if (((elemY >= fixY - used && elemY <= fixY + used) && (elemX >= fixX - left && elemX <= fixX + left)) || 
        ((elemX >= fixX - used && elemX <= fixX + used) && (elemY >= fixY - left && elemY <= fixY + left)) || 
        elemY === fixY && elemX === fixX) {
        result = true;
    } else {    
        result = false;
    }

    return result;

}
/***  */


/*** Finish timer */
const stopTimer = () => {

    endDate = new Date();
    
    let result = [];

    let miliseconds = Math.abs(endDate - startDate);
    
    let minutes = Math.floor(miliseconds / 60000);

    let seconds = ((miliseconds % 60000) / 1000).toFixed(0);

    result.push(minutes);
    result.push(seconds);
    result.push(miliseconds);

    return result;

}


/*** Setup gameboard */
export const setupGameboard = (rows, cols, gridRows, gridCols) => {
    // Setup cells
    for (let row = 1; row <= rows; row++) {
        for (let coll = 1; coll <= cols; coll++) {
            setupCell(row, coll, gridRows, gridCols);
        }
    }
}
/*** */


/*** Setup of levels */
export const setup = async(level, demandValue, depotValue, vehiclesValue, isCapacity, maxTransfer, lvlDescription) => {

    const activeCells = document.getElementsByClassName('cell');

    return new Promise(async(resolve) => {
        currentLevel = level;
        maxTransferValue = maxTransfer;

        isCapacity === 'yes' ? withCapacity = true : withCapacity = false;

        for (let i = 0; i < demandValue.amount; i++) {
            setupDemand(demandValue.demandCoords[i].x, demandValue.demandCoords[i].y, demandValue.demandAmounts[i]);
        }
    
        for (let j = 0; j < depotValue.amount; j++) {
            setupDepot(depotValue.depotCoords[j].x, depotValue.depotCoords[j].y, vehiclesValue.amount, vehiclesValue.vehicleCapacities);
        }
    
        Array.from(activeCells).forEach(cell => {
            cell.classList.remove('cell');
            let cellClone = cell.cloneNode(true);
            cell.parentNode.replaceChild(cellClone, cell);
        });

        if (previousLvl.style.display === 'none') {
            previousLvl.style.display = 'block';
        }
    
        if (nextLvl.style.display === 'none') {
            nextLvl.style.display = 'block';
        }    

        consoleContent.innerHTML += '> Welcome to ' + currentLevel + '\n';
        consoleContent.innerHTML += '> Number of demands: ' + demandValue.amount + '\n';
        consoleContent.innerHTML += '> Number of vehicles: ' + vehiclesValue.amount + '\n';
        
        if (maxTransferValue > 0) {
            consoleContent.innerHTML += '> Transfer value (drag) of demands: ' + maxTransferValue + '\n';
        } else {
            consoleContent.innerHTML += '> Demands are non draggable \n';
        }

        if (document.getElementById('logout-button')) {
            userLoggedIn = true;

            document.getElementById('logout-button').addEventListener('mouseover', () => {
                document.getElementById('logout-warn').style.display = 'block';
            });
            
            document.getElementById('logout-button').addEventListener('mouseleave', () => {
                document.getElementById('logout-warn').style.display = 'none';
            });
            
        } else {
            userLoggedIn = false;
        }
    
        if (parseInt(maxTransferValue) !== 0) {
            await setupSVG();
            dragDemands();
            ready.style.display = 'block';
            ready.disabled = true;
            ready.classList.add('not-allowed');
            consoleContent.innerHTML += '> Drag demands -> Click the ready button when ready \n';
        } else {
            chooseVehicle();
        }

        let description = document.createElement('div');
        description.setAttribute('id', 'level-description');

        let startLvl = document.createElement('button');
        startLvl.setAttribute('id', 'start-level');
        startLvl.innerHTML = 'Start';
        
        startLvl.addEventListener('click', () => {
            // Start the timer
            startDate = new Date();

            description.remove();

            ready.disabled = false;
            ready.classList.remove('not-allowed');
        });

        description.innerHTML = lvlDescription;

        appendToGameboard(description);

        description.appendChild(startLvl);

        setTimeout(() => {
            resolve();
        }, 30);
    });

}
/*** */


/*** Main setup function of the selected game type */
export const setupSelf = (demandValue, depotValue, vehiclesValue, isCapacity, maxTransfer, vehiclesCapacities) => {

    const activeCells = document.getElementsByClassName('cell');

    currentLevel = 'selfBuild';

    THRESHOLD_DEMAND = demandValue;
    THRESHOLD_DEPOT = depotValue;

    total = parseInt(THRESHOLD_DEMAND);
    total += parseInt(THRESHOLD_DEPOT);

    isCapacity === 'yes' ? withCapacity = true : withCapacity = false;

    maxTransferValue = maxTransfer;

    if (demandValue !== '' && depotValue !== '' && vehiclesValue !== '') {
        Array.from(activeCells).forEach(cell => {
            cell.addEventListener('click', async() => {
                if (THRESHOLD_DEMAND > 0) {
                    setupDemand(cell.style.gridRowStart, cell.style.gridColumnStart, 2);
                    THRESHOLD_DEMAND--;
                    counter++;

                    if (THRESHOLD_DEMAND === 0) {
                        consoleContent.innerHTML += "> Place Depot " + THRESHOLD_DEPOT + " depot(s) left \n";
                    } else {
                        consoleContent.innerHTML += "> Place Demand " + THRESHOLD_DEMAND + " demand(s) left \n";
                    }
                } else if (THRESHOLD_DEPOT > 0 && THRESHOLD_DEMAND === 0) {
                    setupDepot(cell.style.gridRowStart, cell.style.gridColumnStart, vehiclesValue, vehiclesCapacities);
                    
                    THRESHOLD_DEPOT--;
                    counter++;

                    if (counter === total) {

                        Array.from(activeCells).forEach(cell => {
                            cell.classList.remove('cell');
                            let cellClone = cell.cloneNode(true);
                            cell.parentNode.replaceChild(cellClone, cell);
                        });

                        if (parseInt(maxTransferValue) !== 0) {
                            await setupSVG();
                            dragDemands();
                            ready.style.display = 'block';
                            showHide.style.display = 'block';
                            consoleContent.innerHTML += '> Drag demands -> Click the ready button when ready \n';
                        } else {
                            chooseVehicle();
                        }

                        startDate = new Date();
                    }
                }
            });
        });

        consoleContent.innerHTML += '> Welcome to ' + currentLevel + '\n';
        consoleContent.innerHTML += '> Place Demand ' + THRESHOLD_DEMAND + ' demand(s) left \n';

    } else {
        alert("Provide a value"); 
        return;
    }

}
/*** */


/*** Finish level */
const finishLvl = () => {
    
    winScreen.style.display = 'block';
    showHide.style.display = 'none';

    if (userLoggedIn === false) {
        document.getElementById('login-popup').lastChild.remove();
    }

    if (userLoggedIn === true) {
        let logoutClone = document.getElementById('logout-button').cloneNode(true);
        document.getElementById('logout-button').parentNode.replaceChild(logoutClone, document.getElementById('logout-button'));
    }

    if (previousLvl.style.display === 'none') {
        previousLvl.style.display = 'block';
        nextLvl.style.display = 'block';
    }

    if (currentLevel === 'Level 1') {
        previousLvl.style.display = 'none';
    } else if (currentLevel === 'Level 4') {
        nextLvl.style.display = 'none';
    } else if (currentLevel === 'selfBuild') {
        previousLvl.style.display = 'none';
        nextLvl.style.display = 'none';
    }

    let cost = getTotalCost();
    let time = stopTimer();

    setInGame();
    resetShowHide();

    consoleContent.innerHTML += '> Congratulations! You have collected all demands and successfully returned the vehicle(s) to the depot. \n';

    // Checking if user is logged in
    // Checking if user exists in DB/if score is better
    // Replacing DB rows
    $.ajax({
        type: "GET", 
        url: "./login/check.php", 
        dataType: "json"
    }).done(function(result) {
        if (result[0] === true) {
            
            let level = currentLevel.replace('Level ', 'level');
            let userName = result[1];

            $.ajax({
                type: "GET", 
                url: "./login/checkScore.php", 
                dataType: "json", 
                data: { level: level, userName: userName }
            }).done(function(data) {

                let currentScore;

                if (data === null) {
                    currentScore = 'none';
                } else {
                    currentScore = data.score;
                }

                if (cost < currentScore || currentScore === 'none') {
                    $.ajax({
                        type: "POST", 
                        url: "./login/score.php", 
                        dataType: "json", 
                        data: { level: level, userName: userName, cost: cost, time: time[2], dbScore: currentScore }, 
                        success: function() { winScreen.children[2].innerHTML = 'You have a new personal record! \n'; }, 
                        error: function(data) { console.log('Error during query --> ' + data); }
                    });
                }

            });            
        } else {
            console.log("User is not logged in!");
        }

        winScreen.children[1].innerHTML = 'You have succesfully completed ' + currentLevel + '.';
        winScreen.children[3].innerHTML = 'Your total cost is ' + cost + '.';
        winScreen.children[4].innerHTML = 'Your total time is ' + time[0] + ' minutes and ' + time[1] + ' seconds.';

    });

}
/*** */


/***  */
const initiateLvl = async(level) => {

    gameBoard.innerHTML = '';
    document.getElementById('total-cost').innerHTML = 'Total cost: 0';
    document.getElementById('temp-cost').innerHTML = 'Temp cost: 0';

    await resetElements();

    document.getElementById('level-' + level).click();

}
/*** */


/*** Get total cost */
export const getTotalCost = () => {
    return totalCost;
}
/*** */


/*** Appends element to gameboard */
export const appendToGameboard = (element) => {
    gameBoard.appendChild(element);
}
/***  */


/*** Reset config global variables */
export const resetConfigElems = async() => {

    return new Promise((resolve) => {
        currentLines = [];
        lastX = [];
        lastY = [];

        collectedTempDemands = [];
        collectedDemands = [];
        collectedTempAmounts = [];

        totalCost = 0;
        tempCost = 0;
        tempCosts = [];

        counter = 0;
        total = 0;

        setTimeout(() => {
            resolve();
        }, 30);
    });

}
/*** */


/***  */
previousLvl.addEventListener('click', () => {
    let currentLvl = parseInt(currentLevel.replace('Level ', ''));
    let nextLvl = currentLvl - 1;
    initiateLvl(nextLvl);
});
/*** */

/***  */
nextLvl.addEventListener('click', () => {
    let currentLvl = parseInt(currentLevel.replace('Level ', ''));
    let nextLvl = currentLvl + 1;
    initiateLvl(nextLvl);
});
/*** */


/*** In game back button listener */

backer.addEventListener('click', () => {

    let id = currentLines.length;
    let lines = document.getElementsByClassName('line_' + id);

    if (currentLines.length > 0 && collectedTempDemands.length > 0) {
        // Removes last element from array (config - coordinates)
        currentLines.splice(-1, 1);

        // Remove line DOM if there is any
        if (Array.from(lines).length > 0) {
            Array.from(lines).forEach(line => {
                line.remove();
            });
        }

        // Denote id by 1
        denoteLineId();
        
        // Restore missing amount of capacity to vehicle (if with capacity)
        if (withCapacity === true) {
            updateCapacity(selectedVehicle, collectedTempAmounts[collectedTempAmounts.length - 1], 'restore');
        }

        let id = document.getElementById(collectedTempDemands[collectedTempDemands.length - 1].id);

        updateAmount(id, collectedTempAmounts[collectedTempAmounts.length - 1], 'restore');
        collectedTempDemands[collectedTempDemands.length - 1].classList.add('active');
        collectedTempAmounts.splice(-1, 1);
        collectedTempDemands.splice(-1, 1);

        // Reset path to previous point
        currentX = lastX[lastX.length - 2];
        currentY = lastY[lastY.length - 2];
 
        // Denote last
        lastX.splice(-1, 1);
        lastY.splice(-1, 1);

        // Remove temp cost
        tempCosts.length > 1 ? tempCost = parseInt(tempCosts[tempCosts.length - 2]) : tempCost = 0;
        tempCosts.splice(-1, 1);
        document.getElementById('temp-cost').innerHTML = 'Temp cost: ' + tempCost;

        consoleContent.innerHTML += "> Current path has been removed \n";
        
    } else {
        consoleContent.innerHTML += "> Nothing to undo \n";
    }
    
});

/*** */