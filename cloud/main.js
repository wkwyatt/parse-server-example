// var Stripe = require('stripe')("sk_test_Z5pxQP4mVPohJYQfI6o2XDh2");

// Parse.Cloud.define('hello', function(req, res) {
//   res.success('Hi');
// });

// Parse.Cloud.define('customer', function(req, res) {
//     var customerId = '';  // Load the Stripe Customer ID for your logged in user
//     Stripe.customers.retrieve(customerId, function(err, customer) {
//         if (err) {
//             res.status(402).send('Error retrieving customer!');
//         } else {
//             res.json(customer);
//         }
//     });
// });

// Parse.Cloud.define('customerSources', function(req, res) {
//     var customerId = '' // Load the Stripe Customer ID for your logged in user
//     Stripe.customers.createSource(custstomerId, {
//         source: req.body.source
//     }, function(err, source) {
//         if (err) {
//             res.status(402).send('Error attaching source!');
//         } else {
//             res.status(200).end();
//         }
//     })
// });

// Parse.Cloud.define('customerDefaultSource', function(req, res) {
//     var customerId = '' // Load the Stripe Customer ID for your logged in user
//     Stripe.customers.update(customerId, {
//         default_source: req.body.defaultSource
//     }, function(err, customer) {
//         if (err) {
//             res.status(402).send('Error setting default source!');
//         } else {
//             res.status(200).end();
//         }  
//     });
// });

// Parse.Cloud.afterSave(Parse.User, function(request) {
//     console.log({"After save message" : "Creating a new user Cloud Code!!! YAY!"});
//     Stripe.accounts.create(
//       {
//         country: "US",
//         managed: true
//       }
//     ).then(function (response) {
//         console.log({"Stripe response header" : "Stripe!!!"});
//         console.log({"Stripe response DATA": response});
//     });
// });

Parse.Cloud.beforeSave("Events", function(request, response) {
  //console.log(request.object.isNew()); //You could also use this. request.object.isNew() return yes if the request try to insert new record rather than updating.
    if (request.object.id != null) { //If toSavedObjectId is defined, then it will be an update
        response.success(); //Just allow update to perform

    }
    else { //If not an update, meaning an insertion
        var IGID = request.object.get("IGID");
        if (IGID == null || typeof IGID == 'undefined') { //phoneNumber == null or undefined mean not signing up with phoneNumber. So let it sign up.
            response.success();
        }
        else {
            //Now check duplication
            var query = new Parse.Query("Events");
            query.equalTo("IGID", IGID);
            query.count({ // If found 2 when signing up:Still do not allow. If found 2 when updating: Still allow.
            	useMasterKey: true,
                success: function(count) {
                    if (count > 0) { //Found duplication
                    //Duplication while signing up. Do not allow
                        response.error("Duplicated Instagram ID");
                    }
                    else { //Object to sign up is equal to object found. Meaning updating. Allow updating
                        response.success();
                    }
                },
                error: function() {
                  response.error("Some error when checking event Instagram ID before saving");
                }       
            });
        }

    }
});

Parse.Cloud.beforeSave("Venues", function(request, response) {
  //console.log(request.object.isNew()); //You could also use this. request.object.isNew() return yes if the request try to insert new record rather than updating.

    if (request.object.id != null) { //If toSavedObjectId is defined, then it will be an update
        response.success(); //Just allow update to perform

    }
    else { //If not an update, meaning an insertion
        var IGID = request.object.get("IGID");
        if (IGID == null || typeof IGID == 'undefined') { //phoneNumber == null or undefined mean not signing up with phoneNumber. So let it sign up.
            response.success();
        }
        else {
            //Now check duplication
            var query = new Parse.Query("Venues");
            query.equalTo("IGID", IGID);
            query.count({ // If found 2 when signing up:Still do not allow. If found 2 when updating: Still allow.
                success: function(count) {
                    if (count > 0) { //Found duplication
                    //Duplication while signing up. Do not allow
                        response.error("Duplicated Instagram ID") ;
                    }
                    else { //Object to sign up is equal to object found. Meaning updating. Allow updating
                        response.success();
                    }
                },
                error: function() {
                  response.error("Some error when checking venues Instagram ID before saving");
                }       
            });
        }

    }
});
