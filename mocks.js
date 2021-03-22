const faker=require('faker');
const models = require('./models');
const TurndownService = require('turndown');

const owner='6016435ccb36b2189255d36d';

module.exports=()=>{
    models.Post.remove()
    .then(
        Array.from({length:20}).forEach(()=>{
            const turndownService = new TurndownService();   
            models.Post.create({
                title:faker.lorem.words(5),
                body:turndownService.turndown(faker.lorem.words(100)),
                owner
            })
            .then(console.log)
            .catch(console.log);
        }))
    .catch(err=>{console.log(err)})
};