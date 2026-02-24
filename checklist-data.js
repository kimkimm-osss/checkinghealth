/**
 * NutriCheck - 증상 체크리스트 데이터
 * 20년 이상의 임상 영양학 연구 기반 설계
 * 각 증상은 관련 영양소 결핍 및 가중치와 매핑됨
 */

const SYMPTOM_CATEGORIES = [
    {
        id: 'energy_sleep',
        icon: 'fa-battery-half',
        title: '에너지 & 수면',
        description: '피로감, 수면 상태를 체크해주세요',
        questions: [
            {
                id: 'fatigue_level',
                text: '평소 피로감 정도는?',
                type: 'single',
                options: [
                    { label: '거의 없다', value: 0, icon: '😊' },
                    { label: '가끔 피곤하다', value: 1, icon: '🙂' },
                    { label: '자주 피곤하다', value: 2, icon: '😐' },
                    { label: '항상 피곤하고 힘들다', value: 3, icon: '😩' }
                ],
                nutrients: { 'iron': [0,1,2,3], 'vitB12': [0,0,1,2], 'vitD': [0,1,1,2], 'magnesium': [0,0,1,2], 'coQ10': [0,0,1,2] }
            },
            {
                id: 'sleep_quality',
                text: '수면의 질은 어떤가요?',
                type: 'single',
                options: [
                    { label: '잘 자고 개운하다', value: 0, icon: '😴' },
                    { label: '가끔 잠들기 어렵다', value: 1, icon: '🌙' },
                    { label: '자주 뒤척이고 깊게 못 잔다', value: 2, icon: '😣' },
                    { label: '불면증 / 수면장애가 있다', value: 3, icon: '😵' }
                ],
                nutrients: { 'magnesium': [0,1,2,3], 'vitB6': [0,1,1,2], 'vitD': [0,0,1,2], 'calcium': [0,0,1,1], 'tryptophan': [0,1,2,2] }
            },
            {
                id: 'afternoon_slump',
                text: '점심 식사 후 극심한 졸음이 오나요?',
                type: 'single',
                options: [
                    { label: '거의 없다', value: 0, icon: '👍' },
                    { label: '가끔 졸리다', value: 1, icon: '🥱' },
                    { label: '매일 심하게 졸리다', value: 2, icon: '😴' }
                ],
                nutrients: { 'chromium': [0,1,2], 'vitB1': [0,1,2], 'iron': [0,1,1], 'magnesium': [0,0,1] }
            },
            {
                id: 'morning_tiredness',
                text: '아침에 일어나기가 힘든가요?',
                type: 'single',
                options: [
                    { label: '상쾌하게 일어난다', value: 0, icon: '🌅' },
                    { label: '좀 힘들지만 일어난다', value: 1, icon: '⏰' },
                    { label: '매우 힘들다 / 몸이 무겁다', value: 2, icon: '😫' }
                ],
                nutrients: { 'vitD': [0,1,2], 'iron': [0,1,2], 'vitB12': [0,1,1], 'cortisol_related': [0,0,1] }
            }
        ]
    },
    {
        id: 'skin_hair',
        icon: 'fa-spa',
        title: '피부 & 모발',
        description: '피부, 손톱, 머리카락 상태를 체크해주세요',
        questions: [
            {
                id: 'skin_condition',
                text: '피부 상태는 어떤가요?',
                type: 'multi',
                options: [
                    { label: '특별한 문제 없음', value: 'none', icon: '✨' },
                    { label: '건조하고 거칠다', value: 'dry', icon: '🏜️' },
                    { label: '여드름 / 뾰루지가 잦다', value: 'acne', icon: '😖' },
                    { label: '쉽게 멍이 든다', value: 'bruise', icon: '🟣' },
                    { label: '상처 회복이 느리다', value: 'slow_heal', icon: '🩹' },
                    { label: '가려움이 잦다', value: 'itch', icon: '😣' }
                ],
                nutrients: {
                    'none': {}, 
                    'dry': { 'omega3': 2, 'vitA': 2, 'vitE': 1, 'zinc': 1 },
                    'acne': { 'zinc': 2, 'vitA': 1, 'omega3': 1, 'vitB6': 1 },
                    'bruise': { 'vitC': 3, 'vitK': 2, 'iron': 1 },
                    'slow_heal': { 'zinc': 2, 'vitC': 2, 'protein': 1, 'vitA': 1 },
                    'itch': { 'omega3': 2, 'vitD': 1, 'vitE': 1 }
                }
            },
            {
                id: 'hair_condition',
                text: '머리카락 상태는?',
                type: 'multi',
                options: [
                    { label: '특별한 문제 없음', value: 'none', icon: '💇' },
                    { label: '빠지는 양이 많다', value: 'loss', icon: '😰' },
                    { label: '건조하고 푸석푸석하다', value: 'dry', icon: '🌾' },
                    { label: '윤기가 없다 / 가늘어졌다', value: 'thin', icon: '😟' },
                    { label: '새치 / 흰머리가 늘었다', value: 'gray', icon: '👴' }
                ],
                nutrients: {
                    'none': {},
                    'loss': { 'iron': 3, 'zinc': 2, 'biotin': 2, 'vitD': 1, 'protein': 1 },
                    'dry': { 'omega3': 2, 'vitA': 1, 'biotin': 1, 'vitE': 1 },
                    'thin': { 'iron': 2, 'biotin': 2, 'zinc': 1, 'protein': 1 },
                    'gray': { 'vitB12': 2, 'copper': 2, 'folate': 1 }
                }
            },
            {
                id: 'nail_condition',
                text: '손톱 상태는?',
                type: 'single',
                options: [
                    { label: '건강하고 단단하다', value: 0, icon: '💅' },
                    { label: '잘 부러지거나 갈라진다', value: 1, icon: '😕' },
                    { label: '흰 반점이나 세로줄이 있다', value: 2, icon: '👀' },
                    { label: '숟가락 모양 / 울퉁불퉁하다', value: 3, icon: '😟' }
                ],
                nutrients: { 'iron': [0,2,1,3], 'zinc': [0,1,2,1], 'biotin': [0,2,1,1], 'calcium': [0,1,0,1], 'protein': [0,1,0,2] }
            }
        ]
    },
    {
        id: 'digestive',
        icon: 'fa-stomach',
        iconFallback: 'fa-utensils',
        title: '소화 & 장 건강',
        description: '소화 상태와 식욕을 체크해주세요',
        questions: [
            {
                id: 'digestion',
                text: '소화 상태는 어떤가요?',
                type: 'multi',
                options: [
                    { label: '특별한 문제 없음', value: 'none', icon: '👍' },
                    { label: '더부룩함 / 가스가 자주 찬다', value: 'bloat', icon: '🎈' },
                    { label: '속쓰림 / 위산역류', value: 'acid', icon: '🔥' },
                    { label: '변비가 잦다', value: 'constipation', icon: '😣' },
                    { label: '설사가 잦다', value: 'diarrhea', icon: '💧' },
                    { label: '식후 불편감이 크다', value: 'discomfort', icon: '😖' }
                ],
                nutrients: {
                    'none': {},
                    'bloat': { 'probiotics': 2, 'digestive_enzyme': 2, 'magnesium': 1 },
                    'acid': { 'zinc': 1, 'vitB6': 1, 'probiotics': 1, 'magnesium': 1 },
                    'constipation': { 'magnesium': 2, 'fiber': 3, 'probiotics': 2, 'water': 2 },
                    'diarrhea': { 'probiotics': 2, 'zinc': 1, 'vitA': 1 },
                    'discomfort': { 'digestive_enzyme': 2, 'probiotics': 1, 'vitB1': 1 }
                }
            },
            {
                id: 'appetite',
                text: '식욕은 어떤가요?',
                type: 'single',
                options: [
                    { label: '정상적이다', value: 0, icon: '🍽️' },
                    { label: '자주 과식하게 된다', value: 1, icon: '🍔' },
                    { label: '식욕이 별로 없다', value: 2, icon: '😒' },
                    { label: '단것/짠것이 자주 당긴다', value: 3, icon: '🍰' }
                ],
                nutrients: { 'zinc': [0,1,2,1], 'chromium': [0,2,0,3], 'magnesium': [0,1,0,2], 'vitB1': [0,0,2,0], 'protein': [0,1,0,1] }
            }
        ]
    },
    {
        id: 'mental',
        icon: 'fa-brain',
        title: '정신건강 & 인지',
        description: '기분, 집중력, 스트레스 상태를 체크해주세요',
        questions: [
            {
                id: 'mood',
                text: '최근 기분 상태는?',
                type: 'single',
                options: [
                    { label: '안정적이고 긍정적', value: 0, icon: '😊' },
                    { label: '가끔 우울하거나 짜증남', value: 1, icon: '😐' },
                    { label: '자주 불안하거나 예민함', value: 2, icon: '😟' },
                    { label: '의욕 없고 무기력함', value: 3, icon: '😔' }
                ],
                nutrients: { 'omega3': [0,1,2,2], 'vitD': [0,1,2,3], 'vitB6': [0,1,2,1], 'magnesium': [0,1,2,2], 'folate': [0,0,1,2], 'iron': [0,0,1,2] }
            },
            {
                id: 'concentration',
                text: '집중력은 어떤가요?',
                type: 'single',
                options: [
                    { label: '집중을 잘 한다', value: 0, icon: '🎯' },
                    { label: '가끔 산만해진다', value: 1, icon: '🤔' },
                    { label: '집중력이 많이 떨어진다', value: 2, icon: '😵‍💫' },
                    { label: '기억력도 나빠진 것 같다', value: 3, icon: '🧠' }
                ],
                nutrients: { 'iron': [0,1,2,2], 'omega3': [0,1,2,3], 'vitB12': [0,0,2,3], 'zinc': [0,1,1,2], 'vitB6': [0,0,1,1] }
            },
            {
                id: 'stress',
                text: '스트레스 수준은?',
                type: 'single',
                options: [
                    { label: '잘 관리하고 있다', value: 0, icon: '🧘' },
                    { label: '보통 수준', value: 1, icon: '😤' },
                    { label: '높은 편이다', value: 2, icon: '😰' },
                    { label: '매우 높다 / 번아웃', value: 3, icon: '🔥' }
                ],
                nutrients: { 'magnesium': [0,1,2,3], 'vitC': [0,0,1,2], 'vitB5': [0,1,2,3], 'omega3': [0,0,1,2], 'vitB_complex': [0,0,1,2] }
            }
        ]
    },
    {
        id: 'musculo_skeletal',
        icon: 'fa-bone',
        title: '근골격 & 관절',
        description: '근육, 뼈, 관절 상태를 체크해주세요',
        questions: [
            {
                id: 'muscle_cramp',
                text: '근육 경련이나 쥐가 나나요?',
                type: 'single',
                options: [
                    { label: '거의 없다', value: 0, icon: '💪' },
                    { label: '가끔 있다', value: 1, icon: '😕' },
                    { label: '자주 있다 (주 2회 이상)', value: 2, icon: '😣' },
                    { label: '매우 자주 / 전신적', value: 3, icon: '😫' }
                ],
                nutrients: { 'magnesium': [0,2,3,3], 'potassium': [0,1,2,3], 'calcium': [0,1,2,2], 'vitD': [0,0,1,2], 'sodium': [0,0,1,1] }
            },
            {
                id: 'joint_pain',
                text: '관절 통증이나 뻣뻣함이 있나요?',
                type: 'single',
                options: [
                    { label: '없다', value: 0, icon: '🏃' },
                    { label: '가끔 뻣뻣하다', value: 1, icon: '🦴' },
                    { label: '자주 아프다', value: 2, icon: '😣' },
                    { label: '일상생활에 지장이 있다', value: 3, icon: '😫' }
                ],
                nutrients: { 'vitD': [0,1,2,3], 'omega3': [0,1,2,3], 'calcium': [0,1,2,2], 'collagen': [0,1,2,2], 'glucosamine': [0,0,1,2] }
            },
            {
                id: 'muscle_weakness',
                text: '근력이 약해진 느낌이 드나요?',
                type: 'single',
                options: [
                    { label: '아니요, 괜찮다', value: 0, icon: '💪' },
                    { label: '조금 약해진 것 같다', value: 1, icon: '😐' },
                    { label: '확실히 약해졌다', value: 2, icon: '😟' }
                ],
                nutrients: { 'protein': [0,2,3], 'vitD': [0,1,2], 'magnesium': [0,1,2], 'potassium': [0,1,1], 'vitB12': [0,0,1] }
            }
        ]
    },
    {
        id: 'immune_eye_oral',
        icon: 'fa-shield-virus',
        title: '면역 & 눈 & 구강',
        description: '면역력, 시력, 구강 상태를 체크해주세요',
        questions: [
            {
                id: 'immunity',
                text: '감기나 감염에 자주 걸리나요?',
                type: 'single',
                options: [
                    { label: '거의 안 걸린다', value: 0, icon: '🛡️' },
                    { label: '환절기에 가끔', value: 1, icon: '🤧' },
                    { label: '자주 걸리는 편', value: 2, icon: '😷' },
                    { label: '달고 산다 / 잘 안 낫는다', value: 3, icon: '🤒' }
                ],
                nutrients: { 'vitC': [0,1,2,3], 'vitD': [0,1,2,3], 'zinc': [0,1,2,3], 'probiotics': [0,0,1,2], 'vitA': [0,0,1,1] }
            },
            {
                id: 'eye_condition',
                text: '눈 상태는 어떤가요?',
                type: 'multi',
                options: [
                    { label: '특별한 문제 없음', value: 'none', icon: '👁️' },
                    { label: '눈이 자주 건조하다', value: 'dry', icon: '💧' },
                    { label: '눈이 쉽게 피로하다', value: 'fatigue', icon: '😩' },
                    { label: '야간 시력이 나빠졌다', value: 'night', icon: '🌙' },
                    { label: '눈 밑 떨림이 있다', value: 'twitch', icon: '👁️‍🗨️' }
                ],
                nutrients: {
                    'none': {},
                    'dry': { 'omega3': 2, 'vitA': 2, 'vitD': 1 },
                    'fatigue': { 'vitA': 2, 'lutein': 2, 'omega3': 1, 'vitB2': 1 },
                    'night': { 'vitA': 3, 'zinc': 1 },
                    'twitch': { 'magnesium': 3, 'potassium': 1, 'calcium': 1, 'vitB6': 1 }
                }
            },
            {
                id: 'oral_condition',
                text: '구강 상태는?',
                type: 'multi',
                options: [
                    { label: '특별한 문제 없음', value: 'none', icon: '😁' },
                    { label: '잇몸 출혈이 있다', value: 'bleeding', icon: '🩸' },
                    { label: '구내염이 자주 생긴다', value: 'ulcer', icon: '😖' },
                    { label: '입꼬리가 갈라진다', value: 'crack', icon: '😬' },
                    { label: '혀가 아프거나 부었다', value: 'tongue', icon: '👅' }
                ],
                nutrients: {
                    'none': {},
                    'bleeding': { 'vitC': 3, 'vitK': 2, 'coQ10': 1 },
                    'ulcer': { 'vitB12': 2, 'folate': 2, 'iron': 1, 'zinc': 1, 'vitB2': 1 },
                    'crack': { 'vitB2': 3, 'vitB6': 2, 'iron': 1 },
                    'tongue': { 'vitB12': 2, 'iron': 2, 'folate': 1, 'vitB3': 1 }
                }
            }
        ]
    },
    {
        id: 'habits',
        icon: 'fa-wine-glass',
        title: '생활습관 & 기타',
        description: '일상 습관 관련 마지막 체크입니다',
        questions: [
            {
                id: 'sun_exposure',
                text: '야외 활동 / 햇빛 노출은?',
                type: 'single',
                options: [
                    { label: '매일 30분 이상', value: 0, icon: '☀️' },
                    { label: '가끔 외출하는 정도', value: 1, icon: '🌤️' },
                    { label: '거의 실내에만 있다', value: 2, icon: '🏠' }
                ],
                nutrients: { 'vitD': [0,2,3] }
            },
            {
                id: 'alcohol',
                text: '음주 빈도는?',
                type: 'single',
                options: [
                    { label: '거의 안 마신다', value: 0, icon: '🚫' },
                    { label: '주 1~2회 적당히', value: 1, icon: '🍺' },
                    { label: '주 3회 이상', value: 2, icon: '🍷' },
                    { label: '거의 매일', value: 3, icon: '⚠️' }
                ],
                nutrients: { 'vitB1': [0,1,2,3], 'folate': [0,1,2,3], 'magnesium': [0,0,1,2], 'zinc': [0,0,1,2], 'vitB12': [0,0,1,1] }
            },
            {
                id: 'caffeine',
                text: '카페인 섭취량은? (커피, 에너지드링크 등)',
                type: 'single',
                options: [
                    { label: '하루 1잔 이하', value: 0, icon: '☕' },
                    { label: '하루 2~3잔', value: 1, icon: '☕☕' },
                    { label: '하루 4잔 이상', value: 2, icon: '⚡' }
                ],
                nutrients: { 'iron': [0,1,2], 'calcium': [0,1,2], 'magnesium': [0,1,2], 'vitB6': [0,0,1] }
            },
            {
                id: 'water_intake',
                text: '하루 수분 섭취량은?',
                type: 'single',
                options: [
                    { label: '충분히 마신다 (8잔 이상)', value: 0, icon: '💧' },
                    { label: '보통 (4~7잔)', value: 1, icon: '🥤' },
                    { label: '적게 마신다 (3잔 이하)', value: 2, icon: '🏜️' }
                ],
                nutrients: { 'water': [0,1,3], 'fiber': [0,0,1] }
            },
            {
                id: 'smoking',
                text: '흡연 여부는?',
                type: 'single',
                options: [
                    { label: '비흡연', value: 0, icon: '🚭' },
                    { label: '과거 흡연 (금연 중)', value: 1, icon: '✋' },
                    { label: '현재 흡연', value: 2, icon: '🚬' }
                ],
                nutrients: { 'vitC': [0,1,3], 'vitE': [0,0,2], 'vitA': [0,0,1], 'omega3': [0,0,1] }
            }
        ]
    }
];

// 영양소 기본 정보 매핑
const NUTRIENT_INFO = {
    iron: {
        name: '철분 (Iron)',
        emoji: '🔴',
        description: '산소 운반, 에너지 생성, 면역 기능에 필수적인 미네랄',
        symptoms: ['만성 피로', '어지러움', '창백한 피부', '탈모', '숟가락형 손톱', '호흡곤란', '집중력 저하'],
        foods: ['소고기', '시금치', '렌틸콩', '두부', '달걀', '굴', '다크초콜릿'],
        rda: '남성 10mg / 여성 14mg',
        caution: '비타민 C와 함께 섭취 시 흡수율 증가'
    },
    vitD: {
        name: '비타민 D',
        emoji: '☀️',
        description: '뼈 건강, 면역 기능, 기분 조절에 핵심적인 비타민',
        symptoms: ['골다공증 위험', '우울감', '면역력 저하', '근력 약화', '피로감', '관절통'],
        foods: ['연어', '고등어', '달걀노른자', '표고버섯', '우유(강화)', '정어리'],
        rda: '600~800IU (15~20μg)',
        caution: '한국인 80% 이상 결핍, 실내생활 시 보충제 권장'
    },
    magnesium: {
        name: '마그네슘',
        emoji: '💎',
        description: '300개 이상 효소반응에 관여, 근육/신경/수면에 핵심',
        symptoms: ['근육 경련', '수면장애', '불안/초조', '두통', '변비', '피로감', '눈 밑 떨림'],
        foods: ['아몬드', '시금치', '바나나', '다크초콜릿', '아보카도', '견과류', '통곡물'],
        rda: '남성 350mg / 여성 280mg',
        caution: '스트레스·카페인·알코올 섭취 시 소모량 증가'
    },
    vitB12: {
        name: '비타민 B12',
        emoji: '🔵',
        description: '신경계 보호, 적혈구 생성, DNA 합성에 필수',
        symptoms: ['극심한 피로', '손발 저림', '기억력 저하', '구내염', '혀 통증', '우울감', '새치 증가'],
        foods: ['소고기', '참치', '연어', '달걀', '우유', '치즈', '김/해조류'],
        rda: '2.4μg',
        caution: '채식주의자·고령자에게 결핍 빈도 높음'
    },
    vitC: {
        name: '비타민 C',
        emoji: '🍊',
        description: '항산화, 콜라겐 합성, 면역력 강화에 필수',
        symptoms: ['잦은 감기', '잇몸 출혈', '상처 회복 지연', '쉽게 멍듦', '피부 건조', '피로감'],
        foods: ['키위', '파프리카', '딸기', '브로콜리', '오렌지', '감귤류', '고추'],
        rda: '100mg',
        caution: '흡연자는 2배 이상 필요, 스트레스 시 소모 증가'
    },
    zinc: {
        name: '아연 (Zinc)',
        emoji: '⚡',
        description: '면역, 상처 치유, 미각/후각, 피부 건강에 관여',
        symptoms: ['면역력 저하', '미각/후각 둔화', '상처 회복 지연', '탈모', '여드름', '식욕 변화'],
        foods: ['굴', '소고기', '호박씨', '렌틸콩', '캐슈넛', '닭고기', '병아리콩'],
        rda: '남성 10mg / 여성 8mg',
        caution: '과도한 가공식품 섭취 시 결핍 위험 증가'
    },
    omega3: {
        name: '오메가-3 지방산',
        emoji: '🐟',
        description: '뇌 기능, 심혈관, 항염증, 피부/눈 건강에 핵심',
        symptoms: ['피부 건조', '집중력 저하', '관절 통증', '우울감', '눈 건조', '염증 증가'],
        foods: ['연어', '고등어', '참치', '호두', '치아씨드', '아마씨', '들기름'],
        rda: 'EPA+DHA 500mg~1000mg',
        caution: '생선 섭취 적은 한국인에게 보충 권장'
    },
    vitA: {
        name: '비타민 A',
        emoji: '🥕',
        description: '시력, 피부, 면역, 세포 성장에 필수적인 비타민',
        symptoms: ['야간 시력 저하', '피부 건조', '면역력 약화', '눈 건조', '점막 약화'],
        foods: ['당근', '고구마', '시금치', '케일', '달걀', '간', '망고'],
        rda: '남성 750μg / 여성 650μg RAE',
        caution: '과다 섭취 시 독성 있으므로 용량 주의'
    },
    calcium: {
        name: '칼슘',
        emoji: '🦴',
        description: '뼈/치아 건강, 근육 수축, 신경 전달에 필수',
        symptoms: ['골다공증 위험', '근육 경련', '치아 약화', '손톱 약화', '수면 장애'],
        foods: ['우유', '치즈', '요거트', '멸치', '두부', '케일', '브로콜리'],
        rda: '700~1000mg',
        caution: '비타민 D와 함께 섭취 시 흡수율 증가'
    },
    vitB6: {
        name: '비타민 B6',
        emoji: '💜',
        description: '신경전달물질 합성, 호르몬 균형, 면역 기능',
        symptoms: ['수면 장애', '기분 변화', '입꼬리 갈라짐', '피부 발진', 'PMS 악화'],
        foods: ['닭가슴살', '바나나', '감자', '참치', '해바라기씨', '시금치'],
        rda: '1.5mg',
        caution: '경구피임약 복용 시 결핍 위험 증가'
    },
    biotin: {
        name: '비오틴 (비타민 B7)',
        emoji: '💇',
        description: '모발, 피부, 손톱 건강의 핵심 비타민',
        symptoms: ['탈모', '손톱 약화', '피부 발진', '눈 주위 발진'],
        foods: ['달걀노른자', '아몬드', '고구마', '시금치', '브로콜리', '버섯'],
        rda: '30μg',
        caution: '날달걀 섭취는 비오틴 흡수를 방해'
    },
    folate: {
        name: '엽산 (Folate)',
        emoji: '🌿',
        description: 'DNA 합성, 세포 분열, 적혈구 생성에 필수',
        symptoms: ['피로감', '구내염', '우울감', '빈혈', '새치 증가', '태아 발달 영향'],
        foods: ['시금치', '렌틸콩', '아스파라거스', '브로콜리', '아보카도', '감귤류'],
        rda: '400μg DFE',
        caution: '임산부 특히 중요, 알코올 섭취 시 결핍 위험'
    },
    vitE: {
        name: '비타민 E',
        emoji: '🌰',
        description: '강력한 항산화제, 피부/세포 보호',
        symptoms: ['피부 건조', '면역력 저하', '근력 약화', '시력 저하'],
        foods: ['아몬드', '해바라기씨', '아보카도', '올리브오일', '시금치'],
        rda: '12mg α-TE',
        caution: '지방과 함께 섭취 시 흡수율 증가'
    },
    protein: {
        name: '단백질',
        emoji: '🥩',
        description: '근육, 효소, 호르몬, 면역체계의 기본 구성요소',
        symptoms: ['근력 저하', '탈모', '상처 회복 지연', '부종', '면역력 약화', '손톱 약화'],
        foods: ['닭가슴살', '달걀', '두부', '그릭요거트', '소고기', '렌틸콩', '연어'],
        rda: '체중 1kg당 0.8~1.2g',
        caution: '활동량 많을수록 필요량 증가'
    },
    vitK: {
        name: '비타민 K',
        emoji: '🥬',
        description: '혈액 응고, 뼈 건강에 필수',
        symptoms: ['쉽게 멍듦', '잇몸 출혈', '상처 출혈 지속', '골다공증 위험'],
        foods: ['케일', '시금치', '브로콜리', '상추', '낫또', '파슬리'],
        rda: '남성 75μg / 여성 65μg',
        caution: '혈액희석제 복용 시 의사 상담 필요'
    },
    chromium: {
        name: '크롬 (Chromium)',
        emoji: '🔋',
        description: '혈당 조절, 인슐린 민감성 개선',
        symptoms: ['단것 강한 갈망', '식후 극심한 졸음', '혈당 불안정', '체중 증가'],
        foods: ['브로콜리', '포도주스', '감자', '마늘', '바질', '소고기'],
        rda: '30~35μg',
        caution: '정제 탄수화물 과다 섭취 시 결핍 위험'
    },
    potassium: {
        name: '칼륨 (Potassium)',
        emoji: '🍌',
        description: '혈압 조절, 근육/신경 기능, 체액 균형',
        symptoms: ['근육 경련', '피로감', '근력 약화', '변비', '심박수 이상'],
        foods: ['바나나', '감자', '아보카도', '시금치', '고구마', '토마토'],
        rda: '3500mg',
        caution: '신장 질환 시 과다 섭취 주의'
    },
    vitB1: {
        name: '비타민 B1 (티아민)',
        emoji: '🌾',
        description: '탄수화물 대사, 에너지 생성, 신경 기능',
        symptoms: ['피로감', '식욕 저하', '집중력 저하', '근력 약화', '소화 불량'],
        foods: ['돼지고기', '현미', '해바라기씨', '완두콩', '참깨'],
        rda: '1.1~1.2mg',
        caution: '탄수화물 위주 식사·알코올 섭취 시 결핍 위험'
    },
    vitB2: {
        name: '비타민 B2 (리보플라빈)',
        emoji: '💛',
        description: '에너지 대사, 피부/눈/점막 건강',
        symptoms: ['입꼬리 갈라짐', '눈 피로', '피부 발진', '혀 통증'],
        foods: ['달걀', '우유', '아몬드', '버섯', '시금치', '소고기'],
        rda: '1.2~1.5mg',
        caution: '빛에 의해 파괴되므로 보관 주의'
    },
    vitB3: {
        name: '비타민 B3 (나이아신)',
        emoji: '🧡',
        description: '에너지 대사, 피부 건강, 신경 기능',
        symptoms: ['피부 발진', '소화 장애', '피로감', '혀 통증'],
        foods: ['닭가슴살', '참치', '버섯', '땅콩', '현미'],
        rda: '14~16mg NE',
        caution: '고용량 보충 시 안면홍조 가능'
    },
    vitB5: {
        name: '비타민 B5 (판토텐산)',
        emoji: '🟤',
        description: '스트레스 호르몬 합성, 에너지 대사',
        symptoms: ['스트레스 내성 저하', '피로감', '불면', '손발 저림'],
        foods: ['아보카도', '닭가슴살', '브로콜리', '버섯', '고구마'],
        rda: '5mg',
        caution: '항스트레스 비타민으로 불림'
    },
    copper: {
        name: '구리 (Copper)',
        emoji: '🟠',
        description: '철분 대사, 멜라닌 합성, 결합 조직 형성',
        symptoms: ['새치/흰머리', '빈혈', '면역력 저하', '골다공증 위험'],
        foods: ['다크초콜릿', '캐슈넛', '렌틸콩', '표고버섯', '참깨'],
        rda: '0.8mg',
        caution: '아연 과다 보충 시 구리 결핍 가능'
    },
    probiotics: {
        name: '프로바이오틱스',
        emoji: '🦠',
        description: '장내 미생물 균형, 면역/소화/정신건강에 관여',
        symptoms: ['소화 불량', '가스/더부룩함', '면역력 저하', '변비/설사', '피부 트러블'],
        foods: ['김치', '요거트', '된장', '청국장', '콤부차', '사워크라우트'],
        rda: '100억~500억 CFU',
        caution: '다양한 균주 섭취 권장'
    },
    fiber: {
        name: '식이섬유',
        emoji: '🥦',
        description: '장 건강, 혈당 조절, 콜레스테롤 관리',
        symptoms: ['변비', '혈당 불안정', '포만감 부족', '장 건강 악화'],
        foods: ['현미', '브로콜리', '사과', '귀리', '렌틸콩', '고구마'],
        rda: '25~30g',
        caution: '갑작스런 증가 시 가스 발생 가능, 점진적 증가 권장'
    },
    water: {
        name: '수분',
        emoji: '💧',
        description: '체온 조절, 영양소 운반, 노폐물 배출의 기본',
        symptoms: ['만성 피로', '두통', '변비', '집중력 저하', '피부 건조'],
        foods: ['물', '허브티', '오이', '수박', '셀러리', '토마토'],
        rda: '하루 1.5~2L (8잔)',
        caution: '카페인·알코올은 이뇨 작용으로 수분 배출 증가'
    },
    coQ10: {
        name: '코엔자임 Q10',
        emoji: '⚡',
        description: '세포 에너지 생성, 항산화, 심장 건강',
        symptoms: ['만성 피로', '잇몸 약화', '근력 저하', '심장 두근거림'],
        foods: ['소고기', '참치', '브로콜리', '땅콩', '시금치'],
        rda: '100~200mg',
        caution: '스타틴 약물 복용 시 결핍 위험 증가'
    },
    collagen: {
        name: '콜라겐',
        emoji: '✨',
        description: '피부 탄력, 관절 건강, 뼈/연골 구성 성분',
        symptoms: ['피부 탄력 저하', '관절 통증', '주름 증가'],
        foods: ['뼈 육수', '닭 껍질', '생선 껍질', '돼지 껍데기', '젤라틴'],
        rda: '5~10g',
        caution: '비타민 C와 함께 섭취 시 합성 촉진'
    },
    glucosamine: {
        name: '글루코사민',
        emoji: '🦵',
        description: '관절 연골 보호 및 재생 지원',
        symptoms: ['관절 통증', '관절 뻣뻣함', '운동 시 관절 불편'],
        foods: ['새우 껍질', '게', '뼈 육수', '버섯'],
        rda: '1500mg',
        caution: '갑각류 알레르기 시 주의'
    },
    lutein: {
        name: '루테인',
        emoji: '👁️',
        description: '눈 황반 보호, 블루라이트 차단',
        symptoms: ['눈 피로', '시력 저하', '눈부심'],
        foods: ['케일', '시금치', '브로콜리', '옥수수', '달걀노른자'],
        rda: '10~20mg',
        caution: '전자기기 사용 많은 현대인에게 필수'
    },
    tryptophan: {
        name: '트립토판',
        emoji: '😴',
        description: '세로토닌·멜라토닌 전구체, 수면과 기분 조절',
        symptoms: ['수면 장애', '우울감', '불안', '단것 갈망'],
        foods: ['칠면조', '바나나', '우유', '호두', '치즈', '두부'],
        rda: '250~425mg',
        caution: '취침 전 트립토판 함유 식품 섭취가 수면에 도움'
    },
    digestive_enzyme: {
        name: '소화 효소',
        emoji: '🧪',
        description: '음식물 분해, 영양소 흡수 촉진',
        symptoms: ['더부룩함', '식후 불편감', '가스', '영양소 흡수 저하'],
        foods: ['파인애플', '파파야', '키위', '된장', '김치', '생강'],
        rda: '식사 시 보충',
        caution: '나이가 들수록 분비량 감소'
    },
    vitB_complex: {
        name: '비타민 B 복합체',
        emoji: '🅱️',
        description: 'B군 비타민 전체 - 에너지, 신경, 정신건강',
        symptoms: ['피로감', '스트레스 취약', '집중력 저하', '피부 트러블'],
        foods: ['달걀', '녹색 채소', '통곡물', '견과류', '육류'],
        rda: '종합 비타민 B 복합제',
        caution: '수용성이라 매일 보충 필요'
    },
    cortisol_related: {
        name: '부신 건강 (코르티솔 관련)',
        emoji: '🎯',
        description: '스트레스 호르몬 균형과 아침 각성에 관여',
        symptoms: ['아침 기상 어려움', '에너지 변동', '스트레스 내성 저하'],
        foods: ['비타민C 풍부 식품', '마그네슘 식품', '아답토겐 허브'],
        rda: '생활습관 개선 병행',
        caution: '만성 스트레스 관리가 핵심'
    },
    sodium: {
        name: '나트륨/전해질 균형',
        emoji: '🧂',
        description: '체액 균형, 근육/신경 기능',
        symptoms: ['근육 경련', '어지러움', '피로감'],
        foods: ['소금', '전해질 음료', '올리브', '셀러리'],
        rda: '1500~2300mg',
        caution: '과다한 땀 배출 시 보충 필요'
    }
};
