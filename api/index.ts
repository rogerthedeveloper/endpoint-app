import * as express from 'express';
import axios from 'axios';
import { Result } from './Result';
import * as cors from 'cors';
import * as path from 'path';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../web/build')))
//app.set('views', __dirname + '/../web/dist');
//app.engine('html', nextjs());
//app.set('view engine', 'html');

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

/**
* GET - Obtiene datos de diferentes endpoints 
*/

app.route("/")
.get((request, response) => {

    response.sendFile("index.html");

});

app.route("/api")
.get(async (request, response) => {

    let searchTerm = request.query.search;

    let results = [];

    let responses = await axios.all([

        // PokeAPI
        axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
        .then(service => { return {"name": "pokeapi", "service": service } })
        .catch(error => null),

        // Apple Music
        axios.get(`https://itunes.apple.com/search?term=${searchTerm}`)
        .then(service => { return {"name": "apple", "service": service } })
        .catch(error => null),

        // TV Maze
        axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`)
        .then(service => { return {"name": "tvmaze", "service": service } })
        .catch(error => null),
        
    ]);

    responses.forEach(resp => {

        if(resp) {

            let data = [];

            switch (resp.name) {
                case "pokeapi":

                    data[0] = resp.service.data;

                    data = data.map(item => {
                        let result = {} as Result;
                        result.name = item.name
                        result.source = resp.name
                        return result;
                    });
                    
                    break;

                case "apple":

                    data = resp.service.data?.results;

                    data = data.map(item => {
                        let result = {} as Result;

                        if(item.wrapperType == "track") {
                            result.name = item.trackName
                        }

                        if(item.wrapperType == "audiobook") {
                            result.name = item.collectionName
                        }
                        
                        result.source = resp.name
                        return result;
                    });
                
                    break;

                case "tvmaze":

                    data = resp.service.data;

                    data = data.map(item => {
                        let result = {} as Result;
                        result.name = item.show.name
                        result.source = resp.name
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

});

