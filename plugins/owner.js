// Owner Commands Plugin

const ownerCommands = {
  commands: [
    {
      name: 'قائمة',
      aliases: ['menu', 'help', 'أوامر'],
      description: 'عرض قائمة جميع الأوامر',
      usage: '.قائمة',
      category: 'owner',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const menu = `
🧪 مملكة العلم - قائمة الأوامر
════════════════════════════════════

🎮 أوامر اللعبة:
.انضم [1-4]         - الانضمام والبدء
.حالتي              - عرض معلوماتك
.تحدي               - سؤال علمي
.لغز                - لغز عربي
.كلمة               - كلمة مشفرة
.صح                 - صح أم خطأ
.سريع               - سؤال سريع
.عجلة               - عجلة الحظ (24س)
.رياضيات [مستوى]   - تحدي رياضي
.رهان [نوع] [مبلغ]  - رهان النرد
.حدث                - حدث غامض
.استكشاف [منطقة]    - خريطة المملكة
.معركة [رقم]        - معركة PvP
.لوحة               - لوحة الشرف

😂 أوامر المتعة:
.نكتة               - نكتة عشوائية
.حكمة               - اقتباس ملهم
.نرد                - رمي نرد
.عملة               - وجه أو كتابة
.عكس [نص]           - عكس النص
.عداد [ثواني]        - عداد تنازلي

👑 أوامر المالك:
.بينج                - اختبار السرعة
.معلومات البوت       - معلومات البوت
.اعادة تشغيل         - إعادة تشغيل
.البلاجنز            - عرض الـ plugins

🧪 بعشرة مليارات بالمئة!
        `;
        ctx.reply(menu);
      },
    },
    {
      name: 'بينج',
      aliases: ['ping'],
      description: 'اختبار سرعة البوت',
      usage: '.بينج',
      category: 'owner',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const startTime = Date.now();
        const msg = await ctx.replyRaw('🏓 جاري الاختبار...');
        const endTime = Date.now();
        const ping = endTime - startTime;

        ctx.reply(`
🏓 بينج البوت
════════════════════════════════════

⚡ السرعة: ${ping}ms
📊 الحالة: ${ping < 100 ? '✅ ممتازة' : ping < 300 ? '🟡 جيدة' : '🔴 بطيئة'}
        `);
      },
    },
    {
      name: 'معلومات',
      aliases: ['info', 'معلومات البوت'],
      description: 'معلومات البوت الكاملة',
      usage: '.معلومات',
      category: 'owner',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const info = `
🤖 معلومات البوت
════════════════════════════════════

📛 الاسم: مملكة العلم
👤 المطور: Ahmedaligue
🎯 النسخة: 1.0.0

📊 الإحصائيات:
👥 عدد المستخدمين: جاري الحساب...
🎮 عدد اللاعبين: جاري الحساب...
💾 حجم الذاكرة: جاري الحساب...

🔗 القناة الرسمية:
https://whatsapp.com/channel/0029Vb6YJqq0lwgzYNWVN21u

🧪 بعشرة مليارات بالمئة!
        `;
        ctx.reply(info);
      },
    },
    {
      name: 'بث',
      aliases: ['broadcast'],
      description: 'إرسال رسالة لجميع المحادثات (مالك فقط)',
      usage: '.بث [الرسالة]',
      category: 'owner',
      ownerOnly: true,
      handler: async (ctx, args, input) => {
        if (!input) {
          return ctx.reply('❌ يجب كتابة الرسالة');
        }
        
        ctx.reply(`📢 تم إرسال البث: "${input}"`);
      },
    },
    {
      name: 'البلاجنز',
      aliases: ['plugins'],
      description: 'عرض الـ plugins المحملة',
      usage: '.البلاجنز',
      category: 'owner',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const response = `
📦 الـ Plugins المحملة
════════════════════════════════════

✅ games.js - أوامر اللعبة
✅ owner.js - أوامر المالك
✅ fun.js - أوامر المتعة
✅ tools.js - الأدوات

🧪 بعشرة مليارات بالمئة!
        `;
        ctx.reply(response);
      },
    },
  ],
};

export default ownerCommands;
