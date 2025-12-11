const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data');

async function listProducts(sock, from) {
    const products = JSON.parse(fs.readFileSync(path.join(dataPath, 'products.json'), 'utf8'));
    let text = '📦 *List Produk*\n\n';
    products.forEach(p => {
        text += `ID: ${p.id}\nNama: ${p.name}\nHarga: Rp ${p.price}\nDesc: ${p.desc}\n\n`;
    });
    text += 'Ketuk .buy [id] untuk beli.';

    await sock.sendMessage(from, { text });
}

async function buyProduct(sock, from, id, sender) {
    const products = JSON.parse(fs.readFileSync(path.join(dataPath, 'products.json'), 'utf8'));
    const product = products.find(p => p.id == id);
    if (!product) return await sock.sendMessage(from, { text: 'Produk tidak ditemukan!' });

    let carts = JSON.parse(fs.readFileSync(path.join(dataPath, 'carts.json'), 'utf8'));
    let userCart = carts.find(c => c.jid === sender);
    if (!userCart) {
        userCart = { jid: sender, items: [] };
        carts.push(userCart);
    }
    userCart.items.push(product);
    fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify(carts, null, 2));

    await sock.sendMessage(from, { text: `✅ Ditambahkan ke cart: ${product.name}` });
}

async function viewCart(sock, from, sender) {
    let carts = JSON.parse(fs.readFileSync(path.join(dataPath, 'carts.json'), 'utf8'));
    let userCart = carts.find(c => c.jid === sender);
    if (!userCart || userCart.items.length === 0) return await sock.sendMessage(from, { text: 'Cart kosong!' });

    let text = '🛒 *Keranjang*\n\n';
    let total = 0;
    userCart.items.forEach(item => {
        text += `${item.name} - Rp ${item.price}\n`;
        total += item.price;
    });
    text += `\nTotal: Rp ${total}\nKetuk .checkout untuk bayar.`;

    await sock.sendMessage(from, { text });
}

module.exports = { listProducts, buyProduct, viewCart };
