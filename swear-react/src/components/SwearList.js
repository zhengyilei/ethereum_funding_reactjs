import React, {Component} from "react";
import {
    Transition,
    List,
} from 'semantic-ui-react';

import { StyleSheet, css } from 'aphrodite';
import { spaceInLeft, spaceOutRight } from 'react-magic';

import { formatTime } from '../utils/time';
// animate style
const styles = StyleSheet.create({
    in: {
        animationName: spaceInLeft,
        animationDuration: '1s'
    },
    out: {
        animationName: spaceOutRight,
        animationDuration: '1s'
    }
});

const AnimIn = css(styles.in);
// const AnimOut = css(styles.out);

class SwearList extends Component {
    render(){
        const { items } = this.props;

        let itemNodes = items.map((item, index) => {

            let word = item.data[0];
            let header = word.substring(0, 40) + (word.length >= 40 ? '...' : '');


            return (
                <List.Item key={item.index} className={(index === items.length - 1) ? AnimIn : null}
                           style={{
                               display: 'flex', flexDirection:'row',
                               textAlign: 'left', width: '100%'
                           }}>

                    {/*<Image avatar src={'https://avatars0.githubusercontent.com/u/4375208?s=460&v=4'} />*/}
                    <h3 className='swear-item'>{header}</h3>
                    {/*<List.Content >*/}
                    <List.Content floated='right'>

                        <p style={{color: '#CCC', fontSize: 12}}>
                            来自:  {item.data[1]} {' '} 写入时间:  {formatTime(item.data[2] * 1000)}
                        </p>
                    </List.Content>
                    {/*</List.Content>*/}
                </List.Item>
            )
        });

        return (
            <Transition.Group
                style={{
                    display: 'flex',flexDirection:'column',
                    flexAlign: 'left',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    // backgroundColor: '#FF666688',
                    overflow: 'hidden'}}
                as={List} duration={200} selection size='huge' verticalAlign='middle' >

                {itemNodes}

            </Transition.Group>
        );
    }
}
export default SwearList;