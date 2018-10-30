import React, {Component} from "react";
import {Header, List, Segment, Transition, TransitionablePortal} from 'semantic-ui-react';

import {css, StyleSheet} from 'aphrodite';
import {spaceInLeft, spaceOutRight} from 'react-magic';

import {formatTime} from '../utils/time';
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
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            popItem: {}

        };
    }

    onItemClick = (e, item) => {
        this.setState({
            open: true,
            popItem: item
        })
    };
    handleClose = () => {
        this.setState({
            open: false,
            popItem: null
        });
    };

    render() {
        const {items} = this.props;
        const {open, popItem} = this.state;

        let itemNodes = items.map((item, index) => {

            let word = item[0];
            // let header = word.substring(0, 40) + (word.length >= 40 ? '...' : '');

            let from = item[1] || '匿名';
            let itemClass = (index === items.length - 1) ? AnimIn : null;
            return (
                <List.Item key={item[0] + item[4]} className={`swear-item ${itemClass}`}
                           onClick={(e) => this.onItemClick(e, item)}>

                    {/*<Image avatar src={'https://avatars0.githubusercontent.com/u/4375208?s=460&v=4'} />*/}
                    <h3 className='swear-title'>{word}</h3>
                    {/*<List.Content >*/}
                    <List.Content>
                        <p className='swear-content'>
                            来自: <strong>{from}</strong> {`  ——  `} 写入时间: {formatTime(item[4] * 1000)}
                        </p>
                    </List.Content>
                    {/*</List.Content>*/}
                </List.Item>
            )
        });

        return (
            <div>
                <Transition.Group
                    style={{
                        display: 'flex', flexDirection: 'column',
                        flexAlign: 'left',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        // backgroundColor: '#FF666688',
                        overflow: 'hidden'
                    }}
                    as={List} duration={200} selection size='huge' verticalAlign='middle'>

                    {itemNodes}

                </Transition.Group>

                <TransitionablePortal open={open}
                                      onClose={this.handleClose}
                                      transition={{animation: 'fade', duration: 300}}>
                    <Segment className='tip' style={{
                        position: 'fixed'
                    }}>
                        {
                            popItem && (
                                <div>
                                    <Header>{popItem[1] || '匿名'}: </Header>
                                    <strong>{popItem[0]}</strong>
                                    <br/>
                                    <hr/>
                                    <p>区块高度: <a target='_blank'
                                                href={`https://rinkeby.etherscan.io/block/${popItem[3]}`}>{popItem[3]}</a>
                                    </p>
                                    <p>写入时间: {formatTime(popItem[4] * 1000)}</p>
                                </div>
                            )
                        }
                    </Segment>

                </TransitionablePortal>
            </div>
        );
    }
}

export default SwearList;