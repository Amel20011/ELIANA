// QRIS sederhana, ganti dengan QR real
async function donate(sock, from) {
    const text = '💰 *Donasi*\n\nScan QRIS untuk donasi.';
    const buttons = [
        { buttonId: 'qris_pay', buttonText: { displayText: 'Bayar QRIS' }, type: 1 }
    ];
    await sock.sendMessage(from, {
        text,
        footer: 'Terima kasih!',
        buttons,
        headerType: 1
    });
}

async function showQRIS(sock, from) {
    // Di real, kirim image QR
    await sock.sendMessage(from, { 
        image: { url: 'https://example.com/qris.png' }, // Ganti dengan QRIS Anda
        caption: 'Scan untuk bayar via QRIS' 
    });
}

async function checkout(sock, from, sender) {
    const { viewCart } = require('./store');
    await viewCart(sock, from, sender); // Tampilkan cart dulu
    const buttons = [
        { buttonId: 'qris_pay', buttonText: { displayText: 'Bayar QRIS' }, type: 1 }
    ];
    await sock.sendMessage(from, { text: 'Pilih pembayaran:', buttons, headerType: 1 });
}

module.exports = { donate, showQRIS, checkout };
