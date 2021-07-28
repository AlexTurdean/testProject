const assert = require('assert');
const app = require('../dist/index').app;
const request = require('supertest');
var user = {};
var shitf = {};

describe('Regular user', () => {

    describe('POST /signup', () => {
        it('Create an user', () => {
            return request(app).post('/signup')
            .send({
                name:"user1",
                password:"user1"
            })
            .expect(200)
            .then(result => {
                user = result.body;
            });
        });
        it('Trow an error for existing name', () => {
            return request(app).post('/signup')
            .send({
                name:"user1",
                password:"user1"
            })
            .expect(400);
        });
        it('Trow an error for missing field', () => {
            return request(app).post('/signup')
            .send({
                name:"user100"
            })
            .expect(400);
        });
    });

    describe('POST /login', () => {
        it('Trow an error for missing field', () => {
            return request(app).post('/login')
            .send({
                name:"user1"
            })
            .expect(400);
        });
        it('Trow an error for bad password', () => {
            return request(app).post('/login')
            .send({
                name:"user1",
                password:"user12"
            })
            .expect(400);
        });
        it('Login and return JWT token', () => {
            return request(app).post('/login')
            .send({
                name:"user1",
                password:"user1"
            })
            .expect(200)
            .then(result => {
                user.token = result.body.token;
            });
        });
    });

    describe('Shifts', () => {
        it('Trow error for missing login token', () => {
            return request(app).post('/shift')
            .send({
                name:"user1"
            })
            .expect(401);
        });
        it('Trow error for incorect login token', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":"asdfasfasfdasdfasd"
            })
            .send({
                name:"user1"
            })
            .expect(401);
        });
        it('Trow error for missing field', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-01-2020"
            })
            .expect(400);
        });
        it('Trow error for wrong shift range', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-01-2020",
                hour: 3
            })
            .expect(400);
        });
        it('Create a shift', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-01-2020",
                hour: 0
            })
            .expect(200)
            .then(result => {
                shift = result.body;
            })
        });
        it('Trow error for attemptiog to create a shift on the same date', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-01-2020",
                hour: 8
            })
            .expect(400);
        });
        it('Update shift', () => {
            return request(app).put('/shift/' + shift["_id"])
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                hour: 16
            })
            .expect(200)
            .then(result => {
                shift.hour = 16;
            })
        });
        it('Get shift', () => {
            return request(app).get('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .expect(200)
            .then(result => {
                assert(result.body.shifts[0].hour == shift.hour);
                assert(result.body.shifts.length == 1);
                assert(result.body.shifts[0]["_id"] == shift["_id"]);
            })
        });
        it('Delete shift', () => {
            return request(app).delete('/shift/' + shift["_id"])
            .set({
                "X-JWT-Token":user.token
            })
            .expect(200);
        });
        it('Create a shift', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-03-2020",
                hour: 0
            })
            .expect(200)
        });
        it('Create another shift', () => {
            return request(app).post('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .send({
                date: "01-04-2020",
                hour: 0
            })
            .expect(200)

        });
        it('Get 2 total shifts', () => {
            return request(app).get('/shift')
            .set({
                "X-JWT-Token":user.token
            })
            .expect(200)
            .then(result => {
                assert(result.body.shifts.length == 2);
            })
        });
    });

});
