
    const form = document.getElementById('report-form');
    const submitBtn = document.getElementById('report-submit');

    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const data = new FormData(form);
        const desc = data.get('desc')?.trim();
        const nama = data.get('nama')?.trim() || '';

        // Validasi: pastikan deskripsi tidak kosong
        if (!desc) {
          alert("Deskripsi masalah wajib diisi!");
          return;
        }

        const payload = {
          desc,
          nama,
          ts: new Date().toISOString(),
        };

        const message = `📢 Report:\nDeskripsi: ${payload.desc}\nNama: ${payload.nama}\nWaktu: ${payload.ts}`;

        try {
          // Ganti TOKEN dan CHAT_ID dengan milikmu sendiri
          const TOKEN = "8573444224:AAGYD_ibdoZvNP-AXbxIPmksvqQWX9u0sDA";
          const CHAT_ID = "7664916357";
          const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

          await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message })
          });

          alert("Laporan berhasil dikirim ke Telegram!");
          document.querySelector('[data-close]')?.click();
        } catch (err) {
          alert("Gagal mengirim laporan: " + String(err));
        }
      });
    }
  