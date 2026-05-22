// Games Data - Questions, Riddles, Stories

const gamesData = {
  scientificChallenges: [
    {
      id: 1,
      question: 'ما هو رمز عنصر الحديد في الجدول الدوري؟',
      options: ['Fe', 'Hr', 'Ir'],
      correct: 0,
      explanation: 'رمز الحديد هو Fe من الاسم اللاتيني Ferrum',
      category: 'كيمياء',
      points: 10,
    },
    {
      id: 2,
      question: 'كم عدد كواكب المجموعة الشمسية؟',
      options: ['8', '9', '10'],
      correct: 0,
      explanation: 'هناك 8 كواكب في مجموعتنا الشمسية بعد إعادة تصنيف بلوتو',
      category: 'فلك',
      points: 10,
    },
    {
      id: 3,
      question: 'ما هي سرعة الضوء في الفراغ؟',
      options: ['300,000 كم/ث', '150,000 كم/ث', '500,000 كم/ث'],
      correct: 0,
      explanation: 'سرعة الضوء تساوي 299,792 كم/ث تقريباً',
      category: 'فيزياء',
      points: 15,
    },
    {
      id: 4,
      question: 'كم عدد عظام جسم الإنسان البالغ؟',
      options: ['186', '206', '226'],
      correct: 1,
      explanation: 'جسم الإنسان البالغ يحتوي على 206 عظمة',
      category: 'أحياء',
      points: 10,
    },
    {
      id: 5,
      question: 'ما هو الجذر التربيعي لـ 144؟',
      options: ['10', '12', '14'],
      correct: 1,
      explanation: '12 × 12 = 144',
      category: 'رياضيات',
      points: 10,
    },
  ],

  arabicRiddles: [
    {
      id: 1,
      riddle: 'أنا أسود لكن أحمل الضوء في داخلي',
      answer: 'الفحم',
      hints: ['معدن', 'أسود اللون', 'يُستخدم للطاقة'],
      difficulty: 'متوسط',
      points: 20,
    },
    {
      id: 2,
      riddle: 'أنا ماء لكن لست رطبة',
      answer: 'ماء الذهب',
      hints: ['معدن', 'نفيس', 'يلمع'],
      difficulty: 'صعب',
      points: 30,
    },
    {
      id: 3,
      riddle: 'بدون أن أحتوي على حروف، أتحدث مع العالم',
      answer: 'الموجات الصوتية',
      hints: ['فيزياء', 'تنتقل عبر الهواء', 'نسمعها'],
      difficulty: 'صعب',
      points: 25,
    },
  ],

  scrambledWords: [
    { word: 'علم', scrambled: 'ملع', points: 5 },
    { word: 'تجربة', scrambled: 'ةبرجت', points: 10 },
    { word: 'اكتشاف', scrambled: 'فاشتكا', points: 15 },
    { word: 'حضارة', scrambled: 'ةراضح', points: 15 },
    { word: 'مجهر', scrambled: 'رهجم', points: 10 },
  ],

  trueFalseQuestions: [
    {
      id: 1,
      statement: 'النار تحتاج إلى ثلاثة عناصر: الحرارة والوقود والأكسجين',
      isTrue: true,
      explanation: 'هذا صحيح تماماً - مثلث الحريق الكلاسيكي',
      points: 10,
    },
    {
      id: 2,
      statement: 'الماس أصلب من الحديد',
      isTrue: true,
      explanation: 'الماس هو أصلب مادة طبيعية معروفة',
      points: 15,
    },
    {
      id: 3,
      statement: 'الضفادع تشرب الماء من أذنيها',
      isTrue: false,
      explanation: 'الضفادع تمتص الماء من خلال جلدها',
      points: 10,
    },
  ],

  mysteryEvents: [
    {
      id: 1,
      title: 'ظهور ضوء غريب في السماء',
      description: 'رأيتَ ضوءاً غريباً يظهر في السماء الليلة، ما الذي ستفعله؟',
      options: [
        { text: 'تجاهله والعودة للنوم', points: 5, materials: { stone: 0 } },
        { text: 'فحصه بالمنظار', points: 20, materials: { stone: 5 } },
        { text: 'جمع الجيران لمشاهدته معاً', points: 15, materials: { iron: 3 } },
      ],
    },
    {
      id: 2,
      title: 'اكتشاف معدن غريب',
      description: 'وجدتَ معدناً غريباً في الكهف، كيف ستتعامل معه؟',
      options: [
        { text: 'تجربة صهره مباشرة', points: 10, materials: { iron: 5 } },
        { text: 'فحصه بعناية أولاً', points: 25, materials: { stone: 10 } },
        { text: 'إخفاؤه للحفاظ عليه', points: 5, materials: { glass: 2 } },
      ],
    },
  ],

  mapAreas: [
    {
      name: 'غابة الألغاز',
      emoji: '🌲',
      requiredPoints: 0,
      rewards: { points: 20, materials: { stone: 5 } },
    },
    {
      name: 'جبل المعرفة',
      emoji: '⛰️',
      requiredPoints: 100,
      rewards: { points: 50, materials: { iron: 10 } },
    },
    {
      name: 'شاطئ الاكتشافات',
      emoji: '🏖️',
      requiredPoints: 250,
      rewards: { points: 75, materials: { glass: 15 } },
    },
    {
      name: 'بركان الكيمياء',
      emoji: '🌋',
      requiredPoints: 500,
      rewards: { points: 100, materials: { nitricAcid: 10 } },
    },
    {
      name: 'قمة الجليد',
      emoji: '❄️',
      requiredPoints: 1000,
      rewards: { points: 150, materials: { stone: 20, iron: 20 } },
    },
  ],

  storyChapters: [
    {
      chapter: 1,
      title: 'البداية',
      description: 'استيقظتَ في عالم جديد بلا تكنولوجيا، مثل سينكو تماماً!',
      missions: [
        {
          id: 1,
          title: 'اجمع الحجارة الأولى',
          question: 'ما اسم العملية التي يتم فيها تسخين المعادن؟',
          options: ['الصهر', 'التفاعل', 'الانصهار'],
          correct: 0,
          points: 25,
        },
        {
          id: 2,
          title: 'اصنع أول أداة',
          question: 'ما المعدن الذي استخدمه القدماء قبل الحديد؟',
          options: ['النحاس', 'الذهب', 'الفضة'],
          correct: 0,
          points: 30,
        },
      ],
    },
  ],

  dailyQuests: [
    {
      id: 1,
      questions: [
        {
          q: 'ما هو رمز الكربون؟',
          a: 'C',
          options: ['C', 'Ca', 'Cr'],
          points: 10,
        },
        {
          q: 'كم عدد ألوان قوس قزح؟',
          a: '7',
          options: ['6', '7', '8'],
          points: 10,
        },
        {
          q: 'ما أكبر كوكب في المجموعة الشمسية؟',
          a: 'المشتري',
          options: ['زحل', 'المشتري', 'نبتون'],
          points: 10,
        },
      ],
      totalPoints: 100,
    },
  ],

  mathProblems: {
    easy: [
      { problem: '5 + 3 = ؟', answer: '8', points: 10, timeLimit: 30 },
      { problem: '12 - 7 = ؟', answer: '5', points: 10, timeLimit: 30 },
    ],
    medium: [
      { problem: '15 × 4 = ؟', answer: '60', points: 20, timeLimit: 45 },
      { problem: '100 ÷ 5 = ؟', answer: '20', points: 20, timeLimit: 45 },
    ],
    hard: [
      { problem: '2^8 = ؟', answer: '256', points: 30, timeLimit: 60 },
      { problem: 'جذر 256 = ؟', answer: '16', points: 30, timeLimit: 60 },
    ],
  },

  jokes: [
    'ما الفرق بين الفيزياء والكيمياء؟ الفيزيائيون يجرّبون على الكيميائيين! 😄',
    'لماذا الرياضيات حزينة؟ لأنها مليئة بالمشاكل! 📐😢',
    'قال الحاسوب لزميله: يا صديقي، أنت بتاع كود؟ قال: لا، أنا بتاع كودا! 💻🤣',
  ],

  quotes: [
    'العلم هو المفتاح الذي يفتح أبواب المستقبل - سينكو إيشيغامي',
    'الفشل ليس نهاية، بل هو بداية التعلم',
    'في كل مشكلة علمية، يكمن حل جميل',
  ],
};

export default gamesData;
