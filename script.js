// Kas listesi - tüm kasların ID'leri ve isimleri
const muscles = [
    { id: 'sternocleidomastoid-left', name: 'Sternocleidomastoid' },
    { id: 'sternocleidomastoid-right', name: 'Sternocleidomastoid' },
    { id: 'trapezius-left', name: 'Trapezius' },
    { id: 'trapezius-right', name: 'Trapezius' },
    { id: 'deltoid-left', name: 'Deltoid' },
    { id: 'deltoid-right', name: 'Deltoid' },
    { id: 'pectoralis-major-left', name: 'Pectoralis Major' },
    { id: 'pectoralis-major-right', name: 'Pectoralis Major' },
    { id: 'serratus-anterior-left', name: 'Serratus Anterior' },
    { id: 'serratus-anterior-right', name: 'Serratus Anterior' },
    { id: 'rectus-abdominis', name: 'Rectus Abdominis' },
    { id: 'external-oblique-left', name: 'External Oblique' },
    { id: 'external-oblique-right', name: 'External Oblique' },
    { id: 'biceps-left', name: 'Biceps' },
    { id: 'biceps-right', name: 'Biceps' },
    { id: 'triceps-left', name: 'Triceps' },
    { id: 'triceps-right', name: 'Triceps' },
    { id: 'brachioradialis-left', name: 'Brachioradialis' },
    { id: 'brachioradialis-right', name: 'Brachioradialis' },
    { id: 'gluteus-maximus-left', name: 'Gluteus Maximus' },
    { id: 'gluteus-maximus-right', name: 'Gluteus Maximus' },
    { id: 'hip-flexors-left', name: 'Hip Flexors' },
    { id: 'hip-flexors-right', name: 'Hip Flexors' },
    { id: 'quadriceps-left', name: 'Quadriceps' },
    { id: 'quadriceps-right', name: 'Quadriceps' },
    { id: 'hamstrings-left', name: 'Hamstrings' },
    { id: 'hamstrings-right', name: 'Hamstrings' },
    { id: 'adductors-left', name: 'Adductors' },
    { id: 'adductors-right', name: 'Adductors' },
    { id: 'gastrocnemius-left', name: 'Gastrocnemius' },
    { id: 'gastrocnemius-right', name: 'Gastrocnemius' },
    { id: 'soleus-left', name: 'Soleus' },
    { id: 'soleus-right', name: 'Soleus' },
    { id: 'tibialis-anterior-left', name: 'Tibialis Anterior' },
    { id: 'tibialis-anterior-right', name: 'Tibialis Anterior' }
];

// Benzersiz kas isimlerini al ve alfabetik sırala
const uniqueMuscles = [...new Set(muscles.map(m => m.name))].sort();

// DOM elementlerini seç
const searchInput = document.getElementById('muscleSearch');
const suggestionsDiv = document.getElementById('suggestions');

// Arama input'una yazma eventi
searchInput.addEventListener('input', function() {
    const value = this.value.toLowerCase().trim();
    suggestionsDiv.innerHTML = '';
    
    // Eğer input boşsa önerileri gizle ve vurgulamaları temizle
    if (value.length === 0) {
        suggestionsDiv.style.display = 'none';
        clearHighlights();
        return;
    }
    
    // Girilen metni içeren kasları filtrele
    const filtered = uniqueMuscles.filter(muscle => 
        muscle.toLowerCase().includes(value)
    );
    
    // Eşleşen kaslar varsa önerileri göster
    if (filtered.length > 0) {
        suggestionsDiv.style.display = 'block';
        
        filtered.forEach(muscle => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = muscle;
            
            // Öneriye tıklama eventi
            div.addEventListener('click', function() {
                searchInput.value = muscle;
                highlightMuscle(muscle);
                suggestionsDiv.style.display = 'none';
            });
            
            suggestionsDiv.appendChild(div);
        });
    } else {
        suggestionsDiv.style.display = 'none';
    }
});

// Enter tuşuna basma eventi
searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
        // Tam eşleşme ara
        const match = uniqueMuscles.find(m => 
            m.toLowerCase() === this.value.toLowerCase().trim()
        );
        
        if (match) {
            highlightMuscle(match);
            suggestionsDiv.style.display = 'none';
        } else {
            // Tam eşleşme yoksa kısmi eşleşme ara
            const partialMatch = uniqueMuscles.find(m => 
                m.toLowerCase().includes(this.value.toLowerCase().trim())
            );
            
            if (partialMatch) {
                searchInput.value = partialMatch;
                highlightMuscle(partialMatch);
                suggestionsDiv.style.display = 'none';
            }
        }
    }
});

// Dışarı tıklama eventi - önerileri kapat
document.addEventListener('click', function(e) {
    if (e.target !== searchInput && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
    }
});

// Belirtilen kas grubunu vurgula
function highlightMuscle(muscleName) {
    clearHighlights();
    
    // Aynı isimdeki tüm kasları bul ve vurgula
    muscles
        .filter(m => m.name === muscleName)
        .forEach(m => {
            const element = document.getElementById(m.id);
            
            if (element) {
                // Kası vurgula
                element.classList.add('highlighted');
                
                // Grup elementi ise içindeki tüm kas elementlerini vurgula
                if (element.tagName === 'g') {
                    const childMuscles = element.querySelectorAll('.muscle');
                    childMuscles.forEach(child => {
                        child.classList.add('highlighted');
                    });
                }
                
                // Etiket varsa göster
                const nextSibling = element.nextElementSibling;
                if (nextSibling && nextSibling.classList && nextSibling.classList.contains('label')) {
                    nextSibling.style.opacity = '1';
                }
                
                // Kası görünür alana kaydır
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
}

// Tüm vurgulamaları temizle
function clearHighlights() {
    // Tüm vurgulu kasları temizle
    document.querySelectorAll('.muscle.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    
    // Tüm etiketleri gizle (hover durumundakiler hariç)
    document.querySelectorAll('.label').forEach(el => {
        const prevSibling = el.previousElementSibling;
        if (!prevSibling || !prevSibling.matches(':hover')) {
            el.style.opacity = '0';
        }
    });
}

// Sayfa yüklendiğinde konsola hoş geldin mesajı
console.log('İnsan Kas Anatomisi yüklendi! 💪');
console.log('Toplam kas grubu:', uniqueMuscles.length);
console.log('Kaslar:', uniqueMuscles.join(', '));