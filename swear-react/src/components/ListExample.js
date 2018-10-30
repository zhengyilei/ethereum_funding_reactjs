import React from 'react'
import { Image, List } from 'semantic-ui-react'

const ListExampleSelection = () => (
    <List selection verticalAlign='middle'>
        <List.Item>
            <Image avatar src='https://avatars0.githubusercontent.com/u/4375208?s=460&v=4' />
            <List.Content>
                <List.Header>Helen</List.Header>
            </List.Content>
        </List.Item>
        <List.Item>
            <Image avatar src='https://avatars0.githubusercontent.com/u/4375208?s=460&v=4' />
            <List.Content>
                <List.Header>Christian</List.Header>
            </List.Content>
        </List.Item>
        <List.Item>
            <Image avatar src='https://avatars0.githubusercontent.com/u/4375208?s=460&v=4' />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
        </List.Item>
    </List>
)

export default ListExampleSelection