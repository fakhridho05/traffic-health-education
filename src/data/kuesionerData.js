export const KUESIONER_DB = {
  "data-diri": {
    title: "Data Diri Responden",
    desc: "Silakan lengkapi data diri Anda dan balita di bawah ini.",
    type: "form",
    fields: [
      { id: "nama_ibu", label: "Nama Lengkap Ibu", type: "text", placeholder: "Contoh: Siti Aminah" },
      { id: "usia_ibu", label: "Usia Ibu (Tahun)", type: "number", placeholder: "Contoh: 28" },
      { id: "pendidikan", label: "Pendidikan Terakhir", type: "select", options: ["SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "Diploma/Sarjana"] },
      { id: "pekerjaan", label: "Pekerjaan Ibu", type: "select", options: ["Ibu Rumah Tangga", "Wiraswasta", "Karyawan Swasta", "PNS", "Lainnya"] },
      { id: "nama_anak", label: "Nama Lengkap Balita", type: "text", placeholder: "Contoh: Budi Santoso" },
      { id: "usia_anak", label: "Usia Balita (Bulan)", type: "number", placeholder: "Contoh: 24" },
      { id: "jk_anak", label: "Jenis Kelamin Balita", type: "select", options: ["Laki-laki", "Perempuan"] }
    ]
  },
  "epaq": {
    title: "Kuesioner Sikap Ibu (EPAQ)",
    desc: "Pilihlah jawaban yang paling menggambarkan sikap Anda. (1: Sangat Tidak Setuju, 2: Tidak Setuju, 3: Ragu-ragu, 4: Setuju, 5: Sangat Setuju)",
    type: "likert",
    options: ["Sangat Tidak Setuju", "Tidak Setuju", "Ragu-ragu", "Setuju", "Sangat Setuju"],
    questions: [
      "Saya merasa bertanggung jawab penuh atas pemenuhan gizi anak saya setiap hari.",
      "Saya percaya bahwa pola makan anak saat balita akan mempengaruhi kecerdasannya di masa depan.",
      "Saya merasa bahwa mencari informasi kesehatan di Posyandu adalah hal yang sangat penting.",
      "Saya khawatir jika berat badan anak saya tidak naik dalam satu bulan.",
      "Saya merasa marah atau mudah terpancing emosi ketika anak menolak makanan (GTM).",
      "Saya yakin saya mampu menyediakan makanan yang sehat dan bergizi untuk anak meskipun dengan dana terbatas.",
      "Saya merasa percaya diri untuk menolak mitos makanan dari lingkungan yang tidak sesuai anjuran dokter.",
      "Saya sering merasa cemas jika anak saya makan lebih sedikit dari biasanya.",
      "Saya percaya bahwa membujuk anak makan lebih baik daripada memaksanya.",
      "Saya merasa bahwa menjaga kebersihan tangan dan alat makan sama pentingnya dengan isi makanan itu sendiri."
    ]
  },
  "psdq": {
    title: "Kuesioner Pola Asuh (PSDQ)",
    desc: "Seberapa sering Anda melakukan hal-hal berikut? (1: Tidak Pernah, 2: Jarang, 3: Kadang-kadang, 4: Sering, 5: Selalu)",
    type: "likert",
    options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"],
    questions: [
      "Saya memberikan pujian ketika anak melakukan sesuatu dengan baik.",
      "Saya menjelaskan alasan mengapa sebuah aturan harus dipatuhi oleh anak.",
      "Saya membentak atau berteriak ketika anak melakukan kesalahan.",
      "Saya menghukum anak secara fisik (memukul, mencubit) saat ia nakal.",
      "Saya memeluk dan menunjukkan kasih sayang fisik kepada anak setiap hari.",
      "Saya mendengarkan cerita dan keluhan anak dengan penuh perhatian.",
      "Saya membiarkan anak memilih pakaian atau mainannya sendiri.",
      "Saya mengancam anak agar ia mau mematuhi perintah saya.",
      "Saya mengajak anak bermain dan berinteraksi secara aktif setiap hari tanpa gadget.",
      "Saya menuruti semua kemauan anak ketika ia menangis atau tantrum di tempat umum."
    ]
  },
  "praktik": {
    title: "Kuesioner Praktik Pengasuhan",
    desc: "Pilihlah jawaban yang paling sesuai dengan rutinitas Anda sehari-hari.",
    type: "multiple_choice",
    questions: [
      {
        q: "Berapa kali anak Anda makan utama (nasi/karbohidrat + lauk) dalam sehari?",
        options: ["1 kali", "2 kali", "3 kali atau lebih", "Tidak menentu"]
      },
      {
        q: "Apakah Anda selalu mencuci tangan dengan sabun sebelum menyuapi anak?",
        options: ["Selalu", "Sering", "Kadang-kadang", "Jarang/Tidak Pernah"]
      },
      {
        q: "Berapa jam biasanya anak Anda (balita) tidur pada malam hari?",
        options: ["Kurang dari 8 jam", "8 - 10 jam", "11 - 12 jam", "Lebih dari 12 jam"]
      },
      {
        q: "Sumber protein hewani apa yang paling sering Anda berikan dalam seminggu terakhir?",
        options: ["Telur ayam", "Ikan (lele, nila, dll)", "Ayam/Daging sapi", "Hanya tahu/tempe (tidak ada protein hewani)"]
      },
      {
        q: "Kapan terakhir kali Anda membawa balita Anda ke Posyandu untuk ditimbang?",
        options: ["Bulan ini", "Bulan lalu", "Lebih dari 2 bulan yang lalu", "Tidak pernah"]
      },
      {
        q: "Bagaimana cara Anda memberikan air minum untuk balita di rumah?",
        options: ["Air galon isi ulang tanpa direbus", "Air galon bermerek (segel)", "Air sumur/PAM yang direbus mendidih", "Air sumur/PAM tanpa direbus"]
      },
      {
        q: "Apa yang Anda lakukan jika anak menutup mulut rapat-rapat saat disuapi?",
        options: ["Memaksanya membuka mulut", "Menunggu sejenak dan mencoba lagi nanti", "Langsung mengganti dengan susu/camilan manis", "Memarahinya"]
      },
      {
        q: "Berapa lama rata-rata waktu yang dihabiskan anak untuk menonton HP/TV setiap hari?",
        options: ["Tidak pernah / 0 jam", "Kurang dari 1 jam", "1-2 jam", "Lebih dari 2 jam"]
      },
      {
        q: "Apakah balita Anda selalu memakai alas kaki (sandal/sepatu) saat bermain di halaman bertanah?",
        options: ["Selalu", "Sering", "Kadang-kadang", "Tidak pernah"]
      },
      {
        q: "Berapa kali anak Anda mandi dan disikat giginya dalam sehari?",
        options: ["2 kali mandi, 2 kali sikat gigi", "2 kali mandi, jarang sikat gigi", "1 kali mandi sehari", "Tidak menentu"]
      }
    ]
  }
};
