export default  {
    url: process.env.URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0',
    db: process.env.DB || 'running'
}