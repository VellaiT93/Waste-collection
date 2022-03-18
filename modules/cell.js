import { appendToGameboard } from "./config.js";


/*** 
*  Creates a new cell DOM node
***/
export const setupCell = (row, coll, r, c) => {

    // Cell node
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add('path');
    cell.style.gridRowStart = row;
    cell.style.gridColumnStart = coll;
    cell.style.background = "url('./pics/path.png') no-repeat";
    cell.style.backgroundSize = 'cover';
    cell.style.backgroundPosition = 'center';

    // Cell highlighter
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');

    const cellWidth = document.getElementById('canvas').clientWidth / r;
    const cellHeight = document.getElementById('canvas').clientHeight / c;

    highlight.style.width = cellWidth + 'px';
    highlight.style.height = cellHeight + 'px';
    
    cell.appendChild(highlight);

    appendToGameboard(cell);

}