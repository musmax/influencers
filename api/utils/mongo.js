// import mongoose from 'mongoose';

// function connect(url = "mongodb://127.0.0.1:27017/influencers") {
//     console.log(`Connecting to MongoDB on address: ${url}`);
//     mongoose.connect(
//         url,
//         {
//             useUnifiedTopology: true,
//             useNewUrlParser: true
//         }
//     );
// }

// export default { connect };

import mongoose from 'mongoose';

function connect(url = "mongodb+srv://musaakandeojo:171093Ras.@cluster0.emux4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0") {
    console.log(`Connecting to MongoDB on address: ${url}`);
    

    mongoose.connect(url, {
        dbName: 'titilola',               // Specify the database name here
        useNewUrlParser: true,            // Parse the connection string correctly
        useUnifiedTopology: true,         // Use the latest topology engine
        connectTimeoutMS: 50000,          // Increase timeout for connection
        serverSelectionTimeoutMS: 50000   // Increase timeout for server selection
    })    
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));
}


export default { connect };
