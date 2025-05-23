// 當文件完全載入後執行初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeElements();
        initializeNavigation();
		initializeReadingProgress();
        initializePracticeSections();
        initializeAnalysisButtons();
        setupTouchOptimizations();
        setupErrorHandling();
        
        // 預設顯示課文概覽
        showSection('explain');
        
        console.log('桃花源記頁面已初始化完成');
    } catch (error) {
        console.error('初始化過程發生錯誤：', error);
    }
});

// 初始化頁面元素
function initializeElements() {
    window.elements = {
        // 導航元素
        navTabs: document.querySelectorAll('.nav-tab'),
        sectionContents: document.querySelectorAll('.section-content'),
        
        // 課文概覽區域元素
        explainContent: {
            section: document.getElementById('explain-content'),
            text: document.querySelector('.explain-text'),
            practiceBtn: document.getElementById('showPracticeBtn'),
            practiceSection: document.querySelector('#explain-content .practice-section'),
            optionButtons: document.querySelectorAll('#explain-content .option-button'),
            checkAnswerBtn: document.getElementById('checkAnswerBtn'),
            answerSection: document.querySelector('#explain-content .answer-section'),
            closeButton: document.querySelector('#explain-content .close-practice-button')
        },
        
	

        // 作者介紹區域元素
        authorContent: {
            section: document.getElementById('author-content'),
            text: document.querySelector('.author-text'),
            practiceBtn: document.getElementById('showAuthorPracticeBtn'),
            practiceSection: document.querySelector('#author-content .practice-section'),
            optionButtons: document.querySelectorAll('#author-content .option-button'),
            checkAnswerBtn: document.getElementById('checkAuthorAnswerBtn'),
            answerSection: document.querySelector('#author-content .answer-section'),
            closeButton: document.querySelector('#author-content .close-practice-button')
        },
        
        // 詳細全文區域元素
        contentSections: document.querySelectorAll('.content-section')
    };
}

		// 初始化閱讀進度條
function initializeReadingProgress() {
    // 創建進度條元素
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    
    progressContainer.appendChild(progressBar);

// 將進度條插入到導航標籤下方
const contentArea = document.querySelector('.content-area');
const navigationTabs = document.querySelector('.navigation-tabs');
if (contentArea && navigationTabs) {
    navigationTabs.insertAdjacentElement('afterend', progressContainer);
}

    
    // 監聽滾動事件
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.addEventListener('scroll', updateReadingProgress);
    }
    
    // 監聽所有 section-content 的滾動
    document.querySelectorAll('.section-content').forEach(section => {
        section.addEventListener('scroll', updateReadingProgress);
    });
}

// 更新閱讀進度
function updateReadingProgress() {
    const activeSection = document.querySelector('.section-content.active');
    if (!activeSection) return;
    
    const scrollTop = activeSection.scrollTop;
    const scrollHeight = activeSection.scrollHeight - activeSection.clientHeight;
    
    if (scrollHeight <= 0) {
        document.querySelector('.reading-progress-bar').style.width = '100%';
        return;
    }
    
    const progress = (scrollTop / scrollHeight) * 100;
    document.querySelector('.reading-progress-bar').style.width = Math.min(progress, 100) + '%';
}
	
// 初始化導航功能
function initializeNavigation() {
    const { navTabs } = window.elements;
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.getAttribute('data-section');
            
            // 移除所有標籤的作用中狀態
            navTabs.forEach(t => t.classList.remove('active'));
            // 設定當前標籤為作用中
            this.classList.add('active');
            
            // 添加點擊動畫效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                showSection(section);
            }, 100);
        });

        // 添加鍵盤支援
        tab.setAttribute('tabindex', '0');
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// 顯示指定區段
function showSection(sectionId) {
    const { sectionContents } = window.elements;
    
    // 淡出效果
    sectionContents.forEach(section => {
        section.style.opacity = '0';
        setTimeout(() => {
            section.classList.remove('active');
            section.style.display = 'none';
        }, 150);
    });
    
    // 淡入新區段
    setTimeout(() => {
        const targetSection = document.getElementById(`${sectionId}-content`);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // 重置滾動位置
            targetSection.scrollTop = 0;
            
            setTimeout(() => {
                targetSection.style.opacity = '1';
                
                // 顯示對應的文字內容
                const textContent = targetSection.querySelector(`.${sectionId}-text`);
                if (textContent) {
                    textContent.style.display = 'flex';
                }
            }, 50);
        }
    }, 200);
    
    console.log(`切換到區段: ${sectionId}`);
}

// 初始化練習區段
function initializePracticeSections() {
    // 初始化課文概覽的練習區域
    initializeSectionPractice(window.elements.explainContent);
    // 初始化作者介紹的練習區域
    initializeSectionPractice(window.elements.authorContent);
    // 初始化詳細全文的練習區域
    initializeContentSectionsPractice();
}

// 初始化特定區段的練習功能
function initializeSectionPractice(sectionElements) {
    const { practiceBtn, practiceSection, optionButtons, checkAnswerBtn, closeButton } = sectionElements;
    
    if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
            showPracticeWithAnimation(practiceSection, practiceBtn);
        });
    }
    
    if (optionButtons) {
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                handleOptionSelection(button, checkAnswerBtn);
            });
        });
    }
    
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => {
            checkAnswers(practiceSection);
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closePracticeSection(practiceSection, practiceBtn);
        });
    }
}

// 初始化詳細全文區域的練習功能
function initializeContentSectionsPractice() {
    const { contentSections } = window.elements;
    
    contentSections.forEach(section => {
        const practiceBtn = section.querySelector('.practice-button');
        const practiceSection = section.querySelector('.practice-section');
        const optionButtons = section.querySelectorAll('.option-button');
        const checkAnswerBtn = section.querySelector('.check-answer-button');
        const closeButton = section.querySelector('.close-practice-button');
        
        if (practiceBtn) {
            practiceBtn.addEventListener('click', () => {
                showPracticeWithAnimation(practiceSection, practiceBtn);
            });
        }
        
        if (optionButtons) {
            optionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    handleOptionSelection(button, checkAnswerBtn);
                });
            });
        }
        
        if (checkAnswerBtn) {
            checkAnswerBtn.addEventListener('click', () => {
                checkAnswers(practiceSection);
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closePracticeSection(practiceSection, practiceBtn);
            });
        }
    });
}

// 顯示練習區域的動畫效果
function showPracticeWithAnimation(practiceSection, practiceBtn) {
    if (!practiceSection || !practiceBtn) return;
    
    // 隱藏練習按鈕
    practiceBtn.style.opacity = '0';
    practiceBtn.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        practiceBtn.style.display = 'none';
        practiceSection.style.display = 'block';
        practiceSection.style.opacity = '0';
        practiceSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            practiceSection.style.opacity = '1';
            practiceSection.style.transform = 'translateY(0)';
        }, 50);
    }, 200);
}

// 處理選項選擇
function handleOptionSelection(button, checkAnswerBtn) {
    const container = button.closest('.question-container, .sub-question-container');
    const isMultiSelect = button.classList.contains('multi-select');
    
    // 添加點擊反馈
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
    
    if (isMultiSelect) {
        button.classList.toggle('selected');
    } else {
        const options = container.querySelectorAll('.option-button');
        options.forEach(opt => opt.classList.remove('selected'));
        button.classList.add('selected');
    }
    
    updateCheckButtonState(checkAnswerBtn);
}

// 更新檢查按鈕狀態
function updateCheckButtonState(checkAnswerBtn) {
    if (!checkAnswerBtn) return;
    
    const practiceSection = checkAnswerBtn.closest('.practice-section');
    const questions = practiceSection.querySelectorAll('.question-container, .sub-question-container');
    let allAnswered = true;
    
    questions.forEach(question => {
        if (!question.querySelector('.option-button.selected')) {
            allAnswered = false;
        }
    });
    
    checkAnswerBtn.disabled = !allAnswered;
    
    if (allAnswered) {
        checkAnswerBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            checkAnswerBtn.style.transform = '';
        }, 200);
    }
}

// 檢查答案
function checkAnswers(practiceSection) {
    if (!practiceSection) return;
    
    const questions = practiceSection.querySelectorAll('.question-container, .sub-question-container');
    let allCorrect = true;
    let correctCount = 0;
    
    questions.forEach(question => {
        const isMultiSelect = question.querySelector('.multi-select') !== null;
        const selectedButtons = question.querySelectorAll('.option-button.selected');
        const selectedOptions = Array.from(selectedButtons).map(btn => btn.getAttribute('data-option'));
        
        let correctOptions;
        if (isMultiSelect) {
            correctOptions = question.getAttribute('data-correct-options').split('');
        } else {
            correctOptions = [question.getAttribute('data-correct-option')];
        }
        
        const isCorrect = compareAnswers(selectedOptions, correctOptions);
        markAnswers(question, selectedOptions, correctOptions);
        
        if (isCorrect) {
            correctCount++;
        } else {
            allCorrect = false;
        }
        
        // 為每個問題創建答案區域
        updateAnswerSection(question, isCorrect, correctOptions, isMultiSelect);
    });
    
    // 顯示總體結果
    showOverallResults(practiceSection, allCorrect, correctCount, questions.length);
    
    // 顯示關閉按鈕
    const closeButton = practiceSection.querySelector('.close-practice-button');
    if (closeButton) {
        setTimeout(() => {
            closeButton.style.display = 'block';
            closeButton.style.opacity = '0';
            closeButton.style.transform = 'translateY(10px)';
            setTimeout(() => {
                closeButton.style.opacity = '1';
                closeButton.style.transform = 'translateY(0)';
            }, 100);
        }, 500);
    }
}

// 更新答案區域
function updateAnswerSection(question, isCorrect, correctOptions, isMultiSelect) {
    let answerSection = question.querySelector('.answer-section');
    if (!answerSection) {
        answerSection = document.createElement('div');
        answerSection.className = 'answer-section';
        question.appendChild(answerSection);
    }
    
    const resultText = isCorrect ? '⭕ 答對了！' : '❌ 答錯了！';
    const correctAnswerText = isMultiSelect 
        ? `正確答案：${correctOptions.join('、')}` 
        : `正確答案：${correctOptions[0]}`;
        
    answerSection.innerHTML = `
        <div class="answer-result">
            <p class="result-text">${resultText}</p>
            <p class="correct-answer">${correctAnswerText}</p>
        </div>
    `;
    
    answerSection.style.display = 'block';
    answerSection.style.opacity = '0';
    answerSection.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        answerSection.style.opacity = '1';
        answerSection.style.transform = 'translateY(0)';
    }, 200);
}

// 顯示總體結果
function showOverallResults(practiceSection, allCorrect, correctCount, totalCount) {
    const checkAnswerBtn = practiceSection.querySelector('.check-answer-button');
    
    if (checkAnswerBtn) {
        checkAnswerBtn.style.display = 'none'; // 直接隱藏按鈕
        
        if (allCorrect) {
            setTimeout(() => {
                showNotification('🎉 全部答對！太棒了！', 'success');
            }, 800);
        } else {
            setTimeout(() => {
                showNotification(`完成測驗！答對 ${correctCount} 題，共 ${totalCount} 題`, 'info');
            }, 800);
        }
    }
}

// 比較答案
function compareAnswers(selected, correct) {
    if (!Array.isArray(selected) || !Array.isArray(correct)) return false;
    if (selected.length !== correct.length) return false;
    
    return selected.every(option => correct.includes(option)) &&
           correct.every(option => selected.includes(option));
}

// 標記答案
function markAnswers(question, selected, correct) {
    const options = question.querySelectorAll('.option-button');
    
    options.forEach(button => {
        const option = button.getAttribute('data-option');
        button.classList.remove('correct', 'incorrect');
        
        // 添加動畫延遲
        setTimeout(() => {
            const isMultiSelect = question.querySelector('.multi-select') !== null;

if (selected.includes(option)) {
    if (correct.includes(option)) {
        button.classList.add('my-correct');
        if (isMultiSelect) {
            button.innerHTML = button.innerHTML + ' <span class="answer-label">✓</span>';
        }
    } else {
        button.classList.add('my-incorrect');
        if (isMultiSelect) {
            button.innerHTML = button.innerHTML + ' <span class="answer-label">✗</span>';
        }
    }
} else if (correct.includes(option)) {
    button.classList.add('correct-answer');
    if (isMultiSelect) {
        button.innerHTML = button.innerHTML + ' <span class="answer-label">漏答</span>';
    }
}
            
            button.disabled = true;
        }, Math.random() * 300);
    });
}

// 關閉練習區段
function closePracticeSection(practiceSection, practiceBtn) {
    if (!practiceSection || !practiceBtn) return;
    
    // 重置所有狀態
    resetPracticeSection(practiceSection);
    
    // 隱藏練習區域
    practiceSection.style.opacity = '0';
    practiceSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        practiceSection.style.display = 'none';
        practiceBtn.style.display = 'block';
        practiceBtn.style.opacity = '0';
        practiceBtn.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            practiceBtn.style.opacity = '1';
            practiceBtn.style.transform = 'scale(1)';
        }, 100);
    }, 300);
}

// 重置練習區段
function resetPracticeSection(practiceSection) {
    // 重置選項按鈕
    const optionButtons = practiceSection.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.classList.remove('selected', 'correct', 'incorrect');
        button.disabled = false;
    });
    
    // 重置答案區域
    const answerSections = practiceSection.querySelectorAll('.answer-section');
    answerSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 重置檢查按鈕
const checkAnswerBtn = practiceSection.querySelector('.check-answer-button');
if (checkAnswerBtn) {
    checkAnswerBtn.disabled = true;
    checkAnswerBtn.textContent = '檢查答案';
    checkAnswerBtn.style.background = '#8b4513';
    checkAnswerBtn.style.display = 'block'; // 確保重新顯示
}
    
    // 隱藏關閉按鈕
    const closeButton = practiceSection.querySelector('.close-practice-button');
    if (closeButton) {
        closeButton.style.display = 'none';
    }
}

// 初始化段析按鈕
function initializeAnalysisButtons() {
    const analysisButtons = document.querySelectorAll('.analysis-button');
    
    analysisButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentSection = this.closest('.content-section');
            const analysisContent = contentSection.querySelector('.analysis-content');
            
            if (analysisContent) {
                this.classList.toggle('active');
                
                if (analysisContent.style.display === 'none' || !analysisContent.style.display) {
                    analysisContent.style.display = 'block';
                    analysisContent.style.opacity = '0';
                    analysisContent.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        analysisContent.style.opacity = '1';
                        analysisContent.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    analysisContent.style.opacity = '0';
                    analysisContent.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        analysisContent.style.display = 'none';
                    }, 200);
                }
            }
        });
    });
}

// 顯示通知訊息
function showNotification(message, type = 'info') {
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
    const touchElements = document.querySelectorAll('.nav-tab, .option-button, .practice-button, .check-answer-button, .close-practice-button');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
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
        console.error('JavaScript 執行錯誤：', event.message);
        showNotification('發生錯誤，請重新整理頁面', 'error');
        event.preventDefault();
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('未處理的 Promise 錯誤：', event.reason);
        event.preventDefault();
    });
}

// 導出函數供調試使用
window.BookApp = {
    showSection,
    showNotification,
    elements: () => window.elements
};
