import { appendToGameboard, chooseVehicle, checkTransferDistance } from './config.js';
import { setupDemandComposition } from './demand.js';

const header = document.getElementById('header');

let LINE_ID = 1;

let fixedCoords = [];
let dragLines = [];

let compositionCounter = 1;


/*** Dragging demands before start */
export const dragDemands = () => {
    
    const cells = document.getElementsByClassName('path');
    const demands = document.getElementsByClassName('demand');
    const vehicles = document.getElementsByClassName('vehicle');

    let currentDemand;
    let id;
    let fixedPosX;
    let fixedPosY;
    let line;


    const addBackArrow = (demand, fixedX, fixedY) => {
        let backArrow = document.createElement('img');
        backArrow.classList.add('back-arrow');
        backArrow.setAttribute('id', 'back-arrow_' + demand.id.replace('demand_', ''));
        backArrow.setAttribute('src', './pics/undo.png');
        backArrow.setAttribute('title', 'undo');
        backArrow.style.gridRowStart = fixedX - 1;
        backArrow.style.gridColumnStart = fixedY;
        backArrow.draggable = false;

        appendToGameboard(backArrow);

        backArrow.addEventListener('click', () => {
            resetDemand(
                document.getElementById('demand_' + backArrow.id.replace('back-arrow_', '')), 
                fixedCoords[backArrow.id.replace('back-arrow_', '') - 1].x, 
                fixedCoords[backArrow.id.replace('back-arrow_', '') - 1].y, 
                backArrow
            );
        });
    }

    const resetDemand = (demand, fixedX, fixedY, arrow) => {

        // Reset demand to original position
        demand.style.gridRowStart = fixedX;
        demand.style.gridColumnStart = fixedY;

        // Show demand if none
        if (demand.style.display === 'none') {
            demand.style.display = 'block';
        }
        
        demand.children[1].innerHTML = `(${demand.getAttribute('data-amount')})`;
        demand.classList.remove('dragged');

        // Reset dragPath
        Array.from(document.getElementsByClassName('drag-line_' + demand.id.replace('demand_', ''))).forEach(line => {
            line.remove();
        });

        if (demand.getAttribute('data-composition')) {
            let demandComposition = document.getElementById(demand.getAttribute('data-composition'));

            let substract = parseInt(demand.getAttribute('data-amount'));
            let comp = parseInt(demandComposition.getAttribute('data-amount'));
            let result = comp - substract;

            demandComposition.firstChild.innerHTML = '';
            
            demandComposition.children[1].innerHTML = `(${result})`;

            let counterResult = demandComposition.getAttribute('data-composition-counter') - 1;
            demandComposition.setAttribute('data-composition-counter', `${counterResult}`);
            let amountResult = demandComposition.getAttribute('data-amount') - demand.getAttribute('data-amount');
            demandComposition.setAttribute('data-amount', `${amountResult}`);

            demandComposition.firstChild.innerHTML = `
                <div>Composition</div>
                <div>Amount: ${demandComposition.getAttribute('data-amount')}</div>
            `;

            demand.removeAttribute('data-composition');
            
            if (demandComposition.getAttribute('data-composition-counter') === '1') {
                Array.from(document.getElementsByClassName('demand')).forEach(demand => {
                    if (demand.getAttribute('data-composition') === demandComposition.id) {
                        demand.style.display = 'block';
                        demand.removeAttribute('data-composition');
                    }
                });

                let demandCompositionClone = demandComposition.cloneNode(true);
                demandComposition.parentNode.replaceChild(demandCompositionClone, demandComposition);
                demandCompositionClone.remove();

                if (document.getElementsByClassName('composition').length === 0) {
                    compositionCounter = 1;
                }
            }
            
        }

        // Hide arrow
        arrow.style.display = 'none';

    }

    const onDragOver = () => {
        return (e) => {
            e.preventDefault();
        }
    }

    const onDragOverHeader = () => {
        return (e) => {
            e.preventDefault();
        }
    }

    const drawPath = (fixedX, fixedY, dragX, dragY) => {
        let stalemate = false;

        let currentX = parseInt(fixedX);
        let currentY = parseInt(fixedY);
        let targetX = parseInt(dragX);
        let targetY = parseInt(dragY);

        // Checking distance between fixedPos and target demand @returns distance X and Y
        const checkDistance = (target, position) => {
            return target < position ? position - target : target - position;
        }

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

            // If target has been reached, otherwise request anim
            if (targetX === currentX && targetY === currentY) {
                cancelAnimationFrame(setPath);
            } else {
                let path = animateDragPath(currentX, currentY, currentDemand.id);
                path.addEventListener('dragover', onDragOver());
                path.addEventListener('drop', onDragDrop(path));

                requestAnimationFrame(setPath);
            }
        }

        let path = animateDragPath(currentX, currentY, currentDemand.id);
        path.addEventListener('dragover', onDragOver());
        path.addEventListener('drop', onDragDrop(path));
        requestAnimationFrame(setPath);
    }

    const onDragEnter = (cell) => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(cell, fixedPosX, fixedPosY)) {    
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                cell.classList.add('hovered');
            } else {
                line.setAttribute('stroke', 'rgba(255, 0, 0, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointRed)');
                cell.firstChild.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
                cell.classList.add('hovered');
            }
        }
    }

    const onDragEnterDemand = (demand) => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(demand, fixedPosX, fixedPosY)) {    
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                
                if (demand !== currentDemand) {
                    demand.classList.add('demand-green');
                }
            } else {
                line.setAttribute('stroke', 'rgba(255, 0, 0, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointRed)');
            
                if (demand !== currentDemand) {
                    demand.classList.add('demand-red');
                }
            }
        }
    }

    const onDragEnterComposition = (composition) => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(composition, fixedPosX, fixedPosY)) {    
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                composition.classList.add('composition-green');
            } else {
                line.setAttribute('stroke', 'rgba(255, 0, 0, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointRed)');
                composition.classList.add('composition-red');
            }
        }
    }

    const onDragLeave = (cell) => {
        return (e) => {
            e.preventDefault();
            cell.firstChild.style.backgroundColor = 'rgba(11, 156, 49, 0.4)';
            cell.classList.remove('hovered');
        }   
    }

    const onDragLeaveDemand = (demand) => {
        return(e) => {
            e.preventDefault();

            if (demand.classList.contains('demand-green')) {
                demand.classList.remove('demand-green');
            }

            if (demand.classList.contains('demand-red')) {
                demand.classList.remove('demand-red');
            }
        }
    }

    const onDragLeaveComposition = (composition) => {
        return (e) => {
            e.preventDefault();

            if (composition.classList.contains('composition-green')) {
                composition.classList.remove('composition-green');
            }

            if (composition.classList.contains('composition-red')) {
                composition.classList.remove('composition-red');
            }
        }
    }

    const onDragDrop = (cell) => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(cell, fixedPosX, fixedPosY)) {
                // Move demand
                currentDemand.style.gridRowStart = cell.style.gridRowStart;
                currentDemand.style.gridColumnStart = cell.style.gridColumnStart;
                currentDemand.classList.add('dragged');

                if (!currentDemand.classList.contains('already-dragged')) {
                    addBackArrow(currentDemand, fixedPosX, fixedPosY);
                    currentDemand.classList.add('already-dragged');
                } else {
                    let backArrow = document.getElementById('back-arrow_' + currentDemand.id.replace('demand_', ''));
                    backArrow.style.display = 'block';
                }

                cell.classList.remove('hovered');

                if (Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).length > 0) {
                    Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).forEach(line => {
                        line.remove();
                    });
                }

                if (parseInt(currentDemand.style.gridRowStart) === parseInt(fixedPosX) && parseInt(currentDemand.style.gridColumnStart) === parseInt(fixedPosY)) {
                    return;
                } else {
                    drawPath(fixedPosX, fixedPosY, currentDemand.style.gridRowStart, currentDemand.style.gridColumnStart);
                }

            } else {
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                
                if (!cell.classList.contains('drag-line')) {
                    cell.classList.remove('hovered');
                    cell.firstChild.style.backgroundColor = 'rgba(11, 156, 49, 0.4)';
                }
            }
        }
    }

    const onDragDropDemand = (demand) => {
        return (e) => {
            e.preventDefault();
            
            if (checkTransferDistance(demand, fixedPosX, fixedPosY) && e.target !== currentDemand && e.target !== currentDemand.children[1]) {
                // Move demand
                currentDemand.style.gridRowStart = demand.style.gridRowStart;
                currentDemand.style.gridColumnStart = demand.style.gridColumnStart;
                currentDemand.classList.add('dragged');
                currentDemand.setAttribute('data-composition', 'composition_' + compositionCounter);
                demand.setAttribute('data-composition', 'composition_' + compositionCounter);

                currentDemand.style.display = 'none';
                demand.style.display = 'none';

                const demandComposition = setupDemandComposition(
                    demand.style.gridRowStart, 
                    demand.style.gridColumnStart, 
                    demand, 
                    currentDemand, 
                    compositionCounter
                );

                demandComposition.addEventListener('dragover', onDragOver());
                demandComposition.addEventListener('dragenter', onDragEnterComposition(demandComposition));
                demandComposition.addEventListener('dragleave', onDragLeaveComposition(demandComposition));
                demandComposition.addEventListener('drop', onDragDropComposition(demandComposition));

                compositionCounter++;

                if (!currentDemand.classList.contains('already-dragged')) {
                    addBackArrow(currentDemand, fixedPosX, fixedPosY);
                    currentDemand.classList.add('already-dragged');
                } else {
                    let backArrow = document.getElementById('back-arrow_' + currentDemand.id.replace('demand_', ''));
                    backArrow.style.display = 'block';
                }

                if (Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).length > 0) {
                    Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).forEach(line => {
                        line.remove();
                    });
                }
    
                drawPath(fixedPosX, fixedPosY, currentDemand.style.gridRowStart, currentDemand.style.gridColumnStart);

                if (demand.classList.contains('demand-green')) {
                    demand.classList.remove('demand-green');
                    demand.classList.add('demand');
                }

            } else {
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                demand.classList.remove('demand-red');
                demand.classList.add('demand');
            }
        }
    }

    const onDragDropComposition = (composition) => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(composition, fixedPosX, fixedPosY)) {
                // Move demand
                currentDemand.style.gridRowStart = composition.style.gridRowStart;
                currentDemand.style.gridColumnStart = composition.style.gridColumnStart;
                currentDemand.setAttribute('data-composition', '' + composition.id);
                currentDemand.classList.add('dragged');
                currentDemand.style.display = 'none';

                if (!currentDemand.classList.contains('already-dragged')) {
                    addBackArrow(currentDemand, fixedPosX, fixedPosY);
                    currentDemand.classList.add('already-dragged');
                } else {
                    let arrowId = currentDemand.id.replace('demand_', '');
                    let backArrow = document.getElementById('back-arrow_' + arrowId);
                    backArrow.style.display = 'block';
                }

                composition.children[1].innerHTML = `(${parseInt(composition.getAttribute('data-amount')) + parseInt(currentDemand.getAttribute('data-amount'))})`;

                let resultAmount = parseInt(composition.getAttribute('data-amount')) + parseInt(currentDemand.getAttribute('data-amount'));
                composition.setAttribute('data-amount', '' + resultAmount);
                composition.setAttribute('data-total-amount', '' + resultAmount);

                let resultComposition = parseInt(composition.getAttribute('data-composition-counter')) + 1;
                composition.setAttribute('data-composition-counter', `${resultComposition}`);

                composition.firstChild.innerHTML = `
                    <div>Composition</div>
                    <div>Amount: ${composition.getAttribute('data-amount')}</div>
                `;

                if (Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).length > 0) {
                    Array.from(document.getElementsByClassName('drag-line_' + currentDemand.id.replace('demand_', ''))).forEach(line => {
                        line.remove();
                    });
                }

                drawPath(fixedPosX, fixedPosY, currentDemand.style.gridRowStart, currentDemand.style.gridColumnStart);

                composition.classList.remove('composition-green');

            } else {
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
                composition.classList.remove('composition-red');
            }
        }
    }

    const onDragDropHeader = () => {
        return (e) => {
            e.preventDefault();

            if (checkTransferDistance(currentDemand, fixedPosX, fixedPosY)) {
                line.setAttribute('stroke', 'rgba(11, 156, 49, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointGreen)');
            } else {
                line.setAttribute('stroke', 'rgba(255, 0, 0, 0.4)');
                line.setAttribute('marker-start', 'url(#startPointRed)');
            }
        }
    }

    const onDragStart = (demand) => {
        return (e) => {

            if (e.target !== demand) return;

            currentDemand = e.target;
            currentDemand.querySelector('.tooltip').classList.remove('active');
                
            id = parseInt(currentDemand.id.replace('demand_', ''));

            fixedPosX = fixedCoords[id - 1].x;
            fixedPosY = fixedCoords[id - 1].y;

            line = dragLines[id - 1];

            line.setAttribute('marker-start', 'url(#startPointGreen)');
        }
    }

    const onDragEnd = () => {
        return (e) => {
            e.preventDefault();
            currentDemand.parentElement.classList.remove('hovered');
            currentDemand.firstChild.classList.add('active');
        }
    }

    header.addEventListener('dragover', onDragOverHeader());
    header.addEventListener('drop', onDragDropHeader());

    Array.from(cells).forEach(cell => {
        cell.addEventListener('dragover', onDragOver());
        cell.addEventListener('dragenter', onDragEnter(cell));
        cell.addEventListener('dragleave', onDragLeave(cell));
        cell.addEventListener('drop', onDragDrop(cell));
    });

    Array.from(demands).forEach(demand => {
        demand.draggable = true;

        demand.addEventListener('dragstart', onDragStart(demand));
        demand.addEventListener('dragend', onDragEnd());
        demand.addEventListener('dragleave', onDragLeaveDemand(demand));
        demand.addEventListener('dragover', onDragOver());
        demand.addEventListener('dragenter', onDragEnterDemand(demand));
        demand.addEventListener('drop', onDragDropDemand(demand));

        demand.addEventListener('click', () => {
            alert("You can drag the waste bags (click Ready when done)");
        });
    });

    Array.from(vehicles).forEach(vehicle => {
        vehicle.addEventListener('click', () => {
            document.getElementById('ready-button').classList.add('indicator');
            alert("Click the ready button first!");
        });
    });

    document.getElementById('ready-button').addEventListener('click', function readyClick() {
        Array.from(demands).forEach(demand => {
            demand.draggable = false;

            let demandClone = demand.cloneNode(true);
            demand.parentNode.replaceChild(demandClone, demand);
        });

        Array.from(cells).forEach(cell => {
            let cellClone = cell.cloneNode(true);
            cell.parentNode.replaceChild(cellClone, cell);
        });

        Array.from(vehicles).forEach(vehicle => {
            let vehicleClone = vehicle.cloneNode(true);
            vehicle.parentNode.replaceChild(vehicleClone, vehicle);
        });

        Array.from(document.getElementsByClassName('back-arrow')).forEach(arrow => {
            let arrowClone = arrow.cloneNode(true);
            arrow.parentNode.replaceChild(arrowClone, arrow);
            arrowClone.remove();
        });

        Array.from(document.getElementsByClassName('drag-line')).forEach(line => {
            let lineClone = line.cloneNode(true);
            line.parentNode.replaceChild(lineClone, line);
        })

        header.removeEventListener('dragover', onDragOverHeader());
        header.removeEventListener('drop', onDragDropHeader());

        document.getElementById('ready-button').removeEventListener('click', readyClick);
        document.getElementById('ready-button').classList.remove('indicator');
        document.getElementById('ready-button').style.display = 'none';
        fixedCoords = [];
        chooseVehicle();
    });

}
/*** */


/*** Path animation */
export const animatePath = (posX, posY) => {

    // Path node
    let line = document.createElement('div');
    line.classList.add('line');
    line.classList.add('line_' + LINE_ID);
    line.style.gridRowStart = posX;
    line.style.gridColumnStart = posY;

    appendToGameboard(line);

}
/*** */


/*** Drag path animation */
export const animateDragPath = (posX, posY, id) => {

    // Path node
    let line = document.createElement('div');
    line.classList.add('drag-line');
    line.classList.add('drag-line_' + id.replace('demand_', ''));
    line.style.gridRowStart = posX;
    line.style.gridColumnStart = posY;

    appendToGameboard(line);

    return line;

}
/*** */


/*** Collected animation */
export const collectedAnim = (effect, highlight) => {

    appendToGameboard(effect)
    appendToGameboard(highlight);
    
    effect.style.animationPlayState = 'running';
    effect.style.animationIterationCount = '1';
    effect.addEventListener('animationend', () => {
        effect.removeEventListener('animationend', this);
        effect.remove();
    });

    highlight.style.animationPlayState = 'running';
    highlight.style.animationIterationCount = '1';
    highlight.addEventListener('animationend', () => {
        highlight.removeEventListener('animationend', this);
        highlight.remove();
    });

}
/*** */


/*** Increment line ID */
export const incrementLineId = () => {
    LINE_ID++;
}
/***  */


/*** Denote line ID */
export const denoteLineId = () => {
    LINE_ID--;
}
/*** */


/*** Set line id */
export const resetLineId = async() => {
    LINE_ID = 1;
}
/***  */


/*** Remove specific drag line */
export const removeLine = (id) => {
    dragLines[id - 1].remove();
}
/***  */


/*** Adds line to drag array */
export const addDragLine = (line) => {
    dragLines.push(line);
}
/***  */


/*** Add fixed coords for all demands */
export const addFixedCoords = (element) => {
    fixedCoords.push(element);
}
/*** */


/*** Reset all drag lines before start */
export const resetDrag = async() => {

    return new Promise((resolve) => {
        fixedCoords = [];
        dragLines = [];
        compositionCounter = 1;

        setTimeout(() => {
            resolve();
        }, 30);
    });
    
}
/*** */