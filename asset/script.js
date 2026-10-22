// 1. Fungsi Jam & Tanggal
function updateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('date').textContent = `${dayName}, ${day} ${monthName} ${year}`;
    document.getElementById('year').textContent = year;
}
setInterval(updateTime, 1000);
updateTime();

// 2. Fungsi Pindah Halaman (Beranda <-> Petugas)
function switchView(targetViewId) {
    const views = ['view-home', 'view-petugas'];
    views.forEach(viewId => {
        const el = document.getElementById(viewId);
        if (viewId === targetViewId) {
            el.classList.remove('hidden-view');
        } else {
            el.classList.add('hidden-view');
        }
    });
}

// 3. Fungsi Buka Modal PDF
function openPdfModal(title, pdfUrl) {
    const modal = document.getElementById('pdf-modal');
    const modalContent = document.getElementById('pdf-modal-content');
    
    document.getElementById('pdf-title').textContent = title;
    document.getElementById('pdf-iframe').src = pdfUrl;
    document.getElementById('pdf-download-btn').href = pdfUrl;
    
    modal.classList.remove('hidden-view');
    void modal.offsetWidth; // Trigger reflow untuk animasi
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    
    document.body.style.overflow = 'hidden';
}

// 4. Fungsi Tutup Modal PDF
function closePdfModal() {
    const modal = document.getElementById('pdf-modal');
    const modalContent = document.getElementById('pdf-modal-content');
    
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden-view');
        document.getElementById('pdf-iframe').src = ""; 
        document.body.style.overflow = 'auto';
    }, 300);
}

// Menutup modal dengan klik area luar (backdrop)
document.getElementById('pdf-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePdfModal();
    }
});

// 5. Fungsi Render Data dari JSON
async function loadPetugas() {
    try {
        const response = await fetch('config/data.json');
        const data = await response.json();
        
        const container = document.getElementById('petugas-container');
        container.innerHTML = ''; 
        
        data.petugas.forEach(p => {
            // Gunakan avatar teks inisial jika foto kosong/error
            const inisial = p.nama.charAt(0).toUpperCase();
            const fallbackAvatar = `https://placehold.co/150x150/115e59/ffffff?text=${inisial}`;
            
            const cardHTML = `
            <div class="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
                <img src="${p.foto || fallbackAvatar}" onerror="this.src='${fallbackAvatar}'" alt="Foto ${p.nama}" class="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-md mb-4 bg-teal-800">
                <h3 class="font-bold text-lg mb-1">${p.nama}</h3>
                <p class="text-sm text-teal-100 mb-4 flex items-start justify-center gap-1">
                    <i class="fa-solid fa-location-dot mt-1 text-teal-300"></i>
                    ${p.alamat}
                </p>
                <div class="mt-auto w-full">
                    <button onclick="openPdfModal('Surat Tugas - ${p.nama}', '${p.surat_tugas}')" class="w-full glass-button py-2 rounded-xl flex justify-center items-center gap-2 text-sm font-medium hover:bg-teal-600/50">
                        <i class="fa-solid fa-file-pdf text-red-300"></i> Buka Surat Tugas
                    </button>
                </div>
            </div>
            `;
            container.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error('Gagal memuat data:', error);
        document.getElementById('petugas-container').innerHTML = 
            '<div class="col-span-full text-center text-red-300">Gagal memuat data. (Pastikan dijalankan via Server/Hosting, bukan file C:/)</div>';
    }
}

// Jalankan load data saat web terbuka
document.addEventListener('DOMContentLoaded', loadPetugas);
