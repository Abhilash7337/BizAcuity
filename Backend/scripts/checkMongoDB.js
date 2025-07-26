const { MongoClient } = require('mongodb');

async function checkMongoDB() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        // List all databases
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        console.log('\n📚 Available databases:');
        databases.databases.forEach(db => {
            console.log(`- ${db.name}`);
        });
        
        // Check walldesigner database specifically
        const wallDb = client.db('walldesigner');
        const collections = await wallDb.listCollections().toArray();
        
        console.log('\n📁 Collections in walldesigner database:');
        collections.forEach(col => {
            console.log(`- ${col.name}`);
        });
        
        // Check users collection
        const usersCollection = wallDb.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log(`\n👥 Total users in users collection: ${userCount}`);
        
        if (userCount > 0) {
            const sampleUser = await usersCollection.findOne();
            console.log('\n🔍 Sample user document:');
            console.log(JSON.stringify(sampleUser, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

checkMongoDB();
