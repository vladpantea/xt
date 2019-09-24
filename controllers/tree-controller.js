const router = require('express').Router();
const TreeService = require('../services/tree-service');
const treeService = new TreeService();
const async = require('async');

router.post('/', (req, res) => {
    console.time();
    let work = [
        sortArry.bind(this, treeService.getTreeData()),
        buildLeaf.bind(this),
        bt.bind(this)
    ];

    function sortArry(arry, callback) {
        async.sortBy(arry, (item, cb) => {
            cb(null, item.start);
        }, (err, result) => {
            callback(err, result);
        });
    }

    function buildLeaf(arry, callback) {
        let d = [];

        for (var i = 0, ilen = arry.length; i < ilen; i++) {
            let found = false;
            for (var j = 0, jlen = d.length; j < jlen; j++) {
                if (arry[i].tier === d[j].tier && arry[i].start > d[j].start) {
                    found = true;
                    d[j].children.push({ "start": arry[i].start, "tier": arry[i].tier, children: [] });
                    break;
                }
            }

            if (!found) {
                d.push({ "start": arry[i].start, "tier": arry[i].tier, children: [] })
            }
        }

        callback(null, arry, d);
    }

    function bt(arry, d, callback) {
        function recFn(item, tree, callback) {
            let j = tree.length - 1;
            while (j > -1) {
                if (item.start === tree[j].start) {
                    item.children.push(tree[j]);
                    tree.splice(j, 1, item);
                    j = -1;
                } else if (item.tier.indexOf(tree[j].tier) > -1 && item.start > tree[j].start) {
                    tree[j].children.splice(1, 0, item);
                    j = -1;
                }
                else {
                    if (tree[j].children && tree[j].children.length > 0) {
                        recFn(item, tree[j].children, callback);
                    }
                }

                j--;
            }
        }

        let i = d.length - 1;
        while (i > -1) {
            let item = d[i];
            if (item && item.children && item.children.length >= 2) {
                async.sortBy(item.children, (item, cb) => {
                    cb(null, item.start);
                }, (err, result) => {
                    item.children = result;
                    d.splice(i, 1);
                    recFn(item, d, callback);
                    i--;
                });
            } else {
                d.splice(i, 1);
                recFn(item, d, callback);
                i--;
            }

            if (i === 0) {
                i--;
            }
        };

        callback(null, arry, d);
    }

    async.waterfall(work, (err, arry, result) => {
        if (err) {
            console.log(err);
        } else {
            console.timeEnd();
            res.status(200).send(result);
        }
    });
});

module.exports = router;