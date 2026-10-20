// Database of Courses
const ALL_COURSES = [
    { id: 'cse-1', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 1, fee: 600, desc: 'Basic Science, Applied Maths, Physics & Engineering Graphics' },
    { id: 'cse-2', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 2, fee: 600, desc: 'Advanced Maths, C Programming, Basic Electronics & Mechanics' },
    { id: 'cse-3', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 3, fee: 700, desc: 'Data Structures, Digital Electronics, C++ & Web Tech' },
    { id: 'cse-4', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 4, fee: 700, desc: 'DBMS, Java Programming, Operating Systems & Networks' },
    { id: 'cse-5', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 5, fee: 800, desc: 'Python, Software Engg, Web Dev Frameworks & Electives' },
    { id: 'cse-6', branch: 'CSE', branchFull: 'Computer Science & Engg', sem: 6, fee: 800, desc: 'Cyber Security, Cloud Computing, Management & Final Project' },

    { id: 'civ-1', branch: 'Civil', branchFull: 'Civil Engineering', sem: 1, fee: 600, desc: 'Basic Science & Engineering Fundamentals' },
    { id: 'civ-3', branch: 'Civil', branchFull: 'Civil Engineering', sem: 3, fee: 700, desc: 'Surveying, SOM, Building Construction & Materials' },
    { id: 'civ-5', branch: 'Civil', branchFull: 'Civil Engineering', sem: 5, fee: 800, desc: 'Structural Design, Concrete Tech & Transportation' },

    { id: 'ee-1', branch: 'Electrical', branchFull: 'Electrical Engineering', sem: 1, fee: 600, desc: 'Basic Electrical Engg & Applied Physics' },
    { id: 'ee-3', branch: 'Electrical', branchFull: 'Electrical Engineering', sem: 3, fee: 700, desc: 'Circuit Theory, Electrical Machines & Measurement' },
    { id: 'ee-5', branch: 'Electrical', branchFull: 'Electrical Engineering', sem: 5, fee: 800, desc: 'Power Electronics, Switchgear & Power Systems' },

    { id: 'mech-3', branch: 'Mechanical', branchFull: 'Mechanical Engineering', sem: 3, fee: 700, desc: 'Thermodynamics, Strength of Materials & Manufacturing' },
    { id: 'mte-3', branch: 'Metallurgical', branchFull: 'Metallurgical Engineering', sem: 3, fee: 700, desc: 'Physical Metallurgy, Heat Treatment & Material Testing' },
    { id: 'ece-3', branch: 'ECE', branchFull: 'Electronics & Comm.', sem: 3, fee: 700, desc: 'Analog Electronics, Digital Circuits & Signals' }
];

// App State
let selectedCourse = null;
let currentStudent = {};
let enrolledCourseIds = JSON.parse(localStorage.getItem('gradeboost_enrolled')) || [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    renderCourseCards('ALL');
    updateEnrolledBadge();
});

// Switch Main Page Views
function switchPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(`page-${pageId}`).classList.add('active');

    // Highlight navbar button
    const activeNavBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick').includes(pageId));
    if (activeNavBtn) activeNavBtn.classList.add('active');

    if (pageId === 'enrolled') {
        renderEnrolledCourses();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Courses Grid with Filter
function filterBranch(branch) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderCourseCards(branch);
}

function renderCourseCards(branchFilter) {
    const container = document.getElementById('courseCardsContainer');
    container.innerHTML = '';

    const filtered = branchFilter === 'ALL' 
        ? ALL_COURSES 
        : ALL_COURSES.filter(c => c.branch === branchFilter);

    filtered.forEach(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div>
                <span class="course-badge">${course.branchFull}</span>
                <h3>Semester ${course.sem} Complete Course</h3>
                <p>${course.desc}</p>
            </div>
            <div class="price-row">
                <span class="price">₹${course.fee}</span>
                ${isEnrolled 
                    ? `<button class="btn btn-outline-light" style="color:#10b981; border-color:#10b981;" disabled><i class="fa-solid fa-circle-check"></i> Enrolled</button>` 
                    : `<button class="btn btn-accent" onclick="startEnrollment('${course.id}')">Buy Course</button>`
                }
            </div>
        `;
        container.appendChild(card);
    });
}

// Start Enrollment Flow
function startEnrollment(courseId) {
    selectedCourse = ALL_COURSES.find(c => c.id === courseId);
    
    document.getElementById('regSummaryText').innerText = `Course: ${selectedCourse.branchFull} - Semester ${selectedCourse.sem}`;
    document.getElementById('regFeeAmount').innerText = `₹${selectedCourse.fee}`;
    
    document.getElementById('registrationModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Handle Registration Form Submit
function handleRegistrationSubmit(event) {
    event.preventDefault();

    currentStudent = {
        name: document.getElementById('regName').value,
        father: document.getElementById('regFather').value,
        college: document.getElementById('regCollege').value,
        roll: document.getElementById('regRoll').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value
    };

    closeModal('registrationModal');

    // Setup Payment Modal
    document.getElementById('paySummaryText').innerText = `Enrolling ${currentStudent.name} (${selectedCourse.branch} Sem ${selectedCourse.sem})`;
    document.getElementById('payAmountDisplay').innerText = `₹${selectedCourse.fee}`;
    
    // QR Code Generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=upi://pay?pa=9576627477@upi%26pn=GradeBoostAcademy%26am=${selectedCourse.fee}`;
    document.getElementById('qrImage').src = qrUrl;

    document.getElementById('paymentModal').classList.add('active');
}

// Payment Tabs Switcher
function switchPayTab(tabName) {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(`pay-${tabName}`).classList.add('active');
}

// Confirm Payment
function confirmPayment(method) {
    closeModal('paymentModal');

    // Save Course ID in Local Storage
    if (!enrolledCourseIds.includes(selectedCourse.id)) {
        enrolledCourseIds.push(selectedCourse.id);
        localStorage.setItem('gradeboost_enrolled', JSON.stringify(enrolledCourseIds));
    }

    updateEnrolledBadge();

    const txnId = "GB" + Math.floor(1000000000 + Math.random() * 900000000);
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Render Receipt
    const receiptHTML = `
        <div class="receipt-row"><span>Txn ID:</span><strong>${txnId}</strong></div>
        <div class="receipt-row"><span>Student Name:</span><strong>${currentStudent.name}</strong></div>
        <div class="receipt-row"><span>Father Name:</span><strong>${currentStudent.father}</strong></div>
        <div class="receipt-row"><span>College & Roll:</span><strong>${currentStudent.college} (${currentStudent.roll})</strong></div>
        <div class="receipt-row"><span>Enrolled Course:</span><strong>${selectedCourse.branchFull} (Sem ${selectedCourse.sem})</strong></div>
        <div class="receipt-row"><span>Payment Method:</span><strong>${method}</strong></div>
        <div class="receipt-row"><span>Date:</span><strong>${date}</strong></div>
        <div class="receipt-row" style="margin-top:0.5rem; padding-top:0.5rem; border-top: 1px solid #cbd5e1;"><span>Amount Paid:</span><strong style="color:#10b981; font-size:1.1rem;">₹${selectedCourse.fee}</strong></div>
    `;

    document.getElementById('receiptContainer').innerHTML = receiptHTML;
    document.getElementById('successModal').classList.add('active');

    // Refresh Courses Grid
    renderCourseCards('ALL');
}

// Render Enrolled Courses Page
function renderEnrolledCourses() {
    const container = document.getElementById('enrolledCoursesContainer');
    container.innerHTML = '';

    if (enrolledCourseIds.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 3rem; background:white; border-radius:12px; border:1px solid #e2e8f0;">
                <i class="fa-solid fa-folder-open" style="font-size:3rem; color:#94a3b8; margin-bottom:1rem;"></i>
                <h3>No Enrolled Courses Found</h3>
                <p style="color:#64748b; margin-bottom:1.5rem;">You haven't purchased any semester batch yet.</p>
                <button class="btn btn-accent" onclick="switchPage('courses')">Browse & Buy Courses</button>
            </div>
        `;
        return;
    }

    enrolledCourseIds.forEach(id => {
        const course = ALL_COURSES.find(c => c.id === id);
        if (!course) return;

        const card = document.createElement('div');
        card.className = 'enrolled-card';
        card.innerHTML = `
            <div>
                <span class="enrolled-tag"><i class="fa-solid fa-check"></i> Active Subscription</span>
                <h3 style="margin-top:0.5rem;">${course.branchFull} - Semester ${course.sem}</h3>
                <p style="color:#64748b; font-size:0.9rem;">${course.desc}</p>
            </div>
            <div>
                <button class="btn btn-primary" onclick="alert('Opening Video Lectures & Smart Notes Portal...')"><i class="fa-solid fa-play"></i> Access Lectures & Notes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateEnrolledBadge() {
    document.getElementById('enrolledBadge').innerText = enrolledCourseIds.length;
}