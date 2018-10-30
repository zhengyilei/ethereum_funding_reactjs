import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default class ModalView extends Component {


    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const {modalOpen, header, content} = this.props;
        return (
            <Modal
                open={modalOpen}
                onClose={this.handleClose}
                basic
                size='small' >

                <Header icon='paper plane' content={header} />
                <Modal.Content>
                    {content}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={this.handleClose} inverted>
                        <Icon name='checkmark' /> 好哒
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
