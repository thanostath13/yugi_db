//******************************************************************************
//                                 Models
//******************************************************************************

/*Backbone Model for a card of our deck and functions initialize for this card*/

app.CardM = Backbone.Model.extend({
    
    // getting card image from the main domain 
    initialize: function () {
        var imageurl = 'http://yugiohprices.com/api/card_image/' + this.get('data').name;
        this.set('image', imageurl);
    },
    
    //set some defaults attributes for the card (each card created has `name` and `text` keys).
    defaults: {
        name: 'yugi',
        text: 'default text'
    }
});

