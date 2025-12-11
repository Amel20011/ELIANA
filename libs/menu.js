const { Buttons } = require('@whisockets/baileys'); // Asumsi ada, atau gunakan template buttons

async function allMenu(sock, from) {
    const menuText = `┌───〔 🌟 MAIN MENU 〕
│ • .menu
│ • .owner
│ • .donate
│ • .runtime
│ • .ping 
│ • .profile
│ • .limit
│ • .saldo
│ • .topup
│ • .claim
│ • .addprem @tag
│ • .delprem @tag
│ • .setprefix
│ • .broadcast
│ • .addlimit
│ • .addsaldo
│ • .ytmp3 link
│ • .ytmp4 link
│ • .tiktok link
│ • .igdl link
│ • .fbdl link
┌───〔 👥 GROUP MENU 〕
│ • .add @tag
│ • .kick @tag
│ • .promote @tag
│ • .demote @tag
│ • .hidetag teks
│ • .tagall
│ • .welcome on/off
│ • .antilink on/off
│ • .antivirtex on/off
│ • .antidelete on/off
│ • .group buka/tutup
│ • .setppgc (reply foto)
│ • .setnamegc teks
│ • .setdescgc teks
│ • .linkgc
│ • .resetlinkgc
│ • .kickme
│ • .vote teks
│ • .devote
┌───〔 🛒 STORE MENU 〕
│ • .store
│ • .list
│ • .buy id
│ • .cart
│ • .checkout`;

    const buttons = [
        { buttonId: 'owner_chat', buttonText: { displayText: 'Owner' }, type: 1 },
        { buttonId: 'join_group', buttonText: { displayText: 'Join Grup' }, type: 1 }
    ];

    await sock.sendMessage(from, {
        text: menuText,
        footer: 'Liviaa Astranica Bot',
        buttons: buttons,
        headerType: 1
    });
}

module.exports = { allMenu };
