import React from 'react';
import ListExample from './components/ListExample';




class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <ListExample/>
            </div>
        );
    }
}

export default Test;
