async function responseShow() {
    // Ambil id dari url
    const id = new URLSearchParams(window.location.search).get('id');
    /*
    kode diatas sama saja dengan 
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    */

    // Kalau id tidak ditemukan
    if (!id) {
        document.body.innerHTML = '<h2>Id tidak ditemukan</h2>';
    } else {
        // Ambil struktur form untuk menampilkan judul, deskripsi, dan header tabel
        try {
            const response = await fetch(`http://localhost:3000/api/forms/${id}`);
            const form = await response.json();

            const title = document.getElementById('formTitle');
            const tableHead = document.querySelector('#result thead tr');

            title.innerHTML = `
                <h2>${form.title}</h2>
                <p>${form.description}</p>
            `;

            // Buat header tabel berdasarkan field label
            form.fields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.label;
                tableHead.appendChild(th);
            });

            // Tambah kolom waktu pengiriman
            const thTime = document.createElement('th');
            thTime.textContent = 'Waktu Submit';
            tableHead.appendChild(thTime);

            // Setelah header siap, ambil data responnya
            const respond = await fetch(`http://localhost:3000/api/forms/${id}/responses`);
            const data = await respond.json();
            try {
                const tableBody = document.querySelector('#result tbody');
                tableBody.innerHTML = '';

                data.forEach(res => {
                    const tr = document.createElement('tr');

                    // Tampilkan jawaban berdasarkan urutan field
                    form.fields.forEach(field => {
                        const td = document.createElement('td');
                        td.textContent = res.answers?.[field.name] || '-';
                        tr.appendChild(td);
                    });

                    // Kolom waktu kirim
                    const tdTime = document.createElement('td');
                    const date = new Date(res.submittedAt);
                    tdTime.textContent = date.toLocaleString();
                    tr.appendChild(tdTime);

                    tableBody.appendChild(tr);
                });
            } catch (err) {
                console.error('Gagal mengambil data respons:', err);
            }
        } catch (err) {
            console.error('Gagal mengambil data form:', err);
        }
    }
}
responseShow();