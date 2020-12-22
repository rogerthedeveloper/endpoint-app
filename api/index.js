"use strict";
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
exports.__esModule = true;
var express = require("express");
var axios_1 = require("axios");
var cors = require("cors");
var path = require("path");
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../web/build')));
//app.set('views', __dirname + '/../web/dist');
//app.engine('html', nextjs());
//app.set('view engine', 'html');
// Puerto 8081
app.listen(80, function () { return console.log("Listening on 80"); });
// Puerto 443 SSL
app.listen(443, function () { return console.log("Listening on 443"); });
/**
* GET - Obtiene datos de diferentes endpoints
*/
app.route("/")
    .get(function (request, response) {
    response.sendFile("index.html");
});
app.route("/api")
    .get(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var searchTerm, results, responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchTerm = request.query.search;
                results = [];
                return [4 /*yield*/, axios_1["default"].all([
                        // PokeAPI
                        axios_1["default"].get("https://pokeapi.co/api/v2/pokemon/" + searchTerm)
                            .then(function (service) { return { "name": "pokeapi", "service": service }; })["catch"](function (error) { return null; }),
                        // Apple Music
                        axios_1["default"].get("https://itunes.apple.com/search?term=" + searchTerm)
                            .then(function (service) { return { "name": "apple", "service": service }; })["catch"](function (error) { return null; }),
                        // TV Maze
                        axios_1["default"].get("http://api.tvmaze.com/search/shows?q=" + searchTerm)
                            .then(function (service) { return { "name": "tvmaze", "service": service }; })["catch"](function (error) { return null; }),
                    ])];
            case 1:
                responses = _a.sent();
                responses.forEach(function (resp) {
                    var _a;
                    if (resp) {
                        var data = [];
                        switch (resp.name) {
                            case "pokeapi":
                                data[0] = resp.service.data;
                                data = data.map(function (item) {
                                    var result = {};
                                    result.name = item.name;
                                    result.source = resp.name;
                                    return result;
                                });
                                break;
                            case "apple":
                                data = (_a = resp.service.data) === null || _a === void 0 ? void 0 : _a.results;
                                data = data.map(function (item) {
                                    var result = {};
                                    if (item.wrapperType == "track") {
                                        result.name = item.trackName;
                                    }
                                    if (item.wrapperType == "audiobook") {
                                        result.name = item.collectionName;
                                    }
                                    result.source = resp.name;
                                    return result;
                                });
                                break;
                            case "tvmaze":
                                data = resp.service.data;
                                data = data.map(function (item) {
                                    var result = {};
                                    result.name = item.show.name;
                                    result.source = resp.name;
                                    return result;
                                });
                                break;
                            default:
                                break;
                        }
                        results = results.concat(data);
                    }
                });
                response.json(results);
                return [2 /*return*/];
        }
    });
}); });
