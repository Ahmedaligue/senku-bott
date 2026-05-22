// Fun Commands Plugin

const funCommands = {
  commands: [
    {
      name: 'نكتة',
      aliases: ['joke'],
      description: 'نكتة عشوائية',
      usage: '.نكتة',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const jokes = [
          'ما الفرق بين الفيزياء والكيمياء؟ الفيزيائيون يجربون على الكيميائيين! 😄',
          'قال الحاسوب لزميله: يا صديقي، أنت بتاع كود؟ قال: لا، أنا بتاع كودا! 🤖😂',
          'لماذا الرياضيات حزينة؟ لأنها ملية بالمشاكل! 📖😢',
          'قال معلم الفيزياء: "الضوء يسير بسرعة" قال الطالب: "لماذا ما يستريح شوية؟" 💡😄',
          'العلماء قالوا: تعادل النقيضين مستحيل! قلت: وأنا مستحيل ما أقتنع! 🧪😂',
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        ctx.reply(`😂 ${joke}`);
      },
    },
    {
      name: 'حكمة',
      aliases: ['quote'],
      description: 'حكمة أو اقتباس ملهم',
      usage: '.حكمة',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const quotes = [
          '"العلم هو المفتاح الذي يفتح أبواب المستقبل" - سينكو إيشيغامي',
          '"الفشل ليس نهاية، بل هو بداية التعلم"',
          '"في كل مشكلة علمية، يكمن حل جميل"',
          '"بدون علم، الحياة مجرد روتين. مع العلم، الحياة مغامرة"',
          '"التاريخ يعيد نفسه، لكن العلم يغير المستقبل"',
          '"العلماء لا يسألون "لماذا"؟ بل يسألون "كيف؟""',
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        ctx.reply(`💭 ${quote}`);
      },
    },
    {
      name: 'نرد',
      aliases: ['dice', 'roll'],
      description: 'رمي نرد عشوائي',
      usage: '.نرد',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const dice = Math.floor(Math.random() * 6) + 1;
        const diceEmojis = ['⚫', '🔴', '🔵', '🟢', '🟡', '🟣'];
        ctx.reply(`
🎲 رمي النرد
════════════════════════════════════

${diceEmojis[dice - 1]} النتيجة: ${dice}
        `);
      },
    },
    {
      name: 'عملة',
      aliases: ['coin', 'flip'],
      description: 'رمي عملة - وجه أو كتابة',
      usage: '.عملة',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const result = Math.random() > 0.5 ? '🪙 وجه' : '📕 كتابة';
        ctx.reply(`
💰 رمي العملة
════════════════════════════════════

${result}
        `);
      },
    },
    {
      name: 'عكس',
      aliases: ['reverse'],
      description: 'عكس النص',
      usage: '.عكس [النص]',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        if (!input) {
          return ctx.reply('❌ اكتب النص المراد عكسه');
        }
        const reversed = input.split('').reverse().join('');
        ctx.reply(`
🔄 عكس النص
════════════════════════════════════

📝 النص الأصلي: ${input}
↩️ النص المعكوس: ${reversed}
        `);
      },
    },
    {
      name: 'عداد',
      aliases: ['timer', 'countdown'],
      description: 'عداد تنازلي',
      usage: '.عداد [الثواني]',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        const seconds = parseInt(args[0]) || 10;
        if (seconds > 300) {
          return ctx.reply('❌ الحد الأقصى 300 ثانية');
        }
        ctx.reply(`⏱️ عداد تنازلي: ${seconds} ثانية\n🎯 سيبدأ الآن...`);
      },
    },
    {
      name: 'لغة',
      aliases: ['secret'],
      description: 'تشفير النص بالإيموجي',
      usage: '.لغة [النص]',
      category: 'fun',
      ownerOnly: false,
      handler: async (ctx, args, input) => {
        if (!input) {
          return ctx.reply('❌ اكتب النص المراد تشفيره');
        }
        const encrypted = input.split('').map(() => '🔐').join('');
        ctx.reply(`
🔐 لغة سرية
════════════════════════════════════

${encrypted}
\n(انسخ هذا الرمز السري! 😎)
        `);
      },
    },
  ],
};

export default funCommands;
