document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(11, 34, 57, 0.95)';
            header.style.padding = '0';
        } else {
            header.style.backgroundColor = 'rgba(11, 34, 57, 0.8)';
            header.style.padding = '10px 0';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Floor plan tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Simple reveal animation on scroll
    const revealElements = document.querySelectorAll('.overview-text, .overview-image, .apt-card, .policy-card');

    const revealOpts = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.style.animation = `fadeIn 1s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, revealOpts);

    revealElements.forEach(el => {
        el.style.opacity = '0'; // Initial state for animation
        revealObserver.observe(el);
    });

    // Modal Logic & Google Sheets Integration
    const modal = document.getElementById('registerModal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.getElementById('closeModal');
    const registerForm = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');

    // ANH NTD: THAY ĐƯỜNG LINK WEB APP URL CỦA GOOGLE SCRIPT VÀO ĐÂY SAU KHI TẠO XONG:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJce-kEUez_QZ2A1WDokgL3MSi0eO-FWDtyfx3TZR4aMncSMuY6j9sIpwwyU8o0reo/exec';

    if (modal && openBtns.length > 0) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        if (registerForm) {
            registerForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Đổi text để báo trạng thái đang xử lý
                const originalBtnText = submitBtn.innerText;
                submitBtn.innerText = 'ĐANG GỬI...';
                submitBtn.disabled = true;

                const formData = new FormData(registerForm);

                // Thêm dấu nháy đơn để Google Sheet giữ nguyên số 0 ở đầu
                const phone = formData.get('soDienThoai');
                if (phone && !phone.startsWith("'")) {
                    formData.set('soDienThoai', "'" + phone);
                }

                // Dùng fetch để gọi API ngầm
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        alert('Cảm ơn anh/chị đã đăng ký! Bảng giá cập nhật vừa được yêu cầu. Chuyên viên sẽ gọi cho anh/chị sau ít phút.');
                        modal.classList.remove('active');
                        registerForm.reset();
                    })
                    .catch(error => {
                        alert('Cảm ơn anh/chị đã đăng ký! Chuyên viên sẽ gọi cho anh/chị sau ít phút.');
                        modal.classList.remove('active');
                    })
                    .finally(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    });
            });
        }
    }
    // Image Lightbox Logic
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');

    // Select all images from the page except the header and footer logos
    const zoomableImages = document.querySelectorAll('img:not(.logo img):not(.footer-logo)');
    zoomableImages.forEach(img => {
        img.style.cursor = 'zoom-in';
    });

    if (imageLightbox && zoomableImages.length > 0) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                imageLightbox.classList.add('active');
            });
        });

        closeLightbox.addEventListener('click', () => {
            imageLightbox.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === imageLightbox) {
                imageLightbox.classList.remove('active');
            }
        });
    }
});
