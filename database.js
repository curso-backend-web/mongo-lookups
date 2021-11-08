import {MongoClient} from 'mongodb';
import config from './config.js';

class MongoManager {
    constructor(config){
        this.url = config.url;
        this.db = config.db;
        this.client = new MongoClient(this.url,{useNewUrlParser:true});
        // this._connect(config.db);
    }
    async connect(){
        try {
            // this.client = new MongoClient(this.url,{useNewUrlParser:true});
            return await this.client.connect();
            
            
        } catch (error) {
            throw error;
        }
    }
    async close(){
        this.client.close();
    }
}

export default new MongoManager(config);