document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const API_ENDPOINT = 'https://aw5v983hz3.execute-api.us-east-1.amazonaws.com/prod/recommendations';
    const bookGrid = document.getElementById('bookGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const pageCountFilter = document.getElementById('pageCountFilter');
    const genreButtons = document.getElementById('genreButtons');
    const themeToggle = document.getElementById('themeToggle');
    
    // State
    let currentTheme = localStorage.getItem('theme') || 'light';
    let allBooks = [];
    let filteredBooks = [];
    let currentGenre = 'all';
    let currentSearchQuery = '';
    
    // Initialize
    initTheme();
    setupEventListeners();
    fetchBooks();
    
    // Functions
    function initTheme() {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Search
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleSearch());
        
        // Filters
        sortSelect.addEventListener('change', applyFilters);
        pageCountFilter.addEventListener('change', applyFilters);
        
        // Genre buttons
        genreButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('genre-btn')) {
                document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentGenre = e.target.dataset.genre;
                applyFilters();
            }
        });
    }
    
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', currentTheme);
    }
    
    function handleSearch() {
        currentSearchQuery = searchInput.value.trim();
        fetchBooks();
    }
    
    async function fetchBooks() {
        bookGrid.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        try {
            const params = new URLSearchParams();
            if (currentSearchQuery) params.append('query', currentSearchQuery);
            if (currentGenre !== 'all') params.append('genre', currentGenre);
            
            const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data.books || data.books.length === 0) throw new Error('No books found');
            
            allBooks = processBooks(data.books);
            applyFilters();
        } catch (error) {
            console.error('Fetch error:', error);
            showError('Failed to load books. Please try a different search.');
        }
    }
    
    function processBooks(books) {
        return books.map(book => ({
            id: book.id || Math.random().toString(36).substr(2, 9),
            title: book.title || 'Untitled',
            author: book.author || 'Unknown Author',
            description: book.description || 'No description available.',
            image: book.image || 'https://via.placeholder.com/300x450?text=No+Cover',
            genre: book.genre || 'general',
            rating: parseFloat(book.rating) || 0,
            pageCount: parseInt(book.pageCount) || 0,
            publishedDate: book.publishedDate || '',
            purchaseLink: book.purchaseLink || '#',
            price: book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'Not available',
            popularity: parseFloat(book.popularity) || 0
        }));
    }
    
    function applyFilters() {
        // Filter by page count
        filteredBooks = filterByPageCount(allBooks);
        
        // Sort books
        filteredBooks = sortBooks(filteredBooks, sortSelect.value);
        
        displayBooks(filteredBooks);
    }
    
    function filterByPageCount(books) {
        const filterValue = pageCountFilter.value;
        
        return books.filter(book => {
            if (filterValue === 'any') return true;
            if (!book.pageCount) return false;
            
            switch(filterValue) {
                case 'short': return book.pageCount < 300;
                case 'medium': return book.pageCount >= 300 && book.pageCount <= 600;
                case 'long': return book.pageCount > 600;
                default: return true;
            }
        });
    }
    
    function sortBooks(books, sortBy) {
        const sorted = [...books];
        
        switch(sortBy) {
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
                
            case 'newest':
                return sorted.sort((a, b) => {
                    const dateA = a.publishedDate ? new Date(a.publishedDate) : new Date(0);
                    const dateB = b.publishedDate ? new Date(b.publishedDate) : new Date(0);
                    return dateB - dateA;
                });
                
            case 'popular':
                return sorted.sort((a, b) => b.popularity - a.popularity);
                
            default: // 'relevance'
                return sorted;
        }
    }
    
    function displayBooks(books) {
        if (books.length === 0) {
            bookGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-book-open" style="font-size: 3rem; opacity: 0.5;"></i>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        bookGrid.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-cover-container">
                    <img src="${book.image}" 
                         alt="${book.title}" 
                         class="book-cover"
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Cover'">
                    ${book.genre ? `<span class="book-badge">${book.genre.split(',')[0]}</span>` : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">By ${book.author}</p>
                    
                    <div class="book-meta">
                        <span class="book-rating">
                            ${generateStarRating(book.rating)}
                        </span>
                        <span class="book-pages">
                            ${book.pageCount ? `${book.pageCount} pages` : 'Unknown length'}
                        </span>
                    </div>
                    
                    <p class="book-description">
                        ${book.description}
                    </p>
                    
                    <div class="book-footer">
                        <span class="book-price">
                            ${book.price}
                        </span>
                        <a href="${book.purchaseLink}" class="book-link" target="_blank">
                            <i class="fas fa-shopping-cart"></i> Buy
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function generateStarRating(rating) {
        if (!rating) return '<span>Not rated</span>';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        
        return stars + ` <span>(${rating.toFixed(1)})</span>`;
    }
   
        showPage(currentPage);
        updatePagination();
    }

    function showPage(page) {
        const start = (page - 1) * booksPerPage;
        const end = start + booksPerPage;
        const currentBooks = filteredBooks.slice(start, end);

        bookGrid.innerHTML = currentBooks.map(book => `
            <div class="book-card">
                <img src="${book.image}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Cover'"/>
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
                <p>${book.description}</p>
                ${book.price ? `<p class="book-price">${book.price}</p>` : ''}
            </div>
        `).join('');
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('active');
            btn.onclick = () => {
                currentPage = i;
                showPage(i);
            };
            pagination.appendChild(btn);
        }
    }

    fetchBooks(); // initial call
}); 
    function showError(message) {
        bookGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
});
