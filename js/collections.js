/* global sc, myapiurl */

//******************************************************************************
//                                 Collections
//******************************************************************************

/*Backbone Collection for our card deck and functions for this card Collection*/

app.CardC = Backbone.Collection.extend({
    model: app.CardM,
    initialize: function () {
        this.on("add", function (card) {
            //give to our model a unique id 
            card.set('id', card.cid);
            //make a new list item in our View 
            new app.ColItemView({model: card});
            // From local storage to db ***************************** Start
            //Save item to our local storage 
            //this.saveTolocalStorage();
            
            if (this.loading === false) {
                this.saveToDb();
            }
            // From local storage to db ***************************** End
        });
        this.on("remove", function (card) {
            // remove list view from dom
            $('#' + card.get('id')).remove();
            //Save to our local storage this remove
            this.saveTolocalStorage();
        });
        //get userid from Local Storage 
        this.userid = this.getIdFromLocalStorage();

        // From local storage to db ***************************** Start
        // load collection from local storage
        //this.loadFromLocalStorage();

        //flag to stop autosave until loading finished
        this.loading = true;
        //load from db
        this.loadFromDb(this);
        // From local storage to db ***************************** End
    },
    getIdFromLocalStorage: function () {
        var stored = localStorage.getItem('yugiuserid');
        var id;
        // From local storage to db ***************************** Start
        if (stored !== null) {
            id = stored;
        } else {
            id = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            localStorage.setItem('yugiuserid', id);
        }
        return id;
        // From local storage to db ***************************** End
    },
    // function for loading our card collection from local storage
    loadFromLocalStorage: function () {
        var savedcards = JSON.parse(localStorage.getItem('yugicollection'));
        if (savedcards !== null) {
            for (var i = 0; i < savedcards.length; i++) {
                var cardm = new app.CardM(savedcards[i]);
                this.add(cardm);
            }
        }
    },
    // function for saving an item in our local storage
    saveTolocalStorage: function () {
        localStorage.setItem('yugicollection', JSON.stringify(this.toJSON()));
    },
    // function for checking the amount of cards ( less than our limit = 30 ) 
    checkBeforeAdd: function (card) {
        if (this.models.length >= decklimit) {
            myapp.dialogAlert('Card Limit', 'you have exceeded the number of allowed cards in your deck.Remove some and retry..!');
        } else {
            this.add(card);
        }
    },
    // From local storage to db *************************************** Start
    // function for loading our card collection from database
    loadFromDb: function (collection) {
        $.ajax({
            type: 'GET',
            url: myapiurl + '?request=getuserdata&user=' + this.userid,
            error: function () {
                //
            },
            success: function (data) {

                var savedcards = JSON.parse(data.data);
                if (savedcards !== null) {
                    for (var i = 0; i < savedcards.length; i++) {
                        var cardm = new app.CardM(savedcards[i]);
                        collection.add(cardm);
                    }
                    collection.loading = false;
                }
            },
            crossDomain: true
        });
    },
    // save to our DB
    saveToDb: function () {
        $.ajax({
            type: 'POST',
            url: myapiurl + '?request=setuserdata',
            error: function () {
                myapp.dialogAlert('Error Saving Data', 'An unexpected error has occurred', 'glyphicon-exclamation-sign');
            },
            data: {
                data: JSON.stringify(this.toJSON()),
                user: this.userid
            },
            success: function (data) {
                console.log("Saved sucessfully");
            },
            crossDomain: true
        });
    },
    // function to create random id
    randomString: function (length, chars) {
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
// From local storage to db ********************************************* End
});

