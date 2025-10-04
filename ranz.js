const TelegramBot = require('node-telegram-bot-api');
const { Telegraf } = require('telegraf');
const { Markup } = require('telegraf');
const express = require('express');
const multer = require('multer');
const url = require('url');
const { Client } = require('ssh2');
const archiver = require('archiver');
const AdmZip = require("adm-zip");
const JSZip = require("jszip");
const axios = require('axios');
const crypto = require('crypto');
const activeBuyUserBot = {};
const activeDeposit = {};
const activeApikey = {};
const activeTopup = {};
const userPendingTopup = {};
const pendingBeli = {};
const activeBeli = {};
const tempStore = new Map();
const qs = require("qs");
const QRCode = require('qrcode');
const FormData = require('form-data');
const { createCanvas, loadImage } = require('canvas');
const { sizeFormatter } = require('human-readable');
const readline = require('readline');
const FileType = require('file-type');
const { fromBuffer } = require('file-type');
const Jimp = require('jimp');
const JsConfuser = require('js-confuser');
const NodeCache = require('node-cache');
const sharp = require('sharp');
const currencyFormatter = require('currency-formatter');
const moment = require("moment-timezone");
const path = require('path');
const chalk = require('chalk');
const { ImageUploadService } = require('node-upload-images');
const fs = require('fs-extra');
const { execSync } = require("child_process");
const { exec } = require('child_process');
const { spawn } = require('child_process');
const speed = require('performance-now');
const genAI = require("@google/generative-ai");
const nou = require("node-os-utils");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const os = require('os');
const { networkInterfaces } = require('os');
const { tiktokDl } = require('./scraper');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { lookup } = require("mime-types");
const canvafy = require('canvafy');
const { Primbon } = require('scrape-primbon');
const primbon = new Primbon();
const settings = require('./settings');
const token = settings.token;
const BOT_TOKEN = process.env.BOT_TOKEN || token;
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
const premiumUsersFile = 'premiumUsers.json';
const premium2UsersFile = 'premium2Users.json';
const aksesUsersFile = 'aksesUsers.json';
const channelUsername = "@Ranz7rtx";
const groupUsername = "@groupcreateweb";
const Resapiku = "alfibandung";
const owner = settings.owner;
const versi = settings.version;
const merchantIdOrderKuota = settings.merchantidorderkuota;
const apiOrderKuota = settings.apiorderkuota;
const qrisOrderKuota = settings.qrisorderkuota;
const Tokeninstall = settings.tokeninstall;
const Bash = settings.bash;
const pinOrkut = settings.pinorkut;
const pinH2H = settings.pinh2h;
const pwOrkut = settings.pworkut;
const passwordH2H = settings.passwordh2h;
const apiSimpleBot = settings.apisimplebot;
const Ovo = settings.ovo;
const Dana = settings.dana;
const Gopay = settings.gopay;
const Bni = settings.bni;
const Domain = settings.domain;
const Apikey = settings.apikey;
const Capikey = settings.capikey;
const DomainV2 = settings.domainv2;
const ApikeyV2 = settings.apikeyv2;
const CapikeyV2 = settings.capikeyv2;
const apiAtlantic = settings.ApikeyAtlantic;
const FeeTrx = settings.FeeTransaksi;
const nopencairan = settings.nomor_pencairan;
const typeewallet = settings.type_ewallet;
const atasnamaewallet = settings.atas_nama_ewallet;
const googleApiKey = settings.apikeygoogle;
const apiDo = settings.apiDO;
const GITHUB_API_URL = 'https://api.github.com';
const scFile = './buyscript.json';
const autoaiFile = './autoai.json';
const autoReply = "./autoreply.json";
const botName = "ranz"; // Keyword panggilan bot
const { addSaldo, minSaldo, cekSaldo, listSaldo, resetSaldo } = require('./source/deposit');
const temDir = path.join(__dirname, 'temp');
const textDir = path.join(__dirname, 'text');
const TEXT_FILE_1 = path.join(textDir, 'bypass1.txt');
const TEXT_FILE_2 = path.join(textDir, 'bypass2.txt');
const CH_ID = '-1002929292773'; // ganti dengan ID channel kamu

// ==== Pastikan folder & file tersedia ====
fs.ensureDirSync(temDir);
fs.ensureDirSync(textDir);

if (!fs.existsSync(TEXT_FILE_1)) {
  fs.writeFileSync(TEXT_FILE_1, '// isi default bypass 1\n');
}
if (!fs.existsSync(TEXT_FILE_2)) {
  fs.writeFileSync(TEXT_FILE_2, '// isi default bypass 2\n');
}

const sessions = {}; // simpan data sementara per-user
const CHAT_ID = "@Ranz7rtx"; // ganti sesuai channel-mu
const INTERVAL = 60 * 60 * 1000; // cek tiap 1 jam

let lastGempaTime = null;

async function kirimGempaBaru() {
  try {
    const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await response.json();

    if (!data || !data.Infogempa || !data.Infogempa.gempa) {
      return console.log("❌ Gagal mendapatkan data gempa dari BMKG.");
    }

    const gempa = data.Infogempa.gempa;

    // Cek apakah gempa ini sudah dikirim sebelumnya
    if (gempa.Tanggal + gempa.Jam === lastGempaTime) {
      console.log("Tidak ada gempa baru.");
      return;
    }

    // Update lastGempaTime
    lastGempaTime = gempa.Tanggal + gempa.Jam;

    // Cek potensi tsunami
    let alertEmoji = "";
    if (gempa.Potensi && gempa.Potensi.toLowerCase().includes("tsunami")) {
      alertEmoji = "⚠️🚨 "; // bisa diganti sesuai keinginan
    }

    let caption = `${alertEmoji}*📈 INFO GEMPA TERKINI*\n\n`;
    caption += `*Tanggal:* ${gempa.Tanggal}\n`;
    caption += `*Waktu:* ${gempa.Jam}\n`;
    caption += `*Magnitudo:* ${gempa.Magnitude}\n`;
    caption += `*Kedalaman:* ${gempa.Kedalaman}\n`;
    caption += `*Lokasi:* ${gempa.Wilayah}\n`;
    caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`;
    caption += `*Potensi:* ${gempa.Potensi}\n`;
    caption += `*Dirasakan:* ${gempa.Dirasakan}\n\n`;

    if (gempa.Shakemap) {
      const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
      await bot.sendPhoto(CHAT_ID, shakemapUrl, { caption: caption });
    } else {
      await bot.sendMessage(CHAT_ID, caption, { parse_mode: "Markdown" });
    }

    console.log("✅ Gempa baru dikirim ke channel.");
  } catch (error) {
    console.error("❌ Terjadi kesalahan:", error);
  }
}

// Cek gempa pertama kali saat bot start
kirimGempaBaru();

// Jadwalkan cek setiap interval
setInterval(kirimGempaBaru, INTERVAL);
const app = express();
const upload = multer({ dest: 'uploads/' });
let db_saldo = JSON.parse(fs.readFileSync('./source/saldo.json'));
const dbPath = path.join(__dirname, 'database.json');
const blockedFile = path.join(__dirname, 'blocked.json');
const sviddepo = path.join(__dirname, 'sviddepo.json');
const bannedFile = path.join(__dirname, 'banned.json');
const welcomeFile = path.join(__dirname, 'welcome.json');
let welcomeData = {};

// Load data welcome jika ada
if (fs.existsSync(welcomeFile)) {
  welcomeData = JSON.parse(fs.readFileSync(welcomeFile));
}

const saveidgcFile = path.join(__dirname, "saveidgc.json");
if (!fs.existsSync(saveidgcFile)) {
    fs.writeFileSync(saveidgcFile, JSON.stringify([]));
}

function readData() {
    return JSON.parse(fs.readFileSync(saveidgcFile, "utf-8"));
}
function writeData(data) {
    fs.writeFileSync(saveidgcFile, JSON.stringify(data, null, 2));
}

const saveidchFile = path.join(__dirname, "saveidch.json");
if (!fs.existsSync(saveidchFile)) {
    fs.writeFileSync(saveidchFile, JSON.stringify([]));
}
function readData2() {
    return JSON.parse(fs.readFileSync(saveidchFile, "utf8"));
}
function writeData2(data) {
    fs.writeFileSync(saveidchFile, JSON.stringify(data, null, 2));
}

const saveidbcFile = path.join(__dirname, "saveidbc.json");
if (!fs.existsSync(saveidbcFile)) {
    fs.writeFileSync(saveidbcFile, JSON.stringify([]));
}
function readBCData() {
    return JSON.parse(fs.readFileSync(saveidbcFile, "utf8"));
}
function writeBCData(data) {
    fs.writeFileSync(saveidbcFile, JSON.stringify(data, null, 2));
}

// Fungsi load data blocked
function loadBlockedUsers() {
    if (!fs.existsSync(blockedFile)) return [];
    return JSON.parse(fs.readFileSync(blockedFile));
}

// Fungsi simpan data blocked
function saveBlockedUsers(data) {
    fs.writeFileSync(blockedFile, JSON.stringify(data, null, 2));
}

function loadBannedUsers() {
    if (!fs.existsSync(bannedFile)) return [];
    return JSON.parse(fs.readFileSync(bannedFile));
}

// Fungsi simpan data banned
function saveBannedUsers(data) {
    fs.writeFileSync(bannedFile, JSON.stringify(data, null, 2));
}
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}
function saveDatabase(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}


let db = readDatabase();

const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + ' GB';
    const freeRam = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + ' GB';
try {
    premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
} catch (error) {
    console.error('Error reading premiumUsers file:', error);
}
try {
    premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
} catch (error) {
    console.error('Error reading premium2Users file:', error);
}
try {
    aksesUsers = JSON.parse(fs.readFileSync(aksesUsersFile));
} catch (error) {
    console.error('Error reading aksesUsers file:', error);
}

// === File Database Jualan ===
const jualanPath = "./jualan.json";
if (!fs.existsSync(jualanPath)) fs.writeFileSync(jualanPath, JSON.stringify([]));

function loadJualan() {
  return JSON.parse(fs.readFileSync(jualanPath));
}
function saveJualan(data) {
  fs.writeFileSync(jualanPath, JSON.stringify(data, null, 2));
}

// 📂 Load data autoreply dari file
let autoreplyData = {};
if (fs.existsSync(autoReply)) {
  autoreplyData = JSON.parse(fs.readFileSync(autoReply));
}

// 🔄 Simpan data ke file
function saveAutoreply() {
  fs.writeFileSync(autoReply, JSON.stringify(autoreplyData, null, 2));
}

// ================== Helper ==================
function getAllowedGroups() {
  if (!fs.existsSync(sviddepo)) return [];
  try {
    return JSON.parse(fs.readFileSync(sviddepo));
  } catch {
    return [];
  }
}

function saveAllowedGroups(groups) {
  fs.writeFileSync(sviddepo, JSON.stringify(groups, null, 2));
}

const bot = new TelegramBot(token, { polling: true });


bot.on('polling_error', (err) => console.error("Polling error:", err));

// Fungsi upload ke Catbox
async function uploadToCatbox(buffer) {
    const FormData = require('form-data');
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', buffer, 'image.jpg');

    const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
    });
    return (await res.text()).trim();
}

function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomPassword() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
const length = 10;
let password = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
password += characters[randomIndex];
}
return password;
}

function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatp = sizeFormatter({
    std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

const jsonformat = (string) => {
    return JSON.stringify(string, null, 2)
}

const reSize = async (image, ukur1 = 100, ukur2 = 100) => {
	return new Promise(async(resolve, reject) => {
		try {
			const read = await Jimp.read(image);
			const result = await read.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG)
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})
}

function detectPluginType(code) {
  if (/export\s+default\s+handler/.test(code)) return 'esm';
  if (/module\.exports\s*=\s*handler/.test(code)) return 'cjs';
  if (/case\s+['"`]/.test(code)) return 'case';
  return 'scrape';
}

function buildEnglishPrompt(sourceCode, targetType) {
  const inputType = detectPluginType(sourceCode);
  const targetFormat = targetType.toUpperCase();

  let taskInstruction = '';

  if (inputType === 'scrape') {
    if (targetFormat === 'CASE') {
      taskInstruction = `
You are an expert developer for WhatsApp bots. Your task is to wrap the given code into a complete WhatsApp bot CASE handler:
- Create a proper case block: case "<command>": { /* code */ break }
- Example:
case "example": {
  const res = await fetch('https://api.example.com');
  const data = await res.json();
  m.reply(JSON.stringify(data, null, 2));
}
break
- Generate a suitable command name for the case (based on code context)
- Use conn.sendMessage or m.reply for output
- Do not change the core logic of the code
- Ensure it is ready for use inside a WhatsApp bot switch-case structure`;
    } else {
      taskInstruction = `
You are an expert developer for WhatsApp bots. Your task is to wrap the given code into a complete WhatsApp bot ${targetFormat} plugin:
- Add necessary handler structure with handler.command, handler.category, handler.description
- Generate suitable values for these properties
- Do not modify the core logic of the code
- Ensure it is ready for use in a WhatsApp bot`;
    }
  } else {
    taskInstruction = `
You are an expert code converter for WhatsApp bots. Your task is to convert the provided bot code into ${targetFormat} format:
- Do not change the logic, variables, or functions
- Only adjust the module system (imports/exports/handler structure) as needed
- Ensure it matches the WhatsApp bot feature format`;
  }

  return `
${taskInstruction}

**Rules:**
1. ONLY return raw code. No explanations, no markdown, no code fences.
2. If you can't generate valid code, respond with JSON: { "success": false, "message": "Your explanation." }

**Source Code:**
${sourceCode}

Now return the converted code or JSON error.
`;
}

//fungsi antilink
const saveAntilink = () => {
  fs.writeFileSync('./antilink.json', JSON.stringify(antilinkData, null, 2));
};
let antilinkData = JSON.parse(fs.readFileSync('./antilink.json'));
//fungsi antitag owner
const saveAntitagOwner = () => {
  fs.writeFileSync('./antitagowner.json', JSON.stringify(antitagOwnerData, null, 2));
};
let antitagOwnerData = JSON.parse(fs.readFileSync('./antitagowner.json', 'utf8'));

// ✅ Data Anti Spam
let antispamData = {};
function saveAntispam() {
  fs.writeFileSync("./antispam.json", JSON.stringify(antispamData, null, 2));
}
function loadAntispam() {
  if (fs.existsSync("./antispam.json")) {
    antispamData = JSON.parse(fs.readFileSync("./antispam.json"));
  }
}
loadAntispam();

//fungsi nikktp
async function nikParse(nik) {
    try {
        const provincesRes = await axios.get('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json');
        const provinces = Object.fromEntries(provincesRes.data.map(p => [p.id, p.name.toUpperCase()]));
        
        nik = nik.toString();
        if (nik.length !== 16 || !provinces[nik.slice(0, 2)]) throw new Error('NIK tidak valid: panjang atau kode provinsi salah');
        
        const provinceId = nik.slice(0, 2);
        const regenciesRes = await axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
        const regencies = Object.fromEntries(regenciesRes.data.map(r => [r.id, r.name.toUpperCase()]));
        
        if (!regencies[nik.slice(0, 4)]) throw new Error('NIK tidak valid: kode kabupaten/kota salah');
        
        const regencyId = nik.slice(0, 4);
        const districtsRes = await axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`);
        const districts = Object.fromEntries(districtsRes.data.map(d => [d.id.slice(0, -1), `${d.name.toUpperCase()}`]));
        
        if (!districts[nik.slice(0, 6)]) throw new Error('NIK tidak valid: kode kecamatan salah');
        
        const province = provinces[provinceId];
        const city = regencies[regencyId];
        const subdistrict = districts[nik.slice(0, 6)];
        const day = parseInt(nik.slice(6, 8));
        const month = parseInt(nik.slice(8, 10));
        const yearCode = nik.slice(10, 12);
        const uniqCode = nik.slice(12, 16);
        
        const gender = day > 40 ? 'PEREMPUAN' : 'LAKI-LAKI';
        const birthDay = day > 40 ? (day - 40).toString().padStart(2, '0') : day.toString().padStart(2, '0');
        const birthYear = yearCode < new Date().getFullYear().toString().slice(-2) ? `20${yearCode}` : `19${yearCode}`;
        const birthDate = `${birthDay}/${month.toString().padStart(2, '0')}/${birthYear}`;
        const birth = new Date(birthYear, month - 1, birthDay);
        
        if (isNaN(birth.getTime())) throw new Error('Tanggal lahir tidak valid');
        
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let remainingDays = today.getDate() - birth.getDate();
        if (remainingDays < 0) {
            remainingDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }
        const age = `${years} Tahun ${months} Bulan ${remainingDays} Hari`;
        
        let ageCategory = '';
        if (years < 12) ageCategory = 'Anak-anak';
        else if (years < 18) ageCategory = 'Remaja';
        else if (years < 60) ageCategory = 'Dewasa';
        else ageCategory = 'Lansia';
        
        const nextBirthday = new Date(today.getMonth() < month - 1 ? today.getFullYear() : today.getFullYear() + 1, month - 1, birthDay);
        const timeDiff = nextBirthday - today;
        const monthsLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
        const daysLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const birthdayCountdown = `${monthsLeft} Bulan ${daysLeft} Hari`;
        
        const baseDate = new Date(1970, 0, 2);
        const diffDays = Math.floor((birth - baseDate + 86400000) / (1000 * 60 * 60 * 24));
        const pasaranIndex = Math.round((diffDays % 5) * 2) / 2;
        const pasaranNames = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const birthDateFull = `${birthDay} ${monthNames[month - 1]} ${birthYear}`;
        const pasaran = `${dayNames[birth.getDay()]} ${pasaranNames[pasaranIndex] || ''}, ${birthDay} ${monthNames[month - 1]} ${birthYear}`;
        
        let zodiac = '';
        if ((month === 1 && day >= 20) || (month === 2 && day < 19)) zodiac = 'Aquarius';
        else if ((month === 2 && day >= 19) || (month === 3 && day < 21)) zodiac = 'Pisces';
        else if ((month === 3 && day >= 21) || (month === 4 && day < 20)) zodiac = 'Aries';
        else if ((month === 4 && day >= 20) || (month === 5 && day < 21)) zodiac = 'Taurus';
        else if ((month === 5 && day >= 21) || (month === 6 && day < 22)) zodiac = 'Gemini';
        else if ((month === 6 && day >= 21) || (month === 7 && day < 23)) zodiac = 'Cancer';
        else if ((month === 7 && day >= 23) || (month === 8 && day < 23)) zodiac = 'Leo';
        else if ((month === 8 && day >= 23) || (month === 9 && day < 23)) zodiac = 'Virgo';
        else if ((month === 9 && day >= 23) || (month === 10 && day < 24)) zodiac = 'Libra';
        else if ((month === 10 && day >= 24) || (month === 11 && day < 23)) zodiac = 'Scorpio';
        else if ((month === 11 && day >= 23) || (month === 12 && day < 22)) zodiac = 'Sagitarius';
        else if ((month === 12 && day >= 22) || (month === 1 && day < 20)) zodiac = 'Capricorn';
        
        const regencyType = city.includes('KOTA') ? 'Kota' : 'Kabupaten';
        const areaCode = `${provinceId}.${regencyId.slice(2)}.${nik.slice(4, 6)}`;
        
        return {
            nik,
            kelamin: gender,
            lahir: birthDate,
            lahir_lengkap: birthDateFull,
            provinsi: {
                kode: provinceId,
                nama: province
            },
            kotakab: {
                kode: regencyId,
                nama: city,
                jenis: regencyType
            },
            kecamatan: {
                kode: nik.slice(0, 6),
                nama: subdistrict
            },
            kode_wilayah: areaCode,
            nomor_urut: uniqCode,
            tambahan: {
                pasaran,
                usia: age,
                kategori_usia: ageCategory,
                ultah: `${birthdayCountdown} Lagi`,
                zodiak: zodiac
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

const jadwal = {
  Bandung: {
    shubuh: '04:06',
    terbit: '05:44',
    dhuha: '05:55',
    dzuhur: '11:48',
    ashar: '15:16',
    magrib: '17:55',
    isya: '19:10'
  },
  Purwakarta: {
    shubuh: '04:08',
    terbit: '05:46',
    dhuha: '05:57',
    dzuhur: '11:50',
    ashar: '15:18',
    magrib: '17:57',
    isya: '19:12'
  }
};

// URL file adzan (meskipun .mp4, tetap kita kirim sebagai audio)
const adzanUrl = 'https://files.catbox.moe/ua8wgi.mp4';

// Simpan chat ID subscriber
let subscribers = [];

// Event untuk menambahkan subscriber
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
  }
});

bot.on("message", (msg) => {
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    const userId = msg.from.id.toString();
    const waktu = moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss");

    // Ambil data existing
    let data = readBCData();

    // Cek dan simpan otomatis jika belum ada
    if (!data.includes(userId)) {
        data.push(userId);
        writeBCData(data); // Auto-save ke file

        const totalID = data.length;

        // Kirim ke channel
        bot.sendMessage(-1003042146542, 
`✅ ID Baru Tersimpan
━━━━━━━━━━━━━━
👤 Username: ${username}
🆔 ID: ${userId}
🕒 Waktu: ${waktu}
📊 Total ID: ${totalID}
# Auto Save Id😉
`);
    }
});

// Fungsi cek waktu otomatis setiap menit
setInterval(() => {
  const datek = new Date((new Date()).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const hours = datek.getHours().toString().padStart(2, '0');
  const minutes = datek.getMinutes().toString().padStart(2, '0');
  const timeNow = `${hours}:${minutes}`;

  for (let [kota, jadwalKota] of Object.entries(jadwal)) {
    for (let [sholat, waktu] of Object.entries(jadwalKota)) {
      if (timeNow === waktu) {
        const caption = `🕌 *Waktu ${sholat} telah tiba!*\nSegera laksanakan sholat ya 😇\n\n⏰ *${waktu}*\n📍 Wilayah: *${kota}*`;

        subscribers.forEach(chatId => {
          // Kirim pesan teks
          bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });

          // Kirim audio dari URL (pakai filename agar dianggap audio)
          bot.sendAudio(chatId, {
            url: adzanUrl,
            filename: "adzan.mp3"  // Memaksa Telegram menganggap ini audio
          }, {
            title: "Adzan",
            caption: "Waktu sholat telah tiba!"
          });
        });
      }
    }
  }
}, 60000); // Cek setiap 1 menit

let activeBuy = {};

//fungsi panel
const jam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z') 
const penghitung = moment().tz("Asia/Jakarta").format("dddd, D MMMM - YYYY")

// ✅ Load pengaturan saat bot start
let globalAutoAIStatus = false;
if (fs.existsSync(autoaiFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(autoaiFile, 'utf8'));
    globalAutoAIStatus = data.autoAIStatus || false;
  } catch (err) {
    console.error("Error membaca settings.json:", err);
  }
}

// ✅ Fungsi simpan status
function saveSettings() {
  const data = { autoAIStatus: globalAutoAIStatus };
  fs.writeFileSync(autoaiFile, JSON.stringify(data, null, 2));
}

// URL gambar (masih terpisah tetapi menggunakan URL yang sama)
const startImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const panelImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const ownerImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const fiturImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const cekIdImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const qrisImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg';
const groupUrl = 'https://t.me/Ranz7rtx'; // URL grup Telegram
const chanelUrl = 'https://t.me/Ranz7rtx'; // Url chanel Telegram
const panelUrl = 'https://files.catbox.moe/1mrgbt.jpg'; // Set Url Data Panel
const webUrl = 'https://https://ranz-shop-pro.vercel.app';
const allpayUrl = 'https://ranz-shop-pro.vercel.app/';
const restapikuUrl = 'https://restapi.rafatharcode.apibotwa.biz.id';

// Fungsi Runtime Bot
const runtime = function(seconds = process.uptime()) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function getRuntime(startTime) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours} 𝙅𝙖𝙢 ${minutes} 𝙈𝙚𝙣𝙞𝙩 ${seconds} 𝘿𝙚𝙩𝙞𝙠`;
}

// ✅ Data Informasi
const nama = 'AUTO ORDER V4';
const author = 'RANZNEWERAA';
const donasiData = {
    pesan: `HALO 😉.\n OWNER${author}`
};

// ✅ Event ketika bot sudah siap
bot.on('polling_error', console.log); // handle error polling

// Informasi waktu mulai bot

const startTime = Date.now();

// Fungsi Simpan Array

const users = new Set(); 
const adminId = settings.owner;
bot.on('message', (msg) => {
  if (msg.chat.type === 'private') {
    users.add(msg.chat.id);
  }
});

// Fungsi untuk menampilkan menu start
const sendStartMenu = (chatId, messageId, username) => {
    const caption = 
`\`\`\`
Hai ${username} 👋  
〤 Selamat datang di layanan Auto Order ${versi} via Telegram.  
〤 Pesan, bayar, dan terima layananmu secara otomatis tanpa ribet.  
〤 Bot ini dibuat oleh @Ranzneweraa.  

✨ Nikmati kemudahan bertransaksi bersama kami. Terima kasih!

┏━━ INFO MENU ━⊜
∘ 🤖 Nama Bot: ${nama}
∘ 👤 Author Bot: ${author}
∘ ⏲️ Runtime Bot: ${getRuntime(startTime)}
∘ 🗣️ Limit Akun: /chatlimit
∘ 🛍️ List Jualan Kami: /listjualan
┗━━━━━━━━━━━━━━

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📂 Database Menu', callback_data: 'database_menu' },
                    { text: '👑 Owner Menu', callback_data: 'owner_menu' }
                ],
                [
                    { text: '📜 Fitur Menu', callback_data: 'fitur_menu' },
                    { text: 'ℹ️ Info Menu', callback_data: 'info_menu' }
                ],
                [
                    { text: '🔜 Lanjut', callback_data: 'startt_menu' }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendStarttMenu = (chatId, messageId, username) => {
    const caption = 
`\`\`\`
Hai ${username} 👋  
〤 Selamat datang di layanan Auto Order ${versi} via Telegram.  
〤 Pesan, bayar, dan terima layananmu secara otomatis tanpa ribet.  
〤 Bot ini dibuat oleh @Ranzneweraa.  

✨ Nikmati kemudahan bertransaksi bersama kami. Terima kasih!

┏━━ INFO MENU ━⊜
∘ 🤖 Nama Bot: ${nama}
∘ 👤 Author Bot: ${author}
∘ ⏲️ Runtime Bot: ${getRuntime(startTime)}
∘ 🗣️ Limit Akun: /chatlimit
∘ 🛍️ List Jualan Kami: /listjualan
┗━━━━━━━━━━━━━━

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📦 Pay Menu', callback_data: 'pay_menu' },
                    { text: '🛒 Buy Menu', callback_data: 'buy_menu' }
                ],
                [
                    { text: '⚙️ Install Menu', callback_data: 'install_menu' },
                    { text: '💰 Deposit Menu', callback_data: 'deposit_menu' }
                ],
                [
                    { text: '🔙 Kembali', callback_data: 'start_menu' },
                    { text: '🔜 Lanjut', callback_data: 'starttt_menu' }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown' // Aktifkan Markdown untuk blok kode
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendStartttMenu = (chatId, messageId, username) => {
    const caption = 
`\`\`\`
Hai ${username} 👋  
〤 Selamat datang di layanan Auto Order ${versi} via Telegram.  
〤 Pesan, bayar, dan terima layananmu secara otomatis tanpa ribet.  
〤 Bot ini dibuat oleh @Ranzneweraa.  

✨ Nikmati kemudahan bertransaksi bersama kami. Terima kasih!

┏━━ INFO MENU ━⊜
∘ 🤖 Nama Bot: ${nama}
∘ 👤 Author Bot: ${author}
∘ ⏲️ Runtime Bot: ${getRuntime(startTime)}
∘ 🗣️ Limit Akun: /chatlimit
∘ 🛍️ List Jualan Kami: /listjualan
┗━━━━━━━━━━━━━━

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🌐 Domain Menu', callback_data: 'domain_menu' },
                    { text: '📋 Panel Menu', callback_data: 'panell_menu' }
                ],
                [
                    { text: '💻 Vps Menu', callback_data: 'vps_menu' },
                    { text: '👥 Group Menu', callback_data: 'group_menu' }
                ],
                [
                    { text: '🔙 Kembali', callback_data: 'startt_menu' },
                    { text: '🔜 Lanjut', callback_data: 'startttt_menu' }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendStarttttMenu = (chatId, messageId, username) => {
    const caption = 
`\`\`\`
Hai ${username} 👋  
〤 Selamat datang di layanan Auto Order ${versi} via Telegram.  
〤 Pesan, bayar, dan terima layananmu secara otomatis tanpa ribet.  
〤 Bot ini dibuat oleh @Ranzneweraa.  

✨ Nikmati kemudahan bertransaksi bersama kami. Terima kasih!

┏━━ INFO MENU ━⊜
∘ 🤖 Nama Bot: ${nama}
∘ 👤 Author Bot: ${author}
∘ ⏲️ Runtime Bot: ${getRuntime(startTime)}
∘ 🗣️ Limit Akun: /chatlimit
∘ 🛍️ List Jualan Kami: /listjualan
┗━━━━━━━━━━━━━━

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🛍️ Store Menu', callback_data: 'store_menu' },
                    { text: '↪️ AutoReply Menu', callback_data: 'autoreply_menu' }
                ],
                [
                    { text: '🔥 Apikey Menu', callback_data: 'apikeyku_menu' },
                ],
                [
                    { text: '🔙 Kembali', callback_data: 'starttt_menu' },
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendPayMenu = (chatId, messageId, username) => {
    const caption =
`📌 \`Payment Menu\`
\`\`\`
Haii ${username},
〤 Ini Adalah Metode Pembayaran Ranzneweraa.

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '💳 Dana', callback_data: 'dana_pay' },
                    { text: '📱 Ovo', callback_data: 'ovo_pay' }
                ],
                [
                    { text: '💰 Gopay', callback_data: 'gopay_pay' },
                    { text: '🏦 BNI', callback_data: 'bni_pay' },
                    { text: '🔗 Qris', callback_data: 'qris_pay' }
                ],
                [
                    { text: '🔙 Kembali', callback_data: 'startt_menu' }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        {
            chat_id: chatId,
            message_id: messageId,
            ...options
        }
    );
};
// Payment 
const sendDanaPay = (chatId, messageId, username) => {
    const caption = 
`\`\`\`
Hi @${username}
Metode: Dana
Nomor: ${Dana}
A/n: alpin store
wanib bawa bukti tf

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔙 Kembali', callback_data: 'pay_menu' }]]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendOvoPay = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Metode: OVO
Nomor: ${Ovo}
A/n: alpin store

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔙 Kembali', callback_data: 'pay_menu' }]]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendGopayPay = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Metode: Gopay
Nomor: ${Gopay}
A/n: alpin store

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔙 Kembali', callback_data: 'pay_menu' }]]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendBniPay = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Metode: BNI Mobile Banking
No Rekening: ${Bni}
A/n: alpin store

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔙 Kembali', callback_data: 'pay_menu' }]]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendQrisPay = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Silakan scan QRIS di atas untuk menyelesaikan pembayaran.

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: '🔙 Kembali', callback_data: 'pay_menu' }]]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: qrisImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
//Contact Owner
const sendInfoMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Haii ${username},
Ini adalah informasi contact Ranzneweraa.

Silakan pilih menu di bawah ini 😉:
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📢 Join Group', url: groupUrl },
                    { text: '📣 Join Channel', url: chanelUrl }
                ],
                [
                    { text: '🌐 Website', url: webUrl },
                    { text: '💳 AllPay', url: allpayUrl },
                    { text: '🔗 RestApi', url: restapikuUrl }
                ],
                [
                    { text: '🔙 Kembali', callback_data: 'start_menu' }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: startImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        {
            chat_id: chatId,
            message_id: messageId,
            ...options
        }
    );
};

const sendBuyMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Buy Otomatis Menu:

Claim Garansi:
/claimgaransi 
/garansi

Buy Panel Private:
/buypanel1 Via Orkut
/buypanel2 Via Atlantik ( Recommended )
/buyadminpanel1 Via Orkut
/buyadminpanel2 Via Atlantik ( Recommended )
/buyownerpanel1 Via Orkut
/buyownerpanel2 Via Atlantik ( Recommended )
/buysellerpanel1  Via Orkut
/buysellerpanel2  Via Atlantik ( Recommended )
/buyptpanel1 Via Orkut 
/buyptpanel2 Via Atlantik ( Recommended )
/withdraw
/checksaldo
/buysaldo
/buynokos

Buy Sewa Bot:
/sewabot
/buyuserbot

Buy Script:
/buysellersc1 Via Orkut 
/buysellersc2 Via Atlantik ( Recommended )
/buysc

Buy VPS:
/buyvps

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendInstallMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah installpanel Menu:

/installpanel1    versi 20.04
/installpanel2    versi 22.04 / 24.04
/installwings
/createnode

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
const sendDepositMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Deposit Menu:

Claim Garansi:
/claimgaransi 
/garansi

Deposit Tanpa Gateway:
/addsaldo <idtele>,<nominal>
/delsaldo <idtele>,<nominal>
/resetsaldo <idtele>
/listsaldo
/ceksaldo <idtele>

Beli Script:
/topupsaldo <nominal>
/listbelisc
/belisc
/listbuysc
/buysc

Beli Panel:
/belipanel <ram>,<usr>,<idtelemu>

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendPanellMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Panell Menu:

Admin Control:
/cadmin <name>,<idtele> ( 2 Server )
/deladmin1 <idadmin>
/deladmin2 <idadmin>
/listadmin ( 2 server )
/listusr ( 2 server )
/listsrv ( 2 server )
/delsrv1 <idsrv>
/delsrv2 <idsrv>
/delusr1 <idusr>
/delusr2 <idusr>
/clearall1
/clearall2

Ram List Panell:
/1gb - /10gb <name>,<idtele> ( 2 Server )
/unli <name>,<idtele> ( 2 Server )

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'starttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
const sendVpsMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah VPS Menu:

/saldodigitalocean
/sisadroplet
/listdroplet
/deldroplet
/cvpsnew <username>,<password>
/cekdroplet <iddroplet>
/rebuild <iddroplet>
/turnon <iddroplet>
/turnoff <iddroplet>
/getip

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'starttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendAutoReplyMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini AutoReply Menu:

/addautoreply <keyword> | <balasan>
/delautoreply <keyword>
/resetautoreply
/listautoreply

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendApikeyku = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini Apikey Menu:

/buyapikey <namaapikey>|<durasi>
/addapikey <namaapikey>|<durasi>
/delapikey <namaapikey>
/listapikey
/cekapikey

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendGroupMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Group Menu:

Fitur Jasher Group:
/saveidgc <idgcmu>
/delidgc <idgcmu>
/listidgc
/clearidgc
/jpmgc

Fitur Jasher Channel:
/saveidch <idchmu>
/delidch <idchmu>
/listidch
/clearidch
/jpmch

#Note: Bot Harus Admin Group/Channel.

Fitur Broadcast:
/saveidbc <idtele>
/delidbc <idtele>
/listidbc
/clearidbc
/bcgikes1
/bcgikes2

Fitur Akses Bot
/addgc
/delgc
/listgc

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '➕ Add Group', url: 'https://t.me/?startgroup=true' },
                    { text: '➕ Add Channel', url: 'https://t.me/?startchannel=true' }
                ],
                [{ text: '🔙 Kembali', callback_data: 'starttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendDomainMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Domain Menu:

Domain 1: panelku-ptero.my.id
/domain1 <host>|<ipvps>

Domain 2: sainsproject.biz.id
/domain2 <host>|<ipvps>

Domain 3: barmodsdomain.my.id
/domain3 <host>|<ipvps>

Domain 4: publicserver.my.id
/domain4 <host>|<ipvps>

Domain 5: rikionline.shop
/domain5 <host>|<ipvps>

Domain 6: storeid.my.id
/domain6 <host>|<ipvps>

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'starttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
const sendStoreMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Store Menu:

/addjualan <namajualan hargajualan>
/deljualan <namajualan>
/listjualan <tampilkan list jualan anda>
/buysaldo <nominal> atlantik
/deposit <nominal> orderkuota 
/topup <nomor> <nominal> ewallet via atlantik

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'startttt_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
// Fungsi untuk menampilkan Owner Menu
const sendOwnerMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Owner Menu:

Premium:
/addprem <idtelemu>
/delprem <idtelemu>
/listprem

Akses:
/addakses <idtelemu>
/delakses <idtelemu>
/listakses


Script:
/addsc <reply pesan file.zip>
/delsc <namafile.zip>
/getsc <namafile.zip>
/listsc

Chat & Konfirmasi:
/chat <teksmu>,<idtelemu>
/konfirmasi <idtele>,<nominal>

Beli Script Manual:
/addbelisc <file.zip>,<harga>
/delbelisc <file.zip>
/getbelisc <file.zip>
/belisc

Buy Script Otomatis:
/addbuysc Reply <file.zip> <harga>
/delbuysc <file.zip>
/listbuysc
/buysc

Control:
/welcome <on/off>
/antilink <on/off>
/antitag <on/off>
/antispam <on/off>
/setspamlimit <jumlah>
/setdelayspam <waktudelay>
/restart
/ubahcode
/buathtml1 zip
/buathtml2 teks 
/buatfitur
/sendtesti
/enchard
/banuser
/unbanuser
/block
/unblock 
/listblock
/deploy
/struk
/unpin
/kick
/pin
/del

Cek Informasi:
/doxdomain <url>
/doxhost <reply domain>
/doxktp <nikktp>
/nikktp <nikktp>
/doxip <ipmu>
/spekvps

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'start_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendDatabaseMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Database Menu:

masih tahap pengembangan! 

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'start_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: ownerImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendFiturMenu = (chatId, messageId, username) => {
    const caption =
`\`\`\`
Hi @${username}
Ini adalah Fitur Menu:

/idch
/cekid
/cekpacar
/cekkendaraan
/cekkhodam
/infocuaca <daerah>
/playmusik <namalagu>
/tiktok <url>
/tourl <linknya>
/play <namalagu>
/brat <teks>
/sifat <nama>, <tgl>, <bln>, <thn>
/zodiak <tgl> <bln> <thn>
/artinama <nama>
/autoai
/aigpt <masukan teks>
/ai <masukan teks>
/bypass
/tofigure private owner

Developer: @Ranzneweraa
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Kembali', callback_data: 'start_menu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'photo',
            media: fiturImageUrl,
            caption: caption,
            parse_mode: 'Markdown'
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    const userId = msg.from.id.toString();
    const waktu = moment().tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const allowedGroups = getAllowedGroups();
    
    // ✅ Validasi: hanya private chat ATAU grup yang diizinkan
    if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
        return bot.sendMessage(chatId, "❌ Fitur ini hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
    }

    // Baca data user utama
    let data = readBCData();
    if (!data.includes(userId)) {
        data.push(userId);
        writeBCData(data);

        const totalID = data.length;

        // Kirim ke channel jika ID baru
        bot.sendMessage(-1003042146542,
            `✅ ID Baru Tersimpan\n━━━━━━━━━━━━━━\n👤 Username: ${username}\n🆔 ID: ${userId}\n🕒 Waktu: ${waktu}\n📊 Total ID: ${totalID}`
        );
    }

    const totalIDRuntime = data.length;

    const caption = 
`\`\`\`
Hai ${username} 👋  
〤 Selamat datang di layanan Auto Order ${versi} via Telegram.  
〤 Pesan, bayar, dan terima layananmu secara otomatis tanpa ribet.  
〤 Bot ini dibuat oleh @Ranzneweraa.  

✨ Nikmati kemudahan bertransaksi bersama kami. Terima kasih!

┏━━ INFO MENU ━⊜
∘ 🤖 Nama Bot: ${nama}
∘ 👤 Author Bot: ${author}
∘ ⏲️ Runtime Bot: ${getRuntime(startTime)}
∘ 📊 Total Pengguna: ${totalIDRuntime} Pengguna
∘ 🗣️ Limit Akun: /chatlimit
∘ 🛍️ List Jualan Kami: /listjualan
┗━━━━━━━━━━━━━━

〤 Silakan pilih menu di bawah ini 😉:
\`\`\``;

    bot.sendPhoto(chatId, startImageUrl, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📂 Database Menu', callback_data: 'database_menu' },
                    { text: '👑 Owner Menu', callback_data: 'owner_menu' }
                ],
                [
                    { text: '📜 Fitur Menu', callback_data: 'fitur_menu' },
                    { text: 'ℹ️ Info Menu', callback_data: 'info_menu' }
                ],
                [
                    { text: '🔜 Lanjut', callback_data: 'startt_menu' }
                ]
            ]
        }
    });
});

bot.onText(/\/tourl/, async (msg) => {
    const chatId = msg.chat.id;
    const isPrivateChat = msg.chat.type === 'private';

    const reply = msg.reply_to_message;

    if (!reply || (!reply.photo && !reply.document && !reply.video && !reply.audio)) {
        const errorText = isPrivateChat
            ? 'Harap balas pesan dengan *media (photo, document, video, atau audio)* untuk mengubahnya menjadi URL.'
            : 'Perintah ini hanya berfungsi jika Anda membalas pesan dengan media.';
        return bot.sendMessage(chatId, errorText, { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
    }

    try {
        let fileId, fileName;

        if (reply.photo) {
            fileId = reply.photo[reply.photo.length - 1].file_id;
            fileName = 'photo.jpg';
        } else if (reply.document) {
            fileId = reply.document.file_id;
            fileName = reply.document.file_name || 'document';
        } else if (reply.video) {
            fileId = reply.video.file_id;
            fileName = reply.video.file_name || 'video.mp4';
        } else if (reply.audio) {
            fileId = reply.audio.file_id;
            fileName = reply.audio.file_name || 'audio.mp3';
        }

        const filePath = await bot.downloadFile(fileId, './temp');
        const fileBuffer = fs.readFileSync(filePath);

        // Upload ke Catbox.moe
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fileBuffer, fileName);

        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(filePath); // hapus file lokal setelah upload

        const responseText = `✅ Berikut adalah URL file Anda:\n${response.data}`;
        bot.sendMessage(chatId, responseText, { reply_to_message_id: msg.message_id });

    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`, { reply_to_message_id: msg.message_id });
    }
});

// Command backup script: /backup
bot.onText(/\/backup/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const owner = settings.owner.toString(); // pastikan string

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Fitur ini hanya bisa digunakan oleh Owner.");
    }

    try {
        await bot.sendMessage(chatId, "🗂 Mengumpulkan semua file ke dalam folder...");

        // File yang dibackup (kecuali folder/file tertentu)
        const ls = execSync("ls")
            .toString()
            .split("\n")
            .filter((file) =>
                file &&
                file !== "node_modules" &&
                file !== "session" &&
                file !== "package-lock.json" &&
                file !== "yarn.lock"
            );

        // Buat arsip zip
        execSync(`zip -r ranzprib.zip${ls.join(" ")}`);

        await bot.sendMessage(chatId, "📦 Script berhasil dibackup, sedang mengirim ke Pesan Tersimpan...");

        // Kirim ke Pesan Tersimpan (chat private owner)
        await bot.sendDocument(owner, "./ranzprib.zip", {
            caption: "📁 Backup Script ranzprib.zip",
        }).catch(async (err) => {
            console.error("Error kirim ke owner:", err);
            await bot.sendMessage(chatId, "⚠️ Gagal mengirim ke Pesan Tersimpan. Pastikan kamu sudah pernah chat dengan bot ini.");
        });

        // Konfirmasi
        await bot.sendMessage(chatId, "✅ Backup sudah terkirim ke Pesan Tersimpan Telegram kamu.");

        // Hapus file zip
        execSync("rm -rf ranzprib.zip");
    } catch (error) {
        console.error("❌ Error saat membuat backup:", error);
        await bot.sendMessage(chatId, "⚠️ Gagal membuat backup. Silakan cek kembali.");
    }
});

// Handle perintah /cekid
bot.onText(/\/cekid/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name || 'Tidak Ada';
    const idTele = msg.from.id;
    const cekIdImageUrl = 'https://files.catbox.moe/k2fxyq.jpeg'; // Ganti dengan URL banner

    const caption = `👋 Hi *${username}*\n\n` +
        `📌 *ID Telegram Anda:* \`${idTele}\`\n` +
        `📌 *Username:* @${username}\n\n` +
        `Itu adalah ID Telegram Anda 😉\n` +
        `Developer: @Ranzneweraa`;

    const options = {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📋 Salin ID', url: `tg://msg?text=${idTele}` }
                ],
                [
                    { text: '📤 Bagikan ID', switch_inline_query: idTele }
                ],
                [
                    { text: '👤 Lihat Profil', url: `https://t.me/${username}` }
                ]
            ]
        }
    };

    bot.sendPhoto(chatId, cekIdImageUrl, options);
});

bot.onText(/^(\.|\#|\/)idch$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format link salah. Contoh: /idch https://t.me/namachannel`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/idch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1];

    // Ambil username dari link, misalnya: https://t.me/channelUsername
    const regex = /t\.me\/([a-zA-Z0-9_]+)/;
    const matchUsername = input.match(regex);

    if (!matchUsername) {
        return bot.sendMessage(chatId, 'Format link salah. Contoh: /idch https://t.me/namachannel');
    }

    const channelUsername = matchUsername[1];

    try {
        const chat = await bot.getChat(`@${channelUsername}`);
        const channelId = chat.id;

        bot.sendMessage(chatId, `✅ ID Channel @${channelUsername} adalah: \`${channelId}\``, {
            parse_mode: 'Markdown'
        });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal mengambil ID channel. Pastikan bot Anda sudah menjadi **admin atau member** di channel tersebut.`);
    }
});

// Handle perintah /cekpacar
bot.onText(/\/cekpacar/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    // Daftar nama pacar yang dipilih secara acak
    const pacarList = [
        "Siti", "Senti", "Sifa", "Aprel", "Ika", "Cahya", "Mifta", 
        "Asraf", "Suep", "Jamal", "Akmal", "Supri", "Josep", 
        "Agus", "Akbar", "Dian", "Gak ada ☠️"
    ];

    // Pilih nama pacar secara acak
    const pacar = pacarList[Math.floor(Math.random() * pacarList.length)];

    // Kirim pesan ke pengguna
    bot.sendMessage(chatId, `@${username}, pacarmu adalah *${pacar}* ❤️`, { parse_mode: "Markdown" });
});

/// Handle perintah /cekkhodam dengan regex agar lebih fleksibel
bot.onText(/\/cekkhodam\s*/i, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    // Daftar Khodam yang dipilih secara acak
    const khodamList = [
        "Tumis Kangkung", "Topi Melorot", "Nyu Blorong", "Rayap Gendut", 
        "LC Karaoke", "Cicak Kawin", "Sundel Bolong", "Tuyul Kesandung", 
        "Genderuwo TikTok", "Pocong Bersepeda", "Tuyul Main PS5", "Kompor Meledak"
    ];

    // Pilih khodam secara acak
    const khodam = khodamList[Math.floor(Math.random() * khodamList.length)];

    // Kirim pesan ke pengguna
    bot.sendMessage(chatId, `@${username}, Khodam mu adalah *${khodam}* 🔥`, { parse_mode: "Markdown" });
});

// Daftar URL gambar kendaraan (ganti dengan URL kendaraan sesuai kebutuhan)
const kendaraanImages = [
    "https://files.catbox.moe/1mrgbt.jpg",
    "https://img12.pixhost.to/images/1064/578151478_uploaded_image.jpg",
    "https://img12.pixhost.to/images/1064/578151497_uploaded_image.jpg",
    "https://img12.pixhost.to/images/1064/578151503_uploaded_image.jpg",
    "https://img12.pixhost.to/images/1064/578151606_uploaded_image.jpg"
];

// Handle perintah /cekkendaraan
bot.onText(/\/cekkendaraan\s*/i, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    // Pilih gambar kendaraan secara acak
    const randomImage = kendaraanImages[Math.floor(Math.random() * kendaraanImages.length)];

    // Kirim gambar dengan caption
    bot.sendPhoto(chatId, randomImage, {
        caption: `@${username}, Itulah kendaraanmu sekarang 🚗`,
        parse_mode: "Markdown"
    });
});

bot.onText(/^(\.|\#|\/)topupsaldo$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/topupsaldo <nominal>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// Command untuk user melakukan topup
// ✅ Perintah untuk memulai topup saldo
bot.onText(/^\/topupsaldo\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;
  const nominal = parseInt(match[1]);

  if (isNaN(nominal) || nominal < 500) {
    return bot.sendMessage(chatId, '❌ Nominal tidak valid. Minimal Rp500.\nContoh: /topupsaldo 10000');
  }

  // Simpan request sementara
  userPendingTopup[userId] = nominal;

  // Notifikasi ke developer
  for (let dev of owner) {
    bot.sendMessage(dev, `📥 Permintaan Topup Baru\n\n🆔 ID Pengguna: ${userId}\n💰 Nominal: Rp${toRupiah(nominal)}\n\nMenunggu user memilih metode pembayaran.`);
  }

  // Kirim pilihan metode pakai inline button
  bot.sendMessage(chatId,
    `🔰 *TOPUP SALDO*\n\n💳 Nominal: Rp${toRupiah(nominal)}\n\nPilih metode pembayaran:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 Dana", callback_data: `pay_dana_${userId}` }],
          [{ text: "💳 QRIS Manual", callback_data: `pay_qris_${userId}` }],
          [{ text: "⚡ QRIS (Otomatis)", callback_data: `pay_atlantic_${userId}` }]
        ]
      }
    }
  );
});

// ✅ Handler tombol pembayaran
bot.on('callback_query', async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const username = query.from.username || query.from.first_name;

  // Pastikan ada pending topup
  const nominal = userPendingTopup[userId];
  if (!nominal) {
    return bot.answerCallbackQuery(query.id, { text: "Tidak ada topup aktif!", show_alert: false });
  }

  if (data.startsWith("pay_dana")) {
    await bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId,
      `🔁 *Pembayaran via DANA*\n\nSilakan transfer Rp${toRupiah(nominal)} ke:\n\n📱 Nomor DANA: 082262817069\nA/n: alpin store\n\nLalu kirim bukti ke developer:\nt.me/Ranzneweraa`,
      { parse_mode: 'Markdown' }
    );

  } else if (data.startsWith("pay_qris")) {
    await bot.answerCallbackQuery(query.id);
    bot.sendPhoto(chatId, qrisImageUrl, {
      caption: `🔁 *Pembayaran via QRIS Manual*\n\nSilakan transfer Rp${toRupiah(nominal)} ke QRIS di atas.\n\nLalu kirim bukti ke developer:\nt.me/Ranzneweraa`,
      parse_mode: 'Markdown'
    });

  } else if (data.startsWith("pay_atlantic")) {
    await bot.answerCallbackQuery(query.id);
    if (activeDeposit[userId]) {
      return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik .batalbeli untuk membatalkan.");
    }

    const jumlah = nominal;
    const total = jumlah + settings.FeeTransaksi;
    const reff = `DEPO-${Math.floor(Math.random() * 1000000)}`;

    try {
      const depositData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const dataRes = res.data;
      if (!dataRes.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${dataRes.message || "Silakan coba lagi."}`);
      }

      const info = dataRes.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teks = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃💸 *DEPOSIT QRIS ATLANTIC* 💸
┗━━━━━━━━━━━━━━━━━━━━┛
🆔 Kode Transaksi: ${reff}
🙎 User: @${username} (${userId})
💰 Jumlah Deposit: Rp${toRupiah(jumlah)}
🧾 Biaya Admin: Rp${toRupiah(settings.FeeTransaksi)}
💳 Total Bayar: Rp${toRupiah(info.nominal)}

⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk pembayaran

━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Catatan Penting:*
• Jangan tutup Telegram selama proses berlangsung
• Saldo akan otomatis masuk setelah pembayaran
`.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "❌ Batalkan Deposit", callback_data: "batalbuy" }]]
        }
      });

      // Simpan status transaksi
      activeDeposit[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        idDeposit: info.reff_id,
        id: info.id,
        amount: jumlah,
        status: true,
        timeout: setTimeout(async () => {
          if (activeDeposit[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS Deposit telah expired.");
            await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
            delete activeDeposit[userId];
          }
        }, 300000)
      };

      // Loop pengecekan status
      while (activeDeposit[userId] && activeDeposit[userId].status) {
        await sleep(5000);
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeDeposit[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activeDeposit[userId].status = false;
          clearTimeout(activeDeposit[userId].timeout);

          await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
            api_key: settings.ApikeyAtlantic,
            id: activeDeposit[userId].id,
            action: true
          }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });

          const saldoPath = './atlantik/saldo.json';
          let saldo = fs.existsSync(saldoPath) ? JSON.parse(fs.readFileSync(saldoPath)) : {};
          saldo[userId] = (saldo[userId] || 0) + jumlah;
          fs.writeFileSync(saldoPath, JSON.stringify(saldo, null, 2));

          const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

          await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
          await bot.sendMessage(chatId, `
✅ Deposit Berhasil!
━━━━━━━━━━━━━━━━━━━━━━━
🧾 Jumlah: Rp${toRupiah(jumlah)}
💳 Saldo Sekarang: Rp${toRupiah(saldo[userId])}
⏰ Tanggal: ${waktu}
━━━━━━━━━━━━━━━━━━━━━━━
#Lalu kirim bukti ke developer:\nt.me/Ranzneweraa
`.trim(), { parse_mode: "Markdown" });

          const notif = `
📢 DEPOSIT SUKSES!
━━━━━━━━━━━━━━━━━━━━━━━
🆔 Kode Transaksi: ${reff}
🙎 User: @${username} (${userId})
💰 Jumlah Deposit: Rp${toRupiah(jumlah)}
💼 Saldo: Rp${toRupiah(saldo[userId])}
📆 Tanggal: ${waktu}
`.trim();

          await bot.sendMessage(owner, notif, { parse_mode: "Markdown" });
          await bot.sendMessage('-1002942557374', notif, { parse_mode: "Markdown" }).catch(() => { });

          delete activeDeposit[userId];
        }
      }

    } catch (err) {
      console.error("DEPOSIT ERROR:", err.response?.data || err.message);
      return bot.sendMessage(chatId, "❌ Gagal memproses deposit. Silakan coba lagi.");
    }
  }
});

bot.onText(/^(\.|\#|\/)konfirmasi$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/konfirmasi idtele,20000`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/konfirmasi\s+(\d+),(\d+)/, async (msg, match) => {
  const userId = msg.from.id;
  const targetID = match[1];
  const nominal = parseInt(match[2]);

  if (!owner.includes(userId)) {
    return bot.sendMessage(msg.chat.id, '❌ Akses ditolak. Hanya developer yang dapat melakukan konfirmasi.');
  }

  if (isNaN(nominal) || nominal <= 0) {
    return bot.sendMessage(msg.chat.id, '❌ Nominal tidak valid.');
  }

  // Tambahkan saldo
  addSaldo(targetID, nominal, db_saldo);

  // Notifikasi ke user
  bot.sendMessage(targetID, `✅ Saldo kamu telah ditambahkan sebesar Rp${toRupiah(nominal)}.\nCeksaldo anda:\n/ceksaldo <idtelemu>`);

  // Notifikasi ke developer
  bot.sendMessage(msg.chat.id, `✅ Saldo sebesar Rp${toRupiah(nominal)} berhasil ditambahkan ke ID ${targetID}.`);
});

bot.onText(/^(\.|\#|\/)addsaldo$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/addsaldo idtele,20000`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)addsaldo\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message;
  const q = match[2];

  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  // Validasi format input
  const [idtelegram, nominal] = q.split(",");
  if (!idtelegram || !nominal) {
    return bot.sendMessage(chatId, `⚠️ Format Salah!\n\n🔹 Contoh Penggunaan:\n/addsaldo idtele,20000`);
  }

  const amount = Number(nominal);
  if (isNaN(amount) || amount <= 0) {
    return bot.sendMessage(chatId, `❌ Nominal tidak valid. Harus berupa angka lebih dari 0.`);
  }

  // ID target langsung dari idtelegram, tanpa @s.whatsapp.net
  const targetID = idtelegram.trim();

  // Fungsi addSaldo menerima idtelegram langsung
  addSaldo(targetID, amount, db_saldo);

  // Kirim pesan konfirmasi ke admin
  bot.sendMessage(chatId, `✅ Deposit Berhasil!\n\n🆔 ID Telegram: ${targetID}\n💰 Jumlah: Rp${toRupiah(amount)}\n\n📝 Cek saldo dengan perintah: /ceksaldo ${targetID}`);

  // (Opsional) Kirim ke user jika punya sistem notifikasi internal
  // bot.sendMessage(targetID, `✅ Saldo kamu bertambah Rp${toRupiah(amount)}!`);

});

bot.onText(/^(\.|\#|\/)delsaldo$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delsaldo idtele,20000`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)delsaldo\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message;
  const q = match[2];
  const [idtelegram, nominal] = q.split(",");

  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  if (!idtelegram || !nominal) {
    return bot.sendMessage(chatId, `⚠️ Format Salah!\n\n🔹 Contoh:\n/delsaldo idtelegram,10000`);
  }

  const amount = Number(nominal);
  if (isNaN(amount) || amount <= 0) {
    return bot.sendMessage(chatId, `❌ Nominal tidak valid. Harus angka > 0`);
  }

  if (!db_saldo[idtelegram] || db_saldo[idtelegram] < amount) {
    return bot.sendMessage(chatId, `❌ Saldo tidak cukup atau ID tidak ditemukan.`);
  }

  db_saldo[idtelegram] -= amount;

  fs.writeFileSync('./source/saldo.json', JSON.stringify(db_saldo, null, 2));
  bot.sendMessage(chatId, `✅ Berhasil mengurangi saldo ${idtelegram} sebesar Rp${toRupiah(amount)}.\n💰 Sisa saldo: Rp${toRupiah(db_saldo[idtelegram])}`);
});

bot.onText(/^(\.|\#|\/)resetsaldo$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/resetsaldo idtele`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)resetsaldo\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const idtelegram = match[2];

  if (!adminId.includes(fromId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  if (!idtelegram) {
    return bot.sendMessage(chatId, `⚠️ Format Salah!\n\n🔹 Contoh:\n/resetsaldo 123456789`);
  }

  const userExist = db_saldo.find((user) => user.id === idtelegram);
  if (!userExist) {
    return bot.sendMessage(chatId, `❌ ID Telegram ${idtelegram} tidak ditemukan dalam database saldo.`);
  }

  resetSaldo(idtelegram, db_saldo);

  bot.sendMessage(chatId, `✅ Saldo ID ${idtelegram} berhasil direset menjadi Rp0.`);
});

bot.onText(/^(\.|\#|\/)ceksaldo$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/ceksaldo idtelegram`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)ceksaldo\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message;
  const idtelegram = match[2].trim();
  
  
  if (!idtelegram) {
    return bot.sendMessage(chatId, `⚠️ Format Salah!\n\n🔹 Contoh Penggunaan:\n/ceksaldo idtelegram`);
  }

  // Ambil saldo dari database
  let saldo = cekSaldo(idtelegram, db_saldo); // asumsikan fungsi cekSaldo() sudah ada
  saldo = saldo || 0;

  // Kirim saldo ke admin
  bot.sendMessage(chatId, `💳 CEK SALDO\n\n🆔 ID Telegram: ${idtelegram}\n💰 Saldo Saat Ini: Rp${toRupiah(saldo)}`);
});

bot.onText(/^(\.|\#|\/)listsaldo$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  // Baca saldo dari file saldo.json
  let _dir = [];
  try {
    const raw = fs.readFileSync('./source/saldo.json');
    _dir = JSON.parse(raw);
  } catch (e) {
    return bot.sendMessage(chatId, '❌ Gagal membaca data saldo.');
  }

  if (_dir.length === 0) {
    return bot.sendMessage(chatId, '📭 Tidak ada data saldo yang tersimpan.');
  }

  const list = listSaldo(_dir);
  bot.sendMessage(chatId, `📋 *Daftar Saldo User:*\n\n${list}`, { parse_mode: 'Markdown' });
});

bot.onText(/^([./]{0,2})?buynokos\s*(\w+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";
  const negara = match[2] ? match[2].toLowerCase() : null;
  const allowedGroups = getAllowedGroups();

  // ✅ Pastikan private chat atau grup yang diizinkan
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
  }

  const hargaNokos = {
    indonesia: 8000,
    malaysia: 15000,
    philippines: 8000
  };

  // ✅ Cek transaksi aktif
  if (activeDeposit[userId]) {
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik .batalbeli untuk membatalkan.");
  }

  if (!negara) {
    return bot.sendMessage(chatId, `
🌍 Cara Membeli Nokos

Ketik perintah berikut:
.buynokos <negara>

Contoh:
.buynokos indonesia

Daftar Harga:
🇮🇩 Indonesia: Rp8.000
🇲🇾 Malaysia: Rp15.000
🇵🇭 Philippines: Rp8.000
`.trim(), { parse_mode: "Markdown" });
  }

  if (!hargaNokos[negara]) {
    return bot.sendMessage(chatId, "❌ Negara tidak tersedia.\nGunakan salah satu:\n- indonesia\n- malaysia\n- philippines");
  }

  const jumlah = hargaNokos[negara];
  const total = jumlah + settings.FeeTransaksi;
  const reff = `NOKOS-${Math.floor(Math.random() * 1000000)}`;

  try {
    const depositData = qs.stringify({
      api_key: settings.ApikeyAtlantic,
      reff_id: reff,
      nominal: total,
      type: 'ewallet',
      metode: 'qris'
    });

    const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = res.data;
    if (!data.status) {
      return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
    }

    const info = data.data;
    const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

    const teks = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃📱 PEMBELIAN NOKOS
┗━━━━━━━━━━━━━━━━━━━━┛
🆔 Kode Transaksi: ${reff}
🙎 User: @${username} (${userId})
🌍 Negara: ${negara.charAt(0).toUpperCase() + negara.slice(1)}
💰 Harga: Rp${toRupiah(jumlah)}
🧾 Biaya Admin: Rp${toRupiah(settings.FeeTransaksi)}
💳 Total Bayar: Rp${toRupiah(info.nominal)}

⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk pembayaran
━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Catatan:
• Jangan tutup Telegram selama proses
• Nokos otomatis diproses setelah pembayaran
`.trim();

    const sentMsg = await bot.sendPhoto(chatId, qrImage, {
      caption: teks,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "❌ Batalkan Pembelian", callback_data: "batalbuy" }]]
      }
    });

    activeDeposit[userId] = {
      msgId: sentMsg.message_id,
      chatId,
      idDeposit: info.reff_id,
      id: info.id,
      negara,
      amount: jumlah,
      status: true,
      timeout: setTimeout(async () => {
        if (activeDeposit[userId]?.status) {
          await bot.sendMessage(chatId, "⏰ QRIS telah *expired*.");
          await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
          delete activeDeposit[userId];
        }
      }, 300000)
    };

    // Loop pengecekan status pembayaran tetap sama
    while (activeDeposit[userId] && activeDeposit[userId].status) {
      await sleep(5000);
      const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
        api_key: settings.ApikeyAtlantic,
        id: activeDeposit[userId].id
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

      const status = check?.data;
      if (status && status.status !== 'pending') {
        activeDeposit[userId].status = false;
        clearTimeout(activeDeposit[userId].timeout);

        // Instant confirm
        await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeDeposit[userId].id,
          action: true
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });

        const trxPath = './atlantik/transaksi.json';
        let riwayat = fs.existsSync(trxPath) ? JSON.parse(fs.readFileSync(trxPath)) : [];
        riwayat.push({
          user: userId,
          barang: `Nokos ${negara}`,
          harga: `Rp${toRupiah(jumlah)}`,
          metode: "QRIS",
          tanggal: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        });
        fs.writeFileSync(trxPath, JSON.stringify(riwayat, null, 2));

        await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
        await bot.sendMessage(chatId, `✅ Pembelian Nokos *${negara}* berhasil!\nSegera hubungi Owner untuk memproses Nokos Anda.`, { parse_mode: "Markdown" });

        if (owner) {
          await bot.sendMessage(owner, `
📢 *Pembayaran Berhasil*
━━━━━━━━━━━━━━━━━━━━━━
🆔 Kode: ${reff}
🙎 User: @${username} (${userId})
🌍 Negara: ${negara}
💳 Total: Rp${toRupiah(info.nominal)}
⏰ Waktu: ${moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")}
          `.trim(), { parse_mode: "Markdown" });
        }

        delete activeDeposit[userId];
      }
    }

  } catch (err) {
    console.error("NOKOS ERROR:", err.response?.data || err.message);
    return bot.sendMessage(chatId, "❌ Gagal memproses pembelian. Silakan coba lagi.");
  }
});

// ✅ Handler tombol batal
bot.on('callback_query', async (query) => {
  const userId = query.from.id.toString();
  const chatId = query.message.chat.id;

  if (query.data === "batalbuy") {
    if (activeDeposit[userId]) {
      clearTimeout(activeDeposit[userId].timeout);
      await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
      delete activeDeposit[userId];
      await bot.answerCallbackQuery(query.id, { text: "✅ Pembelian dibatalkan." });
      await bot.sendMessage(chatId, "❌ Pembelian berhasil dibatalkan.");
    } else {
      await bot.answerCallbackQuery(query.id, { text: "Tidak ada transaksi aktif." });
    }
  }
});

const hargaPerBulan = 25000;
bot.onText(/^([./]{0,2})?buyuserbot$/i, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";

    const allowedGroups = getAllowedGroups();
    if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
        return bot.sendMessage(chatId, "❌ BuyUserBot hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
    }

    if (activeBuyUserBot[userId]) {
        return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif. Gunakan tombol batal untuk membatalkan.");
    }

    activeBuyUserBot[userId] = { bulan: 1, msgId: null, interval: null };

    const updateButton = async () => {
        const teks = `💻 Buy UserBot\n\nPilih lama berlangganan:\n🗓️ ${activeBuyUserBot[userId].bulan} Bulan\n\n💰 Total Bayar: Rp${toRupiah(activeBuyUserBot[userId].bulan * hargaPerBulan)}`;
        const keyboard = [
            [{ text: "➖ Kurangi", callback_data: "minus" }, { text: "➕ Tambah", callback_data: "plus" }],
            [{ text: "💳 Bayar Sekarang", callback_data: "pay" }, { text: "❌ Batal", callback_data: "cancel" }]
        ];

        if (activeBuyUserBot[userId].msgId) {
            await bot.editMessageText(teks, {
                chat_id: chatId,
                message_id: activeBuyUserBot[userId].msgId,
                reply_markup: { inline_keyboard: keyboard }
            });
        } else {
            const sent = await bot.sendMessage(chatId, teks, { reply_markup: { inline_keyboard: keyboard } });
            activeBuyUserBot[userId].msgId = sent.message_id;
        }
    };

    await updateButton();
});

// Handler tombol
bot.on('callback_query', async (query) => {
    const userId = query.from.id.toString();
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!activeBuyUserBot[userId]) return;

    const updateButton = async () => {
        const teks = `💻 Buy UserBot\n\nPilih lama berlangganan:\n🗓️ ${activeBuyUserBot[userId].bulan} Bulan\n\n💰 Total Bayar: Rp${toRupiah(activeBuyUserBot[userId].bulan * hargaPerBulan)}`;
        const keyboard = [
            [{ text: "➖ Kurangi", callback_data: "minus" }, { text: "➕ Tambah", callback_data: "plus" }],
            [{ text: "💳 Bayar Sekarang", callback_data: "pay" }, { text: "❌ Batal", callback_data: "cancel" }]
        ];
        await bot.editMessageText(teks, { chat_id: chatId, message_id: activeBuyUserBot[userId].msgId, reply_markup: { inline_keyboard: keyboard } });
    };

    if (data === "plus") {
        activeBuyUserBot[userId].bulan += 1;
        return bot.answerCallbackQuery(query.id, { text: "✅ Tambah 1 bulan" }).then(updateButton);
    }

    if (data === "minus") {
        if (activeBuyUserBot[userId].bulan > 1) activeBuyUserBot[userId].bulan -= 1;
        return bot.answerCallbackQuery(query.id, { text: "✅ Kurangi 1 bulan" }).then(updateButton);
    }

    if (data === "cancel") {
        clearInterval(activeBuyUserBot[userId].interval);
        await bot.deleteMessage(chatId, activeBuyUserBot[userId].msgId).catch(() => {});
        delete activeBuyUserBot[userId];
        return bot.answerCallbackQuery(query.id, { text: "❌ Transaksi dibatalkan" });
    }

    if (data === "pay") {
        const total = activeBuyUserBot[userId].bulan * hargaPerBulan;
        const reff = `USERBOT-${Math.floor(Math.random() * 1000000)}`;

        try {
            const depositData = qs.stringify({
                api_key: settings.ApikeyAtlantic,
                reff_id: reff,
                nominal: total,
                type: 'ewallet',
                metode: 'qris'
            });

            const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const data = res.data;
            if (!data.status) return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);

            const info = data.data;
            const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

            const teks = `💻 BuyUserBot QRIS\n🆔 Kode: ${reff}\n🙎 User: @${query.from.username}\n🗓️ Lama: ${activeBuyUserBot[userId].bulan} Bulan\n💰 Total: Rp${toRupiah(total)}\n📷 Scan QR untuk bayar`;

            await bot.sendPhoto(chatId, qrImage, {
                caption: teks,
                reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan", callback_data: "cancel" }]] }
            });

            // Simpan info transaksi untuk dicek
            activeBuyUserBot[userId].status = true;
            activeBuyUserBot[userId].idDeposit = info.reff_id;
            activeBuyUserBot[userId].id = info.id;
            activeBuyUserBot[userId].amount = total;

            await bot.sendMessage(owner, `📢 USERBOT PURCHASE\n🆔 Kode: ${reff}\n🙎 User: @${query.from.username}\n🗓️ Lama: ${activeBuyUserBot[userId].bulan} Bulan\n💰 Total: Rp${toRupiah(total)}\nSilakan cek pembayaran dan konfirmasi.`);

            // 🔔 Cek status pembayaran setiap 5 detik
            activeBuyUserBot[userId].interval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`https://atlantich2h.com/deposit/status?api_key=${settings.ApikeyAtlantic}&reff_id=${reff}`);
                    if (statusRes.data.status && statusRes.data.data.status === "success") {
                        clearInterval(activeBuyUserBot[userId].interval);

                        await bot.sendMessage(chatId, `✅ Pembayaran berhasil!\n💻 UserBot aktif selama ${activeBuyUserBot[userId].bulan} bulan.\n🆔 Kode: ${reff}\n💰 Total: Rp${toRupiah(total)}`);

                        delete activeBuyUserBot[userId];

                        await bot.sendMessage(owner, `✅ Pembayaran USERBOT sukses.\n🆔 Kode: ${reff}\n🙎 User: @${query.from.username}\n💰 Total: Rp${toRupiah(total)}`);
                    }
                } catch (err) {
                    console.error("Error cek status pembayaran:", err.message);
                }
            }, 5000);

        } catch (err) {
            console.error(err);
            return bot.sendMessage(chatId, "❌ Gagal membuat QRIS. Silakan coba lagi.");
        }

        return bot.answerCallbackQuery(query.id);
    }
});

bot.onText(/^(\.|\#|\/)addjualan$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\n\nGunakan:\n/addjualan namajualan harga`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)addjualan\s+(.+)\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const replyId = msg.message_id;

  if (!match) {
    return bot.sendMessage(chatId, "❌ Format salah!\n\nGunakan:\n/addjualan namajualan harga", {
      reply_to_message_id: replyId
    });
  }

  const nama = match[2];
  const harga = parseInt(match[3]);

  let data = loadJualan();
  if (data.find(x => x.nama.toLowerCase() === nama.toLowerCase())) {
    return bot.sendMessage(chatId, `❌ Jualan *${nama}* sudah ada!`, {
      reply_to_message_id: replyId,
      parse_mode: "Markdown"
    });
  }

  data.push({ nama, harga });
  saveJualan(data);

  bot.sendMessage(chatId, `✅ Berhasil menambahkan jualan:\n📦 ${nama}\n💰 Rp${harga.toLocaleString()}`, {
    reply_to_message_id: replyId,
    parse_mode: "Markdown"
  });
});

bot.onText(/^(\.|\#|\/)deljualan$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\n\nGunakan:\n/deljualan namajualan`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)deljualan\s+(.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const replyId = msg.message_id;

  if (!match) {
    return bot.sendMessage(chatId, "❌ Format salah!\n\nGunakan:\n/deljualan namajualan", {
      reply_to_message_id: replyId
    });
  }

  const nama = match[2];

  let data = loadJualan();
  const index = data.findIndex(x => x.nama.toLowerCase() === nama.toLowerCase());
  if (index === -1) {
    return bot.sendMessage(chatId, `❌ Jualan *${nama}* tidak ditemukan.`, {
      reply_to_message_id: replyId,
      parse_mode: "Markdown"
    });
  }

  const removed = data.splice(index, 1)[0];
  saveJualan(data);

  bot.sendMessage(chatId, `✅ Jualan *${removed.nama}* berhasil dihapus.`, {
    reply_to_message_id: replyId,
    parse_mode: "Markdown"
  });
});

// === List Jualan ===
bot.onText(/^(\.|\#|\/)listjualan$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const replyId = msg.message_id;
  const allowedGroups = getAllowedGroups();

  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Topup hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb", {
      reply_to_message_id: targetMessageId
    });
  }

  let data = loadJualan();

  if (data.length === 0) {
    return bot.sendMessage(chatId, "📭 Belum ada jualan yang terdaftar.", {
      reply_to_message_id: replyId
    });
  }

  let teks = "📦 *List Jualan*\n━━━━━━━━━━━━━━━\n";
  data.forEach(j => {
    teks += `• ${j.nama} - Rp${j.harga.toLocaleString()}\n`;
  });

  bot.sendMessage(chatId, teks, {
    parse_mode: "Markdown",
    reply_to_message_id: replyId,
    reply_markup: { 
      inline_keyboard: [
        [{ text: "🛒 Beli", callback_data: "pilih_jualan" }]
      ] 
    }
  });
});

// === Handler tombol beli ===
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id.toString();

  // Pilih jualan
  if (query.data === "pilih_jualan") {
    let data = loadJualan();
    if (data.length === 0) {
      return bot.answerCallbackQuery(query.id, { text: "❌ Tidak ada jualan." });
    }

    bot.answerCallbackQuery(query.id);
    let buttons = data.map(j => [{ text: j.nama, callback_data: `choose_${j.nama}` }]);
    bot.sendMessage(chatId, "🛍 Pilih barang yang ingin dibeli:", {
      reply_markup: { inline_keyboard: buttons }
    });
  }

  // Setelah pilih barang
  if (query.data.startsWith("choose_")) {
    const nama = query.data.replace("choose_", "");
    const data = loadJualan().find(x => x.nama.toLowerCase() === nama.toLowerCase());
    if (!data) return bot.answerCallbackQuery(query.id, { text: "❌ Jualan tidak ditemukan." });

    bot.answerCallbackQuery(query.id);

    // Simpan pending pilihan
    pendingBeli[userId] = { chatId, nama: data.nama, harga: data.harga };

    bot.sendMessage(chatId, `📦 Anda memilih *${data.nama}*\n💰 Harga per item: Rp${data.harga.toLocaleString()}\n\n✍️ Silakan ketik jumlah yang ingin dibeli.`, {
      parse_mode: "Markdown"
    });
  }

  // Batalkan pembelian
  if (query.data === "batalbuy") {
    if (!activeBeli[userId]) {
      return bot.answerCallbackQuery(query.id, { text: "❌ Tidak ada transaksi aktif." });
    }

    bot.answerCallbackQuery(query.id, { text: "❌ Pembelian dibatalkan." });
    clearTimeout(activeBeli[userId].timeout);
    await bot.deleteMessage(chatId, activeBeli[userId].msgId).catch(() => { });
    delete activeBeli[userId];
    await bot.sendMessage(chatId, "✅ Transaksi berhasil dibatalkan.");
  }
});

// === Input jumlah beli manual di chat ===
bot.on("message", async (msg) => {
  const userId = msg.from.id.toString();
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";

  if (pendingBeli[userId] && !isNaN(msg.text)) {
    const jumlah = parseInt(msg.text);
    if (jumlah <= 0) {
      return bot.sendMessage(chatId, "❌ Jumlah tidak valid. Masukkan angka lebih dari 0.");
    }

    const { nama, harga } = pendingBeli[userId];
    delete pendingBeli[userId];

    const total = jumlah * harga;
    const reff = `BUY-${Math.floor(Math.random() * 1000000)}`;

    try {
      const payload = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: "ewallet",
        metode: "qris"
      });

      const res = await axios.post("https://atlantich2h.com/deposit/create", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (!res.data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${res.data.message || "Silakan coba lagi."}`);
      }

      const info = res.data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: "png" });

      const teks = `🛒 *Pembelian QRIS Atlantic*\n━━━━━━━━━━━━━━━\n📦 Barang: ${nama}\n📦 Jumlah: ${jumlah}\n💰 Total Bayar: Rp${total.toLocaleString()}\n🆔 Transaksi: ${reff}\n⏰ Batas: 5 menit`;

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Pembelian", callback_data: "batalbuy" }]] }
      });

      // Simpan transaksi aktif
      activeBeli[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        reff,
        nama,
        jumlah,
        harga,
        total,
        status: true,
        timeout: setTimeout(async () => {
          if (activeBeli[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS Pembelian telah *expired*.");
            await bot.deleteMessage(chatId, activeBeli[userId].msgId).catch(() => { });
            delete activeBeli[userId];
          }
        }, 300000) // 5 menit
      };

      // === Loop cek status pembayaran ===
      while (activeBeli[userId] && activeBeli[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        let check;
        try {
          check = await axios.post("https://atlantich2h.com/deposit/status",
            qs.stringify({ api_key: settings.ApikeyAtlantic, id: info.id }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          ).then(r => r.data).catch(() => null);
        } catch (e) {
          check = null;
        }

        const status = check?.data;
        if (status && status.status !== "pending") {
          // Jika pembayaran berhasil
          activeBeli[userId].status = false;
          clearTimeout(activeBeli[userId].timeout);

          // Instant claim (optional)
          await axios.post("https://atlantich2h.com/deposit/instant",
            qs.stringify({ api_key: settings.ApikeyAtlantic, id: info.id, action: true }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          ).catch(() => { });

          const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
          await bot.deleteMessage(chatId, activeBeli[userId].msgId).catch(() => { });
          await bot.sendMessage(chatId,
            `✅ Pembelian Berhasil!\n━━━━━━━━━━━━━━━\n📦 Barang: ${nama}\n📦 Jumlah: ${jumlah}\n💰 Total: Rp${total.toLocaleString()}\n⏰ Tanggal: ${waktu}\n\n~ Segera Hubungi Developer Kami Untuk Menerima Pesanan Anda!!\n~Developer: t.me/Ranzneweraa`,
            { parse_mode: "Markdown" }
          );

          // Notifikasi ke owner/admin
          const notifikasi = `📢 PEMBELIAN SUKSES!\n━━━━━━━━━━━━━━━\n👤 User: @${username} (${userId})\n📦 Barang: ${nama}\n📦 Jumlah: ${jumlah}\n💰 Total: Rp${total.toLocaleString()}\n📆 ${waktu}`;
          await bot.sendMessage(owner, notifikasi).catch(() => { });

          delete activeBeli[userId];
        }
      }

    } catch (e) {
      console.error("QRIS ERROR:", e.response?.data || e.message);
      bot.sendMessage(chatId, "❌ Gagal membuat QRIS, coba lagi.");
    }
  }
});

bot.onText(/^(\.|\#|\/)topup$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    const allowedGroups = getAllowedGroups();

  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Topup hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb", {
      reply_to_message_id: targetMessageId
    });
  }
    bot.sendMessage(
        chatId,
        `❌ Format salah!\n\nGunakan:\n/topup 083183432282 1000\nMinimal Topup 1000!!`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^([./]{0,2})?topup\s+(\d+)\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name || "TidakDiketahui";
  const nomorTujuan = match[2];
  const jumlah = parseInt(match[3]);

  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  const allowedGroups = getAllowedGroups();

  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Topup hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb", {
      reply_to_message_id: targetMessageId
    });
  }

  if (activeTopup[userId]) {
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik .batalbeli untuk membatalkan.", {
      reply_to_message_id: targetMessageId
    });
  }

  if (isNaN(jumlah) || jumlah < 1000) {
    return bot.sendMessage(chatId, "❌ Jumlah tidak valid. Minimal topup Rp1.000.\nContoh: .topup 081234567890 10000", {
      reply_to_message_id: targetMessageId
    });
  }

  const total = jumlah + (jumlah / 1000 * 1000); // harga naik 1000 per 1000
  const reff = `EWALLET-${Math.floor(Math.random() * 1000000)}`;

  // simpan sesi sementara (tambahkan username)
  activeTopup[userId] = { chatId, nomorTujuan, jumlah, total, reff, step: "pilihEwallet", username };

  return bot.sendMessage(chatId, `📱 Topup eWallet\n\nNomor: *${nomorTujuan}*\nJumlah: Rp${toRupiah(jumlah)}\nTotal Bayar: Rp${toRupiah(total)}\n\n👉 Silakan pilih jenis eWallet:`, {
    parse_mode: "Markdown",
    reply_to_message_id: targetMessageId,
    reply_markup: {
      inline_keyboard: [
        [{ text: "💙 Dana", callback_data: `ewallet_dana_${userId}` }],
        [{ text: "💚 GoPay", callback_data: `ewallet_gopay_${userId}` }],
        [{ text: "🟣 OVO", callback_data: `ewallet_ovo_${userId}` }],
        [{ text: "🟠 ShopeePay", callback_data: `ewallet_shopeepay_${userId}` }]
      ]
    }
  });
});

// Handler pilihan ewallet
bot.on('callback_query', async (query) => {
  const userId = query.from.id.toString();
  const chatId = query.message.chat.id;

  if (!activeTopup[userId] || !query.data.startsWith("ewallet_")) return;

  const pilihan = query.data.split("_")[1]; // dana/gopay/ovo/shopeepay
  const { jumlah, total, nomorTujuan, reff, username } = activeTopup[userId];
  const targetMessageId = query.message.message_id;

  try {
    const depositData = qs.stringify({
      api_key: settings.ApikeyAtlantic,
      reff_id: reff,
      nominal: total,
      type: 'ewallet',
      metode: 'qris'
    });

    const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = res.data;
    if (!data.status) {
      delete activeTopup[userId];
      return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`, {
        reply_to_message_id: targetMessageId
      });
    }

    const info = data.data;
    const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

    const teks = `┏━━━━━━━━━━━━━━━━━━━━┓
┃💸 TOPUP EWALLET 💸
┗━━━━━━━━━━━━━━━━━━━━┛
🆔 Transaksi: ${reff}
🙎 User: @${username} (${userId})
📱 Nomor Tujuan: ${nomorTujuan}
📲 eWallet: ${pilihan.toUpperCase()}
💰 Jumlah: Rp${toRupiah(jumlah)}
💳 Total Bayar: Rp${toRupiah(total)}
⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk bayar
━━━━━━━━━━━━━━━━━━━━━━━`;

    const sentMsg = await bot.sendPhoto(chatId, qrImage, {
      caption: teks,
      parse_mode: "Markdown",
      reply_to_message_id: targetMessageId,
      reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Topup", callback_data: "bataltopup" }]] }
    });

    // simpan transaksi aktif
    activeTopup[userId] = {
      msgId: sentMsg.message_id,
      chatId,
      idDeposit: info.reff_id,
      id: info.id,
      amount: jumlah,
      nomorTujuan,
      ewallet: pilihan,
      username,
      status: true,
      timeout: setTimeout(async () => {
        if (activeTopup[userId]?.status) {
          await bot.sendMessage(chatId, "⏰ QRIS Topup telah *expired*.", {
            reply_to_message_id: targetMessageId
          });
          await bot.deleteMessage(chatId, activeTopup[userId].msgId).catch(() => { });
          delete activeTopup[userId];
        }
      }, 300000) // 5 menit
    };

    // 🔹 Tambah loop cek status pembayaran
    const checkInterval = setInterval(async () => {
      if (!activeTopup[userId]) return clearInterval(checkInterval);

      try {
        const cek = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          reff_id: reff
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const result = cek.data;
        if (result.status && result.data.status === "Success") {
          clearInterval(checkInterval);
          clearTimeout(activeTopup[userId].timeout);

          await bot.sendMessage(chatId, `✅ Topup berhasil!\nNomor: *${nomorTujuan}*\nJumlah: Rp${toRupiah(jumlah)}\nEwallet: ${pilihan.toUpperCase()}\nSegera Hubungi Developer Kami Untuk Mengkonfirmasikan Pesanan Anda, Jgn Lupa Sertakan Bukti Pembayaran Nya!`, {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
          });

          // 🔔 Notifikasi ke owner utama
          const ownerId = settings.ownerId; // isi id owner kamu
          await bot.sendMessage(ownerId, `📢 *Transaksi Sukses*\n\n🆔 Reff: ${reff}\n🙎 User: @${username} (${userId})\n📱 Nomor: ${nomorTujuan}\n📲 Ewallet: ${pilihan.toUpperCase()}\n💰 Jumlah: Rp${toRupiah(jumlah)}\n💳 Total: Rp${toRupiah(total)}`, {
            parse_mode: "Markdown"
          });

          delete activeTopup[userId];
        }
      } catch (err) {
        console.error("CHECK STATUS ERROR:", err.response?.data || err.message);
      }
    }, 5000); // cek setiap 5 detik

  } catch (err) {
    console.error("TOPUP EWALLET ERROR:", err.response?.data || err.message);
    delete activeTopup[userId];
    return bot.sendMessage(chatId, "❌ Gagal memproses topup. Silakan coba lagi.", {
      reply_to_message_id: targetMessageId
    });
  }
});

// ✅ Handler untuk tombol Batalkan Deposit
bot.on('callback_query', async (query) => {
  const userId = query.from.id.toString();
  const chatId = query.message.chat.id;

  if (query.data === "bataltopup") {
    if (activeTopup[userId]) {
      clearTimeout(activeTopup[userId].timeout);
      await bot.deleteMessage(chatId, activeTopup[userId].msgId).catch(() => { });
      delete activeTopup[userId];
      await bot.answerCallbackQuery(query.id, { text: "✅ Topup dibatalkan." });
      await bot.sendMessage(chatId, "❌ Topup berhasil dibatalkan.");
    } else {
      await bot.answerCallbackQuery(query.id, { text: "Tidak ada transaksi aktif." });
    }
  }
});

// ================== Command Buysaldo ==================
bot.onText(/^([./]{0,2})?buysaldo\s*(\d+)?$/i, async (msg, match) => {    
  const chatId = msg.chat.id;    
  const userId = msg.from.id.toString();    
  const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";    
  const jumlah = parseInt(match[2]);    
  const allowedGroups = getAllowedGroups();

  // ✅ Validasi: hanya private chat ATAU grup yang terdaftar
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {    
    return bot.sendMessage(chatId, "❌ Deposit hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");    
  }

  if (activeDeposit[userId]) {    
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik .batalbeli untuk membatalkan.");    
  }

  if (!match[2]) {    
    return bot.sendMessage(chatId, `💸 Cara Melakukan Deposit\n\nKetik perintah berikut:\n.buysaldo <jumlah>\n\nContoh:\n.buysaldo 10000\n\nMinimal deposit: Rp1.000\nBiaya admin: Rp${toRupiah(settings.FeeTransaksi)}`, { parse_mode: "Markdown" });    
  }

  if (isNaN(jumlah) || jumlah < 1000) {    
    return bot.sendMessage(chatId, "❌ Jumlah tidak valid. Minimal deposit Rp1.000.\nContoh: .buysaldo 10000");    
  }

  const total = jumlah + settings.FeeTransaksi;    
  const reff = `DEPO-${Math.floor(Math.random() * 1000000)}`;    

  try {
    // ===== Request QRIS =====
    const depositData = qs.stringify({    
      api_key: settings.ApikeyAtlantic,    
      reff_id: reff,    
      nominal: total,    
      type: 'ewallet',    
      metode: 'qris'    
    });    

    const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {      
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }      
    });      

    const data = res.data;      
    if (!data.status) {      
      return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);      
    }      

    const info = data.data;      
    const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });      

    const teks = `┏━━━━━━━━━━━━━━━━━━━━┓    
┃💸 DEPOSIT QRIS ATLANTIC 💸    
┗━━━━━━━━━━━━━━━━━━━━┛    
🆔 Kode Transaksi: ${reff}    
🙎 User: @${username} (${userId})    
💰 Jumlah Deposit: Rp${toRupiah(jumlah)}    
🧾 Biaya Admin: Rp${toRupiah(settings.FeeTransaksi)}    
💳 Total Bayar: Rp${toRupiah(info.nominal)}    
⏰ Batas Waktu: 5 Menit    
📷 Scan QR di atas untuk pembayaran    
━━━━━━━━━━━━━━━━━━━━━━━    
⚠️ Catatan Penting:    
• Jangan tutup Telegram selama proses berlangsung    
• Saldo akan otomatis masuk setelah pembayaran`;

    const sentMsg = await bot.sendPhoto(chatId, qrImage, {      
      caption: teks,      
      parse_mode: "Markdown",      
      reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Deposit", callback_data: "batalbuy" }]] }      
    });      

    activeDeposit[userId] = {      
      msgId: sentMsg.message_id,      
      chatId,      
      idDeposit: info.reff_id,      
      id: info.id,      
      amount: jumlah,      
      status: true,      
      timeout: setTimeout(async () => {      
        if (activeDeposit[userId]?.status) {      
          await bot.sendMessage(chatId, "⏰ QRIS Deposit telah *expired*.");      
          await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });      
          delete activeDeposit[userId];      
        }      
      }, 300000) // 5 menit      
    };      

    // ===== Loop status pembayaran =====
    while (activeDeposit[userId] && activeDeposit[userId].status) {      
      await sleep(5000);      
      const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({      
        api_key: settings.ApikeyAtlantic,      
        id: activeDeposit[userId].id      
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);      

      const status = check?.data;      
      if (status && status.status !== 'pending') {      
        activeDeposit[userId].status = false;      
        clearTimeout(activeDeposit[userId].timeout);      

        await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({      
          api_key: settings.ApikeyAtlantic,      
          id: activeDeposit[userId].id,      
          action: true      
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });      

        const saldoPath = './atlantik/saldo.json';      
        let saldo = fs.existsSync(saldoPath) ? JSON.parse(fs.readFileSync(saldoPath)) : {};      
        saldo[userId] = (saldo[userId] || 0) + jumlah;      
        fs.writeFileSync(saldoPath, JSON.stringify(saldo, null, 2));      

        const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");      

        await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });      
        await bot.sendMessage(chatId, `✅ Deposit Berhasil!\n━━━━━━━━━━━━━━━━━━━━━━━\n🧾 Jumlah: Rp${toRupiah(jumlah)}\n💳 Saldo Sekarang: Rp${toRupiah(saldo[userId])}\n⏰ Tanggal: ${waktu}`, { parse_mode: "Markdown" });      

        // Kirim notifikasi ke Admin
        const notifikasi = `📢 DEPOSIT SUKSES!\n━━━━━━━━━━━━━━━━━━━━━━━\n🆔 Kode Transaksi: ${reff}\n🙎 User: @${username} (${userId})\n💰 Jumlah Deposit: Rp${toRupiah(jumlah)}\n💼 Saldo: Rp${toRupiah(saldo[userId])}\n📆 Tanggal: ${waktu}`;
        await bot.sendMessage(owner, notifikasi, { parse_mode: "Markdown" }).catch(() => { });

        delete activeDeposit[userId];      
      }      
    }    

  } catch (err) {    
    console.error("DEPOSIT ERROR:", err.response?.data || err.message);    
    return bot.sendMessage(chatId, "❌ Gagal memproses deposit. Silakan coba lagi.");    
  }    
});

// ✅ Handler untuk tombol Batalkan Deposit
bot.on('callback_query', async (query) => {
  const userId = query.from.id.toString();
  const chatId = query.message.chat.id;

  if (query.data === "batalbuy") {
    if (activeDeposit[userId]) {
      clearTimeout(activeDeposit[userId].timeout);
      await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
      delete activeDeposit[userId];
      await bot.answerCallbackQuery(query.id, { text: "✅ Deposit dibatalkan." });
      await bot.sendMessage(chatId, "❌ Deposit berhasil dibatalkan.");
    } else {
      await bot.answerCallbackQuery(query.id, { text: "Tidak ada transaksi aktif." });
    }
  }
});

bot.onText(/^([./]{0,2})?(checksaldo|profile)$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";
  const CHANNEL_ID = "-1002942557374";

  // ✅ Pastikan hanya bisa via private chat
  if (msg.chat.type !== 'private') {
    return bot.sendMessage(chatId, "❌ Cek saldo hanya bisa dilakukan via chat pribadi.");
  }

  // ✅ Pastikan hanya owner yang bisa akses
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa mengakses perintah ini.");
  }

  try {
    // ✅ Ambil saldo user dari saldo.json
    const saldoPath = './atlantik/saldo.json';
    let saldo = fs.existsSync(saldoPath) ? JSON.parse(fs.readFileSync(saldoPath)) : {};
    let userSaldo = saldo[userId] || 0;

    // ✅ Ambil saldo dari API Atlantic
    let atlanticData = {};
    try {
      const res = await axios.post(
        'https://atlantich2h.com/get_profile',
        qs.stringify({ api_key: settings.ApikeyAtlantic }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      atlanticData = res.data?.data || {};
    } catch (err) {
      console.error('Error get Atlantic saldo:', err.response?.data || err.message);
    }

    // ✅ Buat teks untuk owner
    const teksUser = `
💰 *Informasi Saldo Owner*
━━━━━━━━━━━━━━━━━━━━━━━
🙎 User: @${username} (${userId})
💳 Saldo Bot: Rp${toRupiah(userSaldo)}
🏦 Saldo Atlantic: Rp${toRupiah(atlanticData?.balance || 0)}
👤 Nama Atlantic: ${atlanticData?.name || 'Tidak diketahui'}

📆 ${moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")}
━━━━━━━━━━━━━━━━━━━━━━━
#Ketik /withdraw untuk mencairkan saldo.
`.trim();

    await bot.sendMessage(chatId, teksUser, { parse_mode: "Markdown" });

    // ✅ Kirim notifikasi ke channel
    const teksChannel = `
📢 *NOTIFIKASI CEK SALDO*
━━━━━━━━━━━━━━━━━━━━━━━
🙎 Owner: @${username} (${userId})
💳 Saldo Bot: Rp${toRupiah(userSaldo)}
🏦 Saldo Atlantic: Rp${toRupiah(atlanticData?.balance || 0)}
📅 Waktu: ${moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")}
━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    await bot.sendMessage(CHANNEL_ID, teksChannel, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("CEKSALDO ERROR:", err.message);
    return bot.sendMessage(chatId, "❌ Gagal menampilkan saldo. Silakan coba lagi.");
  }
});

bot.onText(/^([./]{0,2})?(withdraw|cairkan)$/i, async (msg) => {  
    const chatId = msg.chat.id;  
    const userId = msg.from.id.toString();  
    const replyMessage = msg.reply_to_message;  
    const targetMessageId = replyMessage ? replyMessage.message_id : msg.message_id;  
  
    if (userId !== owner) {  
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa mengakses perintah ini.");  
  }  
    
    try {  
        function sensorString(input, visibleCount = 3, maskChar = 'X') {  
            if (input.length <= visibleCount) return input;  
            const visiblePart = input.slice(0, visibleCount);  
            const maskedPart = maskChar.repeat(input.length - visibleCount);  
            return visiblePart + maskedPart;  
        }  
  
        function sensorWithSpace(str, visibleCount = 3, maskChar = 'X') {  
            let result = '';  
            let count = 0;  
            for (let char of str) {  
                if (char === ' ') {  
                    result += char;  
                } else if (count < visibleCount) {  
                    result += char;  
                    count++;  
                } else {  
                    result += maskChar;  
                }  
            }  
            return result;  
        }  
  
        // ✅ Ambil saldo Atlantic  
        const statusUrl = 'https://atlantich2h.com/get_profile';  
        const statusData = qs.stringify({ api_key: apiAtlantic });  
  
        const res = await axios.post(statusUrl, statusData, {  
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        });  
  
        const saldoAwal = res?.data?.data?.balance;  
        const totalsaldo = Math.max(0, saldoAwal - 2000); // potong 2000  
  
        // ✅ Proses pencairan  
        const statusUrl2 = 'https://atlantich2h.com/transfer/create';  
        const statusData2 = qs.stringify({  
            api_key: apiAtlantic,  
            ref_id: `${Date.now()}`,  
            kode_bank: typeewallet,  
            nomor_akun: nopencairan,  
            nama_pemilik: atasnamaewallet,  
            nominal: totalsaldo.toString()  
        });  
  
        const ress = await axios.post(statusUrl2, statusData2, {  
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        });  
  
        const ids = ress?.data?.data?.id;  
  
        // ✅ Kirim informasi withdraw (reply)  
        await bot.sendMessage(chatId, `  
💳 Informasi Pencairan Saldo:  
  
- Nominal: Rp${await toRupiah(saldoAwal)}  
- Fee Pencairan: Rp2000  
- Tujuan: ${sensorString(nopencairan)}  
- Type Ewallet: ${typeewallet}  
- Nama Pemilik: ${sensorWithSpace(atasnamaewallet)}  
- Status: ${ress.data.data.status}  
  
Memproses Pencairan Saldo.  
`, { reply_to_message_id: targetMessageId });  
  
        // ✅ Loop cek status  
        let running = true;  
        while (running) {  
            const statusUrl3 = 'https://atlantich2h.com/transfer/status';  
            const statusData3 = qs.stringify({  
                api_key: apiAtlantic,  
                id: ids  
            });  
  
            const checkRes = await axios.post(statusUrl3, statusData3, {  
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
            });  
  
            const result = checkRes?.data?.data || {};  
            if (result?.status !== "pending") {  
                await bot.sendMessage(chatId, `  
✅Pencairan Berhasil!  
  
- Nominal: Rp${await toRupiah(saldoAwal)}  
- Fee Pencairan: Rp2000  
- Tujuan: ${sensorString(nopencairan)}  
- Type Ewallet: ${typeewallet}  
- Nama Pemilik: ${sensorWithSpace(atasnamaewallet)}  
- Status: ${result.status}  
  
Saldo Berhasil Dikirim Ke Ewallet Pribadi ✅
`, { reply_to_message_id: targetMessageId });  
                break;  
            }  
  
            await sleep(5000);  
        }  
  
    } catch (err) {  
        console.error('Error proses pencairan saldo:', err.response?.data || err.message);  
        return bot.sendMessage(chatId, `❌ Gagal mengambil data saldo, silakan coba lagi nanti.\n\n${err.response?.data?.message || err.message}`, {  
            reply_to_message_id: targetMessageId  
        });  
    }  
});

// Jika user hanya mengetik /deposit tanpa angka
bot.onText(/^(\.|\#|\/)deposit$/, async (msg) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/deposit 1000`,
        { reply_to_message_id: targetMessageId } 
    );
});

// Jika user mengetik /deposit [angka]
bot.onText(/\/deposit (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const amount = parseInt(match[1]);

    if (isNaN(amount)) {
        return bot.sendMessage(chatId, `🚫 Nominal tidak valid. Pastikan hanya angka, contoh: /deposit 1000`);
    }

    const UrlQr = qrisOrderKuota;
    const fee = Math.floor(Math.random() * 101); // Biaya acak antara 0 - 100
    const totalAmount = amount + fee;

    try {
        const res = await fetch(`https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${amount}&codeqr=${UrlQr}`);
        const pay = await res.json();

        const expirationTime = new Date(pay.result.expirationTime);
        const timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
        const currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
        const hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
        const minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        const teks = `✨ *DETAIL PEMBAYARAN DEPOSIT* ✨\n\n🆔 *ID TRANSAKSI:* ${pay.result.transactionId}\n💳 *JUMLAH:* Rp. ${totalAmount}\n⏰ *BATAS WAKTU:* ${formattedTime} WIB\n\n✅ Silakan scan QRIS di atas untuk menyelesaikan deposit Anda.`;
        bot.sendPhoto(chatId, pay.result.qrImageUrl, { caption: teks });

        const apiUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
        let isTransactionComplete = true;
        const maxWaitTime = 5 * 60 * 1000; // 5 menit
        const startTime = Date.now();

        while (!isTransactionComplete && Date.now() - startTime < maxWaitTime) {
            try {
                const response = await fetch(apiUrl);
                const result = await response.json();

                if (result && result.amount && parseInt(result.amount) === totalAmount) {
                    isTransactionComplete = true;

                    // Tambahkan saldo ke users.json
                    const fs = require('fs');
                    const usersFilePath = 'source/users.json';
                    let usersData = [];

                    if (fs.existsSync(usersFilePath)) {
                        usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                    }

                    const user = usersData.find(u => u.nomer === userId);
                    if (user) {
                        user.balance = (parseInt(user.balance) || 0) + amount;
                    } else {
                        usersData.push({ nomer: userId, balance: amount });
                        bot.sendMessage(chatId, '🎉 Akun Anda telah dibuat otomatis. Selamat datang!');
                    }

                    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

                    bot.sendMessage(chatId, `✅ *PEMBAYARAN BERHASIL!*\n\n🆔 *ID:* ${pay.result.transactionId}\n💰 *JUMLAH DITAMBAHKAN:* Rp. ${amount}`);
                }
            } catch (err) {
                console.error("Error cek status pembayaran:", err);
            }

            if (!isTransactionComplete) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // tunggu 10 detik
            }
        }

        if (!isTransactionComplete) {
            bot.sendMessage(chatId, `⏳ *WAKTU PEMBAYARAN TELAH HABIS!*\nSilakan buat deposit ulang.`);
        }

    } catch (error) {
        console.error("Error saat proses deposit:", error);
        bot.sendMessage(chatId, '❌ Gagal membuat pembayaran QRIS.');
    }
});

// ✅ Daftar paket panel
const paket = {
  "1gb": { size: "1GB", price: 2000 },
  "2gb": { size: "2GB", price: 3000 },
  "3gb": { size: "3GB", price: 4000 },
  "4gb": { size: "4GB", price: 5000 },
  "5gb": { size: "5GB", price: 6000 },
  "6gb": { size: "6GB", price: 7000 },
  "7gb": { size: "7GB", price: 8000 },
  "8gb": { size: "8GB", price: 9000 },
  "9gb": { size: "9GB", price: 10000 },
  "10gb": { size: "10GB", price: 11000 },
  "unli": { size: "unli", price: 15000 }
};

bot.onText(/^([./]{0,2})?buypanel1\s*(\d+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  const paketList = `🛒 *PANEL PRIVATE STORE* 🛒\n\n` +
    `Silakan pilih paket panel:\n\n` +
    `🟢 1GB - Rp2.000\n` +
    `🟢 2GB - Rp3.000\n` +
    `🟢 3GB - Rp4.000\n` +
    `🟢 4GB - Rp5.000\n` +
    `🟢 5GB - Rp6.000\n` +
    `🟢 6GB - Rp7.000\n` +
    `🟢 7GB - Rp8.000\n` +
    `🟢 8GB - Rp9.000\n` +
    `🟢 9GB - Rp10.000\n` +
    `🟢 10GB - Rp11.000\n` +
    `🔥 unli - Rp15.000\n\n` +
    `Ketik nama paket (contoh: 1GB) untuk membeli.`;

  bot.sendMessage(chatId, paketList);

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;

    const pilihan = responseMsg.text.trim().toLowerCase();
    const selectedPackage = paket[pilihan];
    if (!selectedPackage) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik sesuai daftar (contoh: 1GB)");
    }

    try {
      // ✅ Buat pembayaran
      const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
      const paymentRes = await axios.get(paymentUrl);
      const paymentData = paymentRes.data.result;

      const teksPembayaran = `
▧ *INFORMASI PEMBAYARAN*  
• ID: ${paymentData.transactionId}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Paket: Panel ${selectedPackage.size}  
• Expired: 5 menit  

*Catatan:*  
QRIS hanya berlaku 5 menit. Bot akan otomatis membuat panel jika pembayaran berhasil.
      `;

      bot.sendPhoto(chatId, paymentData.qrImageUrl, {
        caption: teksPembayaran,
        parse_mode: 'Markdown'
      }).then(sentMsg => {
        // ✅ Cek status pembayaran
        const transaksi = {
          messageId: sentMsg.message_id,
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          package: selectedPackage.size,
          pilihan
        };

        // Timer expired
        setTimeout(() => {
          bot.sendMessage(chatId, "⏳ QR Code expired! Silakan coba lagi.");
          bot.deleteMessage(chatId, sentMsg.message_id);
        }, 300000);

        // Interval cek status
        const paymentCheck = setInterval(async () => {
          try {
            const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
            const statusRes = await axios.get(statusUrl);

            if (statusRes.data.amount === transaksi.amount) {
              clearInterval(paymentCheck);

              bot.sendMessage(chatId, `✅ Pembayaran berhasil! Membuat panel Anda...`);

              // ✅ Auto Create Panel
              const config = sizes[transaksi.pilihan] || sizes['1gb'];
              const username = `user${Date.now()}`;
              const email = `${username}@gmail.com`;
              const password = `${username}001`;

              try {
                // 1. Buat User
                const userResp = await fetch(`${Domain}/api/application/users`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Apikey}`
                  },
                  body: JSON.stringify({
                    email, username, first_name: username, last_name: username,
                    language: 'en', password
                  })
                });
                const userData = await userResp.json();
                if (userData.errors) return bot.sendMessage(chatId, `⚠️ Gagal membuat user panel.`);

                const userId = userData.attributes.id;

                // 2. Buat Server
                const serverResp = await fetch(`${Domain}/api/application/servers`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Apikey}`
                  },
                  body: JSON.stringify({
                    name: `Panel-${username}`,
                    user: userId,
                    egg: parseInt(settings.eggs),
                    docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
                    startup: 'npm start',
                    environment: { INST: 'npm', AUTO_UPDATE: '0', CMD_RUN: 'npm start' },
                    limits: {
                      memory: config.memory,
                      swap: 0,
                      disk: config.disk,
                      io: 500,
                      cpu: config.cpu
                    },
                    feature_limits: { databases: 5, backups: 5, allocations: 1 },
                    deploy: { locations: [parseInt(settings.loc)], dedicated_ip: false, port_range: [] }
                  })
                });

                const serverData = await serverResp.json();
                if (serverData.errors) return bot.sendMessage(chatId, `⚠️ Gagal membuat server.`);

                // ✅ Kirim detail panel
                bot.sendMessage(chatId, `
✅ *Panel Anda Siap!*
🌐 Login: ${Domain}
👤 Username: ${username}
🔑 Password: ${password}
📦 Paket: ${selectedPackage.size}
                `, { parse_mode: 'Markdown' });

              } catch (err) {
                console.error("Error auto-create panel:", err);
                bot.sendMessage(chatId, `⚠️ Error membuat panel.`);
              }
            }
          } catch (error) {
            console.error("Error cek status:", error);
          }
        }, 15000);
      });

    } catch (error) {
      console.error("Error membuat pembayaran:", error);
      bot.sendMessage(chatId, "⚠️ Gagal membuat pembayaran, coba lagi nanti.");
    }
  });
});

bot.onText(/^([./]{0,2})?buypanel2\s*(\d+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name;

  // ✅ Cek transaksi aktif
  if (activeDeposit[userId]) {
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik *.batalbeli* untuk membatalkan.");
  }

  const paketList = `
🛒 *PANEL PRIVATE STORE* 🛒

Silakan pilih paket panel:
🟢 1GB - Rp2.000
🟢 2GB - Rp3.000
🟢 3GB - Rp4.000
🟢 4GB - Rp5.000
🟢 5GB - Rp6.000
🟢 6GB - Rp7.000
🟢 7GB - Rp8.000
🟢 8GB - Rp9.000
🟢 9GB - Rp10.000
🟢 10GB - Rp11.000
🔥 unli - Rp15.000

Ketik nama paket (contoh: 1GB) untuk membeli.
`.trim();

  bot.sendMessage(chatId, paketList);

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;

    const pilihan = responseMsg.text.trim().toLowerCase();
    const selectedPackage = paket[pilihan];

    if (!selectedPackage) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik sesuai daftar (contoh: 1GB)");
    }

    const total = selectedPackage.price + settings.FeeTransaksi;
    const reff = `PANEL-${Math.floor(Math.random() * 1000000)}`;

    try {
      // ✅ Request QRIS ke Atlantic
      const depositData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
      }

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teksPembayaran = `
📦 *Pembelian Panel Private*
━━━━━━━━━━━━━━━━━━
📌 Paket: ${selectedPackage.size}
💰 Harga: Rp${selectedPackage.price.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}

⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk pembayaran
`.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teksPembayaran,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "❌ Batalkan", callback_data: "batalbuy" }]]
        }
      });

      // ✅ Simpan transaksi
      activeDeposit[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        idDeposit: info.reff_id,
        id: info.id,
        paket: selectedPackage,
        pilihan,
        status: true,
        timeout: setTimeout(async () => {
          if (activeDeposit[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS telah *expired*.");
            await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
            delete activeDeposit[userId];
          }
        }, 300000) // 5 menit
      };

      // ✅ Loop cek pembayaran
      while (activeDeposit[userId] && activeDeposit[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeDeposit[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activeDeposit[userId].status = false;
          clearTimeout(activeDeposit[userId].timeout);

          await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
            api_key: settings.ApikeyAtlantic,
            id: activeDeposit[userId].id,
            action: true
          }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });

          await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });

          // ✅ AUTO CREATE PANEL
          const config = sizes[pilihan] || sizes['1gb'];
          const usernamePanel = `user${Date.now()}`;
          const email = `${usernamePanel}@gmail.com`;
          const password = `${usernamePanel}001`;

          try {
            // Buat user
            const userResp = await fetch(`${Domain}/api/application/users`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Apikey}`
              },
              body: JSON.stringify({
                email, username: usernamePanel, first_name: usernamePanel, last_name: "User",
                language: 'en', password
              })
            });
            const userData = await userResp.json();
            if (userData.errors) return bot.sendMessage(chatId, `⚠️ Gagal membuat user panel.`);

            const userIdPanel = userData.attributes.id;

            // Buat server
            const serverResp = await fetch(`${Domain}/api/application/servers`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Apikey}`
              },
              body: JSON.stringify({
                name: `Panel-${usernamePanel}`,
                user: userIdPanel,
                egg: parseInt(settings.eggs),
                docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
                startup: 'npm start',
                environment: { INST: 'npm', AUTO_UPDATE: '0', CMD_RUN: 'npm start' },
                limits: {
                  memory: config.memory,
                  swap: 0,
                  disk: config.disk,
                  io: 500,
                  cpu: config.cpu
                },
                feature_limits: { databases: 5, backups: 5, allocations: 1 },
                deploy: { locations: [parseInt(settings.loc)], dedicated_ip: false, port_range: [] }
              })
            });
            const serverData = await serverResp.json();
            if (serverData.errors) return bot.sendMessage(chatId, `⚠️ Gagal membuat server.`);

            const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

            await bot.sendMessage(chatId, `
✅ *Panel Anda Siap!*
━━━━━━━━━━━━━━━━━━
🌐 Login: ${Domain}
👤 Username: ${usernamePanel}
🔑 Password: ${password}
📦 Paket: ${selectedPackage.size}
⏰ Tanggal: ${waktu}
            `, { parse_mode: 'Markdown' });

            await bot.sendMessage(owner, `
📢 *PANEL TERJUAL!*
User: @${username} (${userId})
Paket: ${selectedPackage.size}
Harga: Rp${selectedPackage.price}
Tanggal: ${waktu}
            `, { parse_mode: "Markdown" });

          } catch (err) {
            console.error("Error auto-create panel:", err);
            bot.sendMessage(chatId, `⚠️ Error membuat panel.`);
          }

          delete activeDeposit[userId];
        }
      }
    } catch (error) {
      console.error("Error membuat pembayaran:", error);
      bot.sendMessage(chatId, "⚠️ Gagal membuat pembayaran, coba lagi nanti.");
    }
  });
});

bot.onText(/^([./]{0,2})?buyadminpanel1\s*(\d+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  const paketList = `🛒 *PAKET ADMIN PANEL* 🛒\n\n` +
    `Silakan pilih durasi admin panel yang ingin Anda beli:\n\n` +
    `✨ *1 MINGGU* - Rp15.000\n` +
    `✨ *1 BULAN* - Rp20.000\n` +
    `✨ *PERMANEN* - Rp25.000\n\n` +
    `Balas dengan nama durasi (contoh: "1 minggu") untuk memilih.`;

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' }).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;

      const input = responseMsg.text.trim().toLowerCase();
      const paketAdmin = {
        "1 minggu": { name: "1 Minggu", price: 15000 },
        "1 bulan": { name: "1 Bulan", price: 20000 },
        "permanen": { name: "Permanen", price: 25000 }
      };

      const selectedKey = Object.keys(paketAdmin).find(key =>
        input.includes(key.toLowerCase())
      );

      if (!selectedKey) {
        return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Silakan ketik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen");
      }

      const selectedPackage = paketAdmin[selectedKey];

      try {
        // Buat pembayaran QRIS
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;

        const teksPembayaran = `
▧ *INFORMASI ADMIN PANEL*  
• ID Transaksi: ${paymentData.transactionId}  
• Durasi: ${selectedPackage.name}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Expired: 5 menit  

📌 *Catatan:*  
1. QRIS hanya berlaku 5 menit  
2. Bot akan otomatis memberi notifikasi jika berhasil  
3. Setelah pembayaran, akun Admin Panel akan dibuat otomatis
        `;

        bot.sendPhoto(chatId, paymentData.qrImageUrl, {
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        }).then(sentMsg => {

          // Timer expired
          setTimeout(() => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);

          // Cek status pembayaran setiap 15 detik
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);

              if (statusRes.data.amount === selectedPackage.price) {
                clearInterval(paymentCheck);

                // ✅ Buat akun Admin Panel otomatis
                const panelName = `admin${Date.now().toString().slice(-4)}`;
                const password = panelName + "117";

                const response = await fetch(`${Domain}/api/application/users`, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Apikey}`
                  },
                  body: JSON.stringify({
                    email: `${panelName}@gmail.com`,
                    username: panelName,
                    first_name: panelName,
                    last_name: "Admin",
                    language: "en",
                    root_admin: true,
                    password: password
                  })
                });

                const data = await response.json();
                if (data.errors) {
                  return bot.sendMessage(chatId, `❌ Gagal membuat akun admin!\n${JSON.stringify(data.errors[0])}`);
                }

                const user = data.attributes;

                const infoAdmin = `
✅ *Pembayaran Berhasil!*
Admin Panel *${selectedPackage.name}* berhasil dibuat!

📂 DETAIL AKUN ADMIN:
➤ Login: ${Domain}
➤ Username: ${panelName}
➤ Password: ${password}
==============================
📌 Catatan:
• Jangan share akun ke orang lain
• Jangan jual kembali Admin Panel ini
==============================
Terima kasih sudah order di Ranzneweraa 😁✌️
                `;

                bot.sendMessage(chatId, infoAdmin, { parse_mode: 'Markdown' });
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal memproses pembayaran, silakan coba lagi nanti.");
      }
    });
  });
});

bot.onText(/^([./]{0,2})?buyadminpanel2\s*(\d+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name;

  // ✅ Cek apakah ada transaksi aktif
  if (activeDeposit[userId]) {
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik *.batalbeli* untuk membatalkan.");
  }

  const paketList = `
🛒 *PAKET ADMIN PANEL* 🛒
Silakan pilih durasi admin panel:

✨ 1 Minggu - Rp15.000
✨ 1 Bulan  - Rp20.000
✨ Permanen - Rp25.000

Ketik: 1 minggu / 1 bulan / permanen
`.trim();

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' });

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;

    const input = responseMsg.text.trim().toLowerCase();
    const paketAdmin = {
      "1 minggu": { name: "1 Minggu", price: 15000 },
      "1 bulan": { name: "1 Bulan", price: 20000 },
      "permanen": { name: "Permanen", price: 25000 }
    };

    const selectedKey = Object.keys(paketAdmin).find(key =>
      input.includes(key.toLowerCase())
    );

    if (!selectedKey) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid!\nKetik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen");
    }

    const selectedPackage = paketAdmin[selectedKey];
    const total = selectedPackage.price + settings.FeeTransaksi;
    const reff = `BUYADMIN-${Math.floor(Math.random() * 1000000)}`;

    try {
      // ✅ Request ke API Atlantic untuk buat QRIS
      const depositData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
      }

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teksPembayaran = `
📦 *Pembelian Admin Panel*
━━━━━━━━━━━━━━━━━━━━━━
📌 Paket: ${selectedPackage.name}
💰 Harga: Rp${selectedPackage.price.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}

⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk pembayaran
`.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teksPembayaran,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "❌ Batalkan", callback_data: "batalbuy" }]]
        }
      });

      // ✅ Simpan transaksi aktif
      activeDeposit[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        idDeposit: info.reff_id,
        id: info.id,
        paket: selectedPackage,
        status: true,
        timeout: setTimeout(async () => {
          if (activeDeposit[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS telah *expired*.");
            await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });
            delete activeDeposit[userId];
          }
        }, 300000) // 5 menit
      };

      // ✅ Loop pengecekan pembayaran
      while (activeDeposit[userId] && activeDeposit[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeDeposit[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activeDeposit[userId].status = false;
          clearTimeout(activeDeposit[userId].timeout);

          // ✅ Konfirmasi ke API Atlantic
          await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
            api_key: settings.ApikeyAtlantic,
            id: activeDeposit[userId].id,
            action: true
          }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });

          // ✅ Hapus QR
          await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });

          // ✅ Buat akun Admin Panel otomatis
          const panelName = `admin${Date.now().toString().slice(-4)}`;
          const password = panelName + "117";

          const response = await fetch(`${Domain}/api/application/users`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Apikey}`
            },
            body: JSON.stringify({
              email: `${panelName}@gmail.com`,
              username: panelName,
              first_name: panelName,
              last_name: "Admin",
              language: "en",
              root_admin: true,
              password: password
            })
          });

          const dataUser = await response.json();
          if (dataUser.errors) {
            return bot.sendMessage(chatId, `❌ Gagal membuat akun admin!\n${JSON.stringify(dataUser.errors[0])}`);
          }

          const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
          const infoAdmin = `
✅ *Pembayaran Berhasil!*
Admin Panel *${selectedPackage.name}* berhasil dibuat!

📂 DETAIL AKUN ADMIN:
➤ Login: ${Domain}
➤ Username: ${panelName}
➤ Password: ${password}

⏰ Tanggal: ${waktu}
Terima kasih sudah order di Ranzneweraa 😁✌️
          `;

          await bot.sendMessage(chatId, infoAdmin, { parse_mode: 'Markdown' });

          // ✅ Notifikasi Owner
          const notifikasi = `
📢 *ADMIN PANEL TERJUAL!*
━━━━━━━━━━━━━━━━━━━━━━
User: @${username} (${userId})
Paket: ${selectedPackage.name}
Harga: Rp${selectedPackage.price}
Tanggal: ${waktu}
          `;
          await bot.sendMessage(owner, notifikasi, { parse_mode: "Markdown" });

          delete activeDeposit[userId];
        }
      }
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      return bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Silakan coba lagi.");
    }
  });
});

bot.onText(/\/buysellerpanel1/, async (msg) => {
  const chatId = msg.chat.id;
  
  const paketList = `🛒 *PAKET SELLER PANEL* 🛒\n\n` +
  `Silakan pilih durasi seller panel yang ingin Anda beli:\n\n` +
  `✨ *1 MINGGU* - Rp10.000\n` +
  `✨ *1 BULAN* - Rp15.000\n` +
  `✨ *PERMANEN* - Rp20.000\n\n` +
  `Balas dengan nama durasi (contoh: "1 minggu") untuk memilih.`;

  bot.sendMessage(chatId, paketList, {parse_mode: 'Markdown'}).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;
      
      // Normalisasi input user
      const input = responseMsg.text.trim().toLowerCase();
      
      const paketAdmin = {
        "1 minggu": { name: "1 Minggu", price: 10000 },
        "1 bulan": { name: "1 Bulan", price: 15000 },
        "permanen": { name: "Permanen", price: 20000 }
      };
      
      // Cari paket yang sesuai (case-insensitive)
      const selectedKey = Object.keys(paketAdmin).find(key => 
        input.includes(key.toLowerCase())
      );
      
      if (!selectedKey) {
        return bot.sendMessage(
          chatId, 
          "❌ Pilihan tidak valid! Silakan ketik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen"
        );
      }

      const selectedPackage = paketAdmin[selectedKey];
      
      try {
        // Proses pembayaran
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;
        
        const teksPembayaran = `
▧ *INFORMASI SELLER PANEL*  
• ID Transaksi: ${paymentData.transactionId}  
• Durasi: ${selectedPackage.name}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Expired: 5 menit  

📌 *Catatan:*  
1. QRIS hanya berlaku 5 menit  
2. Bot akan otomatis memberi notifikasi jika berhasil  
3. Setelah pembayaran, hubungi admin untuk aktivasi  

Ketik /batalbeli untuk membatalkan transaksi.
        `;
        
        bot.sendPhoto(chatId, paymentData.qrImageUrl, { 
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        })
        .then(sentMsg => {
          // Simpan data transaksi
          const transaksi = {
            messageId: sentMsg.message_id,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            package: selectedPackage.name,
            timestamp: Date.now()
          };
          
          // Timer expired (5 menit)
          setTimeout(() => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);
          
          // Cek status pembayaran
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);
              
              if (statusRes.data.amount === transaksi.amount) {
                clearInterval(paymentCheck);
                bot.sendMessage(
                  chatId,
                  `✅ *Pembayaran Berhasil!*\n\nSeller Panel ${selectedPackage.name} berhasil dibeli!\n\nSilakan hubungi @admin_username untuk proses aktivasi.`,
                  {parse_mode: 'Markdown'}
                );
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal memproses pembayaran, silakan coba lagi nanti.");
      }
    });
  });
});

bot.onText(/\/buysellerpanel2/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'TanpaUsername';
  const allowedGroups = getAllowedGroups();

  // ✅ Validasi: hanya private chat ATAU grup yang diizinkan
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
  }

  const paketList = `🛒 *PAKET SELLER PANEL* 🛒\n\n` +
    `Silakan pilih durasi yang ingin Anda beli:\n\n` +
    `✨ *1 MINGGU* - Rp10.000\n` +
    `✨ *1 BULAN* - Rp15.000\n` +
    `✨ *PERMANEN* - Rp20.000\n\n` +
    `Balas dengan nama durasi (contoh: "1 minggu").`;

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' });

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;
    const input = responseMsg.text.trim().toLowerCase();

    const paketSeller = {
      "1 minggu": { name: "1 Minggu", price: 10000 },
      "1 bulan": { name: "1 Bulan", price: 15000 },
      "permanen": { name: "Permanen", price: 20000 }
    };

    const selectedKey = Object.keys(paketSeller).find(key => input.includes(key));
    if (!selectedKey) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik: 1 minggu | 1 bulan | permanen");
    }

    const selectedPackage = paketSeller[selectedKey];
    const reff = `SELLER-${Math.floor(Math.random() * 1000000)}`;
    const total = selectedPackage.price;

    try {
      // ✅ Buat pembayaran via Atlantik
      const paymentData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', paymentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
      }

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      // ✅ Kirim QR ke user
      const teks = `
📦 *PEMBELIAN SELLER PANEL*
━━━━━━━━━━━━━━━━━━━━━━
🛍 Paket: ${selectedPackage.name}
💰 Harga: Rp${total.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}
⏳ Waktu Bayar: 5 Menit

📷 Scan QR di atas untuk membayar
      `.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown"
      });

      activePayment[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        amount: total,
        status: true,
        timeout: setTimeout(async () => {
          if (activePayment[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS pembayaran *expired*.");
            await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });
            delete activePayment[userId];
          }
        }, 300000) // 5 menit
      };

      // ✅ Loop pengecekan status pembayaran
      while (activePayment[userId] && activePayment[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activePayment[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activePayment[userId].status = false;
          clearTimeout(activePayment[userId].timeout);
          await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });

          await bot.sendMessage(chatId, `
✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━━━━━━━━
🎉 Paket: ${selectedPackage.name}
🔗 Link Group Seller Panel:
👉 https://t.me/+7bmSJu4_yNgxNjA1
          `.trim(), { parse_mode: "Markdown" });

          delete activePayment[userId];
        }
      }
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Silakan coba lagi.");
    }
  });
});

bot.onText(/\/buyownerpanel1/, async (msg) => {
  const chatId = msg.chat.id;
  
  const paketList = `🛒 *PAKET OWNER PANEL* 🛒\n\n` +
  `Silakan pilih durasi owner panel yang ingin Anda beli:\n\n` +
  `✨ *1 MINGGU* - Rp25.000\n` +
  `✨ *1 BULAN* - Rp35.000\n` +
  `✨ *PERMANEN* - Rp40.000\n\n` +
  `Balas dengan nama durasi (contoh: "1 minggu") untuk memilih.`;

  bot.sendMessage(chatId, paketList, {parse_mode: 'Markdown'}).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;
      
      // Normalisasi input user
      const input = responseMsg.text.trim().toLowerCase();
      
      const paketAdmin = {
        "1 minggu": { name: "1 Minggu", price: 25000 },
        "1 bulan": { name: "1 Bulan", price: 35000 },
        "permanen": { name: "Permanen", price: 40000 }
      };
      
      // Cari paket yang sesuai (case-insensitive)
      const selectedKey = Object.keys(paketAdmin).find(key => 
        input.includes(key.toLowerCase())
      );
      
      if (!selectedKey) {
        return bot.sendMessage(
          chatId, 
          "❌ Pilihan tidak valid! Silakan ketik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen"
        );
      }

      const selectedPackage = paketAdmin[selectedKey];
      
      try {
        // Proses pembayaran
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;
        
        const teksPembayaran = `
▧ *INFORMASI OWNER PANEL*  
• ID Transaksi: ${paymentData.transactionId}  
• Durasi: ${selectedPackage.name}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Expired: 5 menit  

📌 *Catatan:*  
1. QRIS hanya berlaku 5 menit  
2. Bot akan otomatis memberi notifikasi jika berhasil  
3. Setelah pembayaran, hubungi admin untuk aktivasi  

Ketik /batalbeli untuk membatalkan transaksi.
        `;
        
        bot.sendPhoto(chatId, paymentData.qrImageUrl, { 
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        })
        .then(sentMsg => {
          // Simpan data transaksi
          const transaksi = {
            messageId: sentMsg.message_id,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            package: selectedPackage.name,
            timestamp: Date.now()
          };
          
          // Timer expired (5 menit)
          setTimeout(() => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);
          
          // Cek status pembayaran
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);
              
              if (statusRes.data.amount === transaksi.amount) {
                clearInterval(paymentCheck);
                bot.sendMessage(
                  chatId,
                  `✅ *Pembayaran Berhasil!*\n\nOwner Panel ${selectedPackage.name} berhasil dibeli!\n\nSilakan hubungi @admin_username untuk proses aktivasi.`,
                  {parse_mode: 'Markdown'}
                );
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal memproses pembayaran, silakan coba lagi nanti.");
      }
    });
  });
});

bot.onText(/\/buyownerpanel2/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || 'TanpaUsername';
  const allowedGroups = getAllowedGroups();

  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
  }

  const paketList = `🛒 *PAKET OWNER PANEL* 🛒\n\n` +
    `Silakan pilih durasi yang ingin Anda beli:\n\n` +
    `✨ *1 MINGGU* - Rp25.000\n` +
    `✨ *1 BULAN* - Rp35.000\n` +
    `✨ *PERMANEN* - Rp40.000\n\n` +
    `Balas dengan nama durasi (contoh: "1 minggu").`;

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' });

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;
    const input = responseMsg.text.trim().toLowerCase();

    const paketOwner = {
      "1 minggu": { name: "1 Minggu", price: 25000 },
      "1 bulan": { name: "1 Bulan", price: 35000 },
      "permanen": { name: "Permanen", price: 40000 }
    };

    const selectedKey = Object.keys(paketOwner).find(key => input.includes(key));
    if (!selectedKey) return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik: 1 minggu | 1 bulan | permanen");

    const selectedPackage = paketOwner[selectedKey];
    const reff = `OWNER-${Math.floor(Math.random() * 1000000)}`;
    const total = selectedPackage.price;

    try {
      const paymentData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', paymentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teks = `
📦 *PEMBELIAN OWNER PANEL*
━━━━━━━━━━━━━━━━━━━━━━
🛍 Paket: ${selectedPackage.name}
💰 Harga: Rp${total.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}
⏳ Waktu Bayar: 5 Menit

📷 Scan QR di atas untuk membayar
      `.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Pembelian", callback_data: "batalbuy" }]] }
      });

      activePayment[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        amount: total,
        status: true,
        timeout: setTimeout(async () => {
          if (activePayment[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS pembayaran *expired*.");
            await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });
            delete activePayment[userId];
          }
        }, 300000)
      };

      while (activePayment[userId] && activePayment[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activePayment[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activePayment[userId].status = false;
          clearTimeout(activePayment[userId].timeout);

          await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });

          await bot.sendMessage(chatId, `
✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━━━━━━━━
🎉 Paket: ${selectedPackage.name}
🔗 Link Group Owner Panel:
👉 https://t.me/+ueedYwwuHz45ZGQ1
          `.trim(), { parse_mode: "Markdown" });

          delete activePayment[userId];
        }
      }

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Silakan coba lagi.");
    }
  });
});

bot.onText(/\/buyptpanel1/, async (msg) => {
  const chatId = msg.chat.id;
  
  const paketList = `🛒 *PAKET PT PANEL* 🛒\n\n` +
  `Silakan pilih durasi pt panel yang ingin Anda beli:\n\n` +
  `✨ *1 MINGGU* - Rp35.000\n` +
  `✨ *1 BULAN* - Rp45.000\n` +
  `✨ *PERMANEN* - Rp55.000\n\n` +
  `Balas dengan nama durasi (contoh: "1 minggu") untuk memilih.`;

  bot.sendMessage(chatId, paketList, {parse_mode: 'Markdown'}).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;
      
      // Normalisasi input user
      const input = responseMsg.text.trim().toLowerCase();
      
      const paketAdmin = {
        "1 minggu": { name: "1 Minggu", price: 35000 },
        "1 bulan": { name: "1 Bulan", price: 45000 },
        "permanen": { name: "Permanen", price: 55000 }
      };
      
      // Cari paket yang sesuai (case-insensitive)
      const selectedKey = Object.keys(paketAdmin).find(key => 
        input.includes(key.toLowerCase())
      );
      
      if (!selectedKey) {
        return bot.sendMessage(
          chatId, 
          "❌ Pilihan tidak valid! Silakan ketik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen"
        );
      }

      const selectedPackage = paketAdmin[selectedKey];
      
      try {
        // Proses pembayaran
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;
        
        const teksPembayaran = `
▧ *INFORMASI PT PANEL*  
• ID Transaksi: ${paymentData.transactionId}  
• Durasi: ${selectedPackage.name}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Expired: 5 menit  

📌 *Catatan:*  
1. QRIS hanya berlaku 5 menit  
2. Bot akan otomatis memberi notifikasi jika berhasil  
3. Setelah pembayaran, hubungi admin untuk aktivasi  

Ketik /batalbeli untuk membatalkan transaksi.
        `;
        
        bot.sendPhoto(chatId, paymentData.qrImageUrl, { 
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        })
        .then(sentMsg => {
          // Simpan data transaksi
          const transaksi = {
            messageId: sentMsg.message_id,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            package: selectedPackage.name,
            timestamp: Date.now()
          };
          
          // Timer expired (5 menit)
          setTimeout(() => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);
          
          // Cek status pembayaran
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);
              
              if (statusRes.data.amount === transaksi.amount) {
                clearInterval(paymentCheck);
                bot.sendMessage(
                  chatId,
                  `✅ *Pembayaran Berhasil!*\n\nPt Panel ${selectedPackage.name} berhasil dibeli!\n\nSilakan hubungi @admin_username untuk proses aktivasi.`,
                  {parse_mode: 'Markdown'}
                );
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal memproses pembayaran, silakan coba lagi nanti.");
      }
    });
  });
});

bot.onText(/\/buyptpanel2/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'TanpaUsername';
  const allowedGroups = getAllowedGroups();

  // ✅ Validasi: hanya private chat ATAU grup yang diizinkan
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/buyotomatisrafaxx");
  }

  const paketList = `🛒 *PAKET PT PANEL* 🛒\n\n` +
    `Silakan pilih durasi yang ingin Anda beli:\n\n` +
    `✨ *1 MINGGU* - Rp35.000\n` +
    `✨ *1 BULAN* - Rp45.000\n` +
    `✨ *PERMANEN* - Rp55.000\n\n` +
    `Balas dengan nama durasi (contoh: "1 minggu").`;

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' });

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;
    const input = responseMsg.text.trim().toLowerCase();

    const paketPT = {
      "1 minggu": { name: "1 Minggu", price: 35000 },
      "1 bulan": { name: "1 Bulan", price: 45000 },
      "permanen": { name: "Permanen", price: 55000 }
    };

    const selectedKey = Object.keys(paketPT).find(key => input.includes(key));
    if (!selectedKey) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik: 1 minggu | 1 bulan | permanen");
    }

    const selectedPackage = paketPT[selectedKey];
    const reff = `PT-${Math.floor(Math.random() * 1000000)}`;
    const total = selectedPackage.price;

    try {
      // ✅ Buat pembayaran via Atlantik
      const paymentData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', paymentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
      }

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teks = `
📦 *PEMBELIAN PT PANEL*
━━━━━━━━━━━━━━━━━━━━━━
🛍 Paket: ${selectedPackage.name}
💰 Harga: Rp${total.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}
⏳ Waktu Bayar: 5 Menit

📷 Scan QR di atas untuk membayar
      `.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown"
      });

      activePayment[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        amount: total,
        status: true,
        timeout: setTimeout(async () => {
          if (activePayment[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS pembayaran *expired*.");
            await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });
            delete activePayment[userId];
          }
        }, 300000) // 5 menit
      };

      // ✅ Loop pengecekan status pembayaran
      while (activePayment[userId] && activePayment[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activePayment[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activePayment[userId].status = false;
          clearTimeout(activePayment[userId].timeout);
          await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });

          await bot.sendMessage(chatId, `
✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━━━━━━━━
🎉 Paket: ${selectedPackage.name}
🔗 Link Group PT Panel:
👉 https://t.me/+ueedYwwuHz45ZGQ1
          `.trim(), { parse_mode: "Markdown" });

          delete activePayment[userId];
        }
      }
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Silakan coba lagi.");
    }
  });
});

bot.onText(/^(\.|\#|\/)addbuysc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        '❌ Reply file .zip dengan perintah:\n`/savesc <harga>`',
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// ✅ 1. SIMPAN SCRIPT (savesc)
bot.onText(/^([./]{0,2})?addbuysc\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // ✅ Validasi admin
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Hanya admin yang dapat menyimpan script.');
  }

  const reply = msg.reply_to_message;
  const harga = parseInt(match[2]);

  // ✅ Validasi file .zip
  if (!reply || !reply.document || !reply.document.file_name.endsWith('.zip')) {
    return bot.sendMessage(chatId, '❌ Reply file .zip dengan perintah:\n`/savesc <harga>`', { parse_mode: 'Markdown' });
  }

  const fileId = reply.document.file_id;
  const fileName = reply.document.file_name;

  try {
    // ✅ Ambil file dari Telegram
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data);
    const base64File = fileBuffer.toString('base64');

    // ✅ Load data existing
    let scData = fs.existsSync(scFile) ? JSON.parse(fs.readFileSync(scFile)) : [];

    // ✅ Cek duplikat
    if (scData.find(sc => sc.fileName === fileName)) {
      return bot.sendMessage(chatId, `❌ File ${fileName} sudah ada.`);
    }

    // ✅ Simpan
    scData.push({ fileName, base64: base64File, harga });
    fs.writeFileSync(scFile, JSON.stringify(scData, null, 2));

    bot.sendMessage(chatId, `✅ Script *${fileName}* berhasil disimpan dengan harga Rp${toRupiah(harga)}.`, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `❌ Gagal menyimpan script: ${err.message}`);
  }
});

bot.onText(/^(\.|\#|\/)delbuysc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        '❌ Format Salah:\n/delbuysc <namafile.zip>',
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// ✅ 2. HAPUS SCRIPT (delsc)
bot.onText(/^([./]{0,2})?delbuysc\s+(.+)$/i, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Hanya admin yang dapat menghapus script.');
  }

  const namaFile = match[2].trim();
  if (!fs.existsSync(scFile)) return bot.sendMessage(chatId, '❌ Tidak ada data script.');

  let scData = JSON.parse(fs.readFileSync(scFile));
  const index = scData.findIndex(sc => sc.fileName === namaFile);

  if (index === -1) return bot.sendMessage(chatId, `❌ Script ${namaFile} tidak ditemukan.`);

  scData.splice(index, 1);
  fs.writeFileSync(scFile, JSON.stringify(scData, null, 2));

  bot.sendMessage(chatId, `✅ Script *${namaFile}* berhasil dihapus.`, { parse_mode: 'Markdown' });
});

bot.onText(/^([./]{0,2})?listbuysc$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Hanya admin yang dapat menghapus script.');
  }
  
  if (!fs.existsSync(scFile)) {
    return bot.sendMessage(chatId, '❌ Tidak ada script yang tersimpan.');
  }

  const scData = JSON.parse(fs.readFileSync(scFile));
  if (scData.length === 0) {
    return bot.sendMessage(chatId, '❌ Tidak ada script yang tersimpan.');
  }

  let text = `📜 *LIST SCRIPT TERSEDIA*\n\n`;
  scData.forEach((sc, i) => {
    text += `${i + 1}. *${sc.fileName}* - Rp${toRupiah(sc.harga)}\n`;
  });

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// ✅ COMMAND /buysc
bot.onText(/\/buysc/, async (msg) => {
  const chatId = msg.chat.id;

  if (!fs.existsSync(scFile)) {
    return bot.sendMessage(chatId, '❌ Tidak ada script tersedia.');
  }

  const scData = JSON.parse(fs.readFileSync(scFile));
  if (scData.length === 0) {
    return bot.sendMessage(chatId, '❌ Tidak ada script tersedia.');
  }

  let text = `📦 *DAFTAR SCRIPT TERSEDIA*\n\nPilih script untuk dibeli:\n\n`;
  const buttons = [];

  scData.forEach((sc, i) => {
    text += `*${i + 1}. ${sc.fileName}* - Rp${toRupiah(sc.harga)}\n`;
    buttons.push([{ text: `Beli ${sc.fileName}`, callback_data: `buy_${sc.fileName}` }]);
  });

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

// ✅ HANDLE CALLBACK
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id.toString();

  // ✅ HANDLE BATALBELI
  if (query.data === 'batalbuy') {
    if (!activeBuy[userId]) {
      return bot.answerCallbackQuery(query.id, { text: '❌ Tidak ada transaksi aktif.', show_alert: true });
    }

    try {
      await bot.deleteMessage(chatId, activeBuy[userId].msgId);
      clearTimeout(activeBuy[userId].timeout);
      delete activeBuy[userId];

      await bot.answerCallbackQuery(query.id, { text: '✅ Transaksi dibatalkan.', show_alert: true });
      await bot.sendMessage(chatId, '❌ Transaksi berhasil dibatalkan.');
    } catch (err) {
      console.error('Gagal menghapus pesan:', err);
    }
    return;
  }

  // ✅ HANDLE BELI SCRIPT
  if (query.data.startsWith('buy_')) {
    const namaFile = query.data.replace('buy_', '');
    const scData = JSON.parse(fs.readFileSync(scFile));
    const fileData = scData.find(sc => sc.fileName === namaFile);

    if (!fileData) return bot.answerCallbackQuery(query.id, { text: '❌ Script tidak ditemukan.' });

    if (activeBuy[userId]) {
      return bot.sendMessage(chatId, '❗ Masih ada transaksi aktif. Ketik `.batalbeli` untuk membatalkan.');
    }

    const harga = fileData.harga;
    const reff = `BUY-${Math.floor(Math.random() * 1000000)}`;

    try {
      const payload = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: harga,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) {
        return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
      }

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teks = `
🛒 *PEMBAYARAN SCRIPT*
━━━━━━━━━━━━━━━━━━━━━━━
📂 Script: ${namaFile}
💰 Harga: Rp${toRupiah(harga)}
🆔 Kode: ${reff}
⏰ Batas: 5 Menit
Scan QR untuk bayar.
`;

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: "❌ Batalkan", callback_data: "batalbuy" }]]
        }
      });

      activeBuy[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        namaFile,
        fileData,
        status: true,
        timeout: setTimeout(async () => {
          if (activeBuy[userId]?.status) {
            try {
              await bot.deleteMessage(chatId, activeBuy[userId].msgId);
            } catch {}
            await bot.sendMessage(chatId, "⏰ Pembayaran expired.");
            delete activeBuy[userId];
          }
        }, 300000)
      };

      // ✅ Loop cek status pembayaran
      while (activeBuy[userId] && activeBuy[userId].status) {
        await sleep(5000);
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeBuy[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        if (check?.data && check.data.status === 'success') {
          activeBuy[userId].status = false;
          clearTimeout(activeBuy[userId].timeout);

          try {
            await bot.deleteMessage(chatId, activeBuy[userId].msgId);
          } catch {}

          const buffer = Buffer.from(fileData.base64, 'base64');
          await bot.sendDocument(chatId, buffer, {}, { filename: fileData.fileName });
          await bot.sendMessage(chatId, `✅ Pembayaran berhasil!\nScript *${fileData.fileName}* telah dikirim.`, { parse_mode: 'Markdown' });

          delete activeBuy[userId];
        }
      }
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Gagal memproses pembayaran.");
    }
  }
});

bot.onText(/\/buysellersc1/, async (msg) => {
  const chatId = msg.chat.id;
  
  const paketList = `🛒 *PAKET SELLER SCRIPT* 🛒\n\n` +
  `Silakan pilih durasi seller script yang ingin Anda beli:\n\n` +
  `✨ *1 MINGGU* - Rp45.000\n` +
  `✨ *1 BULAN* - Rp55.000\n` +
  `✨ *PERMANEN* - Rp65.000\n\n` +
  `Balas dengan nama durasi (contoh: "1 minggu") untuk memilih.`;

  bot.sendMessage(chatId, paketList, {parse_mode: 'Markdown'}).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;
      
      // Normalisasi input user
      const input = responseMsg.text.trim().toLowerCase();
      
      const paketScript = {
        "1 minggu": { name: "1 Minggu", price: 45000 },
        "1 bulan": { name: "1 Bulan", price: 55000 },
        "permanen": { name: "Permanen", price: 65000 }
      };
      
      // Cari paket yang sesuai (case-insensitive)
      const selectedKey = Object.keys(paketScript).find(key => 
        input.includes(key.toLowerCase())
      );
      
      if (!selectedKey) {
        return bot.sendMessage(
          chatId, 
          "❌ Pilihan tidak valid! Silakan ketik salah satu:\n- 1 minggu\n- 1 bulan\n- permanen"
        );
      }

      const selectedPackage = paketScript[selectedKey];
      
      try {
        // Proses pembayaran
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;
        
        const teksPembayaran = `
▧ *INFORMASI SELLER SCRIPT*  
• ID Transaksi: ${paymentData.transactionId}  
• Durasi: ${selectedPackage.name}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Expired: 5 menit  

📌 *Catatan:*  
1. QRIS hanya berlaku 5 menit  
2. Bot akan otomatis memberi notifikasi jika berhasil  
3. Setelah pembayaran, hubungi admin untuk aktivasi  

Ketik /batalbeli untuk membatalkan transaksi.
        `;
        
        bot.sendPhoto(chatId, paymentData.qrImageUrl, { 
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        })
        .then(sentMsg => {
          // Simpan data transaksi
          const transaksi = {
            messageId: sentMsg.message_id,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            package: selectedPackage.name,
            timestamp: Date.now()
          };
          
          // Timer expired (5 menit)
          setTimeout(() => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);
          
          // Cek status pembayaran
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);
              
              if (statusRes.data.amount === transaksi.amount) {
                clearInterval(paymentCheck);
                bot.sendMessage(
                  chatId,
                  `✅ *Pembayaran Berhasil!*\n\nSeller Script ${selectedPackage.name} berhasil dibeli!\n\nSilakan hubungi @admin_username untuk proses aktivasi.`,
                  {parse_mode: 'Markdown'}
                );
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal memproses pembayaran, silakan coba lagi nanti.");
      }
    });
  });
});

bot.onText(/\/buysellersc2/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || 'TanpaUsername';
  const allowedGroups = getAllowedGroups();

  // ✅ Pastikan private chat atau grup yang diizinkan
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/buyotomatisrafaxx");
  }

  const paketList = `🛒 *PAKET SELLER SCRIPT* 🛒\n\n` +
    `Silakan pilih durasi yang ingin Anda beli:\n\n` +
    `✨ *1 MINGGU* - Rp45.000\n` +
    `✨ *1 BULAN* - Rp55.000\n` +
    `✨ *PERMANEN* - Rp65.000\n\n` +
    `Balas dengan nama durasi (contoh: "1 minggu").`;

  bot.sendMessage(chatId, paketList, { parse_mode: 'Markdown' });

  bot.once('message', async (responseMsg) => {
    if (responseMsg.chat.id !== chatId) return;
    const input = responseMsg.text.trim().toLowerCase();

    const paketScript = {
      "1 minggu": { name: "1 Minggu", price: 45000 },
      "1 bulan": { name: "1 Bulan", price: 55000 },
      "permanen": { name: "Permanen", price: 65000 }
    };

    const selectedKey = Object.keys(paketScript).find(key => input.includes(key));
    if (!selectedKey) {
      return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Ketik: 1 minggu | 1 bulan | permanen");
    }

    const selectedPackage = paketScript[selectedKey];
    const reff = `SELLER-${Math.floor(Math.random() * 1000000)}`;
    const total = selectedPackage.price;

    try {
      const paymentData = qs.stringify({
        api_key: settings.ApikeyAtlantic,
        reff_id: reff,
        nominal: total,
        type: 'ewallet',
        metode: 'qris'
      });

      const res = await axios.post('https://atlantich2h.com/deposit/create', paymentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = res.data;
      if (!data.status) return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);

      const info = data.data;
      const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

      const teks = `
📦 *PEMBELIAN SELLER SCRIPT*
━━━━━━━━━━━━━━━━━━━━━━
🛍 Paket: ${selectedPackage.name}
💰 Harga: Rp${total.toLocaleString('id-ID')}
🆔 Kode Transaksi: ${reff}
⏳ Waktu Bayar: 5 Menit

📷 Scan QR di atas untuk membayar
      `.trim();

      const sentMsg = await bot.sendPhoto(chatId, qrImage, {
        caption: teks,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Pembelian", callback_data: "batalbuy" }]] }
      });

      activePayment[userId] = {
        msgId: sentMsg.message_id,
        chatId,
        id: info.id,
        amount: total,
        status: true,
        timeout: setTimeout(async () => {
          if (activePayment[userId]?.status) {
            await bot.sendMessage(chatId, "⏰ QRIS pembayaran *expired*.");
            await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });
            delete activePayment[userId];
          }
        }, 300000)
      };

      while (activePayment[userId] && activePayment[userId].status) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activePayment[userId].id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

        const status = check?.data;
        if (status && status.status !== 'pending') {
          activePayment[userId].status = false;
          clearTimeout(activePayment[userId].timeout);

          await bot.deleteMessage(chatId, activePayment[userId].msgId).catch(() => { });

          await bot.sendMessage(chatId, `
✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━━━━━━━━
🎉 Paket: ${selectedPackage.name}
🔗 Link Group Seller:
👉 https://t.me/+cjYpv8uxSAUyMmE1
          `.trim(), { parse_mode: "Markdown" });

          delete activePayment[userId];
        }
      }

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Silakan coba lagi.");
    }
  });
});

bot.onText(/\/buyvps/, async (msg) => {
  const chatId = msg.chat.id;
  
  const paketList = `Silakan pilih paket VPS yang ingin Anda beli:\n\n` +
  `⚡️ r1c1: 1GB RAM, 1 Core - Rp15.000\n` +
  `⚡️ r2c1: 2GB RAM, 2 Core - Rp20.000\n` +
  `⚡️ r2c2: 2GB RAM, 2 Core - Rp25.000\n` +
  `⚡️ r4c2: 4GB RAM, 2 Core - Rp35.000\n` +
  `⚡️ r8c4: 8GB RAM, 4 Core - Rp55.000\n` +
  `⚡️ r16c4: 16GB RAM, 4 Core - Rp65.000\n` +
  `⚡️ r32c8: 32GB RAM, 8 Core - Rp85.000\n\n` +
  `Balas dengan kode paket (contoh: "r1c1") untuk memilih.`;

  bot.sendMessage(chatId, paketList).then(() => {
    bot.once('message', async (responseMsg) => {
      if (responseMsg.chat.id !== chatId) return;
      
      const pilihan = responseMsg.text.trim().toLowerCase();
      const paket = {
        "r1c1": { ram: "1GB", core: 1, price: 15000 },
        "r2c1": { ram: "2GB", core: 2, price: 20000 },
        "r2c2": { ram: "2GB", core: 2, price: 25000 },
        "r4c2": { ram: "4GB", core: 2, price: 35000 },
        "r8c4": { ram: "8GB", core: 4, price: 55000 },
        "r16c4": { ram: "16GB", core: 4, price: 65000 },
        "r32c8": { ram: "32GB", core: 8, price: 85000 }
      };
      
      const selectedPackage = paket[pilihan];
      if (!selectedPackage) {
        return bot.sendMessage(chatId, "❌ Pilihan tidak valid! Silakan ketik kode paket sesuai daftar (contoh: r1c1)");
      }

      try {
        // Create payment
        const paymentUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/createpayment?apikey=${apiSimpleBot}&amount=${selectedPackage.price}&codeqr=${qrisOrderKuota}`;
        const paymentRes = await axios.get(paymentUrl);
        const paymentData = paymentRes.data.result;
        
        const teksPembayaran = `
▧ INFORMASI PEMBAYARAN  
• ID: ${paymentData.transactionId}  
• Total: Rp${selectedPackage.price.toLocaleString('id-ID')}  
• Paket: VPS ${selectedPackage.ram} RAM, ${selectedPackage.core} Core  
• Expired: 5 menit  

*Catatan:*  
QRIS hanya berlaku 5 menit.  
Bot akan otomatis memberi notifikasi jika berhasil.  

Ketik /batalbeli untuk membatalkan.
        `;
        
        bot.sendPhoto(chatId, paymentData.qrImageUrl, { 
          caption: teksPembayaran,
          parse_mode: 'Markdown'
        })
        .then(sentMsg => {
          // Simpan data transaksi
          const transaksi = {
            messageId: sentMsg.message_id,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount,
            package: `${selectedPackage.ram} RAM, ${selectedPackage.core} Core`,
            timestamp: Date.now()
          };
          
          // Timer expired (5 menit)
          setTimeout(async () => {
            bot.sendMessage(chatId, "⏳ QR Code telah expired!");
            bot.deleteMessage(chatId, sentMsg.message_id);
          }, 300000);
          
          // Cek status pembayaran setiap 15 detik
          const paymentCheck = setInterval(async () => {
            try {
              const statusUrl = `https://restapi.rafatharcode.apibotwa.biz.id/api/orkut/cekstatus?apikey=${apiSimpleBot}&merchant=${merchantIdOrderKuota}&keyorkut=${apiOrderKuota}`;
              const statusRes = await axios.get(statusUrl);
              
              if (statusRes.data.amount === transaksi.amount) {
                clearInterval(paymentCheck);
                bot.sendMessage(
                  chatId,
                  `✅ Pembayaran berhasil!\nSegera hubungi owner untuk VPS ${selectedPackage.ram} RAM, ${selectedPackage.core} Core Anda.`
                );
              }
            } catch (error) {
              console.error("Error cek status:", error);
            }
          }, 15000);
        });
      } catch (error) {
        console.error("Error membuat pembayaran:", error);
        bot.sendMessage(chatId, "⚠️ Gagal membuat pembayaran, coba lagi nanti.");
      }
    });
  });
});

bot.onText(/\/batalbeli/, (msg) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message; // Ambil pesan yang di-reply user

  // Jika user membalas pesan tertentu
  if (reply) {
    bot.sendMessage(
      chatId,
      "✅ Pembelian berhasil dibatalkan.",
      { reply_to_message_id: reply.message_id } // Balas pesan yang di-reply user
    );
  } else {
    // Jika tidak ada pesan yang di-reply
    bot.sendMessage(
      chatId,
      "ℹ️ Silakan balas pesan pembelian yang ingin dibatalkan.",
      { reply_to_message_id: msg.message_id } // Balas pesan perintah /batalbeli
    );
  }
});

bot.onText(/^(\.|\#|\/)pin$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const replyMsg = msg.reply_to_message;

  // Cek akses owner
  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  if (!replyMsg) {
    return bot.sendMessage(chatId, '⚠️ Reply dulu ke pesan yang ingin disematkan, lalu gunakan perintah /pin');
  }

  try {
    await bot.pinChatMessage(chatId, replyMsg.message_id);
    bot.sendMessage(chatId, '✅ Pesan berhasil disematkan.', {
      reply_to_message_id: replyMsg.message_id
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Gagal menyematkan pesan. Pastikan bot memiliki izin.');
  }
});

bot.onText(/^(\.|\#|\/)unpin$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const replyMsg = msg.reply_to_message;

  // Cek akses owner
  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  if (!replyMsg) {
    return bot.sendMessage(chatId, '⚠️ Reply ke pesan yang ingin di.lepas sematkan, lalu gunakan perintah /unpin');
  }

  try {
    await bot.unpinChatMessage(chatId, { message_id: replyMsg.message_id });
    bot.sendMessage(chatId, '✅ Pesan berhasil dilepas dari pin.', {
      reply_to_message_id: replyMsg.message_id
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Gagal melepas pin. Mungkin pesan tersebut tidak sedang disematkan atau bot kurang izin.');
  }
});

// Add command handler with admin check
bot.onText(/^(\.|\#|\/)spekvps$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message;

  // Admin verification
  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id }
    );
  }

  try {
    const timestamp = Date.now();
    const tot = await nou.drive.info();
    const latensi = Date.now() - timestamp;

    // Memory formatting function
    const formatp = (bytes) => (bytes / 1024 ** 3).toFixed(2) + ' GB';

    const spekvps = `
🔴 Informasi Server:

🖥️ Platform: ${os.type()}
💾 Total RAM: ${formatp(os.totalmem())}
🗄️ Total Disk: ${tot.totalGb} GB
⚙️ Total CPU: ${os.cpus().length} Core
⚡ Respon Speed: ${latensi} ms
🤖 Runtime Vps: ${runtime(os.uptime())}
⏲️ Runtime Bot: ${getRuntime(startTime)}
    `.trim();

    bot.sendMessage(chatId, spekvps);
  } catch (error) {
    console.error('Server info error:', error);
    bot.sendMessage(chatId, '❌ Gagal mengambil data server', { reply_to_message_id: msg.message_id });
  }
});

bot.onText(/^(\.|\#|\/)broadcast$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Cek apakah pengguna adalah admin
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.');
  }

  // Ambil pesan yang dibalas
  const reply = msg.reply_to_message;
  if (!reply) {
    return bot.sendMessage(chatId, '❌ Harap reply ke pesan yang ingin di-broadcast.');
  }

  const message = reply.text || reply.caption || '[Pesan tidak mendukung teks]';

  const allUsers = Array.from(users);
  let successCount = 0;
  let failedCount = 0;

  // Kirim ke semua pengguna
  for (const user of allUsers) {
    try {
      if (reply.photo) {
        const fileId = reply.photo[reply.photo.length - 1].file_id;
        await bot.sendPhoto(user, fileId, { caption: message });
      } else if (reply.video) {
        const fileId = reply.video.file_id;
        await bot.sendVideo(user, fileId, { caption: message });
      } else {
        await bot.sendMessage(user, message);
      }
      successCount++;
    } catch (error) {
      console.error(`Gagal mengirim ke ${user}:`, error);
      failedCount++;
      users.delete(user); // Hapus user yang tidak valid
    }
  }

  // Laporkan hasil ke admin
  bot.sendMessage(
    chatId,
    `✅ Broadcast selesai!\n\n📬 Terkirim: ${successCount}\n❌ Gagal: ${failedCount}\nTotal: ${users.size}`
  );
});

bot.onText(/^(\.|\#|\/)bcgc$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message; // Mendapatkan pesan yang di-reply

  // Cek admin dan reply dengan pesan error
  if (!adminId.includes(userId)) {
    return bot.sendMessage(
      chatId,
      '❌ Akses ditolak! Hanya developer yang dapat menggunakan perintah ini.',
      { reply_to_message_id: msg.message_id } // Balas pesan asli user
    );
  }

  // Kirim instruksi format error sebagai reply
  bot.sendMessage(
    chatId,
    `Format salah. Contoh: /bcgc <pesan mu>`,
    { reply_to_message_id: msg.message_id } // Balas pesan asli user
  );
});

// Perintah broadcast
bot.onText(/^(\.|\#|\/)bcgc (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Cek apakah pengguna adalah admin
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.');
  }

  const message = match[2]; // Pesan dari admin
  const allUsers = Array.from(users);
  let successCount = 0;
  let failedCount = 0;

  // Kirim ke semua pengguna
  for (const user of allUsers) {
    try {
      await bot.sendMessage(user, `${message}`);
      successCount++;
    } catch (error) {
      console.error(`Gagal mengirim ke ${user}:`, error);
      failedCount++;
      users.delete(user); // Hapus user yang tidak valid
    }
  }

  // Laporkan hasil ke admin
  bot.sendMessage(
    chatId,
    `✅ Broadcast berhasil dikirim!\n\n` +
    `📬 Terkirim: ${successCount} pengguna\n` +
    `❌ Gagal: ${failedCount} pengguna\n` +
    `Total penerima: ${users.size} pengguna`
  );
});
  
bot.onText(/\/tiktok (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1]; // Mengambil teks setelah perintah /tt

    if (!text.startsWith("https://")) {
        return bot.sendMessage(chatId, "Masukkan URL TikTok yang valid!");
    }

    try {
        bot.sendMessage(chatId, "⏳ Proses Kakkk");

        const result = await tiktokDl(text);

        if (!result.status) {
            return bot.sendMessage(chatId, "Terjadi kesalahan saat memproses URL!");
        }

        if (result.durations === 0 && result.duration === "0 Seconds") {
            let mediaArray = [];

            for (let i = 0; i < result.data.length; i++) {
                const a = result.data[i];
                mediaArray.push({
                    type: 'photo',
                    media: a.url,
                    caption: `Foto Slide Ke ${i + 1}`
                });
            }

            return bot.sendMediaGroup(chatId, mediaArray);
        } else {
            const video = result.data.find(e => e.type === "nowatermark_hd" || e.type === "nowatermark");
            if (video) {
                return bot.sendVideo(chatId, video.url, { caption: "TikTok Downloader BY RafatharCode" });
            }
        }
    } catch (e) {
        console.error(e);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memproses permintaan.");
    }
});

bot.onText(/^(\.|\#|\/)chat$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/chat <teksmu>,<idtelemu>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)chat\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Cek apakah user adalah admin/owner
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }

  const input = match[2];
  const reply = msg.reply_to_message;

  // Pisahkan teks dan idTelegram berdasarkan koma
  const [pesan, idTujuan] = input.split(',');

  // Cek jika input tidak sesuai format
  if (!pesan || !idTujuan) {
    return bot.sendMessage(chatId, `❌ Format salah!\nContoh: /chat teksmu,123456789`, {
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    await bot.sendMessage(idTujuan.trim(), pesan.trim());
    await bot.sendMessage(chatId, `✅ Pesan berhasil dikirim ke ID ${idTujuan.trim()}`, {
      reply_to_message_id: msg.message_id,
    });
  } catch (error) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim pesan ke ID ${idTujuan.trim()}\nError: ${error.message}`, {
      reply_to_message_id: msg.message_id,
    });
  }
});

// Command: /savefile → reply file zip → simpan dalam settingfile
bot.onText(/^(\.|\#|\/)addsc$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const reply = msg.reply_to_message;
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }

  // Validasi: harus reply file zip
  if (!reply || !reply.document || !reply.document.file_name.endsWith('.zip')) {
    return bot.sendMessage(chatId, '❌ Format salah!\nReply file .zip dengan command /addsc', {
      reply_to_message_id: msg.message_id
    });
  }

  const fileId = reply.document.file_id;
  const fileName = reply.document.file_name;

  try {
    // Ambil link file
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    // Unduh file sebagai buffer
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data);

    // Encode ke base64 dan simpan ke ./settingfile
    const data = {
      fileName,
      base64: fileBuffer.toString('base64')
    };

    fs.writeFileSync("./settingfile.json", JSON.stringify(data, null, 2));
    bot.sendMessage(chatId, `✅ File ${fileName} berhasil disimpan ke settingfile!`, {
      reply_to_message_id: msg.message_id
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal menyimpan file: ${error.message}`);
  }
});

bot.onText(/^(\.|\#|\/)addbelisc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\nReply file.zip dengan command /addbelisc namafilemu.zip,harga`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)addbelisc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const input = match[2].trim();
  const reply = msg.reply_to_message;

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }

  // Validasi input dan reply file
  const [namaFile, harga] = input.split(",");
  if (!reply || !reply.document || !reply.document.file_name.endsWith('.zip')) {
    return bot.sendMessage(chatId, '❌ Format salah!\nReply file .zip dengan command /addbelisc namafile.zip,harga', {
      reply_to_message_id: msg.message_id
    });
  }

  if (!namaFile || !harga || isNaN(harga)) {
    return bot.sendMessage(chatId, '❌ Format input salah!\nContoh: /addbelisc namafile.zip,25000', {
      reply_to_message_id: msg.message_id
    });
  }

  const fileId = reply.document.file_id;

  try {
    // Ambil file dan encode base64
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data);
    const base64 = fileBuffer.toString('base64');

    // Baca data settingfile jika ada
    let settingData = [];
    if (fs.existsSync('./settingfile2.json')) {
      settingData = JSON.parse(fs.readFileSync('./settingfile2.json'));
      if (!Array.isArray(settingData)) settingData = [];
    }

    // Cek jika file dengan nama sama sudah ada
    const alreadyExists = settingData.find(sc => sc.fileName === namaFile);
    if (alreadyExists) {
      return bot.sendMessage(chatId, `❌ File dengan nama *${namaFile}* sudah ada di settingfile!`, {
        reply_to_message_id: msg.message_id
      });
    }

    // Simpan file baru ke array
    settingData.push({
      fileName: namaFile,
      harga: parseInt(harga),
      base64
    });

    fs.writeFileSync('./settingfile2.json', JSON.stringify(settingData, null, 2));
    bot.sendMessage(chatId, `✅ File *${namaFile}* berhasil ditambahkan ke settingfile dengan harga Rp${harga.toLocaleString('id-ID')}!`, {
      reply_to_message_id: msg.message_id
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal menyimpan file: ${error.message}`);
  }
});

bot.onText(/^(\.|\#|\/)delsc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delsc <namafilemu.zip>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// Command: /deletefile namafile.zip
bot.onText(/^(\.|\#|\/)delsc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const inputFileName = match[2].trim();

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    // Cek apakah settingfile ada
    if (!fs.existsSync('./settingfile.json')) {
      return bot.sendMessage(chatId, '❌ Tidak ada file yang disimpan.');
    }

    // Baca isi settingfile
    const data = JSON.parse(fs.readFileSync('./settingfile.json', 'utf-8'));

    // Cek apakah nama file cocok
    if (data.fileName !== inputFileName) {
      return bot.sendMessage(chatId, `❌ Nama file tidak cocok!\nTersimpan: ${data.fileName}`);
    }

    // Hapus settingfile
    fs.unlinkSync('./settingfile.json');
    bot.sendMessage(chatId, `✅ File ${inputFileName} berhasil dihapus dari settingfile.`);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal menghapus file: ${error.message}`);
  }
});

bot.onText(/^(\.|\#|\/)delbelisc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delbelisc <namafilemu.zip>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)delbelisc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const namaFile = match[2].trim();

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menghapus script.', {
      reply_to_message_id: msg.message_id,
    });
  }

  if (!fs.existsSync('./settingfile2.json')) {
    return bot.sendMessage(chatId, '❌ Tidak ada data script yang tersimpan.');
  }

  // Baca file settingfile
  let settingData = JSON.parse(fs.readFileSync('./settingfile2.json'));
  if (!Array.isArray(settingData)) settingData = [];

  // Cari script berdasarkan fileName
  const index = settingData.findIndex(sc => sc.fileName === namaFile);
  if (index === -1) {
    return bot.sendMessage(chatId, `❌ Script ${namaFile} tidak ditemukan di settingfile.`, {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown"
    });
  }

  // Hapus dan simpan ulang
  settingData.splice(index, 1);
  fs.writeFileSync('./settingfile2.json', JSON.stringify(settingData, null, 2));

  bot.sendMessage(chatId, `✅ Script ${namaFile} berhasil dihapus dari settingfile.`, {
    reply_to_message_id: msg.message_id,
    parse_mode: "Markdown"
  });
});

bot.onText(/^(\.|\#|\/)getsc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/getsc <namafilemu.zip>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// Command: /getsc namafile.zip
bot.onText(/^(\.|\#|\/)getsc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const inputFileName = match[2].trim();

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }

  try {
    // Cek apakah file settingfile.json ada
    if (!fs.existsSync('./settingfile.json')) {
      return bot.sendMessage(chatId, '❌ Tidak ada file yang tersimpan!');
    }

    // Baca dan parse file
    const rawData = fs.readFileSync('./settingfile.json');
    const data = JSON.parse(rawData);

    // Cek apakah file name cocok
    if (data.fileName !== inputFileName) {
      return bot.sendMessage(chatId, `❌ File "${inputFileName}" tidak ditemukan di settingfile.json`);
    }

    // Decode base64 ke buffer
    const fileBuffer = Buffer.from(data.base64, 'base64');

    // Kirim file ke pengguna
    await bot.sendDocument(chatId, fileBuffer, {}, {
      filename: data.fileName,
      contentType: 'application/zip'
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengambil file: ${error.message}`);
  }
});

// Command: /listfile
bot.onText(/^(\.|\#|\/)listsc$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.', {
      reply_to_message_id: msg.message_id,
    });
  }
  
  try {
    // Cek apakah file settingfile ada
    if (!fs.existsSync('./settingfile.json')) {
      return bot.sendMessage(chatId, '📂 Tidak ada file yang tersimpan.');
    }

    // Baca dan tampilkan nama file
    const data = JSON.parse(fs.readFileSync('./settingfile.json', 'utf-8'));

    if (!data.fileName) {
      return bot.sendMessage(chatId, '⚠️ Script tersimpan tidak valid.');
    }

    bot.sendMessage(chatId, `📁 Script tersimpan:\n- ${data.fileName}`);
    
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal membaca file: ${error.message}`);
  }
});

bot.onText(/^(\.|\#|\/)getbelisc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/getbelisc <namafilemu.zip>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
// Command: /getsc namafile.zip
bot.onText(/^(\.|\#|\/)getbelisc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const namaFile = match[2].trim();

  if (!adminId.includes(userId)) {
    return bot.sendMessage(chatId, '❌ Akses ditolak! Hanya admin yang dapat menggunakan perintah ini.');
  }

  if (!fs.existsSync('./settingfile2.json')) {
    return bot.sendMessage(chatId, '❌ Tidak ada data file tersimpan.');
  }

  const settingData = JSON.parse(fs.readFileSync('./settingfile2.json'));
  const fileData = settingData.find(sc => sc.fileName === namaFile);

  if (!fileData) {
    return bot.sendMessage(chatId, `❌ File ${namaFile} tidak ditemukan.`, { parse_mode: "Markdown" });
  }

  const buffer = Buffer.from(fileData.base64, 'base64');
  bot.sendDocument(chatId, buffer, {}, { filename: fileData.fileName });
});

bot.onText(/^(\.|\#|\/)belisc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\nKetik /listbelisc untuk melihat daftar list sc yang tersedia.\nLalu ketik: /belisc <namafilemu.zip>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)belisc\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const namaFile = match[2].trim();

  if (!fs.existsSync('./settingfile2.json')) {
    return bot.sendMessage(chatId, '❌ Tidak ada data file tersimpan.');
  }

  const settingData = JSON.parse(fs.readFileSync('./settingfile2.json'));
  const fileData = settingData.find(sc => sc.fileName === namaFile);

  if (!fileData) {
    return bot.sendMessage(chatId, `❌ File *${namaFile}* tidak ditemukan.`, { parse_mode: "Markdown" });
  }

  // Cek apakah pengguna punya saldo cukup
  const harga = parseInt(fileData.harga);
  const saldoUser = cekSaldo(userId, db_saldo);

  if (saldoUser < harga) {
    return bot.sendMessage(chatId, `Maaf @${userId}, sepertinya saldo kamu kurang dari Rp${harga.toLocaleString('id-ID')}\nSilahkan /topupsaldo terlebih dahulu sebelum membeli.\n\nAtau Hubungi Developer Kami!\nDeveloper:\nt.me/Ranzneweraa`, {
      parse_mode: "Markdown",
    });
  }

  // Kirim file dan potong saldo
  const buffer = Buffer.from(fileData.base64, 'base64');
  bot.sendDocument(chatId, buffer, {}, { filename: fileData.fileName }).then(() => {
    minSaldo(userId, harga, db_saldo);
    bot.sendMessage(chatId, `✅ Berhasil membeli ${fileData.fileName} seharga Rp${harga.toLocaleString('id-ID')}.\nSisa saldo: Rp${cekSaldo(userId, db_saldo).toLocaleString('id-ID')}\nCek Saldo Anda:\n/ceksaldo <idtelemu>`, {
      parse_mode: "Markdown",
    });
  });
});

bot.onText(/^(\.|\#|\/)listbelisc$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!fs.existsSync('./settingfile2.json')) {
    return bot.sendMessage(chatId, '❌ Tidak ada script tersimpan.');
  }

  const settingData = JSON.parse(fs.readFileSync('./settingfile2.json'));
  if (!Array.isArray(settingData) || settingData.length === 0) {
    return bot.sendMessage(chatId, '❌ Belum ada script yang tersedia.');
  }

  const list = settingData.map((sc, i) => `📦 *${i + 1}. ${sc.fileName}* - Rp${sc.harga.toLocaleString('id-ID')}`).join('\n');
  bot.sendMessage(chatId, `📄 Daftar Script Tersedia:\n\n${list}`, { parse_mode: "Markdown" });
});

bot.onText(/^(\.|\#|\/)infogempa$/, async (msg) => {
  const chatId = msg.chat.id;
  const targetMessageId = msg.message_id;

  bot.sendMessage(chatId, "⏳ Sedang mengambil data gempa terkini...", {
    reply_to_message_id: targetMessageId
  });

  try {
    const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await response.json();

    if (!data || !data.Infogempa || !data.Infogempa.gempa) {
      return bot.sendMessage(chatId, "❌ Gagal mendapatkan data gempa dari BMKG.", {
        reply_to_message_id: targetMessageId
      });
    }

    const gempa = data.Infogempa.gempa;

    let caption = `*📈 INFO GEMPA TERKINI*\n\n`;
    caption += `*Tanggal:* ${gempa.Tanggal}\n`;
    caption += `*Waktu:* ${gempa.Jam}\n`;
    caption += `*Magnitudo:* ${gempa.Magnitude}\n`;
    caption += `*Kedalaman:* ${gempa.Kedalaman}\n`;
    caption += `*Lokasi:* ${gempa.Wilayah}\n`;
    caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`;
    caption += `*Potensi:* ${gempa.Potensi}\n`;
    caption += `*Dirasakan:* ${gempa.Dirasakan}\n\n`;
    caption += `Sumber: BMKG (https://www.bmkg.go.id/)`;

    if (gempa.Shakemap) {
      const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
      await bot.sendPhoto(chatId, shakemapUrl, {
        caption: caption,
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, caption, {
        reply_to_message_id: targetMessageId,
        parse_mode: "Markdown"
      });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengambil data gempa.", {
      reply_to_message_id: targetMessageId
    });
  }
});

// Handler untuk perintah /infocuaca
bot.onText(/^(\.|\#|\/)infocuaca\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const text = match[2]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, '*Silakan berikan lokasi yang ingin dicek cuacanya!*\n\nContoh: /infocuaca Jakarta', {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }

    try {
        let wdata = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&lang=id`
        );

        let textw = "";
        textw += `*🗺️ Cuaca di ${wdata.data.name}, ${wdata.data.sys.country}*\n\n`;
        textw += `*🌤️ Cuaca:* ${wdata.data.weather[0].main}\n`;
        textw += `*📖 Deskripsi:* ${wdata.data.weather[0].description}\n`;
        textw += `*🌡️ Suhu Rata-rata:* ${wdata.data.main.temp}°C\n`;
        textw += `*🤒 Terasa Seperti:* ${wdata.data.main.feels_like}°C\n`;
        textw += `*🌬️ Tekanan Udara:* ${wdata.data.main.pressure} hPa\n`;
        textw += `*💧 Kelembaban:* ${wdata.data.main.humidity}%\n`;
        textw += `*🌪️ Kecepatan Angin:* ${wdata.data.wind.speed} m/s\n`;
        textw += `*📍 Latitude:* ${wdata.data.coord.lat}\n`;
        textw += `*📍 Longitude:* ${wdata.data.coord.lon}\n`;

        bot.sendMessage(chatId, textw, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        bot.sendMessage(chatId, '*Terjadi kesalahan! Pastikan lokasi yang Anda masukkan benar.*', {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }
});

bot.onText(/^(\.|\#|\/)sifat\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const text = match[2]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, `📌 Contoh: /sifat Rafa, 7, 7, 2005`, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }

    try {
        const [nama, tgl, bln, thn] = text.split(',').map(v => v.trim());
        if (!nama || !tgl || !bln || !thn) {
            return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh: /sifat Rafa, 7, 7, 2005`, {
                reply_to_message_id: reply?.message_id || msg.message_id,
                parse_mode: 'Markdown'
            });
        }

        const anu = await primbon.sifat_karakter_tanggal_lahir(nama, tgl, bln, thn);
        if (!anu.status) {
            return bot.sendMessage(chatId, `❌ ${anu.message}`, {
                reply_to_message_id: reply?.message_id || msg.message_id
            });
        }

        const { nama: nm, tgl_lahir, garis_hidup } = anu.message;

        const hasil = 
            `• *Nama:* ${nm}\n` +
            `• *Tanggal Lahir:* ${tgl_lahir}\n` +
            `• *Garis Hidup:* ${garis_hidup}`;

        return bot.sendMessage(chatId, hasil, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan.', {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }
});

bot.onText(/^(\.|\#|\/)zodiak\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const text = match[2]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, `📅 Contoh: /zodiak 4 7 2005\n\nFormat:\n/zodiak [tanggal] [bulan] [tahun]`, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }

    const argsZodiak = text.split(/[\s/]+/);
    if (argsZodiak.length < 3) {
        return bot.sendMessage(chatId, `❌ Masukkan format yang benar: /zodiak [tanggal] [bulan] [tahun]`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    let [tanggal, bulan, tahun] = argsZodiak.map(v => parseInt(v));
    if (isNaN(tanggal) || isNaN(bulan) || isNaN(tahun)) {
        return bot.sendMessage(chatId, `❌ Format harus berupa angka, contoh:\n/zodiak 4 7 2005`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    if (bulan < 1 || bulan > 12 || tanggal < 1 || tanggal > 31) {
        return bot.sendMessage(chatId, `❌ Tanggal tidak valid.`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    const zodiacData = [
        { sign: "Capricorn", start: [12, 22], end: [1, 19], pasangan: "Taurus, Virgo", elemen: "Tanah", warna: "Coklat, Hitam", batu: "Garnet", sifat: "Ambisius, Praktis", karakter: "Tegas, Pekerja keras, Disiplin" },
        { sign: "Aquarius", start: [1, 20], end: [2, 18], pasangan: "Gemini, Libra", elemen: "Udara", warna: "Biru, Perak", batu: "Amethyst", sifat: "Mandiri, Unik", karakter: "Inovatif, Kritis, Humanis" },
        { sign: "Pisces", start: [2, 19], end: [3, 20], pasangan: "Cancer, Scorpio", elemen: "Air", warna: "Ungu, Hijau laut", batu: "Aquamarine", sifat: "Sensitif, Imajinatif", karakter: "Empatik, Penyayang, Artistik" },
        { sign: "Aries", start: [3, 21], end: [4, 19], pasangan: "Leo, Sagitarius", elemen: "Api", warna: "Merah", batu: "Diamond", sifat: "Berani, Enerjik", karakter: "Tegas, Antusias, Impulsif" },
        { sign: "Taurus", start: [4, 20], end: [5, 20], pasangan: "Virgo, Capricorn", elemen: "Tanah", warna: "Hijau, Pink", batu: "Emerald", sifat: "Stabil, Sabar", karakter: "Romantis, Setia, Keras kepala" },
        { sign: "Gemini", start: [5, 21], end: [6, 20], pasangan: "Libra, Aquarius", elemen: "Udara", warna: "Kuning, Hijau muda", batu: "Agate", sifat: "Ceria, Pintar berbicara", karakter: "Cepat belajar, Adaptif, Rasa ingin tahu tinggi" },
        { sign: "Cancer", start: [6, 21], end: [7, 22], pasangan: "Scorpio, Pisces", elemen: "Air", warna: "Putih, Perak", batu: "Moonstone", sifat: "Emosional, Protektif", karakter: "Penyayang, Intuitif, Sensitif" },
        { sign: "Leo", start: [7, 23], end: [8, 22], pasangan: "Aries, Sagitarius", elemen: "Api", warna: "Emas, Jingga", batu: "Ruby", sifat: "Pemimpin, Percaya diri", karakter: "Kharismatik, Loyal, Dominan" },
        { sign: "Virgo", start: [8, 23], end: [9, 22], pasangan: "Taurus, Capricorn", elemen: "Tanah", warna: "Abu-abu, Kuning", batu: "Sapphire", sifat: "Perfeksionis, Teliti", karakter: "Analitis, Realistis, Cerdas" },
        { sign: "Libra", start: [9, 23], end: [10, 22], pasangan: "Gemini, Aquarius", elemen: "Udara", warna: "Biru, Pink", batu: "Opal", sifat: "Harmonis, Adil", karakter: "Diplomatis, Romantis, Mudah bimbang" },
        { sign: "Scorpio", start: [10, 23], end: [11, 21], pasangan: "Cancer, Pisces", elemen: "Air", warna: "Merah tua, Hitam", batu: "Topaz", sifat: "Misterius, Intens", karakter: "Penuh gairah, Setia, Kuat tekad" },
        { sign: "Sagitarius", start: [11, 22], end: [12, 21], pasangan: "Aries, Leo", elemen: "Api", warna: "Ungu, Merah", batu: "Turquoise", sifat: "Petualang, Optimis", karakter: "Jujur, Filosofis, Bebas" },
    ];

    function getZodiac(d, m) {
        for (let z of zodiacData) {
            let [startM, startD] = z.start;
            let [endM, endD] = z.end;
            if ((m === startM && d >= startD) || (m === endM && d <= endD)) return z;
        }
        return null;
    }

    function getWeton(day, month, year) {
        const wetonNames = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
        const date = new Date(year, month - 1, day);
        const baseDate = new Date(1900, 0, 1); // 1 Jan 1900 = Senin Legi
        const selisihHari = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        const wetonIndex = selisihHari % 5;
        const hari = date.toLocaleDateString("id-ID", { weekday: 'long' });
        const weton = wetonNames[(wetonIndex + 5) % 5];
        return `${hari} ${weton}`;
    }

    const zodiacInfo = getZodiac(tanggal, bulan);
    if (!zodiacInfo) {
        return bot.sendMessage(chatId, `❌ Zodiak tidak ditemukan.`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    const birthDate = `${tanggal}/${bulan}/${tahun}`;
    const weton = getWeton(tanggal, bulan, tahun);

    const message = `📝 *ZODIAK ANDA:*
🗓️ Tanggal Lahir: *${birthDate}*
📆 Weton: *${weton}*
🔮 Zodiak: *${zodiacInfo.sign}*
💞 Pasangan Cocok: *${zodiacInfo.pasangan}*
🌱 Elemen: *${zodiacInfo.elemen}*
🎨 Warna Keberuntungan: *${zodiacInfo.warna}*
💎 Batu Keberuntungan: *${zodiacInfo.batu}*
✨ Sifat: *${zodiacInfo.sifat}*
🧠 Karakter: *${zodiacInfo.karakter}*`;

    bot.sendMessage(chatId, message, {
        reply_to_message_id: reply?.message_id || msg.message_id,
        parse_mode: 'Markdown'
    });
});

bot.onText(/^(\.|\#|\/)artinama\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const text = match[2]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, `🔍 Contoh: /artinama RafatharCode`, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }

    try {
        const anu = await primbon.arti_nama(text);
        if (!anu.status) {
            return bot.sendMessage(chatId, `❌ ${anu.message}`, {
                reply_to_message_id: reply?.message_id || msg.message_id
            });
        }

        const { nama, arti, catatan } = anu.message;

        const hasil = 
            `• *Nama:* ${nama}\n` +
            `• *Arti:* ${arti}\n` +
            `• *Catatan:* ${catatan}`;

        return bot.sendMessage(chatId, hasil, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan.', {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }
});

bot.onText(/^(\.|#|\/)doxip\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const text = match[2]?.trim();

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!text) {
        return bot.sendMessage(chatId, `📌 *Example:* /doxip 112.90.150.204`, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });
    }

    try {
        const res = await fetch(`https://ipwho.is/${text}`);
        const data = await res.json();

        if (!data.success) {
            return bot.sendMessage(chatId, `❌ Gagal mendapatkan data untuk IP *${text}*:\n_${data.message || 'Alamat IP tidak valid atau tidak ditemukan.'}_`, {
                reply_to_message_id: reply?.message_id || msg.message_id,
                parse_mode: 'Markdown'
            });
        }

        const formatIPInfo = (info) => {
            return `
*📡 IP Information*
• IP: ${info.ip}
• Type: ${info.type}
• Country: ${info.country} (${info.country_code})
• Region: ${info.region} (${info.region_code})
• City: ${info.city}
• Latitude: ${info.latitude}
• Longitude: ${info.longitude}
• ISP: ${info.connection?.isp || 'N/A'}
• Organization: ${info.connection?.org || 'N/A'}
• ASN: ${info.connection?.asn || 'N/A'}
• Timezone: ${info.timezone?.id || 'N/A'} (${info.timezone?.utc || ''})
• Current Time: ${info.timezone?.current_time || 'N/A'}
• Flag: ${info.flag?.emoji || 'N/A'}
`;
        };

        // Kirim lokasi jika ada
        if (data.latitude && data.longitude) {
            await bot.sendLocation(chatId, data.latitude, data.longitude, {
                reply_to_message_id: reply?.message_id || msg.message_id
            });

            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Kirim info IP
        return bot.sendMessage(chatId, formatIPInfo(data), {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });

    } catch (err) {
        return bot.sendMessage(chatId, `❌ Terjadi kesalahan saat memproses IP ${text}:\n${err.message}`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }
});

bot.onText(/^(\.|#|\/)nikktp\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const q = match[2]?.trim();

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!q) {
        return bot.sendMessage(chatId, `</> Anda harus mendapatkan NIK target terlebih dahulu dan lakukan command seperti ini:\n\n/nikktp 16070xxxxx`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    try {
        const { nikParser } = require('nik-parser');
        const ktp = q;
        const nik = nikParser(ktp);

        const provinsi = nik.province();
        const kabupaten = nik.kabupatenKota();
        const kecamatan = nik.kecamatan();

        const mapsQuery = `${kecamatan}, ${kabupaten}, ${provinsi}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

        const result = `🆔 *Informasi NIK:*
• Valid: ${nik.isValid()}
• Provinsi ID: ${nik.provinceId()}
• Nama Provinsi: ${provinsi}
• Kabupaten ID: ${nik.kabupatenKotaId()}
• Nama Kabupaten: ${kabupaten}
• Kecamatan ID: ${nik.kecamatanId()}
• Nama Kecamatan: ${kecamatan}
• Kode Pos: ${nik.kodepos()}
• Jenis Kelamin: ${nik.kelamin()}
• Tanggal Lahir: ${nik.lahir()}
• Uniqcode: ${nik.uniqcode()}`;

        // Kirim pesan informasi
        await bot.sendMessage(chatId, result, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📍 Lihat Lokasi di Maps', url: mapsUrl }]
                ]
            }
        });

        // Kirim lokasi ke chat (asumsi lokasi diambil dari nama kecamatan saja)
        const location = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapsQuery)}`)
            .then(res => res.json());

        if (location?.[0]) {
            const lat = parseFloat(location[0].lat);
            const lon = parseFloat(location[0].lon);

            await bot.sendLocation(chatId, lat, lon);
        }

    } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, `❌ Error: NIK tidak valid atau parsing gagal!`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }
});

bot.onText(/^(\.|#|\/)doxktp\s?(.*)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const q = match[2]?.trim();
   
    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    if (!q) {
        return bot.sendMessage(chatId, `</> Anda harus mendapatkan NIK target terlebih dahulu dan lakukan command seperti ini:\n\n/doxktp 16070xxxxx`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }

    try {
        const { nikParser } = require('nik-parser');
        const ktp = q;
        const nik = nikParser(ktp);

        const provinsi = nik.province();
        const kabupaten = nik.kabupatenKota();
        const kecamatan = nik.kecamatan();

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kecamatan + ', ' + kabupaten + ', ' + provinsi)}`;

        const result = `🆔 *Informasi NIK:*
• Valid: ${nik.isValid()}
• Provinsi ID: ${nik.provinceId()}
• Nama Provinsi: ${provinsi}
• Kabupaten ID: ${nik.kabupatenKotaId()}
• Nama Kabupaten: ${kabupaten}
• Kecamatan ID: ${nik.kecamatanId()}
• Nama Kecamatan: ${kecamatan}
• Kode Pos: ${nik.kodepos()}
• Jenis Kelamin: ${nik.kelamin()}
• Tanggal Lahir: ${nik.lahir()}
• Uniqcode: ${nik.uniqcode()}

📍 *Lokasi di Maps:*
🔗 (${mapsUrl})`;

        return bot.sendMessage(chatId, result, {
            reply_to_message_id: reply?.message_id || msg.message_id,
            parse_mode: 'Markdown'
        });

    } catch (err) {
        return bot.sendMessage(chatId, `❌ Error: NIK tidak valid atau parsing gagal!`, {
            reply_to_message_id: reply?.message_id || msg.message_id
        });
    }
});

bot.onText(/^(\.|\#|\/)doxhost$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  if (!reply || !reply.text) {
    return bot.sendMessage(chatId, `❌ *Reply* pesan berisi URL/IP untuk pengecekan.\n\nContoh: reply pesan "https://example.com" lalu ketik *.doxhost*`, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown'
    });
  }

  const text = reply.text.trim();

  const nodeToRegion = {
    ae1: '🇦🇪 United Arab Emirates',
    bg1: '🇧🇬 Bulgaria',
    br1: '🇧🇷 Brazil',
    ch1: '🇨🇭 Switzerland',
    cz1: '🇨🇿 Czech Republic',
    de1: '🇩🇪 Germany', de4: '🇩🇪 Germany',
    es1: '🇪🇸 Spain', fi1: '🇫🇮 Finland',
    fr2: '🇫🇷 France', hk1: '🇭🇰 Hong Kong',
    hr1: '🇭🇷 Croatia', id1: '🇮🇩 Indonesia',
    il1: '🇮🇱 Israel', il2: '🇮🇱 Israel',
    in1: '🇮🇳 India', ir1: '🇮🇷 Iran', ir3: '🇮🇷 Iran', ir5: '🇮🇷 Iran',
    it2: '🇮🇹 Italy', jp1: '🇯🇵 Japan',
    kz1: '🇰🇿 Kazakhstan', lt1: '🇱🇹 Lithuania',
    md1: '🇲🇩 Moldova', nl1: '🇳🇱 Netherlands', nl2: '🇳🇱 Netherlands',
    pl1: '🇵🇱 Poland', pl2: '🇵🇱 Poland',
    pt1: '🇵🇹 Portugal', rs1: '🇷🇸 Serbia',
    ru1: '🇷🇺 Russia', ru2: '🇷🇺 Russia', ru3: '🇷🇺 Russia',
    se1: '🇸🇪 Sweden',
    tr1: '🇹🇷 Turkey', tr2: '🇹🇷 Turkey',
    ua1: '🇺🇦 Ukraine', ua2: '🇺🇦 Ukraine', ua3: '🇺🇦 Ukraine',
    uk1: '🇬🇧 United Kingdom',
    us1: '🇺🇸 United States', us2: '🇺🇸 United States', us3: '🇺🇸 United States'
  };

  try {
    const isIp = /^[0-9.]+$/.test(text);
    const isUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(text);
    if (!isIp && !isUrl) {
      return bot.sendMessage(chatId, `❌ Format URL atau IP tidak valid.`, {
        reply_to_message_id: msg.message_id
      });
    }

    const startUrl = `https://check-host.net/check-http?host=${encodeURIComponent(text)}&max_nodes=43`;
    const res = await fetch(startUrl, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();

    if (!data.request_id) {
      return bot.sendMessage(chatId, `❌ Gagal mendapatkan ID permintaan.`, {
        reply_to_message_id: msg.message_id
      });
    }

    const { request_id: requestId, permanent_link: reportLink } = data;

    await bot.sendMessage(chatId, `✅ *Cek dimulai!*\n📄 *ID:* \`${requestId}\`\n🔗 *Laporan:* ${reportLink}`, {
      reply_to_message_id: reply.message_id,
      parse_mode: 'Markdown'
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    const resultUrl = `https://check-host.net/check-result/${requestId}`;
    const res2 = await fetch(resultUrl, { headers: { 'Accept': 'application/json' } });
    const resultData = await res2.json();

    if (!resultData || Object.keys(resultData).length === 0) {
      return bot.sendMessage(chatId, '❌ Tidak ada hasil yang valid ditemukan.', {
        reply_to_message_id: reply.message_id
      });
    }

    let resultsChunks = [];
    let tempResult = '';

    for (const [node, data] of Object.entries(resultData)) {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(result => {
          const region = nodeToRegion[node.split('.')[0]] || '🌍 Unknown Region';
          const status = result[3] || 'Unknown';
          const responseTime = result[1] ? `${result[1] * 1000} ms` : 'N/A';
          const ip = result[4] || 'N/A';

          const resultText = `🌍 *Wilayah:* ${region}\n📶 *Status:* ${status} ${result[2] || ''}\n⏳ *Respon:* ${responseTime}\n🖥️ *IP:* ${ip}\n────────────────\n`;

          if ((tempResult + resultText).length > 3500) {
            resultsChunks.push(tempResult);
            tempResult = '';
          }

          tempResult += resultText;
        });
      }
    }

    if (tempResult) resultsChunks.push(tempResult);

    if (resultsChunks.length === 0) {
      return bot.sendMessage(chatId, '❌ Tidak ada hasil yang valid ditemukan.', {
        reply_to_message_id: reply.message_id
      });
    }

    for (const chunk of resultsChunks) {
      await bot.sendMessage(chatId, chunk.trim(), {
        reply_to_message_id: reply.message_id,
        parse_mode: 'Markdown'
      });
    }

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan.', {
      reply_to_message_id: msg.message_id
    });
  }
});

bot.onText(/^(\.|\#|\/)doxdomain(?:\s+)?(.+)?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const q = match[2];

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!q) {
        return bot.sendMessage(chatId, `❌ *Format salah!*\n📌 *Contoh*: /doxdomain google.com`, {
            parse_mode: 'Markdown',
            reply_to_message_id: reply?.message_id
        });
    }

    bot.sendMessage(chatId, '⏳ *Wait... Proses Mencari Domain Yang Terdaftar...*', {
        parse_mode: 'Markdown',
        reply_to_message_id: reply?.message_id
    });

    try {
        const res = await axios.get(`https://api.botcahx.eu.org/api/tools/subdomain-finder?query=${encodeURIComponent(q)}&apikey=KLKVXtQL`);
        
        const result = res.data?.result;
        if (!result || result.length === 0) {
            return bot.sendMessage(chatId, `⚠️ Tidak ditemukan subdomain untuk *${q}*`, {
                parse_mode: 'Markdown',
                reply_to_message_id: reply?.message_id
            });
        }

        const domainList = result.map(sub => `- ${sub}`).join('\n');
        const text = `🌐 *List Subdomain untuk* \`${q}\`:\n\n${domainList}`;

        bot.sendMessage(chatId, text, {
            parse_mode: 'Markdown',
            reply_to_message_id: reply?.message_id
        });
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `⚠️ *Terjadi kesalahan saat mengambil data!*`, {
            parse_mode: 'Markdown',
            reply_to_message_id: reply?.message_id
        });
    }
});

bot.onText(/^(\.|\#|\/)installpanel1$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/RafatharCode" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nPenggunaan: /installpanel1 ipvps,password,domainpnl,domainnode,ramvps ( contoh : 8000 = ram 8 )`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/installpanel1 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');

  if (!owner.includes(String(msg.from.id))) {
    return bot.sendMessage(chatId, '❌ Fitur Ini Khusus Owner Saya!!!');
  }

  if (t.length < 5) {
    return bot.sendMessage(chatId, '*Format salah!*\nPenggunaan: /installpanel1 ipvps,password,domainpnl,domainnode,ramvps\nContoh: /installpanel1 192.168.1.1,rootpass,sub.domain.com,node.domain.com,8000');
  }

  const [ipvps, passwd, subdomain, domainnode, ramvps] = t;
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };

  let password = generateRandomPassword();
  const command = 'bash <(curl -s https://pterodactyl-installer.se)';
  const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';
  const conn = new Client();

  conn.on('ready', () => {
    bot.sendMessage(chatId, `PROSES PENGINSTALLAN SEDANG BERLANGSUNG MOHON TUNGGU 5-10 MENIT`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(connSettings);

  function installWings(conn, domainnode, subdomain, password, ramvps) {
    bot.sendMessage(chatId, `PROSES PENGINSTALLAN WINGS SEDANG BERLANGSUNG MOHON TUNGGU 5 MENIT`);
    conn.exec(commandWings, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        createNode(conn, domainnode, ramvps, subdomain, password);
      }).on('data', (data) => {
        handleWingsInstallationInput(data, stream, domainnode, subdomain);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  function createNode(conn, domainnode, ramvps, subdomain, password) {
    const command = `${Bash}`;
    bot.sendMessage(chatId, `MEMULAI CREATE NODE & LOCATION`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        conn.end();
        sendPanelData(subdomain, password);
      }).on('data', (data) => {
        handleNodeCreationInput(data, stream, domainnode, ramvps);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  function sendPanelData(subdomain, password) {
    bot.sendMessage(chatId, `*DATA PANEL ANDA*\n\nUSERNAME: admin\nPASSWORD: ${password}\nLOGIN: ${subdomain}\n\nNote: Semua Instalasi Telah Selesai.\nSilahkan Create Allocation Di Node Yang Dibuat Oleh Bot, Ambil Token Configuration, dan ketik *.startwings (token)*\n\nNote: HARAP TUNGGU 1-5 MENIT AGAR WEB DAPAT DIAKSES\n_Script by PrasOfficial_`);
  }

  function handlePanelInstallationInput(data, stream, subdomain, password) {
    const inputs = [
      '0', '', '', '1248', 'Asia/Jakarta', 'admin@gmail.com', 'admin@gmail.com',
      'admin', 'adm', 'adm', `${password}`, `${subdomain}`,
      'y', 'y', 'y', 'y', 'yes', 'A', '', '1'
    ];
    if (data.toString().includes('Input') || data.toString().includes('Please read the Terms of Service')) {
      stream.write(inputs.shift() + '\n');
    }
    console.log('STDOUT:', data.toString());
  }

  function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
    const inputs = [
      '1', 'y', 'y', 'y', `${subdomain}`, 'y', 'user', '1248',
      'y', `${domainnode}`, 'y', 'admin@gmail.com', 'y'
    ];
    if (data.toString().includes('Input')) {
      stream.write(inputs.shift() + '\n');
    }
    console.log('STDOUT:', data.toString());
  }

  function handleNodeCreationInput(data, stream, domainnode, ramvps) {
    const inputs = [
      `${Tokeninstall}`, '4', 'SGP', 'Jangan Lupa Support Ranzneweraa🦅🇮🇩',
      `${domainnode}`, 'NODES', `${ramvps}`, `${ramvps}`, '1'
    ];
    inputs.forEach(i => stream.write(i + '\n'));
    console.log('STDOUT:', data.toString());
  }
});

bot.onText(/^(\.|\#|\/)installpanel2$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nPenggunaan: /installpanel2 ipvps,password,domainpnl,domainnode,ramvps ( contoh : 8000 = ram 8 )`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/installpanel2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');

  if (!owner.includes(String(msg.from.id))) {
    return bot.sendMessage(chatId, '❌ Fitur Ini Khusus Owner Saya!!!');
  }

  if (t.length < 5) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /installpanel2 ipvps,password,domainpnl,domainnode,ramvps (contoh: 8000 = ram 8GB)');
  }

  const [ipvps, passwd, subdomain, domainnode, ramvps] = t;
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };

  const password = generateRandomPassword();
  const command = 'bash <(curl -s https://pterodactyl-installer.se)';
  const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';
  const conn = new Client();

  conn.on('ready', () => {
    bot.sendMessage(chatId, `🚀 PROSES INSTALL PANEL SEDANG BERLANGSUNG, MOHON TUNGGU 5-10 MENIT`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Panel install stream closed: ${code}, ${signal}`);
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(connSettings);

  function installWings(conn, domainnode, subdomain, password, ramvps) {
    bot.sendMessage(chatId, `🛠️ PROSES INSTALL WINGS, MOHON TUNGGU 5 MENIT`);
    conn.exec(commandWings, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Wings install stream closed: ${code}, ${signal}`);
        createNode(conn, domainnode, ramvps, subdomain, password);
      }).on('data', (data) => {
        handleWingsInstallationInput(data, stream, domainnode, subdomain);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  function createNode(conn, domainnode, ramvps, subdomain, password) {
    const command = `${Bash}`; // pastikan variabel Bash terdefinisi atau diubah sesuai kebutuhan
    bot.sendMessage(chatId, `📡 MEMULAI CREATE NODE & LOCATION`);

    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Node creation stream closed: ${code}, ${signal}`);
        conn.end();
        sendPanelData(subdomain, password);
      }).on('data', (data) => {
        handleNodeCreationInput(data, stream, domainnode, ramvps);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }

  function sendPanelData(subdomain, password) {
    bot.sendMessage(chatId, `✅ *DATA PANEL ANDA*\n\n👤 USERNAME: admin\n🔒 PASSWORD: ${password}\n🌐 LOGIN: ${subdomain}\n\n📌 Note: Semua Instalasi Telah Selesai. Silakan create allocation di node yang dibuat oleh bot dan ambil token configuration, lalu ketik /startwings (token)\n🕐 Tunggu 1-5 menit sebelum web bisa diakses.`);
  }

  function handlePanelInstallationInput(data, stream, subdomain, password) {
    const str = data.toString();
    if (str.includes('Input')) {
      stream.write('0\n\n\n1248\nAsia/Jakarta\nadmin@gmail.com\nadmin@gmail.com\nadmin\nadm\nadm\n');
      stream.write(`${password}\n`);
      stream.write(`${subdomain}\n`);
      stream.write('y\ny\ny\ny\ny\n\n1\n');
    }
    if (str.includes('Please read the Terms of Service')) {
      stream.write('Y\n');
    }
    console.log('Panel STDOUT:', str);
  }

  function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
    const str = data.toString();
    if (str.includes('Input')) {
      stream.write('1\ny\ny\ny\n');
      stream.write(`${subdomain}\n`);
      stream.write('y\nuser\n1248\ny\n');
      stream.write(`${domainnode}\n`);
      stream.write('y\nadmin@gmail.com\ny\n');
    }
    console.log('Wings STDOUT:', str);
  }

  function handleNodeCreationInput(data, stream, domainnode, ramvps) {
    stream.write(`${Tokeninstall}\n4\nSGP\nJangan Lupa Support RafatharCode🦅🇮🇩\n`);
    stream.write(`${domainnode}\nNODES\n${ramvps}\n${ramvps}\n1\n`);
    console.log('Node STDOUT:', data.toString());
  }
});

bot.onText(/^(\.|\#|\/)installwings$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ *Format salah!*\nPenggunaan: /installwings ipvps,password,token (token configuration)`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)installwings\s(.+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const text = match[2];
    const reply = msg.reply_to_message;

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    let t = text.split(',');
    if (t.length < 3) {
        return bot.sendMessage(chatId, `*Format salah!*\nPenggunaan: /installwings ipvps,password,token (token configuration)`, { parse_mode: 'Markdown' });
    }

    let ipvps = t[0].trim();
    let passwd = t[1].trim();
    let token = t[2].trim();

    const connSettings = {
        host: ipvps,
        port: 22,
        username: 'root',
        password: passwd
    };

    const conn = new Client();

    conn.on('ready', () => {
        bot.sendMessage(chatId, '𝗣𝗥𝗢𝗦𝗘𝗦 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗘 𝗪𝗜𝗡𝗚𝗦');

        conn.exec(Bash, (err, stream) => {
            if (err) {
                bot.sendMessage(chatId, `❌ Terjadi error saat eksekusi command`);
                return conn.end();
            }

            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ' + code + ' and signal ' + signal);
                bot.sendMessage(chatId, '𝗦𝗨𝗖𝗖𝗘𝗦 𝗦𝗧𝗔𝗥𝗧 𝗪𝗜𝗡𝗚𝗦 𝗦𝗜𝗟𝗔𝗛𝗞𝗔𝗡 𝗖𝗘𝗞 𝗡𝗢𝗗𝗘 𝗔𝗡𝗗𝗔😁');
                conn.end();
            }).on('data', (data) => {
                stream.write(`${Tokeninstall}\n`);
                stream.write('3\n');
                stream.write(`${token}\n`);
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        bot.sendMessage(chatId, '❌ Katasandi atau IP tidak valid!');
    }).connect(connSettings);
});

bot.onText(/^(\.|\#|\/)createnode$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ *Format salah!*\nPenggunaan: /createnode ipvps,password,domainnode,ramvps`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)createnode\s(.+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const text = match[2];
    const reply = msg.reply_to_message;

    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: reply?.message_id || msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    let t = text.split(',');
    if (t.length < 4) {
        return bot.sendMessage(chatId, `*Format salah!*\nPenggunaan: /createnode ipvps,password,domainnode,ramvps`, { parse_mode: 'Markdown' });
    }

    let ipvps = t[0].trim();
    let passwd = t[1].trim();
    let domainnode = t[2].trim();
    let ramvps = t[3].trim();

    const connSettings = {
        host: ipvps,
        port: 22,
        username: 'root',
        password: passwd
    };

    const command = `${Bash}`;
    const conn = new Client();

    conn.on('ready', () => {
        bot.sendMessage(chatId, '*MEMULAI CREATE NODE & LOCATION*', { parse_mode: 'Markdown' });

        conn.exec(command, (err, stream) => {
            if (err) {
                bot.sendMessage(chatId, '❌ Terjadi kesalahan saat eksekusi perintah.');
                return conn.end();
            }

            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ' + code + ' and signal ' + signal);
                bot.sendMessage(chatId, '*NODE DAN LOCATION TELAH DITAMBAHKAN*\nSilakan tambahkan *allocation* secara manual 😂 dan ambil token configure.', { parse_mode: 'Markdown' });
                conn.end();
            }).on('data', (data) => {
                stream.write(`${Tokeninstall}\n`);
                stream.write('4\n');
                stream.write('SGP\n');
                stream.write('AutoCnode RafatharCode\n');
                stream.write(`${domainnode}\n`);
                stream.write('NODES\n');
                stream.write(`${ramvps}\n`);
                stream.write(`${ramvps}\n`);
                stream.write('1\n');
                console.log('STDOUT:', data.toString());
            }).stderr.on('data', (data) => {
                console.log('STDERR:', data.toString());
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error:', err);
        bot.sendMessage(chatId, '❌ Katasandi atau IP tidak valid!');
    }).connect(connSettings);
});

const sizes = {
      '1gb': { memory: '1024', disk: '1024', cpu: '30' },
      '2gb': { memory: '2048', disk: '2048', cpu: '40' },
      '3gb': { memory: '3072', disk: '3072', cpu: '50' },
      '4gb': { memory: '4096', disk: '4096', cpu: '60' },
      '5gb': { memory: '5120', disk: '5120', cpu: '70' },
      '6gb': { memory: '6144', disk: '6144', cpu: '80' },
      '7gb': { memory: '7168', disk: '7168', cpu: '90' },
      '8gb': { memory: '8192', disk: '8192', cpu: '100' },
      '9gb': { memory: '9216', disk: '9216', cpu: '110' },
      '10gb': { memory: '10240', disk: '10240', cpu: '120' },
      'unli': { memory: '0', disk: '0', cpu: '0' }
    };

const createServerCommand = (command, config) => {
  bot.onText(new RegExp(`\\/${command}(?:\\s+(.+))?`), async (msg, match) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const reply = msg.reply_to_message;

    const premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
    const isPremium = premiumUsers.includes(String(msg.from.id));

    const text = match[1] || (reply && reply.text);

    // ✅ Cek Premium
    if (!isPremium) {
      return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium*.`, {
        reply_to_message_id: messageId,
        parse_mode: 'Markdown'
      });
    }

    // ✅ Validasi input
    if (!text) {
      return bot.sendMessage(chatId, `⚠️ Format salah!\nGunakan format: /${command} namapanel,idtele`, {
        reply_to_message_id: messageId
      });
    }

    const t = text.split(',');
    if (t.length < 2) {
      return bot.sendMessage(chatId, `⚠️ Format salah!\nGunakan format: /${command} namapanel,idtele`, {
        reply_to_message_id: messageId
      });
    }

    const username = t[0].trim();
    const userTele = t[1].trim();
    const password = `${username}001`;
    const name = username + command;

    const uniqueId = Date.now().toString();
    tempStore.set(uniqueId, { username, userTele, password, name, config });

    bot.sendMessage(chatId, `✅ Pilih server untuk membuat VPS:\n\n💾 *${command.toUpperCase()}* - RAM: ${config.memory}MB`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌍 Server 1', callback_data: `createserver|server1|${uniqueId}` }],
          [{ text: '🌍 Server 2', callback_data: `createserver|server2|${uniqueId}` }]
        ]
      },
      parse_mode: 'Markdown'
    });
  });
};

// ✅ Handler Callback
bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;

  if (data.startsWith('createserver')) {
    const [_, serverType, uniqueId] = data.split('|');
    const payload = tempStore.get(uniqueId);

    if (!payload) {
      return bot.sendMessage(chatId, '❌ Data tidak ditemukan atau sudah kadaluarsa.');
    }

    const { username, userTele, password, name, config } = payload;

    let domain, apikey;
    if (serverType === 'server1') {
      domain = Domain;
      apikey = Apikey;
    } else {
      domain = DomainV2;
      apikey = ApikeyV2;
    }

    try {
      // ✅ Buat user
      const userResp = await fetch(`${domain}/api/application/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apikey}`
        },
        body: JSON.stringify({
          email: `${username}@gmail.com`,
          username,
          first_name: username,
          last_name: username,
          language: 'en',
          password
        })
      });

      const userData = await userResp.json();
      if (userData.errors) {
        return bot.sendMessage(chatId, `❌ Gagal membuat user: ${userData.errors[0].detail}`);
      }

      const user = userData.attributes;

      // ✅ Startup Script langsung di sini
      const spc = 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';

      // ✅ Buat server
      const serverResp = await fetch(`${domain}/api/application/servers`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apikey}`
        },
        body: JSON.stringify({
          name,
          user: user.id,
          egg: parseInt(settings.eggs),
          docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
          startup: spc,
          environment: {
            INST: 'npm',
            CMD_RUN: 'npm start',
            AUTO_UPDATE: '0'
          },
          limits: {
            memory: config.memory,
            swap: 0,
            disk: config.disk,
            io: 500,
            cpu: config.cpu
          },
          feature_limits: { databases: 5, backups: 5, allocations: 1 },
          deploy: {
            locations: [parseInt(settings.loc)],
            dedicated_ip: false,
            port_range: []
          }
        })
      });

      const serverData = await serverResp.json();
      if (serverData.errors) {
        return bot.sendMessage(chatId, `❌ Gagal membuat server: ${serverData.errors[0].detail}`);
      }

      bot.sendMessage(chatId, `✅ *BERHASIL!*\nServer *${username}* dibuat di *${serverType === 'server1' ? 'Server 1' : 'Server 2'}*`, {
        parse_mode: 'Markdown'
      });

      bot.sendMessage(userTele, `
👋 Hai,

📦 PANEL INFORMATION:
🌍 Server: ${serverType === 'server1' ? 'Server 1' : 'Server 2'}
🔗 Login: ${domain}
👤 Username: ${user.username}
🔑 Password: ${password}

✅ Jangan lupa bilang Done jika sudah dicek.
`, { parse_mode: 'Markdown' });

      tempStore.delete(uniqueId);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat membuat server. Coba lagi.');
    }
  }
});

// ✅ Loop command VPS
Object.entries(sizes).forEach(([cmd, cfg]) => {
  createServerCommand(cmd, cfg);
});

bot.onText(/^\/belipanel(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  const hargaMap = {
  '1gb': 2000, '2gb': 3000, '3gb': 4000, '4gb': 5000, '5gb': 6000,
  '6gb': 7000, '7gb': 8000, '8gb': 9000, '9gb': 10000, '10gb': 11000,
  'unli': 15000
};

  const sizes = {
  '1gb': { memory: '1024', disk: '1024', cpu: '30' },
  '2gb': { memory: '2048', disk: '2048', cpu: '40' },
  '3gb': { memory: '3072', disk: '3072', cpu: '50' },
  '4gb': { memory: '4096', disk: '4096', cpu: '60' },
  '5gb': { memory: '5120', disk: '5120', cpu: '70' },
  '6gb': { memory: '6144', disk: '6144', cpu: '80' },
  '7gb': { memory: '7168', disk: '7168', cpu: '90' },
  '8gb': { memory: '8192', disk: '8192', cpu: '100' },
  '9gb': { memory: '9216', disk: '9216', cpu: '110' },
  '10gb': { memory: '10240', disk: '10240', cpu: '120' },
  'unli': { memory: '0', disk: '0', cpu: '0' }
};

  const text = match[1] || (reply && reply.text);
  if (!text) {
    return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh: /belipanel 1gb,username,idtele\n\nNote: Bot Harus Sudah Distart Biar Data Panell Mu Terkirim.`, {
      reply_to_message_id: targetMessageId
    });
  }

  const t = text.split(',');
  if (t.length < 3) {
    return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh: /belipanel 1gb,username,idtele\n\nNote: Bot Harus Sudah Distart Biar Data Panell Mu Terkirim.`, {
      reply_to_message_id: targetMessageId
    });
  }

  const paket = t[0].toLowerCase();
  const username = t[1];
  const idtele = t[2];

  const harga = hargaMap[paket];
  const config = sizes[paket];
  if (!harga || !config) {
    return bot.sendMessage(chatId, `⚠️ Paket *${paket}* tidak valid. Gunakan antara 1gb - 10gb atau unli.`, {
      reply_to_message_id: targetMessageId,
      parse_mode: "Markdown"
    });
  }

  const saldoUser = cekSaldo(userId, db_saldo);
  if (saldoUser < harga) {
    return bot.sendMessage(chatId, `Maaf @${userId}, sepertinya saldo kamu kurang dari Rp${harga.toLocaleString('id-ID')}\nSilahkan /topupsaldo terlebih dahulu sebelum membeli.\n\nAtau Hubungi Developer Kami!\nDeveloper:\nt.me/RafatharCode`, {
      parse_mode: "Markdown"
    });
  }

  const name = `${username}${paket}`;
  const egg = settings.eggs;
  const loc = settings.loc;
  const spc = 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}';
  const email = `${username}@gmail.com`;
  const password = `${username}001`;
  const akunlo = settings.pepe;

  try {
    const userResp = await fetch(`${Domain}/api/application/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Apikey}`
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: username,
        language: 'en',
        password
      })
    });

    const userData = await userResp.json();
    if (userData.errors) return;

    const user = userData.attributes;

    const serverResp = await fetch(`${Domain}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Apikey}`
      },
      body: JSON.stringify({
        name,
        description: '',
        user: user.id,
        egg: parseInt(egg),
        docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
        startup: spc,
        environment: {
          INST: 'npm',
          USER_UPLOAD: '0',
          AUTO_UPDATE: '0',
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: config.memory,
          swap: 0,
          disk: config.disk,
          io: 500,
          cpu: config.cpu
        },
        feature_limits: { databases: 5, backups: 5, allocations: 1 },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: []
        }
      })
    });

    const serverData = await serverResp.json();
    const server = serverData.attributes;

    // Kirim notifikasi ke chat pemesan
    bot.sendMessage(chatId, `✅ BERHASIL!\n\nServer *${username}* telah dibuat dengan ID user *${user.id}*.\n\nSisa saldo kamu: Rp${(saldoUser - harga).toLocaleString('id-ID')}`, {
      reply_to_message_id: targetMessageId,
      parse_mode: 'Markdown'
    });

    // Potong saldo
    minSaldo(userId, harga, db_saldo);

    // Kirim informasi panel ke idtele
    if (akunlo) {
      bot.sendPhoto(idtele, akunlo, {
        caption: `👋 Hai @${idtele}\n\n📦 PANEL INFORMATION:\n🌐 Login: ${Domain}\n👤 Username: ${user.username}\n🔑 Password: ${password}\n\n✅ Jangan lupa bilang Done jika sudah dicek.`,
        parse_mode: 'Markdown'
      });
    }

  } catch (err) {
    // Error tidak dikirim agar sesuai permintaan
  }
});

bot.onText(/\/listsrv/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_markup: {
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    bot.sendMessage(chatId, "✅ Pilih server untuk melihat daftar server:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌍 Server 1", callback_data: "listsrv|server1|1" }],
                [{ text: "🌍 Server 2", callback_data: "listsrv|server2|1" }]
            ]
        }
    });
});

bot.on("callback_query", async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (data.startsWith("listsrv")) {
        const [_, server, page] = data.split("|");

        let domain, apikey, capikey;
        if (server === "server1") {
            domain = Domain;
            apikey = Apikey;
            capikey = Capikey;
        } else {
            domain = DomainV2;
            apikey = ApikeyV2;
            capikey = CapikeyV2;
        }

        try {
            const res = await fetch(`${domain}/api/application/servers?page=${page}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${apikey}`
                }
            });

            const dataJson = await res.json();
            if (!dataJson.data || dataJson.data.length === 0) {
                return; // Tidak kirim pesan error
            }

            const pagination = dataJson.meta.pagination;
            const servers = dataJson.data;

            // ✅ Ambil status semua server paralel
            const statusPromises = servers.map(async (srv) => {
                try {
                    const resStatus = await fetch(`${domain}/api/client/servers/${srv.attributes.uuid.split("-")[0]}/resources`, {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${capikey}`
                        }
                    });
                    const statusData = await resStatus.json();
                    return statusData.attributes ? statusData.attributes.current_state : "UNKNOWN";
                } catch {
                    return "UNKNOWN";
                }
            });

            const statuses = await Promise.all(statusPromises);

            // ✅ Format teks
            let text = `📋 *DAFTAR SERVER (${server.toUpperCase()})*\n\n`;

            servers.forEach((srv, index) => {
                const s = srv.attributes;
                const status = statuses[index].toUpperCase();

                text += `🖥 *${s.name}*\n`;
                text += `ID: ${s.id} | UUID: ${s.uuid.slice(0, 8)}...\n`;
                text += `Status: ${status}\n`;
                text += `CPU: ${s.limits.cpu}% | RAM: ${s.limits.memory}MB | Disk: ${s.limits.disk}MB\n`;
                text += `───────────────────────\n`;
            });

            text += `📄 Halaman: ${pagination.current_page}/${pagination.total_pages}\n`;

            // ✅ Pagination & menu
            const keyboard = [];
            const row = [];
            if (pagination.current_page > 1) {
                row.push({ text: "⬅️ BACK", callback_data: `listsrv|${server}|${pagination.current_page - 1}` });
            }
            if (pagination.current_page < pagination.total_pages) {
                row.push({ text: "NEXT ➡️", callback_data: `listsrv|${server}|${pagination.current_page + 1}` });
            }
            if (row.length > 0) keyboard.push(row);

            // ✅ Hilangkan Refresh → hanya tombol Pilih Server
            keyboard.push([{ text: "⬅️ Kembali", callback_data: "listsrv_menu" }]);

            // ✅ Potong jika teks terlalu panjang
            if (text.length > 4000) {
                const chunks = text.match(/[\s\S]{1,4000}/g);
                for (let i = 0; i < chunks.length; i++) {
                    if (i === 0) {
                        await bot.editMessageText(chunks[i], {
                            chat_id: chatId,
                            message_id: callbackQuery.message.message_id,
                            parse_mode: "Markdown",
                            reply_markup: { inline_keyboard: keyboard }
                        });
                    } else {
                        await bot.sendMessage(chatId, chunks[i], { parse_mode: "Markdown" });
                    }
                }
            } else {
                bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id,
                    parse_mode: "Markdown",
                    reply_markup: { inline_keyboard: keyboard }
                });
            }
        } catch (err) {
            console.error(err);
            // Tidak kirim pesan error
        }
    }

    if (data === "listsrv_menu") {
        bot.editMessageText("✅ Pilih server untuk melihat daftar server:", {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🌍 Server 1", callback_data: "listsrv|server1|1" }],
                    [{ text: "🌍 Server 2", callback_data: "listsrv|server2|1" }]
                ]
            }
        });
    }
});

bot.onText(/\/delsrv1(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const srv = match[1].trim();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!srv) {
    return bot.sendMessage(chatId, '⚠️ Mohon masukkan ID server yang ingin dihapus.\nContoh: /delsrv 123', {
      reply_to_message_id: targetMessageId
    });
  }

    try {
        let f = await fetch(`${Domain}/api/application/servers/${srv}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Apikey}`
            }
        });

        let res = f.ok ? { errors: null } : await f.json();

        if (res.errors) {
            bot.sendMessage(chatId, 'SERVER NOT FOUND');
        } else {
            bot.sendMessage(chatId, 'SUCCESSFULLY DELETE THE SERVER');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat menghapus server.');
    }
});

bot.onText(/\/delsrv2(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const srv = match[1].trim();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!srv) {
    return bot.sendMessage(chatId, '⚠️ Mohon masukkan ID server yang ingin dihapus.\nContoh: /delsrv2 123', {
      reply_to_message_id: targetMessageId
    });
  }

    try {
        let f = await fetch(`${DomainV2}/api/application/servers/${srv}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ApikeyV2}`
            }
        });

        let res = f.ok ? { errors: null } : await f.json();

        if (res.errors) {
            bot.sendMessage(chatId, 'SERVER NOT FOUND');
        } else {
            bot.sendMessage(chatId, 'SUCCESSFULLY DELETE THE SERVER');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat menghapus server.');
    }
});

bot.onText(/\/listusr/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_markup: {
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    bot.sendMessage(chatId, "✅ Pilih server untuk melihat daftar user:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌍 Server 1", callback_data: "listusr|server1|1" }],
                [{ text: "🌍 Server 2", callback_data: "listusr|server2|1" }]
            ]
        }
    });
});

bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    // Handler list user
    if (data.startsWith("listusr")) {
        const [_, server, page] = data.split("|");
        let domain, apikey;

        if (server === "server1") {
            domain = Domain;
            apikey = Apikey;
        } else {
            domain = DomainV2;
            apikey = ApikeyV2;
        }

        try {
            const response = await fetch(`${domain}/api/application/users?page=${page}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apikey}`
                }
            });

            const res = await response.json();

            if (!res.data) return; // Tidak kirim pesan error

            // Bangun teks
            let text = `📋 *LIST USER PANEL* (${server.toUpperCase()})\n\n`;
            let count = 0;

            for (let user of res.data) {
                const u = user.attributes;
                if (!u.root_admin) { // Filter agar tidak menampilkan admin
                    text += `╔━━━━━━━[ USER ]━━━━━━━\n`;
                    text += `🆔 ID: ${u.id}\n`;
                    text += `👤 Username: ${u.username}\n`;
                    text += `📛 Nama: ${u.first_name} ${u.last_name}\n`;
                    text += `📧 Email: ${u.email}\n`;
                    text += `╚━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                    count++;
                }
            }

            if (count === 0) {
                text += `_Tidak ada user (selain admin) pada halaman ini._\n\n`;
            }

            const currentPage = res.meta.pagination.current_page;
            const totalPages = res.meta.pagination.total_pages;
            const totalUsers = res.meta.pagination.count;

            text += `📄 Halaman: ${currentPage}/${totalPages}\n`;
            text += `👥 User di halaman ini: ${totalUsers}\n`;

            // Pagination & Menu
            const keyboard = [];
            const row = [];

            if (currentPage > 1) {
                row.push({ text: "⬅️ BACK", callback_data: `listusr|${server}|${currentPage - 1}` });
            }
            if (currentPage < totalPages) {
                row.push({ text: "NEXT ➡️", callback_data: `listusr|${server}|${currentPage + 1}` });
            }
            if (row.length > 0) keyboard.push(row);

            // Hapus tombol Refresh → hanya sisa tombol pilih server
            keyboard.push([{ text: "⬅️ Kembali", callback_data: "listusr_menu" }]);

            bot.editMessageText(text, {
                chat_id: chatId,
                message_id: callbackQuery.message.message_id,
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: keyboard }
            });

        } catch (error) {
            console.error(error);
            // Tidak kirim pesan error
        }
    }

    // Handler untuk kembali ke menu server
    if (data === "listusr_menu") {
        bot.editMessageText("✅ Pilih server untuk melihat daftar user:", {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🌍 Server 1", callback_data: "listusr|server1|1" }],
                    [{ text: "🌍 Server 2", callback_data: "listusr|server2|1" }]
                ]
            }
        });
    }
});

bot.onText(/\/delusr1(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const usr = match[1].trim();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // Cek Apakah User Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  if (!usr) {
    return bot.sendMessage(chatId, '⚠️ Mohon masukkan ID user yang ingin dihapus.\nContoh: /delusr 123', {
      reply_to_message_id: targetMessageId
    });
  }

  try {
    let f = await fetch(`${Domain}/api/application/users/${usr}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Apikey}`
      }
    });

    let res = f.ok ? { errors: null } : await f.json();

    if (res.errors) {
      bot.sendMessage(chatId, '❌ USER NOT FOUND', {
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, '✅ USER DELETED SUCCESSFULLY', {
        reply_to_message_id: targetMessageId
      });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menghapus user.', {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/\/delusr2(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const usr = match[1].trim();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // Cek Apakah User Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  if (!usr) {
    return bot.sendMessage(chatId, '⚠️ Mohon masukkan ID user yang ingin dihapus.\nContoh: /delusr2 123', {
      reply_to_message_id: targetMessageId
    });
  }

  try {
    let f = await fetch(`${DomainV2}/api/application/users/${usr}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ApikeyV2}`
      }
    });

    let res = f.ok ? { errors: null } : await f.json();

    if (res.errors) {
      bot.sendMessage(chatId, '❌ USER NOT FOUND', {
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, '✅ USER DELETED SUCCESSFULLY', {
        reply_to_message_id: targetMessageId
      });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menghapus user.', {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)clearall1$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek apakah user adalah owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    const Reply = (text) => {
        return bot.sendMessage(chatId, text, { reply_to_message_id: targetMessageId, parse_mode: "Markdown" });
    };

    try {
        // ✅ Hapus semua server
        let serverFetch = await fetch(Domain + "/api/application/servers", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + Apikey,
            }
        });

        let serverRes = await serverFetch.json();
        let servers = serverRes.data;

        if (!servers || servers.length === 0) {
            await Reply('Tidak ada server yang ditemukan.');
        } else {
            for (let server of servers) {
                let s = server.attributes;

                let deleteServer = await fetch(Domain + "/api/application/servers/" + s.id, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + Apikey,
                    }
                });

                if (deleteServer.ok) {
                    await Reply(`✅ Berhasil menghapus server dengan ID: *${s.id}*`);
                } else {
                    let errorText = await deleteServer.text();
                    await Reply(`❌ Gagal menghapus server ID: *${s.id}*. Error: ${deleteServer.status} - ${errorText}`);
                }
            }
            await Reply('*✅ Semua server berhasil dihapus!*');
        }

        // ✅ Hapus semua user kecuali admin
        let userFetch = await fetch(Domain + "/api/application/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + Apikey,
            }
        });

        let userRes = await userFetch.json();
        let users = userRes.data;

        if (!users || users.length === 0) {
            await Reply('Tidak ada user yang ditemukan.');
        } else {
            for (let user of users) {
                let u = user.attributes;

                if (!u.root_admin) {
                    let deleteUser = await fetch(Domain + "/api/application/users/" + u.id, {
                        method: "DELETE",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + Apikey,
                        }
                    });

                    if (deleteUser.ok) {
                        await Reply(`✅ Berhasil menghapus user dengan ID: *${u.id}*`);
                    } else {
                        let errorText = await deleteUser.text();
                        await Reply(`❌ Gagal menghapus user ID: *${u.id}*. Error: ${deleteUser.status} - ${errorText}`);
                    }
                }
            }
            await Reply('*✅ Semua user (kecuali admin) berhasil dihapus!*');
        }

    } catch (error) {
        return Reply('⚠️ Terjadi kesalahan: ' + error.message);
    }
});

bot.onText(/^(\.|\#|\/)clearall2$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek apakah user adalah owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    const Reply = (text) => {
        return bot.sendMessage(chatId, text, { reply_to_message_id: targetMessageId, parse_mode: "Markdown" });
    };

    try {
        // ✅ Hapus semua server
        let serverFetch = await fetch(DomainV2 + "/api/application/servers", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ApikeyV2,
            }
        });

        let serverRes = await serverFetch.json();
        let servers = serverRes.data;

        if (!servers || servers.length === 0) {
            await Reply('Tidak ada server yang ditemukan.');
        } else {
            for (let server of servers) {
                let s = server.attributes;

                let deleteServer = await fetch(DomainV2 + "/api/application/servers/" + s.id, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + ApikeyV2,
                    }
                });

                if (deleteServer.ok) {
                    await Reply(`✅ Berhasil menghapus server dengan ID: *${s.id}*`);
                } else {
                    let errorText = await deleteServer.text();
                    await Reply(`❌ Gagal menghapus server ID: *${s.id}*. Error: ${deleteServer.status} - ${errorText}`);
                }
            }
            await Reply('*✅ Semua server berhasil dihapus!*');
        }

        // ✅ Hapus semua user kecuali admin
        let userFetch = await fetch(DomainV2 + "/api/application/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ApikeyV2,
            }
        });

        let userRes = await userFetch.json();
        let users = userRes.data;

        if (!users || users.length === 0) {
            await Reply('Tidak ada user yang ditemukan.');
        } else {
            for (let user of users) {
                let u = user.attributes;

                if (!u.root_admin) {
                    let deleteUser = await fetch(DomainV2 + "/api/application/users/" + u.id, {
                        method: "DELETE",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + ApikeyV2,
                        }
                    });

                    if (deleteUser.ok) {
                        await Reply(`✅ Berhasil menghapus user dengan ID: *${u.id}*`);
                    } else {
                        let errorText = await deleteUser.text();
                        await Reply(`❌ Gagal menghapus user ID: *${u.id}*. Error: ${deleteUser.status} - ${errorText}`);
                    }
                }
            }
            await Reply('*✅ Semua user (kecuali admin) berhasil dihapus!*');
        }

    } catch (error) {
        return Reply('⚠️ Terjadi kesalahan: ' + error.message);
    }
});

bot.onText(/^(\.|\#|\/)cadmin$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format Salah!\nContoh: /cadmin namapanel,idtele`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/cadmin (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const targetMessageId = msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, '❌ Perintah ini hanya bisa diakses oleh Owner!', {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'HUBUNGI ADMIN', url: 'https://t.me/RafatharCode' }]
                ]
            }
        });
    }

    const commandParams = match[1].split(',');
    if (commandParams.length < 2) {
        return bot.sendMessage(chatId, '⚠️ Format Salah!\nContoh: /cadmin namapanel,idtele', {
            reply_to_message_id: targetMessageId
        });
    }

    const panelName = commandParams[0].trim();
    const telegramId = commandParams[1].trim();
    const password = panelName + "1204";

    // Simpan data di Map pakai ID unik
    const uniqueId = Date.now().toString();
    tempStore.set(uniqueId, { panelName, telegramId, password });

    bot.sendMessage(chatId, '✅ Pilih server untuk membuat admin:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🌐 Server 1', callback_data: `cadmin|server1|${uniqueId}` }],
                [{ text: '🌐 Server 2', callback_data: `cadmin|server2|${uniqueId}` }]
            ]
        }
    });
});

bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (data.startsWith('cadmin')) {
        const parts = data.split('|');
        const server = parts[1];
        const uniqueId = parts[2];

        const tempData = tempStore.get(uniqueId);
        if (!tempData) {
            return bot.sendMessage(chatId, '❌ Data tidak ditemukan atau sudah kadaluarsa.');
        }

        let domain, apikey;
        if (server === 'server1') {
            domain = Domain;
            apikey = Apikey;
        } else {
            domain = DomainV2;
            apikey = ApikeyV2;
        }

        try {
            const response = await fetch(`${domain}/api/application/users`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apikey}`
                },
                body: JSON.stringify({
                    email: `${tempData.panelName}@admvvip.dev`,
                    username: tempData.panelName,
                    first_name: tempData.panelName,
                    last_name: "Memb",
                    language: "en",
                    root_admin: true,
                    password: tempData.password
                })
            });

            const dataRes = await response.json();

            if (dataRes.errors) {
                return bot.sendMessage(chatId, JSON.stringify(dataRes.errors[0], null, 2));
            }

            const user = dataRes.attributes;
            const userInfo = `
✅ ADMIN PANEL BERHASIL DIBUAT ✅

🌍 Server: ${server === 'server1' ? 'Server 1' : 'Server 2'}
➟ ID: ${user.id}
➟ USERNAME: ${user.username}
➟ EMAIL: ${user.email}
➟ NAME: ${user.first_name} ${user.last_name}
➟ LANGUAGE: ${user.language}
➟ ADMIN: ${user.root_admin}
➟ CREATED AT: ${user.created_at}
➟ LOGIN: ${domain}
`;

            bot.sendMessage(chatId, userInfo);

            bot.sendMessage(tempData.telegramId, `
✅ HERE'S YOUR ADMIN PANEL DATA ✅
🌍 Server: ${server === 'server1' ? 'Server 1' : 'Server 2'}
🚩 Login : ${domain}
🚩 Username : ${tempData.panelName}
🚩 Password : ${tempData.password}

➡️ Rules :
• Jangan Curi Sc
• Jangan Buka Panel Orang
• Jangan Ddos Server
• Kalo jualan sensor domainnya
• Jangan Bagi² Panel Free
• Jangan Jualan AdminP Kecuali Pt Gw !!

THANKS FOR BUYING AT Ranzneweraa😁✌️
`);

            tempStore.delete(uniqueId); // hapus setelah dipakai
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, '❌ Terjadi kesalahan saat membuat admin. Coba lagi nanti.');
        }
    }
});

bot.onText(/^(\.|\#|\/)deladmin1$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format Salah!\nContoh: /deladmin1 12 (ID admin)`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/deladmin1 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // Pastikan hanya Owner yang bisa menghapus admin
  if (userId !== owner) {
    return bot.sendMessage(chatId, '❌ Perintah Ini Hanya Bisa Diakses Oleh Owner!', {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'HUBUNGI ADMIN', url: 'https://t.me/Ranzneweraa' }]
        ]
      }
    });
  }

  // Ambil parameter ID admin yang akan dihapus
  const adminId = match[1].trim();
  if (!adminId) {
    return bot.sendMessage(chatId, '⚠️ Format Salah!\nContoh: /deladmin1 12 (ID admin)', {
      reply_to_message_id: targetMessageId
    });
  }

  try {
    // Kirim permintaan DELETE ke API Pterodactyl
    const response = await fetch(`${Domain}/api/application/users/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Apikey}`
      }
    });

    if (response.status === 204) {
      bot.sendMessage(chatId, `✅ Admin dengan ID **${adminId}** berhasil dihapus.`);
    } else {
      const data = await response.json();
      if (data.errors) {
        return bot.sendMessage(chatId, `❌ Gagal menghapus admin:\n${JSON.stringify(data.errors[0], null, 2)}`);
      } else {
        return bot.sendMessage(chatId, `❌ Gagal menghapus admin. Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menghapus admin. Coba lagi nanti.');
  }
});

bot.onText(/^(\.|\#|\/)deladmin2$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format Salah!\nContoh: /deladmin2 12 (ID admin)`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/\/deladmin2 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // Pastikan hanya Owner yang bisa menghapus admin
  if (userId !== owner) {
    return bot.sendMessage(chatId, '❌ Perintah Ini Hanya Bisa Diakses Oleh Owner!', {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'HUBUNGI ADMIN', url: 'https://t.me/Ranzneweraa' }]
        ]
      }
    });
  }

  // Ambil parameter ID admin yang akan dihapus
  const adminId = match[1].trim();
  if (!adminId) {
    return bot.sendMessage(chatId, '⚠️ Format Salah!\nContoh: /deladmin2 12 (ID admin)', {
      reply_to_message_id: targetMessageId
    });
  }

  try {
    // Kirim permintaan DELETE ke API Pterodactyl
    const response = await fetch(`${DomainV2}/api/application/users/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ApikeyV2}`
      }
    });

    if (response.status === 204) {
      bot.sendMessage(chatId, `✅ Admin dengan ID **${adminId}** berhasil dihapus.`);
    } else {
      const data = await response.json();
      if (data.errors) {
        return bot.sendMessage(chatId, `❌ Gagal menghapus admin:\n${JSON.stringify(data.errors[0], null, 2)}`);
      } else {
        return bot.sendMessage(chatId, `❌ Gagal menghapus admin. Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menghapus admin. Coba lagi nanti.');
  }
});

bot.onText(/\/listadmin/, async (msg) => {  
    const chatId = msg.chat.id;  
    const userId = msg.from.id.toString();  

    if (userId !== owner) {  
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {  
            reply_markup: {  
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/RafatharCode" }]]  
            }  
        });  
    }  

    bot.sendMessage(chatId, "✅ Pilih server untuk melihat daftar admin:", {  
        reply_markup: {  
            inline_keyboard: [  
                [{ text: "🌍 Server 1", callback_data: "listadmin|server1|1" }],  
                [{ text: "🌍 Server 2", callback_data: "listadmin|server2|1" }]  
            ]  
        }  
    });  
});  

bot.on('callback_query', async (callbackQuery) => {  
    const data = callbackQuery.data;  
    const chatId = callbackQuery.message.chat.id;  

    if (data.startsWith("listadmin")) {  
        const [_, server, page] = data.split("|");  
        let domain, apikey;  

        if (server === "server1") {  
            domain = Domain;  
            apikey = Apikey;  
        } else {  
            domain = DomainV2;  
            apikey = ApikeyV2;  
        }  

        try {  
            const response = await fetch(`${domain}/api/application/users?page=${page}`, {  
                method: "GET",  
                headers: {  
                    "Accept": "application/json",  
                    "Content-Type": "application/json",  
                    "Authorization": `Bearer ${apikey}`  
                }  
            });  

            const res = await response.json();  

            if (!res.data) {  
                return; // Tidak kirim pesan error  
            }  

            let text = `📋 *LIST ADMIN (${server.toUpperCase()})*\n\n`;  
            let count = 0;  

            for (let user of res.data) {  
                const u = user.attributes;  
                if (u.root_admin) {  
                    text += `🆔 ID: ${u.id}\n👤 Username: ${u.username}\n📛 Nama: ${u.first_name} ${u.last_name}\n📧 Email: ${u.email}\n\n`;  
                    count++;  
                }  
            }  

            if (count === 0) {  
                text += `_Tidak ada admin pada halaman ini._\n\n`;  
            }  

            text += `📄 Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;  

            const currentPage = res.meta.pagination.current_page;  
            const totalPages = res.meta.pagination.total_pages;  

            const keyboard = [];  

            // Pagination  
            const row = [];  
            if (currentPage > 1) {  
                row.push({ text: "⬅️ BACK", callback_data: `listadmin|${server}|${currentPage - 1}` });  
            }  
            if (currentPage < totalPages) {  
                row.push({ text: "NEXT ➡️", callback_data: `listadmin|${server}|${currentPage + 1}` });  
            }  
            if (row.length > 0) keyboard.push(row);  

            // Hanya tombol kembali ke pilih server (tanpa refresh)  
            keyboard.push([{ text: "⬅️ Kembali", callback_data: "listadmin_menu" }]);  

            bot.editMessageText(text, {  
                chat_id: chatId,  
                message_id: callbackQuery.message.message_id,  
                parse_mode: "Markdown",  
                reply_markup: { inline_keyboard: keyboard }  
            });  
        } catch (error) {  
            console.error(error);  
            // Tidak kirim pesan error lagi  
        }  
    }  

    if (data === "listadmin_menu") {  
        bot.editMessageText("✅ Pilih server untuk melihat daftar admin:", {  
            chat_id: chatId,  
            message_id: callbackQuery.message.message_id,  
            reply_markup: {  
                inline_keyboard: [  
                    [{ text: "🌍 Server 1", callback_data: "listadmin|server1|1" }],  
                    [{ text: "🌍 Server 2", callback_data: "listadmin|server2|1" }]  
                ]  
            }  
        });  
    }  
});

// Command untuk domain1
bot.onText(/^\/domain1(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain1 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld1;
      const Apitokentld = settings.apitokentld1;
      const Domaintld = settings.domaintld1;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^\/domain2(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain2 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld2;
      const Apitokentld = settings.apitokentld2;
      const Domaintld = settings.domaintld2;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^\/domain3(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain3 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld3;
      const Apitokentld = settings.apitokentld3;
      const Domaintld = settings.domaintld3;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^\/domain4(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain4 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld4;
      const Apitokentld = settings.apitokentld4;
      const Domaintld = settings.domaintld4;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^\/domain5(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain4 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld5;
      const Apitokentld = settings.apitokentld5;
      const Domaintld = settings.domaintld5;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^\/domain6(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const reply = msg.reply_to_message;

  // Cek user Premium
  const premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
  const isPremium2 = premium2Users.includes(String(msg.from.id));

  if (!isPremium2) {
    return bot.sendMessage(chatId, `❌ Maaf, perintah ini hanya untuk pengguna *Premium Seller Domain*.`, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Ambil teks argumen
  const rawInput = match[1] || (reply && reply.text);
  if (!rawInput) {
    return bot.sendMessage(chatId, `Format salah!\nContoh: /domain4 hostname|167.29.379.23`, {
      reply_to_message_id: messageId
    });
  }

  const [hostRaw, ipRaw] = rawInput.split('|').map(s => s.trim());

  // Validasi host
  const host = (hostRaw || '').replace(/[^a-z0-9.-]/gi, '');
  if (!host) {
    return bot.sendMessage(chatId, `❌ Host tidak valid!\nGunakan huruf, angka, strip (-), atau titik (.)`, {
      reply_to_message_id: messageId
    });
  }

  // Validasi IP
  const ip = (ipRaw || '').replace(/[^0-9.]/gi, '');
  if (!ip || ip.split('.').length !== 4) {
    return bot.sendMessage(chatId, `❌ IP tidak valid!\nContoh: 192.168.0.1`, {
      reply_to_message_id: messageId
    });
  }

  // Fungsi tambah subdomain
  async function subDomain1(host, ip) {
    try {
      const Zonetld = settings.zonetld6;
      const Apitokentld = settings.apitokentld6;
      const Domaintld = settings.domaintld6;

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${Zonetld}/dns_records`,
        {
          type: "A",
          name: `${host}.${Domaintld}`,
          content: ip,
          ttl: 3600,
          priority: 10,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${Apitokentld}`,
            "Content-Type": "application/json"
          }
        }
      );

      const res = response.data;
      if (res.success) {
        return { success: true, name: res.result?.name, ip: res.result?.content };
      } else {
        return { success: false, error: JSON.stringify(res.errors) };
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.message || error.message || 'Unknown Error';
      return { success: false, error: errMsg };
    }
  }

  // Jalankan proses
  const processingMsg = await bot.sendMessage(chatId, `⏳ Sedang menambahkan subdomain...`, {
    reply_to_message_id: messageId
  });

  const result = await subDomain1(host, ip);

  if (result.success) {
    await bot.sendMessage(chatId, `✅ Berhasil membuat subdomain:\n\n🌐 Hostname: ${result.name}\n📌 IP: ${result.ip}`, {
      reply_to_message_id: messageId
    });
  } else {
    await bot.sendMessage(chatId, `❌ Gagal membuat subdomain!\nError: ${result.error}`, {
      reply_to_message_id: messageId
    });
  }
});

bot.onText(/^([./]{0,2})?restart\s*(\d+)?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString(); // ID user
    const reply = msg.reply_to_message; // Pesan yang direply user
    const targetMessageId = reply ? reply.message_id : msg.message_id; // ID target pesan

    if (userId !== owner) {
        return bot.sendMessage(chatId, '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.', {
            reply_to_message_id: targetMessageId
        });
    }

    await bot.sendMessage(chatId, '🔄 Bot sedang direstart...', {
        reply_to_message_id: targetMessageId
    });

    setTimeout(() => {
        process.exit(0); // Restart bot (gunakan PM2/systemd agar auto start)
    }, 2000);
});

bot.onText(/^(\.|\#|\/)struk$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nGunakan: /struk toko|id_transaksi|harga_admin|nomor_tujuan|status|barang1-harga1,barang2-harga2,...`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)struk\s+(.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[2]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, `❌ Format salah!\nGunakan: /struk toko|id_transaksi|harga_admin|nomor_tujuan|status|barang1-harga1,barang2-harga2,...`);
    }

    let [toko, idTransaksi, hargaAdmin, nomorTujuan, status, items] = text.split("|");
    if (!toko || !idTransaksi || !hargaAdmin || !nomorTujuan || !status || !items) {
        return bot.sendMessage(chatId, "⚠️ *Format tidak lengkap!*");
    }

    let validStatus = ["done", "dp", "cicil", "hutang"];
    if (!validStatus.includes(status.toLowerCase())) {
        return bot.sendMessage(chatId, "⚠️ *Status tidak valid! Gunakan: done, DP, cicil, atau hutang*");
    }

    // Pisahkan daftar barang
    let daftarBarang = items.split(",").map((item, index) => {
        let [nama, harga] = item.split("-");
        return { nomor: index + 1, nama, harga };
    });

    // Tentukan ukuran canvas dinamis
    const canvasWidth = 400;
    const canvasHeight = 530 + daftarBarang.length * 30;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Background putih
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header toko
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(toko.toUpperCase(), canvasWidth / 2, 40);

    // Waktu
    ctx.font = "14px monospace";
    let waktuPurwakarta = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    ctx.fillText(`Purwakarta, ${waktuPurwakarta}`, canvasWidth / 2, 65);

    // Detail transaksi
    ctx.textAlign = "left";
    ctx.fillText(`ID Transaksi : ${idTransaksi}`, 20, 100);
    ctx.fillText(`Nomor Tujuan : ${nomorTujuan}`, 20, 125);
    ctx.fillText(`Status       : ${status.toUpperCase()}`, 20, 150);

    ctx.beginPath();
    ctx.moveTo(20, 170);
    ctx.lineTo(canvasWidth - 20, 170);
    ctx.stroke();

    // List Barang
    let startY = 195;
    daftarBarang.forEach((item, i) => {
        ctx.fillText(`${item.nomor}. ${item.nama} - Rp${parseInt(item.harga).toLocaleString()}`, 20, startY + i * 30);
    });

    let lastItemY = startY + daftarBarang.length * 30 + 10;
    ctx.beginPath();
    ctx.moveTo(20, lastItemY);
    ctx.lineTo(canvasWidth - 20, lastItemY);
    ctx.stroke();

    // Hitung Total
    let totalHarga = daftarBarang.reduce((sum, item) => sum + parseInt(item.harga), 0);
    let totalKeseluruhan = totalHarga + parseInt(hargaAdmin);

    ctx.fillText(`Total         : Rp${totalHarga.toLocaleString()}`, 20, lastItemY + 25);
    ctx.fillText(`Admin         : Rp${parseInt(hargaAdmin).toLocaleString()}`, 20, lastItemY + 50);
    ctx.fillText(`Total Semua   : Rp${totalKeseluruhan.toLocaleString()}`, 20, lastItemY + 75);

    // Footer
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THANK YOU FOR SHOPPING AT", canvasWidth / 2, lastItemY + 120);
    ctx.fillText(toko.toUpperCase(), canvasWidth / 2, lastItemY + 140);

    // Kirim langsung tanpa simpan file
    const buffer = canvas.toBuffer("image/png");
    await bot.sendPhoto(chatId, buffer, { caption: "🧾 Struk Pembelian" });
});

bot.onText(/^(\.|\#|\/)aigpt|gptpro|ai(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message; // pesan yang direply
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user adalah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  // ✅ Ambil input dari user
  const inputText = (match[2] || '').trim() || (reply && reply.text);
  if (!inputText) {
    return bot.sendMessage(chatId, `Contoh:\n/gptpro <masukan teks>\n/aigpt <masukan teks>\n/ai <masukan teks>`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
    return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.", {
      reply_to_message_id: targetMessageId
    });
  }

  await bot.sendMessage(chatId, `⏳Wait Sabar Permintaan Mu Sedang Kami Proses.\nPermintaan Anda:\n"${inputText}"`, {
    reply_to_message_id: targetMessageId
  });

  try {
    const ai = new genAI.GoogleGenerativeAI(googleApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ langsung kirim input user tanpa prompt tambahan
    const result = await model.generateContent(inputText);
    const response = await result.response;
    let textResult = response.text();

    const cleanResult = textResult.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

    await bot.sendMessage(chatId, `✅ *Permintaan Mu Berhasil Dibuat!*\n\n\`\`\`Permintaan\n${cleanResult}\n\`\`\``, {
      reply_to_message_id: targetMessageId,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error('AI Error:', err);
    await bot.sendMessage(chatId, `❌ Gagal memproses: ${err.message}`, {
      reply_to_message_id: targetMessageId
    });
  }
});

// ✅ Command Auto AI (on/off/reset)
bot.onText(/^([./#])autoai\s*(on|off|reset)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const action = match[2] ? match[2].toLowerCase() : null;

  if (!action) {
    return bot.sendMessage(chatId, `Contoh:\n/autoai on\n/autoai off\n/autoai reset`);
  }

  if (action === "on") {
    globalAutoAIStatus = true;
    saveSettings();
    return bot.sendMessage(chatId, `✅ Auto AI diaktifkan! Bot akan merespons jika dipanggil dengan kata: ${botName}`);
  }

  if (action === "off") {
    globalAutoAIStatus = false;
    saveSettings();
    return bot.sendMessage(chatId, `❌ Auto AI dimatikan!`);
  }

  if (action === "reset") {
    globalAutoAIStatus = false;
    saveSettings();
    return bot.sendMessage(chatId, `🔄 Auto AI direset!`);
  }
});

// ✅ Respon AI jika dipanggil dengan nama bot
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.toLowerCase() : "";

  if (globalAutoAIStatus && text.includes(botName)) {
    if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
      return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.");
    }

    try {
      const ai = new genAI.GoogleGenerativeAI(googleApiKey);
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

      await bot.sendChatAction(chatId, 'typing');

      const prompt = `
Kamu adalah AI asisten ramah. Jawablah dengan singkat, jelas, dan bersahabat.
Pertanyaan user: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiReply = response.text();

      await bot.sendMessage(chatId, aiReply, { reply_to_message_id: msg.message_id });

    } catch (err) {
      console.error('Auto AI Error:', err);
      await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`);
    }
  }
});

bot.onText(/^(\.|\#|\/)deploy(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // ✅ Cek apakah user adalah owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    const fs = require('fs');
    const path = require('path');
    const fetch = require('node-fetch');

    try {
        let isiHTML = match[2] ? match[2].trim() : "";

        // ✅ Jika tidak ada input text, ambil dari reply
        if (!isiHTML && reply && reply.text) {
            let matchHtml = reply.text.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
            if (matchHtml) isiHTML = matchHtml[0];
        }

        // ✅ Validasi minimal HTML
        if (!isiHTML || !isiHTML.includes("<html")) {
            return bot.sendMessage(chatId, `❌ Masukkan isi HTML-nya atau reply pesan yang berisi kode HTML.\n\nContoh:\n/deploy <html>...</html>`, {
                reply_to_message_id: targetMessageId
            });
        }

        // ✅ Batas ukuran HTML (1 MB)
        if (isiHTML.length > 1024 * 1024) {
            return bot.sendMessage(chatId, '❌ File HTML terlalu besar (maks 1MB).', {
                reply_to_message_id: targetMessageId
            });
        }

        // ✅ Buat folder tmp
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        // ✅ Simpan file HTML
        const randomNumber = Math.floor(Math.random() * 9999);
        const fileName = `rafatharcode${randomNumber}.html`;
        const filePath = path.join(tmpDir, fileName);
        fs.writeFileSync(filePath, isiHTML);

        // ✅ Deploy ke Vercel
        const projectName = `rafatharcode${randomNumber}`.toLowerCase();
        const vercelToken = 'OycXqYtAxYbHASzvSdjW0sIZ';

        const headers = {
            Authorization: `Bearer ${vercelToken}`,
            'Content-Type': 'application/json'
        };

        // ✅ Cek apakah project sudah ada
        const checkProject = await fetch(`https://api.vercel.com/v9/projects/${projectName}`, { headers });
        if (!checkProject.ok) {
            await fetch('https://api.vercel.com/v9/projects', {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: projectName })
            });
        }

        // ✅ Deploy File
        const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: projectName,
                target: 'production',
                files: [{
                    file: 'index.html',
                    data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
                    encoding: 'base64'
                }],
                projectSettings: { framework: null }
            })
        });

        const res = await deployRes.json();

        // ✅ Kirim hasil ke user
        let deployURL = res?.url ? `https://${res.url}` : `https://${projectName}.vercel.app`;
        await bot.sendDocument(chatId, filePath, {
            caption: `✅ File HTML berhasil dibuat!\n\n📁 Nama File: ${fileName}\n🌐 Link Deploy: ${deployURL}`
        }, { reply_to_message_id: targetMessageId });

        // ✅ Hapus file sementara
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, '❌ Terjadi kesalahan saat membuat atau upload HTML.', {
            reply_to_message_id: targetMessageId
        });
    }
});

bot.onText(/^(\.|\#|\/)buathtml2(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message; // pesan yang direply
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user adalah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  // ✅ Ambil input dari user
  const inputText = (match[2] || '').trim() || (reply && reply.text);
  if (!inputText) {
    return bot.sendMessage(chatId, `Contoh:\n/buathtml2 halaman login dengan form username dan password\n/buathtml halaman landing page produk VPS`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
    return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.", {
      reply_to_message_id: targetMessageId
    });
  }

  await bot.sendMessage(chatId, `⏳ Sedang membuat HTML sesuai permintaan:\n"${inputText}"`, {
    reply_to_message_id: targetMessageId
  });

  try {
    const ai = new genAI.GoogleGenerativeAI(googleApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Kamu adalah AI khusus pembuat kode untuk website.
Buat kode HTML lengkap (boleh termasuk CSS dan JS inline jika diperlukan) sesuai permintaan user:
"${inputText}"
Aturan:
- Hanya tampilkan kode HTML/CSS/JS tanpa tanda kutip tambahan.
- Jangan berikan penjelasan.
- Pastikan hasil dapat langsung digunakan di file .html.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    const cleanResult = textResult.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

    await bot.sendMessage(chatId, `✅ *Kode HTML berhasil dibuat!*\n\n\`\`\`html\n${cleanResult}\n\`\`\``, {
      reply_to_message_id: targetMessageId,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error('BuatHTML AI Error:', err);
    await bot.sendMessage(chatId, `❌ Gagal membuat HTML: ${err.message}`, {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)buathtml1(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user adalah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  const inputText = (match[2] || '').trim() || (reply && reply.text);
  if (!inputText) {
    return bot.sendMessage(chatId, `Contoh:\n/buathtml1 halaman login dengan form username dan password\n/buathtml halaman landing page produk VPS`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
    return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.", {
      reply_to_message_id: targetMessageId
    });
  }

  await bot.sendMessage(chatId, `⏳ Sedang membuat HTML sesuai permintaan:\n"${inputText}"`, {
    reply_to_message_id: targetMessageId
  });

  try {
    const ai = new genAI.GoogleGenerativeAI(googleApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Kamu adalah AI pembuat website profesional.
Buatkan kode untuk permintaan berikut:
"${inputText}"

Aturan:
- Jika ada CSS terpisah, beri tanda <<CSS>> di awal dan <<ENDCSS>> di akhir.
- Jika ada JS terpisah, beri tanda <<JS>> di awal dan <<ENDJS>> di akhir.
- HTML utama harus tetap lengkap dengan <html>, <head>, <body>.
- Jangan berikan penjelasan.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    const cleanResult = textResult.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

    // ✅ Ekstrak bagian CSS dan JS jika ada
    const cssMatch = cleanResult.match(/<<CSS>>([\s\S]*?)<<ENDCSS>>/);
    const jsMatch = cleanResult.match(/<<JS>>([\s\S]*?)<<ENDJS>>/);

    let htmlContent = cleanResult
      .replace(/<<CSS>>[\s\S]*?<<ENDCSS>>/, '')
      .replace(/<<JS>>[\s\S]*?<<ENDJS>>/, '')
      .trim();

    // ✅ Jika panjang > 4000 atau ada file tambahan → buat ZIP
    if (htmlContent.length > 4000 || cssMatch || jsMatch) {
      const zipPath = './website.zip';
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      // Tambahkan file index.html
      archive.append(htmlContent, { name: 'index.html' });

      // Jika ada CSS
      if (cssMatch) {
        const cssContent = cssMatch[1].trim();
        archive.append(cssContent, { name: 'style.css' });
      }

      // Jika ada JS
      if (jsMatch) {
        const jsContent = jsMatch[1].trim();
        archive.append(jsContent, { name: 'script.js' });
      }

      await archive.finalize();

      output.on('close', async () => {
        await bot.sendDocument(chatId, zipPath, {
          caption: "✅ Website berhasil dibuat! Dikemas dalam ZIP.",
          reply_to_message_id: targetMessageId
        });

        fs.unlinkSync(zipPath);
      });

    } else {
      await bot.sendMessage(chatId, `✅ *Kode HTML berhasil dibuat!*\n\n\`\`\`html\n${htmlContent}\n\`\`\``, {
        reply_to_message_id: targetMessageId,
        parse_mode: "Markdown"
      });
    }

  } catch (err) {
    console.error('BuatHTML AI Error:', err);
    await bot.sendMessage(chatId, `❌ Gagal membuat HTML: ${err.message}`, {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)buatfitur(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message; // pesan yang direply
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user adalah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  // ✅ Ambil input dari user
  const inputText = (match[2] || '').trim() || (reply && reply.text);
  if (!inputText) {
    return bot.sendMessage(chatId, `Contoh:\n/buatfitur .ping\n/buatfitur .gimage dengan hasil URL dan tombol`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
    return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.", {
      reply_to_message_id: targetMessageId
    });
  }

  await bot.sendMessage(chatId, `⏳ Sedang membuat fitur sesuai perintah:\n"${inputText}"`, {
    reply_to_message_id: targetMessageId
  });

  try {
    const ai = new genAI.GoogleGenerativeAI(googleApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Kamu adalah AI pembuat fitur bot telegram menggunakan struktur node-telegram-api telegraf.
Buatlah 1 blok kode fitur berdasarkan perintah user berikut:
"${inputText}"
Aturan:
- Gunakan struktur if atau switch-case (CommonJS).
- Jika perlu API, sertakan contoh fetch.
- Tampilkan hasil dengan conn.sendMessage atau reply.
- Jangan pakai tanda kutip tambahan, jangan sertakan penjelasan.
- Berikan kode siap tempel.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    const cleanResult = textResult.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

    await bot.sendMessage(chatId, `✅ *Fitur berhasil dibuat!*\n\n\`\`\`javascript\n${cleanResult}\n\`\`\``, {
      reply_to_message_id: targetMessageId,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error('BuatFitur AI Error:', err);
    await bot.sendMessage(chatId, `❌ Gagal membuat fitur: ${err.message}`, {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)ubahcode(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message; // pesan yang direply
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user adalah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  // ✅ Ambil argumen setelah perintah
  const args = (match[2] || '').trim().split(/\s+/);

  if (!googleApiKey || googleApiKey === "YOUR_API_KEY_HERE") {
    return bot.sendMessage(chatId, "❌ API Key untuk Google AI belum diatur.", {
      reply_to_message_id: targetMessageId
    });
  }

  const targetType = (args[0] || '').toLowerCase();
  const validFormats = ['esm', 'cjs', 'case'];
  if (!validFormats.includes(targetType)) {
    return bot.sendMessage(chatId,
      `⚡ *UBAH CODE INSTRUKSI*\n\nGunakan: /ubahcode <format> <kode>\nAtau reply pesan berisi kode dengan: /ubahcode <format>\n\n📌 *Format yang didukung:*\n- esm → plugin ESM\n- cjs → plugin CommonJS\n- case → case handler\n\n📌 *Contoh:*\n/ubahcode esm const axios = require("axios");\n/ubahcode cjs import fetch from "node-fetch";\n/ubahcode case const crypto = require("crypto");`,
      { reply_to_message_id: targetMessageId }
    );
    return;
  }

  // ✅ Ambil kode dari argumen atau pesan yang direply
  const sourceCode = args.slice(1).join(' ') || (reply && reply.text);
  if (!sourceCode) {
    return bot.sendMessage(chatId, '❌ Silakan sertakan kode atau reply pesan berisi kode.', {
      reply_to_message_id: targetMessageId
    });
  }

  await bot.sendMessage(chatId, `⏳ Mengonversi kode ke format *${targetType.toUpperCase()}*...`, {
    reply_to_message_id: targetMessageId
  });

  try {
    const ai = new genAI.GoogleGenerativeAI(googleApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildEnglishPrompt(sourceCode, targetType);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    if (textResult.trim().startsWith('{')) {
      try {
        const errorJson = JSON.parse(textResult);
        if (errorJson.success === false) {
          return bot.sendMessage(chatId, `❌ Konversi Gagal:\n${errorJson.message}`, {
            reply_to_message_id: targetMessageId
          });
        }
      } catch (e) { }
    }

    const cleanResult = textResult.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

    await bot.sendMessage(chatId, `✅ *Kode berhasil dikonversi!*\n\n\`\`\`javascript\n${cleanResult}\n\`\`\``, {
      reply_to_message_id: targetMessageId,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error('UbahCode AI Error:', err);
    await bot.sendMessage(chatId, `❌ Konversi gagal: ${err.message}`, {
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|#|\/)banuser(?:\s+(\d+))?$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        const reply = msg.reply_to_message;
        const targetMessageId = reply ? reply.message_id : msg.message_id;

        // Cek akses owner
        if (userId !== owner) {
            return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
                reply_to_message_id: targetMessageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                    ]
                }
            });
        }

        // Ambil target ID
        const targetId = reply ? reply.from.id.toString() : (match[2] || "").trim();
        if (!targetId) return bot.sendMessage(chatId, "⚠️ Reply user atau masukkan ID Telegram.\nContoh: `/banuser 12345678`", { parse_mode: "Markdown" });

        // Load & cek data banned
        let bannedUsers = loadBannedUsers();
        if (bannedUsers.includes(targetId)) {
            return bot.sendMessage(chatId, "❌ User sudah dibanned sebelumnya.", { reply_to_message_id: targetMessageId });
        }

        // Tambah user ke banned list
        bannedUsers.push(targetId);
        saveBannedUsers(bannedUsers);

        bot.sendMessage(chatId, `✅ User \`${targetId}\` telah *dibanned*.\n\n📢 Pesan otomatis: anda dibanned oleh developer kami`, {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });
    });

bot.onText(/^(\.|#|\/)unbanuser(?:\s+(\d+))?$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        const reply = msg.reply_to_message;
        const targetMessageId = reply ? reply.message_id : msg.message_id;

        if (userId !== owner) {
            return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
                reply_to_message_id: targetMessageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                    ]
                }
            });
        }

        const targetId = reply ? reply.from.id.toString() : (match[2] || "").trim();
        if (!targetId) return bot.sendMessage(chatId, "⚠️ Reply user atau masukkan ID Telegram.\nContoh: `/unbanuser 12345678`", { parse_mode: "Markdown" });

        let bannedUsers = loadBannedUsers();
        if (!bannedUsers.includes(targetId)) {
            return bot.sendMessage(chatId, "⚠️ User tidak ada dalam daftar banned.", { reply_to_message_id: targetMessageId });
        }

        bannedUsers = bannedUsers.filter(id => id !== targetId);
        saveBannedUsers(bannedUsers);

        bot.sendMessage(chatId, `✅ User \`${targetId}\` telah *diunban*.`, {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });
    });
// Middleware Global Cek Banned
bot.on("message", (msg) => {
    const userId = msg.from.id.toString();
    const bannedUsers = loadBannedUsers();

    if (bannedUsers.includes(userId)) {
        return bot.sendMessage(msg.chat.id, "🚫 anda dibanned oleh developer kami", {
            reply_to_message_id: msg.message_id
        });
    }
});

bot.onText(/^(\.|#|\/)block(?:\s+(\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.");
    }

    const targetId = reply ? reply.from.id.toString() : (match[2] || "").trim();
    if (!targetId) return bot.sendMessage(chatId, "⚠️ Reply user atau masukkan ID Telegram.\nContoh: `/block 12345678`", { parse_mode: "Markdown" });

    let blockedUsers = loadBlockedUsers();
    if (blockedUsers.includes(targetId)) {
        return bot.sendMessage(chatId, "❌ User sudah diblokir sebelumnya.");
    }

    blockedUsers.push(targetId);
    saveBlockedUsers(blockedUsers);

    bot.sendMessage(chatId, `✅ User \`${targetId}\` telah *diblokir*.`, { parse_mode: "Markdown" });
});

// ✅ Command /unblockuser
bot.onText(/^(\.|#|\/)unblock(?:\s+(\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.");
    }

    const targetId = reply ? reply.from.id.toString() : (match[2] || "").trim();
    if (!targetId) return bot.sendMessage(chatId, "⚠️ Reply user atau masukkan ID Telegram.\nContoh: `/unblock 12345678`", { parse_mode: "Markdown" });

    let blockedUsers = loadBlockedUsers();
    if (!blockedUsers.includes(targetId)) {
        return bot.sendMessage(chatId, "⚠️ User tidak ada dalam daftar blokir.");
    }

    blockedUsers = blockedUsers.filter(id => id !== targetId);
    saveBlockedUsers(blockedUsers);

    bot.sendMessage(chatId, `✅ User \`${targetId}\` telah *dibuka blokirnya*.`, { parse_mode: "Markdown" });
});

// ✅ Command /listblock
bot.onText(/^(\.|#|\/)listblock$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.");
    }

    const blockedUsers = loadBlockedUsers();

    if (blockedUsers.length === 0) {
        return bot.sendMessage(chatId, "✅ Tidak ada user yang diblokir.");
    }

    // Buat daftar dengan tombol Unblock
    const keyboard = blockedUsers.map(id => [
        { text: `Unblock ${id}`, callback_data: `unblock:${id}` }
    ]);

    bot.sendMessage(chatId, `📋 *Daftar User Diblokir*:\n\n${blockedUsers.map(id => `• ${id}`).join("\n")}`, {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard }
    });
});

// ✅ Handler tombol Unblock (callback query)
bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (data.startsWith('unblock:')) {
        const userId = data.split(':')[1];

        let blockedUsers = loadBlockedUsers();
        if (!blockedUsers.includes(userId)) {
            return bot.answerCallbackQuery(callbackQuery.id, { text: 'User tidak ada dalam daftar.' });
        }

        blockedUsers = blockedUsers.filter(id => id !== userId);
        saveBlockedUsers(blockedUsers);

        await bot.answerCallbackQuery(callbackQuery.id, { text: `✅ ${userId} diunblock` });
        await bot.editMessageText(`✅ User ${userId} telah diunblock.\n\n📋 Update daftar:\n${blockedUsers.map(id => `• ${id}`).join("\n") || "Tidak ada user diblokir."}`, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: blockedUsers.map(id => [
                    { text: `Unblock ${id}`, callback_data: `unblock:${id}` }
                ])
            }
        });
    }
});

// ✅ Middleware Silent Mode
bot.on("message", (msg) => {
    const userId = msg.from.id.toString();
    const blockedUsers = loadBlockedUsers();

    if (blockedUsers.includes(userId)) {
        return; // Silent mode (tidak balas apapun)
    }
});
// Vps Digitalocean 
bot.onText(/^([./]{0,2})?saldodigitalocean$/i, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const getAccountBalance = async () => {
    const billingUrl = 'https://api.digitalocean.com/v2/customers/my/balance';
    try {
      const balanceResponse = await axios.get(billingUrl, {
        headers: { Authorization: `Bearer ${apiDo}` },
      });

      if (balanceResponse.status === 200 && balanceResponse.data) {
        const data = balanceResponse.data;
        return {
          account_balance: data.account_balance ?? "0.00",
          month_to_date_balance: data.month_to_date_balance ?? "0.00",
          month_to_date_usage: data.month_to_date_usage ?? "0.00",
          generated_at: data.generated_at ?? "Tidak tersedia",
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error ambil saldo DO:", error.message);
      return null;
    }
  };

  const getDropletCosts = async () => {
    const dropletUrl = 'https://api.digitalocean.com/v2/droplets';
    try {
      const dropletResponse = await axios.get(dropletUrl, {
        headers: { Authorization: `Bearer ${apiDo}` },
      });

      if (dropletResponse.status === 200 && dropletResponse.data.droplets) {
        const droplets = dropletResponse.data.droplets;
        let totalCost = 0;
        let dropletDetails = [];

        for (let droplet of droplets) {
          const costPerMonth = droplet.size.price_monthly ?? 0;
          const costPerHour = droplet.size.price_hourly ?? 0;
          totalCost += costPerMonth;

          dropletDetails.push(
            `🔹 *${droplet.name}* (${droplet.size.slug})\n` +
            `   💵 $${costPerMonth}/bulan | $${costPerHour}/jam`
          );
        }

        return { dropletDetails, totalCost };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error ambil droplet DO:", error.message);
      return null;
    }
  };

  try {
    const balanceInfo = await getAccountBalance();
    const dropletInfo = await getDropletCosts();

    if (balanceInfo && dropletInfo) {
      const message = `💳 *Saldo DigitalOcean*\n\n`
        + `🗓 *Update:* ${balanceInfo.generated_at}\n`
        + `💰 *Saldo Akun:* $${parseFloat(balanceInfo.account_balance).toFixed(2)}\n`
        + `📊 *Pemakaian Bulan Ini:* $${parseFloat(balanceInfo.month_to_date_usage).toFixed(2)}\n`
        + `🧾 *Saldo Setelah Tagihan:* $${parseFloat(balanceInfo.month_to_date_balance).toFixed(2)}\n\n`
        + `🚀 *Droplet Aktif:*\n${dropletInfo.dropletDetails.join("\n")}\n\n`
        + `💸 *Total Biaya:* $${dropletInfo.totalCost.toFixed(2)}/bulan\n\n`
        + `⚠️ Pastikan saldo cukup agar layanan tidak terhenti.`;

      return bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    } else {
      return bot.sendMessage(chatId, '❌ Tidak dapat mengambil informasi saldo/droplet.\nPastikan API key DigitalOcean valid.', {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    }
  } catch (error) {
    console.error("Error di ceksaldodo:", error.message);
    bot.sendMessage(chatId, '⚠️ Terjadi kesalahan saat mengambil saldo DigitalOcean.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)rebuild$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /rebuild iddroplet`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^([./]{0,2})?rebuild\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const targetMessageId = msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const dropletId = match[2];

  const keyboard = {
    inline_keyboard: [
      [
        { text: "Ubuntu 20.04", callback_data: `rebuild:${dropletId}:ubuntu-20-04-x64` },
        { text: "Ubuntu 22.04", callback_data: `rebuild:${dropletId}:ubuntu-22-04-x64` },
        { text: "Ubuntu 24.04", callback_data: `rebuild:${dropletId}:ubuntu-24-04-x64` }
      ],
      [
        { text: "Debian 11", callback_data: `rebuild:${dropletId}:debian-11-x64` },
        { text: "Debian 12", callback_data: `rebuild:${dropletId}:debian-12-x64` }
      ],
      [
        { text: "CentOS 7", callback_data: `rebuild:${dropletId}:centos-7-x64` }
      ]
    ]
  };

  bot.sendMessage(chatId, `🔄 *Pilih OS untuk Rebuild*\n🆔 Droplet ID: \`${dropletId}\``, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
    reply_to_message_id: targetMessageId
  });
});

// Handle Callback OS Choice
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith("rebuild:")) {
    const [ , dropletId, imageSlug ] = data.split(":");

    await bot.answerCallbackQuery(callbackQuery.id, { text: `Rebuild dengan OS ${imageSlug}...` });

    try {
      const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}/actions`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiDo
        },
        body: JSON.stringify({
          type: "rebuild",
          image: imageSlug
        })
      });

      const result = await response.json();

      if (response.ok) {
        bot.editMessageText(`✅ *Rebuild Dimulai!*\n🆔 ID: \`${dropletId}\`\n📀 OS: \`${imageSlug}\`\n📊 Status: *${result.action.status.toUpperCase()}*`, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown'
        });
      } else {
        bot.editMessageText(`❌ *Gagal Rebuild!*\n${JSON.stringify(result, null, 2)}`, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown'
        });
      }

    } catch (err) {
      bot.editMessageText(`❌ *Error:* ${err.message}`, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'Markdown'
      });
    }
  }
});

bot.onText(/^(\.|\#|\/)turnon$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /turnon iddroplet`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// TURN ON VPS
bot.onText(/^([./]{0,2})?turnon\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const targetMessageId = msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const dropletId = match[2];

  try {
    const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiDo}`
      },
      body: JSON.stringify({ type: 'power_on' })
    });

    if (!response.ok) throw new Error('Gagal menghidupkan VPS.');
    const result = await response.json();

    bot.sendMessage(chatId, `✅ *Perintah Hidupkan VPS Berhasil Dikirim!*\n🆔 ID VPS: \`${dropletId}\`\n📌 Status: *Sedang dinyalakan...*`, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });

  } catch (err) {
    console.error('[TURN ON ERROR]', err);
    bot.sendMessage(chatId, '❌ *Gagal menghidupkan VPS!*\n' + err.message, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)turnoff$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /turnoff iddroplet`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

// TURN OFF VPS
bot.onText(/^([./]{0,2})?turnoff\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const targetMessageId = msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const dropletId = match[2];

  try {
    const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiDo}`
      },
      body: JSON.stringify({ type: 'power_off' })
    });

    if (!response.ok) throw new Error('Gagal mematikan VPS.');
    const result = await response.json();

    bot.sendMessage(chatId, `✅ *Perintah Matikan VPS Berhasil Dikirim!*\n🆔 ID VPS: \`${dropletId}\`\n📌 Status: *Sedang dimatikan...*`, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });

  } catch (err) {
    console.error('[TURN OFF ERROR]', err);
    bot.sendMessage(chatId, '❌ *Gagal mematikan VPS!*\n' + err.message, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^([./]{0,2})?listdroplet$/i, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const reply = msg.reply_to_message; // Ambil pesan yang dibalas user
  const targetMessageId = reply ? reply.message_id : msg.message_id; // ID pesan untuk reply
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  try {
    const response = await fetch('https://api.digitalocean.com/v2/droplets', {
      headers: { Authorization: "Bearer " + apiDo }
    });

    const data = await response.json();
    const droplets = data.droplets || [];
    const totalvps = droplets.length;

    const header = `
╭─❖「 *📦 DIGITALOCEAN VPS LIST* 」❖─╮
│ 🧮 *Total Droplet:* ${totalvps}
╰─────────────────────────────╯\n`;

    if (droplets.length === 0) {
      return bot.sendMessage(chatId, header + '\n_Tidak ada droplet tersedia!_', {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    }

    const chunkLimit = 3500;
    let currentMessage = header;
    let index = 1;

    for (const droplet of droplets) {
      const ipv4 = droplet.networks.v4.find(net => net.type === "public");
      const ip = ipv4 ? ipv4.ip_address : 'Tidak ada IP';

      const block = `
┌─────[ *#${index} - ${droplet.name}* ]
│ 🆔 ID        : \`${droplet.id}\`
│ 👤 User      : root
│ 🌍 IP Publik : ${ip}
│ 💾 RAM       : ${droplet.memory} MB
│ 🧠 CPU       : ${droplet.vcpus} Core
│ 💽 Storage   : ${droplet.disk} GB
│ 🖥 OS        : ${droplet.image.distribution}
│ 📊 Status    : *${droplet.status.toUpperCase()}*
└─────────────────────────────┘
`;

      if (block.length > chunkLimit) {
        await bot.sendMessage(chatId, block, {
          parse_mode: 'Markdown',
          reply_to_message_id: targetMessageId
        });
        index++;
        continue;
      }

      if ((currentMessage.length + block.length) > chunkLimit) {
        await bot.sendMessage(chatId, currentMessage, {
          parse_mode: 'Markdown',
          reply_to_message_id: targetMessageId
        });
        currentMessage = '';
      }

      currentMessage += block;
      index++;
    }

    if (currentMessage.length > 0) {
      await bot.sendMessage(chatId, currentMessage, {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    }

  } catch (err) {
    console.error('[DO LIST ERROR]', err);
    bot.sendMessage(chatId, '❌ *Gagal mengambil data DigitalOcean!*\n' + err.message, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^([./]{0,2})?sisadroplet$/i, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Access Denied!*\nHanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  try {
    const dropletRes = await fetch('https://api.digitalocean.com/v2/droplets', {
      headers: { Authorization: "Bearer " + settings.apiDO }
    });
    const dropletData = await dropletRes.json();
    const terpakai = dropletData.droplets.length;

    const accRes = await fetch('https://api.digitalocean.com/v2/account', {
      headers: { Authorization: "Bearer " + settings.apiDO }
    });
    const accData = await accRes.json();
    const limit = accData.account.droplet_limit;
    const sisa = limit - terpakai;

    let warning = '';
    if (sisa <= 3) {
      warning = `\n⚠️ *WARNING:* Sisa hanya *${sisa}*, hampir limit!`;
    }

    const infoText = `
╔═〘 💻 DIGITALOCEAN STATUS PANEL 〙═╗
║ 🧠 *Akun:* ${accData.account.email}
║ 
║ 🔢 *Total Limit*    : ${limit} Droplet
║ 🚀 *Terpakai*       : ${terpakai} Droplet
║ ✅ *Tersisa*        : ${sisa} Droplet
║ 
║ 📆 *Update:* ${new Date().toLocaleString('id-ID')}
╚════════════════════════════════╝${warning}
`;

    bot.sendMessage(chatId, infoText.trim(), {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });

  } catch (err) {
    bot.sendMessage(chatId, '❌ *Gagal Ambil Data DO:*\n' + err.message, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

bot.onText(/^(\.|\#|\/)deldroplet$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /deldroplet iddroplet`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^([./]{0,2})?deldroplet\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const targetMessageId = msg.message_id;
  const isOwner = senderId === owner;

  if (!isOwner) {
    return bot.sendMessage(chatId, '🔒 *Akses Ditolak!*\nPerintah ini hanya untuk *Owner*.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const dropletId = match[2]; // ID droplet dari command

  try {
    // Kirim request DELETE ke DigitalOcean
    const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiDo}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      // Berhasil dihapus
      await bot.sendMessage(chatId, `✅ *Droplet dengan ID ${dropletId} berhasil dihapus!*`, {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    } else {
      // Gagal, tampilkan pesan error
      const errorData = await response.json();
      await bot.sendMessage(chatId, `❌ *Gagal menghapus droplet!*\n${errorData.message || 'Unknown error'}`, {
        parse_mode: 'Markdown',
        reply_to_message_id: targetMessageId
      });
    }

  } catch (err) {
    console.error('[DO DELETE ERROR]', err);
    bot.sendMessage(chatId, '❌ *Terjadi kesalahan saat menghapus droplet!*\n' + err.message, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }
});

// ==================== Tahap Buat VPS ====================
bot.onText(/^(\.|\#|\/)cvpsnew$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /cvpsnew hostname,password`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^([./]{0,2})?cvpsnew\s+(.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (senderId !== owner) {
    return bot.sendMessage(chatId, '🔒 *Access Denied!* Hanya Owner.', {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  const text = match[2]?.trim();
  const [hostname, password] = text.split(",").map(v => v?.trim());

  if (!hostname || !password) {
    return bot.sendMessage(chatId, `❌ Format salah!\nGunakan: /cvpsnew hostname,password`, {
      parse_mode: 'Markdown',
      reply_to_message_id: targetMessageId
    });
  }

  global.tempCreateVPS = {
    user: senderId,
    step: "await-ubuntu-version",
    hostname: hostname.toLowerCase(),
    password
  };

  // ✅ Pilih versi Ubuntu
  const ubuntuVersions = [
    { text: 'Ubuntu 20.04', callback_data: 'cvpsversion 20-04' },
    { text: 'Ubuntu 22.04', callback_data: 'cvpsversion 22-04' },
    { text: 'Ubuntu 24.04', callback_data: 'cvpsversion 24-04' }
  ];

  return bot.sendMessage(chatId, `✅ Data diterima!\n\nHostname: *${hostname}*\nPassword: *${password}*\n\nPilih versi Ubuntu:`, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: ubuntuVersions.map(v => [v]) },
    reply_to_message_id: targetMessageId
  });
});

// ✅ Handler tombol callback
bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const senderId = callbackQuery.from.id.toString();

  if (senderId !== owner) {
    return bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Hanya Owner!', show_alert: false });
  }

  // ✅ Pilih versi Ubuntu
  if (data.startsWith('cvpsversion ')) {
    const version = data.split(' ')[1];

    if (!global.tempCreateVPS || global.tempCreateVPS.user !== senderId) {
      return bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Data tidak ditemukan. Jalankan /cvpsnew lagi.', show_alert: false });
    }

    global.tempCreateVPS.version = version;
    global.tempCreateVPS.os = "ubuntu";
    global.tempCreateVPS.step = "await-config";

    // ✅ Pilih konfigurasi (dengan tambahan 16GB)
    const options = [
      { text: '1vCPU / 1GB', callback_data: `cvpsfinal s-1vcpu-1gb|sgp1|${version}` },
      { text: '2vCPU / 2GB', callback_data: `cvpsfinal s-2vcpu-2gb|sgp1|${version}` },
      { text: '4vCPU / 8GB', callback_data: `cvpsfinal s-4vcpu-8gb|sgp1|${version}` }
    ];

    await bot.editMessageText(`✅ Versi Ubuntu dipilih: *${version}*\n\nPilih konfigurasi VPS:`, {
      chat_id: chatId,
      message_id: msg.message_id,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: options.map(o => [o]) }
    });

    return bot.answerCallbackQuery(callbackQuery.id);
  }

  // ✅ Pilih konfigurasi VPS
  if (data.startsWith('cvpsfinal ')) {
    const config = data.replace('cvpsfinal ', '');
    const [size, region, version] = config.split("|");
    const { hostname, password, os } = global.tempCreateVPS;

    let imageSlug = `ubuntu-${version}-x64`;

    await bot.editMessageText(`⏳ Membuat VPS...\n\nHostname: *${hostname}*\nOS: *Ubuntu ${version}*\nSize: *${size}*\nRegion: *${region}*`, {
      chat_id: chatId,
      message_id: msg.message_id,
      parse_mode: 'Markdown'
    });

    try {
      const createRes = await fetch('https://api.digitalocean.com/v2/droplets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiDo}`
        },
        body: JSON.stringify({
          name: hostname,
          region,
          size,
          image: imageSlug,
          ssh_keys: [],
          backups: false,
          ipv6: true,
          user_data: `#cloud-config\npassword: ${password}\nchpasswd: { expire: False }\nssh_pwauth: True`,
          tags: ['auto-create-bot']
        })
      });

      const result = await createRes.json();

      if (result.droplet) {
        const dropletId = result.droplet.id;
        await bot.editMessageText(`✅ VPS Berhasil Dibuat!\n\nID: *${dropletId}*\nHostname: *${hostname}*\nRegion: *${region}*\nSize: *${size}*\n\nGunakan perintah */cekdroplet ${dropletId}* untuk cek IP VPS.`, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown'
        });
      } else {
        await bot.editMessageText(`❌ Gagal membuat VPS:\n${JSON.stringify(result, null, 2)}`, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'Markdown'
        });
      }
    } catch (err) {
      await bot.editMessageText(`❌ Error:\n${err.message}`, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'Markdown'
      });
    }

    delete global.tempCreateVPS;
    return bot.answerCallbackQuery(callbackQuery.id);
  }
});

bot.onText(/^(\.|\#|\/)cekdroplet$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message; // Pesan yang dibalas user
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // ✅ Cek apakah user owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  // ✅ Jika owner tapi belum kasih argumen droplet
  bot.sendMessage(
    chatId,
    `❌ Format salah!\nGunakan: /cekdroplet iddroplet`,
    { reply_to_message_id: targetMessageId }
  );
});

bot.onText(/^(\.|\#|\/)cekdroplet\s+(\d+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const dropletId = match[2]; // Ambil ID Droplet dari input
    const replyTo = msg.message_id;

    // Cek apakah user adalah owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: replyTo,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // Validasi input
    if (!dropletId) {
        return bot.sendMessage(chatId, "⚠️ Format salah!\nContoh penggunaan:\n/cekdroplet 123456789", {
            reply_to_message_id: replyTo
        });
    }

    // Ambil detail droplet
    try {
        const dropletResponse = await axios.get(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
            headers: {
                Authorization: `Bearer ${apiDo}`, // Pastikan API key tersimpan di global
            },
        });

        if (dropletResponse.status === 200) {
            const droplet = dropletResponse.data.droplet;

            // Format tanggal
            const createdAt = new Date(droplet.created_at);
            const formattedDate = createdAt.toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const infoText =
`🔹 *Detail VPS* 🔹

📌 *ID VPS*: ${droplet.id}
💻 *Nama VPS*: ${droplet.name}
🌍 *IP VPS*: ${droplet.networks.v4[0]?.ip_address || "Tidak ada IP"}
⚡ *Status VPS*: ${droplet.status === "active" ? "Aktif ✅" : "Tidak Aktif ❌"}
📅 *Dibuat Pada*: ${formattedDate}`;

            bot.sendMessage(chatId, infoText, { parse_mode: "Markdown", reply_to_message_id: replyTo });
        } else {
            throw new Error("Gagal mendapatkan data droplet!");
        }
    } catch (err) {
        bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`, { reply_to_message_id: replyTo });
    }
});

bot.onText(/^(\.|\#|\/)getip$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /getip iddroplet`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^([./]{0,2})?getip\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const dropletId = match[2];

  try {
    const res = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
      headers: { Authorization: `Bearer ${apiDo}` }
    });

    const data = await res.json();

    if (!data.droplet) {
      return bot.sendMessage(chatId, `❌ VPS dengan ID *${dropletId}* tidak ditemukan.`, { parse_mode: 'Markdown' });
    }

    const droplet = data.droplet;
    const ipAddress = droplet.networks.v4.find(net => net.type === 'public')?.ip_address || 'Belum tersedia';
    const region = droplet.region.slug;
    const status = droplet.status;
    const os = droplet.image.distribution + ' ' + droplet.image.name;

    const info = `
╔═〘 🌐 VPS INFO 〙═╗
║ 🖥️ *Hostname:* ${droplet.name}
║ 🌍 *Region:* ${region}
║ ⚙️ *OS:* ${os}
║ ✅ *Status:* ${status}
║ 📡 *IP Public:* ${ipAddress}
║
║ 🆔 ID: ${droplet.id}
╚════════════════════════╝
`;

    bot.sendMessage(chatId, info.trim(), { parse_mode: 'Markdown' });

  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal mengambil IP:\n${err.message}`, { parse_mode: 'Markdown' });
  }
});

bot.onText(/^(\.|\#|\/)(kick)$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const args = msg.text.trim().split(" ");
    const targetId = args[1]; // jika user memasukkan id manual
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // cek owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    let kickId;
    if (reply) {
        kickId = reply.from.id; // kick via reply
    } else if (targetId) {
        kickId = targetId; // kick via id
    } else {
        return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh:\n/kick <id_telegram>\nAtau reply pesan target dengan /kick`, {
            reply_to_message_id: targetMessageId
        });
    }

    try {
        await bot.banChatMember(chatId, kickId); // gunakan banChatMember
        bot.sendMessage(chatId, `✅ Berhasil mengeluarkan user dengan ID: ${kickId}`);
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal mengeluarkan user!\nError: ${err.message}`);
    }
});

bot.onText(/^(\.|\#|\/)brat$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah example /brat katakatabebas`);
  });

bot.onText(/\/brat (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text) {
        return bot.sendMessage(chatId, 'Contoh penggunaan: /brat teksnya');
    }

    try {
        const imageUrl = `https://kepolu-brat.hf.space/brat?q=${encodeURIComponent(text)}`;
        const tempFilePath = './temp_sticker.webp';
        const downloadFile = async (url, dest) => {
            const writer = fs.createWriteStream(dest);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
            });

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        };

        await downloadFile(imageUrl, tempFilePath);

        await bot.sendSticker(chatId, tempFilePath);

        await fs.promises.unlink(tempFilePath);
    } catch (error) {
        console.error(error.message || error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membuat stiker. Pastikan teks valid atau coba lagi.');
    }
});

bot.onText(/^(\.|\#|\/)enchard$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // ✅ Pastikan hanya Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // ✅ Validasi jika tidak reply file
    if (!reply || !reply.document) {
        return bot.sendMessage(chatId, "⚠️ Reply file .js untuk di-encode!\nContoh:\nReply file .js lalu ketik /enchard", {
            reply_to_message_id: targetMessageId
        });
    }

    const mime = reply.document.mime_type;
    const fileName = reply.document.file_name;

    if (mime !== "application/javascript") {
        return bot.sendMessage(chatId, "❌ Hanya mendukung file .js", { reply_to_message_id: targetMessageId });
    }

    try {
        // ✅ Download file dari Telegram
        const file = await bot.getFile(reply.document.file_id);
        const filePath = file.file_path;
        const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
        const res = await fetch(url);
        const buffer = await res.buffer();

        const tempPath = `./sampah/${fileName}`;
        fs.writeFileSync(tempPath, buffer);

        await bot.sendMessage(chatId, "⏳ Memproses encrypt code . . .", { reply_to_message_id: targetMessageId });

        // ✅ Enkripsi menggunakan JsConfuser
        const obfuscated = await JsConfuser.obfuscate(buffer.toString(), {
            target: "node",
            preset: "high",
            calculator: true,
            compact: true,
            hexadecimalNumbers: true,
            controlFlowFlattening: 0.75,
            deadCode: 0.2,
            dispatcher: true,
            duplicateLiteralsRemoval: 0.75,
            flatten: true,
            globalConcealing: true,
            identifierGenerator: "randomized",
            minify: true,
            movedDeclarations: true,
            objectExtraction: true,
            opaquePredicates: 0.75,
            renameVariables: true,
            renameGlobals: true,
            shuffle: { hash: 0.5, true: 0.5 },
            stack: true,
            stringConcealing: true,
            stringCompression: true,
            stringEncoding: true,
            stringSplitting: 0.75,
            rgf: false
        });

        fs.writeFileSync(tempPath, obfuscated);

        // ✅ Kirim file hasil encrypt
        await bot.sendDocument(chatId, tempPath, {
            caption: "✅ Encrypt file sukses!",
            reply_to_message_id: targetMessageId
        });

        // ✅ Hapus file sementara
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Terjadi kesalahan saat encrypt file!", { reply_to_message_id: targetMessageId });
    }
});

bot.onText(/^(\.|\#|\/)welcome$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/welcome off\n/welcome on`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)welcome\s+(on|off)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const targetMessageId = msg.message_id;

  // ✅ Pastikan hanya Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  const status = match[2].toLowerCase();
  welcomeData[chatId] = status === "on";

  // Simpan ke file
  fs.writeFileSync(welcomeFile, JSON.stringify(welcomeData, null, 2));

  bot.sendMessage(chatId, `✅ Welcome berhasil di *${status.toUpperCase()}*`, {
    reply_to_message_id: targetMessageId,
    parse_mode: "Markdown"
  });
});

// ✅ Event: Saat ada member baru bergabung
bot.on("new_chat_members", async (msg) => {
  const chatId = msg.chat.id;
  const groupName = msg.chat.title; // ✅ Ambil nama grup
  if (!welcomeData[chatId]) return; // Jika welcome OFF, keluar

  const members = msg.new_chat_members;
  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  for (let member of members) {
    const username = member.username ? `@${member.username}` : member.first_name;
    const userId = member.id;

    const text = `👋 *Selamat Datang di group ${groupName}!* \n\n` +
                 `📌 *Username:* ${username}\n` +
                 `🆔 *ID Telegram:* ${userId}\n` +
                 `📅 *Tanggal:* ${tanggal}`;

    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }
});

bot.onText(/^(\.|\#|\/)sendtesti$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Pesan yang direply
    const channelId = "-1002920999560"; // ID Channel

    // Cek apakah user owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // Validasi harus reply gambar
    if (!reply || !reply.photo) {
        return bot.sendMessage(chatId, "⚠️ Harus reply ke gambar dengan caption!", {
            reply_to_message_id: msg.message_id
        });
    }

    // Ambil file_id foto resolusi terbesar
    const photoArray = reply.photo;
    const photoFileId = photoArray[photoArray.length - 1].file_id;

    // Ambil caption (jika ada)
    const caption = reply.caption || "";

    try {
        // Kirim ke channel dengan foto + caption
        await bot.sendPhoto(channelId, photoFileId, {
            caption: caption
        });

        bot.sendMessage(chatId, "✅ Berhasil dikirim ke channel!", {
            reply_to_message_id: msg.message_id
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengirim ke channel.", {
            reply_to_message_id: msg.message_id
        });
    }
});

bot.onText(/^(\.|\#|\/)bcgikes$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // ✅ Cek Owner
    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
        reply_to_message_id: targetMessageId,
        reply_markup: {
            inline_keyboard: [
                [{ text: "💬 Hubungi Developer", url: "https://t.me/Ranzneweraa" }]
            ]
        }
    });
}

    // ✅ Pastikan ada reply
    if (!reply) {
        return bot.sendMessage(chatId, `⚠️ Harap reply pesan yang ingin dibroadcast.\nContoh:\nBalas pesan lalu ketik /bcgikes`, {
            reply_to_message_id: targetMessageId
        });
    }

    let userList = readBCData();
    if (userList.length === 0) {
        return bot.sendMessage(chatId, "❌ Tidak ada user yang tersimpan di database untuk broadcast.", {
            reply_to_message_id: targetMessageId
        });
    }

    // ✅ Info mulai broadcast
    await bot.sendMessage(chatId, `📢 Memulai broadcast ke ${userList.length} user...`, {
        reply_to_message_id: targetMessageId
    });

    let success = 0;
    let failed = 0;

    // ✅ Copy pesan + tombol
    for (const id of [...userList]) {
        try {
            await bot.copyMessage(id, chatId, reply.message_id, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "💬 C O N T A C T   D E V E L O P E R", url: "https://t.me/Ranzneweraa" }],
                        [{ text: "🔕 S T O P   N O T I F I C A T I O N S", callback_data: "stop_notif" }]
                    ]
                }
            });
            success++;
        } catch (e) {
            failed++;
            // 🔥 Auto delete user yang gagal
            userList = userList.filter(uid => uid !== id);
        }
    }

    // ✅ Simpan database setelah hapus ID gagal
    writeBCData(userList);

    // ✅ Kirim laporan hasil broadcast
    bot.sendMessage(chatId, `✅ Broadcast selesai!\n\n📊 Hasil:\n✔️ Berhasil: ${success}\n❌ Gagal: ${failed}\n\n🗑️ ID gagal otomatis dihapus dari database.`, {
        reply_to_message_id: targetMessageId
    });
});

// 🎯 Handle Stop Notif
bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();

    if (query.data === "stop_notif") {
        // 🔥 Hapus user dari database broadcast
        let userList = readBCData();
        userList = userList.filter(uid => uid !== userId);
        writeBCData(userList);

        await bot.answerCallbackQuery(query.id); // hilangkan loading
        return bot.sendMessage(chatId, 
`📢 I N F O R M A T I O N
YOU HAVE ALREADY TURNED OFF NOTIFICATIONS, SO IN THE COMING DAYS YOU WILL NOT RECEIVE INFORMATION REGARDING STOCK, UPDATES, AND OTHER MESSAGES FROM THE BOT.
TO REACTIVATE, TYPE:
/notifon`);
    }
});

// ✅ Command untuk aktifkan notif lagi
bot.onText(/^\/notifon$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    let userList = readBCData();

    if (!userList.includes(userId)) {
        userList.push(userId);
        writeBCData(userList);
        return bot.sendMessage(chatId, "✅ Notifikasi berhasil diaktifkan kembali!\nAnda akan menerima update dari bot.");
    } else {
        return bot.sendMessage(chatId, "ℹ️ Notifikasi sudah dalam keadaan aktif.");
    }
});

bot.onText(/^(\.|\#|\/)bcgikes1$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Pesan yang direply
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // ✅ Cek Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [[{ text: "💬 HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    // ✅ Pastikan ada reply
    if (!reply) {
        return bot.sendMessage(chatId, `⚠️ Harap reply pesan yang ingin dibroadcast.\nContoh:\nBalas pesan lalu ketik /bcgikes1`, {
            reply_to_message_id: targetMessageId
        });
    }

    const userList = readBCData(); // Ambil daftar user dari saveidbc.json
    if (userList.length === 0) {
        return bot.sendMessage(chatId, "❌ Tidak ada user yang tersimpan di database untuk broadcast.", {
            reply_to_message_id: targetMessageId
        });
    }

    // ✅ Info mulai broadcast
    await bot.sendMessage(chatId, `📢 Memulai broadcast ke ${userList.length} user...`, {
        reply_to_message_id: targetMessageId
    });

    let success = 0;
    let failed = 0;

    // ✅ Kirim pesan ke semua user (pakai sendMessage agar bisa kasih tombol)
    for (const id of userList) {
        try {
            await bot.sendMessage(id, reply.text || "📢 Pesan broadcast dari admin:", {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "💬 HUBUNGI DEVELOPER", url: "https://t.me/Ranzneweraa" }
                    ]
                    ]
                },
                parse_mode: "Markdown"
            });
            success++;
        } catch (e) {
            failed++;
        }
    }

    // ✅ Kirim laporan hasil broadcast
    bot.sendMessage(chatId, `✅ Broadcast selesai!\n\n📊 Hasil:\n✔️ Berhasil: ${success}\n❌ Gagal: ${failed}`, {
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^(\.|\#|\/)bcgikes2$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Pesan yang direply
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // ✅ Cek Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // ✅ Pastikan ada reply
    if (!reply) {
        return bot.sendMessage(chatId, `⚠️ Harap reply pesan (gambar/teks/dokumen) yang ingin dibroadcast.\nContoh: Balas pesan lalu ketik /bcgikes2`, {
            reply_to_message_id: targetMessageId
        });
    }

    const userList = readBCData(); // Ambil data user dari saveidbc.json

    if (userList.length === 0) {
        return bot.sendMessage(chatId, "❌ Tidak ada user yang tersimpan di database untuk broadcast.", {
            reply_to_message_id: targetMessageId
        });
    }

    await bot.sendMessage(chatId, `📢 Memulai broadcast ke ${userList.length} user...`, {
        reply_to_message_id: targetMessageId
    });

    let success = 0;
    let failed = 0;

    for (const id of userList) {
        try {
            await bot.forwardMessage(id, chatId, reply.message_id);
            success++;
        } catch (e) {
            failed++;
        }
    }

    await bot.sendMessage(chatId, `✅ Broadcast selesai!\n\n📊 Hasil:\n✔️ Berhasil: ${success}\n❌ Gagal: ${failed}`, {
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^(\.|\#|\/)total$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const targetMessageId = msg.message_id;

    // Pastikan hanya owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // Ambil data
    const data = readBCData();
    const totalUsers = data.length;

    // Kirim pesan
    bot.sendMessage(chatId, `📊 Total Pengguna Bot: *${totalUsers}*`, {
        parse_mode: "Markdown",
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^\/saveidbc(?:\s+(\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    let targetId = match[1]; // Ambil ID dari input
    if (!targetId && reply) {
        targetId = reply.from.id.toString(); // Ambil ID dari reply
    }

    if (!targetId) {
        return bot.sendMessage(chatId, "⚠️ Format salah!\n\nContoh penggunaan:\n`/saveidbc 123456789`\natau reply pesan pengguna lalu ketik `/saveidbc`", {
            reply_to_message_id: targetMessageId,
            parse_mode: "Markdown"
        });
    }

    let data = readBCData();

    if (data.includes(targetId)) {
        return bot.sendMessage(chatId, `✅ ID *${targetId}* sudah ada dalam daftar.`, {
            reply_to_message_id: targetMessageId,
            parse_mode: "Markdown"
        });
    }

    data.push(targetId);
    writeBCData(data);

    return bot.sendMessage(chatId, `✅ ID *${targetId}* berhasil disimpan!`, {
        reply_to_message_id: targetMessageId,
        parse_mode: "Markdown"
    });
});

bot.onText(/^\/listidbc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== owner) return bot.sendMessage(chatId, "❌ Akses ditolak!", { reply_to_message_id: msg.message_id });

    let data = readBCData();
    if (data.length === 0) {
        return bot.sendMessage(chatId, "📂 Tidak ada ID yang tersimpan.", { reply_to_message_id: msg.message_id });
    }

    let text = "📂 *Daftar ID Broadcast:*\n\n";
    data.forEach((id, i) => { text += `${i + 1}. \`${id}\`\n`; });

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
});

bot.onText(/^(\.|\#|\/)delidbc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/RafatharCode" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delidbc <62374848484>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/delidbc\s+(\d+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const targetId = match[1];

    if (userId !== owner) return bot.sendMessage(chatId, "❌ Akses ditolak!", { reply_to_message_id: msg.message_id });

    let data = readBCData();
    if (!data.includes(targetId)) {
        return bot.sendMessage(chatId, `❌ ID *${targetId}* tidak ditemukan.`, { parse_mode: "Markdown" });
    }

    data = data.filter(id => id !== targetId);
    writeBCData(data);
    bot.sendMessage(chatId, `✅ ID *${targetId}* berhasil dihapus.`, { parse_mode: "Markdown" });
});

bot.onText(/^\/clearidbc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== owner) return bot.sendMessage(chatId, "❌ Akses ditolak!", { reply_to_message_id: msg.message_id });

    writeBCData([]);
    bot.sendMessage(chatId, "✅ Semua ID berhasil dihapus!", { reply_to_message_id: msg.message_id });
});

bot.onText(/^(\.|\#|\/)saveidch(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    const inputId = match[2]; // ID channel dari command

    // Cek Apakah User Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    if (!inputId) {
        return bot.sendMessage(chatId, "⚠️ Format salah!\nContoh penggunaan:\n`/saveidch -1001234567890`", {
            reply_to_message_id: targetMessageId,
            parse_mode: "Markdown"
        });
    }

    try {
        // Baca file JSON
        const data = JSON.parse(fs.readFileSync(saveidchFile, "utf8"));

        if (data.includes(inputId)) {
            return bot.sendMessage(chatId, `✅ ID channel sudah tersimpan sebelumnya:\n\`${inputId}\``, {
                parse_mode: "Markdown",
                reply_to_message_id: targetMessageId
            });
        }

        // Tambahkan ID ke file
        data.push(inputId);
        fs.writeFileSync(saveidchFile, JSON.stringify(data, null, 2));

        bot.sendMessage(chatId, `✅ ID channel berhasil disimpan:\n\`${inputId}\``, {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });

    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menyimpan ID channel.", {
            reply_to_message_id: targetMessageId
        });
    }
});

// ✅ LISTIDCH
bot.onText(/^(\.|\#|\/)listidch$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId
        });
    }

    let data = readData2();

    if (data.length === 0) {
        return bot.sendMessage(chatId, "📂 Tidak ada ID channel yang tersimpan.", {
            reply_to_message_id: targetMessageId
        });
    }

    const list = data.map((id, i) => `${i + 1}. \`${id}\``).join("\n");

    bot.sendMessage(chatId, `📜 *Daftar ID Channel:*\n\n${list}`, {
        parse_mode: "Markdown",
        reply_to_message_id: targetMessageId
    });
});

// ✅ DELETEIDCH
bot.onText(/^(\.|\#|\/)delidch(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const inputId = match[2];
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId
        });
    }

    if (!inputId) {
        return bot.sendMessage(chatId, "⚠️ Format salah!\nContoh: `/deleteidch -1001234567890`", {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });
    }

    let data = readData2();

    if (!data.includes(inputId)) {
        return bot.sendMessage(chatId, `❌ ID tidak ditemukan:\n\`${inputId}\``, {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });
    }

    data = data.filter(id => id !== inputId);
    writeData2(data);

    bot.sendMessage(chatId, `✅ ID berhasil dihapus:\n\`${inputId}\``, {
        parse_mode: "Markdown",
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^(\.|\#|\/)clearidch$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId
        });
    }

    writeData2([]);

    bot.sendMessage(chatId, "✅ Semua ID channel berhasil dihapus (reset).", {
        reply_to_message_id: targetMessageId
    });
});

// Command JPMGC
bot.onText(/^(\.|\#|\/)jpmgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
            }
        });
    }

    // Validasi reply
    if (!reply || (!reply.photo && !reply.caption)) {
        return bot.sendMessage(chatId, "⚠️ Reply gambar dengan teks untuk broadcast ke group!", {
            reply_to_message_id: targetMessageId
        });
    }

    const groups = readData();
    if (groups.length === 0) {
        return bot.sendMessage(chatId, "⚠️ Tidak ada group tersimpan di saveidgc.json!", {
            reply_to_message_id: targetMessageId
        });
    }

    // Ambil data gambar
    const photoId = reply.photo ? reply.photo[reply.photo.length - 1].file_id : null;
    const caption = reply.caption || "";

    // Kirim ke semua group
    let success = 0;
    for (const groupId of groups) {
        try {
            if (photoId) {
                await bot.sendPhoto(groupId, photoId, { caption: caption });
            } else {
                await bot.sendMessage(groupId, caption);
            }
            success++;
        } catch (error) {
            console.error(`Gagal kirim ke ${groupId}:`, error.message);
        }
    }

    bot.sendMessage(chatId, `✅ Broadcast selesai!\nBerhasil terkirim ke ${success}/${groups.length} grup.`, {
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^(\.|\#|\/)jpmch$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Pesan yang di-reply
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    if (!reply) {
        return bot.sendMessage(chatId, "⚠️ Harap reply gambar + teks yang ingin dikirim!", {
            reply_to_message_id: targetMessageId
        });
    }

    const caption = reply.caption || "";
    const photo = reply.photo ? reply.photo[reply.photo.length - 1].file_id : null;

    if (!photo) {
        return bot.sendMessage(chatId, "⚠️ Pesan yang Anda reply tidak mengandung gambar!", {
            reply_to_message_id: targetMessageId
        });
    }

    // Ambil daftar ID channel
    const channels = readData2();
    if (channels.length === 0) {
        return bot.sendMessage(chatId, "⚠️ Tidak ada ID channel tersimpan! Gunakan perintah /saveidch untuk menambahkannya.", {
            reply_to_message_id: targetMessageId
        });
    }

    // Kirim ke semua channel
    let success = 0;
    for (const channelId of channels) {
        try {
            await bot.sendPhoto(channelId, photo, { caption: caption });
            success++;
        } catch (err) {
            console.error(`Gagal kirim ke ${channelId}:`, err.message);
        }
    }

    bot.sendMessage(chatId, `✅ Berhasil mengirim ke ${success} channel.`, {
        reply_to_message_id: targetMessageId
    });
});

bot.onText(/^(\.|\#|\/)saveidgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/saveidgc <-1002742208323>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)saveidgc (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Cek Apakah User Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: targetMessageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    const groupId = match[2].trim(); // ID group yang dimasukkan user

    if (!groupId) {
        return bot.sendMessage(chatId, "⚠️ Format salah!\nContoh penggunaan:\n/saveidgc 1234567890", {
            reply_to_message_id: targetMessageId
        });
    }

    try {
        // Baca data yang ada
        let data = JSON.parse(fs.readFileSync(saveidgcFile, "utf-8"));

        // Cek jika ID group sudah ada
        if (data.includes(groupId)) {
            return bot.sendMessage(chatId, "✅ ID Group sudah tersimpan sebelumnya.", {
                reply_to_message_id: targetMessageId
            });
        }

        // Tambahkan ID Group baru
        data.push(groupId);

        // Simpan kembali ke file
        fs.writeFileSync(saveidgcFile, JSON.stringify(data, null, 2));

        bot.sendMessage(chatId, `✅ ID Group berhasil disimpan!\nID: ${groupId}`, {
            reply_to_message_id: targetMessageId
        });

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menyimpan ID Group.", {
            reply_to_message_id: targetMessageId
        });
    }
});

// ✅ LIST ID GROUP
bot.onText(/^(\.|\#|\/)listidgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", { reply_to_message_id: targetMessageId });
    }

    let data = readData();

    if (data.length === 0) {
        return bot.sendMessage(chatId, "📂 Tidak ada ID Group yang tersimpan.", { reply_to_message_id: targetMessageId });
    }

    let list = data.map((id, index) => `${index + 1}. ${id}`).join("\n");
    bot.sendMessage(chatId, `📂 Daftar ID Group:\n\n${list}`, { reply_to_message_id: targetMessageId });
});

bot.onText(/^(\.|\#|\/)delidgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delidgc <-1002742208323>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)delidgc (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", { reply_to_message_id: targetMessageId });
    }

    const groupId = match[2].trim();
    let data = readData();

    if (!data.includes(groupId)) {
        return bot.sendMessage(chatId, "⚠️ ID Group tidak ditemukan.", { reply_to_message_id: targetMessageId });
    }

    data = data.filter(id => id !== groupId);
    writeData(data);

    bot.sendMessage(chatId, `✅ ID Group ${groupId} berhasil dihapus.`, { reply_to_message_id: targetMessageId });
});

// ✅ CLEAR SEMUA ID GROUP
bot.onText(/^(\.|\#|\/)clearidgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", { reply_to_message_id: targetMessageId });
    }

    writeData([]);
    bot.sendMessage(chatId, "✅ Semua ID Group berhasil dihapus.", { reply_to_message_id: targetMessageId });
});

bot.onText(/^\/sewabot$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const username = msg.from.username || msg.from.first_name;
    const allowedGroups = getAllowedGroups();

    // ✅ Validasi: hanya private chat atau grup yang diizinkan
    if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
        return bot.sendMessage(chatId, "❌ Sewa bot hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
    }

    const paketSewa = {
        "5 Hari": 15000,
        "1 Minggu": 20000,
        "1 Bulan": 25000,
        "Permanen": 30000
    };

    if (activeDeposit[userId]) {  
        return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik /batalbeli untuk membatalkan.");  
    }  

    // ✅ Tampilkan pilihan paket  
    const buttons = Object.keys(paketSewa).map(name => [{ text: `${name} - Rp${paketSewa[name].toLocaleString()}`, callback_data: `sewa_${name}` }]);  
    return bot.sendMessage(chatId, `🛒 *Pilih Paket Sewa Bot*`, {  
        parse_mode: "Markdown",  
        reply_markup: { inline_keyboard: buttons }  
    });
});

// Callback handler tetap sama seperti sebelumnya
bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();
    const username = query.from.username || query.from.first_name;

    if (!query.data.startsWith("sewa_")) return;

    const paketSewa = {
        "5 Hari": 15000,
        "1 Minggu": 20000,
        "1 Bulan": 25000,
        "Permanen": 30000
    };

    const paket = query.data.replace("sewa_", "");  
    const harga = paketSewa[paket];  
    const reff = `SEWA-${Math.floor(Math.random() * 1000000)}`;  

    try {
        // ✅ Buat pembayaran QRIS
        const payload = qs.stringify({  
            api_key: settings.ApikeyAtlantic,  
            reff_id: reff,  
            nominal: harga,  
            type: 'ewallet',  
            metode: 'qris'  
        });  

        const res = await axios.post('https://atlantich2h.com/deposit/create', payload, {  
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        });  

        const data = res.data;  
        if (!data.status) {  
            return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Coba lagi."}`);  
        }  

        const info = data.data;  
        const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });  

        const teks = `
🛒 Sewa Bot Telegram
━━━━━━━━━━━━━━━━━━
📦 Paket: ${paket}
💰 Harga: Rp${harga.toLocaleString()}
🆔 Kode Transaksi: ${reff}
⏰ Batas Waktu: 5 Menit

📷 Scan QR di atas untuk pembayaran
`.trim();

        const sentMsg = await bot.sendPhoto(chatId, qrImage, {  
            caption: teks,  
            parse_mode: "Markdown",  
            reply_markup: {  
                inline_keyboard: [[{ text: "❌ Batalkan", callback_data: "batalbuy" }]]  
            }  
        });  

        activeDeposit[userId] = {  
            msgId: sentMsg.message_id,  
            chatId,  
            idDeposit: info.reff_id,  
            id: info.id,  
            paket,  
            harga,  
            status: true,  
            timeout: setTimeout(async () => {  
                if (activeDeposit[userId]?.status) {  
                    await bot.sendMessage(chatId, "⏰ QRIS telah expired.");  
                    await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });  
                    delete activeDeposit[userId];  
                }  
            }, 300000)  
        };  

        // ✅ Loop cek status pembayaran  
        while (activeDeposit[userId] && activeDeposit[userId].status) {  
            await new Promise(res => setTimeout(res, 5000));  
            const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({  
                api_key: settings.ApikeyAtlantic,  
                id: activeDeposit[userId].id  
            }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);  

            const status = check?.data;  
            if (status && status.status !== 'pending') {  
                activeDeposit[userId].status = false;  
                clearTimeout(activeDeposit[userId].timeout);  

                // ✅ Instant Confirm  
                await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({  
                    api_key: settings.ApikeyAtlantic,  
                    id: activeDeposit[userId].id,  
                    action: true  
                }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });  

                const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");  

                await bot.deleteMessage(chatId, activeDeposit[userId].msgId).catch(() => { });  
                await bot.sendMessage(chatId, `
✅ Pembayaran Berhasil!
━━━━━━━━━━━━━━━━━━━━
📦 Paket: ${paket}
💰 Harga: Rp${harga.toLocaleString()}
📆 Tanggal: ${waktu}

📌 Silakan hubungi Admin untuk pembuatan grup:
👉 t.me/RafatharCode
Sertakan bukti pembayaran!
`.trim(), { parse_mode: "Markdown" });

                delete activeDeposit[userId];  
            }  
        }  
    } catch (err) {  
        console.error("SEWA ERROR:", err.response?.data || err.message);  
        return bot.sendMessage(chatId, "❌ Gagal memproses pembayaran. Coba lagi.");  
    }
});

bot.onText(/^(\.|\#|\/)garansi$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    
    bot.sendMessage(
        chatId,
        `❌ Harap reply dengan bukti transaksi (foto/dokumen) untuk klaim garansi`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)claimgaransi$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
    
    bot.sendMessage(
        chatId,
        `❌ Harap reply dengan bukti transaksi (foto/dokumen) untuk klaim garansi`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^(\.|\#|\/)(garansi|claimgaransi)\s+(.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const namaBarang = match[3];
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    const ownerId = owner; // ID Telegram Owner

    // Cek apakah user reply + ada media
    if (!reply || (!reply.photo && !reply.document)) {
        return bot.sendMessage(chatId, "❌ Harap reply dengan bukti transaksi (foto/dokumen) untuk klaim garansi.", {
            parse_mode: "Markdown",
            reply_to_message_id: targetMessageId
        });
    }

    try {
        // Kirim notifikasi ke Owner + tombol balas
        await bot.sendMessage(ownerId, `🛡️ *Klaim Garansi Baru*\n\n👤 Dari: [${msg.from.first_name}](tg://user?id=${userId})\n💬 Chat ID: ${chatId}\n📦 Barang: *${namaBarang}*`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔄 BALAS USER", callback_data: `mereply_${chatId}_${userId}` }]
                ]
            }
        });

        // Forward bukti transaksi ke Owner
        await bot.forwardMessage(ownerId, chatId, reply.message_id);

        // Kirim notifikasi ke user + tombol balas balik ke Owner
        await bot.sendMessage(chatId, "✅ Klaim garansi kamu sudah dikirim ke Owner, tunggu konfirmasi.\n\nKamu juga bisa balas langsung ke Owner:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔄 BALAS OWNER", callback_data: `mereply_${ownerId}_${userId}` }]
                ]
            },
            reply_to_message_id: targetMessageId
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengirim klaim garansi ke Owner.", {
            reply_to_message_id: targetMessageId
        });
    }
});

// Handle tombol BALAS (bisa dari Owner atau User)
bot.on("callback_query", async (callbackQuery) => {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;

    if (data.startsWith("mereply_")) {
        const parts = data.split("_");
        const targetChatId = parts[1];
        const targetUserId = parts[2];

        await bot.sendMessage(msg.chat.id, "✍️ Silakan ketik balasan Anda (teks atau media):", {
            reply_markup: { force_reply: true }
        }).then((sentMsg) => {
            bot.onReplyToMessage(sentMsg.chat.id, sentMsg.message_id, async (replyMsg) => {
                try {
                    if (replyMsg.text) {
                        await bot.sendMessage(targetChatId, `📬 *Balasan Garansi:*\n${replyMsg.text}`, { parse_mode: "Markdown" });
                    } else {
                        await bot.sendMessage(targetChatId, `📬 *Balasan Garansi:*`, { parse_mode: "Markdown" });
                        await bot.copyMessage(targetChatId, replyMsg.chat.id, replyMsg.message_id);
                    }
                    await bot.sendMessage(msg.chat.id, "✅ Balasan berhasil dikirim.");
                } catch (err) {
                    console.error(err);
                    await bot.sendMessage(msg.chat.id, "❌ Gagal mengirim balasan.");
                }
            });
        });
    }
});

bot.onText(/^(\.|\#|\/)chatlimit$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    const ownerId = owner; // Ganti dengan ID Telegram Owner

    if (!reply) {
        return bot.sendMessage(chatId, "❌ Harap reply ke pesan yang ingin dikirim ke Owner.", {
            reply_to_message_id: targetMessageId
        });
    }

    try {
        // Kirim notifikasi ke Owner + tombol balas
        await bot.sendMessage(ownerId, `📩 *Chat Limit Request*\nDari: [${msg.from.first_name}](tg://user?id=${userId})\nChat ID: ${chatId}`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔄 BALAS", callback_data: `reply_${chatId}_${userId}` }]
                ]
            }
        });

        // Forward pesan user ke Owner
        await bot.forwardMessage(ownerId, chatId, reply.message_id);

        // Konfirmasi ke user
        await bot.sendMessage(chatId, "✅ Pesan berhasil dikirim ke Owner.", {
            reply_to_message_id: targetMessageId
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengirim pesan ke Owner.", {
            reply_to_message_id: targetMessageId
        });
    }
});

// Handle tombol BALAS dari Owner
bot.on("callback_query", async (callbackQuery) => {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;

    if (data.startsWith("reply_")) {
        const parts = data.split("_");
        const targetChatId = parts[1];
        const targetUserId = parts[2];

        await bot.sendMessage(msg.chat.id, "✍️ Kirim balasan Anda (teks atau media):", {
            reply_markup: { force_reply: true }
        }).then((sentMsg) => {
            bot.onReplyToMessage(sentMsg.chat.id, sentMsg.message_id, async (replyMsg) => {
                try {
                    if (replyMsg.text) {
                        // Jika balasan berupa teks
                        await bot.sendMessage(targetChatId, `📬 *Balasan dari Owner:*\n${replyMsg.text}`, { parse_mode: "Markdown" });
                    } else {
                        // Jika balasan berupa media (foto, dokumen, video, audio, dll)
                        const fileId = Object.values(replyMsg)[0]?.file_id;
                        const type = Object.keys(replyMsg).find(k => replyMsg[k]?.file_id);
                        if (fileId && type) {
                            await bot.sendChatAction(targetChatId, "upload_document");
                            await bot.sendMessage(targetChatId, `📬 *Balasan dari Owner:*`, { parse_mode: "Markdown" });
                            await bot.copyMessage(targetChatId, replyMsg.chat.id, replyMsg.message_id);
                        }
                    }
                    await bot.sendMessage(msg.chat.id, "✅ Balasan berhasil dikirim ke user.");
                } catch (err) {
                    console.error(err);
                    await bot.sendMessage(msg.chat.id, "❌ Gagal mengirim balasan ke user.");
                }
            });
        });
    }
});

bot.onText(/^([./]{0,2})?buyapikey\s*(.+)?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const username = msg.from.username || msg.from.first_name || "Tidak Diketahui";
  const text = match[2];
  const allowedGroups = getAllowedGroups();

  // ✅ Validasi: hanya private chat ATAU grup yang terdaftar
  if (msg.chat.type !== 'private' && !allowedGroups.includes(chatId)) {
    return bot.sendMessage(chatId, "❌ Pembelian hanya bisa dilakukan via chat pribadi atau grup yang terdaftar.\nGrup terdaftar:\nhttps://t.me/groupcreateweb");
  }

  if (activeApikey[userId]) {
    return bot.sendMessage(chatId, "❗ Masih ada transaksi aktif.\nKetik .batalbeli untuk membatalkan.");
  }

  if (!text) {
    return bot.sendMessage(chatId, "⚠️ Format salah!\n\nGunakan: `.buyapikey namaapikey|durasi`\nContoh: `.buyapikey namaku|1d`", { parse_mode: "Markdown" });
  }

  let [namaapikey, durasi] = text.split("|");
  if (!namaapikey || !durasi) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh: `.buyapikey namaku|1d`", { parse_mode: "Markdown" });
  }

  // Hitung harga berdasarkan durasi (per hari Rp5000)
  let jumlahHari = parseInt(durasi.replace("d", ""));
  if (isNaN(jumlahHari) || jumlahHari <= 0) {
    return bot.sendMessage(chatId, "❌ Durasi tidak valid!\nContoh: `.buyapikey namaku|1d` (1 hari)", { parse_mode: "Markdown" });
  }
  const harga = jumlahHari * 5000;
  const reff = `APIKEY-${Math.floor(Math.random() * 1000000)}`;

  try {
    // ===== Request QRIS =====
    const depositData = qs.stringify({
      api_key: settings.ApikeyAtlantic,
      reff_id: reff,
      nominal: harga,
      type: 'ewallet',
      metode: 'qris'
    });

    const res = await axios.post('https://atlantich2h.com/deposit/create', depositData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = res.data;
    if (!data.status) {
      return bot.sendMessage(chatId, `❌ Gagal membuat QRIS.\n${data.message || "Silakan coba lagi."}`);
    }

    const info = data.data;
    const qrImage = await QRCode.toBuffer(info.qr_string, { type: 'png' });

    const teks = `┏━━━━━━━━━━━━━━━━━━━━┓
┃🔑 PEMBELIAN APIKEY 🔑
┗━━━━━━━━━━━━━━━━━━━━┛
🆔 Kode Transaksi: ${reff}
🙎 User: @${username} (${userId})
🔑 APIKey: ${namaapikey}
⏳ Durasi: ${durasi}
💰 Harga: Rp${toRupiah(harga)}
⏰ Batas Waktu: 5 Menit
📷 Scan QR di atas untuk pembayaran
━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Catatan Penting:
• Jangan tutup Telegram selama proses berlangsung
• APIKey akan otomatis aktif setelah pembayaran`;

    const sentMsg = await bot.sendPhoto(chatId, qrImage, {
      caption: teks,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [[{ text: "❌ Batalkan Buy", callback_data: "batalbuyapikey" }]] }
    });

    activeApikey[userId] = {
      msgId: sentMsg.message_id,
      chatId,
      idDeposit: info.reff_id,
      id: info.id,
      namaapikey,
      durasi,
      status: true,
      timeout: setTimeout(async () => {
        if (activeApikey[userId]?.status) {
          await bot.sendMessage(chatId, "⏰ QRIS telah *expired*.");
          await bot.deleteMessage(chatId, activeApikey[userId].msgId).catch(() => { });
          delete activeApikey[userId];
        }
      }, 300000) // 5 menit
    };

    // ===== Loop status pembayaran =====
    while (activeApikey[userId] && activeApikey[userId].status) {
      await sleep(5000);
      const check = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
        api_key: settings.ApikeyAtlantic,
        id: activeApikey[userId].id
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(r => r.data).catch(() => null);

      const status = check?.data;
      if (status && status.status !== 'pending') {
        activeApikey[userId].status = false;
        clearTimeout(activeApikey[userId].timeout);

        await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
          api_key: settings.ApikeyAtlantic,
          id: activeApikey[userId].id,
          action: true
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => { });

        // ✅ Buat APIKey otomatis
        await addapikey(chatId, `${namaapikey}|${durasi}`, msg.message_id);

        await bot.deleteMessage(chatId, activeApikey[userId].msgId).catch(() => { });
        await bot.sendMessage(chatId, `✅ Pembayaran berhasil!\nAPIKey kamu sudah aktif: \`${namaapikey}\`\nUntuk cekapikey mu tekan /cekapikey <namaapikey>`, { parse_mode: "Markdown" });

        // 🔔 Kirim notifikasi ke owner
        const waktu = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        const notifikasi = `📢 PEMBELIAN APIKEY BERHASIL!
━━━━━━━━━━━━━━━━━━━━━━━
🙎 User: @${username} (${userId})
🔑 APIKey: ${namaapikey}
⏳ Durasi: ${durasi}
💰 Harga: Rp${toRupiah(harga)}
📆 Tanggal: ${waktu}`;
        await bot.sendMessage(owner, notifikasi, { parse_mode: "Markdown" }).catch(() => { });

        delete activeApikey[userId];
      }
    }

  } catch (err) {
  console.error("BUY APIKEY ERROR:", err.response?.data || err.message);
}
});

// ✅ Handler untuk tombol Batalkan Deposit
bot.on('callback_query', async (query) => {
  const userId = query.from.id.toString();
  const chatId = query.message.chat.id;

  if (query.data === "batalbuyapikey") {
    if (activeApikey[userId]) {
      clearTimeout(activeApikey[userId].timeout);
      await bot.deleteMessage(chatId, activeApikey[userId].msgId).catch(() => { });
      delete activeApikey[userId];
      await bot.answerCallbackQuery(query.id, { text: "✅ Buy apikey dibatalkan." });
      await bot.sendMessage(chatId, "✅ Buy apikey berhasil dibatalkan.");
    } else {
      await bot.answerCallbackQuery(query.id, { text: "Tidak ada transaksi aktif." });
    }
  }
});

// Add API Key
bot.onText(/^(\.|\#|\/)addapikey$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nContoh: /addapikey <nama>|<durasi>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/^(\.|#|\/)addapikey (.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;
  const text = match[2];

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId
    });
  }

  await addapikey(chatId, text, targetMessageId);
});

// Delete API Key
bot.onText(/^(\.|\#|\/)delapikey$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nGunakan: /delapikey <apikey>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/^(\.|#|\/)delapikey (.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;
  const text = match[2];

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId
    });
  }

  await delapikey(chatId, text, targetMessageId);
});

// List API Key
bot.onText(/^(\.|#|\/)listapikey$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId
    });
  }

  await listapikey(chatId, targetMessageId);
});

// Cek API Key
bot.onText(/^(\.|#|\/)cekapikey (.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;
  const text = match[2];

  await cekapikey(chatId, text, targetMessageId);
});


// =======================
// 📌 FUNCTIONS
// =======================
async function addapikey(chatId, text, targetMessageId) {
  if (!text) return bot.sendMessage(chatId, "⚠️ Format salah!\nGunakan: /addapikey apikey_baru|1d", {
    reply_to_message_id: targetMessageId
  });

  let [newKey, expired] = text.split("|");
  if (!newKey || !expired) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh: /addapikey tester|1d", {
      reply_to_message_id: targetMessageId
    });
  }

  try {
    let api = Resapiku;
    let res = await fetch(`https://restapi.rafatharcode.apibotwa.biz.id/api/addapikey?apikey=${api}&new_key=${newKey}&expired=${expired}`);
    let data = await res.json();

    if (data.status) {
      bot.sendMessage(chatId, `✅ Berhasil menambahkan API Key!\n\n🌐 Rest API: https://restapi.rafatharcode.apibotwa.biz.id\n🔑 Key: ${newKey}\n⏳ Expired: ${expired}`, {
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, `❌ Gagal menambahkan API Key:\n${data.message || "Unknown error"}`, {
        reply_to_message_id: targetMessageId
      });
    }
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "‼️ Terjadi kesalahan saat mengakses API", {
      reply_to_message_id: targetMessageId
    });
  }
}

async function delapikey(chatId, text, targetMessageId) {
  if (!text) return bot.sendMessage(chatId, "⚠️ Format salah!\nGunakan: /delapikey <apikey>", {
    reply_to_message_id: targetMessageId
  });

  let apikeyDel = text.trim();
  let api = Resapiku;

  try {
    let res = await fetch(`https://restapi.rafatharcode.apibotwa.biz.id/api/deleteapikey?apikey=${api}&apikeydel=${apikeyDel}`);
    let data = await res.json();

    if (data.status) {
      bot.sendMessage(chatId, `✅ API Key berhasil dihapus!\n\n🔑 Key: ${apikeyDel}`, {
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, `❌ Gagal menghapus API Key:\n${data.message || "Unknown error"}`, {
        reply_to_message_id: targetMessageId
      });
    }
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "‼️ Terjadi kesalahan saat mengakses API", {
      reply_to_message_id: targetMessageId
    });
  }
}

async function listapikey(chatId, targetMessageId) {
  try {
    let api = Resapiku;
    let res = await fetch(`https://restapi.rafatharcode.apibotwa.biz.id/api/listapikey?apikey=${api}`);
    let json = await res.json();

    if (!json.status) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil daftar API Key:\n" + (json.message || "Unknown error"), {
        reply_to_message_id: targetMessageId
      });
    }

    let teks = "==============================\n";
    teks += "🔑 *List API Key Terdaftar:*\n";
    teks += "==============================\n\n";
    json.data.forEach((key, i) => {
      teks += `#️⃣ ${i + 1}\n`;
      teks += `🔐 Key: ${key.key}\n`;
      teks += `⏳ Expired: ${key.expired}\n`;
      teks += "------------------------------\n";
    });
    teks += `📊 Total API Key: ${json.data.length}\n`;
    teks += "==============================";

    bot.sendMessage(chatId, teks, { reply_to_message_id: targetMessageId });
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat mengambil data API key", {
      reply_to_message_id: targetMessageId
    });
  }
}

async function cekapikey(chatId, text, targetMessageId) {
  if (!text) return bot.sendMessage(chatId, "⚠️ Format salah!\nGunakan: /cekapikey apikey", {
    reply_to_message_id: targetMessageId
  });

  let apikey = text.trim();
  try {
    let res = await fetch(`https://restapi.rafatharcode.apibotwa.biz.id/api/cekapikey?apikey=${apikey}`);
    let data = await res.json();

    if (data.status) {
      bot.sendMessage(chatId, `✅ API Key Ditemukan!\n\n🧑‍💻 Creator: ${data.creator}\n🔑 Key: ${data.apikey}\n⏳ Expired: ${data.expired}`, {
        reply_to_message_id: targetMessageId
      });
    } else {
      bot.sendMessage(chatId, `❌ API Key tidak ditemukan:\n${data.message || "Unknown error"}`, {
        reply_to_message_id: targetMessageId
      });
    }
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "‼️ Terjadi kesalahan saat memeriksa API Key", {
      reply_to_message_id: targetMessageId
    });
  }
}

// ================= AUTOREPLY SYSTEM =================

// ✅ Add Autoreply
bot.onText(/^(\.|\#|\/)addautoreply$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nContoh: /addautoreply <keyword> | <balasan>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/addautoreply\s+([\s\S]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  // Hanya owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa menggunakan perintah ini.", {
      reply_to_message_id: msg.message_id
    });
  }

  const text = match[1].trim();
  const parts = text.split("|");

  if (parts.length < 2) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\nContoh: /addautoreply <keyword> | <balasan>",
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

  const keyword = parts[0].trim().toLowerCase();
  const replyText = parts.slice(1).join("|").trim(); // semua setelah | ikut

  autoreplyData[keyword] = replyText;
  saveAutoreply();

  bot.sendMessage(
    chatId,
    `✅ Autoreply ditambahkan!\n\n*Keyword:* ${keyword}\n*Balasan:* ${replyText}`,
    { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
  );
});

// ✅ Delete Autoreply
bot.onText(/^(\.|\#|\/)delautoreply$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `❌ Format salah!\nContoh: /delautoreply <keyword>`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/delautoreply\s+(.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa menggunakan perintah ini.", {
      reply_to_message_id: msg.message_id
    });
  }

  const keyword = match[1].trim().toLowerCase();

  if (!autoreplyData[keyword]) {
    return bot.sendMessage(chatId, `❌ Keyword *${keyword}* tidak ditemukan!`, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  delete autoreplyData[keyword];
  saveAutoreply();

  bot.sendMessage(
    chatId,
    `✅ Autoreply dengan keyword *${keyword}* berhasil dihapus.`,
    { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
  );
});

// ✅ Reset Autoreply
bot.onText(/^\/resetautoreply$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa menggunakan perintah ini.", {
      reply_to_message_id: msg.message_id
    });
  }

  if (Object.keys(autoreplyData).length === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada data *autoreply* untuk dihapus.", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  autoreplyData = {};
  saveAutoreply();

  bot.sendMessage(chatId, "✅ Semua *autoreply* berhasil dihapus.", {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id
  });
});

// ✅ List Autoreply
bot.onText(/^\/listautoreply$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa menggunakan perintah ini.", {
      reply_to_message_id: msg.message_id
    });
  }

  if (Object.keys(autoreplyData).length === 0) {
    return bot.sendMessage(chatId, "❌ Belum ada data *autoreply* tersimpan.", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  let list = "📌 *Daftar Autoreply:*\n\n";
  const keyboard = [];
  let i = 1;

  for (const [keyword, replyText] of Object.entries(autoreplyData)) {
    list += `${i++}. *${keyword}* → ${replyText}\n`;
    keyboard.push([{ text: `❌ Hapus ${keyword}`, callback_data: `del_${keyword}` }]);
  }

  bot.sendMessage(chatId, list, {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard },
    reply_to_message_id: msg.message_id
  });
});

// ✅ Handle tombol hapus dari inline keyboard
bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  const userId = callbackQuery.from.id.toString();
  const data = callbackQuery.data;

  if (data.startsWith("del_")) {
    if (userId !== owner) {
      return bot.answerCallbackQuery(callbackQuery.id, { text: "❌ Hanya owner yang bisa hapus autoreply." });
    }

    const keyword = data.replace("del_", "");

    if (!autoreplyData[keyword]) {
      return bot.answerCallbackQuery(callbackQuery.id, { text: "❌ Keyword sudah tidak ada." });
    }

    delete autoreplyData[keyword];
    saveAutoreply();

    bot.answerCallbackQuery(callbackQuery.id, { text: `✅ Autoreply '${keyword}' dihapus.` });

    if (Object.keys(autoreplyData).length === 0) {
      return bot.editMessageText("❌ Semua *autoreply* sudah dihapus.", {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        parse_mode: "Markdown"
      });
    }

    let list = "📌 *Daftar Autoreply (Update):*\n\n";
    const keyboard = [];
    let i = 1;

    for (const [kw, replyText] of Object.entries(autoreplyData)) {
      list += `${i++}. *${kw}* → ${replyText}\n`;
      keyboard.push([{ text: `❌ Hapus ${kw}`, callback_data: `del_${kw}` }]);
    }

    bot.editMessageText(list, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    });
  }
});

// ✅ Autoreply otomatis
bot.on("message", async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  for (const [keyword, replyText] of Object.entries(autoreplyData)) {
    if (text.includes(keyword)) {
      return bot.sendMessage(chatId, replyText, {
        reply_to_message_id: msg.message_id
      });
    }
  }
});

// ✅ Aktifkan / Nonaktifkan Anti Spam
bot.onText(/^\/antispam(?:\s+(on|off))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  // Cek apakah Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }

  const status = match[1] ? match[1].toLowerCase() : null;
  if (!status) {
    return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh penggunaan:\n/antispam on\n/antispam off`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (status === "on") {
    antispamData[chatId] = { enabled: true, limit: 3, delay: 10000, users: {} };
    saveAntispam();
    return bot.sendMessage(chatId, "✅ Fitur *Anti Spam* telah diaktifkan!\nSpam melebihi limit akan otomatis dihapus.", {
      parse_mode: "Markdown",
      reply_to_message_id: targetMessageId
    });
  } else if (status === "off") {
    delete antispamData[chatId];
    saveAntispam();
    return bot.sendMessage(chatId, "❎ Fitur *Anti Spam* telah dinonaktifkan!", {
      parse_mode: "Markdown",
      reply_to_message_id: targetMessageId
    });
  }
});

// ✅ Set Limit Spam
bot.onText(/^\/setspamlimit(?:\s+(\d+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }

  const limit = match[1] ? parseInt(match[1]) : null;
  if (!limit) {
    return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh penggunaan:\n/setspamlimit 5`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!antispamData[chatId]) return bot.sendMessage(chatId, "❌ Anti Spam belum diaktifkan.");

  antispamData[chatId].limit = limit;
  saveAntispam();
  return bot.sendMessage(chatId, `✅ Spam limit diubah menjadi *${limit}*.`, {
    parse_mode: "Markdown",
    reply_to_message_id: targetMessageId
  });
});

// ✅ Set Delay Reset Spam
bot.onText(/^\/setdelayspam(?:\s+(\d+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const reply = msg.reply_to_message;
  const targetMessageId = reply ? reply.message_id : msg.message_id;

  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [[{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]]
      }
    });
  }

  const delay = match[1] ? parseInt(match[1]) : null;
  if (!delay) {
    return bot.sendMessage(chatId, `⚠️ Format salah!\nContoh penggunaan:\n/setdelayspam 10000`, {
      reply_to_message_id: targetMessageId
    });
  }

  if (!antispamData[chatId]) return bot.sendMessage(chatId, "❌ Anti Spam belum diaktifkan.");

  antispamData[chatId].delay = delay;
  saveAntispam();
  return bot.sendMessage(chatId, `✅ Delay reset spam diubah menjadi *${delay} ms*.`, {
    parse_mode: "Markdown",
    reply_to_message_id: targetMessageId
  });
});

// Ambil info bot sekali di awal
let botInfo;
(async () => {
  try {
    botInfo = await bot.getMe();
  } catch (err) {
    console.error("Gagal ambil info bot:", err.message);
  }
})();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const messageId = msg.message_id;

  // ✅ Kecualikan Owner
  if (userId === owner) return;

  // ✅ Kecualikan Bot itu sendiri
  if (botInfo && userId === botInfo.id.toString()) return;

  // ✅ Kecualikan Admin Grup
  if (msg.chat.type.endsWith("group")) {
    try {
      const admins = await bot.getChatAdministrators(chatId);
      const isAdmin = admins.some(admin => admin.user.id.toString() === userId);
      if (isAdmin) return;
    } catch (err) {
      console.error("Gagal cek admin grup:", err.message);
    }
  }

  if (!antispamData[chatId] || !antispamData[chatId].enabled) return;

  const { limit, delay, users } = antispamData[chatId];
  if (!users[userId]) {
    users[userId] = { count: 0, last: Date.now(), warned: false };
  }

  const now = Date.now();
  if (now - users[userId].last > delay) {
    users[userId].count = 0;
    users[userId].warned = false; // reset peringatan setelah delay
  }

  users[userId].count++;
  users[userId].last = now;

  if (users[userId].count > limit) {
    try {
      await bot.deleteMessage(chatId, messageId); // 🔥 Auto hapus pesan spam
      if (!users[userId].warned) {
        users[userId].warned = true;
        await bot.sendMessage(
          chatId,
          `⚠️ <b>Peringatan!</b>\n@${msg.from.username || msg.from.first_name} terdeteksi melakukan spam.\nPesan selanjutnya akan otomatis dihapus.`,
          { parse_mode: "HTML" }
        );
      }
    } catch (err) {
      console.error("Gagal hapus pesan spam:", err.message);
    }
  }
});

bot.onText(/^(\.|\#|\/)antitag$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/q off\n/antitag on`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/antitag (on|off)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const isGroup = msg.chat.type.includes('group');
  const status = match[1].toLowerCase();
  const reply = msg.message_id;

  if (!isGroup) return bot.sendMessage(chatId, '❌ Perintah ini hanya untuk grup.');

  // Cek apakah admin
  const admins = await bot.getChatAdministrators(chatId);
  const isAdmin = admins.some(admin => admin.user.id === fromId);
  if (!isAdmin) return bot.sendMessage(chatId, '❌ Hanya admin yang bisa mengatur fitur ini.');

  if (status === 'on') {
    antitagOwnerData[chatId] = true;
    saveAntitagOwner();
    return bot.sendMessage(chatId, '✅ Fitur *Anti Tag* telah diaktifkan!', {
      parse_mode: 'Markdown',
      reply_to_message_id: reply
    });
  } else {
    delete antitagOwnerData[chatId];
    saveAntitagOwner();
    return bot.sendMessage(chatId, '❎ Fitur *Anti Tag* telah dinonaktifkan!', {
      parse_mode: 'Markdown',
      reply_to_message_id: reply
    });
  }
});

// Ganti dengan username owner tanpa @
const ownerUsername = "Ranzneweraa";

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const isGroup = msg.chat.type.includes('group');
  const text = msg.text || '';

  if (!isGroup || !antitagOwnerData[chatId]) return;

  const tagOwner = `@${ownerUsername}`.toLowerCase();

  if (text.toLowerCase().includes(tagOwner)) {
    try {
      await bot.deleteMessage(chatId, msg.message_id);
      await bot.sendMessage(chatId, `⚠️ @${msg.from.username || msg.from.first_name}, dilarang tag developer di grup ini!`, {
        parse_mode: 'Markdown'
      });
    } catch (e) {
      console.error('Gagal hapus pesan:', e.message);
    }
  }
});

bot.onText(/^(\.|\#|\/)antilink$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/antilink off\n/antilink on`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});

bot.onText(/^\/antilink (on|off)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
  const reply = msg.message_id;

  if (!isGroup) {
    return bot.sendMessage(chatId, '❌ Perintah ini hanya untuk grup!', { reply_to_message_id: reply });
  }

  const status = match[1].toLowerCase();
  if (status === 'on') {
    antilinkData[chatId] = true;
    saveAntilink();
    bot.sendMessage(chatId, '✅ Antilink telah *diaktifkan*!', {
      parse_mode: 'Markdown',
      reply_to_message_id: reply
    });
  } else {
    delete antilinkData[chatId];
    saveAntilink();
    bot.sendMessage(chatId, '❎ Antilink telah *dinonaktifkan*!', {
      parse_mode: 'Markdown',
      reply_to_message_id: reply
    });
  }
});

const linkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|wa\.me|t\.me|whatsapp\.com\/channel|youtube\.com|youtu\.be)/i;

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

  if (!isGroup || !antilinkData[chatId]) return;

  const text = msg.text || '';
  const containsLink = linkRegex.test(text);

  if (containsLink && !msg.from.is_bot) {
    try {
      await bot.deleteMessage(chatId, msg.message_id);
      await bot.sendMessage(chatId, `⚠️ @${msg.from.username || msg.from.first_name}, dilarang kirim link di grup ini!`, {
        parse_mode: 'Markdown',
        // Tidak pakai reply_to_message_id di sini
      });
    } catch (err) {
      console.log('Gagal hapus atau kirim peringatan:', err.message);
    }
  }
});

bot.onText(/^(\.|\#|\/)del$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const replyTo = msg.reply_to_message;

  // Cek Apakah User Owner
  if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

  if (!replyTo) {
    return bot.sendMessage(chatId, '❌ *Format salah!*\n\nSilakan *reply* pesan yang ingin dihapus lalu gunakan perintah /del', {
      parse_mode: 'Markdown'
    });
  }

  try {
    await bot.deleteMessage(chatId, replyTo.message_id);
    await bot.sendMessage(chatId, '✅ Pesan berhasil dihapus.', {
      reply_to_message_id: msg.message_id
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Gagal menghapus pesan. Pastikan bot memiliki izin untuk menghapus pesan.');
  }
});

bot.onText(/^(\.|\#|\/)playmusik(?:\s+(.+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const text = match[2];
    const targetMessageId = msg.message_id;

      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    if (!text) {
        return bot.sendMessage(chatId, `⚠️ Contoh: /playmusik aku yang tersakiti`, {
            reply_to_message_id: targetMessageId
        });
    }

    try {
        await bot.sendMessage(chatId, `⏱️ Sedang mencari lagu...`, { reply_to_message_id: targetMessageId });

        const yts = require('yt-search');
        const nyoba = await yts(text);
        if (!nyoba || !nyoba.all || nyoba.all.length === 0) {
            return bot.sendMessage(chatId, `❌ Lagu tidak ditemukan!`, { reply_to_message_id: targetMessageId });
        }

        const { url, title, thumbnail, duration, views, author } = nyoba.all[0];

        const body = `🎵 *Judul:* ${title}\n` +
                     `📺 *Channel:* ${author.name}\n` +
                     `⏳ *Durasi:* ${duration}\n` +
                     `👀 *Views:* ${views}\n` +
                     `🔗 *Link:* ${url}\n\nSilakan pilih format di bawah ini:`;

        // ✅ Kirim dengan inline keyboard
        await bot.sendMessage(chatId, body, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🎵 Download MP3', callback_data: `download_mp3|${url}` },
                        { text: '🎬 Download MP4', callback_data: `download_mp4|${url}` }
                    ]
                ]
            },
            reply_to_message_id: targetMessageId,
            parse_mode: 'Markdown'
        });

    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`);
    }
});

// ✅ Handle Callback untuk Download MP3 / MP4
bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (data.startsWith('download_mp3') || data.startsWith('download_mp4')) {
        const format = data.startsWith('download_mp3') ? 'mp3' : 'mp4';
        const url = data.split('|')[1];

        await bot.answerCallbackQuery(callbackQuery.id, { text: `⏳ Sedang menyiapkan ${format}...` });

        try {
            const headers = {
                "accept": "*/*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-fetch-site": "cross-site",
                "Referer": "https://id.ytmp3.mobi/",
            };

            // ✅ Init YTMP3 API
            const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
            const init = await initial.json();

            const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
            if (!id) return bot.sendMessage(chatId, `❌ URL tidak valid.`);

            // ✅ Buat URL convert
            let convertURL = `${init.convertURL}&v=${id}&f=${format}&_=${Math.random()}`;
            const converts = await fetch(convertURL, { headers });
            const convert = await converts.json();

            // ✅ Cek progress
            let info = {};
            for (let i = 0; i < 5; i++) {
                const progress = await fetch(convert.progressURL, { headers });
                info = await progress.json();
                if (info.progress === 3) break;
                await new Promise(res => setTimeout(res, 2000));
            }

            const downloadLink = convert.downloadURL;
            if (!downloadLink) return bot.sendMessage(chatId, `❌ Gagal mendapatkan link download.`);

            const title = info.title || "Hasil Download";

            // ✅ Download file ke Buffer
            const response = await fetch(downloadLink);
            const buffer = await response.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);

            // ✅ Kirim ke Telegram
            if (format === 'mp3') {
                await bot.sendAudio(chatId, fileBuffer, { caption: `✅ ${title} (MP3)` });
            } else {
                await bot.sendVideo(chatId, fileBuffer, { caption: `✅ ${title} (MP4)` });
            }

        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `❌ Gagal mendownload. Error: ${error.message}`);
        }
    }
});

bot.onText(/^(\.|\#|\/)play$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\n\nContoh penggunaan:\n/play bunga terakhir`);
});

bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    if (!query) {
        return bot.sendMessage(chatId, 'Contoh penggunaan:\n\n/play Pulang - Wali Band');
    }

    try {
        const search = await yts(query);
        if (!search || search.all.length === 0) {
            return bot.sendMessage(chatId, 'Lagu yang Anda cari tidak ditemukan.');
        }

        const video = search.videos[0];
        const detail = `
🎵 **YouTube Audio Play** 🎶

✨ **Judul Lagu**: ${video.title}
👁️‍🗨️ **Penonton**: ${video.views}
🎤 **Pengarang**: ${video.author.name}
📅 **Diunggah**: ${video.ago}
🔗 **Tonton Selengkapnya**: [Klik Disini](${video.url})`;

        await bot.sendMessage(chatId, detail, { parse_mode: 'Markdown' });

        const stream = ytdl(video.url, { filter: 'audioonly' });

        bot.sendAudio(chatId, stream, { caption: 'Sekarang Memutar Musik' });

    } catch (error) {
        console.error('Error:', error.message);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat memproses permintaan Anda.');
    }
});

bot.onText(/^(\.|\#|\/)addprem$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/addprem < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/addprem (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const newPremiumId = match[1].toString();

    // Cek apakah pengirim adalah pemilik bot
    if (userId !== owner) {
        bot.sendMessage(chatId, "Fitur Khusus Owner");
        return;
    }

    try {
        // Baca file premiumUsers.json
        let premiumUsers = [];
        if (fs.existsSync(premiumUsersFile)) {
            premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
        }

        // Periksa apakah ID sudah ada dalam daftar premium
        if (premiumUsers.includes(newPremiumId)) {
            bot.sendMessage(chatId, `${newPremiumId} Sudah Di Addprem`);
            return;
        }

        // Tambahkan ID baru ke daftar premium
        premiumUsers.push(newPremiumId);
        fs.writeFileSync(premiumUsersFile, JSON.stringify(premiumUsers, null, 2));

        bot.sendMessage(chatId, `Sukses Add ${newPremiumId} Ke Premium`);
    } catch (error) {
        console.error("Error updating premiumUsers file:", error);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memperbarui daftar premium.");
    }
});
bot.onText(/^(\.|\#|\/)adddom$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/adddom < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/adddom (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const newPremium2Id = match[1].toString();

    // Cek apakah pengirim adalah pemilik bot
    if (userId !== owner) {
        bot.sendMessage(chatId, "Fitur Khusus Owner");
        return;
    }

    try {
        // Baca file premiumUsers.json
        let premium2Users = [];
        if (fs.existsSync(premium2UsersFile)) {
            premium2Users = JSON.parse(fs.readFileSync(premium2UsersFile));
        }

        // Periksa apakah ID sudah ada dalam daftar premium
        if (premium2Users.includes(newPremium2Id)) {
            bot.sendMessage(chatId, `${newPremium2Id} Sudah Di Beriakses`);
            return;
        }

        // Tambahkan ID baru ke daftar premium
        premium2Users.push(newPremium2Id);
        fs.writeFileSync(premium2UsersFile, JSON.stringify(premium2Users, null, 2));

        bot.sendMessage(chatId, `Sukses Add ${newPremium2Id} Diberi Akses`);
    } catch (error) {
        console.error("Error updating premium2Users file:", error);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memperbarui daftar akses domain.");
    }
});

// ADD GROUP
bot.onText(/^\/addgc$/, async (msg) => {
  const chatId = msg.chat.id;
  if (msg.chat.type === 'private') return bot.sendMessage(chatId, "❌ Command ini hanya bisa dijalankan di grup.");

  const groups = getAllowedGroups();
  if (!groups.includes(chatId)) {
    groups.push(chatId);
    saveAllowedGroups(groups);
    return bot.sendMessage(chatId, "✅ Grup ini berhasil ditambahkan.");
  } else {
    return bot.sendMessage(chatId, "ℹ️ Grup ini sudah ada di daftar grup yang diizinkan.");
  }
});

// DELETE GROUP
bot.onText(/^\/delgc$/, async (msg) => {
  const chatId = msg.chat.id;
  const groups = getAllowedGroups();

  if (groups.includes(chatId)) {
    const newGroups = groups.filter(g => g !== chatId);
    saveAllowedGroups(newGroups);
    return bot.sendMessage(chatId, "✅ Grup ini berhasil dihapus dari daftar grup.");
  } else {
    return bot.sendMessage(chatId, "ℹ️ Grup ini tidak ada di daftar grup yang diizinkan.");
  }
});

// LIST GROUP
bot.onText(/^\/listgc$/, async (msg) => {
  const chatId = msg.chat.id;
  const groups = getAllowedGroups();

  if (groups.length === 0) return bot.sendMessage(chatId, "ℹ️ Tidak ada grup yang terdaftar.");

  const list = groups.map((id, i) => `${i + 1}. ${id}`).join('\n');
  return bot.sendMessage(chatId, `📋 Daftar Grup yang Diizinkan:\n\n${list}`);
});

bot.onText(/^(\.|\#|\/)addakses$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/RafatharCode" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/addakses < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/addakses (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const newAksesId = match[1].toString();

    // Cek apakah pengirim adalah pemilik bot
    if (userId !== owner) {
        bot.sendMessage(chatId, "Fitur Khusus Owner");
        return;
    }

    try {
        // Baca file aksesUsers.json
        let aksesUsers = [];
        if (fs.existsSync(aksesUsersFile)) {
            aksesUsers = JSON.parse(fs.readFileSync(aksesUsersFile));
        }

        // Periksa apakah ID sudah ada dalam daftar premium
        if (aksesUsers.includes(newAksesId)) {
            bot.sendMessage(chatId, `${newAksesId} Sudah Di Beri Akses`);
            return;
        }

        // Tambahkan ID baru ke daftar akses
        aksesUsers.push(newAksesId);
        fs.writeFileSync(aksesUsersFile, JSON.stringify(aksesUsers, null, 2));

        bot.sendMessage(chatId, `Sukses Memberi ${newAksesId} Akses`);
    } catch (error) {
        console.error("Error updating aksesUsers file:", error);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memperbarui daftar akses.");
    }
});

function loadPremiumUsers() {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { premium: [] };
    }
}

const premiumFile = "premiumUsers.json";

// batas domain

function loadPremium2Users() {
    try {
        const data = fs.readFileSync('premium2Users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { premium2: [] };
    }
}

const premium2File = "premium2Users.json";

// batas akses
function loadAksesUsers() {
    try {
        const data = fs.readFileSync('aksesUsers.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { akses: [] };
    }
}

const aksesFile = "aksesUsers.json";

// Fungsi untuk menyimpan daftar pengguna premium
const savePremiumUsers = (data) => {
    fs.writeFileSync(premiumFile, JSON.stringify(data, null, 2));
};

// Fungsi untuk menghapus user dari daftar premium
const removePremiumUser = (userId) => {
    let premiumUsers = loadPremiumUsers();
    const index = premiumUsers.indexOf(userId);
    if (index !== -1) {
        premiumUsers.splice(index, 1);
        savePremiumUsers(premiumUsers);
        return true;
    }
    return false;
};

//Prem Domain 
const savePremium2Users = (data) => {
    fs.writeFileSync(premium2File, JSON.stringify(data, null, 2));
};

// Fungsi untuk menghapus user dari daftar premium domain
const removePremium2User = (userId) => {
    let premium2Users = loadPremium2Users();
    const index = premium2Users.indexOf(userId);
    if (index !== -1) {
        premium2Users.splice(index, 1);
        savePremium2Users(premium2Users);
        return true;
    }
    return false;
};
// Akses
const saveAksesUsers = (data) => {
    fs.writeFileSync(aksesFile, JSON.stringify(data, null, 2));
};

// Fungsi untuk menghapus user dari daftar akses
const removeAksesUser = (userId) => {
    let AksesUsers = loadAksesUsers();
    const index = AksesUsers.indexOf(userId);
    if (index !== -1) {
        aksesUsers.splice(index, 1);
        saveAksesUsers(aksesUsers);
        return true;
    }
    return false;
};

// Event handler untuk perintah /delprem
bot.onText(/^(\.|\#|\/)delprem$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delprem < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/delprem (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const admin = owner;
    const userId = msg.from.id;
    const targetId = match[1]; // ID yang ingin dihapus

    // Cek apakah user adalah owner
    if (userId.toString() !== admin) {
        return bot.sendMessage(chatId, "❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let premiumUsers = loadPremiumUsers();

    // Cek apakah user ada dalam daftar premium
    if (!premiumUsers.includes(targetId)) {
        return bot.sendMessage(chatId, `❌ User ID ${targetId} Tidak Di Temukan.`);
    }

    // Hapus user dari daftar premium
    if (removePremiumUser(targetId)) {
        bot.sendMessage(
            chatId,
            `✅ Sukses Menghapus User *${targetId}* Dari Premium `,
            { parse_mode: "Markdown" }
        );
    } else {
        bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat menghapus user premium.");
    }
});

bot.onText(/^(\.|\#|\/)deldom$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/deldom < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/deldom (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const admin = owner;
    const userId = msg.from.id;
    const targetId = match[1]; // ID yang ingin dihapus

    // Cek apakah user adalah owner
    if (userId.toString() !== admin) {
        return bot.sendMessage(chatId, "❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    let premium2Users = loadPremium2Users();

    // Cek apakah user ada dalam daftar premium
    if (!premium2Users.includes(targetId)) {
        return bot.sendMessage(chatId, `❌ User ID ${targetId} Tidak Di Temukan.`);
    }

    // Hapus user dari daftar premium
    if (removePremium2User(targetId)) {
        bot.sendMessage(
            chatId,
            `✅ Sukses Menghapus User *${targetId}* Dari Akses `,
            { parse_mode: "Markdown" }
        );
    } else {
        bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat menghapus user premium.");
    }
});

// Event handler untuk perintah /delprem
bot.onText(/^(\.|\#|\/)delakses$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message; // Dapatkan pesan yang dibalas user
    const targetMessageId = reply ? reply.message_id : msg.message_id;
      // Cek Apakah User Owner
      if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }
    
    bot.sendMessage(
        chatId,
        `⚠️ Format salah!\nContoh penggunaan:\n/delakses < idtelemu >`,
        { reply_to_message_id: targetMessageId } // Balas pesan target yang telah ditentukan
    );
});
bot.onText(/\/delakses (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const targetId = match[1]; // ID yang ingin dihapus

    // Cek apakah user adalah owner
    if (userId !== owner) {
        bot.sendMessage(chatId, "Fitur Khusus Owner");
        return;
    }

    let aksesUsers = loadAksesUsers();

    // Cek apakah user ada dalam daftar premium
    if (!aksesUsers.includes(targetId)) {
        return bot.sendMessage(chatId, `❌ User ID ${targetId} Tidak Di Temukan.`);
    }

    // Hapus user dari daftar premium
    if (removeAksesUser(targetId)) {
        bot.sendMessage(
            chatId,
            `✅ Sukses Menghapus User *${targetId}* Dari Akses `,
            { parse_mode: "Markdown" }
        );
    } else {
        bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat menghapus user Akses.");
    }
});

bot.onText(/\/listprem/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Check if user is the owner
    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    // Baca file premiumUsers.json
    fs.readFile('premiumUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error membaca file:", err);
            return bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membaca daftar pengguna premium.");
        }

        let premiumUsers;
        try {
            premiumUsers = JSON.parse(data);
        } catch (e) {
            return bot.sendMessage(chatId, "⚠️ Format file premiumUsers.json tidak valid.");
        }

        // Cek apakah ada pengguna premium
        if (premiumUsers.length === 0) {
            return bot.sendMessage(chatId, "📌 *LIST USER PREMIUM*\n\nTidak ada pengguna premium.", { parse_mode: "Markdown" });
        }

        // Buat daftar user premium dalam format pesan
        const listMessage = premiumUsers
            .map((id, index) => `*${index + 1}.* [${id}](tg://user?id=${id})`)
            .join("\n");

        const message = `📌 *LIST USER PREMIUM*\n\n${listMessage}\n\n🔰 *Total:* ${premiumUsers.length} user`;

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    });
});

bot.onText(/\/listdom/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Check if user is the owner
    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    // Baca file premiumUsers.json
    fs.readFile('premium2Users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error membaca file:", err);
            return bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membaca daftar pengguna premium.");
        }

        let premium2Users;
        try {
            premium2Users = JSON.parse(data);
        } catch (e) {
            return bot.sendMessage(chatId, "⚠️ Format file premiumUsers.json tidak valid.");
        }

        // Cek apakah ada pengguna premium
        if (premium2Users.length === 0) {
            return bot.sendMessage(chatId, "📌 *LIST USER PREMIUM*\n\nTidak ada pengguna premium.", { parse_mode: "Markdown" });
        }

        // Buat daftar user premium dalam format pesan
        const listMessage = premium2Users
            .map((id, index) => `*${index + 1}.* [${id}](tg://user?id=${id})`)
            .join("\n");

        const message = `📌 *LIST USER PREMIUM*\n\n${listMessage}\n\n🔰 *Total:* ${premium2Users.length} user`;

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    });
});

bot.onText(/\/listakses/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const reply = msg.reply_to_message;
    const targetMessageId = reply ? reply.message_id : msg.message_id;

    // Check if user is the owner
    if (userId !== owner) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
      reply_to_message_id: targetMessageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
        ]
      }
    });
  }

    // Baca file premiumUsers.json
    fs.readFile('aksesUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error membaca file:", err);
            return bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membaca daftar pengguna akses.");
        }

        let aksesUsers;
        try {
            aksesUsers = JSON.parse(data);
        } catch (e) {
            return bot.sendMessage(chatId, "⚠️ Format file aksesUsers.json tidak valid.");
        }

        // Cek apakah ada pengguna premium
        if (aksesUsers.length === 0) {
            return bot.sendMessage(chatId, "📌 *LIST USER AKSES*\n\nTidak ada pengguna akses.", { parse_mode: "Markdown" });
        }

        // Buat daftar user premium dalam format pesan
        const listMessage = aksesUsers
            .map((id, index) => `*${index + 1}.* [${id}](tg://user?id=${id})`)
            .join("\n");

        const message = `📌 *LIST USER AKSES*\n\n${listMessage}\n\n🔰 *Total:* ${aksesUsers.length} user`;

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    });
});

bot.on('document', async (msg) => {
    const file = msg.document;
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const fileName = file.file_name;

    if (!fileName.endsWith('.js')) {
      return bot.sendMessage(chatId, '⚠️ Hanya file .js yang diperbolehkan.');
    }

    try {
      const fileInfo = await bot.getFile(file.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
      const temPath = path.join(temDir, `${Date.now()}-${fileName}`);

      const response = await axios.get(fileUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(temPath);
      response.data.pipe(writer);

      await new Promise((res, rej) => {
        writer.on('finish', res);
        writer.on('error', rej);
      });

      sessions[userId] = {
        filePath: temPath,
        fileId: msg.message_id,
        originalName: fileName
      };

      await bot.sendMessage(
        chatId,
        `<b>📄 File diterima: ${fileName}</b>\n\nPilih mode Bypass:`,
        {
          parse_mode: 'HTML',
          reply_to_message_id: msg.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: '[ BYPASS 01 ]', callback_data: 'bypass_1' }],
              [{ text: '[ BYPASS 02 ]', callback_data: 'bypass_2' }]
            ]
          }
        }
      );
    } catch (e) {
      console.error('❌ Gagal menerima file:', e);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menyimpan file.');
    }
  });

  // tombol bypass
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;

    if (!/^bypass_(1|2)$/.test(data)) return;

    const sess = sessions[userId];
    if (!sess || !(await fs.pathExists(sess.filePath))) {
      return bot.answerCallbackQuery(query.id, { text: '❌ File tidak ditemukan / sesi habis.' });
    }

    const textFile = data === 'bypass_1' ? TEXT_FILE_1 : TEXT_FILE_2;
    try {
      await bot.answerCallbackQuery(query.id);
      const progress = await bot.sendMessage(chatId, '⏳ Memproses file...');

      const original = await fs.readFile(sess.filePath, 'utf-8');
      const prepend = await fs.readFile(textFile, 'utf-8');
      const finalContent = `${prepend}\n\n${original}`;

      const timestamp = Date.now();
      const outputPath = path.join(temDir, `bypass_ranz_${timestamp}.js`);
      await fs.writeFile(outputPath, finalContent);

      await bot.deleteMessage(chatId, progress.message_id);

      await bot.sendDocument(chatId, outputPath, {
        caption: `<b>✅ File berhasil diproses dengan ${data.toUpperCase().replace('_', ' ')}</b>`,
        parse_mode: 'HTML',
        reply_to_message_id: sess.fileId,
        filename: `bypass_Ranz_${timestamp}.js`,
        reply_markup: {
          inline_keyboard: [[{ text: 'Developer', url: 'https://t.me/Ranzneweraa' }]]
        }
      });

      // kirim notif ke channel (jika ada foto profil)
      try {
        const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
        if (photos.total_count > 0) {
          const fileId = photos.photos[0][0].file_id;
          await bot.sendPhoto(CH_ID, fileId, {
            caption: `<b>✅ ${data.toUpperCase().replace('_', ' ')} berhasil</b>\n👤 @${query.from.username} (${userId})\n📁 ${sess.originalName}`,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[{ text: query.from.first_name, url: `tg://user?id=${userId}` }]]
            }
          });
        }
      } catch (err) {
        console.warn('⚠️ Gagal kirim ke channel:', err.message);
      }

      await fs.remove(sess.filePath);
      await fs.remove(outputPath);
      delete sessions[userId];
    } catch (e) {
      console.error('❌ Error proses bypass:', e);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat proses bypass.');
      if (sess?.filePath) await fs.remove(sess.filePath).catch(() => {});
      delete sessions[userId];
    }
  });

// Handler /figure hanya untuk reply ke foto
bot.onText(/\/tofigure/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const replyTo = msg.message_id; // Reply ke command by default

    // Cek Apakah User Owner
    if (userId !== owner) {
        return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang dapat menggunakan perintah ini.", {
            reply_to_message_id: replyTo,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "HUBUNGI ADMIN", url: "https://t.me/Ranzneweraa" }]
                ]
            }
        });
    }

    // Cek apakah command di-reply ke foto
    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return bot.sendMessage(chatId, "❌ Reply ke foto dengan perintah /tofigure untuk membuat figure.", { reply_to_message_id: replyTo });
    }

    try {
        const photo = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1]; // Resolusi tertinggi
        const file = await bot.getFile(photo.file_id);
        const imageUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

        const ress = await fetch(`https://api.nekolabs.my.id/tools/convert/tofigure?imageUrl=${encodeURIComponent(imageUrl)}`);
        const data = await ress.json();

        if (data && data.result) {
            bot.sendPhoto(chatId, data.result, { caption: "✅ Hasil figure!", reply_to_message_id: replyTo });
        } else {
            bot.sendMessage(chatId, "❌ Gagal membuat figure dari foto.", { reply_to_message_id: replyTo });
        }

    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses foto.", { reply_to_message_id: replyTo });
    }
});

// Handle callback query dari tombol
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const username = callbackQuery.from.username || callbackQuery.from.first_name;

    if (callbackQuery.data === 'owner_menu') {
    sendOwnerMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'database_menu') {
    sendDatabaseMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'fitur_menu') {
    sendFiturMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'start_menu') {
    sendStartMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'pay_menu') {
    sendPayMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'info_menu') {
    sendInfoMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'buy_menu') {
    sendBuyMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'startt_menu') {
    sendStarttMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'deposit_menu') {
    sendDepositMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'install_menu') {
    sendInstallMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'starttt_menu') {
    sendStartttMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'panell_menu') {
    sendPanellMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'domain_menu') {
    sendDomainMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'vps_menu') {
    sendVpsMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'group_menu') {
    sendGroupMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'startttt_menu') {
    sendStarttttMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'store_menu') {
    sendStoreMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'autoreply_menu') {
    sendAutoReplyMenu(chatId, messageId, username);
} else if (callbackQuery.data === 'apikeyku_menu') {
    sendApikeyku(chatId, messageId, username);

    bot.answerCallbackQuery(callbackQuery.id);
}});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const username = callbackQuery.from.username || callbackQuery.from.first_name;

    if (callbackQuery.data === 'dana_pay') {
    sendDanaPay(chatId, messageId, username);
} else if (callbackQuery.data === 'ovo_pay') {
    sendOvoPay(chatId, messageId, username);
} else if (callbackQuery.data === 'gopay_pay') {
    sendGopayPay(chatId, messageId, username);
} else if (callbackQuery.data === 'bni_pay') {
    sendBniPay(chatId, messageId, username);
} else if (callbackQuery.data === 'qris_pay') {
    sendQrisPay(chatId, messageId, username);

    bot.answerCallbackQuery(callbackQuery.id);
}});

console.log(chalk.green.bold(`

╔═══╦═══╦═╗─╔╦════╗
║╔═╗║╔═╗║║╚╗║╠══╗═║
║╚═╝║║─║║╔╗╚╝║─╔╝╔╝
║╔╗╔╣╚═╝║║╚╗║║╔╝╔╝─
║║║╚╣╔═╗║║─║║╠╝═╚═╗
╚╝╚═╩╝─╚╩╝─╚═╩════╝
╔═╗─╔╦═══╦╗╔╗╔╦═══╦═══╗
║║╚╗║║╔══╣║║║║║╔══╣╔═╗║
║╔╗╚╝║╚══╣║║║║║╚══╣╚═╝║
║║╚╗║║╔══╣╚╝╚╝║╔══╣╔╗╔╝
║║─║║║╚══╬╗╔╗╔╣╚══╣║║╚╗
╚╝─╚═╩═══╝╚╝╚╝╚═══╩╝╚═╝
╔═══╦═══╗
║╔═╗║╔═╗║
║║─║║║─║║
║╚═╝║╚═╝║
║╔═╗║╔═╗║
╚╝─╚╩╝─╚╝`));
console.log(chalk.yellow.bold('bot auto order berhasil tersambung!!'));
console.log(' ');
console.log(' ');
console.log(chalk.blue.bold('Contact Dev:'));
console.log(chalk.yellow.bold('Telegram: @Ranzneweraa'));
console.log(chalk.green.bold('hargai hasil karya'));
console.log(chalk.green.bold('developer.'));