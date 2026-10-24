const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline'); 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askGroupName = () => {
    return new Promise((resolve) => {
        rl.question('Masukkan nama grup WA yang mau diekspor (Perhatikan huruf besar/kecil): ', (answer) => {
            resolve(answer.trim());
        });
    });
};

(async () => {
    const targetGroupName = await askGroupName();
    rl.close(); 
    
    if (!targetGroupName) {
        console.log("Nama grup tidak boleh kosong!");
        process.exit(1);
    }

    console.log(`\nOke, bersiap mengekstrak grup: "${targetGroupName}"`);
    console.log('Menyiapkan WhatsApp Web...\n');

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        }
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('Silakan scan QR Code di atas menggunakan menu Perangkat Tertaut (Linked Devices) di WhatsApp HP kamu.');
    });

    client.on('ready', async () => {
        console.log('WhatsApp Client sudah terhubung!\n');
        
        console.log('Memberikan jeda 5 detik agar WhatsApp Web selesai sinkronisasi chat...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log(`Mencari grup: "${targetGroupName}"...`);

        try {
            const chats = await client.getChats();
            const groupChat = chats.find(chat => chat.isGroup && chat.name === targetGroupName);

            if (!groupChat) {
                console.log(`\n[GAGAL] Grup "${targetGroupName}" tidak ditemukan.`);
                console.log('Pastikan namanya diketik sama persis (termasuk spasi, huruf besar, huruf kecil, atau emoji).');
                process.exit(1);
            }

            console.log(`Grup ditemukan! Mengekstrak data ${groupChat.participants.length} anggota...\n`);

            let csvContent = 'Nama,Nomor_WhatsApp,Role\n';
            let count = 0;

            for (let participant of groupChat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                
                let name = contact.name || contact.pushname || 'Tanpa Nama';
                name = name.replace(/,/g, ' ').replace(/"/g, ''); 
                
                let phone = contact.number;
                let role = participant.isAdmin || participant.isSuperAdmin ? 'Admin' : 'Member';
                
                csvContent += `"${name}","${phone}","${role}"\n`;
                count++;
                
                process.stdout.write(`\rMemproses... ${count}/${groupChat.participants.length}`);
            }

            const safeFileName = targetGroupName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `Export_${safeFileName}.csv`;

            fs.writeFileSync(fileName, csvContent, 'utf8');
            console.log(`\n\n[SUKSES] ${count} anggota berhasil diexport dan disimpan ke dalam file: ${fileName}`);
            
            setTimeout(() => {
                process.exit(0);
            }, 2000);

        } catch (error) {
            console.error('\nTerjadi kesalahan saat menarik data grup:', error);
            process.exit(1);
        }
    });

    client.initialize();
})();