import { calculateOrders } from "./calculateOrders.js";

const getResults = ()=> {
    const results = calculateOrders();

    console.log( '\n\nResults:')
    console.log( '\n\nDate or Period  |  Top Sizzling Hot Product')
    console.log('--------------------------------')
    results.forEach((result) => {
        console.log(result.date, '|', result.productName);
    });
    console.log('--------------------------------')
}

getResults();