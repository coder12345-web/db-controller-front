// ==================== ORGANIZATION PAGE LOGIC ====================

let currentOrganization = null;


// ==================== UPDATE UI TRANSLATIONS ====================

function updateOrganizationPageTranslations() {
    // Update page header
    const pageTitle = document.querySelector('#organizationPage .page-header h1');
    if (pageTitle) pageTitle.textContent = t('orgPage.title');

    const pageSubtitle = document.querySelector('#organizationPage .page-subtitle');
    if (pageSubtitle) pageSubtitle.textContent = t('orgPage.subtitle');

    // Update Organization Details card
    const detailsTitle = document.querySelector('.organization-info-card .org-card-header h2');
    if (detailsTitle) {
        const svg = detailsTitle.querySelector('svg');
        detailsTitle.innerHTML = '';
        detailsTitle.appendChild(svg);
        detailsTitle.appendChild(document.createTextNode(t('orgPage.detailsCard.title')));
    }

    // Update loading state
    const loadingText = document.querySelector('#orgLoadingState p');
    if (loadingText) loadingText.textContent = t('orgPage.detailsCard.loading');

    // Update error state
    const errorText = document.querySelector('#orgErrorState p');
    if (errorText) errorText.textContent = t('orgPage.detailsCard.error');

    const retryBtn = document.querySelector('#orgErrorState .retry-btn');
    if (retryBtn) {
        const svg = retryBtn.querySelector('svg');
        retryBtn.innerHTML = '';
        retryBtn.appendChild(svg);
        retryBtn.appendChild(document.createTextNode(t('orgPage.detailsCard.retry')));
    }

    // Update Organization ID field
    const orgIdLabel = document.querySelector('.org-field:nth-child(1) .org-field-label');
    if (orgIdLabel) orgIdLabel.textContent = t('orgPage.fields.orgId');

    const orgIdHint = document.querySelector('.org-field:nth-child(1) .org-field-hint');
    if (orgIdHint) orgIdHint.textContent = t('orgPage.fields.orgIdHint');

    const copyBtn = document.getElementById('orgIdCopyBtn');
    if (copyBtn && !copyBtn.textContent.includes('✓')) {
        const svg = copyBtn.querySelector('svg');
        copyBtn.innerHTML = '';
        copyBtn.appendChild(svg);
        copyBtn.appendChild(document.createTextNode(t('orgPage.fields.copy')));
    }

    // Update Organization Name field
    const orgNameLabel = document.querySelector('.org-field:nth-child(2) .org-field-label');
    if (orgNameLabel) orgNameLabel.textContent = t('orgPage.fields.orgName');

    const editBtn = document.getElementById('orgNameEditBtn');
    if (editBtn) {
        const svg = editBtn.querySelector('svg');
        editBtn.innerHTML = '';
        editBtn.appendChild(svg);
        editBtn.appendChild(document.createTextNode(t('orgPage.fields.edit')));
    }

    const orgNameInput = document.getElementById('orgNameInput');
    if (orgNameInput) orgNameInput.placeholder = t('orgPage.fields.placeholder');

    const saveBtn = document.getElementById('orgNameSaveBtn');
    if (saveBtn && !saveBtn.disabled) {
        const svg = saveBtn.querySelector('svg');
        saveBtn.innerHTML = '';
        saveBtn.appendChild(svg);
        saveBtn.appendChild(document.createTextNode(t('orgPage.fields.save')));
    }

    const cancelBtn = document.getElementById('orgNameCancelBtn');
    if (cancelBtn) {
        const svg = cancelBtn.querySelector('svg');
        cancelBtn.innerHTML = '';
        cancelBtn.appendChild(svg);
        cancelBtn.appendChild(document.createTextNode(t('orgPage.fields.cancel')));
    }

    // Update Activity Analytics card
    const activityTitle = document.querySelector('.organization-activity-card .org-card-header h2');
    if (activityTitle) {
        const svg = activityTitle.querySelector('svg');
        activityTitle.innerHTML = '';
        activityTitle.appendChild(svg);
        activityTitle.appendChild(document.createTextNode(t('orgPage.activityCard.title')));
    }

    const comingSoonTitle = document.querySelector('.coming-soon-content h3');
    if (comingSoonTitle) comingSoonTitle.textContent = t('orgPage.activityCard.comingSoon');

    const comingSoonDesc = document.querySelector('.coming-soon-content > p');
    if (comingSoonDesc) comingSoonDesc.textContent = t('orgPage.activityCard.description');

    // Update feature items
    const featureItems = document.querySelectorAll('.coming-soon-features .feature-item span');
    if (featureItems[0]) featureItems[0].textContent = t('orgPage.activityCard.features.tracking');
    if (featureItems[1]) featureItems[1].textContent = t('orgPage.activityCard.features.statistics');
    if (featureItems[2]) featureItems[2].textContent = t('orgPage.activityCard.features.insights');
}

// ==================== LOAD ORGANIZATION INFO ====================

async function loadOrganizationInfo() {
    console.log('Loading organization information...');

    const loadingState = document.getElementById('orgLoadingState');
    const errorState = document.getElementById('orgErrorState');
    const contentState = document.getElementById('orgContentState');

    // Show loading
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    contentState.style.display = 'none';

    try {
        console.log('Fetching organization...');

        // Fetch organization details - backend gets org ID from JWT
        const organization = await apiCall('/organization');

        console.log('Organization loaded:', organization);

        // Store current organization
        currentOrganization = organization;

        // Display organization info
        displayOrganizationInfo(organization);

    } catch (error) {
        console.error('Error loading organization:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        showToast(t('orgPage.toasts.loadError'), 'error');
    }
}

function displayOrganizationInfo(org) {
    const loadingState = document.getElementById('orgLoadingState');
    const contentState = document.getElementById('orgContentState');

    // Hide loading
    loadingState.style.display = 'none';

    // Display organization ID
    document.getElementById('orgIdDisplay').textContent = org.id;

    // Display organization name
    document.getElementById('orgNameValue').textContent = org.organizationName || org.name || 'Unnamed Organization';

    // Show content
    contentState.style.display = 'block';
}

// ==================== COPY ORGANIZATION ID ====================

function copyOrgId() {
    const orgId = document.getElementById('orgIdDisplay').textContent;

    navigator.clipboard.writeText(orgId).then(() => {
        const btn = document.getElementById('orgIdCopyBtn');
        const originalContent = btn.innerHTML;

        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${t('orgPage.fields.copied')}
        `;

        showToast(t('orgPage.toasts.copySuccess'), 'success');

        setTimeout(() => {
            btn.innerHTML = originalContent;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast(t('orgPage.toasts.copyError'), 'error');
    });
}

// ==================== EDIT ORGANIZATION NAME ====================

function toggleEditOrgName() {
    const displayDiv = document.getElementById('orgNameDisplay');
    const editDiv = document.getElementById('orgNameEdit');
    const input = document.getElementById('orgNameInput');
    const currentName = document.getElementById('orgNameValue').textContent;

    // Switch to edit mode
    displayDiv.style.display = 'none';
    editDiv.style.display = 'flex';

    // Set current value in input
    input.value = currentName;
    input.focus();
    input.select();
}

function cancelEditOrgName() {
    const displayDiv = document.getElementById('orgNameDisplay');
    const editDiv = document.getElementById('orgNameEdit');

    // Switch back to display mode
    editDiv.style.display = 'none';
    displayDiv.style.display = 'flex';
}

async function saveOrgName() {
    const input = document.getElementById('orgNameInput');
    const newName = input.value.trim();

    if (!newName) {
        showToast(t('orgPage.toasts.nameEmpty'), 'error');
        return;
    }

    if (!currentOrganization) {
        showToast(t('orgPage.toasts.dataNotLoaded'), 'error');
        return;
    }

    const saveBtn = document.getElementById('orgNameSaveBtn');
    const originalContent = saveBtn.innerHTML;

    // Disable button
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        ${t('orgPage.fields.saving')}
    `;

    try {
        console.log('Updating organization name to:', newName);

        // Update organization - backend gets org ID from JWT
        const updateDto = {
            organizationName: newName
        };

        const updated = await apiCall('/organization', {
            method: 'PUT',
            body: JSON.stringify(updateDto)
        });

        console.log('Organization updated:', updated);

        // Update current organization
        currentOrganization = updated;

        // Update display
        document.getElementById('orgNameValue').textContent = updated.organizationName || updated.name;

        // Update session storage
        const authUserStr = sessionStorage.getItem('authUser');
        if (authUserStr) {
            const authUser = JSON.parse(authUserStr);
            if (authUser.organization) {
                authUser.organization.organizationName = updated.organizationName || updated.name;
                authUser.organization.name = updated.organizationName || updated.name;
                sessionStorage.setItem('authUser', JSON.stringify(authUser));
            }
        }

        // Switch back to display mode
        cancelEditOrgName();

        showToast(t('orgPage.toasts.updateSuccess'), 'success');

    } catch (error) {
        console.error('Error updating organization:', error);
        showToast(t('orgPage.toasts.updateError'), 'error');
    } finally {
        // Re-enable button
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalContent;
    }
}

// ==================== PAGE INITIALIZATION ====================

function initOrganizationPage() {
    console.log('Initializing organization page...');
    updateOrganizationPageTranslations();
    loadOrganizationInfo();
}

// Listen for language changes
window.addEventListener('languageChanged', () => {
    const orgPage = document.getElementById('organizationPage');
    if (orgPage && orgPage.classList.contains('active')) {
        updateOrganizationPageTranslations();
    }
});

// ==================== EXPORT FUNCTIONS ====================

window.loadOrganizationInfo = loadOrganizationInfo;
window.copyOrgId = copyOrgId;
window.toggleEditOrgName = toggleEditOrgName;
window.cancelEditOrgName = cancelEditOrgName;
window.saveOrgName = saveOrgName;
window.initOrganizationPage = initOrganizationPage;

console.log('✅ Organization page loaded successfully');