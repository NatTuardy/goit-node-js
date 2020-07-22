const bcryptjs = require('bcryptjs');

const plainPassword = 'qwerty123';

async function main() {
  // const hash = await bcryptjs.hash('qwerty123', 6);
  // console.log(hash);
  console.log(
    await bcryptjs.compare(
      plainPassword,
      '$2a$06$EOd195NJQ5KlVcL/oSKRJ.LodHymBkUrNn1LgZLkV16GjPkWqam8S',
    ),
  );
}
main();
