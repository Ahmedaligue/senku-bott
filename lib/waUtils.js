// WhatsApp Utilities

export const formatMessage = (message, channelUrl) => {
  return `${message}\n\n━━━━━━━━━━━━━━━━━\n📢 انضم لقناتنا\n${channelUrl}`;
};

export const createButtonMessage = (title, buttons) => {
  return {
    text: title,
    buttons: buttons.map((btn, idx) => ({
      buttonId: `btn_${idx}`,
      buttonText: { displayText: btn },
      type: 1,
    })),
    headerType: 1,
  };
};

export const createListMessage = (title, description, sections) => {
  return {
    text: title,
    footer: description,
    title: title,
    buttonText: 'اختر من القائمة',
    sections: sections,
  };
};

export const extractPhoneNumber = (jid) => {
  return jid.split('@')[0];
};

export const getResponseEmoji = (success) => {
  return success ? '✅' : '❌';
};

export const sinkuMessages = {
  success: '✅ بعشرة مليارات بالمئة! إجابة صحيحة! 🧪',
  wrong: '❌ خطأ! الفشل جزء من التجربة العلمية! ⚗️',
  welcome: `🧪 بعشرة مليارات بالمئة... وصلتَ إلى مملكة العلم!

أنا سينكو إيشيغامي — العبقري الذي سيُعيد بناء الحضارة بالعلم.

اختر دورك الآن:\n1️⃣ عالم 🧪\n2️⃣ محارب ⚔️\n3️⃣ جامع 🌿\n4️⃣ قائد 👑\n\nأكتب: .انضم [1/2/3/4]`,
  alreadyJoined: '⚠️ أنتَ منضم بالفعل! اكتب .حالتي لترى معلوماتك',
};

export const roleEmojis = {
  scientist: '🧪',
  warrior: '⚔️',
  gatherer: '🌿',
  leader: '👑',
};

export const materialEmojis = {
  stone: '🪨',
  iron: '⚙️',
  nitricAcid: '⚗️',
  glass: '🔮',
};
