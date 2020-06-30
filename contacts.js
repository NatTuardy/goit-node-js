const fs = require('fs');
const { promises: fsPromises } = fs;

const path = require('path');
const contactsPath = path.join(__dirname, 'db/contacts.json');
console.log(contactsPath);

async function listContacts() {
  try {
    await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => console.table(JSON.parse(result)));
  } catch (err) {
    throw err;
  }
}

// listContacts(contactsPath);

async function getContactById(contactsPath, contactId) {
  try {
    await fsPromises.readFile(contactsPath, 'utf-8').then(result => {
      const allContacts = JSON.parse(result);

      const findContactId = allContacts.find(
        contact => contact.id === contactId,
      );
      console.table(findContactId);
    });
  } catch (err) {
    throw err;
  }
}

// getContactById(1);

async function removeContact(contactsPath, contactId) {
  try {
    await fsPromises.readFile(contactsPath, 'utf-8').then(result => {
      const allContacts = JSON.parse(result);
      //   console.log(allContacts);
      const removeContactId = allContacts.filter(
        contact => contact.id !== contactId,
      );
      console.table(removeContactId);
    });
  } catch (err) {
    throw err;
  }
}

// removeContact(1);

async function addContact(contactsPath, name, email, phone) {
  try {
    await fsPromises.readFile(contactsPath, 'utf-8').then(result => {
      const allContacts = JSON.parse(result);
      //   console.log(allContacts);
      const findId = allContacts[allContacts.length - 1].id;
      //   console.log(findId);
      const newContact = {
        id: findId + 1,
        name,
        email,
        phone,
      };
      console.table(newContact);
    });
  } catch (err) {
    throw err;
  }
}

// addContact('NatalyTuardy', 'nattuardy@gmail.com', '097-109-99-91');

module.exports = {
  contactsPath,
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
