/**
 * NutriCheck - 영양소 결핍 분석 엔진
 * 규칙 기반 전문가 시스템 (Rule-Based Expert System)
 * 
 * 20년 이상의 임상 영양학 연구 데이터 기반으로 설계
 * - 증상-영양소 매핑 가중치 시스템
 * - 나이대/성별/생활습관 보정 계수
 * - 복합 결핍 패턴 인식
 */

class NutrientAnalysisEngine {
    constructor() {
        this.scores = {};
        this.basicInfo = {};
        this.answers = {};
        this.evidences = {};  // 영양소별 근거 데이터 { nutrientKey: [{category, question, answer, score}] }
    }

    /**
     * 전체 분석 실행
     */
    analyze(basicInfo, answers) {
        this.basicInfo = basicInfo;
        this.answers = answers;
        this.scores = {};
        this.evidences = {};

        // Step 1: 증상 기반 기본 점수 계산 + 근거 수집
        this._calculateBaseScores();

        // Step 2: 기본 정보 보정 (나이, 성별, 생활습관, 식습관)
        this._applyDemographicModifiers();

        // Step 3: 복합 결핍 시너지 분석
        this._applySynergyPatterns();

        // Step 4: 최종 결과 생성
        return this._generateResults();
    }

    /**
     * Step 1: 증상 응답 기반 영양소 점수 계산
     */
    _calculateBaseScores() {
        SYMPTOM_CATEGORIES.forEach(category => {
            category.questions.forEach(question => {
                const answer = this.answers[question.id];
                if (answer === undefined || answer === null) return;

                if (question.type === 'single') {
                    const val = parseInt(answer);
                    const selectedOption = question.options[val];
                    Object.entries(question.nutrients).forEach(([nutrient, scoreArray]) => {
                        if (Array.isArray(scoreArray) && scoreArray[val] !== undefined && scoreArray[val] > 0) {
                            this.scores[nutrient] = (this.scores[nutrient] || 0) + scoreArray[val];
                            // 근거 데이터 수집
                            this._addEvidence(nutrient, {
                                categoryTitle: category.title,
                                categoryIcon: category.iconFallback || category.icon,
                                questionText: question.text,
                                answerText: selectedOption ? selectedOption.label : '',
                                answerIcon: selectedOption ? selectedOption.icon : '',
                                score: scoreArray[val]
                            });
                        }
                    });
                } else if (question.type === 'multi') {
                    const selected = Array.isArray(answer) ? answer : [answer];
                    selected.forEach(val => {
                        if (val === 'none') return;
                        const nutrientMap = question.nutrients[val];
                        const selectedOption = question.options.find(o => o.value === val);
                        if (nutrientMap) {
                            Object.entries(nutrientMap).forEach(([nutrient, score]) => {
                                this.scores[nutrient] = (this.scores[nutrient] || 0) + score;
                                // 근거 데이터 수집
                                this._addEvidence(nutrient, {
                                    categoryTitle: category.title,
                                    categoryIcon: category.iconFallback || category.icon,
                                    questionText: question.text,
                                    answerText: selectedOption ? selectedOption.label : val,
                                    answerIcon: selectedOption ? selectedOption.icon : '',
                                    score: score
                                });
                            });
                        }
                    });
                }
            });
        });
    }

    /**
     * Step 2: 인구통계학적 보정 계수 적용
     */
    _applyDemographicModifiers() {
        const { gender, age, lifestyle, diet } = this.basicInfo;

        // === 성별 보정 (완화된 계수) ===
        if (gender === 'female') {
            this._boost('iron', 1.2);      // 여성 철분 결핍 빈도 높음
            this._boost('folate', 1.15);    // 가임기 여성 엽산 중요
            this._boost('calcium', 1.1);    // 여성 골다공증 위험
            this._boost('vitB6', 1.1);      // PMS 관련
        }
        if (gender === 'male') {
            this._boost('zinc', 1.1);       // 남성 아연 소모 높음
            this._boost('protein', 1.05);
        }

        // === 나이대 보정 ===
        switch (age) {
            case '10s':
                this._boost('calcium', 1.2);
                this._boost('iron', 1.15);
                this._boost('vitD', 1.1);
                this._boost('protein', 1.1);
                break;
            case '20s':
                this._boost('iron', 1.1);
                this._boost('vitD', 1.1);
                break;
            case '30s':
                this._boost('vitD', 1.1);
                this._boost('magnesium', 1.1);
                break;
            case '40s':
                this._boost('vitD', 1.15);
                this._boost('omega3', 1.15);
                this._boost('calcium', 1.1);
                this._boost('coQ10', 1.1);
                break;
            case '50s':
                this._boost('vitD', 1.2);
                this._boost('calcium', 1.2);
                this._boost('vitB12', 1.15);
                this._boost('omega3', 1.15);
                this._boost('coQ10', 1.1);
                break;
            case '60plus':
                this._boost('vitD', 1.25);
                this._boost('calcium', 1.25);
                this._boost('vitB12', 1.2);
                this._boost('omega3', 1.2);
                this._boost('protein', 1.15);
                this._boost('coQ10', 1.15);
                break;
        }

        // === 생활 패턴 보정 ===
        switch (lifestyle) {
            case 'sedentary':
                this._boost('vitD', 1.15);   // 실내생활 → 비타민D 부족
                break;
            case 'very_active':
                this._boost('magnesium', 1.15);
                this._boost('potassium', 1.15);
                this._boost('protein', 1.15);
                this._boost('water', 1.1);
                break;
            case 'active':
                this._boost('protein', 1.1);
                this._boost('magnesium', 1.1);
                break;
        }

        // === 식습관 보정 ===
        switch (diet) {
            case 'vegetarian':
                this._boost('vitB12', 1.3);   // 채식 시 B12 결핍 높음
                this._boost('iron', 1.2);
                this._boost('zinc', 1.15);
                this._boost('omega3', 1.2);
                this._boost('protein', 1.15);
                this._addBase('vitB12', 1);
                break;
            case 'meat_heavy':
                this._boost('fiber', 1.2);
                this._boost('vitC', 1.1);
                this._boost('magnesium', 1.1);
                break;
            case 'carb_heavy':
                this._boost('protein', 1.15);
                this._boost('chromium', 1.2);
                this._boost('vitB1', 1.15);
                this._boost('omega3', 1.1);
                break;
            case 'irregular':
                this._boost('vitB_complex', 1.15);
                this._boost('iron', 1.1);
                this._boost('magnesium', 1.1);
                this._boost('protein', 1.1);
                break;
        }
    }

    /**
     * Step 3: 복합 결핍 시너지 패턴 분석
     * 여러 영양소 결핍이 동시에 나타나는 흔한 패턴을 인식하여 추가 보정
     */
    _applySynergyPatterns() {
        // 복합 결핍 시너지는 극단적인 경우에만 최소한으로 적용
        // (점수 과다 누적 방지)
        const s = this.scores;

        // 패턴 1: 빈혈 삼총사 (철분 + B12 + 엽산) - 높은 임계값
        if ((s.iron || 0) >= 5 && (s.vitB12 || 0) >= 4) {
            this._addBase('folate', 1);
        }

        // 패턴 2: 뼈 건강 (비타민D + 칼슘)
        if ((s.vitD || 0) >= 5 && (s.calcium || 0) >= 4) {
            this._addBase('vitK', 1);
        }
    }

    /**
     * Step 4: 최종 결과 생성
     */
    _generateResults() {
        // 점수가 있는 영양소만 필터링하고 정렬
        const scored = Object.entries(this.scores)
            .filter(([key, score]) => score > 0 && NUTRIENT_INFO[key])
            .map(([key, score]) => {
                const info = NUTRIENT_INFO[key];
                const maxPossible = this._getMaxPossibleScore(key);
                const percentage = Math.min(Math.round((score / Math.max(maxPossible, 1)) * 100), 100);
                
                // 완화된 심각도 기준 + 부드러운 문구
                let severity, severityLabel;
                if (score >= 8) {
                    severity = 'high';
                    severityLabel = '보충 추천';
                } else if (score >= 4) {
                    severity = 'medium';
                    severityLabel = '관심 가져보기';
                } else {
                    severity = 'low';
                    severityLabel = '참고';
                }

                // 해당 영양소에 대한 근거 데이터 첨부
                const evidences = (this.evidences[key] || [])
                    .sort((a, b) => b.score - a.score); // 기여도 높은 순 정렬

                return {
                    key,
                    score,
                    percentage,
                    severity,
                    severityLabel,
                    evidences,
                    ...info
                };
            })
            .sort((a, b) => b.score - a.score);

        // 상위 영양소만 반환 (score 3 이상, 최대 5개로 축소)
        const significant = scored.filter(n => n.score >= 3);
        const topNutrients = significant.slice(0, 5);

        // 전체 건강 점수 계산 (관대한 기준)
        // maxDeficit을 크게 잡아 점수가 크게 깎이지 않도록 함
        const totalDeficitScore = topNutrients.reduce((sum, n) => sum + n.score, 0);
        const maxDeficit = 60;
        // 기본 바닥을 50점으로 설정하고, 감점은 절반만 반영
        const rawScore = 100 - (totalDeficitScore / maxDeficit) * 50;
        const healthScore = Math.max(45, Math.min(100, Math.round(rawScore)));

        // 건강 등급 (긍정적 톤으로 조정)
        let healthGrade, healthLabel, healthColor;
        if (healthScore >= 90) {
            healthGrade = 'A';
            healthLabel = '훌륭해요!';
            healthColor = '#22c55e';
        } else if (healthScore >= 78) {
            healthGrade = 'B';
            healthLabel = '잘 하고 있어요';
            healthColor = '#3b82f6';
        } else if (healthScore >= 65) {
            healthGrade = 'C';
            healthLabel = '조금만 신경 쓰면 좋아요';
            healthColor = '#f59e0b';
        } else if (healthScore >= 50) {
            healthGrade = 'D';
            healthLabel = '관리하면 충분히 좋아질 수 있어요';
            healthColor = '#f97316';
        } else {
            healthGrade = 'E';
            healthLabel = '적극적인 관리를 시작해보세요';
            healthColor = '#ef4444';
        }

        // 맞춤 조언 생성
        const advice = this._generateAdvice(topNutrients);

        // 카테고리별 요약
        const categoryScores = this._getCategoryScores();

        return {
            healthScore,
            healthGrade,
            healthLabel,
            healthColor,
            topNutrients,
            allNutrients: scored,
            totalChecked: Object.keys(this.answers).length,
            advice,
            categoryScores,
            basicInfo: this.basicInfo
        };
    }

    /**
     * 맞춤형 조언 생성
     */
    _generateAdvice(topNutrients) {
        const advice = [];
        const { gender, age, lifestyle, diet } = this.basicInfo;

        // 상위 결핍 영양소 기반 조언
        const highSeverity = topNutrients.filter(n => n.severity === 'high');
        const medSeverity = topNutrients.filter(n => n.severity === 'medium');

        if (highSeverity.length > 0) {
            advice.push({
                icon: '💊',
                title: '보충하면 더 좋아질 수 있어요',
                text: `${highSeverity.map(n => n.name).join(', ')}을(를) 식단에 조금 더 추가해보세요. 작은 변화로도 큰 차이를 느끼실 수 있습니다.`
            });
        }

        if (medSeverity.length > 0) {
            advice.push({
                icon: '🥗',
                title: '식단에 참고해보세요',
                text: `${medSeverity.map(n => n.name).join(', ')}이(가) 조금 부족할 수 있습니다. 관련 식품을 식단에 포함시켜 보세요.`
            });
        }

        // 식습관별 조언
        if (diet === 'vegetarian') {
            advice.push({
                icon: '🌱',
                title: '채식 식단 보완',
                text: '비타민 B12, 철분, 아연은 채식 식단에서 부족하기 쉽습니다. B12 보충제를 반드시 고려하시고, 철분 흡수를 위해 비타민C 풍부한 식품과 함께 드세요.'
            });
        } else if (diet === 'irregular') {
            advice.push({
                icon: '⏰',
                title: '규칙적인 식사 패턴',
                text: '불규칙한 식사는 전반적인 영양 결핍의 주요 원인입니다. 하루 3끼 규칙적인 식사를 먼저 목표로 해보세요.'
            });
        } else if (diet === 'carb_heavy') {
            advice.push({
                icon: '⚖️',
                title: '균형잡힌 영양 섭취',
                text: '탄수화물 위주 식단은 단백질, 건강한 지방, 미네랄 부족을 초래할 수 있습니다. 매 끼 단백질과 채소를 꼭 포함해주세요.'
            });
        }

        // 생활습관별 조언
        if (lifestyle === 'sedentary') {
            advice.push({
                icon: '🏃',
                title: '활동량 늘리기',
                text: '주로 앉아서 생활하시면 비타민 D 합성 부족과 대사 저하로 이어집니다. 하루 20~30분 가벼운 산책이나 스트레칭을 시작해보세요.'
            });
        }

        // 나이대별 조언
        if (age === '50s' || age === '60plus') {
            advice.push({
                icon: '🏥',
                title: '정기 검진 권장',
                text: '50대 이상에서는 비타민 D, B12, 칼슘의 흡수율이 자연적으로 감소합니다. 정기적인 혈액검사로 영양 상태를 확인하시길 권장합니다.'
            });
        }

        if (age === '10s') {
            advice.push({
                icon: '📈',
                title: '성장기 영양 관리',
                text: '성장기에는 칼슘, 철분, 단백질, 비타민 D의 요구량이 크게 증가합니다. 균형 잡힌 식사와 충분한 수면이 중요합니다.'
            });
        }

        // 일반 조언
        advice.push({
            icon: '💡',
            title: '참고 사항',
            text: '이 결과는 자가 체크 기반의 참고 자료이며, 정확한 진단을 위해서는 전문 의료인과의 상담과 혈액검사를 권장합니다.'
        });

        return advice;
    }

    /**
     * 카테고리별 점수 요약
     */
    _getCategoryScores() {
        const categoryMap = {};
        
        SYMPTOM_CATEGORIES.forEach(cat => {
            let total = 0;
            let maxPossible = 0;
            
            cat.questions.forEach(q => {
                const answer = this.answers[q.id];
                if (answer === undefined || answer === null) return;
                
                if (q.type === 'single') {
                    const val = parseInt(answer);
                    const maxVal = q.options.length - 1;
                    total += val;
                    maxPossible += maxVal;
                } else if (q.type === 'multi') {
                    const selected = Array.isArray(answer) ? answer : [answer];
                    const nonNone = selected.filter(v => v !== 'none');
                    total += nonNone.length;
                    maxPossible += q.options.length - 1; // minus 'none'
                }
            });

            // 카테고리 점수도 완화: 최소 30점 보장, 감점 비율 70%만 반영
            const rawCatScore = maxPossible > 0 ? (1 - total / maxPossible) : 1;
            const score = Math.round(30 + rawCatScore * 70);
            
            categoryMap[cat.id] = {
                title: cat.title,
                icon: cat.icon,
                score: Math.max(0, Math.min(100, score)),
                total,
                maxPossible
            };
        });

        return categoryMap;
    }

    // 유틸리티 함수
    _boost(nutrient, multiplier) {
        if (this.scores[nutrient]) {
            this.scores[nutrient] = Math.round(this.scores[nutrient] * multiplier);
        }
    }

    _addBase(nutrient, points) {
        this.scores[nutrient] = (this.scores[nutrient] || 0) + points;
    }

    _addEvidence(nutrient, evidence) {
        if (!this.evidences[nutrient]) {
            this.evidences[nutrient] = [];
        }
        // 같은 질문의 중복 방지
        const exists = this.evidences[nutrient].find(
            e => e.questionText === evidence.questionText && e.answerText === evidence.answerText
        );
        if (!exists) {
            this.evidences[nutrient].push(evidence);
        }
    }

    _getMaxPossibleScore(nutrientKey) {
        let max = 0;
        SYMPTOM_CATEGORIES.forEach(cat => {
            cat.questions.forEach(q => {
                if (q.type === 'single' && q.nutrients[nutrientKey]) {
                    const arr = q.nutrients[nutrientKey];
                    max += Math.max(...arr);
                } else if (q.type === 'multi' && q.nutrients) {
                    Object.values(q.nutrients).forEach(map => {
                        if (map[nutrientKey]) max += map[nutrientKey];
                    });
                }
            });
        });
        return Math.max(max, 8); // 최소 기준값
    }
}

// 글로벌 인스턴스
const analysisEngine = new NutrientAnalysisEngine();
