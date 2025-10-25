async function loadForms() {
    try {
        const response = await fetch('http://localhost:3000/api/form-id');
        const data = await response.json();

        const ids = data.ids;
        const list = document.getElementById("fieldList");
        list.innerHTML = ""; // kosongkan daftar dulu

        // gunakan for...of agar bisa await di dalamnya
        for (const id of ids) {
            const res = await fetch(`http://localhost:3000/api/forms/${id}`);
            const form = await res.json();

            const li = document.createElement("li");
            li.innerHTML = `<a href="responses.html?id=${id}">${form.title}</a>`;
            list.appendChild(li);
        }
    } catch (err) {
        console.error('❌ Gagal mengambil form-id:', err);
    }
}

// Memanggil fungsi ini saat halaman dimuat
loadForms();
