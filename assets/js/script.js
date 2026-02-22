const API_KEY = CONFIG.API_KEY;
const BASE_URL = 'https://min-api.cryptocompare.com/data';

let dominanceChart = null;
let chartLabels = [];
let chartPriceData = [];
let chartDominanceData = []; 

/**
 * INITIALIZATION
 */
async function initApp() {
    await fetchHistoricalData(); 
    await fetchLiveData();       
    setInterval(fetchLiveData, 300000);
}

/**
 * FETCH 30D HISTORY
 */
async function fetchHistoricalData() {
    try {
        const response = await fetch(`${BASE_URL}/v2/histoday?fsym=BTC&tsym=USD&limit=30&api_key=${API_KEY}`);
        const json = await response.json();
        
        if (json.Response === "Error") throw new Error(json.Message);

        const history = json.Data.Data;
        chartLabels = history.map(day => new Date(day.time * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }));
        chartPriceData = history.map(day => day.close); 
        
        chartDominanceData = new Array(chartLabels.length).fill(null);

        renderChart(parseFloat(document.getElementById('threshold').value));
    } catch (error) {
        console.error("History Error:", error);
    }
}

/**
 * LIVE FETCH & DOMINANCE CALCULATION
 */
async function fetchLiveData() {
    const alertBox = document.getElementById('dominance-alert');
    
    try {
        const response = await fetch(`${BASE_URL}/top/mktcapfull?limit=10&tsym=USD&api_key=${API_KEY}`);
        const json = await response.json();
        
        if (!json.Data) throw new Error("Invalid API Response");

        let btcPrice = 0;
        let btcMarketCap = 0;
        let totalMarketCapTop10 = 0;

        json.Data.forEach((coin, index) => {
            if (coin.RAW && coin.RAW.USD) {
                const mktCap = coin.RAW.USD.MKTCAP;
                totalMarketCapTop10 += mktCap;
                if (index === 0) {
                    btcPrice = coin.RAW.USD.PRICE;
                    btcMarketCap = mktCap;
                }
            }
        });

        const btcDominance = (btcMarketCap / totalMarketCapTop10) * 100;

        const cleanPrice = Math.round(btcPrice).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        document.getElementById('btc-price-display').textContent = `$${cleanPrice}`;
        document.getElementById('btc-dominance-display').textContent = `${btcDominance.toFixed(2)}%`;

        if (chartDominanceData.length > 0) {
            chartDominanceData[chartDominanceData.length - 1] = btcDominance;
        }

        updateAlert(btcDominance);
        renderChart(parseFloat(document.getElementById('threshold').value));

    } catch (error) {
        console.error("Live fetch failed:", error);
        alertBox.textContent = "Data error. Please check your API Key.";
    }
}

function updateAlert(dominance) {
    const threshold = parseFloat(document.getElementById('threshold').value) || 50;
    const alertBox = document.getElementById('dominance-alert');

    if (dominance > threshold) {
        alertBox.innerHTML = `🚨 <strong>SIGNAL: SELL ALTS / HOLD BTC</strong><br>BTC Dominance is above ${threshold}%.`;
        alertBox.className = "alert-box btc-high";
    } else {
        alertBox.innerHTML = `🚀 <strong>SIGNAL: BUY ALTS</strong><br>BTC Dominance is below ${threshold}%.`;
        alertBox.className = "alert-box btc-low";
    }
}

/**
 * RENDER CHART
 */
function renderChart(threshold) {
    const ctx = document.getElementById('dominanceChart').getContext('2d');
    if (dominanceChart) dominanceChart.destroy();

    dominanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'BTC Price (USD)',
                    data: chartPriceData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y', 
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Your Alert Threshold (%)',
                    data: new Array(chartLabels.length).fill(threshold),
                    borderColor: '#ef4444',
                    borderDash: [5, 5],
                    yAxisID: 'y1', 
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: { 
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: '#334155' },
                    ticks: { color: '#94a3b8' } 
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100, 
                    grid: { drawOnChartArea: false }, 
                    ticks: { color: '#ef4444' }
                },
                x: { ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);
document.getElementById('update-alert-btn').addEventListener('click', () => {
    fetchLiveData(); 
});