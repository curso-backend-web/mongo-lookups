import connection from './database.js';
import { ObjectId } from 'mongodb';

const users = ['Herminia', 'Bertoldo', 'Aniceto'];

const transaction = async () => {
    const session = connection.client.startSession();
    await session.startTransaction();

    try {
        users.forEach(user => {
            const objectId = new ObjectId();

            await connection.db.collection('usuarios').insertOne({
                _id: objectId,
                nombre: user
            }, { session });
            await connection.db.collection('sesiones').findOneAndUpdate(
                { nombre: user },
                { $set: { usuarioId: objectId } },
                { $unset: { nombre: "" } },
                { session }
            )
            await connection.db.collection('gustos').findOneAndUpdate(
                { nombre: user },
                { $set: { usuarioId: objectId } },
                { $unset: { nombre: "" } },
                { session }
            )

            await session.commitTransaction();
            return {"result":"ok"}
        })
    } catch (error) {
        await session.abortTransaction();
        throw error;
        
    } finally {
        await session.endSession();        
        connection.close();
    }

}

transaction().then(console.log)
             .catch(console.error);