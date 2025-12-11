const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data');

async function verifyUser(sock, from, sender) {
    const text = '👋 *Selamat Datang!*\n\nAnda belum terverifikasi. Klik button untuk verifikasi.';
    const buttons = [
        { buttonId: 'verify', buttonText: { displayText: 'Verify My Account' }, type: 1 }
    ];
    await sock.sendMessage(from, {
        text,
        footer: 'Liviaa Astranica Bot',
        buttons,
        headerType: 1
    });
}

async function registerUser(sock, from, sender) {
    let users = JSON.parse(fs.readFileSync(path.join(dataPath, 'carts.json'), 'utf8'));
    if (!users.some(u => u.jid === sender)) {
        users.push({ jid: sender, items: [] });
        fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify(users, null, 2));
    }
    await sock.sendMessage(from, { text: '✅ Akun diverifikasi! Ketik .menu' });
}

module.exports = { verifyUser, registerUser };
