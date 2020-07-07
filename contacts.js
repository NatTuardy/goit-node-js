const fs = require('fs');
const { promises: fsPromises } = fs;

const path = require('path');
const contactsPath = path.join(__dirname, 'db/contacts.json');
console.log(contactsPath);

async function listContacts() {
  try {
    const contactsList = await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => {
        return JSON.parse(result);
      });
    return contactsList;
  } catch (err) {
    throw err;
  }
}

// listContacts(contactsPath);

async function getContactById(contactId) {
  try {
    const user = await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => {
        const allContacts = JSON.parse(result);

        const findContactId = allContacts.find(
          contact => contact.id === Number(contactId),
        );
        return findContactId;
      });
    return user;
  } catch (err) {
    throw err;
  }
}

// getContactById(1);

async function removeContact(contactId) {
  try {
    const delContact = await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => {
        const allContacts = JSON.parse(result);
        const removeContactId = allContacts.filter(
          contact => contact.id !== contactId,
        );
        const delUser = allContacts.find(contact => contact.id === contactId);
        return delUser;
      });
    return delContact;
  } catch (err) {
    throw err;
  }
}

// removeContact(1);

async function addContact(newUser) {
  try {
    const listWithUser = await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => {
        const allContacts = JSON.parse(result);
        allContacts.push(newUser);
        return allContacts;
      });
    return listWithUser;
  } catch (err) {
    throw err;
  }
}

async function updateContact(contactId, dataUpdate) {
  try {
    const updateUserFields = await fsPromises
      .readFile(contactsPath, 'utf-8')
      .then(result => {
        const allContacts = JSON.parse(result);
        const updateUser = allContacts.map(contact =>
          contact.id === contactId ? { ...contact, ...dataUpdate } : contact,
        );
        const findContactId = updateUser.find(
          contact => contact.id === contactId,
        );
        return findContactId;
      });
    return updateUserFields;
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
  updateContact,
};
