<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EducationController extends Controller
{
    private function getArticles()
    {
        return [
            [
                'id' => 1,
                'title' => "Panduan Lengkap Pijat Bayi untuk Mendukung Kualitas Tidur",
                'category' => "ibu-anak",
                'categoryLabel' => "Ibu & Anak",
                'readTime' => "5 Menit Baca",
                'excerpt' => "Pijat bayi bukan hanya membuat si kecil rileks, tapi juga mempererat bonding antara ibu dan anak. Simak langkah-langkah amannya di sini.",
                'imageGradient' => "from-pink-400 to-rose-400",
                'isFeatured' => true,
                'content' => "Pijat bayi adalah seni sentuhan yang telah dipraktikkan selama berabad-abad di berbagai budaya. Selain memberikan relaksasi, pijatan lembut pada bayi terbukti secara klinis dapat meningkatkan kualitas tidur, mengurangi durasi menangis, serta memperkuat sistem kekebalan tubuh.\n\nLangkah-langkah Pijat Bayi yang Aman:\n1. Persiapan: Pastikan ruangan hangat dan nyaman. Gunakan minyak khusus bayi (baby oil) atau minyak nabati seperti minyak zaitun murni.\n2. Kaki dan Telapak Kaki: Mulailah dari bagian bawah tubuh bayi. Usap lembut dari paha ke arah telapak kaki, lalu pijat memutar pada telapak kakinya.\n3. Perut: Lakukan gerakan memutar searah jarum jam di area perut. Gerakan yang dikenal dengan teknik \"I Love U\" (ILU) sangat baik untuk mengatasi kolik atau gas di perut bayi.\n4. Dada dan Tangan: Usap dari bagian tengah dada ke arah bahu menyilang seperti sayap kupu-kupu. Lanjutkan dengan pijatan lembut di sepanjang lengan hingga ujung jari.\n5. Punggung: Posisikan bayi tengkurap dengan hati-hati, lalu usap perlahan dari leher turun ke bokong.\n\nKapan Waktu Terbaik? Lakukan pijat bayi saat ia dalam keadaan bangun, tenang, dan tidak sedang lapar atau tepat setelah minum susu. Waktu ideal adalah sebelum mandi atau sebelum tidur malam."
            ],
            [
                'id' => 2,
                'title' => "10 Superfood MPASI Penambah Berat Badan Anak",
                'category' => "mpasi",
                'categoryLabel' => "Tips MPASI",
                'readTime' => "4 Menit Baca",
                'excerpt' => "Bingung berat badan anak seret? Masukkan 10 bahan makanan padat nutrisi ini ke dalam menu harian MPASI si kecil.",
                'imageGradient' => "from-orange-400 to-amber-500",
                'isFeatured' => false,
                'content' => "Menghadapi fase berat badan anak yang stagnan (seret) seringkali membuat para ibu khawatir. Kuncinya adalah memberikan makanan padat kalori (calorie dense) dalam porsi kecil namun sering, daripada porsi besar yang sulit dihabiskan anak.\n\nBerikut 10 Superfood Penambah BB Anak:\n1. Alpukat: Kaya akan lemak baik dan kalori. Mudah dihaluskan untuk bayi mulai 6 bulan.\n2. Telur: Sumber protein hewani terbaik. Pastikan dimasak hingga matang sempurna.\n3. Hati Ayam/Sapi: Sangat tinggi zat besi untuk mencegah anemia yang bisa menghambat nafsu makan.\n4. Santan Kental: Tambahkan pada bubur, sayur lodeh, atau camilan manis seperti kolak pisang.\n5. Keju: Penambah rasa gurih sekaligus sumber kalsium dan lemak. Pilih keju khusus bayi (belcube/kiri) atau keju cheddar olahan.\n6. Daging Sapi Cincang: Mengandung zat besi heme yang sangat mudah diserap tubuh.\n7. Ikan Salmon atau Kembung: Kaya Omega 3 untuk kecerdasan otak.\n8. Mentega/Butter: Gunakan sebagai lemak tambahan (LT) saat menumis bumbu MPASI.\n9. Selai Kacang (Peanut Butter): Berikan tipis-tipis pada roti atau campurkan ke bubur oatmeal, pastikan anak tidak alergi.\n10. Minyak Zaitun (EVOO): Tambahkan 1 sendok teh pada makanan yang sudah matang dan siap disajikan.\n\nJangan lupa untuk tetap memantau kurva pertumbuhan di KMS Posyandu setiap bulannya!"
            ],
            [
                'id' => 3,
                'title' => "Mengenal Gejala Awal Stunting Sejak 1000 Hari Pertama",
                'category' => "stunting",
                'categoryLabel' => "Cegah Stunting",
                'readTime' => "7 Menit Baca",
                'excerpt' => "Stunting bisa dicegah sejak masa kehamilan. Kenali tanda-tandanya dan pastikan anak selalu dalam kurva pertumbuhan yang aman.",
                'imageGradient' => "from-emerald-400 to-teal-500",
                'isFeatured' => false,
                'content' => "Stunting bukan sekadar kondisi anak yang pendek, melainkan kegagalan tumbuh kembang akibat kekurangan gizi kronis dan infeksi berulang, terutama pada 1000 Hari Pertama Kehidupan (HPK).\n\nApa itu 1000 HPK?\nFase ini dimulai sejak pembuahan dalam kandungan (270 hari) hingga anak berusia 2 tahun (730 hari). Ini adalah masa emas di mana 80% otak anak berkembang.\n\nGejala Awal Stunting (Failure to Thrive):\n- Berat badan tidak naik (stagnan) selama 2 bulan berturut-turut.\n- Pertumbuhan tinggi badan terhambat, kurva bergeser ke bawah (di bawah garis merah KMS).\n- Perkembangan motorik dan kognitif terlambat (misal: telat tengkurap, merangkak, bicara).\n- Anak mudah sakit dan rentan terkena penyakit infeksi.\n\nCara Mencegah Stunting:\n1. Ibu hamil wajib mengonsumsi TTD (Tablet Tambah Darah) dan makanan bergizi seimbang.\n2. Inisiasi Menyusu Dini (IMD) dan berikan ASI Eksklusif selama 6 bulan.\n3. Berikan MPASI yang adekuat (kaya protein hewani) mulai usia 6 bulan.\n4. Bawa anak ke Posyandu setiap bulan untuk memantau berat dan tinggi badan.\n5. Pastikan sanitasi dan air bersih di lingkungan rumah tangga terjaga."
            ],
            [
                'id' => 4,
                'title' => "Jadwal Imunisasi Dasar Lengkap Kemenkes 2026",
                'category' => "imunisasi",
                'categoryLabel' => "Imunisasi",
                'readTime' => "6 Menit Baca",
                'excerpt' => "Panduan terbaru dan terlengkap mengenai jadwal imunisasi wajib untuk bayi usia 0-24 bulan yang tidak boleh terlewat.",
                'imageGradient' => "from-blue-400 to-indigo-500",
                'isFeatured' => false,
                'content' => "Imunisasi adalah hak anak untuk mendapatkan perlindungan dari Penyakit yang Dapat Dicegah Dengan Imunisasi (PD3I). Berikut adalah jadwal terbaru sesuai rekomendasi Kementerian Kesehatan RI tahun 2026.\n\nUsia 0 Bulan (Baru Lahir):\n- Hepatitis B0 (sebaiknya dalam waktu 12 jam setelah lahir).\n\nUsia 1 Bulan:\n- BCG (Mencegah tuberkulosis/TBC).\n- Polio 1 (tetes mulut).\n\nUsia 2 Bulan:\n- DPT-HB-Hib 1 (Mencegah Difteri, Pertusis, Tetanus, Hepatitis B, infeksi Haemophilus influenzae tipe b).\n- Polio 2.\n- Rotavirus (RV) 1 (Mencegah diare berat akut).\n\nUsia 3 Bulan:\n- DPT-HB-Hib 2.\n- Polio 3.\n- Rotavirus (RV) 2.\n\nUsia 4 Bulan:\n- DPT-HB-Hib 3.\n- Polio 4.\n- Rotavirus (RV) 3.\n- IPV (Polio suntik).\n\nUsia 9 Bulan:\n- MR (Campak Rubella).\n\nImunisasi Lanjutan:\n- Usia 18 Bulan: DPT-HB-Hib lanjutan dan MR lanjutan.\n\nJangan khawatir dengan kejadian Ikutan Pasca Imunisasi (KIPI) seperti demam ringan. Itu adalah respons normal tubuh yang sedang membentuk antibodi. Berikan paracetamol sesuai dosis dokter jika anak terlihat rewel."
            ],
            [
                'id' => 5,
                'title' => "Pentingnya Jam Tidur Teratur Bagi Perkembangan Otak Balita",
                'category' => "pola-hidup",
                'categoryLabel' => "Pola Hidup Sehat",
                'readTime' => "3 Menit Baca",
                'excerpt' => "Tidur malam yang cukup sangat krusial untuk regenerasi sel otak anak. Berapa lama idealnya balita tidur setiap hari?",
                'imageGradient' => "from-violet-400 to-fuchsia-500",
                'isFeatured' => false,
                'content' => "Tidur bukan sekadar waktu istirahat, melainkan fase aktif di mana otak anak memproses informasi, menyimpan memori, dan meregenerasi sel-sel saraf. Hormon pertumbuhan (Growth Hormone) juga diproduksi paling maksimal saat anak berada pada fase tidur lelap (deep sleep).\n\nKebutuhan Tidur Anak Berdasarkan Usia:\n- Bayi 0-3 bulan: 14-17 jam / hari.\n- Bayi 4-11 bulan: 12-15 jam / hari.\n- Balita 1-2 tahun: 11-14 jam / hari.\n- Prasekolah 3-5 tahun: 10-13 jam / hari.\n\nDampak Kurang Tidur Pada Anak:\n- Anak cenderung hiperaktif, rewel (tantrum), dan sulit fokus.\n- Penurunan daya tahan tubuh sehingga mudah sakit.\n- Risiko obesitas dan gangguan pertumbuhan (stunting).\n\nTips Membangun Rutinitas Tidur (Sleep Hygiene):\n1. Terapkan jam tidur yang sama setiap malam.\n2. Lakukan rutinitas yang menenangkan sebelum tidur (misal: mandi air hangat, membacakan buku cerita, menyanyikan nina bobo).\n3. Matikan layar (TV/HP) minimal 1 jam sebelum tidur.\n4. Redupkan lampu kamar untuk merangsang produksi hormon melatonin (hormon tidur)."
            ],
            [
                'id' => 6,
                'title' => "Resep Snack MPASI Tinggi Kalori (Snack BB Booster)",
                'category' => "mpasi",
                'categoryLabel' => "Tips MPASI",
                'readTime' => "4 Menit Baca",
                'excerpt' => "Cobain resep puding roti keju dan bola-bola daging ayam yang lezat, bergizi tinggi, dan pasti disukai anak-anak.",
                'imageGradient' => "from-amber-400 to-yellow-500",
                'isFeatured' => false,
                'content' => "Di sela-sela makanan utama, camilan atau snack MPASI bisa menjadi andalan untuk mendongkrak kalori harian anak. Berikut dua resep andalan BB Booster!\n\n1. Puding Roti Keju Lumer (Usia 9 bulan ke atas)\nBahan:\n- 2 lembar roti tawar gandum tanpa kulit\n- 1 butir telur ayam kampung\n- 100 ml susu cair UHT (full cream)\n- 1 sdm santan kental\n- Keju parut secukupnya\n- Sedikit margarin untuk mengoles wadah\n\nCara Membuat:\n- Sobek kecil-kecil roti tawar ke dalam wadah tahan panas yang sudah dioles margarin.\n- Kocok telur, campurkan dengan susu UHT dan santan.\n- Siram campuran cairan ke atas roti tawar hingga meresap.\n- Taburi keju parut di atasnya.\n- Kukus selama kurang lebih 15-20 menit hingga matang. Sajikan hangat.\n\n2. Bola-bola Daging Wortel (Usia 10 bulan ke atas, finger food)\nBahan:\n- 100 gram daging sapi/ayam cincang halus\n- 1 buah kentang ukuran sedang, kukus dan haluskan\n- 1/2 buah wortel, parut halus\n- 1 butir telur\n- Bumbu: Bawang putih bubuk, sedikit garam (untuk usia >1th), kaldu jamur tanpa MSG.\n\nCara Membuat:\n- Campurkan semua bahan menjadi satu adonan.\n- Bentuk bulat-bulat kecil seukuran gigitan bayi (bite-size).\n- Goreng bola-bola daging dengan mentega atau minyak zaitun hingga kecokelatan.\n- Bisa disajikan sebagai camilan atau disantap bersama nasi lembek."
            ]
        ];
    }

    public function index()
    {
        $articles = $this->getArticles();
        return Inertia::render('User/EdukasiKesehatan', [
            'articles' => $articles
        ]);
    }

    public function show($id)
    {
        $articles = $this->getArticles();
        
        $article = collect($articles)->firstWhere('id', (int)$id);

        if (!$article) {
            abort(404);
        }

        // Dapatkan 3 artikel terbaru lainnya untuk rekomendasi
        $relatedArticles = collect($articles)->where('id', '!=', (int)$id)->take(3)->values();

        return Inertia::render('User/EdukasiKesehatanDetail', [
            'article' => $article,
            'relatedArticles' => $relatedArticles
        ]);
    }
}