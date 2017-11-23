import React from 'react';
import {Route, Router, hashHistory} from 'react-router'
import {Link} from 'react-router'
import NavBar from './navbar';
import Films from './films';
import {
    PageHeader,
    FormGroup,
    Form,
    Col,
    Checkbox,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Label,
    Modal,
    Input,
    InputGroup,
    DropdownButton,
    MenuItem
} from 'react-bootstrap';

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {filterField: 'title'};
        this.onTargetSelect = this.onTargetSelect.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.filterFilm = this.filterFilm.bind(this);
    }

    onTargetSelect(e) {
        this.setState({filterField: e});
    }

    handleSearchChange(e) {
        this.setState({filterQuery: e.target.value});
    }

    filterFilm(event) {
        event.preventDefault();
    }

    render() {
        const dict = {
            'title': 'Название',
            'year': 'Год',
            'director': 'Режиссер',
            'genre': 'Жанр'
        };
        let mainForm = (
            <Form horizontal method='POST' onSubmit={this.filterFilm} ref='form'>
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text" onChange={this.handleSearchChange}/>

                        <DropdownButton
                            componentClass={InputGroup.Button}
                            id="input-dropdown-addon"
                            title={dict[this.state.filterField]}
                            onSelect={this.onTargetSelect}
                        >
                            <MenuItem eventKey="title" >Название</MenuItem>
                            <MenuItem eventKey="year" >Год</MenuItem>
                            <MenuItem eventKey="director" >Режиссер</MenuItem>
                            <MenuItem eventKey="genre">Жанр</MenuItem>
                        </DropdownButton>
                    </InputGroup>
                </FormGroup>
            </Form>
        )

        return (
            <div>
                {mainForm}
                <Films
                    filterField={this.state && this.state.filterField}
                    filterQuery={this.state && this.state.filterQuery}
                />
            </div>
        )
    }
}
