const UserModel = require('./models/User');
const Base = require('./common/base');
const tools = require('./utils/tools');
const { getId } = new Base();

let data = '';

for (let i = 0; i < 500; i++) {
  
  let pass = tools.encryption('abc123');
  let account = 'admin_' + i + 1;
  let userName = '用户-' + i + 4;

  

  data += JSON.stringify({
    account,
    password: pass,
    user_name: userName,
    email: '',
    mobile: '',
    description: '',
    city: '',
    country: '',
    head_icon: '/images/avatar.png',
    status: '1',
    ctime: Date.now(),
    cuid: 0,
    cuser: '',
    mtime: Date.now(),
    muid: 0,
    muser: '',
    user_id: +i + 4,
    id: +i + 4,
    role: '3',
  });
}
const fs = require('fs');
fs.writeFileSync('users.json', JSON.stringify(data), {}, () => {
  console.log('写入成功')
});