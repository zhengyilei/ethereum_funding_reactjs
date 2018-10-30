import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import SwearList from './components/SwearList';
import {
    Container,
    Input,
    Form,
    Progress,
    Confirm
} from 'semantic-ui-react';
import { SWEARS, PUBLISH } from './api';
import ModalView from "./components/ModalView";

const HASH_KEY = 'hashArr';
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputMsg: '',
            items: [],
            index: 0,
            percent: 0,
            confirm: {
                open: false
            },
            modal: {
                modalOpen: false
            }
        }
    }
    // list = [{"0": "失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。失去人性,失去很多;失去兽性,失去一切。", "1": "托马斯*维德", "2": "0x7855F93C158B36C93D0e34eb6Be6b2dcFd3587e4", "3": "2809749", "4": "1534216343"}, {"0": "前进！前进！不择手段的前进！", "1": "三体", "2": "0x7855F93C158B36C93D0e34eb6Be6b2dcFd3587e4", "3": "2809975", "4": "1534219733"}, {"0": "失去人性,失去很多;失去兽性,失去一切。", "1": "托马斯*维德", "2": "0x7855F93C158B36C93D0e34eb6Be6b2dcFd3587e4", "3": "2809749", "4": "1534216343"}, {"0": "给我块二相箔", "1": "歌者文明观察员", "2": "0x7855F93C158B36C93D0e34eb6Be6b2dcFd3587e4", "3": "2809987", "4": "1534219913"}, {"0": "毁灭你，与你何干", "1": "三体", "2": "0x7855F93C158B36C93D0e34eb6Be6b2dcFd3587e4", "3": "2809910", "4": "1534218758"}];
    list = [];

    componentDidMount() {
        this.refreshSwears();
        // 开启定时任务获取最新誓言 15秒获取一次
        this.intervalId = setInterval(() => {
            this.refreshSwears();
        }, 1000 * 3 * 5);

        // 3秒重新对页面进行一次排序
        this.switchId = setInterval(() => {
            this.switchItems();
        }, 1000 * 3)
    }
    componentWillUnmount() {
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
        if(this.switchId){
            clearInterval(this.switchId);
        }
    }

    refreshSwears = () => {
        // console.log('refreshSwears');
        fetch(SWEARS)
            .then(res => {
                // console.table(res);
                return res.json()
            })
            .then(result => {
                if(result.code === 0){
                    this.list.push(...result.data);
                    this.list = this.list.slice(-11);
                    // console.table(this.list);
                }else {
                    console.error(result.data);
                }
            }).catch(e => {
            console.error(e);
        })
    };
    switchItems() {
        // console.log('switchItems');
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

        let inputMsg = this.state.inputMsg.trim();
        if(inputMsg.length === 0){
            return;
        }
        if(inputMsg.length > 500){
            alert("内容超出最大长度限制：500字符");
            return;
        }

        this.setState({
            confirm: {open: true}
        })

    };
    publishSwear = (word, from) => {
        // 开始请求
        this.increaseTo(98, 22);
        // alert(msg);
        let body = {
            word: word,
            from: from,
        };
        fetch(PUBLISH, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: queryString.stringify(body),
        })
            .then(res => res.json())
            .then(result => {
                if(result.code !== 0){
                    this.setState((pre, props) => ({
                        percent: 0
                    }));
                    alert(result.data);
                    return;
                }
                // console.table(result);
                this.setState((pre, props) => ({
                    percent: 100
                }));
                // alert(`发布完毕：${JSON.stringify(result)}`);

                setTimeout(()=>{
                    let data = result.data;
                    this.setState((pre, props) => ({
                        percent: 0,
                        inputMsg: '',
                        modal: {
                            modalOpen: true,
                            header: '恭喜你！你的誓言已成功写入区块链、并永久保存！',
                            content: (
                                <p>
                                    区块高度：{data.blockNumber}<br/>
                                    记录hash：{data.transactionHash}<br/>
                                    你可凭此hash永久查询到你的誓言 <br/>
                                    <a target='_blank' href={"https://rinkeby.etherscan.io/tx/"+data.transactionHash}>按我立即查看</a>
                                </p>
                            )
                        }
                    }));
                    try {
                        let hashArrays = JSON.parse(localStorage.getItem(HASH_KEY)) || [];
                        hashArrays.push(data.transactionHash);
                        localStorage.setItem(HASH_KEY, JSON.stringify(hashArrays));
                    } catch (e) {
                        localStorage.setItem(HASH_KEY, '');
                    }
                },1500)
            })
            .catch(e => {
                console.error(e);

                setTimeout(()=>{
                    this.setState((pre, props) => ({
                        percent: 0,
                    }));
                },2000)

            });
    };
    increaseTo = (percent, duration) => {
        let durationMills = (duration * 1000);
        let targetTime = new Date().getTime() + durationMills;
        this.increaseTimerId = setInterval(() => {
            let p = 1 - ((targetTime - new Date().getTime()) / durationMills); // 0->1
            let progress = p * 100;
            if(progress >= percent){
                clearInterval(this.increaseTimerId);
            }else {
                this.setState({percent: progress})
            }
        },100);

    };

    render() {

        const { inputMsg, items, percent, modal, confirm} = this.state;


        return (
            <Container className="App">
                <img src={require('./img/itcast-logo.png')} alt="logo"
                     style={{height: '2.6rem', position: 'fixed', margin: '10px 10px'}}/>
                <header className="App-header">
                    <h1 className="App-title">区块链誓言</h1>
                </header>
                <Form onSubmit={this.publish} className="App-form">
                    {/*["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","grey","black",
                    "facebook","google plus","instagram","linkedin","twitter","vk","youtube"]*/}
                    <Input
                        size='huge'
                        className="App-form-write"
                        action={{ color: 'twitter', labelPosition: 'right', icon: 'write', content: '写入' }}
                        required type="text" placeholder='让世界见证你的誓言!' value={inputMsg}
                        onChange={(e) => this.setState({inputMsg: e.target.value})}/>
                </Form>

                {percent > 0 && <Progress className='App-progress'
                                          style={{
                                              margin: '1rem auto'
                                          }}
                                          percent={Math.round(percent)} indicating progress autoSuccess/>}

                <div className='swear-container'>
                    <SwearList items={items}/>
                </div>


                <Confirm
                    open={confirm.open}
                    header='确认写入 (需要20-30秒)'
                    content= {
                        <Container style={{padding: 20}}>
                            <h5>{inputMsg}</h5>
                            <br/>
                            <Input type='text' placeholder='怎么称呼? （选填）' value={confirm.name}
                                   onChange={(e) => this.setState({confirm: {open: true, name: e.target.value}})}/>
                        </Container>
                    }
                    cancelButton='容朕三思'
                    confirmButton="开始写入"
                    onCancel={() => {
                        this.setState({confirm: {open: false}})
                    }}
                    onConfirm={() => {
                        let name = this.state.confirm.name || '';
                        console.log(name);

                        this.publishSwear(this.state.inputMsg, name);

                        this.setState({confirm: {open: false}});
                    }}
                />

                <ModalView modalOpen={modal.modalOpen} header={modal.header} content={modal.content}
                           onClose={() => this.setState({modal: {modalOpen: false}})}/>
            </Container>
        );
    }
}

export default App;
