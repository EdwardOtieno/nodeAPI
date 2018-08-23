const User = require('../server/models').User
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
chai.use(chaiHttp);


describe('/GET', ()=>{
    it('is should get the index', (done)=>{
        chai.request(app)
        .get('/')
        .end((err,res)=>{
            res.status.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('status')
        done();
        });
    });
});