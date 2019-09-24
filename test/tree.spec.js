const chai = require('chai')
const expect = chai.expect
const app = require('../server')
const request = require('supertest')
const TreeService = require('../services/tree-service');
const treeService = new TreeService();

describe('API TESTS', () => {
    describe('Tree API tests', () => {

        it('expect POST /api/tree return 200 with tree structure', async () => {
            let toPass = JSON.stringify(treeService.getTreeData());
            let toCompare = treeService.expectedResult();

            request(app)
            .post('/api/tree')
            .send(toPass)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err,res) => {
                expect(err).to.be.null;
                
                for(var i=0,ilen = toCompare[0].children.length;i<ilen;i++){
                    expect(JSON.stringify(toCompare[0].children[i])).to.equal(JSON.stringify(res.body[0].children[i]));
                    console.log(`working for ${i}`);
                }                
            })
        }).timeout(2000)    
    });
});
