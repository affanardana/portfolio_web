/**
 * Indonesian copy.
 *
 * Paragraph strings may contain inline links written as [label](url) —
 * see components/RichText.jsx for the (very small) renderer.
 */
export default {
  code: 'id',
  htmlLang: 'id',
  label: 'Bahasa Indonesia',
  switchTo: 'Switch to English',

  nav: {
    home: 'Beranda',
    about: 'Tentang Saya',
    projects: 'Proyek',
    contact: 'Kontak',
    menu: 'Menu',
    close: 'Tutup menu',
  },

  hero: {
    role: 'AI Engineer',
    name: 'Affan Ardana',
    description:
      'Saya adalah seorang AI Engineer dengan pemahaman mendalam tentang AI, Machine Learning, dan Deep Learning. Saya memiliki pengalaman dalam meneliti dan mengembangkan solusi AI untuk berbagai aplikasi.',
    focus: ['Computer Vision', 'Model Compression', 'Edge Deployment'],
    photoAlt: 'Foto Affan Ardana',
    scrollHint: 'Gulir untuk menjelajah',
    ctaProjects: 'Lihat proyek',
    ctaContact: 'Hubungi saya',
  },

  about: {
    eyebrow: 'Tentang Saya',
    body: [
      'Lulusan Informatika dengan fokus AI dan Deep Learning. Berpengalaman mengembangkan model BERT untuk klasifikasi teks Bahasa Indonesia serta berkontribusi dalam publikasi ilmiah terkait Computer Vision, model compression, dan edge deployment. Memiliki ketertarikan kuat pada penerapan model yang efisien dan siap digunakan di lingkungan nyata.',
    ],
    skillsEyebrow: 'Lebih tentang saya',
    skillsTitle: 'Kemampuan Teknis',
    skillsSubtitle: 'Alat dan skill',
    skills: [
      { id: 'python', name: 'Python', kind: 'Bahasa' },
      { id: 'pytorch', name: 'PyTorch', kind: 'Framework' },
      { id: 'scikitlearn', name: 'scikit-learn', kind: 'Library' },
      { id: 'onnx', name: 'ONNX Runtime', kind: 'Runtime' },
      { id: 'tensorrt', name: 'TensorRT', kind: 'Runtime' },
      { id: 'postgresql', name: 'PostgreSQL', kind: 'Database' },
      { id: 'quantization', name: 'Kuantisasi', kind: 'INT8 · PTQ · QAT' },
      { id: 'data', name: 'Analisis dan Pengolahan Data', kind: 'Skill' },
      { id: 'model', name: 'Modifikasi Model Deep Learning', kind: 'Skill' },
    ],
  },

  projects: {
    eyebrow: 'Proyek',
    subtitle: 'Klik untuk cerita lengkapnya.',
    openLabel: 'Buka detail',
    closeLabel: 'Tutup',
    visitLabel: 'Kunjungi proyek',
    readLabel: 'Baca paper',
    detailLabel: 'Detail proyek',
    escHint: 'Tekan Esc untuk menutup',
    prev: 'Proyek sebelumnya',
    next: 'Proyek berikutnya',
    items: [
      {
        id: 'a',
        number: '01',
        title:
          'Memperkenalkan M-YOLO-CRD: YOLOv4 Ringan dengan Distilasi Representasi Kontrastif untuk Perangkat Edge',
        subtitle:
          'Proyek penelitian yang berfokus pada pengembangan model YOLO baru berbasis YOLOv4, memanfaatkan distilasi untuk menjadikan model efisien pada edge device.',
        tags: ['Research Paper', 'New Model', 'Object Detection', 'PyTorch', 'YOLOv4'],
        link: 'https://ieeexplore.ieee.org/document/10852314/',
        hover: '/img/project-a-hover.png',
        detail: '/img/project-a-detail.png',
        detailAlt: 'Diagram arsitektur teacher–student M-YOLO-CRD',
        previewCaption: 'Arsitektur M-YOLO-CRD',
        stats: [
          { value: '6×', label: 'lebih ringan' },
          { value: '245,5 → 35,76 MB', label: 'ukuran model' },
          { value: '< 4%', label: 'penurunan mAP' },
        ],
        body: [
          'Dalam proyek kami ini, kami mengatasi tantangan mengenai penerapan model object detection (seperti YOLOv4) pada edge device berdaya terbatas yang sebelumnya terhambat oleh beratnya beban komputasi dan besarnya ukuran model. Untuk menyelesaikan masalah tersebut, kami mengusulkan modifikasi berupa penggantian backbone CSPDarknet53 bawaan YOLOv4 dengan model yang jauh lebih ringan, yakni MobileNetV2 atau RepViT.',
          'Guna meminimalkan penurunan akurasi akibat peringkasan arsitektur ini, kami menerapkan teknik Knowledge Distillation (KD), khususnya melalui metode Contrastive Representation Distillation (CRD), untuk mentransfer pengetahuan dari model besar (teacher model) ke model yang lebih kecil (student model).',
          'Melalui eksperimen yang kami lakukan, model modifikasi kami seperti M-YOLO-CRD terbukti sukses mereduksi ukuran model hingga enam kali lipat, dari 245,5 MB menjadi hanya 35,76 MB. Optimalisasi ini mampu mempercepat waktu inferensi secara signifikan pada perangkat keras seperti Jetson Nano, Orin Nano, dan Raspberry Pi 4B, dengan mengorbankan penurunan presisi (mAP) yang sangat minimal dan masih tetap andal untuk digunakan, yaitu di bawah 4%.',
        ],
      },
      {
        id: 'b',
        number: '02',
        title: 'Image-Based Food Nutritional Estimation',
        subtitle:
          'Proyek pribadi pertama saya yang mengimplementasikan model AI. Menghitung kandungan gizi makanan berdasarkan gambar.',
        tags: ['Proyek Pribadi', 'Segmentation', 'PyTorch', 'SAM3', 'PostgreSQL'],
        link: 'https://ifne.vercel.app/',
        hover: '/img/project-b-hover.png',
        detail: '/img/project-b-detail.png',
        detailAlt: 'Tangkapan layar aplikasi estimasi gizi makanan',
        note: {
          tone: 'warning',
          label: 'Perhatian',
          text: 'Proyek ini dibangun menggunakan vibe coding melalui Specification-Driven Development (SDD), namun hanya untuk aplikasi web-nya. Pekerjaan terkait AI dan pemodelan—meliputi pelatihan, evaluasi, dan pemrosesan data—ditulis secara langsung tanpa metode tersebut.',
        },
        stats: [
          { value: '1.358', label: 'item makanan di katalog' },
          { value: 'human-in-the-loop', label: 'alur pelabelan' },
        ],
        body: [
          'Proyek ini mengenai estimasi nilai gizi makanan berdasarkan satu foto, sebuah tugas yang biasanya memerlukan pencarian setiap bahan, penghitungan porsi, dan penjumlahan makronutrien secara manual. Alih-alih menggunakan AI sebagai sistem yang benar-benar otonom, sistem ini dibangun sebagai alur kerja “human-in-the-loop” di mana model mengusulkan dan pengguna yang memutuskan.',
          'Model yang dipakai adalah SAM3, yang diberi masukan berupa nama-nama dari katalog 1.358 jenis makanan. Selanjutnya model membagi piring menjadi makanan terpisah dan model YOLO-depth digunakan untuk mencari informasi kedalaman relatif yang tidak dapat diperoleh dari gambar datar. Porsi dihitung melalui rumus yang didapat dari [paper ini](https://ieeexplore.ieee.org/document/11469902).',
          'Aplikasi ini dibangun dengan React 19, Vite, dan Tailwind CSS di sisi frontend, serta Python 3.12, FastAPI, Pydantic, dan SQLAlchemy di sisi backend, dengan PostgreSQL dan penyimpanan objek di Supabase, sedangkan proses inferensi menggunakan Ultralytics SAM3, model kedalaman YOLO, PyTorch, OpenCV, dan NumPy.',
          'Modeling, yang mencakup pemilihan model, alur kerja segmentasi, dan rumus porsi, dilakukan langsung di Google Colab, sedangkan aplikasi web dibangun dengan bantuan AI melalui Spec-Driven Development (SDD). Aplikasi ini memisahkan foto makanan melalui segmentasi menjadi beberapa bagian. Selain itu model juga memberikan rekomendasi label setiap makanan, namun keputusan akhir pelabelan ada pada user. Data makanan juga disimpan untuk dapat dilihat serta diedit di kemudian hari.',
        ],
      },
      {
        id: 'c',
        number: '03',
        title: 'Predictive and Maintenance Dashboard',
        subtitle:
          'Proyek pribadi kedua saya. Proyek ini menggabungkan pemantauan, prediksi, RAG, dan n8n.',
        tags: [
          'Proyek Pribadi',
          'Monitoring',
          'Prediksi',
          'RAG',
          'n8n',
          'LSTM',
          'all-MiniLM-L6-v2',
          'Qwen2.5',
        ],
        link: 'https://pdm-sim.vercel.app/',
        hover: '/img/project-c-hover.png',
        detail: '/img/project-c-detail.png',
        detailAlt: 'Tampilan telemetri dasbor predictive maintenance',
        note: {
          tone: 'warning',
          label: 'Perhatian',
          text: 'Proyek ini dibangun menggunakan vibe coding melalui Specification-Driven Development (SDD), namun hanya untuk aplikasi web-nya. Pekerjaan terkait AI dan pemodelan—meliputi pelatihan, evaluasi, dan pemrosesan data—ditulis secara langsung tanpa metode tersebut.',
        },
        stats: [
          { value: '60 menit', label: 'horizon kegagalan' },
          { value: '6', label: 'sinyal terpantau' },
        ],
        body: [
          'Proyek ini merupakan gabungan dari sistem monitoring-predictive yang dapat mendeteksi risiko kegagalan serta sistem copilot untuk memahami mengenai komponen yang mengalami kegagalan dan prosedur yang harus diterapkan.',
          'Platform ini dibangun menggunakan FastAPI, React, PostgreSQL (Supabase) dengan pgvector, PyTorch, sentence-transformers, llama.cpp, MQTT, n8n, dan Docker.',
          'Modeling dan pengolahan data — melatih LSTM untuk memperkirakan probabilitas kegagalan dalam 60 menit ke depan, membangun alur kerja n8n untuk mengangkut data MQTT ke database, serta vektorisasi dokumen menggunakan all-MiniLM-L6-v2 ke dalam pgvector — dilakukan langsung di Google Colab.',
          'Aplikasi web, yang terdiri dari API, aturan domain, dasbor, rangkaian pengujian, dan konfigurasi, ditulis oleh agen coding AI melalui Spec-Driven Development (SDD). Alih-alih langsung prompting kepada agen coding, terlebih dahulu menyusun beberapa dokumen spesifikasi yaitu PRD, Masterplan, dokumen standar pemrograman, serta panduan agen yang mengatur cara kerja agen. Kemudian merencanakan setiap fase berdasarkan dokumen-dokumen tersebut dan meninjau hasilnya sebelum fase berikutnya, serta mewajibkan setiap fase berakhir dengan formatting dan testing lengkap. Catatan perubahan dicatat pada changelog.',
        ],
      },
    ],
  },

  contact: {
    eyebrow: 'Kontak',
    title: 'Mari Terhubung',
    emailLabel: 'Email',
    copy: 'Salin',
    copied: 'Tersalin',
    copyFailed: 'Tekan Ctrl+C',
    socialsLabel: 'Temukan saya di',
    emailSubject: 'Halo Affan',
  },

  footer: {
    builtWith: 'Dibangun dengan React, Vite, dan Tailwind CSS',
    rights: 'Affan Ardana',
  },
};
