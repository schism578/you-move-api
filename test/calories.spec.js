const supertest = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

describe.only('GET /log', () => {
    it('should return an array of calorie objects', () => {
        return supertest(app)
            .get('/log')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const calorie = res.body[0];
                expect(calorie).to.include.all.keys(
                    'id', 'calories', 'date', 'user_id'
                );
            })
    })
});