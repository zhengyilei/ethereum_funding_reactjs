import React, {Component} from 'react';
import './App.css'
import getWeb3 from './utils/getWeb3';
import initContract from './utils/contract';
import SwearList from './components/SwearList';
import {
    Container,
    Input,
    Image,
    Form,
    Segment
} from 'semantic-ui-react';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputMsg: '',
            items: [],
            index: 0
        }
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.web3 = results.web3;
            console.log(this.web3.version);
            // 初始化合约
            this.contract = initContract(this.web3);

            // 开启定时任务获取最新誓言
            this.intervalId = setInterval(() => {
                this.refreshSwears();
            }, 3000);
        })
        .catch(() => {console.log('No web3.')})
    }


    componentWillUnmount() {
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
    }

    list = [
        // { index: 1001, data: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "0x111", 111]},
        // { index: 1002, data: ["bbb", "0x222", 112]},
        // { index: 1003, data: ["ccc", "0x333", 113]},
        // { index: 1004, data: ["ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", "0x444", 114]},
        // { index: 1005, data: ["eee", "0x555", 115]},
        // { index: 1006, data: ["fff", "0x666", 116]},
    ];

    async refreshSwears () {

        if( typeof this.web3 === 'undefined' || this.contract === 'undefined') {
            console.error("web3 or contract is undefined.");
            return;
        }
        try {
            const accounts = await this.web3.eth.getAccounts();

            console.log(`account: ${accounts[0]}`);
            const count = await this.contract.methods.msgCount().call();

            console.log(`count: ${count}`);

            let random = Math.random();
            let randomNum = parseInt(random * count, 10);
            if(this.list.map(obj => obj.index).indexOf(randomNum) >= 0){
                this.switchItems();
                // 随机数重复, 等下一次选随机数, 避免同一个数据被列表回收
                return;
            }

            console.log(`randomNum: ${randomNum}`);
            let msg = await this.contract.methods.randomGet(randomNum).call();
            console.table(msg);

            // 执行index 0 推出动画

            this.list.push({index: randomNum, data: msg});
            this.list = this.list.slice(-6);

            // 1s 后执行 进入动画
            // this.setState({currentMsg: msg})
            this.switchItems();

            // console.log(`result: ${result}`);
        } catch (e) {
            console.error(e);
        }

    }

    switchItems() {
        this.setState((pre, props) => {
            let newArr = [];
            let count = Math.min(5, this.list.length);
            for (let i = pre.index; i < pre.index + count; i++) {
                newArr.push(this.list[i % this.list.length])
            }

            return {
                items: newArr,
                index: ((pre.index + 1) >= this.list.length) ? 0 : (pre.index + 1),
            }
        });
    }

    publish = (e) => {
        e.preventDefault();

        // alert(this.state.inputMsg);

        this.publishSwear(this.state.inputMsg);

        this.setState({inputMsg: ''})

    };

    render() {
        const { inputMsg, items} = this.state;
        return (
            <Container className="App">
                <header className="App-header">
                    <h1 className="App-title">区块链誓言</h1>
                </header>
                <Form onSubmit={this.publish} style={{marginTop: 88, marginLeft: -80}}>
                    <Input
                        size='huge'
                        style={{width: '61.8%'}}
                        action={{ color: 'teal', labelPosition: 'right', icon: 'write', content: '写入誓言' }}
                        required type="text" placeholder='让世界见证你的誓言!' value={inputMsg}
                        onChange={(e) => this.setState({inputMsg: e.target.value})}/>
                </Form>


                <div className='swear-container'>
                    <SwearList items={items}/>
                </div>
            </Container>
        );
    }

    publishSwear = async (inputMsg) => {
        if(this.contract === 'undefined'){
            console.error("web3 or contract is undefined.");
            return;
        }

        try {
            const accounts = await this.web3.eth.getAccounts();
            const result = await this.contract.methods.publish(inputMsg).send({from: accounts[0]});
            console.table(result);
            // let resultJSON = {
            //     "blockHash": "0x5fe37446efc5665669b57dc48af1cc0b887b593702f2fcdbfa28eabc071749b4",
            //     "blockNumber": 2775123,
            //     "contractAddress": null,
            //     "cumulativeGasUsed": 1087146,
            //     "from": "0x7855f93c158b36c93d0e34eb6be6b2dcfd3587e4",
            //     "gasUsed": 754506,
            //     "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            //     "status": true,
            //     "to": "0xc3e8a7bafcc4afa6f4fc701a6cc907fb85970290",
            //     "transactionHash": "0xf6466d4559d45e1aa9e3cc15c43196ace10a78701319530b77f4027f5f1c647b",
            //     "transactionIndex": 3,
            //     "events": {}
            // }

            this.refreshSwears();
        } catch (e) {
            console.error(e);
            alert("未登录或未解锁metamask插件")
        }
    }
}

export default App;
