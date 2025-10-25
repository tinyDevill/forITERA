async function loadForms() {
    try {
        // Mengambil data dari database
        const response = await fetch('http://localhost:3000/api/form-id');
        const data = await response.json();

        const ids = data.ids;
        const list = document.getElementById("fieldList");
        list.innerHTML = ""; // Mengosongkan daftar terlebih dahulu

        // Menggunakan for...of supaya bisa menggunakan await
        for (const id of ids) {
            // Mengambil data form sesuai dengan id
            const res = await fetch(`http://localhost:3000/api/forms/${id}`);
            const form = await res.json();

            // Membuat daftar form yang telah dibuat dan menampilkannya di html
            const li = document.createElement("li");
            li.innerHTML = `<a href="renderer.html?id=${id}">${form.title}</a>`;
            list.appendChild(li);
        }
    } catch (err) {
        console.error('Gagal mengambil form-id:', err);
    }
}

// Memanggil fungsi ini begitu halaman dimuat
loadForms();
