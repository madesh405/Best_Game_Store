const API_BASE = 'https://www.cheapshark.com/api/1.0';
const EXCHANGE_RATE = 87; // 1 USD = ~87 INR

let storeMap = {}; 

// Helper: Convert USD to INR and format
function formatIN(usdPrice) {
    if (!usdPrice) return 'FREE';
    const inr = parseFloat(usdPrice) * EXCHANGE_RATE;
    if (inr === 0) return 'FREE';
    return '₹' + Math.round(inr).toLocaleString('en-IN');
}

// 1. Initialize
async function init() {
    try {
        const res = await fetch(`${API_BASE}/stores`);
        const stores = await res.json();
        stores.forEach(store => {
            storeMap[store.storeID] = store.storeName;
        });

        loadFeatured();
        loadBudgetGames();

    } catch (err) { console.error("Failed to load stores"); }
}

// 2. Load Featured (Metacritic > 75 to ensure quality)
async function loadFeatured() {
    const featuredContainer = document.getElementById('featured-grid');
    try {
        // Added &metacritic=75 to remove junk/DLCs
        const res = await fetch(`${API_BASE}/deals?pageSize=8&sortBy=Deal Rating&onSale=1&metacritic=75`);
        const deals = await res.json();

        featuredContainer.innerHTML = deals.map(deal => {
            const savings = Math.round(parseFloat(deal.savings));
            return `
                <div class="featured-card" onclick="loadGamePricesByDeal('${deal.gameID}', '${deal.thumb}', '${deal.title.replace(/'/g, "\\'")}')">
                    <img src="${deal.thumb}" class="featured-thumb" alt="${deal.title}">
                    <div class="featured-info">
                        <div class="featured-title">${deal.title}</div>
                        <div class="featured-price">
                            ${formatIN(deal.salePrice)}
                            <span class="discount-tag">-${savings}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        featuredContainer.innerHTML = '<div class="loading">Failed to load deals.</div>';
    }
}

// 3. Load Budget Games (Upper price $10 USD ≈ ₹870 INR)
async function loadBudgetGames() {
    const budgetContainer = document.getElementById('budget-grid');
    try {
        // Added &metacritic=60 to ensure they are real games, not DLCs
        // &upperPrice=10 means games under ~$10 (approx ₹870)
        const res = await fetch(`${API_BASE}/deals?upperPrice=10&pageSize=4&sortBy=Savings&onSale=1&metacritic=60`);
        const deals = await res.json();

        budgetContainer.innerHTML = deals.map(deal => {
            const savings = Math.round(parseFloat(deal.savings));
            return `
                <div class="featured-card" onclick="loadGamePricesByDeal('${deal.gameID}', '${deal.thumb}', '${deal.title.replace(/'/g, "\\'")}')">
                    <img src="${deal.thumb}" class="featured-thumb" alt="${deal.title}">
                    <div class="featured-info">
                        <div class="featured-title">${deal.title}</div>
                        <div class="featured-price">
                            ${formatIN(deal.salePrice)}
                            <span class="discount-tag" style="background: #00ff88; color: #1b2838;">-${savings}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        budgetContainer.innerHTML = '<div class="loading">Failed to load budget deals.</div>';
    }
}

// 4. Search Logic
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    document.getElementById('featured-section').style.display = 'none';
    document.getElementById('results-container').innerHTML = '<div class="loading">Searching...</div>';
    document.getElementById('comparison-view').style.display = 'none';
    document.getElementById('results-container').style.display = 'grid';

    try {
        const res = await fetch(`${API_BASE}/games?title=${encodeURIComponent(query)}&limit=10`);
        const games = await res.json();
        renderSearchResults(games);
    } catch (err) {
        document.getElementById('results-container').innerHTML = '<div class="loading">Error searching. Try again.</div>';
    }
}

function renderSearchResults(games) {
    const container = document.getElementById('results-container');
    
    if (games.length === 0) {
        container.innerHTML = '<div class="loading">No games found.</div>';
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-result-card" onclick="loadGamePrices('${game.gameID}', '${game.thumb}', '${game.external.replace(/'/g, "\\'")}')">
            <img src="${game.thumb}" class="thumb" onerror="this.src='https://via.placeholder.com/120x55'">
            <div class="game-info">
                <h3>${game.external}</h3>
                <div style="font-size: 13px; color: #8f98a0;">Cheapest found: ${formatIN(game.cheapest)}</div>
            </div>
            <div class="click-hint">Compare Prices &rarr;</div>
        </div>
    `).join('');
}

// 5. Load Prices Helper
function loadGamePricesByDeal(gameID, thumb, title) {
    document.getElementById('featured-section').style.display = 'none';
    loadGamePrices(gameID, thumb, title);
}

async function loadGamePrices(gameID, thumb, title) {
    document.getElementById('results-container').style.display = 'none';
    const compView = document.getElementById('comparison-view');
    compView.style.display = 'block';
    
    document.getElementById('comp-img').src = thumb;
    document.getElementById('comp-title').innerText = title;
    document.getElementById('price-list-body').innerHTML = '<tr><td colspan="4" class="loading">Finding best deals...</td></tr>';

    try {
        const res = await fetch(`${API_BASE}/games?id=${gameID}`);
        const data = await res.json();

        // Sort deals by price
        const deals = data.deals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        document.getElementById('store-count').innerText = deals.length;
        renderPriceTable(deals);

    } catch (err) { console.error(err); }
}

function renderPriceTable(deals) {
    const tbody = document.getElementById('price-list-body');
    
    tbody.innerHTML = deals.map((deal, index) => {
        const savings = parseFloat(deal.savings);
        const storeName = storeMap[deal.storeID] || "Unknown Store";
        
        const isBestDeal = index === 0;
        const rowClass = isBestDeal ? 'price-row best-deal-row' : 'price-row';
        const priceClass = isBestDeal ? 'price-tag' : 'price-tag expensive';
        
        return `
            <tr class="${rowClass}">
                <td class="store-name">
                    ${storeName}
                    ${isBestDeal ? '<span class="best-badge">BEST PRICE</span>' : ''}
                </td>
                <td style="text-align: right; color: #8f98a0; font-size: 13px;">
                    ${savings > 0 ? `-${Math.round(savings)}%` : ''}
                </td>
                <td class="${priceClass}">${formatIN(deal.price)}</td>
                <td style="text-align: right;">
                    <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank" class="deal-btn">GO</a>
                </td>
            </tr>
        `;
    }).join('');
}

// 6. Back Button
function clearComparison() {
    document.getElementById('comparison-view').style.display = 'none';
    const searchVal = document.getElementById('search-input').value;
    if(searchVal) {
        document.getElementById('results-container').style.display = 'grid';
    } else {
        document.getElementById('featured-section').style.display = 'block';
    }
}

init();