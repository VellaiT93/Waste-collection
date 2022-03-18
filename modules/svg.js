import { addFixedCoords, addDragLine } from './animation.js';
import { appendToGameboard } from './config.js';


const headerHeight = document.getElementById('header').clientHeight;


/*** Setup SVG for dragging demands  */
export const setupSVG = async() => {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const markerStartGreen = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    const markerStartRed = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    const polygonStartGreen = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const polygonStartRed = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    const demands = document.getElementsByClassName('demand');

    return new Promise((resolve) => {

        svg.style.position = 'absolute';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('pointer-events', 'none');

        markerStartGreen.setAttribute('id', 'startPointGreen');
        markerStartGreen.setAttribute('markerWidth', '16');
        markerStartGreen.setAttribute('markerHeight', '16');
        markerStartGreen.setAttribute('refX', '8');
        markerStartGreen.setAttribute('refY', '7');
        markerStartGreen.setAttribute('orient', 'auto');

        markerStartRed.setAttribute('id', 'startPointRed');
        markerStartRed.setAttribute('markerWidth', '16');
        markerStartRed.setAttribute('markerHeight', '16');
        markerStartRed.setAttribute('refX', '8');
        markerStartRed.setAttribute('refY', '7');
        markerStartRed.setAttribute('orient', 'auto');

        polygonStartGreen.setAttribute('id', 'poly-start-green');
        polygonStartGreen.setAttributeNS(null, 'r', '8');
        polygonStartGreen.setAttributeNS(null, 'cx', '8');
        polygonStartGreen.setAttributeNS(null, 'cy', '8');
        polygonStartGreen.setAttribute('fill', 'rgba(11, 156, 49, 0.4)');

        polygonStartRed.setAttribute('id', 'poly-start-red');
        polygonStartRed.setAttributeNS(null, 'r', '8');
        polygonStartRed.setAttributeNS(null, 'cx', '8');
        polygonStartRed.setAttributeNS(null, 'cy', '8');
        polygonStartRed.setAttribute('fill', 'rgba(255, 0, 0, 0.4)');

        markerStartGreen.appendChild(polygonStartGreen);
        markerStartRed.appendChild(polygonStartRed);

        defs.appendChild(markerStartGreen);
        defs.appendChild(markerStartRed);

        svg.appendChild(defs);
        appendToGameboard(svg);

        for (let i = 1; i <= demands.length; i++) {
            let dragLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            let demand = document.getElementById('demand_' + i);
            let coords = demand.getBoundingClientRect();
            let centerX = ((coords.left + coords.right) / 2);
            let centerY = ((coords.top + coords.bottom) / 2) - headerHeight - 3 + 'px';

            // Important because of header
            if (window.scrollY !== 0) {
                centerY = parseInt(centerY) + parseInt(window.scrollY) + 'px';
            }

            dragLine.style.zIndex = '10';
            dragLine.style.position = 'absolute';
            dragLine.setAttribute('x1', `${centerX}`);
            dragLine.setAttribute('y1', `${centerY}`);
            dragLine.setAttribute('x2', `${centerX}`);
            dragLine.setAttribute('y2', `${centerY}`);

            svg.appendChild(dragLine);

            addDragLine(dragLine);
            addFixedCoords({x: demand.style.gridRowStart, y: demand.style.gridColumnStart});
        }

        setTimeout(() => {
            resolve();
        }, 30);
    });

}
/*** */