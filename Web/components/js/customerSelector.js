var app = app || {};

(function(){
    'use strict';

    app.CustomerSelector = React.createClass({displayName: "CustomerSelector",
        render: function(){
            return (
                React.createElement("form", {className: "container"}, 
                    React.createElement("div", {className: "row form-group"}, 
                        React.createElement("div", {className: "col-md-15"}, 
                            React.createElement("select", {className: "form-control", required: true})
                        )
                    )
                )
            );
        }
    });
})();
