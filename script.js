const MEDIASTACK_API_KEY = 'b4ec437e34e29d7a0d9a6a16d02e5280'; // Your Mediastack API key
const UPDATE_INTERVAL = 3600000; // 1 hour

// Fetch News Articles
async function fetchNews(category = 'general') {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const response = await fetch(`http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&categories=${category}`);
        const data = await response.json();
        const articles = data.data;

        updateNewsGrid(articles);
        updateLastUpdated();
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error fetching news:', error);
        loading.textContent = 'Error loading news. Please try again later.';
    }
}

// Create News Card
function createNewsCard(article) {
    const date = new Date(article.published_at).toLocaleDateString();
    const imageSection = article.image ? `
        <div class="news-image-container">
            <img src="${article.image}" alt="${article.title}" class="news-image">
        </div>
    ` : '';

    return `
        <div class="news-card">
            ${imageSection}
            <div class="news-content">
                <h2 class="news-title">${article.title}</h2>
                <p class="news-text">${article.description || "No description available."}</p>
                <div class="news-meta">
                    <span>${article.source}</span>
                    <span>${date}</span>
                </div>
            </div>
        </div>
    `;
}

// Update News Grid
function updateNewsGrid(articles) {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = articles.map(article => createNewsCard(article)).join('');
}

// Update Last Updated Time
function updateLastUpdated() {
    const lastUpdated = document.getElementById('lastUpdated');
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Initialize
fetchNews();

// Set up automatic refresh
setInterval(fetchNews, UPDATE_INTERVAL);

// Event Listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        fetchNews(e.target.dataset.category);
    });
});

document.querySelector('.search-bar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.news-card');
    cards.forEach(card => {
        const title = card.querySelector('.news-title').textContent.toLowerCase();
        const content = card.querySelector('.news-text').textContent.toLowerCase();
        card.style.display = (title.includes(query) || content.includes(query)) ? 'block' : 'none';
    });
});
