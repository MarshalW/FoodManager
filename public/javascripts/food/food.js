/**
 * Created with JetBrains WebStorm.
 * User: marshal
 * Date: 12-9-17
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 */
var marshal = {
    init:function () {
    }
};
$(marshal.init());

(function (marshal) {
    var Food = Backbone.Model.extend({});
    var FoodList = Backbone.Collection.extend({
        model:Food,
        url:'/allFoods'
    });

    var foodList = new FoodList();
    foodList.fetch({add:true});

    var FoodRouter = Backbone.Router.extend({
        initialize:function () {
        },
        routes:{
            'add':'edit',
            'edit/:id':'edit',
            '*action':'list'
        },
        list:function () {
            foodList.off();
            $(marshal.el).empty();
            new FoodListView().render().$el.appendTo(marshal.el);
        },
        edit:function (id) {
            var food;
            if (id) {
                foodList.each(function (model) {
                    if (model.id == id) {
                        food = model;
                    }
                });
            }
            foodList.off();
            $(marshal.el).empty();
            new FoodFormView({model:food}).render().$el.appendTo(marshal.el);
        }
    });

    var FoodListView = Backbone.View.extend({
        initialize:function () {
            this.collection = foodList;
            var view = this;

            this.collection.on('add', function (model) {
                view.add(model);
            });
        },
        add:function (model) {
            new FoodListItemView({model:model}).render().$el.appendTo(this.el);
        },
        render:function () {
            var view = this;
            var template = Handlebars.compile($('#food_list_template').html());
            $(template()).appendTo(this.$el);

            this.collection.each(function (model) {
                view.add(model);
            });
            return this;
        }
    });

    var FoodListItemView = Backbone.View.extend({
        initialize:function () {
            var view = this;
            this.model.on('change', function () {
                view.render();
            });
        },
        render:function () {
            this.$el.empty();
            var template = Handlebars.compile($('#food_list_item_template').html());
            $(template(this.model.toJSON())).appendTo(this.$el);
            return this;
        },
        events:{
            'click button':'action'
        },
        action:function (event) {
            if ($(event.target).text() == '删除') {
                foodList.remove(this.model);
                this.remove();
            } else {
                foodRouter.navigate('edit/' + this.model.id, {trigger:true});
            }
        }
    });

    var FoodFormView = Backbone.View.extend({
        initialize:function () {
            this.model = this.model || new Food();
        },
        render:function () {
            var template = Handlebars.compile($('#food_form_template').html());
            $(template()).appendTo(this.$el);
            var food = this.model.toJSON();
            console.log(food);

            if (food.id) {
                this.$el.find('#foodName').attr('value', food.name);
            }

            return this;
        },
        events:{
            'click button':'action',
            'change input':'changeValue'
        },
        action:function () {
            if (!this.model.id) {
                count++;
                foodList.push(this.model);
            }
            foodRouter.navigate('list', {trigger:true});
        },
        changeValue:function (event) {
            var valueId = event.target.id;
            var value = $('#' + valueId).val();
            switch (valueId) {
                case 'foodName':
                    this.model.set({name:value});
                    break;
            }
        }
    });
    var count = 4;
    var foodRouter = new FoodRouter();

    marshal.foodRouter = foodRouter;

})(marshal);


