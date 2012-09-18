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
    var Food = Backbone.Model.extend({});//食品
    var FoodList = Backbone.Collection.extend({//食品列表
        model:Food,
        url:'/allFoods'
    });

    var foodList = new FoodList(); //创建模块内全局的foodList
    foodList.fetch({add:true});

    var FoodRouter = Backbone.Router.extend({
        initialize:function () {
            this.state = new Backbone.Model;//状态对象，用于处理事件
        },
        routes:{
            'add':'edit',
            'edit/:id':'edit',
            '*action':'list'
        },
        list:function () {
            foodList.off();
            var listView = new FoodListView();
            _.extend(listView, FadeInMixin);//将动画过渡效果加入视图对象
            listView.render().$el.appendTo(marshal.el);
            listView.fadeIn();
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
            var foodFormView = new FoodFormView({model:food});
            _.extend(foodFormView, FadeInMixin);
            foodFormView.render().$el.appendTo(marshal.el);
            foodFormView.fadeIn();
        }
    });

    var FoodListView = Backbone.View.extend({//食品列表视图
        className:'foodList',
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

    var FoodListItemView = Backbone.View.extend({//食品列表条目视图
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

    var FoodFormView = Backbone.View.extend({//食品表单视图
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
                count++; //因为没有使用数据库，这里模拟自增列
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

    var translateX=function(){//用于生成过渡的转换坐标
        var x=this.toLeft?410:-410;
        this.toLeft=!this.toLeft;
        return x;
    };

    var FadeInMixin = {//渐入渐出效果mixin
        fadeIn:function () {
            var view = this;

            if (foodRouter.state.previous('currentView')) {
                view.$el.css(
                    {
                        '-webkit-transition-duration':'0s',
                        '-webkit-transform':'translate('+translateX()+'px,0)'
                    }
                );

                setTimeout(function () {
                    view.$el.css({
                        '-webkit-transition-duration':'0.5s',
                        '-webkit-transform':'translate(0)'
                    });
                }, 0);
            } else {
                view.$el.css(
                    {
                        '-webkit-transition-duration':'0s',
                        '-webkit-transform':'translate(0px,0)'
                    }
                );
            }

            if(!foodRouter.registerFadeout){
                foodRouter.state.on('change:currentView', function (model) {
                    var view = model.previous('currentView');
                    if (view) {
                        view.$el.css({
                            '-webkit-transition-duration':'0.5s',
                            '-webkit-transform':'translate(-'+translateX()+'px,0)'
                        });
                        view.$el.on('webkitTransitionEnd', function () {
                            view.remove();
                            console.log('view removed');
                        });
                    }
                });
                foodRouter.registerFadeout=true;
            }

            foodRouter.state.set('currentView', view);
        }
    };

    var count = 4;
    var foodRouter = new FoodRouter();

    marshal.foodRouter = foodRouter;

})(marshal);


