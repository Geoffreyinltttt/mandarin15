document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeBookInteractions();
        setupTouchOptimizations();
        setupErrorHandling();
        
        console.log('古文十五小老師已初始化完成');
    } catch (error) {
        console.error('初始化過程發生錯誤：', error);
    }
});

// 初始化書籍互動功能
function initializeBookInteractions() {
    // 處理可點擊的書籍
    const clickableBooks = document.querySelectorAll('.book-item:not(.locked)');
    clickableBooks.forEach(book => {
        const url = book.getAttribute('data-url');
        if (url) {
            book.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`正在開啟：${this.querySelector('.book-title').textContent}`);
                
                // 添加點擊動畫效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.location.href = url;
                }, 150);
            });

            // 添加鍵盤支援
            book.setAttribute('tabindex', '0');
            book.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });

    // 處理鎖定書籍的懸停效果
    const lockedBooks = document.querySelectorAll('.book-item.locked');
    lockedBooks.forEach(book => {
        book.addEventListener('mouseenter', function() {
            console.log(`《${this.querySelector('.book-title').textContent}》尚未開放`);
        });

        // 添加點擊提示
        book.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('此課程尚未開放，敬請期待！');
        });
    });

    // 確保圖片正確載入
    const images = document.querySelectorAll('.book-image');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`圖片載入失敗: ${this.alt}`);
            this.src = 'images/placeholder.jpg';
            this.alt = `${this.alt} (圖片載入中...)`;
        });

        img.addEventListener('load', function() {
            console.log(`圖片載入成功: ${this.alt}`);
        });
    });
}

// 顯示通知訊息
function showNotification(message) {
    // 移除現有的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 創建新通知
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 設定樣式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(139, 69, 19, 0.95)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '10px',
        fontSize: '1.1em',
        fontWeight: '600',
        zIndex: '1000',
        boxShadow: '0 8px 24px rgba(139, 69, 19, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        opacity: '0',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // 顯示動畫
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1.05)';
    }, 10);

    // 自動隱藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 2000);
}

// 設定觸控優化
function setupTouchOptimizations() {
    // 防止多指觸控縮放
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // 防止雙擊縮放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 優化觸控回饋
    const touchElements = document.querySelectorAll('.book-item, .volume-header');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }, { passive: true });

        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// 設定錯誤處理
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript 執行錯誤：', event.message, '於', event.filename, '第', event.lineno, '行');
        event.preventDefault();
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error('未處理的 Promise 錯誤：', event.reason);
        event.preventDefault();
    });
}

// 工具函數：平滑滾動到指定元素
function scrollToElement(element, behavior = 'smooth') {
    if (element) {
        element.scrollIntoView({
            behavior: behavior,
            block: 'start',
            inline: 'nearest'
        });
    }
}

// 工具函數：檢查元素是否在視口中
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 性能優化：延遲載入圖片
function lazyLoadImages() {
    const images = document.querySelectorAll('.book-image[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 如果支援 IntersectionObserver 則啟用延遲載入
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}

// 導出函數供其他腳本使用
window.GuWenApp = {
    scrollToElement,
    isElementInViewport,
    showNotification
};