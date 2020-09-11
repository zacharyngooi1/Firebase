let prom = new Promise((resolve, reject) => {
    if(true) resolve("Success");
    else reject("Failed");
});

prom
    .then((resolvedValue) => console.log("value: ", resolvedValue))
    .catch((rejected) => console.log("rejected: ", rejected));