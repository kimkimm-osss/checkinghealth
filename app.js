/**
 * NutriCheck - 메인 애플리케이션 로직
 * 스텝 네비게이션, UI 렌더링, 결과 표시
 */

// ===== 상태 관리 =====
const state = {
    currentStep: 'welcome', // welcome, basic, symptom-0 ~ symptom-6, analyzing, result
    basicInfo: {},
    answers: {},
    currentCategoryIndex: 0,
    totalSteps: 2 + SYMPTOM_CATEGORIES.length, // basic + categories + result
    result: null
};

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});

// ===== 시작하기 =====
function startCheck() {
    showStep('basic');
    document.getElementById('bottomNav').classList.remove('hidden');
    updateBottomNav();
}

// ===== 스텝 이동 =====
function showStep(stepId) {
    // 모든 스텝 숨기기
    document.querySelectorAll('.step-section').forEach(s => s.classList.add('hidden'));
    
    state.currentStep = stepId;

    if (stepId === 'welcome') {
        document.getElementById('step-welcome').classList.remove('hidden');
        document.getElementById('bottomNav').classList.add('hidden');
        document.getElementById('headerStepInfo').classList.add('hidden');
    } else if (stepId === 'basic') {
        document.getElementById('step-basic').classList.remove('hidden');
        document.getElementById('headerStepInfo').classList.remove('hidden');
        document.getElementById('headerStepText').textContent = 'STEP 1 / ' + state.totalSteps;
    } else if (stepId.startsWith('symptom-')) {
        const idx = parseInt(stepId.split('-')[1]);
        state.currentCategoryIndex = idx;
        renderSymptomCategory(idx);
        document.getElementById('step-symptoms').classList.remove('hidden');
        document.getElementById('headerStepInfo').classList.remove('hidden');
        document.getElementById('headerStepText').textContent = `STEP ${idx + 2} / ${state.totalSteps}`;
    } else if (stepId === 'analyzing') {
        document.getElementById('step-analyzing').classList.remove('hidden');
        document.getElementById('bottomNav').classList.add('hidden');
        document.getElementById('headerStepInfo').classList.add('hidden');
        runAnalysis();
    } else if (stepId === 'result') {
        document.getElementById('step-result').classList.remove('hidden');
        document.getElementById('bottomNav').classList.add('hidden');
        document.getElementById('headerStepInfo').classList.add('hidden');
    }

    updateProgress();
    updateBottomNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
    if (state.currentStep === 'basic') {
        if (!validateBasicInfo()) return;
        showStep('symptom-0');
    } else if (state.currentStep.startsWith('symptom-')) {
        const idx = parseInt(state.currentStep.split('-')[1]);
        if (idx < SYMPTOM_CATEGORIES.length - 1) {
            showStep('symptom-' + (idx + 1));
        } else {
            showStep('analyzing');
        }
    }
}

function prevStep() {
    if (state.currentStep === 'basic') {
        showStep('welcome');
    } else if (state.currentStep === 'symptom-0') {
        showStep('basic');
    } else if (state.currentStep.startsWith('symptom-')) {
        const idx = parseInt(state.currentStep.split('-')[1]);
        showStep('symptom-' + (idx - 1));
    }
}

// ===== 진행바 업데이트 =====
function updateProgress() {
    let progress = 0;
    if (state.currentStep === 'welcome') progress = 0;
    else if (state.currentStep === 'basic') progress = (1 / state.totalSteps) * 100;
    else if (state.currentStep.startsWith('symptom-')) {
        const idx = parseInt(state.currentStep.split('-')[1]);
        progress = ((idx + 2) / state.totalSteps) * 100;
    } else if (state.currentStep === 'analyzing' || state.currentStep === 'result') progress = 100;

    document.getElementById('progressBar').style.width = progress + '%';
}

// ===== 하단 네비 업데이트 =====
function updateBottomNav() {
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    const indicator = document.getElementById('stepIndicator');

    if (state.currentStep === 'welcome' || state.currentStep === 'analyzing' || state.currentStep === 'result') {
        return;
    }

    // 이전 버튼
    btnPrev.style.visibility = state.currentStep === 'basic' ? 'hidden' : 'visible';

    // 다음 버튼 텍스트
    if (state.currentStep.startsWith('symptom-')) {
        const idx = parseInt(state.currentStep.split('-')[1]);
        if (idx === SYMPTOM_CATEGORIES.length - 1) {
            btnNext.innerHTML = '결과 보기 <i class="fas fa-chart-bar ml-1 text-xs"></i>';
        } else {
            btnNext.innerHTML = '다음 <i class="fas fa-chevron-right text-xs ml-1"></i>';
        }
    } else {
        btnNext.innerHTML = '다음 <i class="fas fa-chevron-right text-xs ml-1"></i>';
    }

    // 다음 버튼 활성화 여부
    btnNext.disabled = !canProceed();

    // 인디케이터
    if (state.currentStep === 'basic') {
        indicator.textContent = '1 / ' + state.totalSteps;
    } else if (state.currentStep.startsWith('symptom-')) {
        const idx = parseInt(state.currentStep.split('-')[1]);
        indicator.textContent = (idx + 2) + ' / ' + state.totalSteps;
    }
}

function canProceed() {
    if (state.currentStep === 'basic') {
        return state.basicInfo.gender && state.basicInfo.age && state.basicInfo.lifestyle && state.basicInfo.diet;
    }
    // 증상 체크에서는 항상 진행 가능 (선택하지 않아도 됨)
    return true;
}

function validateBasicInfo() {
    if (!state.basicInfo.gender || !state.basicInfo.age || !state.basicInfo.lifestyle || !state.basicInfo.diet) {
        // 미선택 항목 하이라이트
        const missing = [];
        if (!state.basicInfo.gender) missing.push('성별');
        if (!state.basicInfo.age) missing.push('나이대');
        if (!state.basicInfo.lifestyle) missing.push('생활 패턴');
        if (!state.basicInfo.diet) missing.push('식습관');
        
        showToast(`${missing.join(', ')}을(를) 선택해주세요`);
        return false;
    }
    return true;
}

// ===== 옵션 선택 =====
function selectOption(btn) {
    const group = btn.dataset.group;
    const value = btn.dataset.value;

    // 같은 그룹의 다른 버튼 선택 해제
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');

    // 기본 정보 저장
    if (['gender', 'age', 'lifestyle', 'diet'].includes(group)) {
        state.basicInfo[group] = value;
    } else {
        state.answers[group] = value;
    }

    updateBottomNav();
}

function selectMultiOption(btn) {
    const group = btn.dataset.group;
    const value = btn.dataset.value;

    // 'none' 선택 시 다른 모두 해제
    if (value === 'none') {
        document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
            b.classList.remove('selected');
        });
        btn.classList.add('selected');
        state.answers[group] = ['none'];
        return;
    }

    // 'none' 해제
    const noneBtn = document.querySelector(`[data-group="${group}"][data-value="none"]`);
    if (noneBtn) noneBtn.classList.remove('selected');

    // 토글
    btn.classList.toggle('selected');

    // 선택된 값들 수집
    const selected = [];
    document.querySelectorAll(`[data-group="${group}"].selected`).forEach(b => {
        selected.push(b.dataset.value);
    });

    if (selected.length === 0) {
        // 아무것도 선택하지 않으면 none
        if (noneBtn) noneBtn.classList.add('selected');
        state.answers[group] = ['none'];
    } else {
        state.answers[group] = selected;
    }
}

// ===== 증상 카테고리 렌더링 =====
function renderSymptomCategory(idx) {
    const cat = SYMPTOM_CATEGORIES[idx];
    const container = document.getElementById('step-symptoms');

    let html = `
        <div class="step-header">
            <span class="step-badge">STEP ${idx + 2}</span>
            <h2 class="step-title"><i class="fas ${cat.iconFallback || cat.icon} mr-2 text-brand-500"></i>${cat.title}</h2>
            <p class="step-desc">${cat.description}</p>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-none" style="scrollbar-width: none;">
            ${SYMPTOM_CATEGORIES.map((c, i) => `
                <button class="symptom-category-tab flex-shrink-0 ${i === idx ? 'active' : ''}" 
                        onclick="showStep('symptom-${i}')" 
                        ${i > idx + 1 ? '' : ''}>
                    <i class="fas ${c.iconFallback || c.icon} text-xs"></i>
                    <span>${c.title.split(' & ')[0]}</span>
                    ${hasAnswersForCategory(i) ? '<i class="fas fa-check text-green-500 text-xs"></i>' : ''}
                </button>
            `).join('')}
        </div>
    `;

    cat.questions.forEach(q => {
        if (q.type === 'single') {
            html += renderSingleQuestion(q);
        } else if (q.type === 'multi') {
            html += renderMultiQuestion(q);
        }
    });

    container.innerHTML = html;

    // 기존 답변 복원
    restoreAnswers(cat);
}

function renderSingleQuestion(q) {
    let optionsHtml = '';
    
    if (q.options.length <= 3) {
        optionsHtml = `<div class="grid grid-cols-1 gap-2">
            ${q.options.map(opt => `
                <button class="option-btn-wide" data-group="${q.id}" data-value="${opt.value}" onclick="selectOption(this)">
                    <span class="text-lg flex-shrink-0 w-8 text-center">${opt.icon}</span>
                    <span class="font-medium text-sm">${opt.label}</span>
                </button>
            `).join('')}
        </div>`;
    } else {
        optionsHtml = `<div class="grid grid-cols-1 gap-2">
            ${q.options.map(opt => `
                <button class="option-btn-wide" data-group="${q.id}" data-value="${opt.value}" onclick="selectOption(this)">
                    <span class="text-lg flex-shrink-0 w-8 text-center">${opt.icon}</span>
                    <span class="font-medium text-sm">${opt.label}</span>
                </button>
            `).join('')}
        </div>`;
    }

    return `
        <div class="question-card">
            <label class="question-label">${q.text}</label>
            ${optionsHtml}
        </div>
    `;
}

function renderMultiQuestion(q) {
    return `
        <div class="question-card">
            <label class="question-label">${q.text} <span class="text-xs text-gray-400 font-normal ml-1">(복수선택 가능)</span></label>
            <div class="grid grid-cols-1 gap-2">
                ${q.options.map(opt => `
                    <button class="option-check" data-group="${q.id}" data-value="${opt.value}" onclick="selectMultiOption(this)">
                        <div class="check-box"></div>
                        <span class="text-lg flex-shrink-0">${opt.icon}</span>
                        <span class="text-sm">${opt.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== 답변 복원 =====
function restoreAnswers(cat) {
    cat.questions.forEach(q => {
        const answer = state.answers[q.id];
        if (!answer && answer !== 0) return;

        if (q.type === 'single') {
            const btn = document.querySelector(`[data-group="${q.id}"][data-value="${answer}"]`);
            if (btn) btn.classList.add('selected');
        } else if (q.type === 'multi') {
            const selected = Array.isArray(answer) ? answer : [answer];
            selected.forEach(val => {
                const btn = document.querySelector(`[data-group="${q.id}"][data-value="${val}"]`);
                if (btn) btn.classList.add('selected');
            });
        }
    });
}

function hasAnswersForCategory(catIndex) {
    const cat = SYMPTOM_CATEGORIES[catIndex];
    return cat.questions.some(q => state.answers[q.id] !== undefined);
}

// ===== 분석 실행 =====
function runAnalysis() {
    const dots = document.querySelectorAll('.analyze-dot');
    let step = 0;
    
    const interval = setInterval(() => {
        if (step < dots.length) {
            dots[step].style.background = '#22c55e';
        }
        step++;
    }, 500);

    // 1.5초 후 결과 표시 (분석 애니메이션 효과)
    setTimeout(() => {
        clearInterval(interval);
        state.result = analysisEngine.analyze(state.basicInfo, state.answers);
        renderResult(state.result);
        showStep('result');
    }, 2000);
}

// ===== 결과 렌더링 =====
function renderResult(result) {
    const container = document.getElementById('step-result');
    
    let html = `
        <!-- Hero Section -->
        <div class="result-hero">
            <div class="result-score-ring">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="${result.healthColor}" stroke-width="8"
                            stroke-dasharray="${2 * Math.PI * 42}" 
                            stroke-dashoffset="${2 * Math.PI * 42 * (1 - result.healthScore / 100)}"
                            stroke-linecap="round"
                            style="transition: stroke-dashoffset 1.5s ease-out;"/>
                </svg>
                <div class="score-text" style="color: ${result.healthColor}">${result.healthScore}</div>
            </div>
            <div class="text-lg font-bold text-gray-700 mb-1">영양 균형 점수</div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold" 
                 style="background: ${result.healthColor}15; color: ${result.healthColor}; border: 1px solid ${result.healthColor}30">
                등급 ${result.healthGrade} · ${result.healthLabel}
            </div>
            <div class="text-xs text-gray-400 mt-2">
                ${getProfileSummary(result.basicInfo)}
            </div>
        </div>

        <!-- Radar Chart -->
        <div class="question-card">
            <div class="result-section-title">
                <i class="fas fa-chart-radar text-brand-500"></i> 카테고리별 건강 상태
            </div>
            <div class="chart-container" style="height: 280px;">
                <canvas id="radarChart"></canvas>
            </div>
        </div>
    `;

    // 결핍 영양소
    if (result.topNutrients.length > 0) {
        html += `
            <div class="result-section-title mt-6">
                <i class="fas fa-seedling text-brand-500"></i> 이런 영양소를 챙겨보세요
            </div>
        `;

        result.topNutrients.forEach((nutrient, i) => {
            html += renderNutrientCard(nutrient, i);
        });
    } else {
        html += `
            <div class="question-card text-center py-8">
                <div class="text-4xl mb-3">🎉</div>
                <div class="font-bold text-gray-700 mb-1">영양 균형이 잘 잡혀 있어요!</div>
                <div class="text-sm text-gray-400">현재 균형 잡힌 영양 상태를 유지하고 계세요. 잘 하고 있습니다! 👏</div>
            </div>
        `;
    }

    // 맞춤 조언
    html += `
        <div class="result-section-title mt-6">
            <i class="fas fa-lightbulb text-yellow-500"></i> 맞춤 건강 조언
        </div>
    `;

    result.advice.forEach(adv => {
        html += `
            <div class="tip-card">
                <div class="flex items-start gap-3">
                    <span class="text-xl flex-shrink-0">${adv.icon}</span>
                    <div>
                        <div class="font-semibold text-gray-700 mb-1">${adv.title}</div>
                        <div class="text-gray-500 leading-relaxed">${adv.text}</div>
                    </div>
                </div>
            </div>
        `;
    });

    // 면책 조항
    html += `
        <div class="warning-card mt-4">
            <div class="flex items-start gap-2">
                <i class="fas fa-info-circle text-amber-500 mt-0.5 flex-shrink-0"></i>
                <div>
                    <strong>의료 면책 고지:</strong> 이 결과는 자가 체크 기반의 참고 정보이며, 의학적 진단이나 처방을 대체하지 않습니다. 
                    정확한 건강 상태 확인을 위해 전문 의료진과 상담하시기 바랍니다.
                </div>
            </div>
        </div>
    `;

    // 하단 버튼
    html += `
        <div class="flex gap-3 mt-6 mb-4">
            <button onclick="restartCheck()" class="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <i class="fas fa-redo text-xs"></i> 다시 체크하기
            </button>
            <button onclick="shareResult()" class="flex-1 py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm">
                <i class="fas fa-share-alt text-xs"></i> 결과 공유
            </button>
        </div>
    `;

    container.innerHTML = html;

    // 차트 그리기 (약간의 딜레이)
    setTimeout(() => drawRadarChart(result), 300);
}

function renderNutrientCard(nutrient, index) {
    const foodTags = nutrient.foods.slice(0, 5).map(f => 
        `<span class="food-tag"><i class="fas fa-utensils text-green-400 text-[0.6rem]"></i>${f}</span>`
    ).join('');

    const symptomList = nutrient.symptoms.slice(0, 4).map(s => 
        `<span class="text-gray-500">· ${s}</span>`
    ).join(' ');

    return `
        <div class="nutrient-card severity-${nutrient.severity}" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                    <span class="text-xl">${nutrient.emoji}</span>
                    <div>
                        <div class="font-bold text-gray-800 text-sm">${nutrient.name}</div>
                        <div class="text-xs text-gray-400">${nutrient.description.substring(0, 30)}...</div>
                    </div>
                </div>
                <span class="severity-badge-${nutrient.severity} text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                    ${nutrient.severityLabel}
                </span>
            </div>
            
            <!-- Score bar -->
            <div class="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div class="h-full rounded-full transition-all duration-1000 ${
                    nutrient.severity === 'high' ? 'bg-amber-400' : 
                    nutrient.severity === 'medium' ? 'bg-blue-400' : 'bg-gray-300'
                }" style="width: ${Math.min(nutrient.score * 8, 100)}%; transition-delay: ${index * 0.1}s;"></div>
            </div>

            <!-- Symptoms -->
            <div class="text-xs mb-2 flex flex-wrap gap-x-2 gap-y-0.5">${symptomList}</div>
            
            <!-- Foods -->
            <div class="mb-2">
                <div class="text-xs text-gray-400 mb-1"><i class="fas fa-carrot mr-1"></i>권장 식품</div>
                <div class="flex flex-wrap">${foodTags}</div>
            </div>

            <!-- RDA -->
            <div class="text-xs text-gray-400 flex items-center gap-1">
                <i class="fas fa-info-circle"></i>
                <span>일일 권장량: ${nutrient.rda}</span>
            </div>

            <!-- Expandable detail -->
            <details class="mt-2">
                <summary class="text-xs text-brand-600 cursor-pointer font-medium hover:text-brand-700">
                    <i class="fas fa-chevron-down text-[0.6rem] mr-1"></i>상세 정보 보기 (약사 상담용)
                </summary>
                <div class="mt-2 space-y-3">
                    ${nutrient.evidences && nutrient.evidences.length > 0 ? `
                    <!-- 설문 응답 근거 -->
                    <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <div class="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                            <i class="fas fa-clipboard-list"></i> 추천 근거 (설문 응답)
                        </div>
                        <div class="space-y-1.5">
                            ${nutrient.evidences.map(ev => `
                                <div class="flex items-start gap-2 text-xs">
                                    <span class="flex-shrink-0 w-4 h-4 rounded bg-amber-100 flex items-center justify-center mt-0.5">
                                        <i class="fas ${ev.categoryIcon} text-amber-500" style="font-size: 0.55rem;"></i>
                                    </span>
                                    <div class="text-gray-600 leading-relaxed">
                                        <span class="text-gray-400">${ev.categoryTitle} ›</span> 
                                        ${ev.questionText}<br>
                                        <span class="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 bg-white rounded border border-amber-100 font-medium text-gray-700">
                                            ${ev.answerIcon} ${ev.answerText}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    <!-- 영양소 상세 정보 -->
                    <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed">
                        <p class="mb-1"><strong>설명:</strong> ${nutrient.description}</p>
                        <p class="mb-1"><strong>관련 증상:</strong> ${nutrient.symptoms.join(', ')}</p>
                        <p class="mb-1"><strong>권장 식품:</strong> ${nutrient.foods.join(', ')}</p>
                        <p><strong>💡 참고:</strong> ${nutrient.caution}</p>
                    </div>
                </div>
            </details>
        </div>
    `;
}

// ===== 레이더 차트 =====
function drawRadarChart(result) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const categories = Object.values(result.categoryScores);
    const labels = categories.map(c => c.title);
    const scores = categories.map(c => c.score);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '건강 상태',
                data: scores,
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                borderColor: 'rgba(34, 197, 94, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 25,
                        display: true,
                        font: { size: 9 },
                        color: '#94a3b8',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.06)'
                    },
                    angleLines: {
                        color: 'rgba(0,0,0,0.06)'
                    },
                    pointLabels: {
                        font: { size: 11, weight: '600', family: 'Noto Sans KR' },
                        color: '#475569'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            return ctx.parsed.r + '점';
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// ===== 프로필 요약 =====
function getProfileSummary(info) {
    const genderMap = { male: '남성', female: '여성' };
    const ageMap = { '10s': '10대', '20s': '20대', '30s': '30대', '40s': '40대', '50s': '50대', '60plus': '60대 이상' };
    const lifestyleMap = { sedentary: '주로 앉아서 생활', moderate: '보통 활동', active: '활발한 활동', very_active: '매우 활발한 활동' };
    const dietMap = { regular: '일반식', meat_heavy: '육류 위주', carb_heavy: '탄수화물 위주', irregular: '불규칙 식사', vegetarian: '채식 위주' };

    return `${genderMap[info.gender]} · ${ageMap[info.age]} · ${lifestyleMap[info.lifestyle]} · ${dietMap[info.diet]}`;
}

// ===== 다시하기 =====
function restartCheck() {
    state.currentStep = 'welcome';
    state.basicInfo = {};
    state.answers = {};
    state.currentCategoryIndex = 0;
    state.result = null;

    // 기본정보 선택 초기화
    document.querySelectorAll('#step-basic .selected').forEach(b => b.classList.remove('selected'));

    showStep('welcome');
}

// ===== 공유 =====
function shareResult() {
    if (!state.result) return;

    const r = state.result;
    const text = `🌿 NutriCheck 자가건강체크 결과\n\n` +
        `📊 영양 균형 점수: ${r.healthScore}점 (등급 ${r.healthGrade})\n` +
        `📋 ${r.healthLabel}\n\n` +
        (r.topNutrients.length > 0 ? 
            `💊 챙기면 좋은 영양소:\n${r.topNutrients.slice(0, 5).map(n => `  ${n.emoji} ${n.name} (${n.severityLabel})`).join('\n')}\n\n` : 
            '✅ 영양 균형 양호\n\n') +
        `👉 나도 체크하기: ${window.location.href}`;

    if (navigator.share) {
        navigator.share({
            title: 'NutriCheck 건강체크 결과',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('결과가 클립보드에 복사되었습니다!');
        }).catch(() => {
            showToast('공유 기능을 사용할 수 없습니다.');
        });
    }
}

// ===== 토스트 메시지 =====
function showToast(message) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg fixed top-16 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-xl shadow-lg z-50';
    toast.style.animation = 'fadeIn 0.3s ease-out';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
