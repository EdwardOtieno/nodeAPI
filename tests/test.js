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
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.have.property('status')
            done();
        });
    });
});

describe('/POST data', ()=>{
    it('it should post data ', (done)=>{
        let data = {"data":"Any string"}
        chai.request(app)
        .post('/data')
        .send(data)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data').eql("Any string");
            done();
        });
    });
});