const addFieldBtn = document.getElementById("addField");
const fieldList = document.getElementById("fieldList");
let fields = [];

addFieldBtn.addEventListener("click", () => {
    const label = document.getElementById("label").value.trim();
    const type = document.getElementById("type").value;
    const question = document.getElementById("question");

    if (!label) return alert("Label pertanyaan tidak boleh kosong!");

    // Buat nama unik dari label
    const name = label.toLowerCase().replace(/\s+/g, "_");

    const field = {label, type, name};
    fields.push(field);

    // Menampilkan form field
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
    question.appendChild(div);
    document.getElementById("label").value = '';
});

// Saat simpan form
document.getElementById("saveForm").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title || fields.length === 0) {
        return alert("Judul dan pertanyaan tidak boleh kosong!");
    }

    const form = { title, description, fields };

    try {
        const res = await fetch("http://localhost:3000/api/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const result = await res.json();
        alert("Form berhasil disimpan!");
        console.log(result);
    } catch (err) {
        console.error("Gagal menyimpan form:", err);
    }
});
