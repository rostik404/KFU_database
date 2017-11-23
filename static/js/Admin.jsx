const axios = require('axios');
import React from 'react';
import ReactDOM from 'react-dom';
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
import { browserHistory } from 'react-router';
import NotificationSystem from 'react-notification-system';
import Films from './films';

export default class RegForm extends React.Component {
    constructor(props) {
        super(props);

        this._close = this._close.bind(this);
        this._open = this._open.bind(this);
        this.submitFilm = this.submitFilm.bind(this);
        this._getComponentValue = this._getComponentValue.bind(this);
        this.onChange = this.onChange.bind(this);
        this._renderForm = this._renderForm.bind(this);
        this._handleDirector = this._handleDirector.bind(this);
        this.onTargetSelect = this.onTargetSelect.bind(this);
        this._setChangeFilm = this._setChangeFilm.bind(this);
        this._renderFields = this._renderFields.bind(this);
        this.state = {directorId: 1};
    }

    getInitialState() {
        return { showModal: false, isAdmin: false };
    }

    _close() {
        this.setState({ showModal: false });
        this.setState({ change: false });
        this.setState({ director: '' });
    }

    _open() {
        this.setState({ showModal: true });
    }

    _setChangeFilm(film) {
        console.log('!!!!', film);
        this.state.change = film;
    }

    componentDidMount() {
        return Promise.all([axios.get('/is_admin'), axios.get('/get/directors')])
            .then((res) => {
                this.setState({isAdmin: res[0].data && res[0].data.isAdmin })
                this.setState({directors: res[1].data})
            });
    }

    render() {
        if (this.state && this.state.isAdmin) {
            return this._renderAdminPage()
        } else if (this.state && !this.state.isAdmin){
            return <div>YOU ARE NOT ALLOWED FOR THIS PAGE</div>
        }
        return <div>Loading...</div>;
    }

    _handleDirector(e) {
        console.log('EEE', e);
        this.setState({director: e.target.value});
    }

    onTargetSelect(e) {
        console.log('SELECT', e);
        this.setState({directorId: e});
        this.setState({director: this.state.directors[e - 1].name});
    }

    _renderAdminPage() {
        const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
        const title = this.state && this.state.change
            ? 'Редактировать фильм'
            : 'Добавить фильм';
        return (
            <div>
                <div className="well" style={wellStyles}>
                    <Button bsStyle="success" bsSize="large" block onClick={this._open}> + Добавить фильм</Button>
                </div>
                <Films isAdmin={true} open={this._open} change={this._setChangeFilm}/>
                <Modal show={this.state.showModal} onHide={this._close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this._renderForm()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    _renderForm() {
        const items = [
            {
                title: 'Название',
                ref: 'title'
            },
            {
                title: 'Год',
                ref: 'year'
            },
            {
                title: 'Жанр',
                ref: 'genre'
            }
        ]
        const directors = this.state && this.state.directors && this.state.directors.map((d) => <MenuItem eventKey={d.id}>{d.name}</MenuItem>)

        return <Form horizontal method='POST' onSubmit={this.submitFilm} ref='form'>
            {this._renderFields(items, this.state.change)}
            <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
                Режиссер
            </Col>
            <Col sm={10}>
                <InputGroup>
                        <FormControl type="text" ref="director" value={this.state.director
                            || this.state.change && this.state.change.director || ''} onChange={this._handleDirector} />

                    <DropdownButton
                        componentClass={InputGroup.Button}
                        id="input-dropdown-addon"
                        title='Выбрать...'
                        onSelect={this.onTargetSelect}
                    >
                    {directors}
                    </DropdownButton>
                </InputGroup>
            </Col>
            </FormGroup>
            <input type="file" onChange={this.onChange} />
            <FormGroup>
                <Col smOffset={2} sm={10}>
                    <Button type="submit">
                        Отправить
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    }

    _renderFields(items, film) {
        return items.map(function (i) {
            return (
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                        {i.title}
                    </Col>
                    <Col sm={10}>
                        <FormControl defaultValue={film && film[i.ref] || ''} placeholder={i.title} ref={i.ref} />
                    </Col>
                </FormGroup>
            )
        });
    }

    submitFilm(event) {
        event.preventDefault();

        const config = {
            headers: {'content-type': 'multipart/form-data'}
        }

        const fd = this.getFromData(['title', 'year', 'director', 'genre']);
        fd.append('file', this.state.file)
        const url = this.state && this.state.change ? '/update/film' : '/add/film';
        console.log('######', url);
        return axios.post(url, fd, config)
            .then(() => {
                this._close();
                this.state.file = undefined;
                this.state.director = undefined;
                this.state.directorId = 1;
                this.componentDidMount();
                browserHistory.push('/admin')
            });
    }

    getFromData(fields) {
        const fd = new FormData()
        fields.forEach((f) => fd.append(f, this._getComponentValue(f)));
        fd.append('directorId', this.state.directorId);
        this.state && this.state.change && fd.append('id', this.state.change.id);
        return fd;
    }

    _getComponentValue(cmpTitle) {
        return ReactDOM.findDOMNode(this.refs[cmpTitle]).value;
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }
}
