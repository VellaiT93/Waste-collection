const gameBoard = document.getElementById('canvas');

let DEMAND_ID = 1;


/*** 
*  Creates a new demand DOM node
*  Creates a tooltip node attached to the demand DOM
***/
export const setupDemand = (coordX, coordY, amount) => {

    const cellHeight = gameBoard.firstChild.clientHeight;
    const marginTooltip = cellHeight + 'px';
    const marginThumbnail = cellHeight * -1.5 + 'px';

    // Demand node
    const demand = document.createElement('div');
    demand.classList.add('demand');
    demand.classList.add('active');
    demand.setAttribute('id', 'demand_' + DEMAND_ID++);
    demand.setAttribute('data-amount', '' + amount);
    demand.setAttribute('data-total-amount', '' + amount);
    demand.style.gridRowStart = coordX;
    demand.style.gridColumnStart = coordY;

    // Tooltip node
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.classList.add('active');
    tooltip.style.marginTop = marginTooltip;
    
    let tooltipContent = `
        <div>Demand ${demand.id.replace('demand_', '')}</div>
        <div>Amount: ${demand.getAttribute('data-amount')}</div>
    `;

    // Thumbnail node
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    thumbnail.style.marginTop = marginThumbnail;

    let thumbnailContent = `(${demand.getAttribute('data-amount')})`;

    
    tooltip.innerHTML = tooltipContent;
    thumbnail.innerHTML = thumbnailContent;

    demand.appendChild(tooltip);
    demand.appendChild(thumbnail);

    gameBoard.appendChild(demand);

}


/***
*  Setup composition of multiple demands 
***/
export const setupDemandComposition = (coordX, coordY, demand, draggedDemand, id) => {

    const cellHeight = gameBoard.firstChild.clientHeight;
    const marginTooltip = cellHeight + 'px';
    const marginThumbnail = cellHeight * -1.5 + 'px';

    // Demand composition
    const demandComposition = document.createElement('div');
    demandComposition.classList.add('demand');
    demandComposition.classList.add('active');
    demandComposition.classList.add('composition');
    demandComposition.setAttribute('id', 'composition_' + id);
    demandComposition.setAttribute('data-composition-counter', 2);
    demandComposition.style.gridRowStart = coordX;
    demandComposition.style.gridColumnStart = coordY;

    const demandAmount = parseInt(demand.getAttribute('data-amount'));
    const draggedAmount = parseInt(draggedDemand.getAttribute('data-amount'));
    const amount = demandAmount + draggedAmount;

    demandComposition.setAttribute('data-amount', '' + amount);
    demandComposition.setAttribute('data-total-amount', '' + amount);

    // Set new tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.classList.add('active');

    let tooltipContent = `
        <div>Composition</div>
        <div>Amount: ${demandComposition.getAttribute('data-amount')}</div>
    `;

    tooltip.innerHTML = tooltipContent;

    const thumbnail = document.createElement('div');
    thumbnail.classList.add('composition-thumbnail');

    let thumbnailContent = `(${amount})`;
    thumbnail.innerHTML = thumbnailContent;

    thumbnail.style.marginTop = marginThumbnail;
    tooltip.style.marginTop = marginTooltip;

    demandComposition.appendChild(tooltip);
    demandComposition.appendChild(thumbnail);
    
    gameBoard.appendChild(demandComposition);

    return demandComposition;

}


/***
*  Update demand amount
***/
export const updateAmount = (demand, amount, keyword) => {

    let result;
    let tooltipContent;
    let thumbnailContent;

    // Check if update or restore
    if (keyword === 'update') { 
        result = parseInt(demand.getAttribute('data-amount')) - amount;
    } else {
        result = parseInt(demand.getAttribute('data-amount')) + amount;
    }

    demand.setAttribute('data-amount', '' + result);

    thumbnailContent = `(${result})`;

    if (demand.classList.contains('composition')) {
        tooltipContent = `
            <div>Composition</div>
            <div>Amount: ${result}</div>
        `;

        document.getElementById(demand.id).querySelector('.composition-thumbnail').innerHTML = thumbnailContent;
    } else {
        tooltipContent = `
            <div>Demand ${demand.id.replace('demand_', '')}</div>
            <div>Amount: ${result}</div>
        `;

        document.getElementById(demand.id).querySelector('.thumbnail').innerHTML = thumbnailContent;
    }

    document.getElementById(demand.id).querySelector('.tooltip').innerHTML = tooltipContent;

}


/***
*  Reset demand id at new game
***/
export const resetDemandId = async() => {

    return new Promise((resolve) => {
        DEMAND_ID = 1;

        setTimeout(() => {
            resolve();
        }, 30);
    });

}