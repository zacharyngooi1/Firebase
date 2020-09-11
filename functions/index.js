const functions = require('firebase-functions');
const admin  = require('firebase-admin');
const express = require("express");
const { request, response } = require('express');
const app = express();
const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyAfM5rAiWcJM8Psx7ZrHQUFDwJDWj1a09w",
    authDomain: "backend-workshop-aca38.firebaseapp.com",
    databaseURL: "https://backend-workshop-aca38.firebaseio.com",
    projectId: "backend-workshop-aca38",
    storageBucket: "backend-workshop-aca38.appspot.com",
    messagingSenderId: "729627544050",
    appId: "1:729627544050:web:3ea9a90a8f5eca087d836b",
    measurementId: "G-BPLBFRQYBT"
  };


admin.initializeApp();
firebase.initializeApp(firebaseConfig);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//exports.helloWorld = functions.https.onRequest(//(request, response) => {
//    functions.logger.info("Hello logs!", {structuredData: true});
//    response.send("Hello from Firebase!");
// });

// var.let const to declar var[iables
// c is int x = 2]
// javascript is let x = 1
// x = "hello"

const db = admin.firestore();


app.get("/getMovies", (request, response) => {
    // accesses database
    db.collection("movies")
    .get()
    .then((data) => {
        let movies = []; // create array
        data.forEach((doc) => {
            movies.push(doc.data());
        });
        return response.json({movies})
    })
    .catch(err => respoonse.status(500).json({error: err.code}));
});


// now we are going to try to send data ao its a post request
// Genres: Drama, Action, etc..... using split function
// This specifies the route 
app.post("/createNewMovie", (request, response) => {
    // adds comma between each genre string
    const genres = request.body.genres.split(',')
    const newMovie = {
        // request body object, all sent as string type as default
        title: request.body.title,
        yearReleased: parseInt(String(request.body.yearReleased)),
        imageURL: request.body.imageURL,
        genres, genres,
    };
    db.collection("movies")
    .add(newMovie)
    .then((data) => {
        return response.json({
            status: "success", 
            details: `movie with ID ${data.id} added!`,
        });
    })// Always good practice to catch errors
    .catch(err => respoonse.status(500).json({error: err.code}));
});


app.get("/movie/:movieId", (request, response) => {
    db.collection("movies")
    .doc(request.params.movieId)
    .get()
    .then((data)=> {
        if(data.exists) {
            return response.json({status: "Success", movie: data.data()});
        } else 
        return response
        .status(404)
        .json({status: 'Failed', error: "Movie not found" });
    })
    .catch((err) => {
        return response.status(500).json({error: err.code});
    });
});

app.post("/signup", (request, response) => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(request.body.email,
    request.body.password)
    .then((data) => data.user.getIdToken())
    .then((token) => {
        return response.json({token});
    })
    .catch((err) => response.status(500).json({error: err.code}));
});

app.post("/login", (request, response) => {
    firebase
    .auth()
    .signInWithEmailAndPassword(request.body.email,
    request.body.password)
    .then((data) => data.user.getIdToken())
    .then((token) => {
    return response.json({ token });
    })
    .catch((err) => response.status(500).json({error: err.code}));
});

/**
 * Promise
 * 3 States
 * Pending -- waiting for a promis to be resolved
 * resolve -- operation succcess
 * reject -- operation failed
 */

exports.api = functions.region("asia-southeast2").https.onRequest(app);
