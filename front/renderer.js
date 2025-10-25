async function render() {
    // Ambil id dari url
    const id = new URLSearchParams(window.location.search).get('id');
    
    // Jika id tidak ditemukan
    if (!id) {
        document.body.innerHTML = "<h3>Tidak ada ID form di URL</h3>";
    } else {
        try {
            // Ambil data form sesuai id
            const response = await fetch(`http://localhost:3000/api/forms/${id}`);
            const form = await response.json();

            // Membuat header dari halaman web
            const container = document.getElementById("formHeader");
            container.innerHTML = `
                <h1>${form.title}</h1>
                <p>${form.description}</p>
            `;

            // Membuat bagian untuk memuat data form
            const formElement = document.getElementById("dynamicForm");

            form.fields.forEach(field => {
                const div = document.createElement("div");
                div.classList.add("form-field");

                // Tampilkan field sesuai tipenya
                if (field.type === "text" || field.type === "email") {
                    div.innerHTML = `
                        <label>${field.label}</label>
                        <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}">
                    `;
                } else if (field.type === "textarea") {
                    div.innerHTML = `
                        <label>${field.label}</label>
                        <textarea name="${field.name}" placeholder="${field.placeholder || ''}"></textarea>
                    `;
                } else if (field.type === "select") {
                    const options = field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                    div.innerHTML = `
                        <label>${field.label}</label>
                        <select name="${field.name}">${options}</select>
                    `;
                }

                formElement.appendChild(div);
            });

            // Tombol submit
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Kirim";
            submitBtn.type = "submit";
            formElement.appendChild(submitBtn);

            formElement.addEventListener("submit", async (e) => {
                e.preventDefault();     //cegah reload halaman

                //ambil semua input di form
                const formData = new FormData(formElement);
                const answers = {};

                formData.forEach((value, key) => {
                    answers[key] = value;
                });

                try {
                    const res = await fetch(`http://localhost:3000/api/forms/${id}/submit`, {
                        method: "POST",
                        headers: { "Content-Type" : "application/json"},
                        body: JSON.stringify(answers)
                    })

                    const result = await res.json();
                    alert(result.message);
                    console.log("Data yang dikirim:", JSON.stringify(answers, null, 2));
                } catch (err) {
                    console.error("Gagal mengirim jawaban: ", err);
                    alert("Gagal mengirim jawaban");
                }
            });
        } catch (err) {
            console.error("Gagal memuat form:", err);
            document.body.innerHTML = "<h3>Form tidak ditemukan</h3>";
        }
    }
}
render();