document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.querySelector('.submit-btn');

    // Auto-select "Khác" radio/checkbox when typing in the text input
    const industryOtherInput = document.getElementById('industryOther');
    const industryOtherRadio = document.querySelector('input[name="industry"][value="Khác"]');
    
    industryOtherInput.addEventListener('focus', () => {
        industryOtherRadio.checked = true;
    });

    const groupCountInput = document.getElementById('groupCount');
    const groupAttendanceCheck = document.getElementById('groupAttendanceCheck');
    
    groupCountInput.addEventListener('focus', () => {
        groupAttendanceCheck.checked = true;
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Animation for submit button
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>ĐANG XỬ LÝ...</span>';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.pointerEvents = 'none';

        // Prepare data for Google Forms
        const formData = new FormData();
        formData.append('entry.1554085317', document.getElementById('fullName').value);
        formData.append('entry.893063847', document.getElementById('company').value);
        formData.append('entry.1160430535', document.getElementById('phone').value);
        formData.append('entry.949743772', document.getElementById('email').value);

        // Lĩnh vực hoạt động
        const industryRadio = document.querySelector('input[name="industry"]:checked');
        if (industryRadio && industryRadio.value === 'Khác') {
            formData.append('entry.1777886525', '__other_option__');
            formData.append('entry.1777886525.other_option_response', document.getElementById('industryOther').value);
        } else if (industryRadio) {
            formData.append('entry.1777886525', industryRadio.value);
        }

        // Hình thức tham dự
        const attendanceRadio = document.querySelector('input[name="attendanceType"]:checked');
        if (attendanceRadio && attendanceRadio.value === 'Đi theo nhóm') {
            const count = document.getElementById('groupCount').value;
            formData.append('entry.930914416', 'Đi theo nhóm → Số lượng người tham dự: ' + count + ' người');
        } else if (attendanceRadio) {
            formData.append('entry.930914416', attendanceRadio.value);
        }

        // Gửi data tới Google Forms
        fetch('https://docs.google.com/forms/d/e/1FAIpQLScDEEPi8UWNX8Zfb9gayTeadBRNe7cSGNwK1uTJsPLUQTQ8yQ/formResponse', {
            method: 'POST',
            mode: 'no-cors', // Bắt buộc để tránh lỗi CORS khi submit ngầm
            body: formData
        }).then(() => {
            // Fade out form
            form.style.opacity = '0';
            form.style.visibility = 'hidden';

            setTimeout(() => {
                // Show success message
                successMessage.classList.add('active');
                
                // Reset form (optional)
                form.reset();
            }, 400); 
        }).catch(err => {
            console.error('Lỗi khi gửi form:', err);
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        });
    });

    // Background orbs mouse tracking effect
    const orbs = document.querySelectorAll('.glow-orb');
    
    // Using a throttle/debounce mechanism or simply requestAnimationFrame for better performance
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;

                orbs[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
                orbs[1].style.transform = `translate(${x * -40}px, ${y * -40}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
});
