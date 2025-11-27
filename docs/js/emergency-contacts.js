// Emergency Contacts Data by Country
const emergencyContacts = {
    US: {
        name: "United States",
        contacts: [
            { service: "Emergency Services", number: "911", description: "Police, Fire, Ambulance" },
            { service: "Poison Control", number: "1-800-222-1222", description: "24/7 poison emergency hotline" },
            { service: "Suicide Prevention", number: "988", description: "National suicide prevention lifeline" },
            { service: "Domestic Violence", number: "1-800-799-7233", description: "National domestic violence hotline" },
            { service: "Child Abuse", number: "1-800-422-4453", description: "Childhelp national hotline" }
        ]
    },
    UK: {
        name: "United Kingdom",
        contacts: [
            { service: "Emergency Services", number: "999", description: "Police, Fire, Ambulance" },
            { service: "Non-Emergency Police", number: "101", description: "Report crimes and incidents" },
            { service: "NHS", number: "111", description: "Non-emergency medical advice" },
            { service: "Samaritans", number: "116 123", description: "24/7 emotional support" },
            { service: "Domestic Abuse", number: "0808 2000 247", description: "National domestic abuse helpline" }
        ]
    },
    CA: {
        name: "Canada",
        contacts: [
            { service: "Emergency Services", number: "911", description: "Police, Fire, Ambulance" },
            { service: "Poison Control", number: "1-844-764-7669", description: "Poison information centre" },
            { service: "Crisis Services", number: "1-833-456-4566", description: "Canada suicide prevention" },
            { service: "Kids Help Phone", number: "1-800-668-6868", description: "Support for young people" },
            { service: "Elder Abuse", number: "1-866-299-1011", description: "Elder abuse prevention" }
        ]
    },
    AU: {
        name: "Australia",
        contacts: [
            { service: "Emergency Services", number: "000", description: "Police, Fire, Ambulance" },
            { service: "Police Assistance", number: "131 444", description: "Non-urgent police matters" },
            { service: "Lifeline", number: "13 11 14", description: "24/7 crisis support" },
            { service: "1800RESPECT", number: "1800 737 732", description: "Domestic violence support" },
            { service: "Poisons Information", number: "13 11 26", description: "24/7 poison advice" }
        ]
    },
    ZA: {
        name: "South Africa",
        contacts: [
            { service: "Emergency Services", number: "10111", description: "Police emergency" },
            { service: "Ambulance", number: "10177", description: "Emergency medical services" },
            { service: "Fire Department", number: "10177", description: "Fire emergency" },
            { service: "Gender-Based Violence", number: "0800 428 428", description: "GBV command centre" },
            { service: "Childline", number: "116", description: "Child protection services" }
        ]
    },
    IN: {
        name: "India",
        contacts: [
            { service: "Police", number: "100", description: "Police emergency" },
            { service: "Ambulance", number: "102", description: "Emergency medical services" },
            { service: "Fire Department", number: "101", description: "Fire emergency" },
            { service: "Women Helpline", number: "1091", description: "Women in distress" },
            { service: "Child Helpline", number: "1098", description: "Child protection" }
        ]
    },
    DE: {
        name: "Germany",
        contacts: [
            { service: "Emergency Services", number: "112", description: "Fire, Medical emergency" },
            { service: "Police", number: "110", description: "Police emergency" },
            { service: "Medical On-Call", number: "116 117", description: "Non-emergency medical" },
            { service: "Poison Control", number: "030 19240", description: "Berlin poison control" },
            { service: "Crisis Hotline", number: "0800 111 0 111", description: "Telephone counseling" }
        ]
    },
    FR: {
        name: "France",
        contacts: [
            { service: "Emergency Services", number: "112", description: "European emergency number" },
            { service: "Police", number: "17", description: "Police emergency" },
            { service: "Fire/Medical", number: "18", description: "Fire brigade and medical" },
            { service: "SAMU", number: "15", description: "Medical emergency" },
            { service: "Domestic Violence", number: "3919", description: "Violence against women" }
        ]
    },
    JP: {
        name: "Japan",
        contacts: [
            { service: "Police", number: "110", description: "Police emergency" },
            { service: "Fire/Ambulance", number: "119", description: "Fire and medical emergency" },
            { service: "Japan Helpline", number: "0570-000-911", description: "24/7 support in English" },
            { service: "Tokyo English Lifeline", number: "03-5774-0992", description: "Crisis counseling" },
            { service: "DV Hotline", number: "0570-0-55210", description: "Domestic violence support" }
        ]
    },
    BR: {
        name: "Brazil",
        contacts: [
            { service: "Police", number: "190", description: "Military police" },
            { service: "Ambulance", number: "192", description: "Emergency medical services" },
            { service: "Fire Department", number: "193", description: "Fire emergency" },
            { service: "Women's Helpline", number: "180", description: "Violence against women" },
            { service: "Human Rights", number: "100", description: "Human rights violations" }
        ]
    }
};

// Detect user's country based on timezone (simple detection)
function detectUserCountry() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Simple timezone to country mapping
    if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles') || timezone.includes('America/Chicago')) {
        return 'US';
    } else if (timezone.includes('Europe/London')) {
        return 'UK';
    } else if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver')) {
        return 'CA';
    } else if (timezone.includes('Australia')) {
        return 'AU';
    } else if (timezone.includes('Africa/Johannesburg')) {
        return 'ZA';
    } else if (timezone.includes('Asia/Kolkata')) {
        return 'IN';
    } else if (timezone.includes('Europe/Berlin')) {
        return 'DE';
    } else if (timezone.includes('Europe/Paris')) {
        return 'FR';
    } else if (timezone.includes('Asia/Tokyo')) {
        return 'JP';
    } else if (timezone.includes('America/Sao_Paulo')) {
        return 'BR';
    }
    
    return 'US'; // Default to US
}

// Show emergency contacts modal
function showEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    const countrySelect = document.getElementById('country-select');
    
    // Detect and set user's country
    const userCountry = detectUserCountry();
    countrySelect.value = userCountry;
    
    // Display contacts
    updateEmergencyContacts();
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close emergency contacts modal
function closeEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update emergency contacts based on selected country
function updateEmergencyContacts() {
    const countrySelect = document.getElementById('country-select');
    const contactsList = document.getElementById('emergency-contacts-list');
    const selectedCountry = countrySelect.value;
    
    const countryData = emergencyContacts[selectedCountry];
    
    if (!countryData) {
        contactsList.innerHTML = '<p>No emergency contacts available for this country.</p>';
        return;
    }
    
    contactsList.innerHTML = `
        <div class="country-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <h3>${countryData.name}</h3>
        </div>
        
        <div class="contacts-grid">
            ${countryData.contacts.map(contact => `
                <div class="contact-card">
                    <div class="contact-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <h4>${contact.service}</h4>
                    </div>
                    <a href="tel:${contact.number}" class="contact-number">${contact.number}</a>
                    <p class="contact-description">${contact.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('emergency-modal');
    if (e.target === modal) {
        closeEmergencyContacts();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEmergencyContacts();
    }
});

// Make functions globally available
window.showEmergencyContacts = showEmergencyContacts;
window.closeEmergencyContacts = closeEmergencyContacts;
window.updateEmergencyContacts = updateEmergencyContacts;
