// 當文件完全載入後執行初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeArticleSelection();
        setupTouchOptimizations();
        setupErrorHandling();
        setupAccessibility();
        
        console.log('臺灣女性古典詩文選選文頁面已初始化完成');
    } catch (error) {
        console.error('初始化過程發生錯誤：', error);
    }
});

// 初始化文章選擇功能
function initializeArticleSelection() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const articleType = card.getAttribute('data-article');
        
        // 點擊事件
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const articleTitle = this.querySelector('.article-title').textContent;
            console.log(`正在開啟：${articleTitle}`);
            
            // 添加點擊動畫效果
            this.style.transform = 'translateY(-6px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = '';
                // 跳轉到對應的文章頁面
                navigateToArticle(articleType);
            }, 150);
        });

        // 鍵盤支援
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // 滑鼠進入效果
        card.addEventListener('mouseenter', function() {
            const articleTitle = this.querySelector('.article-title').textContent;
            console.log(`預覽：${articleTitle}`);
            
            // 添加微妙的音效反饋（如果需要的話）
            playHoverSound();
        });

        // 焦點事件（無障礙）
        card.addEventListener('focus', function() {
            this.style.outline = '3px solid rgba(139, 69, 19, 0.5)';
            this.style.outlineOffset = '2px';
        });

        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// 導航到指定文章
function navigateToArticle(articleType) {
    const articlePages = {
        'huaju': 'huaju.html',
        'nvxuesheng': 'nvxuesheng.html'
    };
    
    const targetPage = articlePages[articleType];
    
    if (targetPage) {
        // 顯示載入提示
        showLoadingIndicator();
        
        // 模擬載入時間，然後跳轉
        setTimeout(() => {
            window.location.href = targetPage;
        }, 300);
    } else {
        console.error(`未找到對應的文章頁面：${articleType}`);
        showNotification('頁面載入失敗，請重試', 'error');
    }
}

// 顯示載入指示器
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>載入中...</p>
    `;
    
    // 設定載入指示器樣式
    Object.assign(loadingDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(139, 69, 19, 0.1)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '9999',
        color: 'var(--accent-brown)',
        fontSize: '1.2em',
        fontWeight: '600'
    });
    
    // 添加旋轉動畫的樣式
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(139, 69, 19, 0.2);
            border-top: 4px solid var(--accent-brown);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingDiv);
}

// 播放懸停音效（可選功能）
function playHoverSound() {
    // 這裡可以添加音效，但為了不干擾用戶，暫時留空
    // 如果需要，可以添加非常輕微的音效反饋
}

// 顯示通知訊息
function showNotification(message, type = 'info') {
    // 移除現有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        success: { bg: 'rgba(34, 139, 34, 0.95)', border: 'rgba(34, 139, 34, 0.3)' },
        error: { bg: 'rgba(220, 20, 60, 0.95)', border: 'rgba(220, 20, 60, 0.3)' },
        info: { bg: 'rgba(139, 69, 19, 0.95)', border: 'rgba(139, 69, 19, 0.3)' }
    };
    
    const color = colors[type] || colors.info;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: color.bg,
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '15px',
        fontSize: '1.1em',
        fontWeight: '600',
        zIndex: '1000',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${color.border}`,
        opacity: '0',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1.05)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
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
    const touchElements = document.querySelectorAll('.article-card, .back-button');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                if (!this.matches(':hover')) {
                    this.style.transform = '';
                }
            }, 100);
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// 設定無障礙功能
function setupAccessibility() {
    // 為文章卡片添加適當的 ARIA 標籤
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach((card, index) => {
        const articleTitle = card.querySelector('.article-title').textContent;
        const authorName = card.querySelector('.author-name').textContent;
        
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `選擇文章：${articleTitle}，作者：${authorName}`);
        card.setAttribute('aria-describedby', `article-preview-${index}`);
        
        const preview = card.querySelector('.article-preview');
        if (preview) {
            preview.id = `article-preview-${index}`;
        }
    });
    
    // 鍵盤導航支援
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // ESC 鍵返回上一頁
            if (confirm('確定要返回上一頁嗎？')) {
                window.history.back();
            }
        }
    });
}

// 設定錯誤處理
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript 執行錯誤：', event.message);
        showNotification('頁面發生錯誤，請重新整理', 'error');
        event.preventDefault();
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('未處理的 Promise 錯誤：', event.reason);
        event.preventDefault();
    });
}

// 效能優化：預載入文章頁面
function preloadArticlePages() {
    const articlePages = ['huaju.html', 'nvxuesheng.html'];
    
    articlePages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// 在頁面載入完成後預載入
window.addEventListener('load', function() {
    // 延遲預載入，避免影響主要內容載入
    setTimeout(preloadArticlePages, 1000);
});

// 工具函數：平滑捲動到指定元素
function scrollToElement(element, behavior = 'smooth') {
    if (element) {
        element.scrollIntoView({
            behavior: behavior,
            block: 'center',
            inline: 'nearest'
        });
    }
}

// 導出函數供調試使用
window.BookApp = {
    navigateToArticle,
    showNotification,
    scrollToElement
};