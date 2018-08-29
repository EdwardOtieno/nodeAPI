const User = require('../server/models').User
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let truncate = require('./truncate');

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
describe('/GET data', () => {
    it('it should return error if data is empty', (done) => {
        chai.request(app)
            .get('/data')
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.have.property('error').eql("bad request")
                done();
            });
    });
});
describe('/POST data', ()=>{
    it('it should post data ', (done)=>{
        let dataString = {"data":"Any string"}
        chai.request(app)
        .post('/data')
        .send(dataString)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data').eql("Any string");
            done();
        });
    });
});

describe('/POST data', ()=>{
    it('it should return 400 status for integer ', (done)=>{
        let dataInt = { "data": 3 }
        chai.request(app)
        .post('/data')
        .send(dataInt)
        .end((err,res)=>{
            res.should.have.status(400);
            res.body.should.have.property('error');
            done();
        });
    });
})

describe('/POST data', () => {
    it('it should return 400 status for empty data ', (done) => {
        let dataInt = {"data": ""}
        chai.request(app)
            .post('/data')
            .send(dataInt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                done();
            });
    });
})

describe('/GET data', ()=>{
    it('it should get data object', (done)=>{
        chai.request(app)
        .get('/data')
        .end((err,res)=>{
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    });
});

describe('/POST /user/signup', ()=>{

    //  beforeEach(() => {
    //       truncate();
    //  });

    it('it should return session token when user is registerd',(done)=>{
       
       let user = {
           email: "hackerbay@sample.com",
           password: "SamplePassword"
       }
        chai.request(app)
       .post('/user/signup')
       .send(user)
       .end((err,res)=>{
           console.log('body', res.body)
           res.should.have.status(200);
           res.body.should.have.property('session')
           
       });
       done();
    })
})

describe('/POST /user/login', ()=>{
    it('it should return session token when user is logedin', (done)=>{
        let user = {
            email: "hackerbay@sample.com",
            password: "SamplePassword"
        }
        chai.request(app)
        .post('/user/login')
        .send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.have.property('session')
        });
        done();
    })
})