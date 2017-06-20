//******************************************************************************
//                                 Views
//******************************************************************************

/* global Backbone, jQuery, _, ENTER_KEY, ESC_KEY, myapp, tempdetail */
var app = app || {};

//******************************************************************************
//                The Application  (The top-level piece of UI)
//******************************************************************************

app.AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: 'body',
    // Delegated events for creating new items, and clearing completed ones.

    events: {
        'keypress .cardname': 'searchWithName'
    },
    // At initialization we bind to the relevant events 
    initialize: function () {
        this.instances = {};
        // this is aur collection
        this.instances.mycollection = new app.CardC();
        // we get the cardname as input
        this.$input = this.$('.cardname');

        new app.MarkizaView();
    },
    // Re-rendering the App just means refreshing data but the rest of the app doesn't change.
    render: function () {
    },
    searchWithName: function (e, fromfeatured) {

        var thisview = this;
        // search input after press ENTER_KEY

        var searchfor = this.$input.val().trim();
        if (fromfeatured !== undefined) {
            searchfor = fromfeatured;
        }

        if ((e.which === ENTER_KEY && searchfor) || fromfeatured !== undefined) {
            $('.cardname').attr('disabled', true);

            // make a new Http Request to get data from our api
            var request = new XMLHttpRequest();
            request.open('GET', apiurl + '/card_data/' + searchfor);
            request.onreadystatechange = function () {
                if (this.readyState === 4) {

                    $('.cardname').attr('disabled', false);
                    console.log('Status:', this.status);
                    console.log('Headers:', this.getAllResponseHeaders());
                    console.log('Body:', this.responseText);
                    var atts = JSON.parse(this.responseText);

                    if (thisview.instances.popover !== undefined) {
                        thisview.instances.popover.destroy();
                        thisview.instances.popover = undefined;
                    }

                    // in case that api dont returns any card
                    if (atts.status === 'fail') {
                        thisview.instances.popover = new app.PopOverViewEmtyView({model: mymodel});
                        // in case that api returns a card 
                    } else if (atts.status === 'success') {
                        // we create an new card model
                        var mymodel = new app.CardM(atts);
                        // we call a new popover for this card
                        thisview.instances.popover = new app.PopOverView({model: mymodel});
                    }

                }
            }
            ;
            request.send();
            if (e) {
                e.preventDefault();
            }

        } else {
            if (thisview.instances.popover !== undefined) {
                thisview.instances.popover.destroy();
            }
        }
    },
    dialogAlert: function (title, text, icon) {
        if (icon === undefined) {
            icon = 'glyphicon-info-sign';
        }
        var alTemplate = _.template(''
                + '<div class="modal fade  " tabindex="-1" id="myModal" role="dialog">'
                + '<div class="modal-dialog modal-sm" role="document">'
                + '<div class="modal-content">'
                + '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '<h4 class="modal-title"> <span class="glyphicon <%print(icon)%>" aria-hidden="true"></span>  <%print(title)%></h4>'
                + '</div>'
                + '<div class="modal-body">'
                + '<p><%print(text)%></p>'
                + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" class="btn btn-primary" data-dismiss="modal">ok</button>'
                + '</div>'
                + '</div><!-- /.modal-content -->'
                + ' </div><!-- /.modal-dialog -->'
                + '</div><!-- /.modal -->'
                + '');

        var htmltoshow = alTemplate({title: title, text: text, icon: icon});
        $('#mymodalSpace').html(htmltoshow);
        $('#myModal').modal('show');
    },
    //some global functions..
    jump: function (h) {
        var top = document.getElementById(h).offsetTop;
        window.scrollTo(0, top - 150);
    }


});
//******************************************************************************
//                               PopOverView
//******************************************************************************

app.PopOverView = Backbone.View.extend({
    el: '.navbar-brand',
    initialize: function () {
        this.render();
    },
    template: _.template('\
            <div class="panel panel-default"> <img \n\
            src = "<%print(image) %> "  alt = "thumbnail" class = "img-thumbnail"></div></div>'
            + '<div class="panel panel-default">'
            + '<div class="panel-heading">Name:</div><div class="panel-body"><% print(data.name) %></div>'
            + '<div class="panel-heading">Type:</div><div class="panel-body"><% print(data.type) %></div>'
            + '<div class="panel-heading">Text:</div><div class="panel-body"><% print(data.text) %></div>'
            + '</div><div class="modal-footer">'
            + '<button type="button" class="btn btn-success addcard" data-dismiss="modal">Add to Deck</button>'
            + '<button type="button" class="btn btn-danger closepop" data-dismiss="modal">Close</button>'
            + '</div>'
            )
    ,
    render: function () {
        var pop = this;
        $(this.el).popover({
            placement: "bottom",
            title: this.model.get("data").name,
            content: this.template(this.model.toJSON()),
            html: true
        });
        //console.log(this.model.toJSON());
        $(this.el).popover('show');

        var scrolPopOver = $(window).height() - 180;
        $('.popover-content').css('max-height', scrolPopOver + 'px');


        $('.addcard').click(function () {
            console.log(pop.model);
            myapp.instances.mycollection.checkBeforeAdd(pop.model);
            pop.destroy();
        });
        $('.closepop').click(function () {
            pop.destroy();
        });
    },
    destroy: function () {
        $(this.el).popover('destroy');
    }
});
//******************************************************************************
//                                ColItemView
//******************************************************************************

app.ColItemView = Backbone.View.extend({
    model: app.CardM,
    initialize: function () {
        this.el = '#' + this.model.get("id");
        this.render();
    },
    // no events nedeed
    events: {
    },
    // generate our html code for card item in our list  
    template: _.template(''
            + '<li class="yugiitem list-group-item" id="<%print(id) %>">'
            + '<div class="dl-horizontal">'
            + '<div class="pull-left" >\n\ '
            + '<img src = "<%print(image) %> "  alt = "thumbnail" class = "img-rounded"></div>'
            + '<div class="desc" ><b>Name: </b><%print(data.name)%><br>\n\ '
            + '<p class="text-muted"><b>Type: </b><%print(data.type)%></div></prototype>'
            + '</div>'
            + '</li>')
    ,
    render: function () {
        $('.yugiitemempty').hide();
        var view = this;
        var html = this.template(this.model.toJSON());
        $('#mycollection').append(html);
        $(this.el).click(function () {
            view.displayDetails();
        });
    },
    destroy: function () {
        $(this.el).remove();
    },
    displayDetails: function () {

        if (tempdetail !== undefined) {

            tempdetail.undelegateEvents();
        }
        tempdetail = new app.CardDetailsView({model: this.model});
        myapp.jump('det');

    }

});
//******************************************************************************
//                            PopOverViewEmtyView
//******************************************************************************

app.PopOverViewEmtyView = Backbone.View.extend({
    el: '.navbar-brand',
    // initialization of Emty View Pop Over window
    initialize: function () {
        // call render function
        this.render();
    },
    render: function () {

        var pop = this;

        // generate our html code for card details 
        $(this.el).popover({
            // plase this popover under the search
            placement: "bottom",
            title: '<h4>Emty List</h4>',
            // html code for no card result (popup window) 
            content: '<img src = "img/yuug1.png"  alt = "thumbnail" class = "img-thumbnail"></div></div><hr>'
                    + '<div class="panel panel-danger"><div class="panel-heading">'
                    + '<h3 class="panel-title">Note</h3>'
                    + '</div>'
                    + '<div class="panel-body">No cards matching this name were found in our database.'
                    + '<br><br>Please try again.</div>'
                    + '</div>'
                    + '<div class="modal-footer">'
                    + '<button type="button" class="btn btn-danger closepop" data-dismiss="modal">Close</button>'
                    + '</div>'
            ,
            html: true
        });

        // show our popover
        $(this.el).popover('show');

        var scrolPopOver = $(window).height() - 180;
        $('.popover-content').css('max-height', scrolPopOver + 'px');

        // close our popover function
        $('.closepop').click(function () {
            pop.destroy();
        });

    },
    // destroy our popover function
    destroy: function () {
        $(this.el).popover('destroy');
    }
});

//******************************************************************************
//                               CardDetailsView
//******************************************************************************

app.CardDetailsView = Backbone.View.extend({
    el: '.detailview',
    initialize: function () {
        this.render();
    },
    // our events for our buttons ( close and delete )
    events: {
        'click .detclose': 'closeCard',
        'click .detdelete': 'deleteCard'
    },
    // generate our html code for card details 
    template: _.template(''
            + '<h2>Card Details</h2>'
            + '<table class="table table-striped table-hover ">'
            + '<thead> '
            + '<tr>'
            + '<th><img src = "<% print(image) %>" alt = "thumbnail" class = "img-thumbnail" width ="300"></th>   '
            + '<th><img src = "img/yu_gi1.png" alt = "thumbnail" class = "img-thumbnail" width ="300"></th> '
            + '<tr>'
            + '</thead>'
            + '</table>'
            + '<div class="panel panel-default">'
            + '<div class="panel-heading">Name:</div><div class="panel-body"><% print(data.name) %></div>'
            + '<div class="panel-heading">Type:</div><div class="panel-body"><% print(data.type) %></div>'
            + '<div class="panel-heading">Text:</div><div class="panel-body"><% print(data.text) %></div>'
            + '<div class="panel-heading">Card Type:</div><div class="panel-body"><% print(data.card_type) %></div>'
            + '<div class="panel-heading">Family:</div><div class="panel-body"><% print(data.family) %></div>'
            + '<div class="panel-heading">Attack:</div><div class="panel-body"><% print(data.atk) %></div>'
            + '<div class="panel-heading">Defence:</div><div class="panel-body"><% print(data.def) %></div>'
            + '<div class="panel-heading">Level:</div><div class="panel-body"><% print(data.level) %></div>'
            + '<div class="panel-heading">Property:</div><div class="panel-body"><% print(data.property) %></div>'
            + '</div><div class="modal-footer"> '
            + '<a href="#" class="btn btn-warning detclose">Close Window</a>'
            + '<a href="#" class="btn btn-danger pull-right detdelete">Delete Card</a>'
            + '</div>'),

    // generate our html code for card details for this Model
    render: function () {
        var html = this.template(this.model.toJSON());
        $(this.el).html(html);
    },
    // function for closing card details 
    closeCard: function () {
        $(this.el).empty();
    },
    // remove this card from our collection 
    deleteCard: function () {
        myapp.instances.mycollection.remove(this.model);
        // call function to close this window
        this.closeCard();
    }
});

//******************************************************************************
//                            MarkizaView
//******************************************************************************

app.MarkizaView = Backbone.View.extend({
    el: '.markcontent',
    // initialization of Emty View Pop Over window
    initialize: function () {
        // call render function
        this.render();
    },
    render: function () {

        //service of most expensive cards is not working so I will sugest some
        var suggested = ['Black Rose Dragon', 'Horus the Black Flame Dragon LV6',
            'Dark Paladin', 'White Night Dragon', 'Armed Dragon LV7', 'Overload Fusion',
            'Dark Magician Girl', 'Vampire Lord', 'Glow-Up Bulb', 'Elemental HERO Gaia', 'Acorno', 'Exodia the Forbidden One',
            'Ancient Rules', 'Ojama King', 'Nekroz of Trishula', 'Vision HERO Trinity', 'Effect Veiler', 'Volcanic Slicer '

        ];

        // change order 
        suggested = _.shuffle(suggested);

        var html = '';

        _.each(suggested, function (row) {
            // fill with card order
            html += ' <span class="label label-default cards">' + row + '</span> ';

        });
        // set a start label Featured cards:
        html = ' <span class="label label-badge">  Featured cards: </span> ' + html;

        // show our popover
        $(this.el).html(html);
        // functions with mouse movement
        $('.markiza #marquee').marquee('pointer').mouseover(function () {
            $(this).trigger('stop');
        }).mouseout(function () {
            $(this).trigger('start');
        }).mousemove(function (event) {
            if ($(this).data('drag') == true) {
                this.scrollLeft = $(this).data('scrollX') + ($(this).data('x') - event.clientX);
            }
        }).mousedown(function (event) {
            $(this).data('drag', true).data('x', event.clientX).data('scrollX', this.scrollLeft);
        }).mouseup(function () {
            $(this).data('drag', false);
        });

        // on click call searchWithName
        $('.markcontent .cards').click(function () {
            console.log($(this).text());

            myapp.searchWithName('', $(this).text());
        });
    }
});