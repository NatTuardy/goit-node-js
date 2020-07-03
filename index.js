const argv = require('yargs').argv;
const exportFile = require('./contacts');
// console.log(exportFile);

// console.log('contacts:', exportFile.contactsPath);
// exportFile.listContacts(exportFile.contactsPath);
// exportFile.getContactById(7);
// exportFile.removeContact(1);
// exportFile.addContact('NatalyTuardy', 'nattuardy@gmail.com', '097-109-99-91');

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      exportFile.listContacts(exportFile.contactsPath);
      break;

    case 'get':
      exportFile.getContactById(exportFile.contactsPath, id);
      break;

    case 'add':
      exportFile.addContact(exportFile.contactsPath, name, email, phone);
      break;

    case 'remove':
      exportFile.removeContact(exportFile.contactsPath, id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
