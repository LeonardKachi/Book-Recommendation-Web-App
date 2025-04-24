document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookGrid = document.getElementById('bookGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const pageCountFilter = document.getElementById('pageCountFilter');
    const genreButtons = document.getElementById('genreButtons');
    const pagination = document.getElementById('pagination');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    
    // Constants
    const API_ENDPOINT = 'https://aw5v983hz3.execute-api.us-east-1.amazonaws.com/prod/recommendations';
    const BOOKS_PER_PAGE = 12;
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Cover';
    
    // State
    let currentTheme = localStorage.getItem('theme') || 'light';
    let allBooks = [];
    let filteredBooks = [];
    let currentGenre = 'all';
    let currentPage = 1;
    let totalPages = 1;
    
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
        sortSelect.addEventListener('change', filterAndDisplayBooks);
        pageCountFilter.addEventListener('change', filterAndDisplayBooks);
        
        // Genre buttons
        genreButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('genre-btn')) {
                document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentGenre = e.target.dataset.genre;
                currentPage = 1;
                filterAndDisplayBooks();
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
        currentPage = 1;
        filterAndDisplayBooks();
    }
    
    async function fetchBooks() {
        try {
            showLoading(true);
            
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data.books || data.books.length === 0) throw new Error('No books found');
            
            allBooks = processBooks(data.books);
            filterAndDisplayBooks();
        } catch (error) {
            console.error('Fetch error:', error);
            showError('Failed to load books. Please try again later.');
        } finally {
            showLoading(false);
        }
    }
    
    function processBooks(books) {
        return books.map(book => {
            // Ensure all books have required fields
            return {
                id: book.id || Math.random().toString(36).substr(2, 9),
                title: book.title || 'Untitled',
                author: book.author || 'Unknown Author',
                description: book.description || 'No description available.',
                image: book.image || PLACEHOLDER_IMAGE,
                genre: book.genre || 'general',
                rating: parseFloat(book.rating) || 0,
                pageCount: parseInt(book.pageCount) || 0,
                publishedDate: book.publishedDate || '',
                purchaseLink: book.purchaseLink || '#',
                price: book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'Not available'
            };
        });
    }
    
    function filterAndDisplayBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;
        const pageFilter = pageCountFilter.value;
        
        // Filter books
        filteredBooks = allBooks.filter(book => {
            // Search filter
            const matchesSearch = 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.description.toLowerCase().includes(searchTerm);
            
            // Genre filter
            const matchesGenre = 
                currentGenre === 'all' || 
                (book.genre && book.genre.toLowerCase().includes(currentGenre));
            
            // Page count filter
            let matchesPageCount = true;
            if (pageFilter !== 'any' && book.pageCount) {
                if (pageFilter === 'short') matchesPageCount = book.pageCount < 300;
                else if (pageFilter === 'medium') matchesPageCount = book.pageCount >= 300 && book.pageCount <= 600;
                else if (pageFilter === 'long') matchesPageCount = book.pageCount > 600;
            }
            
            return matchesSearch && matchesGenre && matchesPageCount;
        });
        
        // Sort books
        sortBooks(sortBy);
        
        // Paginate
        totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
        updatePagination();
        displayCurrentPage();
    }
    
    function sortBooks(sortBy) {
        switch(sortBy) {
            case 'rating':
                filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredBooks.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                break;
            case 'popular':
                filteredBooks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            default: // relevance
                // Keep original order or implement relevance algorithm
                break;
        }
    }
    
    function displayCurrentPage() {
        if (filteredBooks.length === 0) {
            bookGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-book-open no-results-icon"></i>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            pagination.innerHTML = '';
            return;
        }
        
        const startIdx = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIdx = startIdx + BOOKS_PER_PAGE;
        const booksToDisplay = filteredBooks.slice(startIdx, endIdx);
        
        bookGrid.innerHTML = booksToDisplay.map(book => `
            <div class="book-card">
                <div class="book-cover-container">
                    <img src="${book.image}" 
                         alt="${book.title}" 
                         class="book-cover"
                         onerror="this.src='${PLACEHOLDER_IMAGE}'">
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
                            ${book.pageCount ? `${book.pageCount} pages` : ''}
                        </span>
                    </div>
                    
                    <p class="book-description">
                        ${book.description}
                    </p>
                    
                    <div class="book-footer">
                        <span class="book-price">
                            ${book.price}
                        </span>
                        <div class="book-actions">
                            <a href="${book.purchaseLink}" class="book-link" target="_blank">
                                <i class="fas fa-shopping-cart"></i> Buy
                            </a>
                            <button class="book-link secondary" onclick="addToWishlist('${book.id}')">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function updatePagination() {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </button>
            `;
        }
        
        // Next button
        paginationHTML += `
            <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        displayCurrentPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function generateStarRating(rating) {
        if (!rating) return '<span>Not rated</span>';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars + ` <span>(${rating.toFixed(1)})</span>`;
    }
    
    function showLoading(show) {
        if (show) {
            bookGrid.innerHTML = `
                <div class="loading-container">
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <p>Loading books...</p>
                    </div>
                </div>
            `;
        }
    }
    
    function showError(message) {
        bookGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Global functions
    window.addToWishlist = function(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
            // In a real app, you would save to localStorage or send to a backend
            showToast(`Added "${book.title}" to your wishlist`);
        }
    };
    
    window.changePage = changePage;
});