/*** ******************************************************** ***
 * 																*
 * 					 Author: Tibor Vellai                       *
 *       Web based waste collection game (main js file)         *
 *         Master thesis University of Fribourg 2021  	        *
 * 																*
 *** ******************************************************* ***/

/*** Imports (Modules) */
import { setup, setupSelf, setupGameboard, resetConfigElems } from './modules/config.js';
import { getLevelInit, resetLvlElems } from './modules/level.js';
import { resetDemandId } from './modules/demand.js';
import { resetDrag, resetLineId } from './modules/animation.js';
import { resetDepotId } from './modules/depot.js';
import { resetVehicleId } from './modules/vehicle.js';


/*** Global variables ***/
const root = document.querySelector(':root'); // --> CSS vars
const header = document.getElementById('header');
const home = document.getElementById('home');
const homepage = document.getElementById('homepage');
const loginButton = document.getElementById('login-button');
const loginPopup = document.getElementById('login-popup');
const register = document.getElementById('register');
const registerPopup = document.getElementById('register-popup');
const registerClose = document.getElementById('register-close');
const backer = document.getElementById('backer');
const menuButtons = document.getElementsByClassName('menu-button');
const levels = document.getElementsByClassName('level');
const ranks = document.getElementsByClassName('rank');
const description = document.getElementById('description');
const descriptionDiv = document.getElementById('description-div');
const descriptionClose = document.getElementById('description-close');
const gameConsole = document.getElementById('console');
const consoleToggle = document.getElementById('console-toggle');
const showHide = document.getElementById('show-hide-button');
const ready = document.getElementById('ready-button');
const loader = document.getElementById('loader');
const alert = document.getElementById('game-alert');
const alertYes = document.getElementById('game-alert-yes');
const alertNo = document.getElementById('game-alert-no');
const winScreen = document.getElementById('win-screen');
const gameBoard = document.getElementById('canvas');


const passwordLoginInput = document.forms['Login']['pwd'];
const passwordRegisterInput = document.forms['Register']['pwd'];
const passwordRepeatInput = document.forms['Register']['pwdRepeat'];

const passwordShowLogin = document.forms['Login']['login-show'];
const passwordHideLogin = document.forms['Login']['login-hide'];
const passwordShowRegister = document.forms['Register']['register-show'];
const passwordHideRegister = document.forms['Register']['register-hide'];
const passwordShowRepeat = document.forms['Register']['repeat-show'];
const passwordHideRepeat = document.forms['Register']['repeat-hide'];


let rowValue;
let collValue;
let gridRows;
let gridCols;

let demandValue;
let depotValue;
let vehiclesValue;
let capacityValue;
let vehiclesCapacities = [];

let maxTransferValue;

let currentLvlData;
let currentLevel;

var inGame = false;

let dropdownContent;
let open = false;
let margTop = header.clientHeight + (header.clientHeight * 0.03);

let level;
let levelDescription;


/*** Closing menu after selecting level */
const closeMenu = async() => {
    
    return new Promise((resolve) => {

        dropdownContent.style.display = 'none';

        setTimeout(() => {
            resolve();
        }, 30);
    });

}
/*** */


/*** Inits level elements and calls gameboard setup */
const init = async(level) => {

    return new Promise((resolve) => {

        if (winScreen.style.display === 'block') {
            winScreen.style.display = 'none';
        }

        homepage.style.display = 'none';

        if (level === 'selfBuild') {

            rowValue = document.getElementById('numberOfRows').value;
            collValue = document.getElementById('numberOfColls').value;
            demandValue = document.getElementById('numberOfDemand').value;
            depotValue = 1;
            vehiclesValue = document.getElementById('numberOfVehicles').value;
            capacityValue = document.getElementsByName('choice');
            maxTransferValue = document.getElementById('transfer-distance-options').value;

            if (rowValue > 60) {
                rowValue = 60;
            }

            if (collValue > 60) {
                collValue = 60;
            }

            if (demandValue > 20) {
                demandValue = 20;
            }

            if (vehiclesValue > 5) {
                vehiclesValue = 5;
            }

            for (let i = 0; i < capacityValue.length; i++) {
                if (capacityValue[i].checked) {
                    capacityValue = capacityValue[i].value;

                    Array.from(document.getElementsByClassName('vehicle-select')).forEach((elem) => {
                        vehiclesCapacities.push(elem.value);
                    });
                }
            }
            
        } else {

            currentLvlData = getLevelInit(level);

            rowValue = currentLvlData.dimension.row;
            collValue = currentLvlData.dimension.col;
            demandValue = currentLvlData.demand;
            depotValue = currentLvlData.depot;
            vehiclesValue = currentLvlData.vehicle;
            capacityValue = currentLvlData.capacity;
            maxTransferValue = currentLvlData.transfer;

            levelDescription = currentLvlData.description;

        }

        root.style.setProperty('--grid-row-amount', rowValue);
        root.style.setProperty('--grid-column-amount', collValue);
        gridRows = getComputedStyle(root).getPropertyValue('--grid-row-amount');
        gridCols = getComputedStyle(root).getPropertyValue('--grid-column-amount');

        setupGameboard(rowValue, collValue, gridRows, gridCols);
        
        setTimeout(() => {
            resolve();
        }, 30);
    });

}
/*** */


/*** Get ranking table */
const getRanking = (lvl) => {

    level = lvl.innerHTML.replace('Level ', 'level');
    
    let resultTable = `<div>
        <div id="rank-title">Current ranking of ${lvl.innerHTML}</div>
        <table id="rank-table">
        <tr>
            <th>Rank</th>
            <th>Id</th>
            <th>Username</th>
            <th>Cost</th>
            <th>Name</th>
        </tr>
    `;

    $.ajax({
        type: "GET", 
        url: "./login/ranking.php", 
        dataType: "json", 
        data: { level: level }, 
        success: function(data) {

            // Sort by score ascending
            let result = data.sort((a, b) => {
                return a.score - b.score;
            });

            for (let i = 0; i < result.length; i++) {
                resultTable += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${result[i].userId}</td>
                        <td>${result[i].userUid}</td>
                        <td>${result[i].score}</td>
                        <td>${result[i].userName}</td>
                    </tr>
                `;
            }

            resultTable += `</table></div>`;
            gameBoard.innerHTML = resultTable;

        }, 
        error: function() {
            resultTable += `DB is empty.`;
            resultTable += `</table></div>`;
            gameBoard.innerHTML = resultTable;
        }
    });

}
/*** */


/*** Reset function */
export const resetElements = () => {

    return new Promise(async(resolve) => {

        backer.style.display = 'none';
        showHide.style.display = 'none';
        gameConsole.querySelector('#console-content').innerHTML = '';

        await resetConfigElems();
        await resetDrag();
        await resetDepotId();
        await resetVehicleId();
        await resetDemandId();
        await resetLineId();

        setTimeout(() => {
            resolve();
        }, 30);        
    });

}
/*** */


/*** */
export const setInGame = () => {
    inGame = false;
}
/*** */


/*** Switch text show/hide */
const setText = (input) => {
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}
/*** */


/*** Toggle menu buttons */
export const toggleMenuButtons = (keyword) => {

    Array.from(menuButtons).forEach(button => {
        if (keyword === 'enable') {
            button.disabled = false;
            button.classList.remove('not-allowed');
        } else {
            button.disabled = true;
            button.classList.add('not-allowed');
        }
    });

}


/*** Reset show hide after level finish */
export const resetShowHide = () => {
    
    if (open === true) {
        open = false;
        document.getElementById('show-hide-button').innerHTML = 'Show details';
    }

}


// Close if one is open
Array.from(menuButtons).forEach(button => {

    button.addEventListener('click', () => {
        Array.from(menuButtons).forEach(elem => {
            if (elem.parentElement.querySelector('.dropdown-content')) {
                elem.parentElement.querySelector('.dropdown-content').style.display = 'none';
            }
        });

        if (button.parentElement.querySelector('.dropdown-content')) {
            button.parentElement.querySelector('.dropdown-content').style.display = 'block';
        }
    });

});


/*** Listeners */


// Homepage
home.addEventListener('click', () => {

    currentLevel = 'homepage';

    if (inGame === true) {
        alert.style.display = 'block';
    } else {
        document.getElementById('total-cost').innerHTML = 'Total cost: 0';
        document.getElementById('temp-cost').innerHTML = 'Current cost: 0';
        root.style.setProperty('--grid-row-amount', '0');
        root.style.setProperty('--grid-column-amount', '0');
        gameBoard.innerHTML = '';
        homepage.style.display = 'block';

        gameConsole.classList.remove('console-active');

        if (winScreen.style.display === 'block') {
            winScreen.style.display = 'none';
        }
    }
});


// Levels
Array.from(levels).forEach((level) => {

    level.addEventListener('click', async() => {

        currentLevel = level.innerHTML;
        dropdownContent = document.getElementById('dropdown-content-1');
        
        if (inGame === true) {
            await closeMenu();
            alert.style.display = 'block';
        } else {
            loader.style.display = 'block';
            gameBoard.innerHTML = '';
            inGame = true;
            document.getElementById('total-cost').innerHTML = 'Total cost: 0';
            document.getElementById('temp-cost').innerHTML = 'Current cost: 0';
            await closeMenu();
            await resetElements();
            await init(currentLevel);
            await setup(currentLevel, demandValue, depotValue, vehiclesValue, capacityValue, maxTransferValue, levelDescription);
            await resetLvlElems();
            loader.style.display = 'none';
            showHide.style.display = 'block';
        }
    });

});


// OK 2 (self builder)
document.getElementById('dropdown-2-ok').addEventListener('click', async() => {

    currentLevel = 'selfBuild';
    dropdownContent = document.getElementById('dropdown-content-2');
    
    if (inGame === true) {
        await closeMenu();
        alert.style.display = 'block';
    } else {
        loader.style.display = 'block';
        gameBoard.innerHTML = '';
        inGame = true;
        document.getElementById('total-cost').innerHTML = 'Total cost: 0';
        document.getElementById('temp-cost').innerHTML = 'Current cost: 0';
        await closeMenu();
        await resetElements();
        await init(currentLevel);
        loader.style.display = 'none';
        setupSelf(demandValue, depotValue, vehiclesValue, capacityValue, maxTransferValue, vehiclesCapacities);
    }

});


// Ranks
Array.from(ranks).forEach((rank) => {

    rank.addEventListener('click', async() => {
        dropdownContent = document.getElementById('dropdown-content-3');
        currentLevel = 'ranking';

        if (inGame === true) {
            level = rank;
            await closeMenu();
            alert.style.display = 'block';
        } else {
            await closeMenu();

            if (winScreen.style.display === 'block') {
                winScreen.style.display = 'none';
            }

            gameBoard.innerHTML = '';
    
            root.style.setProperty('--grid-row-amount', '0');
            root.style.setProperty('--grid-column-amount', '0');

            homepage.style.display = 'none';
            
            getRanking(rank);
        }
    })

});


// Description
description.addEventListener('click', () => {

    if (!descriptionDiv.classList.contains('open')) {
        descriptionDiv.classList.add('open');
        description.style.backgroundColor = 'rgba(0,0,0,0.3)';
        description.style.color = '#ffffff';

        showHide.disabled = true;
        showHide.classList.add('not-allowed');

        if (ready) {
            ready.disabled = true;
            ready.classList.add('not-allowed');
        }

        if (backer) {
            backer.disabled = true;
            backer.classList.add('not-allowed');
        }
    } else {
        descriptionDiv.classList.remove('open');
        description.style.backgroundColor = '#ffffff';
        description.style.color = 'grey';

        showHide.disabled = false;
        showHide.classList.remove('not-allowed');

        if (ready) {
            ready.disabled = false;
            ready.classList.remove('not-allowed');
        }

        if (backer) {
            backer.disabled = false;
            backer.classList.remove('not-allowed');
        }
    }

});


// Description close
descriptionClose.addEventListener('click', () => {

    descriptionDiv.classList.remove('open');
    description.style.backgroundColor = '#ffffff';
    description.style.color = 'grey';

    showHide.disabled = false;
    showHide.classList.remove('not-allowed');

    if (ready) {
        ready.disabled = false;
        ready.classList.remove('not-allowed');
    }

    if (backer) {
        backer.disabled = false;
        backer.classList.remove('not-allowed');
    }

});


// Yes
if (alertYes) {
    alertYes.addEventListener('click', async() => {

        alert.style.display = 'none';
        backer.style.display = 'none';
        showHide.style.display = 'none';
        loader.style.display = 'block';
        gameConsole.querySelector('#console-content').innerHTML = '';
        
        document.getElementById('total-cost').innerHTML = 'Total cost: 0';
        document.getElementById('temp-cost').innerHTML = 'Temp cost: 0';

        if (ready.style.display === 'block') {
            ready.style.display = 'none';
        }

        if (currentLevel === 'selfBuild') {
            gameBoard.innerHTML = '';
            await resetElements();
            await init(currentLevel);
            loader.style.display = 'none';
            setupSelf(demandValue, depotValue, vehiclesValue, capacityValue, maxTransferValue, vehiclesCapacities);
        } else if (currentLevel === 'ranking' || currentLevel === 'homepage') {
            root.style.setProperty('--grid-row-amount', '0');
            root.style.setProperty('--grid-column-amount', '0');

            if (document.getElementById('logout-button')) {
                let logoutClone = document.getElementById('logout-button').cloneNode(true);
                document.getElementById('logout-button').parentNode.replaceChild(logoutClone, document.getElementById('logout-button'));
            }

            if (currentLevel === 'homepage') {
                loader.style.display = 'none';
                gameBoard.innerHTML = '';
                homepage.style.display = 'block';
            } else {
                getRanking(level);
            }

            loader.style.display = 'none';
            inGame = false;
        } else {
            gameBoard.innerHTML = '';
            await resetElements();
            await init(currentLevel);
            await setup(currentLevel, demandValue, depotValue, vehiclesValue, capacityValue, maxTransferValue, levelDescription);
            await resetLvlElems();
            
            open = false;
            loader.style.display = 'none';
            showHide.style.display = 'block';
        }
        
    });
}


// No
alertNo.addEventListener('click', () => {
    alert.style.display = 'none';
});


// REGISTER
register.addEventListener('click', () => {
    loginPopup.style.display = 'none';
    registerPopup.style.display = 'block';
});


// REGISTER CLOSE
registerClose.addEventListener('click', () => {
    registerPopup.style.display = 'none';
    loginPopup.style.display = 'block';
});


// Console toggle button
consoleToggle.addEventListener('click', () => {
    
    if (gameConsole.classList.contains('console-active')) {
        gameConsole.classList.remove('console-active');
        consoleToggle.innerHTML = '&#8595;';
        consoleToggle.setAttribute('title', 'Expand');
    } else {
        gameConsole.classList.add('console-active');
        consoleToggle.innerHTML = '&#8593;';
        consoleToggle.setAttribute('title', 'Shrink');
    }

});


// Capacity checker
document.querySelectorAll('input[name="choice"]').forEach((elem) => {

    elem.addEventListener('click', (e) => {
        if (e.target.value === 'yes') {
            document.getElementById('vehicles-capacities').innerHTML = '';
            document.getElementById('vehicles-capacities').innerHTML += `
                <div style="margin: 5px auto;">Set the max. amount of capacity for each vehicle:
            </div>`;

            let numbVehicles = parseInt(document.getElementById('numberOfVehicles').value);

            if (numbVehicles > 5) {
                numbVehicles = 5;
            }

            for (let j = 0; j < numbVehicles; j++) {
                let div = `<div style="display:flex; margin: 4px;">
                    <div>Vehicle: </div>
                    <select class="vehicle-select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>    
                        <option>5</option>
                    </select>
                </div>`;

                document.getElementById('vehicles-capacities').innerHTML += div;
            }
        } else {
            document.getElementById('vehicles-capacities').innerHTML = '';
        }
    });

});


document.getElementById('close-dropdown-1').addEventListener('click', () => {
    let dropdownContent = document.getElementById('dropdown-content-1');
    dropdownContent.style.transition = 'all 2s';
    dropdownContent.style.display = 'none';
});

document.getElementById('close-dropdown-2').addEventListener('click', () => {
    let dropdownContent = document.getElementById('dropdown-content-2');
    dropdownContent.style.transition = 'all 2s';
    dropdownContent.style.display = 'none';
});

document.getElementById('close-dropdown-3').addEventListener('click', () => {
    let dropdownContent = document.getElementById('dropdown-content-3');
    dropdownContent.style.transition = 'all 2s';
    dropdownContent.style.display = 'none';
});


gameBoard.style.marginTop = margTop + 'px';

loginPopup.style.marginTop = loginButton.clientHeight + 'px';
loginPopup.style.display = 'none';

registerPopup.style.marginTop = loginButton.clientHeight + 'px';
registerClose.style.marginTop = loginButton.clientHeight + 'px';
registerPopup.children[1].style.marginTop = -loginButton.clientHeight + 'px';


loginButton.addEventListener('click', () => {
    if (loginPopup.style.display === 'none') {
        if (registerPopup.style.display === 'block') {
            registerPopup.style.display = 'none';
            return;
        }
        loginPopup.style.display = 'block';
    } else {
        loginPopup.style.display = 'none';
    }
});


showHide.addEventListener('click', () => {

    let demandsLeft = document.getElementsByClassName('demand');
    let depotsLeft = document.getElementsByClassName('depot');

    let showDetails = 'Show details';
    let hideDetails = 'Hide details';

    if (demandsLeft !== [] && depotsLeft !== []) {
        if (open === false) {
            Array.from(demandsLeft).forEach(demand => {
                demand.firstChild.style.display = 'block';
            });
        
            Array.from(depotsLeft).forEach(depot => {
                depot.firstChild.style.display = 'block';
            });

            open = true;
            document.getElementById('show-hide-button').innerHTML = hideDetails;
        } else {
            Array.from(demandsLeft).forEach(demand => {
                demand.firstChild.style.display = 'none';
            });
        
            Array.from(depotsLeft).forEach(depot => {
                depot.firstChild.style.display = 'none';
            });

            open = false;
            document.getElementById('show-hide-button').innerHTML = showDetails;
        }
    }

});


// Login password
passwordShowLogin.addEventListener('click', () => {
    passwordShowLogin.style.display = 'none';
    passwordHideLogin.style.display = 'block';
    setText(passwordLoginInput);
});

passwordHideLogin.addEventListener('click', () => {
    passwordHideLogin.style.display = 'none';
    passwordShowLogin.style.display = 'block';
    setText(passwordLoginInput);
});


// Register password
passwordShowRegister.addEventListener('click', () => {
    passwordShowRegister.style.display = 'none';
    passwordHideRegister.style.display = 'block';
    setText(passwordRegisterInput);
});

passwordHideRegister.addEventListener('click', () => {
    passwordHideRegister.style.display = 'none';
    passwordShowRegister.style.display = 'block';
    setText(passwordRegisterInput);
});


// Repeat password
passwordShowRepeat.addEventListener('click', () => {
    passwordShowRepeat.style.display = 'none';
    passwordHideRepeat.style.display = 'block';
    setText(passwordRepeatInput);
});

passwordHideRepeat.addEventListener('click', () => {
    passwordHideRepeat.style.display = 'none';
    passwordShowRepeat.style.display = 'block';
    setText(passwordRepeatInput);
});


backer.style.display = 'none';

console.log("Welcome to waste collection @Author: tv");