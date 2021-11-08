// import database from './database.js';
import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const users = ['Herminia', 'Bertoldo', 'Aniceto','Godofredo'];

const transaction = async () => {

    const client = new MongoClient(config.url, {useNewUrlParser: true});
    await client.connect();

    const session = await client.startSession();
    
    try {
        // await session.startTransaction();

        await session.withTransaction(async () => {

            for(const user of users) {
                const objectId = new ObjectId();
                const db = client.db('running');
                console.log(session);
                // await db.createCollection('usuarios', { session });
                await db.collection('usuarios').insertOne({
                    _id: objectId,
                    nombre: user
                }, { session });
                await db.collection('sesiones').findOneAndUpdate(
                    { nombre: user },
                    [{ $set: { usuarioId: objectId } },
                    { $unset: "nombre" }],
                    { session }
                );
                await db.collection('gustos').findOneAndUpdate(
                    { nombre: user },
                    [{ $set: { usuarioId: objectId } },
                    { $unset: "nombre" }],
                    { session }
                )

                // await session.commitTransaction();
            }
        })

    }
     finally {
        await session.endSession();
        await client.close();
    }

}

transaction().then(_ => console.log("ok"))
    .catch(console.error);