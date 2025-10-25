// 1️⃣ Import library yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { error } = require('console');

// 2️⃣ Inisialisasi aplikasi Express
const app = express();

// 3️⃣ Middleware (pengatur lalu lintas data)
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 4️⃣ Koneksi ke MongoDB
mongoose.connect('mongodb+srv://abisholihan1_db_user:g4mp4ng@cluster0.nu1xcet.mongodb.net/?appName=Cluster0?retryWrites=true&w=majority')
    .then(() => console.log('✅ Terhubung ke MongoDB'))
    .catch(err => console.log('❌ Gagal terhubung ke MongoDB:', err));

// 5️⃣ Buat schema untuk data form
const formSchema = new mongoose.Schema({
    title: String,
    description: String,
    fields: Array
});

const responseSchema = new mongoose.Schema({
    formId: String,     //id form yang sudah dijawab
    answers: Object,     //data jawahban
    submittedAt: { type: Date, default: Date.now }
});

const Form = mongoose.model('Form', formSchema);
const Response = mongoose.model('Response', responseSchema);

// 6️⃣ Endpoint untuk menyimpan form
app.post('/api/forms', async (req, res) => {
    try {
        const form = new Form(req.body);
        await form.save();
        const formId = form._id.toString();
        
        const filePath = './back/formId.json';
        let data = { ids: [] };

        if(fs.existsSync(filePath)){
             
            const raw = fs.readFileSync(filePath, 'utf8');
            try {
                data = JSON.parse(raw);
            } catch {
                data = { ids: [] };
            }
        }
        data.ids.push(formId);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log('✅ Form disimpan dengan ID:', formId);
        res.json({ message: 'Form berhasil disimpan', id: formId });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// 7️⃣ Endpoint untuk mengambil form berdasarkan ID
app.get('/api/forms/:id', async (req, res) => {
    const formId = req.params.id;
    try {
        const form = await Form.findById(formId);
        if (!form) return res.status(404).json({ error: 'Form tidak ditemukan' });
        res.json(form);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// endpoint untuk menyimpan jawaban
app.post('/api/forms/:id/submit', async (req, res) => {
    try {
        const formId = req.params.id;
        const answers = req.body;

        const responseData = new Response({ formId, answers });
        await responseData.save();
        
        console.log(`Jawaban disimpan untuk form ${formId}`);
        res.json({ message: 'Jawaban berhasil disimpan!' });
    } catch (err) {
        console.log('Gagal menyimpan jawaban: ', err);
        res.status(500).json({ error: 'Gagal menyimpan jawaban' });
    }
});

app.get('/api/forms/:id/responses', async (req, res) => {
    try {
        const formId = req.params.id;                   // Mengambil id dari url
        const responses = await Response.find({ formId });    // Mencari respon berdasarkan id
        res.json(responses);                            // Mengirim json ke front-end
    } catch (err) {
        console.log('Gagal mengambil respon: ', err);
        res.status(500).json({ error: 'Gagal mengambil respon' });
    }
});

// endpoint untuk membuka file yang menyimpan id
app.get('/api/form-id', (req, res) => {
    try {
        const data = fs.readFileSync('./back/formId.json', 'utf8');
        const json = JSON.parse(data);
        res.json(json);
    } catch (err) {
        console.error('Tidak bisa membaca file formId.json:', err);
        res.status(404).json({ message: 'Belum ada form yang tersimpan' });
    }
});

// 8️⃣ Jalankan server di port 3000
app.listen(3000, () => console.log('🚀 Server berjalan di http://localhost:3000'));
