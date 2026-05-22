import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, delay } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Config
const config = {
  owner: process.env.OWNER || '212625457341',
  prefix: process.env.PREFIX || '.',
  channel: process.env.CHANNEL || 'https://whatsapp.com/channel/0029Vb6YJqq0lwgzYNWVN21u',
};

const SESSIONS_DIR = join(__dirname, 'sessions');
const PLUGINS_DIR = join(__dirname, 'plugins');

// Ensure directories exist
if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR);
if (!existsSync(PLUGINS_DIR)) mkdirSync(PLUGINS_DIR);

let sock;
let isConnecting = false;

// Load all plugins
const loadPlugins = async () => {
  const plugins = new Map();
  const pluginFiles = readdirSync(PLUGINS_DIR).filter(file => file.endsWith('.js'));

  for (const file of pluginFiles) {
    try {
      const pluginPath = `./plugins/${file.replace('.js', '')}.js`;
      const plugin = await import(pluginPath);
      const commands = plugin.default.commands || [];
      
      commands.forEach(cmd => {
        plugins.set(cmd.name, cmd);
        if (cmd.aliases) {
          cmd.aliases.forEach(alias => plugins.set(alias, cmd));
        }
      });

      console.log(`✅ Plugin loaded: ${file}`);
    } catch (error) {
      console.error(`❌ Error loading plugin ${file}:`, error.message);
    }
  }

  return plugins;
};

let loadedPlugins = new Map();

// Message handler
const handleMessage = async (ctx) => {
  const { message } = ctx;
  if (!message || message.fromMe) return;

  const text = message.conversation || message.extendedTextMessage?.text || '';
  if (!text.startsWith(config.prefix)) return;

  const args = text.slice(config.prefix.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();
  const input = args.join(' ');

  if (!command) return;

  const cmd = loadedPlugins.get(command);
  if (!cmd) {
    return ctx.reply(`❌ الأمر غير موجود! اكتب ${config.prefix}قائمة للمزيد`);
  }

  if (cmd.ownerOnly && ctx.senderId !== config.owner) {
    return ctx.reply('❌ هذا الأمر مخصص للمالك فقط!');
  }

  try {
    await cmd.handler(ctx, args, input);
  } catch (error) {
    console.error(`Error in command ${command}:`, error);
    ctx.reply(`❌ حدث خطأ: ${error.message}`);
  }
};

// Initialize bot
const initializeBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(SESSIONS_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['Ubuntu', 'Chrome', '121.0.6167.160'],
    syncFullHistory: false,
    getMessage: async (key) => {
      return {
        conversation: 'مرحباً بك في مملكة العلم!',
      };
    },
  });

  // Handle credentials update
  sock.ev.on('creds.update', saveCreds);

  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('⏳ Scan QR Code or use Pairing Code');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'connecting') {
      isConnecting = true;
      console.log('🔄 Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      isConnecting = false;
      console.log('✅ Bot connected successfully!');
      
      // Load plugins after connection
      loadedPlugins = await loadPlugins();
      console.log(`\n📦 ${loadedPlugins.size} commands loaded\n`);
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log('❌ Connection closed. Reconnecting...');
      if (shouldReconnect && !isConnecting) {
        setTimeout(initializeBot, 3000);
      }
    }
  });

  // Handle messages
  sock.ev.on('messages.upsert', async (m) => {
    if (m.type !== 'notify') return;

    for (const msg of m.messages) {
      if (!msg.message) continue;

      const jid = msg.key.remoteJid;
      const senderId = msg.key.participant || jid;
      const senderNum = senderId.split('@')[0];
      const isOwner = senderNum === config.owner;

      // Create context object
      const ctx = {
        sock,
        msg,
        jid,
        senderId,
        senderNum,
        isOwner,
        config,
        message: msg.message,
        
        // Reply methods
        reply: async (text) => {
          const message = `${text}\n\n━━━━━━━━━━━━━━━━━━\n📢 القناة الرسمية\n${config.channel}`;
          return sock.sendMessage(jid, { text: message }, { quoted: msg });
        },

        replyRaw: async (text) => {
          return sock.sendMessage(jid, { text }, { quoted: msg });
        },

        replyImage: async (imageUrl, caption = '') => {
          const message = caption ? `${caption}\n\n━━━━━━━━━━━━━━━━━━\n📢 القناة الرسمية\n${config.channel}` : config.channel;
          return sock.sendMessage(jid, { 
            image: { url: imageUrl }, 
            caption: message 
          }, { quoted: msg });
        },

        replyVideo: async (videoUrl, caption = '') => {
          const message = caption ? `${caption}\n\n━━━━━━━━━━━━━━━━━━\n📢 القناة الرسمية\n${config.channel}` : config.channel;
          return sock.sendMessage(jid, { 
            video: { url: videoUrl }, 
            caption: message 
          }, { quoted: msg });
        },

        replyAudio: async (audioUrl) => {
          return sock.sendMessage(jid, { 
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg'
          }, { quoted: msg });
        },
      };

      await handleMessage(ctx);
    }
  });

  // Handle group updates
  sock.ev.on('group-participants.update', (update) => {
    console.log(`Group update in ${update.id}:`, update.action);
  });
};

// Start bot
console.log('🧪 مملكة العلم - الإطلاق...');
console.log('🌐 by Ahmedaligue\n');
initializeBot().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Bot shutting down...');
  process.exit(0);
});
