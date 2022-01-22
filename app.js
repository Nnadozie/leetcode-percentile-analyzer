var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var axios = require('axios');
var fs = require('fs');
if (process.argv[2] === '-h') {
    console.log(" yarn start <contest-name> \n yarn start <contest-name> <desired-percentile>\n yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish>\n yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish> <rank>");
}
else {
    var competitors = [];
    var url_1 = "https://leetcode.com/contest/api/ranking/".concat(process.argv[2], "/");
    function getCompetitors(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get(url)];
                    case 1:
                        response = (_a.sent());
                        return [2 /*return*/, response && response.data && response.data.total_rank];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function findLastPage(page, step) {
        if (page === void 0) { page = 0; }
        if (step === void 0) { step = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = page === 0 ? step : page;
                        if (step === 0)
                            return [2 /*return*/, page + 1];
                        console.log("Searching from page: ".concat(page), "In steps of: ".concat(step));
                        _a.label = 1;
                    case 1:
                        if (!((res && res.length > 0 && res.find(function (val) { return val.score === 0; })) === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, getCompetitors("".concat(url_1, "?pagination=").concat(page, "&region=global"))];
                    case 2:
                        res = _a.sent();
                        page += step;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, findLastPage(page - step * 2, Math.trunc(step / 2))];
                }
            });
        });
    }
    function findObjectWithRank(rank, page, step) {
        if (page === void 0) { page = 0; }
        if (step === void 0) { step = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = page === 0 ? step : page;
                        console.log("Searching from page: ".concat(page), "in steps of: ".concat(step));
                        _a.label = 1;
                    case 1:
                        if (!((res && res.length > 0 && res.find(function (val) { return val.rank >= rank; })) === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, getCompetitors("".concat(url_1, "?pagination=").concat(page, "&region=global"))];
                    case 2:
                        res = _a.sent();
                        page += step;
                        return [3 /*break*/, 1];
                    case 3:
                        if (res && res.find(function (val) { return val.rank === rank; })) {
                            return [2 /*return*/, { ranker: res.find(function (val) { return val.rank === rank; }), pageFound: page - step }];
                        }
                        return [2 /*return*/, findObjectWithRank(rank, page - step * 2, Math.trunc(step / 2))];
                }
            });
        });
    }
    function findFirstZeroScore(page) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCompetitors("".concat(url_1, "?pagination=").concat(page, "&region=global"))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res && res.find(function (val) { return val.score === 0; })];
                }
            });
        });
    }
    function findPercentileByTime(finish_time, lastRank, page, step) {
        if (page === void 0) { page = 0; }
        if (step === void 0) { step = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var res, pTile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = page === 0 ? step : page;
                        console.log("Searching from page: ".concat(page), "in steps of: ".concat(step));
                        _a.label = 1;
                    case 1:
                        if (!((res && res.length > 0 && res.find(function (val) { return val.finish_time >= finish_time; })) === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, getCompetitors("".concat(url_1, "?pagination=").concat(page, "&region=global"))];
                    case 2:
                        res = _a.sent();
                        page += step;
                        return [3 /*break*/, 1];
                    case 3:
                        //may never find exact time in seconds but this is unlikely
                        if (res && res.find(function (val) { return val.finish_time === finish_time; })) {
                            console.log('\npage found:', page - step);
                            pTile = (res.find(function (val) { return val.finish_time === finish_time; }).rank / lastRank) * 100;
                            console.log('\n', res.find(function (val) { return val.finish_time === finish_time; }));
                            return [2 /*return*/, pTile > Math.trunc(pTile) ? Math.trunc(pTile) + 1 : pTile];
                        }
                        return [2 /*return*/, findPercentileByTime(finish_time, lastRank, page - step * 2, Math.trunc(step / 2))];
                }
            });
        });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var lastPage, lastRankObj, myTime, myPercentile, percentileByRank, searchTile, nthTileRank, nthObj, nthTime, hh, mm, ss;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Searching For last page with a score > 0\n');
                        return [4 /*yield*/, findLastPage()];
                    case 1:
                        lastPage = _a.sent();
                        console.log('\nLast Page:', lastPage);
                        return [4 /*yield*/, getCompetitors("".concat(url_1, "?pagination=").concat(lastPage, "&region=global"))];
                    case 2:
                        lastRankObj = (_a.sent()).find(function (val) { return val.score === 0; });
                        console.log('\nUser in last place:', lastRankObj);
                        if (!(process.argv[4] && process.argv[5] && process.argv[6])) return [3 /*break*/, 4];
                        myTime = Number(process.argv[4]) * 60 * 60 +
                            Number(process.argv[5]) * 60 +
                            Number(process.argv[6]) +
                            lastRankObj.finish_time;
                        console.log("\nSearching for percentile your completion time of ".concat(myTime, "s falls within:"));
                        return [4 /*yield*/, findPercentileByTime(myTime, lastRankObj.rank - 1)];
                    case 3:
                        myPercentile = _a.sent();
                        console.log("\nWith time of ".concat(process.argv[4], ":").concat(process.argv[5], ":").concat(process.argv[6], " you finished in the ").concat(myPercentile, "th percentile, assuming you completed all submissions without error"));
                        if (process.argv[7]) {
                            percentileByRank = (Number(process.argv[7]) / (lastRankObj.rank - 1)) * 100;
                            console.log("With a rank of ".concat(process.argv[7], " you finished in the ").concat(percentileByRank > Math.trunc(percentileByRank) ? Math.trunc(percentileByRank) + 1 : percentileByRank, "th percentile"));
                        }
                        _a.label = 4;
                    case 4:
                        searchTile = process.argv[3] ? process.argv[3] : 10;
                        nthTileRank = (Number(searchTile) / 100) * (lastRankObj.rank - 1);
                        nthTileRank = nthTileRank > Math.trunc(nthTileRank) ? Math.trunc(nthTileRank) + 1 : nthTileRank;
                        console.log("\nSearching for user marking the ".concat(searchTile, "th Percentile boundary. Rank: ").concat(nthTileRank, "\n"));
                        return [4 /*yield*/, findObjectWithRank(nthTileRank)];
                    case 5:
                        nthObj = _a.sent();
                        nthTime = nthObj.ranker.finish_time - lastRankObj.finish_time;
                        hh = Math.trunc(nthTime / 60 / 60);
                        mm = Math.trunc((nthTime - hh * 60 * 60) / 60);
                        ss = nthTime - mm * 60 - hh * 60 * 60;
                        console.log("\nTo have made ".concat(searchTile, "th percentile you need to have finished within ").concat(hh, "h:").concat(mm, "m:").concat(ss, "s, ahead of user who ranked ").concat(nthTileRank, " on page ").concat(nthObj.pageFound));
                        return [2 /*return*/];
                }
            });
        });
    }
    main();
}
