#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const contactsFilePath = path.join(__dirname, 'contactDetails.json');

// Load existing user contact details
function loadContactDetails() {
    if (!fs.existsSync(contactsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(contactsFilePath);
    return JSON.parse(data);
}

// Save user contacts information
function saveContactDetails(contacts) {
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
}

// Add contact information
function addContactDetails(name, phone, email, address) {
    const contacts = loadContactDetails();
    const newContact = {
        id: contacts.length + 1,
        name,
        phone,
        address,
        email
    };
    contacts.push(newContact);
    saveContactDetails(contacts);
    console.log(`Contact ${name} added.`);
}

// Delete contact information
function deleteContactDetails(name) {
    const contacts = loadContactDetails();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());
    saveContactDetails(filteredContacts);
    console.log(`Contact ${name} deleted.`);
}

// Search 
function searchContact(query) {
    const contacts = loadContactDetails();
    const results = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query)
    );
    if (results.length > 0) {
        results.forEach(contact => {
            console.log(`ID: ${contact.id}, Name: ${contact.name}, Phone: ${contact.phone}, Address: ${contact.address}, Email: ${contact.email}`);
        });
    } else {
        console.log('Contact Not Found !.');
    }
}

// Update a contact information
function updateContactDetails(id, name, phone, address, email) {
    const contacts = loadContactDetails();
    const contact = contacts.find(contact => contact.id === parseInt(id));
    if (contact) {
        contact.name = name || contact.name;
        contact.phone = phone || contact.phone;
        contact.address = address || contact.address;
        contact.email = email || contact.email;
        saveContactDetails(contacts);
        console.log(`Contact ${id} updated successfully !.`);
    } else {
        console.log('Contact not found.');
    }
}

// List all contacts 
function listContacts() {
    const contacts = loadContactDetails();
    if (contacts.length > 0) {
        contacts.forEach(contact => {
            console.log(`ID: ${contact.id}, Name: ${contact.name}, Phone: ${contact.phone}, Email: ${contact.email}, Address: ${contact.address}`);
        });
    } else {
        console.log('contacts not available.');
    }
}

// Command handling
const command = process.argv[2];

switch (command) {
    case 'add':
        addContactDetails(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
        break;
    case 'delete':
        deleteContactDetails(process.argv[3]);
        break;
    case 'search':
        searchContact(process.argv[3]);
        break;
    case 'update':
        updateContactDetails(process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
        break;
    case 'list':
        listContacts();
        break;
    default:
        console.log('Usage: contact-manager-system [add|delete|search|update|list] [args]');
}
