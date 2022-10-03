//main.js routes and logic for CalorieBuddy
module.exports = function(app) {
    // Home Page
    app.get("/",function(req, res){
    res.render("index.html")
    });

    // Search Foods Page
    app.get("/searchFood",function(req, res) {
    res.render("searchFood.html");
    });

    // Update Foods Page
    app.get("/updateFood",function(req, res) {
    res.render("updateFood.html");
    });

    // About Page
    app.get("/about",function(req, res) {
    res.render("about.html");
    });

    // Add food page
    app.get("/addFood", function (req,res) {
        res.render("addFood.html");
        });

    // List foods page; looks through the table food in the myFood database, returns all items in table
    app.get("/listFood", function(req, res) {
        // query database to get all the food
        let sqlquery = "SELECT * FROM food";
        // execute sql query
        db.query(sqlquery, (err, result) => {
        if (err) {
        res.redirect("/"); // redirect if error to Home page
        }
        res.render("listFood.html", {availableFood: result}); // displays the table data in list html
        });
       });


       app.post("/foodadded", function (req,res) {
        // declaring food to be inserted and the parameters for the table to be inserted
        let sqlquery = "INSERT INTO food (name, calories, value_per_unit, unit_of_value, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?)";
        // get input from users form and store it to be added
        let newrecord = [req.body.name, req.body.calories, req.body.value_per_unit, req.body.unit_of_value, req.body.carbs, req.body.fat, req.body.protein, req.body.salt, req.body.sugar];
        // query the databse taking userinput and parameters to be used; in this case insertion
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) { // send error message if error occurs
        return console.error(err.message);
        }else
        // Message sending the name of the food that was added
        // res.send(" This food is added to database, name: "+ req.body.name + " calories "+
        // req.body.calories);
        // load the Add Food page after 2 seconds
        res.render("addFood.html");
        });
       });

       // Search the database for keyword
       app.get("/search-result-db", function (req, res) {
        let word = [req.query.keyword]; // get the word the user typed
        let sqlquery = "SELECT * FROM `food` WHERE name like CONCAT('%', ?,  '%') "; // Search for matches even if partial word or letter
        // query the databse for the users keyword
        db.query(sqlquery,word, (err, result) => {
        if (err) {
        return console.error("No food found with the keyword you have entered" // If no matached found display this message
        + req.query.keyword + "error: "+ err.message);
        }else{
        res.render ('listFood.html',{availableFood:result}); // Otherwise display the results
        }
        });
       });

      // Delete an item from the database table food
       app.get("/delete/:id", function (req,res, next) {
        // delete from databse where id mathces users choice
        let sqlquery = "DELETE FROM food WHERE id = ?";
        // get the id of the selection 
        var id= req.params.id;
        db.query(sqlquery, [id], (err, result) => {
        if (err) {
        return console.error(err.message); // Throw error if unable to comply
        }else
        res.render("updateFood.html"); // Redirect to he Update Food Page
       // res.redirect('/listFood.html');
        });
       });

} 