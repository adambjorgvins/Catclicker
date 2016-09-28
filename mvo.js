$(function () {

    /**
     * Created by AdamB on 27.9.2016.
     */
    var events = {
        CAT_MODEL_READY: 'CAT_MODEL_READY',
        CAT_VIEW_READY: 'CAT_VIEW_READY',
        fireEvent: function(eName){
            $('body').trigger(eName)
        },
        register: function(eName,func){
            $('body').on(eName,func);
        }
    }

    var catModel = {
       cats : {cats:[]},
       init: function(){
           $.get('cats.json', function (data) {
               console.log(data)
               catModel.cats = data;
            }).then(function(){
                events.fireEvent(events.CAT_MODEL_READY);
            }).catch(function(xhr,error,message){
               console.log("Error",error,message)
           })
        }
    }
    var catView = {
        template: undefined,
        init : function(){
            $.get("catTemplate.html", function (data) {
                catView.template = Handlebars.compile(data);
            });
            $(document).on('click','#cat',function(e){
                octopus.currentCatClicked();
            })
        },
        render : function(){
            var cat = octopus.getCurrentCat();
            var html = catView.template(cat);
            $('#cat').html(html);
        }
    }
    var catListView = {
        template: undefined,
        init : function(){
            $.get("catsTemplate.html", function (data) {
                catListView.template = Handlebars.compile(data);
            }).then(function(){
                events.fireEvent(events.CAT_VIEW_READY);
            })

            $(document).on('click',".cat-li",function(e){
                var catElement = $(e.currentTarget);
                octopus.setCurrentCat(catElement.data('id'));
            })
        },

        render : function(){
            var html = catListView.template(octopus.getCatList());
            $('#list').html(html);
        }
    }

    var octopus = {
        currentCat:undefined,
        init: function(){
            catModel.init();
            catListView.init();
            catView.init();
        },
        render : function(){
          catListView.render();
        },
        getCatList : function(){
           return catModel.cats;
        },
        getCurrentCat : function(){
            return octopus.currentCat;
        },
        currentCatClicked : function(){
            octopus.currentCat.count++;
            catView.render();
        },
        setCurrentCat : function(catID){
            var catList = octopus.getCatList().cats;
            for (var i = 0; i < catList.length; i++) {
                var cat = catList[i];
                if(cat.id === catID){
                    octopus.currentCat = cat;
                }
            }
            catView.render();
        }
    };

    // initialize
    var viewLoaded = false;
    events.register(events.CAT_VIEW_READY,function(){
        if(modelLoaded){
            octopus.render()
        }
        viewLoaded = true;
    });

    var modelLoaded = false;
    events.register(events.CAT_MODEL_READY,function(){
        if(viewLoaded){
            octopus.render();
        }
        modelLoaded = true;
    });
    octopus.init();

});
