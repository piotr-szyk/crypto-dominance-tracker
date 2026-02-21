// CoinGecko API Endpoints
const PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
const GLOBAL_API_URL = 'https://api.coingecko.com/api/v3/global';
const HISTORICAL_API_URL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily';


// --- DOM Element References ---
const btcPriceDisplay = document.getElementById('btc-price-display');
const btcDominanceDisplay = document.getElementById('btc-dominance-display');
const dominanceAlert = document.getElementById('dominance-alert');

// --- Helper Function: Update Alert Box ---
function updateDominanceAlert(dominance) {
    if (!dominanceAlert) return;

    // Reset classes
    dominanceAlert.classList.remove('buy-altcoins', 'buy-bitcoin');

    // Logic: If BTC Dominance is high (> 50%), it's "Bitcoin Season"
    // If it's low (< 50%), it might be "Altcoin Season"
    if (dominance > 50) {
        dominanceAlert.textContent = "Bitcoin Dominance is high. Bitcoin is leading the market.";
        dominanceAlert.classList.add('buy-bitcoin');
    } else {
        dominanceAlert.textContent = "Bitcoin Dominance is low. Money may be flowing into Altcoins!";
        dominanceAlert.classList.add('buy-altcoins');
    }
}

// --- Function: Fetch Bitcoin Price ---
function fetchBitcoinPrice() {
    fetch(PRICE_API_URL)
    .then(function(response) {
        if (!response.ok) throw new Error('Price API Error');
        return response.json();
    })
    .then(function(data) {
        const price = data.bitcoin.usd;
        
        // FORMATTING: Using Intl.NumberFormat for $ and commas
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);

        if (btcPriceDisplay) {
            btcPriceDisplay.textContent = formattedPrice;
        }
        console.log('✅ Price displayed:', formattedPrice);
    })
    .catch(function(error) {
        console.error("❌ Price Fetch Failed:", error);
        if (btcPriceDisplay) btcPriceDisplay.textContent = "Error loading price";
    });
}

// --- Function: Fetch Bitcoin Dominance ---
function fetchBitcoinDominance() {
    fetch(GLOBAL_API_URL)
    .then(function(response) {
        if (!response.ok) throw new Error('Global API Error');
        return response.json();
    })
    .then(function(data) {
        const dominance = data.data.market_cap_percentage.btc;
        const formattedDominance = dominance.toFixed(2) + '%';

        if (btcDominanceDisplay) {
            btcDominanceDisplay.textContent = formattedDominance;
        }

        // TRIGGER ALERT: Update the alert box based on the raw number
        updateDominanceAlert(dominance);

        console.log('✅ Dominance displayed:', formattedDominance);
    })
    .catch(function(error) {
        console.error("❌ Dominance Fetch Failed:", error);
        if (btcDominanceDisplay) btcDominanceDisplay.textContent = "Error loading dominance";
        if (dominanceAlert) dominanceAlert.textContent = "Could not calculate market state.";
    });
}

// --- 1. GLOBAL VARIABLES ---
let dominanceChart; // This stores our chart instance so we can update it later

// --- 2. CHART UI FUNCTION ---
function renderChart(labels, prices) {
    const ctx = document.getElementById('dominanceChart').getContext('2d');
    
    // Safety check: destroy old chart instance if it exists
    if (dominanceChart) {
        dominanceChart.destroy();
    }

    dominanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Bitcoin Price (USD) - Last 7 Days',
                data: prices,
                borderColor: '#3b82f6', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4, 
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        // This adds the $ sign back to the side of the chart
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// --- 3. HISTORICAL DATA FETCH ---
function fetchHistoricalData() {
    console.log("Fetching historical chart data...");
    
    fetch(HISTORICAL_API_URL)
    .then(response => {
        if (!response.ok) throw new Error('History API Error');
        return response.json();
    })
    .then(data => {
        // data.prices is an array of [timestamp, price]
        // We use .map() to create two new arrays: labels (dates) and prices
        const labels = data.prices.map(item => {
            const date = new Date(item[0]);
            return date.toLocaleDateString('en-US', { weekday: 'short' }); 
        });

        const prices = data.prices.map(item => item[1]);

        renderChart(labels, prices);
        console.log("✅ Chart rendered with historical data.");
    })
    .catch(error => {
        console.error("❌ History Fetch Failed:", error);
    });
}


// Calling the functions
document.addEventListener('DOMContentLoaded', function() {
    fetchBitcoinPrice();
    fetchBitcoinDominance();
    fetchHistoricalData();
});