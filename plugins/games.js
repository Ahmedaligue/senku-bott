import playerStore from '../lib/playerStore.js';
import gameEngine from '../lib/gameEngine.js';
import { roleEmojis, materialEmojis, sinkuMessages } from '../lib/waUtils.js';

const games = {
  commands: [
    {
      name: 'انضم',
      aliases: ['join'],
      description: 'انضم للعبة واختر دورك',
      usage: '.انضم [1-4]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const roleNum = args[0];

        if (!roleNum || !['1', '2', '3', '4'].includes(roleNum)) {
          return ctx.reply(sinkuMessages.welcome);
        }

        if (playerStore.playerExists(userId)) {
          return ctx.reply(sinkuMessages.alreadyJoined);
        }

        playerStore.createPlayer(userId, ctx.senderNum);
        const roleMap = { '1': 'scientist', '2': 'warrior', '3': 'gatherer', '4': 'leader' };
        const selectedRole = roleMap[roleNum];
        
        gameEngine.selectRole(userId, selectedRole);
        const player = playerStore.getPlayer(userId);
        const roleEmoji = roleEmojis[selectedRole];
        const roleNames = { scientist: 'عالم', warrior: 'محارب', gatherer: 'جامع', leader: 'قائد' };

        ctx.reply(`✅ مرحباً بك في مملكة العلم!
${roleEmoji} دورك: ${roleNames[selectedRole]}

📊 حالتك الأولى:
• النقاط: 0
• المستوى: 1
• الأسئلة: 0

📝 الأوامر:
.حالتي - عرض معلوماتك
.تحدي علمي - سؤال علمي
.لغز - لغز عربي
.قائمة - جميع الأوامر

بعشرة مليارات بالمئة! 🧪`);
      },
    },
    {
      name: 'حالتي',
      aliases: ['status', 'profile'],
      description: 'عرض حالتك الشخصية',
      usage: '.حالتي',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const stats = playerStore.getPlayerStats(userId);
        const player = playerStore.getPlayer(userId);
        const roleEmoji = roleEmojis[player.role] || '❓';

        const response = `
${roleEmoji} حالتك الشخصية
━━━━━━━━━━━━━━━━━━━━━━

📍 النقاط: ${stats.points}
⭐ المستوى: ${stats.level}/5
🎭 الدور: ${stats.role}
📚 الأسئلة المجابة: ${stats.questionsAnswered}
🔥 السلسلة اليومية: ${stats.streak}
🏰 العشيرة: ${stats.clan}

💎 الموارد:
🪨 الحجر: ${stats.materials.stone}
⚙️ الحديد: ${stats.materials.iron}
⚗️ حمض النيتريك: ${stats.materials.nitricAcid}
🔮 الزجاج: ${stats.materials.glass}

📅 تاريخ الانضمام: ${stats.createdAt}
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'تحدي',
      aliases: ['challenge', 'تحدي علمي'],
      description: 'سؤال علمي متعدد الخيارات',
      usage: '.تحدي',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const challenge = gameEngine.getScientificChallenge();
        const player = playerStore.getPlayer(userId);

        playerStore.updatePlayer(userId, { currentChallenge: challenge });

        const response = `
🧪 تحدي علمي
━━━━━━━━━━━━━━━━━━━━━━

📚 ${challenge.question}

🔹 الخيارات:
1️⃣ ${challenge.options[0]}
2️⃣ ${challenge.options[1]}
3️⃣ ${challenge.options[2]}

⏱️ اكتب الرقم (1/2/3)
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'اجب',
      aliases: ['answer', 'ans'],
      description: 'الإجابة على السؤال الحالي',
      usage: '.اجب [1/2/3]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const answerNum = parseInt(args[0]);

        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const player = playerStore.getPlayer(userId);
        if (!player.currentChallenge) {
          return ctx.reply(`❌ لا يوجد سؤال قائم! اكتب .تحدي`);
        }

        if (isNaN(answerNum) || answerNum < 1 || answerNum > 3) {
          return ctx.reply(`❌ الإجابة يجب أن تكون 1 أو 2 أو 3`);
        }

        const result = gameEngine.checkScientificAnswer(userId, player.currentChallenge, answerNum - 1);
        
        let response = '';
        if (result.isCorrect) {
          response = `${sinkuMessages.success}

✅ الإجابة الصحيحة: ${result.challenge.options[result.challenge.correct]}
+${result.points} نقطة

📖 التوضيح:
${result.explanation}`;
        } else {
          response = `${sinkuMessages.wrong}

❌ إجابتك: ${result.challenge.options[answerNum - 1]}
✅ الإجابة الصحيحة: ${result.challenge.options[result.challenge.correct]}

📖 التوضيح:
${result.explanation}`;
        }

        playerStore.updatePlayer(userId, { currentChallenge: null });
        ctx.reply(response);
      },
    },
    {
      name: 'لغز',
      aliases: ['riddle'],
      description: 'لغز عربي مع تلميحات',
      usage: '.لغز',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const riddle = gameEngine.getArabicRiddle();
        playerStore.updatePlayer(userId, { currentRiddle: { ...riddle, hintsUsed: 0 } });

        const response = `
🧩 لغز عربي
━━━━━━━━━━━━━━━━━━━━━━

${riddle.riddle}

📖 مستوى الصعوبة: ${riddle.difficulty}
💡 لديك 2 تلميح

💬 اكتب إجابتك أو "تلميح" للحصول على تلميح
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'تلميح',
      aliases: ['hint'],
      description: 'احصل على تلميح للغز',
      usage: '.تلميح',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const player = playerStore.getPlayer(userId);

        if (!player || !player.currentRiddle) {
          return ctx.reply(`❌ لا يوجد لغز قائم! اكتب .لغز`);
        }

        if (player.currentRiddle.hintsUsed >= 2) {
          return ctx.reply(`❌ انتهت التلميحات! الإجابة: ${player.currentRiddle.answer}`);
        }

        const nextHintIndex = player.currentRiddle.hintsUsed;
        const hint = player.currentRiddle.hints[nextHintIndex];

        playerStore.updatePlayer(userId, { 
          currentRiddle: { ...player.currentRiddle, hintsUsed: player.currentRiddle.hintsUsed + 1 } 
        });

        ctx.reply(`💡 تلميح (${player.currentRiddle.hintsUsed + 1}/2):\n${hint}`);
      },
    },
    {
      name: 'كلمة',
      aliases: ['scramble'],
      description: 'كلمة مشفرة - رتب الحروف',
      usage: '.كلمة',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const word = gameEngine.getScrambledWord();
        playerStore.updatePlayer(userId, { currentScramble: word });

        const response = `
🔤 كلمة مشفرة
━━━━━━━━━━━━━━━━━━━━━━

📝 الكلمة المقلوبة:
${word.scrambled.split('').join(' ')}

💬 اكتب الكلمة الصحيحة
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'صح',
      aliases: ['true', 'صح أم خطأ'],
      description: 'سؤال صح أم خطأ',
      usage: '.صح',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const question = gameEngine.getTrueFalseQuestion();
        playerStore.updatePlayer(userId, { currentTrueFalse: question });

        const response = `
⚡ صح أم خطأ
━━━━━━━━━━━━━━━━━━━━━━

${question.statement}

1️⃣ صح ✅
2️⃣ خطأ ❌

💬 اكتب: .صح أو .خطأ
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'خطأ',
      aliases: ['false'],
      description: 'الإجابة خطأ',
      usage: '.خطأ',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const player = playerStore.getPlayer(userId);

        if (!player || !player.currentTrueFalse) {
          return ctx.reply(`❌ لا يوجد سؤال قائم! اكتب .صح`);
        }

        const result = gameEngine.checkTrueFalseAnswer(userId, player.currentTrueFalse, false);
        
        let response = '';
        if (result.correct) {
          response = `${sinkuMessages.success}
+${result.points} نقطة

📖 ${result.explanation}`;
        } else {
          response = `${sinkuMessages.wrong}
📖 ${result.explanation}`;
        }

        playerStore.updatePlayer(userId, { currentTrueFalse: null });
        ctx.reply(response);
      },
    },
    {
      name: 'سريع',
      aliases: ['lucky', 'سؤال سريع'],
      description: 'سؤال حظ سريع',
      usage: '.سريع',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        
        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const question = gameEngine.getLuckyQuestion();
        playerStore.updatePlayer(userId, { currentLuckyQuestion: question });

        const response = `
⚡ سؤال سريع
━━━━━━━━━━━━━━━━━━━━━━

${question.question}

1️⃣ ${question.options[0]}
2️⃣ ${question.options[1]}
3️⃣ ${question.options[2]}

⏱️ اكتب الرقم بسرعة!
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'عجلة',
      aliases: ['wheel', 'عجلة الحظ'],
      description: 'عجلة الحظ - مرة كل 24 ساعة',
      usage: '.عجلة',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const player = playerStore.getPlayer(userId);

        if (!player) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;

        if (player.lastSpinWheel && (now - player.lastSpinWheel) < cooldown) {
          const remaining = Math.ceil((cooldown - (now - player.lastSpinWheel)) / 60000);
          return ctx.reply(`⏳ يمكنك العزف مرة أخرى بعد ${remaining} دقيقة`);
        }

        const rewards = [50, 100, 150, 200, 250, 500];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        playerStore.updatePlayer(userId, { lastSpinWheel: now });
        playerStore.addPoints(userId, reward);

        const response = `
🎰 عجلة الحظ
━━━━━━━━━━━━━━━━━━━━━━

🎡 تدور العجلة...
    🔴  🔵  🟡
    🟢  ⭐  🔵
    🔴  🟡  🟢

🎉 حصلت على: +${reward} نقطة!

تابع اللعب بعشرة مليارات بالمئة! 🧪
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'رياضيات',
      aliases: ['math'],
      description: 'تحدي رياضيات - 3 مستويات',
      usage: '.رياضيات [سهل/متوسط/صعب]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const difficulty = args[0]?.toLowerCase() || 'easy';
        const diffMap = { 'سهل': 'easy', 'متوسط': 'medium', 'صعب': 'hard', 'easy': 'easy', 'medium': 'medium', 'hard': 'hard' };
        const diff = diffMap[difficulty] || 'easy';

        if (!playerStore.playerExists(userId)) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const problem = gameEngine.getMathProblem(diff);
        playerStore.updatePlayer(userId, { currentMath: problem });

        const response = `
🔢 تحدي رياضيات
━━━━━━━━━━━━━━━━━━━━━━

📐 المسألة:
${problem.problem}

⏱️ الوقت المتاح: ${problem.timeLimit} ثانية
💬 اكتب الإجابة
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'رهان',
      aliases: ['bet', 'dice'],
      description: 'رهان النرد',
      usage: '.رهان [زوجي/فردي] [المبلغ]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const betType = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        const player = playerStore.getPlayer(userId);

        if (!player) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        if (!betType || !['زوجي', 'فردي', 'عالي', 'منخفض', 'even', 'odd', 'high', 'low'].includes(betType)) {
          return ctx.reply(`❌ نوع الرهان: زوجي/فردي/عالي/منخفض`);
        }

        if (!amount || amount <= 0 || amount > player.points) {
          return ctx.reply(`❌ المبلغ غير صحيح! لديك ${player.points} نقطة`);
        }

        const betMap = { 'زوجي': 'even', 'فردي': 'odd', 'عالي': 'high', 'منخفض': 'low', 'even': 'even', 'odd': 'odd', 'high': 'high', 'low': 'low' };
        const bet = { type: betMap[betType], amount };
        const result = gameEngine.placeDiceBet(userId, bet);

        const response = `
🎲 رهان النرد
━━━━━━━━━━━━━━━━━━━━━━

🎲 النرد: ${result.dice}
🎯 نوع الرهان: ${betType}
💰 المبلغ: ${amount}

${result.won ? '✅ فزت! 🎉' : '❌ خسرت! حاول مرة أخرى'}
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'حدث',
      aliases: ['mystery', 'حدث غامض'],
      description: 'حدث عشوائي غامض',
      usage: '.حدث',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const player = playerStore.getPlayer(userId);

        if (!player) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const now = Date.now();
        const cooldown = 2 * 60 * 60 * 1000;

        if (player.lastMystery && (now - player.lastMystery) < cooldown) {
          const remaining = Math.ceil((cooldown - (now - player.lastMystery)) / 60000);
          return ctx.reply(`⏳ يمكنك الانتظار بعد ${remaining} دقيقة`);
        }

        const event = gameEngine.getMysteryEvent();
        playerStore.updatePlayer(userId, { currentMystery: event });

        let response = `
👻 حدث غامض
━━━━━━━━━━━━━━━━━━━━━━

🔮 ${event.title}
${event.description}

🔹 الخيارات:
1️⃣ ${event.options[0].text}
2️⃣ ${event.options[1].text}
3️⃣ ${event.options[2].text}

💬 اكتب: .اختر [1/2/3]
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'استكشاف',
      aliases: ['explore'],
      description: 'استكشاف خريطة المملكة',
      usage: '.استكشاف [0-4]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const areaIndex = parseInt(args[0]);
        const player = playerStore.getPlayer(userId);

        if (!player) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        const areas = require('../lib/gamesData.js').default.mapAreas;
        
        let response = `
🗺️ خريطة المملكة
━━━━━━━━━━━━━━━━━━━━━━

`;
        areas.forEach((area, idx) => {
          const locked = player.points < area.requiredPoints ? '🔒' : '🔓';
          response += `${locked} ${area.emoji} ${area.name} (${area.requiredPoints} نقطة)\n`;
        });

        if (isNaN(areaIndex)) {
          return ctx.reply(response + `\n💬 اكتب: .استكشاف [0-4]`);
        }

        const now = Date.now();
        const cooldown = 30 * 60 * 1000;

        if (player.lastExplore && (now - player.lastExplore) < cooldown) {
          const remaining = Math.ceil((cooldown - (now - player.lastExplore)) / 60000);
          return ctx.reply(`⏳ استرح قليلاً! العودة بعد ${remaining} دقيقة`);
        }

        const explore = gameEngine.exploreArea(userId, areaIndex);
        if (!explore.success) {
          return ctx.reply(`❌ لا تملك نقاطاً كافية لهذه المنطقة!`);
        }

        playerStore.updatePlayer(userId, { lastExplore: now });
        response = `
✨ استكشاف ناجح!
━━━━━━━━━━━━━━━━━━━━━━

${explore.area.emoji} ${explore.area.name}

🏆 المكافآت:
+${explore.rewards.points} نقطة
        `;

        ctx.reply(response);
      },
    },
    {
      name: 'معركة',
      aliases: ['battle', 'pvp'],
      description: 'معركة PvP',
      usage: '.معركة [رقم المنافس]',
      category: 'games',
      handler: async (ctx, args, input) => {
        const userId = ctx.senderId;
        const targetNum = args[0];
        const player = playerStore.getPlayer(userId);

        if (!player) {
          return ctx.reply(`❌ لم تنضم بعد! اكتب .انضم`);
        }

        if (!targetNum) {
          return ctx.reply(`💬 استخدم: .معركة [رقم الشخص]`);
        }

        ctx.reply(`⚔️ تم إرسال طلب معركة!\nبانتظار قبول المنافس...`);
      },
    },
    {
      name: 'لوحة',
      aliases: ['leaderboard', 'لوحة الشرف'],
      description: 'عرض أفضل 10 لاعبين',
      usage: '.لوحة',
      category: 'games',
      handler: async (ctx, args, input) => {
        const topPlayers = playerStore.getTopPlayers(10);
        
        let response = `
🏆 لوحة الشرف
━━━━━━━━━━━━━━━━━━━━━━

`;
        
        topPlayers.forEach((player, idx) => {
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}️⃣`;
          response += `${medal} ${player.phone}: ${player.points} نقطة (المستوى ${player.level})\n`;
        });

        ctx.reply(response);
      },
    },
  ],
};

export default games;
