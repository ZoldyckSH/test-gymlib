const axios = require('axios').default;
const fs = require('fs');

let newID = []
let oldID = []

async function main() {
  await axios({
    method: 'post',
    url: 'https://hngraphql.fly.dev/graphql',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "query": "{storyPage(name:TOP)}"
    },
  }).then(function (response) {
    let allIds = []
    try {
        allIds = JSON.parse(fs.readFileSync('./ids.txt', (err, data) => {
        if (err) return null;
      }));
    } catch (e) {
      
    }

    if (allIds.length === 0) {
      fs.writeFileSync('./ids.txt', JSON.stringify(response.data.data.storyPage), err => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      const newID = response.data.data.storyPage.filter(id => !allIds.includes(id))
      const oldID = allIds.filter(x => !response.data.data.storyPage.includes(x))
      console.log('NEW ID: # present in API but not present last time\n', newID.join(' '))
      console.log('OLD ID: # not present in API but present the last time\n', oldID.join(' '))
    }
  }).catch(function (error) {
    console.error(error);
  });
}

main()