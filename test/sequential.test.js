const cleanDemoAppDirs = require('./utils/cleanDemoApp');

beforeAll(async()=>{
  await cleanDemoAppDirs(["migrations","models","database"])
})


describe('CLI Sequential Suite', () => {
  require('./cli/initDb.test.js');
  require('./cli/model.test');
  // require('./cli/migration.test');
});