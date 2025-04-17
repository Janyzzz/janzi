const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const question = document.getElementById('question');
const message = document.getElementById('message');
const heartsContainer = document.getElementById('hearts-container');
const buttonsContainer = document.querySelector('.buttons'); // Butonların kapsayıcısı

noButton.addEventListener('mouseover', moveButton);
noButton.addEventListener('click', moveButton); // Dokunmatik cihazlar için tıklamada da kaçsın

yesButton.addEventListener('click', () => {
    // Soruyu ve butonları gizle
    question.style.display = 'none';
    buttonsContainer.style.display = 'none';

    // Mesajı göster ve celebration sınıfını ekle
    message.style.display = 'block';
    message.classList.add('celebration');

    // Kalp animasyonunu başlat
    startHeartAnimation();

    // Havai fişek ve konfeti efektlerini başlat
    startCelebration();
});

function moveButton() {
    const containerRect = document.querySelector('.container').getBoundingClientRect(); // Ana kutunun sınırları
    const yesButtonRect = yesButton.getBoundingClientRect();
    const noButtonRect = noButton.getBoundingClientRect();
    const maxOffset = 150; // Butonun merkezden maksimum ne kadar uzağa gidebileceği (piksel)

    let newTop, newLeft;
    let attempts = 0;
    const maxAttempts = 20; // Sonsuz döngüden kaçınmak için deneme sınırı

    // Butonun yeni pozisyonunu hesapla (ana kutu içinde ve Evet'e yakın)
    do {
        // Rastgele bir açı ve mesafe seç
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * maxOffset;

        // Evet butonunun merkezini referans alarak yeni konumu hesapla
        const yesButtonCenterX = yesButtonRect.left + yesButtonRect.width / 2;
        const yesButtonCenterY = yesButtonRect.top + yesButtonRect.height / 2;

        newLeft = yesButtonCenterX + Math.cos(angle) * distance - noButtonRect.width / 2;
        newTop = yesButtonCenterY + Math.sin(angle) * distance - noButtonRect.height / 2;

        // Yeni konumun ana kutu içinde olduğundan emin ol
        newLeft = Math.max(containerRect.left, Math.min(newLeft, containerRect.right - noButtonRect.width));
        newTop = Math.max(containerRect.top, Math.min(newTop, containerRect.bottom - noButtonRect.height));

        attempts++;
        // Çakışma varsa veya deneme sınırına ulaşıldıysa döngüden çık
    } while (
        isOverlapping(newTop, newLeft, noButtonRect.width, noButtonRect.height) &&
        attempts < maxAttempts
    );

    // Eğer çakışma çözülemediyse (çok nadir), basit bir kaçış yap
    if (attempts === maxAttempts && isOverlapping(newTop, newLeft, noButtonRect.width, noButtonRect.height)) {
        newLeft = yesButtonRect.left + yesButtonRect.width + 30; // Evet'in sağına koy
        newTop = yesButtonRect.top;
        // Sağ kenarı taşıyorsa sola koy
        if (newLeft + noButtonRect.width > containerRect.right) {
             newLeft = yesButtonRect.left - noButtonRect.width - 30;
        }
    }

    // Butonun stilini ayarla (body'e göre değil, kendi konumuna göre)
    noButton.style.position = 'absolute'; // Zaten absolute olmalı ama garanti edelim
    noButton.style.left = `${newLeft - containerRect.left}px`; // Ana kutuya göre sol
    noButton.style.top = `${newTop - containerRect.top}px`;   // Ana kutuya göre üst

}

// Yeni pozisyonun Evet butonu ile çakışıp çakışmadığını kontrol eden fonksiyon
function isOverlapping(newTop, newLeft, buttonWidth, buttonHeight) {
    const yesButtonRect = yesButton.getBoundingClientRect();
    // Hesaplanan yeni koordinatların ekran koordinatları olduğunu varsayalım
    const noButtonPotentialRect = {
        top: newTop,
        left: newLeft,
        right: newLeft + buttonWidth,
        bottom: newTop + buttonHeight
    };

    const padding = 5; // Butonlar arasında minimum boşluk

    // Çakışma kontrolü (biraz boşluk bırakarak)
    return (
        noButtonPotentialRect.right + padding > yesButtonRect.left &&
        noButtonPotentialRect.left - padding < yesButtonRect.right &&
        noButtonPotentialRect.bottom + padding > yesButtonRect.top &&
        noButtonPotentialRect.top - padding < yesButtonRect.bottom
    );
}

function startHeartAnimation() {
    // heartsContainer.style.display = 'block'; CSS'de zaten block
    setInterval(createHeart, 150); // Biraz daha sık kalp oluşturalım
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    // Rastgele başlangıç pozisyonu (ekranın alt kenarından)
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.bottom = '-30px'; // Ekranın biraz altından başlasın

    // Rastgele boyut (CSS değişkeni ile)
    const scale = Math.random() * 0.6 + 0.7; // 0.7 ile 1.3 arası
    heart.style.setProperty('--heart-scale', scale);
    heart.style.setProperty('--heart-scale-end', scale * (Math.random() * 0.5 + 0.8)); // Bitiş boyutu da biraz değişsin

    // Rastgele animasyon süresi
    const duration = Math.random() * 3 + 4; // 4 ile 7 saniye arası süre
    heart.style.animationDuration = `${duration}s`;

    // Rastgele renk tonu (pembe/kırmızı tonları)
    const hue = Math.random() * 30 - 15; // -15 ile +15 arası (0 kırmızı)
    heart.style.backgroundColor = `hsl(${hue}, 100%, 60%)`; // Biraz daha canlı renk
    // ::before ve ::after stilleri inherit ile rengi alacak (CSS'de güncellendi)

    // Rastgele hafif dönüş ekleyelim (CSS değişkeni ile)
    const rotation = Math.random() * 90 - 45; // -45 ile +45 derece arası ekstra dönüş
    heart.style.setProperty('--heart-rotation', `${-45 + rotation}deg`);

    // Oluşturulan kalbi konteynere ekle
    heartsContainer.appendChild(heart);

    // Animasyon bittikten sonra kalbi DOM'dan kaldır
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// Başlangıçta noButton'ın pozisyonunu ayarla (Evet'in yanına)
function setInitialNoButtonPosition() {
    const yesButtonRect = yesButton.getBoundingClientRect();
    const noButtonRect = noButton.getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect(); // Ana kutu
    const buttonsContainer = document.querySelector('.buttons'); // Butonların direkt kapsayıcısı

    // Butonları kapsayıcıya göre konumlandıracağız
    buttonsContainer.style.position = 'relative'; // Kapsayıcıyı göreceli yap
    yesButton.style.position = 'static'; // Yes butonu akışta kalsın
    noButton.style.position = 'absolute'; // No butonu mutlak konumlu olsun

    // Yes butonunun *kapsayıcı içindeki* göreceli konumunu hesapla
    const yesButtonOffsetLeft = yesButton.offsetLeft;
    const yesButtonOffsetTop = yesButton.offsetTop;

    // noButton'ı yesButton'ın sağına yerleştir
    let noButtonLeft = yesButtonOffsetLeft + yesButton.offsetWidth + 20; // 20px boşluk
    let noButtonTop = yesButtonOffsetTop;

    // Kapsayıcının sağ kenarını aşıp aşmadığını kontrol et (kapsayıcıya göre)
    if (noButtonLeft + noButtonRect.width > buttonsContainer.offsetWidth - 10) { // 10px kenar boşluğu
        // Eğer aşıyorsa, yesButton'ın soluna yerleştir
        noButtonLeft = yesButtonOffsetLeft - noButtonRect.width - 20;
    }

    // Eğer hala sola taşıyorsa (çok dar), altına yerleştirmeyi deneyebiliriz
    if (noButtonLeft < 10) {
        noButtonLeft = yesButtonOffsetLeft;
        noButtonTop = yesButtonOffsetTop + yesButton.offsetHeight + 15;
    }

    noButton.style.left = `${noButtonLeft}px`;
    noButton.style.top = `${noButtonTop}px`;
}

// Sayfa yüklendiğinde buton pozisyonunu ayarla
window.addEventListener('load', setInitialNoButtonPosition);
// Pencere yeniden boyutlandırıldığında tekrar ayarla
window.addEventListener('resize', setInitialNoButtonPosition);

function startCelebration() {
    // Havai fişekleri başlat
    const fireworkInterval = setInterval(createFirework, 300);
    // Konfetiyi başlat
    const confettiInterval = setInterval(createConfetti, 100);

    // 5 saniye sonra havai fişekleri durdur
    setTimeout(() => {
        clearInterval(fireworkInterval);
        clearInterval(confettiInterval);
    }, 5000);
}

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    document.body.appendChild(firework);

    // Havai fişeğin başlangıç pozisyonu
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;

    firework.style.left = startX + 'px';
    firework.style.top = startY + 'px';

    // Patlama efekti için parçacıklar oluştur
    const particleCount = 30;
    const colors = ['#ff0', '#f0f', '#0ff', '#fff', '#f00', '#0f0'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        // Rastgele renk seç
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 4px ${color}`;

        // Rastgele açı ve mesafe
        const angle = (i * 360 / particleCount) + Math.random() * 30;
        const velocity = 50 + Math.random() * 50;
        const rad = angle * Math.PI / 180;
        
        // CSS değişkenleri ile son pozisyonu ayarla
        particle.style.setProperty('--final-y', `-${Math.sin(rad) * velocity}px`);
        particle.style.setProperty('--final-x', `${Math.cos(rad) * velocity}px`);

        firework.appendChild(particle);
    }

    // Animasyon bittikten sonra temizle
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    document.body.appendChild(confetti);

    // Rastgele başlangıç pozisyonu
    const startX = Math.random() * window.innerWidth;
    confetti.style.left = startX + 'px';
    confetti.style.top = '-10px';

    // Rastgele renk ve şekil
    const colors = ['#ff0', '#f0f', '#0ff', '#fff', '#f00', '#0f0'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    // Rastgele şekil (kare veya dikdörtgen)
    if (Math.random() > 0.5) {
        confetti.style.width = '10px';
        confetti.style.height = '5px';
    }

    // Animasyon bittikten sonra temizle
    setTimeout(() => {
        confetti.remove();
    }, 4000);
} 