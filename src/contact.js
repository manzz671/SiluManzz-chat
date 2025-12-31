 const form = document.getElementById('contact-form');
    const btnWA = document.getElementById('send-whatsapp');
    const btnTG = document.getElementById('send-telegram');

    function getPayload() {
      const data = new FormData(form);
      const nama = data.get('nama')?.trim();
      const pesan = data.get('pesan')?.trim();
      if (!nama || !pesan) {
        alert("Nama dan pesan wajib diisi!");
        return null;
      }
      return { nama, pesan, ts: new Date().toISOString() };
    }

    // Kirim via WhatsApp
    btnWA.addEventListener('click', () => {
      const payload = getPayload();
      if (!payload) return;
      const text = `!!New_Message!!\nNama: ${payload.nama}\nPesan: ${payload.pesan}\nWaktu: ${payload.ts}`;
      const phone = "6285188619792";
      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
      window.open(url, "_blank"); // buka tab baru, user kirim manual
    });

    // Kirim via Telegram (langsung ke bot)
    btnTG.addEventListener('click', () => {
      const payload = getPayload();
      if (!payload) return;
      const text = `!!New_Message!! Nama:${payload.nama} Pesan:${payload.pesan} Waktu:${payload.ts}`;
      const url = `https://t.me/Mnz_rec_bot?start=${encodeURIComponent(text)}`;
      window.open(url, "_blank"); // buka tab baru ke bot, user kirim manual
    });