// --- Configuration ---
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let filteredImages = [];
let isLoggedIn = false;

// --- Mock Data ---
const imagesData = [
    { id: 1, src: 'travel_1.png', date: '2024-03-15', year: 2024, month: 3, caption: 'Hoàng hôn rực rỡ trên biển Travel 1', content: 'Kỷ niệm chuyến đi biển đầu xuân 2024.' },
    { id: 2, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000', date: '2024-01-10', year: 2024, month: 1, caption: 'Núi rừng kỳ vĩ', content: 'Chuyến trekking đầy thử thách tại vùng núi phía Bắc.' },
    { id: 3, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000', date: '2024-02-20', year: 2024, month: 2, caption: 'Sương mù buổi sớm', content: 'Bình minh yên bình trên thảo nguyên.' },
    { id: 4, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000', date: '2023-12-25', year: 2023, month: 12, caption: 'Rừng thông Noel', content: 'Kỷ niệm Giáng sinh ấm áp tại Đà Lạt.' },
    { id: 5, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000', date: '2023-11-15', year: 2023, month: 11, caption: 'Hồ nước trong xanh', content: 'Mùa thu rực rỡ bên bờ hồ thơ mộng.' },
    { id: 6, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1000', date: '2023-10-05', year: 2023, month: 10, caption: 'Cánh đồng hoa', content: 'Chiều thu dạo bước giữa cánh đồng hoa dại.' },
    { id: 7, src: 'https://images.unsplash.com/photo-1532274402831-582985140814?auto=format&fit=crop&q=80&w=1000', date: '2024-03-01', year: 2024, month: 3, caption: 'Đường ven biển', content: 'Lái xe ngắm cảnh biển cực chill.' },
    { id: 8, src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=1000', date: '2023-12-10', year: 2023, month: 12, caption: 'Phố cổ về đêm', content: 'Vẻ đẹp lung linh của phố cổ Hội An.' },
    { id: 9, src: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1000', date: '2023-11-20', year: 2023, month: 11, caption: 'Rừng cây mùa thay lá', content: 'Sắc vàng của rừng cây cuối thu.' },
    { id: 10, src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000', date: '2024-01-05', year: 2024, month: 1, caption: 'Đỉnh núi tuyết', content: 'Cảm giác chinh phục đỉnh cao lý tưởng.' }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    filteredImages = [...imagesData];
    renderGallery();
    setupEventListeners();
});

// --- Navigation & Routing ---
function showSection(sectionId) {
    if (sectionId === 'images' && !isLoggedIn) {
        alert('Vui lòng đăng nhập để xem hình ảnh!');
        showSection('home');
        document.getElementById('username').focus();
        return;
    }

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.color = '';
    });
}

function setupEventListeners() {
    // Nav links
    document.getElementById('nav-home').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });

    document.getElementById('nav-gallery').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('images');
    });

    document.getElementById('nav-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
        document.getElementById('username').focus();
    });

    // Login logic
    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Mock login: admin / 123456
        if (user === 'admin' && pass === '123456') {
            isLoggedIn = true;
            document.getElementById('login-form-home').style.display = 'none';
            document.getElementById('login-error').innerText = '';
            alert('Đăng nhập thành công!');
            showSection('images');
        } else {
            document.getElementById('login-error').innerText = 'Tài khoản hoặc mật khẩu không đúng!';
        }
    });

    // Date filter
    document.getElementById('date-filter').addEventListener('change', (e) => {
        const date = e.target.value;
        if (date) {
            filteredImages = imagesData.filter(img => img.date === date);
            currentPage = 1;
            renderGallery();
        }
    });

    // Pagination
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredImages.length / ITEMS_PER_PAGE)) {
            currentPage++;
            renderGallery();
        }
    });

    // Lightbox close
    document.querySelector('.close-lightbox').addEventListener('click', () => {
        document.getElementById('lightbox').style.display = 'none';
    });
}

// --- Gallery Logic ---
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredImages.slice(start, end);

    if (pageItems.length === 0) {
        grid.innerHTML = '<p class="no-results">Không tìm thấy ảnh nào phù hợp.</p>';
    }

    pageItems.forEach(img => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <img src="${img.src}" alt="${img.caption}">
            <div class="image-info">
                <span class="image-date">${formatDate(img.date)}</span>
                <h3 class="image-caption">${img.caption}</h3>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.5rem;">${img.content}</p>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(img));
        grid.appendChild(card);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('span');
        btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderGallery();
        });
        pageNumbers.appendChild(btn);
    }

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

// --- Filter Logic ---
function filterByMonth(year, month) {
    filteredImages = imagesData.filter(img => img.year === year && img.month === month);
    currentPage = 1;
    showSection('images');
    renderGallery();
}

function resetFilters() {
    filteredImages = [...imagesData];
    currentPage = 1;
    document.getElementById('date-filter').value = '';
    renderGallery();
}

// --- Utils ---
function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = `<strong>${img.caption}</strong><br>${formatDate(img.date)}<br>${img.content}`;
    lightbox.style.display = 'flex';
}
