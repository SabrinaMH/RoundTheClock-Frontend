(function () {
    'use strict';
    
    var App = React.createClass({
        getInitialState: function(){
            return {};
        },
        
        render: function(){
            return (
                <div>
                    <header id="header">
                        <h1>Round the Clock</h1>
                    </header>
                </div>
            );
        }
    });
    
    function render() {
        React.render(
            <App />,
            document.getElementById('app')
        )
    }
    
    render();
})();